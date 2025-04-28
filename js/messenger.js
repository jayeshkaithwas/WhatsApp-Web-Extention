var resolveSendMessageToNumber, rejectSendMessageToNumber, resolveSendMessageToGroup, resolveSendAttachmentsToNumber, resolveSendAttachmentsToGroup, campaignRunningIndex = null,
	stop = !1,
	pause = !1;
async function messenger(e, t, n, a, s, r, i, o, c, l, m, p, u, d, g = null)
{
	trackEvent("time_gap", n), trackEvent("batch_size", o), trackEvent("random_delay", i), trackEvent("batch_gap", c);
	let h = initializeReport(m, u),
		_ = d || 0,
		v = p || 0,
		f = s ? await setMessages(t, a, "text", e.length) : Array(e.length).fill(t),
		y = isCaptionCustomisation(l, a) ? await setCaptions(l, a) : Array(e.length).fill(l),
		b = g || await getAttachmentsData(),
		w = {
			numbers: e,
			message: t,
			caption: l,
			time_gap: n,
			random_delay: i,
			batch_size: o,
			batch_gap: c,
			csv_data: a,
			customization: s,
			caption_customization: r,
			campaign_type: m
		};
	await saveCampaignState(0, !1, w, h, _);
	let
	{
		report_rows: C,
		sent_count: N,
		total_time: E
	} = await executeCampaign(e, f, y, b, v, h, _, w), T = {
		rows: C,
		start_time: (new Date).getTime(),
		total_time: E,
		time_gap: n,
		campaign_type: m,
		sent_count: N
	};
	await updateDeliveryReports(e, t, T, pause), campaignRunningIndex = null, chrome.runtime.sendMessage(
	{
		type: "send_notification",
		title: "Your messages are sent",
		message: "Open the extension to download the report"
	});
	var x = document.getElementsByClassName("messanger_popup")[0];
	if (x)
	{
		x.style.display = "none";
		let e = parseInt(localStorage.getItem("rcount")) || 0,
			t = parseInt(localStorage.getItem("rvisited")) || 0;
		e++, e >= 3 && (t || callIfNoOtherPopups(review_popup), e = 0), localStorage.setItem("rcount", e)
	}
	b.length > 0 && chrome.storage.local.get(["premiumUsageObject"], (function (e)
	{
		if (void 0 !== e.premiumUsageObject)
		{
			let t = {
				...e.premiumUsageObject,
				attachment: !0
			};
			b.length > 1 && (t = {
				...t,
				multipleAttachment: !0
			}), chrome.storage.local.set(
			{
				premiumUsageObject: t
			})
		}
	}))
}
async function executeCampaign(e, t, n, a, s, r, i, o)
{
	let c,
		{
			time_gap: l,
			random_delay: m,
			batch_size: p,
			batch_gap: u,
			campaign_type: d
		} = o,
		g = 0,
		h = [],
		_ = e.length;
	for (let t = 0; t < e.length; t++)
	{
		let e = getTimeGap(t, p, l, m, u);
		g += e, h.push(e)
	}
	c = g, messanger_popup(), checkTipsInterval();
	for (let l = s; l < _; l++)
	{
		if (triggerEscape(), campaignRunningIndex = l, stop)
		{
			stop = !1;
			break
		}
		if (pause)
		{
			await saveCampaignState(l, !0, o, r, i), pause = !1;
			break
		}
		let s = d.includes("number") ? e[l].replace(/\D/g, "") : "",
			m = d.includes("group") ? e[l] : "",
			p = t.length >= l ? t[l] : "",
			u = n.length >= l ? n[l] : "",
			N = h.length >= l ? 1e3 * Math.max(1, h[l] - 1) : 3e4,
			E = d.includes("group") ? groupIdToName[m] : s;
		c -= h[l], await updateMessengerProgressBar(E, l, _, c, g), await delay(N);
		let T = RUNTIME_CONFIG.useOldMessageSending ? p : "";
		if (!s || await openNumber(s, T)) var
		{
			is_message_sent: v,
			comments: f,
			error: y
		} = await handleMessageSend(s, m, p),
		{
			is_attachments_sent: b,
			comments: w,
			error: C
		} = await handleAttachmentsSend(s, m, a, u, v);
		else var v = p ? "NO" : "-",
			b = a && a.length > 0 ? "NO" : "-",
			f = "Invalid Number; Tip: Please ensure that your number exists on WhatsApp!",
			w = "";
		let x = [f, w].filter((e => e.length > 0)).join(" ; ");
		0 == x.length && (x = "-", i++);
		let S = [y ? String(y) : "", C ? String(C) : ""].filter((e => e.length > 0)).join(" ; ");
		0 == S.length && (S = "-"), r.push([E, v, b, x, S])
	}
	return clearInterval(tipsIntervalID),
	{
		report_rows: r,
		sent_count: i,
		total_time: g
	}
}
async function handleMessageSend(e, t, n)
{
	return n ? e ? RUNTIME_CONFIG.useOldMessageSending ? await sendMessageToNumber(e, n) : await sendMessageToNumberNew(e, n) : t ? await sendMessageToGroup(t, n) : void 0 :
	{
		is_message_sent: "-",
		comments: ""
	}
}
async function sendMessageToNumber(e, t)
{
	try
	{
		return new Promise(((e, t) =>
		{
			setTimeout((() =>
			{
				let t = getDocumentElement("send_message_btn");
				t ? (t.click(), e(
				{
					is_message_sent: "YES",
					comments: ""
				})) : e(
				{
					is_message_sent: "NO",
					comments: "Issue with the number",
					error: "Send button is not found"
				})
			}), 1e3)
		}))
	}
	catch (e)
	{
		return console.error("ERROR :: sendMessageToNumber :: " + e), trackError("send_message_error", e),
		{
			is_message_sent: "NO",
			comments: "Error while sending message to number",
			error: e
		}
	}
}
async function sendMessageToNumberNew(e, t)
{
	try
	{
		let n = getCurrentChatNumber();
		return e = n || e, new Promise(((n, a) =>
		{
			resolveSendMessageToNumber = n, rejectSendMessageToNumber = async e =>
			{
				trackError("send_message_new_error", e.error), pasteMessage(t), n(await sendMessageToNumber())
			}, window.dispatchEvent(new CustomEvent("PROSS::send-message",
			{
				detail:
				{
					number: e,
					message: t
				}
			}))
		}))
	}
	catch (e)
	{
		return console.error("ERROR :: sendMessageToNumber :: " + e), trackError("send_message_error", e),
		{
			is_message_sent: "NO",
			comments: "Error while sending message to number",
			error: e
		}
	}
}
async function sendMessageToGroup(e, t)
{
	try
	{
		return new Promise(((n, a) =>
		{
			resolveSendMessageToGroup = n, window.dispatchEvent(new CustomEvent("PROSS::send-message-to-group",
			{
				detail:
				{
					group_id: e,
					message: t
				}
			}))
		}))
	}
	catch (e)
	{
		return console.error("ERROR :: sendMessageToGroup :: " + e), trackError("send_message_to_group_error", e),
		{
			is_message_sent: "NO",
			comments: "Error while sending the message to group",
			error: e
		}
	}
}
async function handleAttachmentsSend(e, t, n, a, s)
{
	return "NO" === s ?
	{
		is_attachments_sent: "NO",
		comments: ""
	} : n && n.length > 0 ? e ? await sendAttachmentsToNumber(e, n, a) : t ? await sendAttachmentsToGroup(t, n, a) : void 0 :
	{
		is_attachments_sent: "-",
		comments: ""
	}
}
async function sendAttachmentsToNumber(e, t, n)
{
	try
	{
		let a = getCurrentChatNumber();
		return e = a || e, new Promise(((a, s) =>
		{
			resolveSendAttachmentsToNumber = a, window.dispatchEvent(new CustomEvent("PROSS::send-attachments",
			{
				detail:
				{
					number: e,
					attachments: t,
					caption: n
				}
			}))
		}))
	}
	catch (e)
	{
		return console.error("ERROR :: sendAttachmentsToNumber :: " + e), trackError("send_attachments_error", e),
		{
			is_attachments_sent: "NO",
			comments: "Error while sending the attachments to number",
			error: e
		}
	}
}
async function sendAttachmentsToGroup(e, t, n)
{
	try
	{
		return await new Promise(((a, s) =>
		{
			resolveSendAttachmentsToGroup = a, window.dispatchEvent(new CustomEvent("PROSS::send-attachments-to-group",
			{
				detail:
				{
					attachments: t,
					caption: n,
					groupId: e
				}
			}))
		}))
	}
	catch (e)
	{
		return console.error("ERROR :: sendAttachmentsToGroup :: " + e), trackError("send_attachments_to_group_error", e),
		{
			is_attachments_sent: "NO",
			comments: "Error while sending the attachments to group",
			error: e
		}
	}
}
async function openNumber(e, t = "", n = 1)
{
	try
	{
		await openNumberTab(e, t);
		const a = await hasChatOpened();
		if (a) await delay(1e3 * n);
		else
		{
			const e = getDocumentElement("invalid_popup_ok_btn");
			e && (e.click(), document.querySelector(".invalid_number_error").style.display = "grid", document.querySelector(".currently_sending_number").style.color = "#D13B3B", await delay(2e3))
		}
		return a
	}
	catch (e)
	{
		return console.error("ERROR :: openNumber :: ", e), trackError("open_number_error", e), !1
	}
}
async function openNumberTab(e, t)
{
	const n = t ? encodeURIComponent(t) : "",
		a = `https://api.whatsapp.com/send?phone=${e}${n?`&text=${n}`:""}`;
	let s = document.getElementById("whatsapp-message-sender");
	s || (s = document.createElement("a"), s.id = "whatsapp-message-sender", document.body.append(s)), s.setAttribute("href", a), s.click()
}
async function hasChatOpened()
{
	return new Promise(((e, t) =>
	{
		let n = !1,
			a = 0,
			s = setInterval((() =>
			{
				a += 100;
				const t = getDocumentElement("starting_chat_popup"),
					r = getDocumentElement("invalid_chat_popup");
				(t || a >= 500) && (n = !0), n && (r || a >= 1e4 ? (clearInterval(s), e(!1)) : t || (clearInterval(s), e(!0)))
			}), 100)
	}))
}

