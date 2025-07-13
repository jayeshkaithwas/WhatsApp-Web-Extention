// import * as impactHeroModule from './impact-hero/impact_hero_background.js';
// impactHeroModule.initialize();
chrome.runtime.onInstalled.addListener((async function (e) {
    send_notification("WA Sender is installed", '');
    fetchCountryInfo();
    
    // Check if there is an open WhatsApp Web tab
    chrome.tabs.query({ url: "*://web.whatsapp.com/*" }, function (tabs) {
        if (tabs.length > 0) {
            // If WhatsApp Web is already open, activate that tab and reload it
            chrome.tabs.update(tabs[0].id, { active: true }, function () {
                chrome.tabs.reload(tabs[0].id);
            });
        } else {
            // Else open a new WhatsApp Web tab
            chrome.tabs.create({ url: "https://web.whatsapp.com/" });
        }
    });
}));

chrome.runtime.setUninstallURL("");

function messageListner() {
    chrome.runtime.onMessage.addListener(listner);
}

function listner(request, sender, sendResponse) {
    if (request.type === 'send_notification')
        send_notification(request.title, request.message);
}

function send_notification(title, message = '') {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '../logo/large.png',
        title: title,
        message: message
    });
}

function bcdinit() {
    messageListner();
    chrome.identity.getProfileUserInfo(function (userinfo) {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.email) {
                sendResponse({ email: userinfo.email })
            }
        });
    });
}

async function fetchCountryInfo() {
    let default_country_info = { name: 'India', name_code: 'IN', dial_code: '91', currency: 'INR', default: true };
    let default_location_info = { name: 'international', name_code: "US", currency: "USD", default: true };
    
    let current_country_info = await new Promise((resolve, reject) => {
        fetch('https://get.geojs.io/v1/ip/geo.json')
            .then((res) => res.json())
            .then((data) =>
                resolve({ 
                    name: data.country,
                    name_code: data.country_code,
                    dial_code: countryToDialCode[data.country_code],
                    currency: countryToCurrency[data.country_code],
                    city: data.city,
                    region: data.region,
                    country: data.country,
                    default: false
                })
            )
            .catch(() =>
                resolve(null)
            );
    }); 

    // country_info: used in popup js for country code selector
    // location_info: used in content js for contry wise pricing 
    if(current_country_info === null) {
        chrome.storage.local.set({ country_info: default_country_info, location_info: default_location_info });
    } else {
        chrome.storage.local.set({ country_info: current_country_info, location_info: current_country_info });
    }
}

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    try {
        if (tab.url && tab.url.includes("web.whatsapp.com")) {
            if (changeInfo.status === 'loading') {
                chrome.storage.session.remove('whatsapp_session', () => {
                    console.log('WhatsApp session cleared on tab reload.');
                });
            }
        }
    } catch (error) {
        console.error("Error getting tab info:", error);
    }
});

bcdinit();
