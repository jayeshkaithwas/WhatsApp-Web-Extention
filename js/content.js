var close_img_src = chrome.runtime.getURL("logo/pro-closeBtn.png"),
	free_trial_src = chrome.runtime.getURL("logo/pro-free-trial.png"),
	advance_promo_src = chrome.runtime.getURL("logo/pro_advance_promo.png"),
	success_gif = chrome.runtime.getURL("logo/pro-success.gif"),
	recommend_tick = chrome.runtime.getURL("logo/pro-tickmark.png"),
	export_chat_contacts_img_src = chrome.runtime.getURL("logo/pro-export-unsaved-contacts.png"),
	export_img_src = chrome.runtime.getURL("logo/pro-export.png"),
	export_contacts_text_src = chrome.runtime.getURL("logo/pro-export-contact.svg"),
	email_icon_src = chrome.runtime.getURL("logo/pro-email.png"),
	error_icon_src = chrome.runtime.getURL("logo/pro-error.png"),
	help_icon_src = chrome.runtime.getURL("logo/pro-help.png"),
	read_icon_src = chrome.runtime.getURL("logo/pro-read.png"),
	wall_clock_white_icon = chrome.runtime.getURL("logo/pro-wall-clock-white.png"),
	smile_icon = chrome.runtime.getURL("logo/pro-smile.png"),
	logo_img = chrome.runtime.getURL("logo/pro-logo-img.png"),
	medium_logo_img = chrome.runtime.getURL("logo/pro-medium.png"),
	logo_text = chrome.runtime.getURL("logo/pro-logo-text.png"),
	logo_text_light = chrome.runtime.getURL("logo/pro-logo-text-light.png"),
	arrow_left = chrome.runtime.getURL("logo/pro-arrow-left.png"),
	arrow_right = chrome.runtime.getURL("logo/pro-arrow-right.png"),
	bulb_icon = chrome.runtime.getURL("logo/pro-lightbulb.png"),
	how_to_use1 = chrome.runtime.getURL("logo/pro-how-to-use-1.png"),
	how_to_use2 = chrome.runtime.getURL("logo/pro-how-to-use-2.png"),
	how_to_use3 = chrome.runtime.getURL("logo/pro-how-to-use-3.png"),
	man_thinking = chrome.runtime.getURL("logo/pro-man-thinking.png"),
	cross_icon_src = chrome.runtime.getURL("logo/pro-close-1.png"),
	check_icon_src = chrome.runtime.getURL("logo/pro-check-mark.png"),
	eye_visible = chrome.runtime.getURL("logo/pro-eye-visible.png"),
	eye_hidden = chrome.runtime.getURL("logo/pro-eye-hidden.png"),
	pause_icon_src = chrome.runtime.getURL("logo/pro-pause_logo.png");
let link = document.createElement("link");
link.rel = "stylesheet", link.href = "https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&family=PT+Sans+Caption&family=Reem+Kufi+Ink&display=swap", document.head.appendChild(link);
let my_number = null,
	logged_in_user = null,
	plan_type = "Advance",
	last_plan_type = "Advance";
var rows = [],
	notifications_hash = {},
	stop = !1,
	pause = !1,
	groupIdToName = {},
	contactIdToName = {};
let isProfile = !1;
var cancelDelay, messages = ["Hello! how can we help you?", "Hello!", "Thank you for using service!"],
	total_messages = 0,
	location_info = {
		name: "international",
		name_code: "US",
		currency: "USD",
		default: !0
	},
	init_store_type = null,
	whatsapp_version = null,
	extension_version = chrome.runtime.getManifest().version;
let premiumUsageObject = {
	lastDate: (new Date).getDate(),
	lastMonth: (new Date).getMonth(),
	attachment: !1,
	customisation: !1,
	groupContactExport: !1,
	quickReplies: !1,
	caption: !1,
	stop: !1,
	timeGap: !1,
	batching: !1
};

function setPremiumUsageObject()
{
	
}

function injectMessageListner(e)
{
//	console.log('e..=',e);
	if (e.source != window || !e.data.type) return;
	let t = e.data.type;
	let n = e.data.payload;
//	console.log('t',t);
//	console.log('n',n);
	switch (n && n.error && trackError(t, n.error), t)
	{
	case "get_init_store_type":
		init_store_type || trackEvent("init_store_type", init_store_type = n);
		break;
	case "get_whatsapp_version":
		whatsapp_version || trackEvent("whatsapp_version", whatsapp_version = n);
		break;
	case "get_all_groups":
		setGroupDataToLocalStorage(n);
		break;
	case "get_all_contacts":
		setContactDataToLocalStorage(n);
		break;
	case "send_message":
		resolveSendMessageToNumber(n);
		break;
	case "send_message_error":
		rejectSendMessageToNumber(n);
		break;
	case "send_message_to_group":
	case "send_message_to_group_error":
		resolveSendMessageToGroup(n);
		break;
	case "send_attachments":
	case "send_attachments_error":
		resolveSendAttachmentsToNumber(n);
		break;
	case "send_attachments_to_group":
	case "send_attachments_to_grpup_error":
		resolveSendAttachmentsToGroup(n)
	}
}

function download_group_contacts()
{
	let e = getDocumentElement("conversation_header");
	if (!e) return;
	let t = getDocumentElement("conversation_message_div");
	if (!t || !t.dataset.id.includes("@g.us")) return;
	let n = t.dataset.id.split("_")[1],
		a = document.createElement("div"),
		o = document.createElement("span");
	o.classList.add("export_contacts_text");
	let s = "",
		i = getDocumentElement("conversation_title_div").innerText;
	document.body.classList.contains("dark") && (s = "export_gif_bright"), o.innerHTML = ` <img class="export_gif ${s}" src=${export_contacts_text_src} />`, a.id = "download_group_btn", a.className = "CtaBtn shimmer", a.innerHTML = `<img src=${export_img_src} />`, a.appendChild(o), chrome.storage.local.get(["coeu862", "ldeu863", "groupDataForShimmer"], (function (e)
	{
		let t = (new Date).toDateString(),
			n = e.coeu862 || 0,
			s = e.ldeu863 || "",
			r = e.groupDataForShimmer || [
			{}];
		if (t !== s && (s = t, n++, chrome.storage.local.set(
			{
				coeu862: n,
				ldeu863: s
			})), n >= 10 && n < 15)
		{
			let e = r.findIndex((e => e.groupName === i)); - 1 !== e ? r[e].lastShimmerDay !== t && r[e].shimmerCount < 5 ? (r[e].lastShimmerDay = t, r[e].shimmerCount = r[e].shimmerCount + 1, chrome.storage.local.set(
			{
				groupDataForShimmer: r
			})) : (a.classList.remove("shimmer"), o.innerHTML = "Export Contacts") : (r.push(
			{
				groupName: i,
				lastShimmerDay: t,
				shimmerCount: 1
			}), chrome.storage.local.set(
			{
				groupDataForShimmer: r
			})), setTimeout((() =>
			{
				a.classList.remove("shimmer"), o.innerHTML = "Export Contacts"
			}), 5e3)
		}
		else a.classList.remove("shimmer"), o.innerHTML = "Export Contacts"
	})), e.insertBefore(a, e.childNodes[2]), a.addEventListener("click", (function ()
	{
		isPremiumFeatureAvailable() ? (window.dispatchEvent(new CustomEvent("PROSS::export-group",
		{
			detail:
			{
				groupId: n
			}
		})), trackButtonClick("download_group")) : premium_reminder("download_group_contacts", "Premium"), chrome.storage.local.get(["premiumUsageObject"], (function (e)
		{
			if (void 0 !== e.premiumUsageObject)
			{
				let t = {
					...e.premiumUsageObject,
					groupContactExport: !0
				};
				chrome.storage.local.set(
				{
					premiumUsageObject: t
				})
			}
		}))
	}))
}

function downloadUnsavedContacts()
{
	const e = getDocumentElement("profile_header");
	if (!e) return;
	const t = e.children[0].children[0],
		n = document.createElement("div");
	n.id = "downloadUnsavedContacts", n.classList.add("CtaBtn"), n.title = "Export unsaved contacts - WA Sender", n.innerHTML = `<img src=${export_chat_contacts_img_src} alt='export_unsaved_contacts'>`, t.insertBefore(n, t.children[0]), n.addEventListener("click", (() =>
	{
		isAdvanceFeatureAvailable() ? (window.dispatchEvent(new CustomEvent("PROSS::export-unsaved-contacts",
		{
			detail:
			{
				type: "Advance"
			}
		})), trackButtonClick("download_chat_contacts")) : window.dispatchEvent(new CustomEvent("PROSS::export-unsaved-contacts",
		{
			detail:
			{
				type: "Expired"
			}
		})), chrome.storage.local.get(["premiumUsageObject"], (function (e)
		{
			if (void 0 !== e.premiumUsageObject)
			{
				let t = {
					...e.premiumUsageObject,
					downloadUnsavedContacts: !0
				};
				chrome.storage.local.set(
				{
					premiumUsageObject: t
				})
			}
		}))
	}))
}