function getCurrentChatNumber()
{
	try
	{
		let e = getDocumentElement("conversation_message_div"),
			t = null;
		if (e)
		{
			let n = e.dataset.id.split("_")[1].split("@c.us")[0];
			n.length > 10 && (t = n)
		}
		return t
	}
	catch (e)
	{
		return console.error("ERROR :: getCurrentChatNumber :: " + e), null
	}
}

function stopCampaign()
{
	isPremiumFeatureAvailable() ? (stop = !0, trackButtonClick("stop"), cancelDelay()) : premium_reminder("stop_campaign", "Premium"), chrome.storage.local.get(["premiumUsageObject"], (function (e)
	{
		if (void 0 !== e.premiumUsageObject)
		{
			let t = {
				...e.premiumUsageObject,
				stop: !0
			};
			chrome.storage.local.set(
			{
				premiumUsageObject: t
			})
		}
	}))
}

function pauseCampaign()
{
	isAdvanceFeatureAvailable() ? (pause = !0, trackButtonClick("pause_button_clicked"), cancelDelay()) : premium_reminder("pause_campaign", "Advance")
}

function isCaptionCustomisation(e, t)
{
	if (0 == t.length) return !1;
	const n = /\{\{([^}]+)\}\}/g,
		a = [];
	let s;
	for (; null !== (s = n.exec(e));) a.push(s[1].trim());
	for (var r = 0; r < t[0].length; r++)
	{
		if (hasLeadingOrTrailingSpaces(t[0][r])) i = t[0][r].trim();
		else var i = t[0][r];
		if (a.includes(i)) return !0
	}
	return !1
}
async function setCaptions(e, t)
{
	let n, a = e,
		s = [];
	for (let e = 0; e < a.length; e++) n = await setMessages([a[e]], t, "caption"), s.push(n);
	return finalArr = transposeArray(s), finalArr
}
async function setMessages(e, t, n, a)
{
	if ("text" == n && 0 == t.length)
	{
		let t = [];
		for (let n = 0; n < a; n++) t.push(e);
		return t
	}
	for (var s = [], r = 1; r < t.length; r++)
	{
		if ("caption" == n) var i = e[0];
		else i = e;
		for (var o = 0; o < t[0].length; o++)
		{
			if (hasLeadingOrTrailingSpaces(t[0][o])) c = t[0][o].trim();
			else var c = t[0][o];
			var l = t[r][o];
			i.includes("{{" + c + "}}") && (i = i.replaceAll("{{" + c + "}}", l))
		}
		s.push(i)
	}
	return s
}
async function messanger_popup()
{
	var e = document.getElementsByClassName("messanger_popup")[0];
	if (e) e.style.display = "block";
	else
	{
		var t = document.createElement("div");
		t.className = "messanger_popup";
		var n = document.createElement("div");
		n.className = "message_being_sent";
		var a = document.createElement("div");
		a.className = "did_you_know";
		var s = document.createElement("img");
		s.className = "campaign_help_logo", s.src = help_icon_src, a.appendChild(s);
		var r = document.createElement("div");
		r.className = "messanger_popup_content", n.appendChild(r), r.appendChild($($.parseHTML(`<div class="popup_text_title"><img style="width: 25px; height: 25px;" src=${email_icon_src}></img><p id="message_sending_popup_title" style="margin-left: 15px; font-weight: 700; font-size: 16px; line-height: 20.7px; align-items: center; ">Your messages are being sent</p></div>`))[0]), r.appendChild($($.parseHTML('<div class="messanger_time_bar_outline"><div class="messanger_time_bar" ></div></div>'))[0]), r.appendChild($($.parseHTML('<div class="messanger_sending"></div>'))[0]);
		let e = document.createElement("div");
		if (e.className = "campaign_buttons", e.innerHTML = `\n            <div class="pause_campaign_button CtaBtn">\n                <div class="pause_campaign_image">\n                    <img src=${pause_icon_src} alt="" />\n                </div>\n                <p class="text">Pause Campaign</p>\n            </div>\n            <div class="stop_campaign_button CtaBtn">\n                <div class="circle"></div><p class="text">Stop Campaign</p>\n            </div>\n        `, r.appendChild(e), !isPremiumFeatureAvailable())
		{
			let
			{
				name: e,
				name_code: t,
				currency: n
			} = location_info;
			e = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(t) ? COUNTRY_WITH_SPECIFIC_PRICING[t] : "international";
			let a = '"';
			"Basic" == last_plan_type ? pricing_link = `"` : "Advance" == last_plan_type && (pricing_link = `"`);
			let s = document.createElement("div");
			s.className = "time_gap_reminder_div", s.innerHTML = `<div class="circle">30</div><p class="text" id="time_gap_reminder_text">Time Gap between messages is 30 sec. Purchase <a href="${a}" target="_blank" class="styled_text"> Premium </a> to reduce time gap between messages.</p>`, r.appendChild(s)
		}
		t.appendChild(n), t.appendChild(a), document.querySelector("body").appendChild(t), r.appendChild($($.parseHTML('<span id="close_edit1" style="position: absolute;top: 12px;right: 12px;font-size: 20px;width:14px"><img class="CtaCloseBtn" src="' + close_img_src + '" style="width: 100%;" alt="x"></span>'))[0]), document.getElementById("close_edit1").addEventListener("click", (function (e)
		{
			document.getElementsByClassName("messanger_popup")[0].style.display = "none"
		})), document.querySelector(".stop_campaign_button").addEventListener("click", stopCampaign), document.querySelector(".pause_campaign_button")?.addEventListener("click", pauseCampaign), loadTips()
	}
	document.getElementById("message_sending_popup_title").innerText = await translate("Your messages are being sent")
}
async function updateMessengerProgressBar(e, t, n, a, s)
{
	let r = document.getElementsByClassName("messanger_sending")[0];
	if (r)
	{
		r.innerHTML = "";
		let a = `<div style="margin: auto;display: flex; width: 100%; align-items: center; justify-content: center; font-weight: 400; font-size: 12px; line-height: 15.53px">Currently sending to :  <strong style="padding: 0px 12px;" class="currently_sending_number">${e}</strong>  ( ${t+1} of ${n} )</div>`,
			s = `<div class="invalid_number_error" style="display: none;"><img src=${error_icon_src} style="width: 17px; height: 17px"/><p class="text"><span style="font-weight: 700;">Invalid number</span> : <span>${await translate("Please check the delivery report after the campaign ends.")}</span></p></div>`;
		r.appendChild($($.parseHTML(a))[0]), r.appendChild($($.parseHTML(s))[0])
	}
	let i = document.getElementsByClassName("messanger_time_bar")[0];
	if (i)
	{
		i.innerHTML = "";
		let e = 0 == t ? 0 : 100 * (1 - a / s),
			n = Math.floor(a / 3600),
			r = Math.ceil(a / 60) % 60,
			o = `<div style="width: 400px;color: #fff;position: absolute;text-align: center;font-weight: normal;font-size: 12px;padding: 4px;">${"Approx. "+(n>0?n+(n>1?" hours ":" hour "):"")+r+(r>1?" minutes ":" minute ")+"remaining"}</div>`,
			c = `<div style="width: ${e}%;background: #357A71;height: 100%;border-radius: 16px;"></div>`;
		i.appendChild($($.parseHTML(o))[0]), i.appendChild($($.parseHTML(c))[0])
	}
}

