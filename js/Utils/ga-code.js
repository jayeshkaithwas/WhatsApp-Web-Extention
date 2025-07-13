class Analytics {
    constructor(debug = false) {
        this.debug = debug;
    }

    async getOrCreateClientId() {
        let { clientId } = await chrome.storage.local.get('clientId');
        if (!clientId) {
            clientId = self.crypto.randomUUID();
            await chrome.storage.local.set({ clientId });
        }
        return clientId;
    }

    async getOrCreateSessionId() {
        let { sessionData } = await chrome.storage.session.get('sessionData');
        const currentTimeInMs = Date.now();
        if (sessionData && sessionData.timestamp) {
            const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
            if (durationInMin > GA_CONFIG.SESSION_EXPIRATION_IN_MIN) {
                sessionData = null;
            } else {
                sessionData.timestamp = currentTimeInMs;
                await chrome.storage.session.set({ sessionData });
            }
        }
        if (!sessionData) {
            sessionData = {
                session_id: currentTimeInMs.toString(),
                timestamp: currentTimeInMs.toString()
            };
            await chrome.storage.session.set({ sessionData });
        }
        return sessionData.session_id;
    }

    async fireEvent(name, params = {}) {
        if (!params.session_id) {
            params.session_id = await this.getOrCreateSessionId();
        }
        if (!params.engagement_time_msec) {
            params.engagement_time_msec = GA_CONFIG.DEFAULT_ENGAGEMENT_TIME_MSEC;
        }

        try {
            const response = await fetch(
                `${this.debug ? GA_CONFIG.GA_DEBUG_ENDPOINT : GA_CONFIG.GA_ENDPOINT
                }?measurement_id=${GA_CONFIG.MEASUREMENT_ID}&api_secret=${GA_CONFIG.API_SECRET}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        client_id: await this.getOrCreateClientId(),
                        events: [
                            {
                                name,
                                params
                            }
                        ]
                    })
                }
            );
            if (!this.debug) {
                return;
            }
            console.log(await response.text());
        } catch (e) {
            console.error('Google Analytics request failed with an exception', e);
        }
    }

    // Track events
    trackEvent(eventName, eventData = {}) {
        eventName = 'pro_' + eventName;
        this.fireEvent(eventName, { ...eventData });

        if (eventData && eventData?.natural_interaction) {
            this.trackSessionEvent(eventName, eventData);
            this.trackDayEvent(eventName, eventData);
            this.fireEvent('pro_natural_interaction_total', { ...eventData });
        }
    }

    async trackSessionEvent(eventName, eventData) {
        let { whatsapp_session } = await chrome.storage.session.get('whatsapp_session');
        eventData.event_name = eventName;

        if (!whatsapp_session) {
            whatsapp_session = { sessionId: Date.now().toString(), events: [] };
            this.fireEvent('pro_natural_interaction_unique', { ...eventData });
        }
        if (!whatsapp_session.events.includes(eventName)) {
            whatsapp_session.events.push(eventName);
            this.fireEvent(`${eventName}_unique`, { ...eventData });
            this.fireEvent('pro_natural_interaction_feature_unique', { ...eventData });
        }

        await chrome.storage.session.set({ whatsapp_session });
    }

    async trackDayEvent(eventName, eventData) {
        const currentDate = new Date().toISOString().split('T')[0];
        let { day_session } = await chrome.storage.local.get('day_session');
        eventData.event_name = eventName;

        if (!day_session || day_session.date !== currentDate) {
            day_session = { date: currentDate, events: [] };
            this.fireEvent('pro_natural_interaction_day_unique', { ...eventData });
        }
        if (!day_session.events.includes(eventName)) {
            day_session.events.push(eventName);
            this.fireEvent(`${eventName}_day_unique`, { ...eventData });
            this.fireEvent('pro_natural_interaction_feature_day_unique', { ...eventData });
        }

        await chrome.storage.local.set({ day_session });
    }
}

const GoogleAnalytics = new Analytics();