function closePrimeProfile()
{
	isProfile = !1;
	let e = document.getElementById("prime_profile_popup");
	document.querySelector("#side").removeChild(e)
}
async function showBuyPremiumButtons()
{
	let e;
	if (e = "Advance" == last_plan_type || "Advance" == plan_type ? PRICING_DATA.free_trial_expired : PRICING_DATA.premium_expired, !e) return "";
	let t = "",
		n = !0,
		a = !1;
	"Advance" == last_plan_type && (n = !1, a = !0), "Basic" != plan_type && "Advance" != plan_type || (n = !1, a = !1);
	let
	{
		name: o,
		name_code: s,
		currency: i
	} = location_info;
	o = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(s) ? COUNTRY_WITH_SPECIFIC_PRICING[s] : "international";
	let r = "https://pro-sender.vercel.app/checkout/?country=",
		c = e.advance_price[o],
		l = e.basic_price[o],
		p = await convertPriceToLocale(c.substring(1)),
		d = await convertPriceToLocale(l.substring(1)),
		u = await basicButton(r + "basic", l, d),
		_ = await advanceButton(r + "advance", c, p);
	return n && (t += u), a && (t += _), t += await multipleAccountButton(), t
}
async function generateBodyHtml(e)
{
	const t = [
	{
		key: "customer_name",
		label: "Name"
	},
	{
		key: "customer_email",
		label: "Email"
	},
	{
		key: "my_number",
		label: "Number"
	},
	{
		key: "plan_type",
		label: "Plan Type"
	}];
	let n = "";
	for (const a of t)
	{
		let t = e[a.key];
		"my_number" === a.key && t ? t = `+${t}` : t && (t = await translate(t));
		const o = await translate(a.label);
		t && (n += `\n            <div class="prime_rows">\n                <p class="prime_col prime_col_end"><span>${o}</span> <span>:</span></p>\n                <span class="prime_col">${t}</span>\n            </div>`)
	}
	return n
}
async function createProfileSection()
{
	const e = document.createElement("div");
	e.id = "prime_profile_popup", e.classList.add("prime_profile_main");
	const t = document.createElement("div");
	t.classList.add("prime_profile_top"), t.innerHTML = `\n    <div class="prime_profile_cross" id="cross_prime">\n      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>\n    </div>\n    <div class="prime_profile_logo">\n         <div class="prime_profile_text">\n             <img src="${logo_text_light}" alt="">\n         </div>\n    </div>`;
	const n = document.createElement("div");
	n.classList.add("prime_profile_body");
	let a = "";
	if (await new Promise((e =>
		{
			chrome.storage.local.get(["my_number", "plan_type", "expiry_date", "last_plan_type"], (async function (t)
			{
				a = await generateBodyHtml(t), e()
			}))
		})), isExpired() || isTrial())
	{
		const e = await showBuyPremiumButtons();
		a += `<div class="premium_feature_block" id="buy_premium_block" style="border:none;display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;">${e}</div>`
	}
	return n.innerHTML = a, "es" === currentLanguage && (e.style.top = "35%"), e.append(t), e.append(n), e
}

function primeProfile()
{
	// const e = getDocumentElement("profile_header");
	// if (!e) return;
	// const t = e.children[0].children[0];
	// if (document.getElementById("prime_profile_btn")) return;
	// const n = document.createElement("div");
	// n.id = "prime_profile_btn", n.classList.add("CtaBtn"), n.innerHTML = `<img class='prime_profile_icon' src=${medium_logo_img} alt='prime-profile-info'>`, n.title = "Profile - WA Sender", n.addEventListener("click", (() =>
	// {
	// 	isProfile = !0
	// })), t.insertBefore(n, t.children[0])
}

function blur_contacts()
{
	const e = getDocumentElement("profile_header");
	if (!e) return;
	const t = e.children[0].children[0];
	if (document.getElementById("blur_contacts_btn")) return;
	document.querySelector("#pane-side") && document.querySelector("#pane-side").addEventListener("scroll", (() =>
	{
		try
		{
			toggleBlur(!0)
		}
		catch (e)
		{
			console.log(e)
		}
	}));
	const n = document.createElement("div");
	n.id = "blur_contacts_btn", n.classList.add("CtaBtn"), n.innerHTML = `<img class='blur_icon' src=${eye_hidden} alt='blur-info'>`, n.title = "Blur chat, contact name and profile picture - WA Sender", n.addEventListener("click", (() =>
	{
		try
		{
			toggleBlur()
		}
		catch (e)
		{
			console.log(e)
		}
		trackButtonClick("blur_contacts_button")
	})), t.insertBefore(n, t.children[0])
}

function toggleBlur(e = !1)
{
	const t = document.getElementById("blur_contacts_btn"),
		n = t.classList.contains("blurred");
	[document.querySelector("#reply_div"), getDocumentElement("left_side_contacts_panel"), getDocumentElement("conversation_header_name_div"), ...getDocumentElement("contact_profile_div", !0), ...getDocumentElement("conversation_message_div", !0), ...getDocumentElement("conversation_non_message_div", !0)].forEach((t =>
	{
		applyOrRemoveBlur(t, "blur", e ? n : !n)
	})), e || (t.classList.toggle("blurred", !n), t.innerHTML = `<img class='blur_icon' src=${n?eye_hidden:eye_visible} alt='blur-info'>`)
}

function applyOrRemoveBlur(e, t, n)
{
	try
	{
		if (!e) return;
		n ? e.classList.add(t) : e.classList.remove(t)
	}
	catch (e)
	{
		console.log(e)
	}
}

function suggestion_messages()
{
	(t = document.getElementById("reply_div")) && t.parentNode.removeChild(t);
	var e = document.getElementById("smart_reply_edit_button");
	e && e.parentNode.removeChild(e);
	var t, n = getDocumentElement("footer_div");
	if (!n) return;
	n.style.paddingTop = "33px", (t = document.createElement("div")).id = "reply_div", t.style.position = "absolute", t.style.padding = "8px 12px", t.style.top = "0", t.style.zIndex = "1", t.style.width = "calc(100% - 80px)", $.each(messages, (function (e, n)
	{
		var a = n;
		if (n.length > 47) a = n.substring(0, 47) + "...";
		var o = $($.parseHTML('<button class="reply_click CtaBtn" style="color: var(--message-primary);background-color: var(--outgoing-background);border-radius: 15px;padding: 4px 8px;font-size: 12px;margin-right: 8px;margin-bottom: 4px;direction: ltr !important" value="' + n + '">' + a + "</button>"));
		t.appendChild(o[0])
	})), total_messages = messages.length, n.appendChild(t);
	let a = getDocumentElement("conversation_panel");
	a && a.scrollBy(0, 33), n.appendChild($($.parseHTML('<button class="CtaBtn" style="position: absolute;width: 80px;right: 8px;top: 12px;color: var(--message-primary);font-size: 12px !important;" id="smart_reply_edit_button">Edit</button>'))[0]);
	var o = document.getElementsByClassName("_33LGR")[0];
	o && (o.scrollTop = o.scrollHeight), document.getElementById("reply_div").addEventListener("click", (async function (e)
	{
		if (isPremiumFeatureAvailable())
		{
			var t = e.target.value;
			null != t && sendSuggestionMessage(t), trackButtonClick("smart_reply_sent")
		}
		else premium_reminder("smart_reply", "Premium")
	})), document.getElementById("smart_reply_edit_button").addEventListener("click", (function (e)
	{
		suggestion_popup(), isPremiumFeatureAvailable() && trackButtonClick("smart_reply_edit")
	}));
	let s = document.getElementsByClassName("reply_click")[0];
	s && s.addEventListener("click", (function ()
	{
		chrome.storage.local.get(["premiumUsageObject"], (function (e)
		{
			if (void 0 !== e.premiumUsageObject)
			{
				let t = {
					...e.premiumUsageObject,
					quickReplies: !0
				};
				chrome.storage.local.set(
				{
					premiumUsageObject: t
				})
			}
		}))
	}))
}
async function sendSuggestionMessage(e)
{
	if (!e || 0 == e.trim().length) return;
	getDocumentElement("input_message_div") && (pasteMessage(e), await sendMessageToNumber())
}

function pasteMessage(e)
{
	const t = new DataTransfer;
	t.setData("text", e);
	const n = new ClipboardEvent("paste",
	{
		clipboardData: t,
		bubbles: !0
	});
	getDocumentElement("input_message_div").dispatchEvent(n)
}