function loadTips()
{
	chrome.storage.local.get(["ptc852"], (async e =>
	{
		let t = e.ptc852,
			n = await translate("Did you know?"),
			a = await translate(DID_YOU_KNOW_TIPS[t]),
			s = document.createElement("div");
		s.style.color = "#fff", s.innerHTML = `<strong class='did_you_know_text' style='color: #fff;'>${n}</strong><span>${a}</span>`, s.className = "messanger_popup_tips", document.querySelector(".did_you_know").appendChild(s)
	}))
}
window.addEventListener("beforeunload", (function (e)
{
	try
	{
		if (chrome.storage.local.get(["scheduled_campaigns"], (async function (e)
			{
				let t = e.scheduled_campaigns || [];
				for (let e = 0; e < t.length; e++) t[e].hasBeenScheduled = !1;
				chrome.storage.local.set(
				{
					scheduled_campaigns: t
				})
			})), null !== campaignRunningIndex)
		{
			let e = {
				isCampaignRunning: !0,
				index: campaignRunningIndex
			};
			chrome.storage.local.set(
			{
				resumeCampaign: e
			})
		}
	}
	catch (e)
	{
	//	console.error("Error :: onEvent :: beforeunload :: ", e)
	}
}));
let tipsIntervalID = "";

function checkTipsInterval()
{
	clearInterval(tipsIntervalID), "" == tipsIntervalID && updateTipsCount()
}