function referesh_messages()
{
	var e = document.getElementById("sugg_message_list");
	e.innerHTML = "", $.each(messages, (function (t, n)
	{
		var a = $($.parseHTML('<div style="margin: 8px 0px;display: flex;"><div class="popup_list_message" style="color: var(--message-primary);background-color: var(--outgoing-background);padding: 6px 7px 8px 9px;border-radius: 7.5px;margin: 2px 0px;max-width: 400px;margin-right: 8px;cursor: pointer;overflow: auto;">' + n + '</div><button class="delete_message CtaDeleteBtn" style="border: 1px solid red;width: 18px;height: 18px;color: red;border-radius: 50%;font-size: 11px;margin-top: 8px;" value="' + n + '">X</button></div>'));
		e.appendChild(a[0])
	})), chrome.storage.local.set(
	{
		messages: messages
	})
}
async function suggestion_popup()
{
	if (document.getElementsByClassName("modal")[0]) document.getElementsByClassName("modal")[0].style.display = "block";
	else
	{
		var e = document.createElement("div");
		e.className = "modal";
		var t = document.createElement("div");
		t.className = "modal-content", t.style.position = "relative", t.style.width = "600px", t.style.maxHeight = "560px", t.style.overflow = "auto", e.appendChild(t), document.querySelector("body").appendChild(e), t.appendChild($($.parseHTML('<div style="font-weight: bold;font-size: 20px;text-align: center;margin-bottom: 24px;color: #000;">Edit/Add quick replies</div>'))[0]);
		var n = document.createElement("div");
		n.id = "sugg_message_list", n.style.height = "210px", n.style.overflowY = "auto", n.style.margin = "16px 0px", t.appendChild(n), referesh_messages(), t.appendChild($($.parseHTML('<span id="close_edit" class="CtaCloseBtn" style="position: absolute;top: 6px;right: 6px;font-size: 20px;width:14px"><img  class="CtaCloseBtn" src="' + close_img_src + '" style="width: 100%;" alt="x"></span>'))[0]), t.appendChild($($.parseHTML('<textarea style="width: 400px;height: 100px;padding: 8px;" type="text" id="add_message" placeholder="Type your quick reply here"></textarea>'))[0]), t.appendChild($($.parseHTML('<button class="CtaBtn" style="background: #62D9C7;border-radius: 2px;padding: 8px 12px;float: right;color: #fff;" id="add_message_btn">Add Template</button>'))[0]), document.getElementById("close_edit").addEventListener("click", (function (e)
		{
			document.getElementsByClassName("modal")[0].style.display = "none"
		})), document.getElementById("sugg_message_list").addEventListener("click", (async function (e)
		{
			var t = e.target.value;
			if ("div" != e.target.localName)
			{
				var n = messages.indexOf(t);
				messages.splice(n, 1), referesh_messages(), trackButtonClick("smart_reply_deleted")
			}
			else if ("div" == e.target.localName && "popup_list_message" == e.target.className)
			{
				document.getElementsByClassName("modal")[0].style.display = "none";
				var a = e.target.innerHTML;
				null != a && sendSuggestionMessage(a), trackButtonClick("smart_reply_sent")
			}
		})), document.getElementById("add_message_btn").addEventListener("click", (function (e)
		{
			var t = document.getElementById("add_message").value;trackButtonClick
			"" !== t && (messages.push(t), referesh_messages(), document.getElementById("add_message").value = "", ("smart_reply_added"))
		}))
	}
	document.getElementById("add_message").placeholder = await translate("Type your quick reply here"), document.getElementById("add_message_btn").innerText = await translate("Add Template")
}

function reload_mynumber()
{
	if (chrome.storage.local.get(["my_number"], (function (e)
		{
			my_number = void 0 === e.my_number ? null : e.my_number
		})), !my_number)
	{
		var e = window.localStorage.getItem("last-wid");
		window.localStorage.getItem("last-wid-md") ? my_number = window.localStorage.getItem("last-wid-md").split("@")[0].substring(1).split(":")[0] : e && (my_number = window.localStorage.getItem("last-wid").split("@")[0].substring(1)), my_number && chrome.storage.local.set(
		{
			my_number: my_number
		})
	}
	if (trackEvent("visit", my_number), !my_number)
	{
		trackEvent("no_number", "track");
		try
		{
			trackEvent("no_number_local_storage", window.localStorage)
		}
		catch (e)
		{
			console.log(e)
		}
	}
	var t = document.getElementsByClassName("_3hcUV")[0];
	t && "BETA" == t.innerText && trackEvent("beta_version", my_number), document.getElementById("cooby-ui") && trackButtonView("cooby_version")
}

function setGroupDataToLocalStorage(e)
{
	let t = e.map((e => (
	{
		...e,
		objId: "g" + e.id._serialized.replace(/\D+/g, "")
	})));
	
	chrome.storage.local.set(
	{
		allGroupData: t
	});
	e.forEach((e =>
	{
		const t = e.id._serialized;
		t && e.name && (groupIdToName[t] = e.name)
	}))
}

function setContactDataToLocalStorage(e)
{
	//console.log('e=',e);
	let t = e.map((e => (
	{
		...e,
		objId: "c" + e.id._serialized.replace(/\D+/g, "")
	})));
	chrome.storage.local.set(
	{
		allContactData: t
	});
	e.forEach((e =>
	{
		const t = e.id._serialized;
		t && e.name && (contactIdToName[t] = e.name)
	}))
}
async function readFileAndSaveToLocalStorage(e, t)
{
	let n = e.target.files,
		a = [],
		o = Array.from(n).map((e => new Promise((t =>
		{
			const n = new FileReader;
			n.onload = function (n)
			{
				const o = n.target.result,
					s = {
						name: e.name,
						type: e.type,
						data: o
					};
				a.push(s), t()
			}, n.readAsDataURL(e)
		}))));
	await Promise.all(o), chrome.storage.local.set(
	{
		[t]: a
	})
}
async function handleAddAttachment()
{
	let e = document.createElement("input");
	e.type = "file", e.id = "new_input_element", e.multiple = !0, document.body.appendChild(e), e.click(), e.addEventListener("change", (async function (t)
	{
		let n = e?.files.length;
		n && n > 1 && !isAdvanceFeatureAvailable() ? premium_reminder("multiple_attachments", "Advance") : await readFileAndSaveToLocalStorage(t, "linuxInputAttachments"), e.remove()
	}))
}

function handleAddCSVInput()
{
	let e = document.createElement("input");
	e.type = "file", e.id = "new_csv_input_element", e.accept = ".xls,.xlsx,.ods,.csv", document.body.appendChild(e), e.click(), e.addEventListener("change", (async function (t)
	{
		await readFileAndSaveToLocalStorage(t, "linuxCSVAttachment"), e.remove()
	}))
}

function init()
{
	messageListner(), fetchConfigData(), window.onload = function ()
	{
		"web.whatsapp.com" === window.location.host && (reload_mynumber(), chrome.storage.local.get(["messages"], (function (e)
		{
			e.messages && (messages = e.messages)
		})), setInterval((() =>
		{
			document.getElementById("reply_div") && messages.length === total_messages || suggestion_messages();
			document.getElementById("download_group_btn") || download_group_contacts();
			document.getElementById("translate_div") || translate_messages();
			document.getElementById("downloadUnsavedContacts") || downloadUnsavedContacts();
			getDocumentElement("profile_header") && blur_contacts();
			document.getElementById("prime_profile_btn") || primeProfile();
			const e = document.getElementById("prime_profile_popup");
			if (isProfile && !e && createProfileSection().then((e =>
				{
					document.querySelector("#side").appendChild(e)
				})), document.querySelector("#main")) try
			{
				toggleBlur(!0)
			}
			catch (e)
			{
				console.log(e)
			}
			const t = getDocumentElement("new_chat_btn");
			t && !t.classList.contains("CtaBtn") && t.classList.add("CtaBtn")
		}), 1e3), my_number && fetch_plan_details());
		const e = setInterval((() =>
		{
			getDocumentElement("profile_header") && (clearInterval(e), handleScheduleCampaigns())
		}), 100)
	}, chrome.runtime.sendMessage(
	{}, (function (e)
	{
		logged_in_user = e.email, trackEvent("loggedin", logged_in_user)
	}))
}

function openEmailPopup(e)
{
	let t = "mailto:prosendertool@gmail.com?subject=" + encodeURIComponent("Chat support for WA Sender") + "&body=" + encodeURIComponent(e);
	window.open(t, "_blank")
}

function messageListner()
{
	chrome.runtime.onMessage.addListener(listner)
}

function listner(e, t, n)
{
	"number_message" === e.type ? messenger(e.numbers, e.message, e.time_gap, e.csv_data, e.customization, e.caption_customization, e.random_delay, e.batch_size, e.batch_gap, e.caption, e.type, e.startIndex, e.paused_report_rows, e.paused_sent_count) : "group_message" === e.type ? messenger(e.groups, e.message, e.time_gap, e.csv_data, e.customization, e.caption_customization, e.random_delay, e.batch_size, e.batch_gap, e.caption, e.type, e.startIndex, e.paused_report_rows, e.paused_sent_count) : "schedule_message" === e.type ? handleScheduleCampaigns() : "clear_schedule_timeout" === e.type ? clearTimeout(e.timeoutId) : "help" === e.type ? handle_help() : "transfer_premium" === e.type ? help(e.message) : "show_premium_popup" === e.type ? premium_reminder(e.feature, "Premium") : "show_advance_popup" === e.type ? premium_reminder(e.feature, "Advance") : "add_attachments" === e.type ? handleAddAttachment() : "create_csv_input" === e.type ? handleAddCSVInput() : "fetch_plan_details" === e.type ? (reload_mynumber(), fetch_plan_details()) : "chat_link" === e.type ? chat_link() : "unsaved_contacts_demo" === e.type ? unsavedContactsDemo() : "request_chat_premium" === e.type ? isAdvance() ? help(HELP_MESSAGES.REQUEST_CHAT_SUPPORT_ADVANCE) : help(HELP_MESSAGES.REQUEST_CHAT_SUPPORT_BASIC) : "request_zoom_premium" === e.type ? isAdvance() ? help(HELP_MESSAGES.REQUEST_ZOOM_SUPPORT_ADVANCE) : help(HELP_MESSAGES.REQUEST_ZOOM_SUPPORT_BASIC) : "request_call_premium" === e.type ? isAdvance() ? help(HELP_MESSAGES.REQUEST_CALL_SUPPORT_ADVANCE) : help(HELP_MESSAGES.REQUEST_CALL_SUPPORT_BASIC) : "unsubscribe" === e.type ? help(HELP_MESSAGES.UNSUBSCRIBE_PLAN) : "learn_schedule" === e.type ? help(HELP_MESSAGES.LEARN_SCHEDULE) : "buy_premium_popup" === e.type && show_trial_popups()
}

function sendChromeMessage(e)
{
	chrome.runtime.sendMessage(e)
}

function help(e)
{
	chrome.storage.local.get(["currentLanguage", "customer_care_number"], (async t =>
	{
		let n = e.replace(/ /gm, " "),
			a = t.currentLanguage || "default";
		HELP_MESSAGE_LANGUAGE_CODES.includes(a) && (n = await translate(n)), await openNumber(t.customer_care_number, n), await sendMessage()
	}))
}

function handle_help()
{
	isPremium() ? isAdvance() ? help(HELP_MESSAGES.REQUEST_CHAT_SUPPORT_ADVANCE) : help(HELP_MESSAGES.REQUEST_CHAT_SUPPORT_BASIC) : my_number && my_number.startsWith(62) ? openEmailPopup(HELP_MESSAGES.NEED_HELP_NON_PREMIUM) : help(HELP_MESSAGES.NEED_HELP_NON_PREMIUM)
}
async function unsavedContactsDemo()
{
	let e = await fetchTranslations(exportUnsavedContactsObj);
	driver(e).drive()
}

function getTodayDate()
{
	let e = new Date,
		t = String(e.getDate()).padStart(2, "0"),
		n = String(e.getMonth() + 1).padStart(2, "0");
	return e.getFullYear() + "-" + n + "-" + t
}
async function delay(e)
{
	if (0 != e) return new Promise((t =>
	{
		cancelDelay = t, setTimeout(t, e)
	}))
}
async function sendMessage()
{
	return new Promise((e =>
	{
		setTimeout((() =>
		{
			let t = getDocumentElement("send_message_btn");
			t ? (t.click(), e(["Yes", ""])) : e(["No", "Issue with the number"])
		}), 500)
	}))
}

function download_report()
{
	let e = "data:text/csv;charset=utf-8," + rows.map((e => e.join(","))).join("\n");
	var t = encodeURI(e),
		n = document.createElement("a");
	n.setAttribute("href", t), n.setAttribute("download", "report.csv"), document.body.appendChild(n), n.click()
}

function get_label()
{
	var e = "";
	return my_number && (e += my_number + " "), plan_type && (e += plan_type + " "), chrome.storage.local.get(["plan_duration"], (function (t)
	{
		t.plan_duration && (e += t.plan_duration)
	})), e
}

function trackButtonClick(e)
{
	var t = get_label();
}

function trackEvent(e, t)
{
	var n = get_label();
}

function trackError(e, t)
{
	var n = get_label();
	let a = location_info.default ?
		{} :
		{
			city: location_info.city,
			region: location_info.region,
			country: location_info.country,
			dial_code: location_info.dial_code
		},
		o = {
			init_store_type: init_store_type,
			whatsapp_version: whatsapp_version,
			extension_version: extension_version,
			...a
		};
	
}

function trackButtonView(e)
{
	var t = get_label();
	
}

function convertDate(e = null)
{
	return e || (e = new Date), e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate()
}

function dateDiff(e, t)
{
	if (e && t) return Math.ceil((t - e) / 864e5)
}

function check_web_and_show_trial_popups()
{
	if (null !== document.getElementById("side"))
	{
		if (show_trial_popups(), !my_number) return
	}
	else setTimeout(check_web_and_show_trial_popups, 500)
}

function show_trial_popups()
{
	chrome.storage.local.get(["is_advance_promo_activated", "content_visits", "plan_type", "created_date", "expiry_date", "last_plan_type", "subscribed_date", "location_info"], (function (e)
	{
		plan_type = e.plan_type || "Expired", last_plan_type = e.last_plan_type || "Basic", location_info = e.location_info || location_info;
		let t, n = new Date,
			a = e.content_visits || 0,
			o = e.expiry_date ? new Date(e.expiry_date) : null,
			s = (e.created_date && new Date(e.created_date), e.subscribed_date ? new Date(e.subscribed_date) : null),
			i = e.is_advance_promo_activated || "NO",
			r = o ? dateDiff(n, o) : 7;
		if (s && o)
		{
			t = Math.abs(dateDiff(o, s)) > 31 ? "Yearly" : "Monthly"
		}
		"Advance" === plan_type ? 0 === a ? display_popup("free_trial_start", r) : r <= 10 && display_popup("free_trial_reminder", r) : "AdvancePromo" === plan_type ? "NO" === i ? (i = "YES", display_popup("advance_promo_start", r)) : r <= 5 && display_popup("advance_promo_reminder", r) : "Expired" === plan_type && r <= 0 && my_number && null != my_number && ("Basic" === last_plan_type || "Advance" === last_plan_type ? display_popup("premium_expired", r) : "Advance" === last_plan_type ? display_popup("free_trial_expired") : "AdvancePromo" === last_plan_type && display_popup("advance_promo_expired")), chrome.storage.local.set(
		{
			content_visits: a + 1,
			plan_duration: t,
			is_advance_promo_activated: i
		}), chrome.runtime.sendMessage(
		{}, (function (e)
		{
			logged_in_user = e.email, trackEvent("logged_mail", logged_in_user)
		}))
	}))
}

function isExpired()
{
	return "Expired" === plan_type
}

function isBasic()
{
	return "Basic" === plan_type
}

function isAdvance()
{
	return "Advance" === plan_type
}

function isPremium()
{
	return "Basic" === plan_type || "Advance" === plan_type
}

function isAdvance()
{
	return "Advance" === plan_type
}

function isAdvancePromo()
{
	return "AdvancePromo" === plan_type
}

function isTrial()
{
	return "Advance" === plan_type || "AdvancePromo" === plan_type
}

function isBasicFeatureAvailable()
{
	return isBasic() || isTrial()
}

function isAdvanceFeatureAvailable()
{
	return isAdvance() || isAdvancePromo()
}

function isPremiumFeatureAvailable()
{
	return isPremium() || isTrial()
}

function fetch_plan_details()
{
	my_number && void 0 !== my_number && (fetch_data(my_number).then((e =>
	{
		handle_response(e)
	})).catch((e =>
	{
		//console.error("Error fetching number data:", e)
	})), chrome.storage.local.get(["location_info"], (e =>
	{
		"" !== e.location_info.ipAdd && my_number && fetch(AWS_API.UPDATE_LOCATION_INFO,
		{
			method: "POST",
			headers:
			{
				"Content-Type": "application/json"
			},
			body: JSON.stringify(
			{
				phone: my_number,
				ipAdd: e.location_info.ipAdd
			})
		})
	})))
}
async function fetch_data(e)
{
	var t = `${AWS_API.PLAN_FETCH}?phone=${e}`;
	return new Promise((function (e, n)
	{
		$.ajax(
		{
			type: "GET",
			url: t,
			success: function (t)
			{
				e(t.body)
			},
			error: function (e)
			{
				n(e)
			},
			dataType: "json",
			contentType: "application/json"
		})
	}))
}