function updateTipsCount()
{
	tipsIntervalID = setInterval((() =>
	{
		chrome.storage.local.get(["ptc852"], (async e =>
		{
			let t = (e.ptc852 + 1) % 6,
				n = document.querySelector(".messanger_popup");
			if (n && "none" != n.style.display)
			{
				let e = await translate("Did you know?"),
					n = await translate(DID_YOU_KNOW_TIPS[t]);
				document.querySelector(".messanger_popup_tips").innerHTML = `<strong class='did_you_know_text' style='color: #fff;'>${e}</strong><span>${n}</span>`, chrome.storage.local.set(
				{
					ptc852: t
				})
			}
		}))
	}), 15e3)
}
async function updateDeliveryReports(e, t, n, a)
{
	let [s, r, i] = await new Promise((e =>
	{
		chrome.storage.local.get(["deliveryReports", "campaigns", "templates"], (t =>
		{
			let n = t.deliveryReports || [],
				a = t.campaigns || [],
				s = t.templates || [];
			e([n, a, s])
		}))
	}));
	s.length >= 10 && s.shift(1);
	let [o, c] = await new Promise((n =>
	{
		let a = null,
			s = null,
			o = e.join(",");
		r.forEach((e =>
		{
			e.numbers == o && (a = e.name)
		})), i.forEach((e =>
		{
			e.message == t && (s = e.name)
		})), n([a, s])
	})),
	{
		rows: l,
		start_time: m,
		campaign_type: p,
		sent_count: u,
		total_time: d,
		time_gap: g
	} = n,
	{
		msg_for_popup: h,
		msg_for_report: _,
		time_saved: v
	} = calc_time_saved(e.length, g), f = [
		["Last Run", new Date(m).toLocaleString("en-IN").replace(",", " ").toLocaleUpperCase()],
		["Campaign Name", o || "Campaign " + (s.length + 1)],
		["Campaign Type", p],
		["Template Name", c || "-"],
		["Overall Report", `${u} sent out of ${e.length}`],
		[_, v]
	], y = Array(l[0].length).fill(""), b = l.length;
	for (let e = 0; e < f.length; e++)
	{
		let t = ["", "", ...f[e]];
		e < b ? l[e].push(...t) : l.push([...y, ...t])
	}
	let w = "data:text/csv;charset=utf-8," + l.map((e => e.join(","))).join("\n");
	s.push(
	{
		name: o,
		date: m,
		data: w
	}), await chrome.storage.local.set(
	{
		deliveryReports: s
	}), campaign_end_popup(s, u, e.length, d, g, a), trackEvent("campaign_end", u)
}
async function campaign_end_popup(e, t, n, a, s, r)
{
	a = Math.ceil(a / 60);
	let i = e[e.length - 1],
		{
			msg_for_popup: o,
			msg_for_report: c,
			time_saved: l
		} = calc_time_saved(n, s),
		m = encodeURI(i.data),
		p = getReportDateFormat(i.date, !0),
		u = `${i.name||"Campaign "+e.length} ${p}.csv`;
	const d = `\n    <div class='message_send_div'>\n        <div class='message_send_text' style='color: #fff'>\n            <img style='width: 50px; height: 50px' src=${read_icon_src}></img>\n            <p style='font-weight: 700; font-size: 20px; line-height: 25.88px'>\n                ${await translate("Your campaign is completed")}\n            </p>\n        </div>\n        <span id="report_download_edit" style="position: absolute;top: 12px;right: 12px;font-size: 20px;width:14px; z-index: 1000"><img class="CtaCloseBtn" src=${close_img_src} style="width: 100%;" alt="x"></span>\n    </div>\n    <div class='campaign_info_div'>\n        <div style='display: flex; margin: 0 auto'>\n            <div class='campaign_info'>\n                <div class='campaign_info_text'>\n                    <p><span class='campaign_name'>Campaign ${e.length}</span> : Sent to <span class='numbers_message_sent_to num_of_numbers'>${t}</span> numbers out of   <span class='total_numbers num_of_numbers'>${n}</span></p>\n                    <p>${await translate("Approximate time taken")} : <span class='approx_time num_of_numbers'>${a}</span> ${a>1?"minutes":"minute"}</p>\n                </div>\n                <div class='download_campaign_report'>\n                    <p>${await translate("Check our new delivery report")} :  </p>\n                    <a class='download_report_button CtaBtn' href=${m} download="${u}">\n                        Download Delivery Report\n                    </a>\n                </div>\n            </div>\n            <div class='time_saved_div'>\n                <div class='time_saved_circle'>\n                    <p class='time_saved'>${l}</p>\n                    <p class='time_saved_text' style='text-align: center'>\n                        ${await translate(o)}\n                    </p>\n                </div>\n            </div>\n        </div>\n    </div>\n    `,
		g = document.createElement("div");
	g.className = "campaign-end trial_popup", g.innerHTML = d, document.body.appendChild(g), document.querySelector(".download_report_button").addEventListener("click", (() =>
	{
		trackButtonClick("download_delivery_report_button")
	}));
	document.getElementById("report_download_edit").addEventListener("click", (() =>
	{
		document.querySelector(".campaign-end").remove()
	})), chrome.storage.local.get(["campaignNumber"], (function (e)
	{
		null != e.campaignNumber && null != e.campaignNumber && e.campaignNumber ? chrome.storage.local.set(
		{
			campaignNumber: e.campaignNumber + 1
		}) : chrome.storage.local.set(
		{
			campaignNumber: 1
		})
	})), r && (e.pop(), chrome.storage.local.set(
	{
		deliveryReports: e
	}))
}