function handle_response(e)
{
	e ? (e.plan_type && (plan_type = e.plan_type, chrome.storage.local.set(
	{
		plan_type: e.plan_type
	})), e.created_date && chrome.storage.local.set(
	{
		created_date: e.created_date
	}), e.expiry_date && chrome.storage.local.set(
	{
		expiry_date: e.expiry_date
	}), e.last_plan_type && (last_plan_type = e.last_plan_type, chrome.storage.local.set(
	{
		last_plan_type: e.last_plan_type
	})), e.subscribed_date && chrome.storage.local.set(
	{
		subscribed_date: e.subscribed_date
	}), e.name ? chrome.storage.local.set(
	{
		customer_name: e.name
	}) : chrome.storage.local.set(
	{
		customer_name: null
	}), e.email ? (chrome.storage.local.set(
	{
		customer_email: e.email
	}), getDates(e.email)) : chrome.storage.local.set(
	{
		customer_email: null
	}), null != e.customer_care_number && null != e.customer_care_number && "" != e.customer_care_number ? chrome.storage.local.set(
	{
		customer_care_number: e.customer_care_number
	}) : chrome.storage.local.set(
	{
		customer_care_number: "919974898277"
	}), e.trial_days && (chrome.storage.local.set(
	{
		trial_days: e.trial_days
	}), chrome.storage.local.get(["atd860"], (t =>
	{
		let n = t.atd860;
		void 0 === n || n || (trackEvent("Extension Installation", e.trial_days), chrome.storage.local.remove("atd860"), chrome.runtime.sendMessage(
		{
			type: "set_uninstall_url",
			trial_days: e.trial_days,
			number: my_number + e.plan_type
		}))
	}))), check_web_and_show_trial_popups(), trackEvent("plan_details_fetched", "fetched")) : (alert("Something went wrong in account. Please contact support at Whatsapp number +13156586589"), chrome.storage.local.clear())
}
async function convertPriceToLocale(e)
{
	const t = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"),
		n = await t.json();
	let
	{
		currency: a
	} = location_info, o = new Intl.NumberFormat("en-US",
	{
		style: "currency",
		currency: a,
		maximumFractionDigits: 0
	}), s = n.usd[a.toLowerCase()];
	return o.format(Math.round(1.02 * s * parseFloat(e)))
}
async function create_pricing_buttons_html(e)
{
	let t = PRICING_DATA[e];
	if (!t) return "";
	let
	{
		name: n,
		name_code: a,
		currency: o
	} = location_info;
	n = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(a) ? COUNTRY_WITH_SPECIFIC_PRICING[a] : "international";
	let s = t.advance_price[n],
		i = t.basic_price[n],
		r = await convertPriceToLocale(s.substring(1)),
		c = await convertPriceToLocale(i.substring(1)),
		l = ``,
		p = await multipleAccountButton(),
		d = await basicButton(l + "basic", i, c),
		u = await advanceButton(l + "advance", s, r, e),
		_ = !0,
		m = !1;
	return "Advance" == last_plan_type && (_ = !1, m = !0), `\n        <div class="pricing-buttons-container"> \n            ${_?d:""}\n            ${m?u:""}\n            ${p}\n        </div>\n    `
}

function create_features_list_html(e)
{
	let t = "",
		n = !0;
	return e.includes("advance_promo") && (n = !1), $.each(PREMIUM_FEATURES, (function (e, a)
	{
		t += `\n            <div class="trial_feature" style="font-weight: bold;color: #fff;">\n                <span class="check_icon"></span>${a}\n                ${n?'<span style="color:#009a88;margin-left: 5px;"> (Advance) </span>':""}\n            </div>`
	})), $.each(TRIAL_FEATURES, (function (e, n)
	{
		t += `<div class="trial_feature" style="color: #fff;"><span class="check_icon"></span>${n}</div>`
	})), t
}

function create_footer_html()
{
	return `\n        <div class="popup-footer">\n            <div class="popup-footer-container">\n                <div class="logo-div">\n                    <img class="logo-icon" src="${window.logo_img}" alt="Logo"/>\n                    <img class="logo-text" src="${window.logo_text}" alt="Logo Text"/>\n                </div>\n                <div class="contact-div">\n                    <p>Any questions?</p>\n                    <a class="handle_help_btn CtaBtn">Contact Support</a>\n                </div>\n            </div>\n        </div>`
}
async function create_popup_html(e, t)
{
	const n = POPUP_DATA[e],
		a = POPUP_DATA.common,
		o = n.title ? n.title.replace("{VAR_DATE_DIFF}", t).replace("{VAR_EXP_TEXT}", t > 0 ? `expires in ${t} days` : "have expired") : null,
		s = await create_pricing_buttons_html(e),
		i = create_features_list_html(e),
		r = create_footer_html();
	return `\n        <div class="${e}_content trial_content" style="background: ${n.background_color}">\n            ${n.close_button?`<span class="CtaCloseBtn popup-close-btn" id="close_${e}_popup"><img src=${close_img_src} /></span>`:""}\n\n            <div class="popup-header">\n                ${n.heading?`<div class="trial_big_title heading ${e}_bold">${await translate(n.heading)}</div>`:""}\n                <div class="trial_big_title">\n                    ${n.icon?`<img src=${window[n.icon]} />`:""}\n                    ${o?`<p>${await translate(o)}</p>`:""}\n                </div>\n                ${n.description?`<div class="trial_title">${await translate(n.description)}</div>`:""}\n            </div>\n\n            <div class="trial_separator_line ${e}_divider"></div>\n\n            <div class="popup-center"> \n                <div class="trial_features">${i}</div>\n                ${n.note?`<div class="trial_desc">${await translate(n.note)}</div>`:""}\n                ${s}\n                ${n.action_button?`<div id="${n.action_button.id}" class="popup-btn CtaBtn ${n.action_button.class}">${n.action_button.text}</div>`:""}\n                ${n.recommend_price?`<div class="popup-message popup-recommendation-message"><img src="${recommend_tick}"> ${await translate(a.recommend_text)}</div>`:""}\n                ${n.discount_text?`<div class="popup-message popup-discount-message">*${await translate(a.discount_text)}</div>`:""}\n                ${n.purchase_note?`<div class="popup-message popup-purchase-note">${await translate(a.purchase_note)}</div>`:""}       \n            </div>\n\n            ${r}\n        </div>\n    `
}

function show_loader_and_close_popup(e, t, n = !1)
{
	$(`#close_${e}_popup`).addClass("loading").html(""), setTimeout((() =>
	{
		$(`#${e}_popup`).remove(), n && success_popup(n)
	}), t)
}
async function display_popup(e, t)
{
	$(`#${e}_popup`) && $(`#${e}_popup`).remove();
	const n = await create_popup_html(e, t),
		a = $("<div>").html(n).attr(
		{
			class: `${e}_popup trial_popup`,
			id: `${e}_popup`
		});
	$("body").append(a), $(`#close_${e}_popup`).on("click", (function (t)
	{
		"advance_promo_start" !== e ? $(`#${e}_popup`).remove() : show_loader_and_close_popup(e, 1e3, "advance_promo_activated")
	})), trackButtonView(`${e}_popup`)
}
async function success_popup(e)
{
	$(`#${e}_popup`) && $(`#${e}_popup`).remove();
	const t = SUCCESS_POPUP_DATA[e],
		n = t.description.replace("Advance Premium", "<strong>Advance Premium</strong>"),
		a = `\n        <div class="${e}_content success_content" style="background: ${t.background_color}">\n            ${t.close_button?`<span class="CtaCloseBtn popup-close-btn" id="close_${e}_popup"><img src=${close_img_src} /></span>`:""}\n            <div class="popup-header">\n                <img class="${t.icon}" src=${window[t.icon]} />\n            </div>\n            <div class="popup-center">\n                <p class="trial_big_title heading">${t.title}</p>\n                <p class="trial_title">${n}</p>\n                ${t.action_button?`<div id="${t.action_button.id}" class="popup-btn CtaBtn ${t.action_button.class}">${t.action_button.text}</div>`:""}\n            </div>\n        </div>\n    `,
		o = $("<div>").html(a).attr(
		{
			class: `${e}_popup success_popup`,
			id: `${e}_popup`
		}).css("width", "min(400px, 95%)");
	$("body").append(o), $(`#close_${e}_popup`).on("click", (function (t)
	{
		$(`#${e}_popup`).remove()
	})), trackButtonView(`${e}_popup`)
}
async function multipleAccountButton()
{
	let
	{
		name: e,
		name_code: t,
		currency: n
	} = location_info;
	return e = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(t) ? COUNTRY_WITH_SPECIFIC_PRICING[t] : "international", `<a href="" target="_blank" class="popup-btn pricing-purple-btn CtaBtn">\n        <span style="white-space:nowrap;">Buy multiple users<br/></span>\n        <span style="white-space:nowrap; color: #fff; font-size: 14px; line-height: 16px;font-weight:bold;display:flex;"><span style="margin-right:3px;">@</span>\n            ${"india"===e?'<span class="rupee">₹</span>':""}\n            <span class="price_class">${MULT25ACCOUNTPRICE[e]}</span>/month\n        </span>\n        ${"international"===e&&"USD"!=n?`<span style="white-space:nowrap; color: #fff; font-size: 12px; line-height: 16px;font-weight:bold;"> \n(~<span class="price_class">${await convertPriceToLocale(MULT25ACCOUNTPRICE[e].substring(1))}</span>/month)\n</span>`:""}\n    </a>`
}
async function basicButton(e = "", t = "", n = "")
{
	let
	{
		name: a,
		name_code: o,
		currency: s
	} = location_info;
	a = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(o) ? COUNTRY_WITH_SPECIFIC_PRICING[o] : "international";
	let i = n;
	return n && "" != n || (i = await convertPriceToLocale(t.substring(1))), `<a href="${``}" target="_blank" class="popup-btn pricing-white-btn CtaBtn">\n        Buy Premium<br/>\n        <span style="white-space:nowrap; color: #009a88; font-size: 14px; line-height: 16px;font-weight:bold;display:flex;"><span style="margin-right:3px;">@</span> \n            ${"india"===a?'<span class="rupee">₹</span>':""}\n            <span class="price_class">${t}</span>/month\n        </span>\n        ${"international"===a&&"USD"!=s?`<span style="white-space:nowrap; color: #009a88; font-size: 12px; line-height: 16px;font-weight:bold;">\n(~<span class="price_class">${i}</span>/month)\n</span>`:""}\n    </a>`
}
async function advanceButton(e = "", t = "", n = "", a)
{
	let
	{
		name: o,
		name_code: s,
		currency: i
	} = location_info;
	o = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(s) ? COUNTRY_WITH_SPECIFIC_PRICING[s] : "international";
	let r = n;
	return n && "" != n || (r = await convertPriceToLocale(t.substring(1))), "free_trial_start" != a && "free_trial_reminder" != a && "free_trial_expired" != a && "AdvancePromo" != last_plan_type && "advance_promo_activated" != a && "advance_promo_reminder" != a && "advance_promo_expired" != a || (e = ``), `<a href="${e}" target="_blank" class="popup-btn pricing-white-btn CtaBtn">\n        Buy Advance<br/>\n        <span style="white-space:nowrap; color: #009a88; font-size: 14px; line-height: 16px;font-weight:bold;display:flex;"><span style="margin-right:3px;">@</span>\n            ${"india"===o?'<span class="rupee">₹</span>':""}\n            <span class="price_class">${t}</span>/month\n        </span>\n        ${"international"===o&&"USD"!=i?`<span style="white-space:nowrap; color: #009a88; font-size: 12px; line-height: 16px;font-weight:bold;"> \n(~<span class="price_class">${r}</span>/month)\n</span>`:""}\n    </a>`
}
async function premium_reminder(e, t)
{
	let
	{
		name: n,
		name_code: a,
		currency: o
	} = location_info;
	n = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(a) ? COUNTRY_WITH_SPECIFIC_PRICING[a] : "international", e || (e = "default");
	let s, i = ``,
		r = document.querySelector("body"),
		c = document.createElement("div"),
		l = document.createElement("div"),
		p = await multipleAccountButton();
	"Advance" == t ? (i = `"`, s = await advanceButton(i, ADVANCE_NORMAL_PRICE[n])) : "Premium" == t && (s = await basicButton(i, BASIC_NORMAL_PRICE[n])), document.querySelector(".premium_reminder_popup") && r.removeChild(document.querySelector(".premium_reminder_popup")), c.className = "premium_reminder_popup trial_popup", l.className = "premium_reminder_content trial_content", l.innerHTML = `\n        <span id="close_premium_reminder_popup">\n            <img class="CtaCloseBtn" src="${close_img_src}" alt="x">\n        </span>\n        <div class="premium_reminder_popup_title">\n            <span class="oops_icon"></span>Oops!\n        </div>\n        <div class="reminder_title">\n            ${await translate(PREMIUM_REMINDER[e].title)}\n        </div>\n        <div class="reminder_description">\n            ${await translate(`Please buy <<${t} Plan>> ${PREMIUM_REMINDER[e].description}`)}\n        </div>\n        <div style="display:flex;justify-content:center;gap:20px;width:100%;margin-bottom:20px;">\n            ${s}\n            ${p} \n        </div> \n        <div style="display:flex;margin-top:10px">\n            <div style="font-size:15px; font-weight:1000;margin-right:5px">Already a <span style="color:rgb(0, 154, 136);margin-right:5px">${t} user</span>?</div>\n            <div><span class="clickHere" style="font-weight: 1000;text-decoration: underline;cursor: pointer;">Click here</span> to reload your whatsapp!</div>\n        </div>\n        `, c.appendChild(l), r.appendChild(c), document.getElementById("close_premium_reminder_popup").addEventListener("click", (function ()
	{
		r.removeChild(c)
	})), document.querySelector(".clickHere").addEventListener("click", (() =>
	{
		location.reload()
	}))
}
async function chat_link()
{
	var e = document.getElementsByClassName("chat_link_popup")[0];
	if (e) e.style.display = "block";
	else
	{
		let e = await translate("Generate WhatsApp chat link for your number"),
			t = await translate("Enter the pre-set message that you would receive when your customer clicks on the link"),
			n = `\n        <span id="close_chat_link_popup" style="position: absolute;top: 6px;right: 6px;font-size: 20px;width:14px"><img  class="CtaCloseBtn" src="${close_img_src}" style="width: 100%;" alt="x"></span>\n        <div class="chat_link_title">${e}</div>\n        <div class="chat_link_desc">${t} (Optional)</div>\n        <textarea style="width: 460px;height: 64px;padding: 8px;" type="text" id="add_chat_message"></textarea>\n        <div id="generate_chat_link" class="popup-btn action-green-btn CtaBtn">Generate</div>\n        `,
			a = document.createElement("div");
		a.className = "chat_link_content trial_content", a.innerHTML = n;
		let o = document.createElement("div");
		o.className = "chat_link_popup trial_popup", o.style.width = "min(550px, 95%)", o.appendChild(a), document.querySelector("body").appendChild(o), document.getElementById("close_chat_link_popup").addEventListener("click", (function (e)
		{
			document.getElementsByClassName("chat_link_popup")[0].style.display = "none"
		})), document.getElementById("generate_chat_link").addEventListener("click", (function (e)
		{
			if (isAdvanceFeatureAvailable())
			{
				var t = document.getElementById("add_chat_message").value,
					n = "https://wa.me/" + my_number;
				"" !== t && (t = encodeURIComponent(t), n += "?text=" + t), navigator.clipboard.writeText(n).then((function ()
				{
					alert("Chat link generated and copied: " + n)
				})), document.getElementsByClassName("chat_link_popup")[0].style.display = "none", trackButtonClick("business_chat_link")
			}
			else document.getElementsByClassName("chat_link_popup")[0].style.display = "none", premium_reminder("business_chat_link", "Advance")
		}))
	}
	document.querySelector(".chat_link_title").innerText = await translate("Generate WhatsApp chat link for your number"), document.querySelector(".chat_link_desc").innerText = await translate("Enter the pre-set message that you would receive when your customer clicks on the link (Optional)"), trackButtonView("chat_link_popup")
}
async function review_popup()
{
	// document.querySelector("#review_popup") && o.removeChild(document.querySelector("#review_popup"));
	// let e = await translate("Just take a second to share your positive review :)"),
	// 	t = '\n        <div class="rheader" alt="">\n            <img class="smile_icon" src=' + smile_icon + `></img>\n            <h2 id="review_popup_title">Enjoying WA Sender?</h2>\n        </div>\n        <div class="rcenter">\n            <div class="rtop" id="review_popup_desc">${e}</div>\n            <div class="rbottom">\n                <div id="notNowBtn" class="popup-btn action-white-btn CtaBtn">Not Now</div>\n                <div id="reviewBtn" class="popup-btn action-green-btn CtaBtn">\n                    <a style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center" href="https://chromewebstore.google.com/detail/pro-sender-bulk-whatsapp/nnaaobbghcgbefbkhinikgdolfkgnhfj/reviews" target="_blank">Review</a>\n                </div>\n            </div>\n        </div>\n        ${create_footer_html()}\n    `,
	// 	n = document.createElement("div");
	// n.className = "review_popup_content trial_content", n.style.background = "#62d9c7", n.innerHTML = t;
	// let a = document.createElement("div");
	// a.className = "review_popup", a.appendChild(n);
	// var o = document.querySelector("body");
	// o.appendChild(a), document.querySelector("#notNowBtn").addEventListener("click", (() =>
	// {
	// 	o.removeChild(a)
	// })), document.querySelector("#reviewBtn").addEventListener("click", (() =>
	// {
	// 	o.removeChild(a), localStorage.setItem("rvisited", 1)
	// }))
}

function formatDate(e)
{
	const t = e.split("/"),
		n = parseInt(t[1]),
		a = parseInt(t[0]) - 1,
		o = parseInt(t[2]),
		s = new Date(o, a, n).toLocaleDateString("en-US",
		{
			year: "numeric",
			month: "short",
			day: "numeric"
		}).split(" ");
	return `${s[0]}, ${s[2]}`
}

function sortDatesDescending(e)
{
	return e.sort((function (e, t)
	{
		const n = e.date.split("/").map(Number),
			a = t.date.split("/").map(Number),
			o = new Date(n[2], n[0] - 1, n[1]);
		return new Date(a[2], a[0] - 1, a[1]) - o
	}))
}

function callIfNoOtherPopups(e)
{
	const t = setInterval((() =>
	{
		const n = document.querySelector(".trial_popup"),
			a = document.querySelector(".success_popup"),
			o = document.getElementById("side"),
			s = document.querySelector("#buy_annual_popup");
		n || a || s || !o || (clearInterval(t), e())
	}), 500)
}(isAdvanceFeatureAvailable() || isExpired()) && (premiumUsageObject = {
	...premiumUsageObject,
	multipleAttachment: !1,
	schedule: !1
}), setPremiumUsageObject(),
	function ()
	{
		let e = document.createElement("script");
		e.setAttribute("type", "text/javascript"), e.setAttribute("id", "inject"), e.src = chrome.runtime.getURL("/js/inject.js"), e.onload = function ()
		{
			this.parentNode.removeChild(this)
		}, document.head.appendChild(e)
	}(), window.addEventListener("message", injectMessageListner, !1), init(), document.body.addEventListener("click", (function (e)
	{
		e.target.classList.contains("handle_help_btn") && handle_help()
	})), document.addEventListener("click", (e =>
	{
		if (document.querySelector(".trial_popup"))
		{
			let t = document.querySelectorAll(".trial_popup")[0];
			const n = t.classList.contains("buy_annual_popup");
			t.contains(e.target) || (document.body.removeChild(t), n && chrome.storage.local.set(
			{
				lastShownAnnualPopup: formatToIsoDate(new Date)
			}))
		}
		e.target && "cross_prime" === e.target.id && closePrimeProfile()
	}));