function getReportDateFormat(e, t = !1)
{
	const n = new Date,
		a = new Date(e),
		s = Math.round(Math.abs((n - a) / 864e5)),
		r = a.getDate(),
		i = r + getDaySuffix(r);
	let o, c = a.toLocaleTimeString("en-US",
	{
		hour: "numeric",
		minute: "numeric"
	});
	return t || s > 1 ? o = `${i} ${a.toLocaleDateString("en-US",{month:"short"})}` : 0 === s ? o = "Today" : 1 === s && (o = "Yesterday"), t ? `(Last Run at ${o} ${c})` : `(Last Run: ${o} ${c})`
}

function calc_time_saved(e, t)
{
	let n, a, s;
	isPremiumFeatureAvailable() ? t >= 30 ? (n = "could have been saved", a = "Time that could have been saved", s = (t - 1) * e) : (n = "saved with premium", a = "Time saved with premium", s = (30 - t) * e) : (n = "could have been saved with premium", a = "Time that could have been saved with premium", s = 29 * e);
	let r = Math.floor(s / 3600),
		i = Math.floor(s / 60 - 60 * r),
		o = s - 3600 * r - 60 * i,
		c = "";
	return r && i ? c = `${r} hrs ${i} min` : (r && (c += `${r} hrs `), i && (c += `${i} min `), o && (c += `${o} sec`)),
	{
		msg_for_popup: n,
		msg_for_report: a,
		time_saved: c
	}
}
async function handleScheduleCampaigns()
{
	chrome.storage.local.get(["scheduled_campaigns"], (async function (e)
	{
		let t = e.scheduled_campaigns || [];
		for (let e = 0; e < t.length; e++)
		{
			let n = !1;
			if (n = isWithin24Hours(t[e].campaign_date, t[e].schedule_time), 1 == t[e].hasBeenScheduled || !n) continue;
			let
			{
				numbers: a,
				groups: s,
				message: r,
				time_gap: i,
				csv_data: o,
				customization: c,
				schedule_time: l,
				random_delay: m,
				batch_size: p,
				batch_gap: u,
				caption: d,
				caption_customization: g,
				attachmentsData: h
			} = t[e];
			const _ = await schedule_message(a, s, r, i, o, c, g, l, m, p, u, d, h);
			t[e].hasBeenScheduled = !0, t[e].timeOutId = _
		}
		chrome.storage.local.set(
		{
			scheduled_campaigns: t
		})
	}))
}
async function schedule_message(e, t, n, a, s, r, i, o, c, l, m, p, u)
{
	var d = o.split(":"),
		g = (d[0] % 12).toString() + ":" + d[1] + (d[0] < 12 ? "AM" : "PM");
	chrome.runtime.sendMessage(
	{
		type: "send_notification",
		title: "Your campaign has been scheduled for " + g,
		message: "Open the extension to view all scheduled campaigns."
	});
	var h = new Date,
		_ = (60 * (Number(d[0]) - h.getHours()) + (Number(d[1]) - h.getMinutes()) + 1440) % 1440;
	return setTimeout((() =>
	{
		chrome.storage.local.get(["scheduled_campaigns"], (async function (e)
		{
			let t = e.scheduled_campaigns || [];
			t.length > 0 && t.shift(), chrome.storage.local.set(
			{
				scheduled_campaigns: t
			})
		})), null == e || null == e || 0 == e.length ? messenger(t, n, a, s, r, i, c, l, m, p, "Scheduled_group", null, null, null, u) : messenger(e, n, a, s, r, i, c, l, m, p, "Scheduled_number", null, null, null, u)
	}), 6e4 * _)
}