const getDates = async e =>
{
	try
	{
		let t = [],
			n = `${AWS_API.GET_INVOICE_DATES}?email=${e}&phone=${my_number}`;
		const a = await fetch(n);
		t = await a.json(), sortDatesDescending(t), t.map((e => e.date = formatDate(e.date))), chrome.storage.local.set(
		{
			invoiceObject: t
		}), callIfNoOtherPopups(loadBuyAnnualPopup)
	}
	catch (e)
	{
		console.log(e)
	}
}, howToUseData = [
{
	image: how_to_use1,
	content: "Click on the ‘Extensions’ icons at the top right of the chrome window",
	index: 1,
	hasPrev: !1,
	hasNext: !0
},
{
	image: how_to_use2,
	content: "Pin the WA Sender extension icon by clicking on the pin button ",
	index: 2,
	hasPrev: !0,
	hasNext: !0
},
{
	image: how_to_use3,
	content: "Start using the extension by clicking on the WA Sender extension icon",
	index: 3,
	hasPrev: !0,
	hasNext: !0
}];

function changeNavigationColor(e)
{
	0 == e && (document.querySelector(".nav_line_1").classList.contains("active_line_class") && document.querySelector(".nav_line_1").classList.remove("active_line_class"), document.querySelector(".nav_num_2").classList.contains("active_num_class") && document.querySelector(".nav_num_2").classList.remove("active_num_class"), document.querySelector(".nav_line_2").classList.contains("active_line_class") && document.querySelector(".nav_line_2").classList.remove("active_line_class"), document.querySelector(".nav_num_3").classList.contains("active_num_class") && document.querySelector(".nav_num_3").classList.remove("active_num_class")), 1 == e && (document.querySelector(".nav_line_1").classList.contains("active_line_class") || document.querySelector(".nav_line_1").classList.add("active_line_class"), document.querySelector(".nav_num_2").classList.contains("active_num_class") || document.querySelector(".nav_num_2").classList.add("active_num_class"), document.querySelector(".nav_line_2").classList.contains("active_line_class") && document.querySelector(".nav_line_2").classList.remove("active_line_class"), document.querySelector(".nav_num_3").classList.contains("active_num_class") && document.querySelector(".nav_num_3").classList.remove("active_num_class")), 2 == e && (document.querySelector(".nav_line_2").classList.contains("active_line_class") || document.querySelector(".nav_line_2").classList.add("active_line_class"), document.querySelector(".nav_num_3").classList.contains("active_num_class") || document.querySelector(".nav_num_3").classList.add("active_num_class"))
}

function howToUsePopup()
{
	const e = document.createElement("div");
	e.className = "how_to_use_popup";
	let t = 0;
	const n = `\n        <div class="how_to_use_container">\n            <div class="how_to_use_header">\n                <div class="how_to_use_title">\n                    <img style="width: 50px; margin-right:10px;" src=${bulb_icon} alt="" />\n                    <p>How to use</p>\n                </div>\n                <div class="how_to_use_logo">\n                    </div>\n            </div>\n            <div class="how_to_use_body">\n                <div class="how_to_use_text ${1==t?"second":""}">\n                    <p class="ins_number">${howToUseData[t].index}</p>\n                    <p class="ins_text">${howToUseData[t].content}</p>\n                </div>\n                <div class="how_to_use_image">\n                    <img src=${howToUseData[t].image} alt="" />\n                </div>\n            </div>\n            <div class="how_to_use_buttons">\n                <div class="how_to_use_button prev_button CtaBtn">\n                    <img style="width: 22px" src=${arrow_left} alt="" />\n                    Previous\n                </div>\n                <div class="how_to_use_button next_button CtaBtn">\n                    Next\n                    <img style="width: 22px" src=${arrow_right} alt="" />\n                </div>\n                <div class="how_to_use_button navigation_close_button CtaBtn" style="display: none; padding:13px 30px;">\n                    Close\n                </div>\n            </div>\n            <div class="navigation_section">\n                <div class="nav_num nav_num_1 active_num_class">1</div>\n                <div class="nav_line nav_line_1"></div>\n                <div class="nav_num nav_num_2">2</div>\n                <div class="nav_line nav_line_2"></div>\n                <div class="nav_num nav_num_3">3</div>\n            </div>\n        </div>\n    `;
	e.innerHTML = n, document.body.appendChild(e), document.querySelector(".navigation_close_button").addEventListener("click", (() =>
	{
		document.body.removeChild(e), chrome.storage.local.set(
		{
			showHowToUsePopup: !1
		})
	})), document.querySelector(".next_button").addEventListener("click", (() =>
	{
		t != howToUseData.length - 1 && (t++, changeNavigationColor(t), document.querySelector(".how_to_use_text").style.flexDirection = 1 == t ? "row-reverse" : "row", t % 2 == 0 ? (document.querySelector(".how_to_use_body").style.flexDirection = "row", document.querySelector(".how_to_use_popup").style.background = "linear-gradient(270deg, #FFFFFF 90.23%, #009A88 100%)") : (document.querySelector(".how_to_use_body").style.flexDirection = "row-reverse", document.querySelector(".how_to_use_popup").style.background = "linear-gradient(90deg, #FFFFFF 90.23%, #009A88 100%)"), document.querySelector(".ins_number").innerText = howToUseData[t].index, document.querySelector(".ins_text").innerText = howToUseData[t].content, document.querySelector(".how_to_use_image img").src = howToUseData[t].image, document.querySelector(".prev_button").style.display = "flex", t == howToUseData.length - 1 && (document.querySelector(".next_button").style.display = "none", document.querySelector(".navigation_close_button").style.display = "flex"))
	})), document.querySelector(".prev_button").addEventListener("click", (() =>
	{
		0 != t && (t--, changeNavigationColor(t), document.querySelector(".how_to_use_text").style.flexDirection = 1 == t ? "row-reverse" : "row", t % 2 == 0 ? (document.querySelector(".how_to_use_body").style.flexDirection = "row", document.querySelector(".how_to_use_popup").style.background = "linear-gradient(270deg, #FFFFFF 90.23%, #009A88 100%)") : (document.querySelector(".how_to_use_body").style.flexDirection = "row-reverse", document.querySelector(".how_to_use_popup").style.background = "linear-gradient(90deg, #FFFFFF 90.23%, #009A88 100%)"), document.querySelector(".ins_number").innerText = howToUseData[t].index, document.querySelector(".ins_text").innerText = howToUseData[t].content, document.querySelector(".how_to_use_image img").src = howToUseData[t].image, document.querySelector(".next_button").style.display = "flex", document.querySelector(".navigation_close_button").style.display = "none", 0 == t && (document.querySelector(".prev_button").style.display = "none"))
	}))
}

function showHowToUsePopup()
{
	chrome.storage.local.get(["showHowToUsePopup", "no_of_visit"], (e =>
	{
		let t = e.no_of_visit || 0;
		if (0 == e.showHowToUsePopup) return;
		0 == t && chrome.storage.local.set(
		{
			showHowToUsePopup: !0
		});
		const n = setInterval((() =>
		{
			const e = document.getElementById("side"),
				t = document.querySelector(".trial_popup");
			e && !t && (howToUsePopup(), clearInterval(n))
		}), 500)
	}))
}
async function buyAnnualPopup(e, t)
{
	document.querySelector("#buy_annual_popup") && m.removeChild(document.querySelector("#buy_annual_popup"));
	let
	{
		name: n,
		name_code: a,
		currency: o
	} = location_info;
	n = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(a) ? COUNTRY_WITH_SPECIFIC_PRICING[a] : "international";
	const s = "Advance" === plan_type ? "advance_actual_price" : "basic_actual_price",
		i = e || 1;
	let r = PRICING_DATA.buy_annual[s][n],
		c = "";
	"international" == n || "kuwait" == n ? (c = r[0], r = r.substring(1)) : "india" != n && (c = r.substring(0, 4), r = r.substring(4));
	let l = await convertPriceToLocale(r),
		p = await convertPriceToLocale(r * i * 2);
	r = c + r * i * 2;
	const d = `\n        <div class="buy_annual_top_section">\n            <span id="buy_annual_close_icon" class="CtaCloseBtn" style="position: absolute;top: 6px;right: 6px;font-size: 20px;width:14px"><img  class="CtaCloseBtn" src=${close_img_src} style="width: 100%;" alt="x"></span>\n            <div class="buy_annual_heading">\n                <div class="buy_annual_image">\n                    <img src=${man_thinking} alt="image" />\n                </div>\n                <div class="buy_annual_heading_text">\n                    <p class="buy_annual_first_line">\n                        You could save almost <span class="rupee">${"india"==n?"₹":""}</span>${r}!\n                        ${"international"===n&&"USD"!=o?`<span class="converted_price_class">(~${p})</span>`:""}</p>\n                    <p class="buy_annual_second_line">Wondering how?</p>\n                </div>\n            </div>\n            <div class="buy_annual_advice">\n                <div class="buy_annual_advice_text">\n                    <img  style="width:25px; height:25px;" src=${cross_icon_src} alt="" />\n                    <p>You’ve been buying premium <span style="font-weight:bold;"><span style="white-space:nowrap;">@<span class="rupee">${"india"==n?"₹":""}</span>${PRICING_DATA.buy_annual[s][n]}</span>\n                    ${"international"===n&&"USD"!=o?`<span style="white-space:nowrap;font-weight:400 !important;font-size:12px;">(~${l})</span>`:""}\n                    /month</span>\n                        which is overall expensive</p>\n                </div>\n                <div class="buy_annual_advice_text">\n                    <img  style="width:25px; height:25px;" src=${check_icon_src} alt="" />\n                    <p>Simply buy the Annual Plan which gives you <span style="font-weight:bold;">' 2 months worth '</span> free!</p>\n                </div> \n            </div>\n            <div class="buy_annual_recommendation"></div>\n        </div>\n        <div class="buy_annual_divider"></div>\n        <div>${await create_pricing_buttons_html("buy_annual")}</div>\n        ${create_footer_html()}\n    `;
	let u = document.createElement("div");
	u.className = "buy_annual_popup_content trial_content", u.style.background = "#d3d3d3", u.innerHTML = d;
	let _ = document.createElement("div");
	_.className = "buy_annual_popup trial_popup", _.id = "buy_annual_popup", _.appendChild(u);
	let m = document.querySelector("body");
	m.appendChild(_), document.getElementById("buy_annual_close_icon").addEventListener("click", (() =>
	{
		m.removeChild(_), chrome.storage.local.set(
		{
			lastShownAnnualPopup: formatToIsoDate(new Date)
		})
	})), trackButtonView("buy_annual_popup")
}

function getMonthDifference(e, t)
{
	const [n, a] = e.split(", "), [o, s] = t.split(", ");
	return 12 * (parseInt(s) - parseInt(a)) + (getMonthIndex(o) - getMonthIndex(n))
}
callIfNoOtherPopups(showHowToUsePopup);
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthIndex(e)
{
	return monthNames.indexOf(e)
}

function formatToIsoDate(e)
{
	return `${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`
}

function dateDiffInDays(e, t)
{
	const [n, a, o] = e.split("-").map(Number), [s, i, r] = t.split("-").map(Number), c = new Date(n, a - 1, o), l = new Date(s, i - 1, r), p = Math.abs(l - c);
	return Math.ceil(p / 864e5)
}

function showBuyAnnualPopup(e, t)
{
	chrome.storage.local.get(["lastShownAnnualPopup", "plan_duration"], (n =>
	{
		const a = n.lastShownAnnualPopup,
			o = n.plan_duration || "Monthly";
		if (!a && "Monthly" == o && "Advance" != plan_type && "Expired" != plan_type) return buyAnnualPopup(e, t), void chrome.storage.local.set(
		{
			lastShownAnnualPopup: formatToIsoDate(new Date)
		});
		Math.abs(dateDiffInDays(formatToIsoDate(new Date), a)) >= 3 && "Monthly" == o && "Advance" != plan_type && "Expired" != plan_type && (buyAnnualPopup(e, t), chrome.storage.local.set(
		{
			lastShownAnnualPopup: formatToIsoDate(new Date)
		}))
	}))
}

function loadBuyAnnualPopup()
{
	chrome.storage.local.get(["invoiceObject"], (e =>
	{
		const t = e.invoiceObject;
		if (!t) return;
		let n = 0;
		for (let e = 0; e < t.length - 1; e++)
		{
			const a = Math.abs(getMonthDifference(t[e].date, t[e + 1].date));
			if (1 == a) n++;
			else if (a > 1) break
		}
		showBuyAnnualPopup(Math.floor(n / 6) + 1, n)
	}))
}
async function updateReminderPopup()
{
	if (!SHOW_UPDATE_REMINDER_POPUP) return;
	document.querySelector("#update_reminder_popup") && document.querySelector("body").removeChild(document.querySelector("#update_reminder_popup"));
	let e = `\n           <div class="rheader">\n            <h2 id="update_popup_title">New Version Available</h2>\n        </div>\n        <div class="rcenter">\n            <div class="rtop" id="update_popup_desc">${await translate("You can either restart your Chrome to update or you can go to manage Chrome extension and update it.")}</div>\n            <div class="rbottom">\n                <a href="http://chrome://extensions/?id=klfaghfflijdgoljefdlofkoinndmpia" target="_blank">\n                    <div id="okBtn" class="popup-btn action-green-btn CtaBtn">Update</div>\n                </a>\n            </div>\n        </div>\n        ${create_footer_html()}\n    `,
		t = document.createElement("div");
	t.className = "update_reminder_popup_content trial_content", t.style.background = "#62d9c7", t.style.zIndex = "100", t.style.width = "60%", t.innerHTML = e, t.appendChild($($.parseHTML('<span id="close_update" style="position: absolute;top: 12px;right: 12px;font-size: 20px;width:14px"><img class="CtaCloseBtn" src="' + close_img_src + '" style="width: 100%;" alt="x"></span>'))[0]);
	let n = document.createElement("div");
	n.className = "update_reminder_popup", n.id = "update_reminder_popup", n.style.height = "100%", n.style.display = "flex", n.appendChild(t), document.querySelector("body").appendChild(n), document.querySelector("#okBtn").addEventListener("click", (() =>
	{
		document.querySelector("body").removeChild(n)
	})), document.getElementById("close_update").addEventListener("click", (function (e)
	{
		document.querySelector("body").removeChild(n)
	})), document.querySelector("#closePopupBtn").addEventListener("click", (() =>
	{
		document.querySelector("body").removeChild(n)
	}))
}

function getDocumentElement(e, t = !1)
{
	try
	{
		if (DOCUMENT_ELEMENT_SELECTORS[e])
			for (const n of DOCUMENT_ELEMENT_SELECTORS[e])
			{
				const e = t ? document.querySelectorAll(n) : document.querySelector(n);
				if (e) return e
			}
		else console.log("Selector not exists:", e)
	}
	catch (e)
	{
		console.log("Error while finding document element", e)
	}
	return null
}
async function fetchConfigData()
{
	try
	{
		const e = `${AWS_API.GET_CONFIG_DATA}?operation=get-all-config-data`,
			t = await fetch(e),
			n = await t.json(),
			a = n.data;
		if (a && Array.isArray(a))
		{
			const e = createConfigMap(a);
			loadConfigData(e), chrome.storage.local.get(["CONFIG_DATA"], (t =>
			{
				chrome.storage.local.set(
				{
					CONFIG_DATA: e
				})
			}))
		}
		else console.log("Config data not found. Api response:", n)
	}
	catch (e)
	{
		console.log("Error while fetching config data:", e)
	}
}

function createConfigMap(e)
{
	const t = {};
	return e.forEach((e =>
	{
		e.name && null !== e.data && (t[e.name] = e.data)
	})), t
}

function loadConfigData(e)
{
	e.TRIAL_FEATURES && (TRIAL_FEATURES = [...e.TRIAL_FEATURES]), e.PREMIUM_FEATURES && (PREMIUM_FEATURES = [...e.PREMIUM_FEATURES]), e.DID_YOU_KNOW_TIPS && (DID_YOU_KNOW_TIPS = [...e.DID_YOU_KNOW_TIPS]), e.ALL_LANGUAGE_CODES && (ALL_LANGUAGE_CODES = [...e.ALL_LANGUAGE_CODES]), e.HELP_MESSAGES && (HELP_MESSAGES = {
		...HELP_MESSAGES
	}), e.GA_CONFIG && (GA_CONFIG = {
		...e.GA_CONFIG
	}), e.POPUP_DATA && (POPUP_DATA = {
		...e.POPUP_DATA
	}), e.PRICING_DATA && (PRICING_DATA = {
		...e.PRICING_DATA
	}), e.PREMIUM_REMINDER && (PREMIUM_REMINDER = {
		...e.PREMIUM_REMINDER
	}), e.SUCCESS_POPUP_DATA && (SUCCESS_POPUP_DATA = {
		...e.SUCCESS_POPUP_DATA
	}), e.DOCUMENT_ELEMENT_SELECTORS && (DOCUMENT_ELEMENT_SELECTORS = {
		...e.DOCUMENT_ELEMENT_SELECTORS
	}), e.FAQS && (FAQS = {
		...e.FAQS
	}), e.RUNTIME_CONFIG && (RUNTIME_CONFIG = {
		...e.RUNTIME_CONFIG
	}, RUNTIME_CONFIG.reloadInject && window.dispatchEvent(new CustomEvent("PROSS::init",
	{
		detail:
		{
			useOldMethod: RUNTIME_CONFIG.useOldInjectMethod
		}
	}))), "SHOW_UPDATE_REMINDER_POPUP" in e && (SHOW_UPDATE_REMINDER_POPUP = e.SHOW_UPDATE_REMINDER_POPUP)
}