function initializeReport(e, t)
{
	let n = e.includes("group") ? ["Group Name", "Text Delivered?", "All Attachments Delivered?", "Comments", "Error"] : ["Phone Number", "Text Delivered?", "All Attachments Delivered?", "Comments", "Error"];
	return t || [n]
}

function getTimeGap(e, t, n, a, s)
{
	return 0 == e ? 1 : a ? getRandomNumber(2, 7) : t && e % t == 0 ? s : n
}
async function getAttachmentsData()
{
	return new Promise((e =>
	{
		chrome.storage.local.get(["attachmentsData"], (t =>
		{
			e(t.attachmentsData || [])
		}))
	}))
}
async function saveCampaignState(e, t, n, a, s)
{
	const r = {
		paused: t,
		index: e,
		campaignData: n,
		attachmentsData: await getAttachmentsData(),
		report_rows: a,
		send_count: s
	};
	chrome.storage.local.set(
	{
		pausedCampaign: r
	})
}

function getRandomNumber(e, t)
{
	return Math.ceil(Math.random() * (t - e) + e)
}

function getDaySuffix(e)
{
	if (e >= 11 && e <= 13) return "th";
	switch (e % 10)
	{
	case 1:
		return "st";
	case 2:
		return "nd";
	case 3:
		return "rd";
	default:
		return "th"
	}
}

function isWithin24Hours(e, t)
{
	let n = new Date(e + "T" + t),
		a = new Date;
	return Math.abs(a - n) / 36e5 < 24
}

function hasLeadingOrTrailingSpaces(e)
{
	return /^\s+|\s+$/g.test(e)
}

function triggerEscape()
{
	var e = new KeyboardEvent("keydown",
	{
		key: "Escape",
		code: "Escape",
		keyCode: 27,
		charCode: 27
	});
	document.dispatchEvent(e)
}

function transposeArray(e)
{
	const t = e[0].length,
		n = e.length,
		a = [];
	for (let s = 0; s < t; s++)
	{
		const t = [];
		for (let a = 0; a < n; a++) t.push(e[a][s]);
		a.push(t)
	}
	return a
}