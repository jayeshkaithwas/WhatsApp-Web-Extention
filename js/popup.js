var customer_email, csv_data = [],
	csv_name = "",
	my_number = null,
	plan_type = "Advance",
	last_plan_type = "Advance",
	popup_numbers = "";
let translatedSendObj, translatedGroupMsgObj, translatedCustomObj, translatedAttachments, translatedContactMsgObj, currentLanguage = "default",
	allLanguageCodes = ALL_LANGUAGE_CODES,
	libphone = libphonenumber,
	country_info = "",
	allGroups = [],
	allContacts = [],
	groups_selected = [],
	contacts_selected = [],
	messageToggleSwitchValue = "numbers",
	isMultipleAccount = !0,
	otherNumbers = ["+911111111111", "+912222222222", "+913333333333", "+911111111111", "+912222222222", "+913333333333", "+911111111111", "+912222222222", "+913333333333", "+911111111111", "+912222222222", "+913333333333", "+911111111111", "+912222222222", "+913333333333", "+911111111111", "+912222222222", "+913333333333", "+911111111111", "+912222222222", "+913333333333", "+911111111111", "+912222222222", "+913333333333"],
	parentEmail = "",
	showAllMultNumbers = !0,
	subscribed_date = null,
	attachment_obj = !1,
	group_obj = !1,
	customization_obj = !1,
	is_excel_uploaded = !1,
	lastScrollPosition = 0,
	lastScrollPosition_contacts = 0,
	selectedAll = !1,
	fetching = !1,
	isMac = navigator.platform.toLowerCase().includes("mac"),
	isLinux = navigator.platform.toLowerCase().includes("linux"),
	location_info = {
		name: "international",
		name_code: "",
		currency: "USD"
	};
async function convertPriceToLocale(e)
{
	const t = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"),
		a = await t.json();
	let
	{
		currency: n
	} = location_info, o = new Intl.NumberFormat("en-US",
	{
		style: "currency",
		currency: n,
		maximumFractionDigits: 0
	}), s = a.usd[n.toLowerCase()];
	return o.format(Math.round(1.02 * s * parseFloat(e)))
}
async function multipleAccountButton()
{
	let
	{
		name: e,
		name_code: t,
		currency: a
	} = location_info;
	return e = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(t) ? COUNTRY_WITH_SPECIFIC_PRICING[t] : "international", `<a href="" target="_blank" class="popup-btn pricing-purple-btn CtaBtn">\n        <span style="white-space:nowrap;">Buy multiple users<br/></span>\n        <span style="white-space:nowrap; color: #fff; font-size: 14px; line-height: 16px;font-weight:bold;display:flex;"><span style="margin-right:3px;">@</span>\n            ${"india"===e?'<span class="rupee">₹</span>':""}\n            <span class="price_class">${MULT25ACCOUNTPRICE[e]}</span>/month\n        </span>\n        ${"international"===e&&"USD"!=a?`<span style="white-space:nowrap; color: #fff; font-size: 12px; line-height: 16px;font-weight:bold;"> \n(~<span class="price_class">${await convertPriceToLocale(MULT25ACCOUNTPRICE[e].substring(1))}</span>/month)\n</span>`:""}\n    </a>`
}
async function basicButton(e = "", t = "", a = "")
{
	let
	{
		name: n,
		name_code: o,
		currency: s
	} = location_info;
	n = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(o) ? COUNTRY_WITH_SPECIFIC_PRICING[o] : "international";
	let c = a;
	return a && "" != a || (c = await convertPriceToLocale(t.substring(1))), "", `<a href="" target="_blank" class="popup-btn pricing-white-btn CtaBtn">\n        Buy Premium<br/>\n        <span style="white-space:nowrap; color: #009a88; font-size: 14px; line-height: 16px;font-weight:bold;display:flex;"><span style="margin-right:3px;">@</span> \n            ${"india"===n?'<span class="rupee">₹</span>':""}\n            <span class="price_class">${t}</span>/month\n        </span>\n        ${"international"===n&&"USD"!=s?`<span style="white-space:nowrap; color: #009a88; font-size: 12px; line-height: 16px;font-weight:bold;">\n(~<span class="price_class">${c}</span>/month)\n</span>`:""}\n    </a>`
}
async function advanceButton(e = "", t = "", a = "")
{
	let
	{
		name: n,
		name_code: o,
		currency: s
	} = location_info;
	n = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(o) ? COUNTRY_WITH_SPECIFIC_PRICING[o] : "international";
	let c = a;
	return a && "" != a || (c = await convertPriceToLocale(t.substring(1))), "Advance" != last_plan_type && "AdvancePromo" != last_plan_type || (e = ""), `<a href="${e}" target="_blank" class="popup-btn pricing-white-btn CtaBtn">\n        Buy Advance<br/>\n        <span style="white-space:nowrap; color: #009a88; font-size: 14px; line-height: 16px;font-weight:bold;display:flex;"><span style="margin-right:3px;">@</span> \n            ${"india"===n?'<span class="rupee">₹</span>':""}\n            <span class="price_class">${t}</span>/month\n        </span>\n        ${"international"===n&&"USD"!=s?`<span style="white-space:nowrap; color: #009a88; font-size: 12px; line-height: 16px;font-weight:bold;"> \n(~<span class="price_class">${c}</span>/month)\n</span>`:""}\n    </a>`
}
async function fetchTranslations(e)
{
	const t = JSON.parse(JSON.stringify(e));
	for (const e of t.steps) e.popover && (e.popover.title = await translate(e.popover.title), e.popover.description = await translate(e.popover.description));
	return t
}

function handleMoreButtons()
{
	const e = $("#tours"),
		t = e.find(".attachment-instructions-btn");
	if (t.length > 3)
	{
		t.slice(3).hide();
		const a = $('<button class="attachment-instructions-btn more-btn"><span class="attachment-instructions-text attachment-instructions CtaBtn">...more</span></button>');
		e.append(a), a.on("click", (function ()
		{
			t.slice(3).addClass("active-class"), a.remove()
		}))
	}
}

function showCustomizeContainer()
{
	const e = document.querySelector(".message-box"),
		t = document.querySelector(".customize_container"),
		a = document.querySelector(".message-box .attachment-instruction-secondary");
	e && (e.style.marginBottom = "0px", e.style.borderRadius = "3px 3px 0px 0px"), a && (a.hidden = "true"), t && (t.style.display = "flex")
}

function hideCustomizationContainer()
{
	const e = document.querySelector(".message-box"),
		t = document.querySelector(".customize_container"),
		a = document.querySelector(".caption_customize_container"),
		n = document.querySelector(".message-box .attachment-instruction-secondary");
	e && (e.style.marginBottom = "10px", e.style.borderRadius = "3px"), n && (n.hidden = !1), t && (t.style.display = "none"), a && (a.style.display = "none"), showCaptionCustomizationContainer(!1)
}

function populateCustomizeData()
{
	column_headers = csv_data[0];
	const e = document.querySelector(".customize_section"),
		t = document.querySelector(".caption_customize_section");
	if (e)
	{
		e.innerHTML = "";
		let t = '\n            <div class="customize_heading">Customizations: </div>\n        ';
		column_headers.forEach(((e, a) =>
		{
			t += `<div class="customize_box CtaBtn">${e}</div>`
		})), e.innerHTML = t;
		document.querySelectorAll(".customize_box").forEach(((e, t) =>
		{
			e.addEventListener("click", (e =>
			{
				var t = document.querySelector("textarea#message").value;
				t += " {{" + e.target.innerText + "}}", document.querySelector("textarea#message").value = t, chrome.storage.local.set(
				{
					popup_message: t
				})
			}))
		}))
	}
	if (t)
	{
		t.innerHTML = "";
		let e = '\n            <div class="customize_heading">Customizations: </div>\n        ';
		column_headers.forEach(((t, a) =>
		{
			e += `<div class="caption_customize_box CtaBtn">${t}</div>`
		})), t.innerHTML = e;
		document.querySelectorAll(".caption_customize_box").forEach(((e, t) =>
		{
			e.addEventListener("click", (async e =>
			{
				let t = await new Promise((e =>
				{
					chrome.storage.local.get(["captionForIndividualAttachment"], (t =>
					{
						e(t.captionForIndividualAttachment || [])
					}))
				}));
				document.querySelectorAll(".caption-input").forEach((a =>
				{
					if (!a.classList.contains("hide"))
					{
						var n = a.id.substring(a.id.search(/\d/));
						return a.value += " {{" + e.target.innerText + "}}", t[n] = a.value, void chrome.storage.local.set(
						{
							captionForIndividualAttachment: t
						})
					}
				}))
			}))
		}))
	}
}

function showCaptionCustomizationContainer(e)
{
	const t = document.querySelector(".caption_customize_container");
	t && (t.style.display = e ? "flex" : "none")
}
async function toggleCaptionCustomizationInputDiv()
{
	const e = document.querySelector(".caption_customization_input_div");
	let t = await new Promise((e =>
	{
		chrome.storage.local.get(["csv_data"], (t =>
		{
			e(t.csv_data || [])
		}))
	}));
	e && (t.length > 0 ? showCaptionCustomizationContainer(!0) : showCaptionCustomizationContainer(!1))
}

function renderItems(
{
	name: e,
	objId: t,
	serizalizeId: a,
	isFirst: n = !1,
	isGroup: o = !0
})
{
	const s = document.querySelector(".groups_display_box");
	let c = o ? groups_selected : contacts_selected,
		l = s.innerHTML;
	(c.length <= 1 || n) && (l = ""), l += `<span class="group_tag CtaBtn" id=${t} data-id-field=${a}>\n            <span class="group">${e}</span>\n            <img class="delete_group_tag" src="./logo/pro-closeBtn.png" title="Remove ${o?"Group":"Contact"}">\n        </span>`, s.innerHTML = l
}

function showItems(e = !0)
{
	const t = document.querySelector("#groups_container");
	t.innerHTML = "";
	let a = e ? groups_selected : contacts_selected,
		n = e ? allGroups : allContacts,
		o = "";
	n.forEach((e =>
	{
		a.includes(e.id._serialized) || (o += `<div class="dropdown-item" id=${e.objId} data-id-field=${e.id._serialized}>${e.name}</div>`)
	})), t.innerHTML = o, document.querySelector(".search_group_input").addEventListener("input", (function ()
	{
		let e = this.value.toLowerCase();
		n.forEach((t =>
		{
			const n = document.querySelector(`#groups_container #${t.objId}`);
			t.name?.toLowerCase().includes(e) && !a.includes(t.id._serialized) ? n?.classList.remove("hide") : n?.classList.add("hide")
		}))
	}));
	document.querySelectorAll("#groups_container .dropdown-item").forEach((n =>
	{
		n.addEventListener("click", (function ()
		{
			let o = this.id,
				s = this.innerText,
				c = this.getAttribute("data-id-field");
			a.includes(c) || (a.push(c), chrome.storage.local.set(
			{
				[e ? "groups_selected" : "contacts_selected"]: a
			}), renderItems(
			{
				name: s,
				objId: o,
				serizalizeId: c,
				isGroup: e
			}), n.classList.add("hide")), 0 === t.clientHeight && document.querySelector(".groups_searchbar").click(), handleDeleteBin()
		}))
	}))
}
async function handleSelectAll()
{
	const e = document.querySelectorAll("#groups_container .dropdown-item"),
		t = document.querySelector("#groups_container");
	let a = "groups" === messageToggleSwitchValue,
		n = a ? allGroups : allContacts;
	if ((a ? groups_selected : contacts_selected).length !== n.length)
	{
		if (t.classList.contains("hide")) fetching = !0, a ? (groups_selected = allGroups.map((e => e.id._serialized)), chrome.storage.local.set(
		{
			groups_selected: groups_selected
		}), selectedAll = !0) : (contacts_selected = allContacts.map((e => e.id._serialized)), chrome.storage.local.set(
		{
			contacts_selected: contacts_selected
		}), selectedAll = !0);
		else
		{
			let n = Array.from(e).filter((e => !e.classList.contains("hide"))).map((e => e.getAttribute("data-id-field")));
			a ? (groups_selected = [...new Set([...groups_selected, ...n])], chrome.storage.local.set(
			{
				groups_selected: groups_selected
			})) : (contacts_selected = [...new Set([...contacts_selected, ...n])], chrome.storage.local.set(
			{
				contacts_selected: contacts_selected
			})), t.classList.add("hide"), document.querySelector(".message-box").classList.remove("hide_visibility")
		}
		renderSelectedItems()
	}
	else
	{
		let e = await translate(`All ${messageToggleSwitchValue} are selected`);
		alert(e)
	}
}

function initvars()
{
	document.getElementById("time_gap_type").style.display = "none", chrome.storage.local.get(["popup_message", "show_advance_options", "time_gap", "time_gap_checked", "time_gap_type", "batch_checked", "batch_size", "batch_gap", "file_name", "csv_data", "customization", "schedule_time", "my_number", "customer_name", "customer_email", "premiumUsageObject", "countOfDaysTranslateUsed", "lastDaySinceTranslateUsed", "attachmentShimmerLastShowed", "countOfDaysAttachmentShimmerShown", "pausedCampaign", "allGroupData", "allContactData", "groups_selected", "contacts_selected", "send_messages_to", "resumeCampaign", "subscribed_date", "linuxInputAttachments", "linuxCSVAttachment", "location_info", "currentLanguage", "pausedCampaignsList"], (function (e)
	{
		if (e.currentLanguage && (currentLanguage = e.currentLanguage), void 0 !== e.popup_message && (document.querySelector("textarea#message").value = e.popup_message), void 0 !== e.schedule_time && (document.querySelector("#schedule_time").value = e.schedule_time), e.allGroupData && (allGroups = e.allGroupData), e.allContactData && (allContacts = e.allContactData), e.subscribed_date && (subscribed_date = e.subscribed_date), void 0 !== e.file_name && "" !== e.file_name && (is_excel_uploaded = !0, set_csv_styles(e.file_name), showCustomizeContainer(), csv_data = e.csv_data))
		{
			csv_data[0];
			populateCustomizeData()
		}
		if ((my_number = void 0 === e.my_number ? null : e.my_number) || (document.getElementById("add_number_popup").style.display = "block", trackButtonView("add_number_popup")), void 0 !== e.plan_type && (plan_type = e.plan_type), void 0 !== e.last_plan_type && (last_plan_type = e.last_plan_type), location_info = e.location_info || location_info, void 0 !== e.customer_email && (customer_email = e.customer_email), loadScheduledCampaigns(e.scheduled_campaigns), scheduleExpiredPopup(), trackEvent("my_number_popup", my_number), isPremium())
		{
			if (document.querySelector(".premium_feature_block").style.display = "flex", e.customer_name)
			{
				let t = e.customer_name.trim().split(" ")[0];
				document.getElementById("user_info_text").innerHTML = `<div class='premium_username' style="font-weight: 700; display: inline; word-break: break-word;">${t}</div> - <div style="display: inline; font-weight: 500;" class="premium_user_plan_type">${plan_type} Premium</div>`
			}
			else document.getElementById("user_info_text").innerHTML = `<div style="display: inline; font-weight: 500; margin-left:10px" class="premium_user_plan_type">${plan_type} Premium</div>`;
			document.getElementById("add_business_img").src = "logo/pro-user-1.png", document.getElementById("premium_support_block").style.display = "block", document.getElementById("non_premium_header_text").style.display = "none", document.getElementById("user_info_text").style.display = "block"
		}
		else document.getElementById("premium_support_block").style.display = "none", document.getElementById("user_info_text").style.display = "none", document.getElementById("non_premium_header_text").style.display = "block", document.getElementById("non_premium_header_text").innerText = getNonPremiumHeaderText();
		if (isAdvancePromo() ? document.querySelector(".what_is_advancepromo_block").style.display = "block" : document.querySelector(".what_is_advancepromo_block").style.display = "none", isPremiumFeatureAvailable())
		{
			if (e.time_gap_checked && (document.querySelector("#time_gap_checked").checked = e.time_gap_checked, document.getElementById("time_gap_type").style.display = "flex", e.time_gap_type && (document.querySelector("#" + e.time_gap_type).checked = !0), "random" == e.time_gap_type ? disableNumberTimeGapInput("sec") : disableNumberTimeGapInput("random")), e.time_gap)
			{
				if ((t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20]).includes(parseInt(e.time_gap)))
				{
					const a = t.indexOf(parseInt(e.time_gap));
					document.querySelector("#slider_time_gap_sec").value = a
				}
				else e.time_gap > 20 ? document.querySelector("#slider_time_gap_sec").value = t.length - 1 : 0 == e.time_gap && (document.querySelector("#slider_time_gap_sec").value = 3);
				document.querySelector("#time_gap_sec").value = e.time_gap
			}
			if (e.batch_checked && (document.querySelector("#batch_checked").checked = e.batch_checked, document.getElementById("batch_info").style.display = "grid"), e.batch_size)
			{
				if ((t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50]).includes(parseInt(e.batch_size)))
				{
					const a = t.indexOf(parseInt(e.batch_size));
					document.querySelector("#slider_batch_size").value = a
				}
				else(e.batch_size > 50 || 0 == e.batch_gap) && (document.querySelector("#slider_batch_size").value = t.length - 1);
				document.querySelector("#batch_size").value = e.batch_size
			}
			if (e.batch_gap)
			{
				var t;
				if ((t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50]).includes(parseInt(e.batch_gap)))
				{
					const a = t.indexOf(parseInt(e.batch_gap));
					document.querySelector("#slider_batch_gap").value = a
				}
				else e.batch_gap > 50 ? document.querySelector("#slider_batch_gap").value = t.length - 1 : 0 == e.batch_gap && (document.querySelector("#slider_batch_gap").value = 13);
				document.querySelector("#batch_gap").value = e.batch_gap
			}
		}
		else e.time_gap_checked && (document.querySelector("#time_gap_checked").checked = e.time_gap_checked, document.getElementById("time_gap_type").style.display = "flex"), document.querySelector("#sec").checked = !0, disableNumberTimeGapInput("random"), document.querySelector("#time_gap_sec").value = 30;
		if (e.my_number && e.my_number.startsWith(62) && !isPremium() && (document.getElementById("live_support_text").hidden = !0, document.getElementById("email_support_text").hidden = !1), e.groups_selected && (groups_selected = e.groups_selected), e.contacts_selected && (contacts_selected = e.contacts_selected), e.send_messages_to && ("groups" == e.send_messages_to ? (messageToggleSwitchValue = "groups", document.querySelector("#message_type_groups").click()) : "contacts" == e.send_messages_to ? (messageToggleSwitchValue = "contacts", document.querySelector("#message_type_contact").click()) : messageToggleSwitchValue = "numbers", void 0 !== e.popup_message && (document.querySelector("#message").value = e.popup_message)), void 0 !== e.premiumUsageObject)
		{
			let t = {
				...e.premiumUsageObject
			};
			e.time_gap_checked && (t = {
				...t,
				timeGap: !0
			}), e.batch_checked && (t = {
				...t,
				batching: !0
			}), chrome.storage.local.set(
			{
				premiumUsageObject: t
			})
		}
		let a = (new Date).toDateString(),
			n = e.lastDaySinceTranslateUsed || "",
			o = e.countOfDaysTranslateUsed || 0;
		n == a || o > 5 ? ($("#language-selector").removeClass("shimmer"), $("#translate-icon").removeClass("shimmer")) : (chrome.storage.local.set(
		{
			countOfDaysTranslateUsed: o + 1
		}), chrome.storage.local.set(
		{
			lastDaySinceTranslateUsed: a
		}));
		const s = e.attachmentShimmerLastShowed || "",
			c = e.countOfDaysAttachmentShimmerShown || 0;
		if (s == a || c > 3 ? $("#add-attachments").removeClass("shimmer") : (chrome.storage.local.set(
			{
				countOfDaysAttachmentShimmerShown: c + 1
			}), chrome.storage.local.set(
			{
				attachmentShimmerLastShowed: a
			})), document.querySelector("#schedule_selector").addEventListener("click", (async function (e)
			{
				chrome.storage.local.get(["scheduled_campaigns"], (function (e)
				{
					loadScheduledCampaigns(e.scheduled_campaigns || []), $("#schedule_container").toggleClass("hide"), $("#schedule_selector").toggleClass("active")
				}))
			})), e.pausedCampaign && 1 == e.pausedCampaign.paused)
		{
			let t = e.pausedCampaignsList;
			t || (t = []);
			let a = e.pausedCampaign;
			t.push(
			{
				...a,
				campaignDate: getTodayDate()
			}), e.pausedCampaignsList = t, e.pausedCampaign = null, chrome.storage.local.set(
			{
				pausedCampaign: null
			}), chrome.storage.local.set(
			{
				pausedCampaignsList: t
			})
		}
		if (e.resumeCampaign && 1 == e.resumeCampaign.isCampaignRunning && e.pausedCampaign)
		{
			e.pausedCampaign.index = e.resumeCampaign.index;
			let t = e.pausedCampaignsList;
			t || (t = []);
			let a = e.pausedCampaign;
			t.push(
			{
				...a,
				campaignDate: getTodayDate()
			}), e.pausedCampaignsList = t, chrome.storage.local.set(
			{
				pausedCampaign: null
			}), chrome.storage.local.set(
			{
				pausedCampaignsList: t
			}), chrome.storage.local.set(
			{
				resumeCampaign:
				{
					isCampaignRunning: !1,
					index: 0
				}
			})
		}
		document.querySelector("#paused_campaign_selector").addEventListener("click", (async function (e)
		{
			chrome.storage.local.get(["pausedCampaignsList"], (function (e)
			{
				let t = (e.pausedCampaignsList || []).filter((e =>
				{
					let t = e.campaignDate;
					return dateDiffInDays(getTodayDate(), t) <= 7
				}));
				loadPausedCampaigns(t), $("#paused_campaign_container").toggleClass("hide"), $("#paused_campaign_selector").toggleClass("active"), chrome.storage.local.set(
				{
					pausedCampaignsList: t
				})
			}))
		})), e.linuxInputAttachments && convertURLToFileAndFireChangeEvent("linuxInputAttachments", "select-attachments", e.linuxInputAttachments), e.linuxCSVAttachment && convertURLToFileAndFireChangeEvent("linuxCSVAttachment", "csv", e.linuxCSVAttachment)
	}))
}

function convertURLToFileAndFireChangeEvent(e, t, a)
{
	const n = a.map((e => dataURLtoFile(e.data, e.name, e.type))),
		o = new DataTransfer;
	n.forEach((e =>
	{
		o.items.add(e)
	}));
	const s = document.getElementById(t);
	s.files = o.files;
	const c = new Event("change",
	{
		bubbles: !0
	});
	s.dispatchEvent(c), chrome.storage.local.set(
	{
		[e]: null
	})
}

function dataURLtoFile(e, t, a)
{
	const n = e.split(","),
		o = a || n[0].match(/:(.*?);/)[1],
		s = atob(n[1]);
	let c = s.length;
	const l = new Uint8Array(c);
	for (; c--;) l[c] = s.charCodeAt(c);
	return new File([l], t,
	{
		type: o
	})
}

function getNonPremiumHeaderText()
{
	if (isAdvancePromo()) return "AdvancePromo Enabled - Explore Features";
	if (!isExpired()) return "Add Business Features - Buy Premium";
	switch (last_plan_type)
	{
	case "Advance":
		return "Advance Expired - Buy Premium";
	case "AdvancePromo":
		return "AdvancePromo Expired - Buy Premium";
	case "Basic":
		return "Basic Plan Expired - Buy Again";
	case "Advance":
		return "Advance Plan Expired - Buy Again";
	default:
		return "Add Business Features - Buy Premium"
	}
}

function handlePausedCampaign(e)
{
	if (!isAdvanceFeatureAvailable()) return chrome.storage.local.set(
	{
		pausedCampaign: null
	}), chrome.storage.local.set(
	{
		pausedCampaignsList: null
	}), chrome.storage.local.set(
	{
		resumeCampaign:
		{
			isCampaignRunning: !1,
			index: 0
		}
	}), sendMessageToBackground(
	{
		type: "show_advance_popup",
		feature: "resume_campaign"
	}), void window.close();
	const
	{
		numbers: t,
		message: a,
		time_gap: n,
		csv_data: o,
		customization: s,
		caption_customization: c,
		random_delay: l,
		batch_size: i,
		batch_gap: r,
		caption: u
	} = e.campaignData, d = e.campaignData.campaign_type, m = e.index;
	chrome.storage.local.set(
	{
		attachmentsData: e.attachmentsData
	}, (function ()
	{
		sendMessageToBackground("group_message" == d ?
		{
			type: "group_message",
			groups: t,
			message: a,
			time_gap: n,
			csv_data: o,
			customization: s,
			caption_customization: c,
			random_delay: l,
			batch_size: i,
			batch_gap: r,
			caption: u,
			startIndex: m,
			paused_report_rows: e.report_rows,
			paused_sent_count: e.sent_count,
			campaign_type: d
		} :
		{
			type: "number_message",
			numbers: t,
			message: a,
			time_gap: n,
			csv_data: o,
			customization: s,
			caption_customization: c,
			random_delay: l,
			batch_size: i,
			batch_gap: r,
			caption: u,
			startIndex: m,
			paused_report_rows: e.report_rows,
			paused_sent_count: e.sent_count,
			campaign_type: d
		}), chrome.storage.local.set(
		{
			pausedCampaign: null
		}), window.close()
	})), chrome.storage.local.set(
	{
		resumeCampaign:
		{
			isCampaignRunning: !1,
			index: 0
		}
	}), trackButtonClick("popupjs_resume_campaign")
}
async function loadPausedCampaigns(e)
{
	if ($("#paused_campaign_container").html(""), e && e.length > 0)
		for (let t = 0; t < e.length; t++)
		{
			let a = e[t].campaign_name || "Campaign-" + Number(t + 1),
				n = formatScheduleDate(e[t].campaignDate);
			$("#paused_campaign_container").append(`\n                <div class="dropdown-item">\n                    <p id="paused_campaign_${t}" class="campaign_name text">\n                        <img src="./logo/pro-excel_icon.png"/>\n                        <span style="color: #009A88;">${a}</span>\n                        <span style="color: #5D6063;">${n}</span>\n                    </p>\n                    <img id="${t}" class="paused_campaign_resume_btn btn CtaBtn" src="./logo/pro-resume_logo.png" style="margin-right:3px;"/>\n                    <img id="${t}" class="paused_campaign_delete_btn btn CtaBtn" src="./logo/pro-delete-icon.png" style="padding:4px 4px 4px 0;margin:0px;" />\n                </div>`)
		}
	else $("#paused_campaign_container").append(`<div class="dropdown-item">${await translate("No paused campaigns")}</div>`);
	$(".paused_campaign_resume_btn").click((function ()
	{
		let t = $(this).attr("id");
		const a = e.filter(((e, a) => a != t));
		chrome.storage.local.set(
		{
			pausedCampaignsList: a
		}), handlePausedCampaign(e[t])
	})), $(".paused_campaign_delete_btn").click((function ()
	{
		let t = $(this).attr("id");
		const a = e.filter(((e, a) => a != t));
		chrome.storage.local.set(
		{
			pausedCampaignsList: a
		}, (function (e)
		{
			loadPausedCampaigns(a)
		}))
	}))
}

function init()
{
	checkVisit(), initvars(), getMessage(), loadConfigData()
}

function checkVisit()
{
	chrome.storage.local.get(["no_of_visit"], (function (e)
	{
		let t = e.no_of_visit || 0;
		chrome.tabs.query(
		{
			url: "*://web.whatsapp.com/*"
		}, (function (e)
		{
			e.length > 0 ? e[0].active || chrome.tabs.update(e[0].id,
			{
				active: !0
			}) : chrome.tabs.create(
			{
				url: "https://web.whatsapp.com"
			})
		})), chrome.storage.local.set(
		{
			no_of_visit: t + 1
		}), trackEvent("no_of_visit", t)
	}))
}

function loadConfigData()
{
	chrome.storage.local.get(["CONFIG_DATA"], (e =>
	{
		e.CONFIG_DATA && (e.CONFIG_DATA.ALL_LANGUAGE_CODES && (allLanguageCodes = e.CONFIG_DATA.ALL_LANGUAGE_CODES), e.CONFIG_DATA.GA_CONFIG && (GA_CONFIG = e.CONFIG_DATA.GA_CONFIG), e.FAQS && (FAQS = e.FAQS))
	}))
}

function sendMessageToBackground(e)
{
	chrome.tabs.query(
	{
		active: !0,
		currentWindow: !0
	}, (function (t)
	{
		chrome.tabs.sendMessage(t[0].id, e)
	}))
}

function show_error(e)
{
	document.getElementById("error_message").style.display = "block", document.getElementById("error_message").innerText = e
}

function reset_error()
{
	document.getElementById("error_message").innerText = "", document.getElementById("error_message").style.display = "none"
}
async function sendMessageFunction()
{
	let e = await new Promise((e =>
	{
		chrome.storage.local.get(["captionForIndividualAttachment"], (t =>
		{
			e(t.captionForIndividualAttachment || [])
		}))
	}));
	chrome.storage.local.set(
	{
		captionForIndividualAttachment: []
	}), document.querySelector(".captionTextAreas").innerHTML = "";
	const t = messageToggleSwitchValue;
	var a = document.querySelector("textarea#numbers").value,
		n = document.querySelector("textarea#message").value,
		o = document.querySelector("#attachments-container").innerText,
		s = !0;
	let c = !0;
	var l, i, r, u = !1;
	if ($("#time_gap_checked").is(":checked") ? ("sec" === $("#time_gap_type input[type='radio']:checked").val() && (l = parseInt(document.querySelector("#time_gap_sec").value)), "random" === $("#time_gap_type input[type='radio']:checked").val() && (l = 4, u = !0)) : l = isPremiumFeatureAvailable() ? parseInt(3) : parseInt(30), $("#batch_checked").is(":checked"))
	{
		if (!isPremiumFeatureAvailable()) return sendMessageToBackground(
		{
			type: "show_premium_popup",
			feature: "batching"
		}), void window.close();
		i = document.querySelector("#batch_size").value, (r = document.querySelector("#batch_gap").value) && (r = parseInt(r))
	}
	var d = getFilteredNumbers(a).split(",").map((e => country_info.dial_code + e));
	if (a || "numbers" != t)
		if (0 != groups_selected.length || "groups" != t)
			if (0 != contacts_selected.length || "contacts" != t)
				if (0 != n.trim().length || 0 != o.length)
				{
					if (chrome.storage.local.get(["dsi854"], (t =>
						{
							let a = t.dsi854;
							e.length > 0 && a < 10 && chrome.storage.local.set(
							{
								icu861: !0
							})
						})), "numbers" == t) sendMessageToBackground(
					{
						type: "number_message",
						numbers: d,
						message: n,
						time_gap: l,
						csv_data: csv_data,
						customization: s,
						caption_customization: c,
						random_delay: u,
						batch_size: i,
						batch_gap: r,
						caption: e
					});
					else if ("groups" == t) sendMessageToBackground(
					{
						type: "group_message",
						groups: groups_selected,
						message: n,
						time_gap: l,
						csv_data: csv_data,
						customization: s,
						caption_customization: c,
						random_delay: u,
						batch_size: i,
						batch_gap: r,
						caption: e
					});
					else
					{
						sendMessageToBackground(
						{
							type: "number_message",
							numbers: contacts_selected.map((e => e.replace("@c.us", ""))),
							message: n,
							time_gap: l,
							csv_data: csv_data,
							customization: s,
							caption_customization: c,
							random_delay: u,
							batch_size: i,
							batch_gap: r,
							caption: e
						})
					}
					window.close()
				}
	else show_error("Please enter message or attachment");
	else show_error("Please select contacts to send");
	else show_error("Please select groups to send");
	else show_error("Please enter numbers to send")
}
async function messagePreparation()
{
	if (reset_error(), (await new Promise((e =>
		{
			chrome.storage.local.get(["attachmentsData"], (t =>
			{
				e(t.attachmentsData || [])
			}))
		}))).length > 3)
	{
		const e = document.querySelector(".confirm-ovelay");
		e.style.display = "flex";
		const t = document.querySelector(".cancelAction"),
			a = document.querySelector(".doAction");
		t.addEventListener("click", (() =>
		{
			e.style.display = "none"
		})), a.addEventListener("click", (() =>
		{
			e.style.display = "none", sendMessageFunction()
		}))
	}
	else sendMessageFunction()
}

function processExcel(e)
{
	var t = XLSX.read(e,
	{
		type: "binary"
	});
	t.SheetNames[0];
	return e = to_json(t)
}

function to_json(e)
{
	var t = {};
	return e.SheetNames.forEach((function (a)
	{
		var n = XLSX.utils.sheet_to_json(e.Sheets[a],
		{
			header: 1
		});
		n.length && (t[a] = n)
	})), JSON.stringify(t, 2, 2)
}

function checkIfValidPhoneNumber(e)
{
	return !/[a-zA-Z]/.test(e)
}

function showInvalidExcelPopup()
{
	trackEvent("invalid_excel", "invalid_excel");
	document.querySelector(".invalid-excel-popup-description").innerHTML = "First column should only contain phone numbers.</br>Check template excel below.";
	const e = document.getElementById("upload-anyway-button");
	e && (e.style.display = "none"), document.getElementById("invalid-excel-popup").classList.remove("hide")
}

function process_sheet_data_and_validate(e, t)
{
	if (e && e.length > 0)
	{
		csv_data = [e[0]];
		for (var a = "", n = e[0], o = 1; o < e.length; o++)
			if (e[o][0])
			{
				if (isValidPhoneNumber = checkIfValidPhoneNumber(e[o][0]), !isValidPhoneNumber) return customization_obj && driver(translatedCustomObj).destroy(), customization_obj = !1, showInvalidExcelPopup(), void unset_csv_styles();
				csv_data.push(e[o]), a += e[o][0], o !== e.length - 1 && (a += ",")
			} document.getElementById("numbers").value = a, populateCustomizeData(), chrome.storage.local.set(
		{
			csv_data: csv_data
		}), chrome.storage.local.set(
		{
			popup_numbers: a
		}), $("#numbers").click(), replaceNumbers(a);
		let s = !0;
		if (t)
			for (const e of n) !isNaN(Number(e)) && e.toString().length >= 10 && (s = !1);
		if (!s)
		{
			let e = document.getElementById("invalid-excel-popup");
			e.classList.remove("hide");
			document.getElementById("upload-anyway-button").addEventListener("click", (() =>
			{
				e.classList.add("hide")
			}))
		}
	}
}

function process_sheet_data(e, t = !0)
{
	var a = e.target.files[0];
	if (a)
	{
		var n = new FileReader;
		n.onload = e =>
		{
			var a = processExcel(e.target.result);
			process_sheet_data_and_validate(a = (a = JSON.parse(a))[Object.keys(a)[0]], t)
		}, n.readAsBinaryString(a)
	}
}

function set_csv_styles(e)
{
	e && (csv_name = e.substring(0, 15), e.length > 15 && (e = csv_name + "..."), $("#campaign-name").val(csv_name), $("#campaign-selector").css("display", "none"), $("#uploaded-csv").prop("hidden", !1).text(e), $("#customization").prop("checked", !0).trigger("change"), is_excel_uploaded = !0, chrome.storage.local.set(
	{
		file_name: csv_name
	}))
}

function unset_csv_styles()
{
	$("#csv").val(""), $("#campaign-name").val(""), $("#campaign-selector").css("display", "flex"), $("#uploaded-csv").prop("hidden", !0).text(""), $("#customization").prop("checked", !1).trigger("change"), is_excel_uploaded = !1, chrome.storage.local.set(
	{
		csv_data: [],
		file_name: ""
	}), csv_data = []
}

function getMessage()
{
	$("#sender").click((function ()
	{
		if ("Expired" == plan_type && ("Basic" == last_plan_type || "Advance" == last_plan_type)) return sendMessageToBackground(
		{
			type: "show_premium_popup",
			feature: "send_message"
		}), void window.close();
		messagePreparation(), trackButtonClick("send_message")
	})), $("#help").click((function ()
	{
		sendMessageToBackground(
		{
			type: "help"
		}), trackButtonClick("help"), window.close()
	})), $("#how_to_use").click((function ()
	{
		trackButtonClick("how_to_use"), "numbers" !== messageToggleSwitchValue && document.querySelector("#message_type_numbers").click(), driver(translatedSendObj).drive()
	})), $("#request_chat_premium").click((function ()
	{
		sendMessageToBackground(
		{
			type: "request_chat_premium"
		}), trackButtonClick("request_chat_premium")
	})), $("#request_zoom_premium").click((function ()
	{
		isAdvanceFeatureAvailable() ? (sendMessageToBackground(
		{
			type: "request_zoom_premium"
		}), trackButtonClick("request_zoom_premium")) : sendMessageToBackground(
		{
			type: "show_advance_popup",
			feature: "zoom_call_support"
		}), window.close()
	})), $("#request_call_premium").click((function ()
	{
		sendMessageToBackground(
		{
			type: "request_call_premium"
		}), trackButtonClick("request_call_premium")
	})), $("#chat_link").click((function ()
	{
		sendMessageToBackground(
		{
			type: "chat_link"
		}), window.close()
	})), $("#select_premium_features").click((async function ()
	{
		document.querySelector(".premium_features_parent_div").classList.add("black_background"), document.getElementById("popup_functionality").style.display = "none", document.getElementById("show_premium_features").style.display = "block", document.getElementById("select_functionality_container").classList.remove("active"), document.getElementById("select_premium_container").classList.add("active"), document.getElementById("add_business_text").style.color = "#fff", document.getElementById("add_business_img").src = "logo/pro-plus-1.png", document.getElementById("ps-logo-right").src = "logo/pro-logo-text.png", (isBasic() || isAdvance()) && (document.querySelector("#transfer_premium_button").style.display = "flex");
		const e = document.querySelector("#show_country_selector");
		if (e)
		{
			! function ()
			{
				const e = document.querySelector("#country-code-input-2"),
					t = country_info.name_code,
					a = {
						separateDialCode: !0,
						autoHideDialCode: !1,
						autoPlaceholder: "off",
						initialCountry: t,
						preferredCountries: "XX" === t ? [t] : ["XX", t],
						autoPlaceholder: "aggressive",
						utilsScript: "library/intlTelInput.utils.js"
					};
				window.intlTelInput(e, a)
			}();
			const t = document.querySelector("#request_transfer_btn");
			t && t.addEventListener("click", (function ()
			{
				const e = document.querySelector("#premium_number_input").value;
				if (!e) return;
				let t = function ()
				{
					const e = document.querySelector("#country-code-input-2"),
						t = window.intlTelInputGlobals.getInstance(e);
					let
					{
						name: a,
						iso2: n,
						dialCode: o
					} = t.getSelectedCountryData();
					return o
				}();
				if ("00" == t) return;
				"52" == t && (t += "1");
				const a = `${t}${e}`;
				a === my_number ? document.querySelector("#transfer_premium_error").style.display = "block" : (document.querySelector("#transfer_premium_error").style.display = "none", sendMessageToBackground(
				{
					type: "transfer_premium",
					message: `Hi, I would like to transfer the premium from +${my_number} to +${a}`
				}), window.close())
			})), e.addEventListener("click", (() =>
			{
				const e = document.querySelector("#premium_country_selector_container");
				e && (e.classList.toggle("hide"), document.querySelector("#my_current_number").innerText = "+" + my_number)
			}))
		}
		if ("Expired" == plan_type)
		{
			let e = getNonPremiumHeaderText() || "";
			e = e.split("-")[0], document.getElementById("plan_details").innerHTML = `<span style="font-weight: 700;">${e}</span> on : <span style="font-weight: 700;">+${my_number}</span>`
		}
		else document.getElementById("plan_details").innerHTML = `<span style="font-weight: 700;">${plan_type} plan</span> enabled on : <span style="font-weight: 700;">+${my_number}</span>`;
		document.getElementById("customer_email").innerHTML = customer_email ? `Registered email : <span style="font-weight: 700;">${customer_email} </span>` : "", isPremium() && (document.getElementById("add_business_img").src = "logo/pro-user-2.png"), changeInputPercentage(), showFaqsSection(), await showBuyPremiumButtons(), chrome.storage.local.get(["plan_duration"], (function (e)
		{
			e.plan_duration && ("Monthly" != e.plan_duration && "Expired" != plan_type || (document.querySelector(".invoice_feature_block").style.display = "flex", getInvoiceData()))
		}))
	})), $("#select_functionality").click((function ()
	{
		document.querySelector(".premium_features_parent_div").classList.remove("black_background"), document.getElementById("popup_functionality").style.display = "block", document.getElementById("show_premium_features").style.display = "none", document.getElementById("select_functionality_container").classList.add("active"), document.getElementById("select_premium_container").classList.remove("active"), document.getElementById("add_business_text").style.color = "#009A88", document.getElementById("add_business_img").src = "logo/pro-plus.png", document.getElementById("ps-logo-right").src = "logo/pro-logo-text-light.png", isPremium() && (document.querySelector(".premium_feature_block").style.display = "flex", document.getElementById("add_business_img").src = "logo/pro-user-1.png")
	})), $("#back_to_functionality").click((function ()
	{
		document.getElementById("popup_functionality").style.display = "block", document.getElementById("show_premium_features").style.display = "none", document.getElementById("select_functionality").style.background = "#62D9C7"
	})), $("#csv").on("click", (function (e)
	{
		isLinux && (sendMessageToBackground(
		{
			type: "create_csv_input"
		}), e.preventDefault(), window.close())
	})), $("#csv").on("change", (async function (e)
	{
		var t = document.getElementById("csv").files[0];
		if (t && (set_csv_styles(t.name), showCustomizeContainer(), showCaptionCustomizationContainer(!0)), "text/csv" == t.type || t.name.endsWith(".csv"))
		{
			process_sheet_data_and_validate(await convertCSVtoExcel(t), !0)
		}
		else process_sheet_data(e);
		trackButtonClick("csv_uploaded")
	})), $("#time_gap_checked").on("change", (function ()
	{
		var e = $("#time_gap_checked").is(":checked"),
			t = e ? "flex" : "none";
		document.getElementById("time_gap_type").style.display = t, chrome.storage.local.set(
		{
			time_gap_checked: e
		}), e && chrome.storage.local.get(["premiumUsageObject"], (function (e)
		{
			if (void 0 !== e.premiumUsageObject)
			{
				let t = {
					...e.premiumUsageObject,
					timeGap: !0
				};
				chrome.storage.local.set(
				{
					premiumUsageObject: t
				})
			}
		}))
	})), $("#batch_checked").on("change", (function ()
	{
		var e = $("#batch_checked").is(":checked"),
			t = e ? "grid" : "none";
		document.getElementById("batch_info").style.display = t, isPremiumFeatureAvailable() && chrome.storage.local.set(
		{
			batch_checked: e
		}), $("#batch_checked").is(":checked") && chrome.storage.local.get(["premiumUsageObject"], (function (e)
		{
			if (void 0 !== e.premiumUsageObject)
			{
				let t = {
					...e.premiumUsageObject,
					batching: !0
				};
				chrome.storage.local.set(
				{
					premiumUsageObject: t
				})
			}
		}))
	})), $("#slider_time_gap_sec").on("change", (function ()
	{
		var e = document.querySelector("#slider_time_gap_sec"),
			t = document.querySelector("#time_gap_sec");
		t.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20][e.value], time_gap = t.value, isPremiumFeatureAvailable() ? chrome.storage.local.set(
		{
			time_gap: time_gap
		}) : (sendMessageToBackground(
		{
			type: "show_premium_popup",
			feature: "time_gap"
		}), window.close())
	})), $("#time_gap_sec").on("change", (function ()
	{
		if (isPremiumFeatureAvailable())
		{
			var e = document.querySelector("#time_gap_sec").value,
				t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];
			if (t.includes(parseInt(e)))
			{
				const a = t.indexOf(parseInt(e));
				document.querySelector("#slider_time_gap_sec").value = a
			}
			else e > 20 ? document.querySelector("#slider_time_gap_sec").value = t.length - 1 : 0 == e && (document.querySelector("#slider_time_gap_sec").value = 3, document.querySelector("#time_gap_sec").value = 3, e = 3);
			chrome.storage.local.set(
			{
				time_gap: e
			})
		}
		else sendMessageToBackground(
		{
			type: "show_premium_popup",
			feature: "time_gap"
		}), window.close()
	})), $("#random").on("change", (function ()
	{
		disableNumberTimeGapInput("sec"), isPremiumFeatureAvailable() || (sendMessageToBackground(
		{
			type: "show_premium_popup",
			feature: "time_gap"
		}), window.close())
	})), $("#sec").on("change", (function ()
	{
		disableNumberTimeGapInput("random")
	})), $("#slider_batch_size").on("change", (function ()
	{
		const e = document.querySelector("#batch_size"),
			t = document.querySelector("#slider_batch_size");
		e.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50][t.value];
		var a = document.querySelector("#batch_size").value;
		chrome.storage.local.set(
		{
			batch_size: a
		})
	})), $("#batch_size").on("change", (function ()
	{
		var e = document.querySelector("#batch_size").value,
			t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50];
		if (t.includes(parseInt(e)))
		{
			const a = t.indexOf(parseInt(e));
			document.querySelector("#slider_batch_size").value = a
		}
		else e > 50 ? document.querySelector("#slider_batch_size").value = t.length - 1 : 0 == e && (document.querySelector("#slider_batch_size").value = t.length - 1, document.querySelector("#slider_batch_size").value = 50, e = 50);
		chrome.storage.local.set(
		{
			batch_size: e
		})
	})), $("#slider_batch_gap").on("change", (function ()
	{
		const e = document.querySelector("#batch_gap"),
			t = document.querySelector("#slider_batch_gap");
		e.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50][t.value];
		var a = document.querySelector("#batch_gap").value;
		chrome.storage.local.set(
		{
			batch_gap: a
		})
	})), $("#batch_gap").on("change", (function ()
	{
		var e = document.querySelector("#batch_gap").value,
			t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50];
		if (t.includes(parseInt(e)))
		{
			const a = t.indexOf(parseInt(e));
			document.querySelector("#slider_batch_gap").value = a
		}
		else e > 50 ? document.querySelector("#slider_batch_gap").value = t.length - 1 : 0 == e && (document.querySelector("#slider_batch_gap").value = 13, e = 30);
		chrome.storage.local.set(
		{
			batch_gap: e
		})
	})), $("#time_gap_type input[type=radio]").on("change", (function (e)
	{
		var t = e.target.value;
		chrome.storage.local.set(
		{
			time_gap_type: t
		})
	})), $("#chat_link_info").click((function ()
	{
		document.getElementById("chat_link_info_popup").style.display = "block"
	})), $(".help_popup_okay").click((function ()
	{
		document.getElementById("help_popup").style.display = "none", chrome.storage.local.get(["fva853", "facc859"], (e =>
		{
			1 == e.facc859 && (isLinux ? (sendMessageToBackground(
			{
				type: "add_attachments"
			}), window.close()) : $("#select-attachments").click(), chrome.storage.local.set(
			{
				facc859: -1
			})), 1 == e.fva853 && chrome.storage.local.set(
			{
				fva853: !1
			})
		}))
	})), $("#chat_link_info_popup_okay").click((function ()
	{
		document.getElementById("chat_link_info_popup").style.display = "none"
	})), $("#numbers").on("change", (function (e)
	{
		var t = document.querySelector("textarea#numbers").value;
		chrome.storage.local.set(
		{
			popup_numbers: t
		}), trackButtonClick("number_changed")
	})), $("#message").on("change", (function (e)
	{
		var t = document.querySelector("textarea#message").value;
		chrome.storage.local.set(
		{
			popup_message: t
		}), trackButtonClick("message_changed")
	})), $("#time_gap").on("change", (function (e)
	{
		document.querySelector("#time_gap").value;
		trackButtonClick("time_gap_chnaged")
	})), $("#customization").on("change", (function (e)
	{
		var t = document.querySelector("#customization").checked;
		chrome.storage.local.set(
		{
			customization: t
		}), trackButtonClick("customization_added"), t && chrome.storage.local.get(["premiumUsageObject"], (function (e)
		{
			if (void 0 !== e.premiumUsageObject)
			{
				let t = {
					...e.premiumUsageObject,
					customisation: !0
				};
				chrome.storage.local.set(
				{
					premiumUsageObject: t
				})
			}
		}))
	})), $("#customized_arr").on("change", (function (e)
	{
		var t = document.querySelector("#customized_arr").value,
			a = document.querySelector("textarea#message").value;
		a += " {{" + t + "}}", document.querySelector("textarea#message").value = a, chrome.storage.local.set(
		{
			popup_message: a
		})
	})), $("#schedule_checkbox").on("change", (function (e)
	{
		e.target.checked ? (document.getElementById("schedule_message_div").hidden = !1, document.getElementById("schedule").hidden = !1, document.getElementById("sender").hidden = !0, document.querySelector("#schedule_day_div").style.display = "flex", document.querySelector("#schedule_time_div").style.display = "flex") : (document.getElementById("schedule_message_div").hidden = !0, document.getElementById("schedule").hidden = !0, document.getElementById("sender").hidden = !1, document.querySelector("#schedule_day_div").style.display = "none", document.querySelector("#schedule_time_div").style.display = "none")
	})), $("#schedule_time").on("change", (function (e)
	{
		var t = document.querySelector("#schedule_time").value;
		chrome.storage.local.set(
		{
			schedule_time: t
		})
	})), $("#survey_click").click((function ()
	{
		document.getElementById("survey").style.display = "none", chrome.storage.local.set(
		{
			survey_click: !0
		}), trackButtonClick("survey_click"), window.open("https://forms.gle/uWMMreyGvkGozURb9", "_blank")
	})), $("#my_number_submit").click((function ()
	{
		var e = document.querySelector("#my_number_code").value,
			t = document.querySelector("#my_number").value;
		e && t && (my_number = ("" + e + t).replace("+", ""), trackButtonClick("my_number_submit"), document.getElementById("add_number_popup").style.display = "none", document.getElementById("confirm_number_popup").style.display = "block", document.getElementById("confirm_my_number").innerText = "+" + my_number)
	})), $("#confirm_number_submit").click((function ()
	{
		document.getElementById("confirm_number_popup").style.display = "none", chrome.storage.local.set(
		{
			my_number: my_number
		}), trackButtonClick("confirm_number_submit"), sendMessageToBackground(
		{
			type: "fetch_plan_details"
		}), window.close()
	})), $("#edit_number_submit").click((function ()
	{
		document.getElementById("confirm_number_popup").style.display = "none", document.getElementById("add_number_popup").style.display = "block", trackButtonClick("edit_number_submit")
	})), $("#unsubscribe").click((function ()
	{
		sendMessageToBackground(
		{
			type: "unsubscribe"
		}), trackButtonClick("unsubscribe")
	})), $("#buy_premium_popup").click((function ()
	{
		trackButtonClick("buy_premium_popup"), window.open("", "_blank")
	})), $("#learn_schedule").click((function ()
	{
		sendMessageToBackground(
		{
			type: "learn_schedule"
		}), trackButtonClick("learn_schedule")
	})), $("#schedule").click((function ()
	{
		if (isAdvanceFeatureAvailable())
		{
			reset_error();
			const d = messageToggleSwitchValue;
			var e, t, a, n = document.querySelector("#schedule_time").value,
				o = document.querySelector("#schedule_day").value,
				s = document.querySelector("textarea#numbers").value,
				c = document.querySelector("textarea#message").value,
				l = document.querySelector("#attachments-container").innerText,
				i = $("#customization").is(":checked"),
				r = !1;
			$("#time_gap_checked").is(":checked") ? ("sec" === $("#time_gap_type input[type='radio']:checked").val() && (e = parseInt(document.querySelector("#time_gap_sec").value)), "random" === $("#time_gap_type input[type='radio']:checked").val() && (e = 4, r = !0)) : e = isPremiumFeatureAvailable() ? parseInt(3) : parseInt(30), document.querySelector("#batch_checked").checked && (t = document.querySelector("#batch_size").value, a = document.querySelector("#batch_gap").value);
			var u = getFilteredNumbers(s).split(",").map((e => country_info.dial_code + e));
			if (!s && "numbers" == d) return void show_error("Please enter numbers to send");
			if (0 == groups_selected.length && "groups" == d) return void show_error("Please select groups to send");
			if (0 == contacts_selected.length && "contacts" == d) return void show_error("Please select contacts to send");
			if (0 == c.trim().length && 0 == l.length) return void show_error("Please enter message or attachment");
			if (!n) return void show_error("Schedule time can't be blank");
			chrome.storage.local.get(["scheduled_campaigns"], (async function (s)
			{
				let l = s.scheduled_campaigns || [],
					m = null,
					p = null;
				if (l && l.length > 0 && (m = l[l.length - 1].campaign_duration, p = l[l.length - 1].end_date), null != m && null != p && convertToTimestamp(p, m) >= convertToTimestamp(o, n))
				{
					let e = document.querySelector("#schedule_campaign_error");
					const t = document.querySelector("#schedule_campaign_error_time");
					e.hidden = !1;
					let a = convertTo12Hour(m);
					return t.innerHTML = formatScheduleDate(p) + " " + a + " ", void setTimeout((() =>
					{
						e.hidden = !0
					}), 1e4)
				}
				if (l && l.length >= 3)
				{
					const e = document.querySelector("#schedule_campaign_error2");
					return e.hidden = !1, void setTimeout((() =>
					{
						e.hidden = !0
					}), 1e4)
				}
				chrome.storage.local.get(["attachmentsData"], (async function (s)
				{
					const m = s.attachmentsData;
					let p = "Campaign-" + l.length + 1,
						{
							time: g,
							date: _
						} = addSecondsToScheduleTime(o, n, calculateCampaignDuration(e, r, t, a, u)),
						h = $("#caption_customization").is(":checked"),
						y = await new Promise((e =>
						{
							chrome.storage.local.get(["captionForIndividualAttachment"], (t =>
							{
								e(t.captionForIndividualAttachment || [])
							}))
						}));
					"numbers" == d ? l.push(
					{
						campaign_name: p,
						numbers: u,
						message: c,
						time_gap: e,
						csv_data: csv_data,
						customization: i,
						schedule_time: n,
						random_delay: r,
						batch_size: t,
						batch_gap: a,
						campaign_duration: g,
						campaign_date: o,
						end_date: _,
						caption_customization: h,
						caption: y,
						attachmentsData: m
					}) : l.push(
					{
						campaign_name: p,
						groups: groups_selected,
						message: c,
						time_gap: e,
						csv_data: csv_data,
						customization: i,
						schedule_time: n,
						random_delay: r,
						batch_size: t,
						batch_gap: a,
						campaign_duration: g,
						campaign_date: o,
						end_date: _,
						caption_customization: h,
						caption: y,
						attachmentsData: m
					}), l.sort(((e, t) => convertToTimestamp(e.campaign_date, e.schedule_time) - convertToTimestamp(t.campaign_date, t.schedule_time))), chrome.storage.local.set(
					{
						scheduled_campaigns: l
					}), sendMessageToBackground("numbers" == d ?
					{
						type: "schedule_message",
						numbers: u,
						message: c,
						time_gap: e,
						csv_data: csv_data,
						customization: i,
						schedule_time: n,
						campaign_date: o,
						random_delay: r,
						batch_size: t,
						batch_gap: a
					} :
					{
						type: "schedule_message",
						groups: groups_selected,
						message: c,
						time_gap: e,
						csv_data: csv_data,
						customization: i,
						schedule_time: n,
						campaign_date: o,
						random_delay: r,
						batch_size: t,
						batch_gap: a
					}), window.close()
				}))
			})), trackButtonClick("schedule")
		}
		else sendMessageToBackground(
		{
			type: "show_advance_popup",
			feature: "schedule"
		}), window.close();
		chrome.storage.local.get(["premiumUsageObject"], (function (e)
		{
			if (void 0 !== e.premiumUsageObject)
			{
				let t = {
					...e.premiumUsageObject,
					schedule: !0
				};
				chrome.storage.local.set(
				{
					premiumUsageObject: t
				})
			}
		}))
	}))
}

function addSecondsToScheduleTime(e, t, a)
{
	let [n, o] = t.split(":"), s = new Date(e);
	s.setHours(n), s.setMinutes(o), s.setSeconds(s.getSeconds() + a), n = s.getHours(), o = s.getMinutes(), a = s.getSeconds(), n = n < 10 ? "0" + n : n, o = o < 10 ? "0" + o : o;
	let c = s.getFullYear(),
		l = s.getMonth() + 1,
		i = s.getDate();
	return l = l < 10 ? "0" + l : l, i = i < 10 ? "0" + i : i,
	{
		date: `${c}-${l}-${i}`,
		time: `${n}:${o}`
	}
}

function convertToTimestamp(e, t)
{
	return new Date(e + "T" + t).getTime()
}

function timeToTimestamp(e)
{
	let [t, a] = e.split(":");
	return (new Date).setHours(parseInt(t), parseInt(a), 0, 0)
}

function convertTo12Hour(e)
{
	let [t, a] = e.split(":"), n = new Date;
	n.setHours(t), n.setMinutes(a);
	let o = t >= 12 ? "PM" : "AM";
	return t %= 12, t = t || 12, `${t}:${a} ${o}`
}

function calculateCampaignDuration(e, t, a, n, o)
{
	let s = 0;
	for (let c = 0; c < o.length; c++)
	{
		let o = e;
		t && (o = 7), a && c % a == 0 && (o = n), 0 === c && (o = 2), s += o
	}
	return s += 900, s
}

function formatScheduleDate(e)
{
	const [t, a, n] = e.split("-");
	return `${n}/${a}/${t}`
}

function hasDateTimePassed(e, t)
{
	let a = new Date(e + "T" + t);
	return new Date > a
}
async function scheduleExpiredPopup()
{
	chrome.storage.local.get(["scheduled_campaigns"], (function (e)
	{
		let t = e.scheduled_campaigns || [];
		for (let e = 0; e < t.length; e++)
		{
			if (hasDateTimePassed(t[e].campaign_date, t[e].schedule_time)) return void showScheduleExpiredPopup(t[e], e)
		}
	}))
}
async function loadScheduledCampaigns(e)
{
	if ($("#schedule_container").html(""), e && e.length > 0)
		for (let t = 0; t < e.length; t++)
		{
			let a = e[t].campaign_name || "Campaign-" + Number(t + 1),
				n = e[t].schedule_time,
				o = formatScheduleDate(e[t].campaign_date);
			$("#schedule_container").append(`\n                <div class="dropdown-item">\n                    <p id="${t}" class="campaign_name text">\n                        <img src="./logo/pro-excel_icon.png"/>\n                        <span style="color: #009A88;">${a}</span>\n                        <span style="color: #5D6063;">${o} ${n}</span>\n                    </p>\n                    <img id="${t}" class="campaign_delete_btn btn CtaBtn" src="./logo/pro-delete-icon.png" />\n                </div>`)
		}
	else $("#schedule_container").append(`<div class="dropdown-item">${await translate("No scheduled campaigns")}</div>`);
	$(".campaign_delete_btn").click((function ()
	{
		let t = $(this).attr("id");
		const a = e[t].timeOutId;
		a && sendMessageToBackground(
		{
			type: "clear_schedule_timeout",
			timeoutId: a
		});
		const n = e.filter(((e, a) => a != t));
		chrome.storage.local.set(
		{
			scheduled_campaigns: n
		}), loadScheduledCampaigns(n)
	}))
}

function get_label()
{
	var e = "";
	return my_number && (e += my_number + " "), plan_type && (e += plan_type), e
}

function trackButtonClick(e)
{
	var t = get_label();
	
}

function trackButtonView(e)
{
	var t = get_label();
	
}

function trackEvent(e, t)
{
	var a = get_label();
	
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

function getFilteredNumbers(e)
{
	let t = e.replace(/\n/g, ",").split(",");
	return t = t.map((e => e.replace(/\D/g, ""))), t = t.filter((e => e.length >= 5 && e.length <= 15)), t.join(",")
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

function getReportDateFormat(e, t = !1)
{
	const a = new Date,
		n = new Date(e),
		o = Math.round(Math.abs((a - n) / 864e5)),
		s = n.getDate(),
		c = s + getDaySuffix(s);
	let l, i = n.toLocaleTimeString("en-US",
	{
		hour: "numeric",
		minute: "numeric"
	});
	return t || o > 1 ? l = `${c} ${n.toLocaleDateString("en-US",{month:"short"})}` : 0 === o ? l = "Today" : 1 === o && (l = "Yesterday"), t ? `(Last Run at ${l} ${i})` : `(Last Run: ${l} ${i})`
}

function download_csv(e, t)
{
	const a = "data:text/csv;charset=utf-8," + e.map((e => e.join(","))).join("\n"),
		n = encodeURI(a),
		o = $("<a>").attr(
		{
			href: n,
			download: t
		}).appendTo("body");
	o[0].click(), o.remove()
}

function getCustomNumberPlaceholder()
{
	let e = "Enter numbers separated by comma or one below the other. Eg. ",
		t = $("#country-code-input").attr("placeholder").replace(/\D/g, "");
	"" === t ? t = "+91 8123456789, +1 2015550123" : t.startsWith("0") && (t = t.substr(1));
	let a = "";
	if ("+91 8123456789, +1 2015550123" != t)
	{
		let n = t.slice(0, -6),
			o = t.slice(-6);
		a = e + t + ", " + (n + o.split("").reverse().join(""))
	}
	else a = e + t;
	return a
}

function addCountryCodeSelector()
{
	const e = document.querySelector("#country-code-input"),
		t = country_info.name_code,
		a = {
			separateDialCode: !0,
			autoHideDialCode: !1,
			autoPlaceholder: "off",
			initialCountry: t,
			preferredCountries: "XX" === t ? [t] : ["XX", t],
			autoPlaceholder: "aggressive",
			utilsScript: "library/intlTelInput.utils.js"
		};
	window.intlTelInput(e, a), updateCountryInfo(), e.addEventListener("countrychange", (() =>
	{
		updateCountryInfo(), refreshNumbers()
	}))
}

function updateCountryInfo()
{
	const e = document.querySelector("#country-code-input"),
		t = window.intlTelInputGlobals.getInstance(e);
	let
	{
		name: a,
		iso2: n,
		dialCode: o
	} = t.getSelectedCountryData();
	"00" === o && (o = ""), country_info = {
		name: a,
		name_code: n.toUpperCase(),
		dial_code: o
	}, chrome.storage.local.set(
	{
		country_info: country_info
	}), $("#numbers-input").attr("placeholder", getCustomNumberPlaceholder())
}

function refreshNumbers()
{
	const e = $("#numbers-display .number-tag .number"),
		t = [];
	e.each((function ()
	{
		let e = $(this).text().trim();
		t.push(e)
	}));
	replaceNumbers(t.join(", "))
}

function replaceNumbers(e)
{
	$("#numbers-display").empty(), $("#numbers-input").val(""), addNumberTags(e)
}

function isBrazilPhoneNumber(e)
{
	return /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{8,9}$/.test(e.replace(/\D/g, ""))
}

function isArgentinianPhoneNumber(e)
{
	return /^(?:\+?549?|0)(?: ?9)? ?(?:11|[2368]\d)(?: ?\d){8}$/.test(e.replace(/\D/g, ""))
}

function isMorrocoPhoneNumber(e, t)
{
	const a = /^(?:(?:\(?(?:00|\\+)(212)\)?[\s]?)?|0)([5-7]\d{8})$/;
	return a.test(e.replace(/\D/g, "")) || a.test(t?.replace(/\D/g, ""))
}

function isValidNumber(e)
{
	let
	{
		dial_code: t,
		name_code: a
	} = country_info, n = {
		isValid: !1,
		nationalNumber: e,
		reason: "INCORRECT COUNTRY CODE"
	};
	const o = e =>
	{
		try
		{
			let t = libphonenumber.parsePhoneNumber("+" + e);
			return t && t.isValid() ? "XX" === a ?
			{
				isValid: !0,
				nationalNumber: e,
				reason: ""
			} : a === t.country ?
			{
				isValid: !0,
				nationalNumber: t.nationalNumber,
				reason: ""
			} : n : n
		}
		catch (t)
		{
			return {
				isValid: !1,
				nationalNumber: e,
				reason: t.message
			}
		}
	};
	let s = o(e),
		c = o(t + e);
	return s.isValid ? s : c.isValid ? c : n
}

function toggleUploadExcelText(e)
{
	const t = document.querySelectorAll(".number-tag").length,
		a = document.querySelector(".upload_excel_text");
	a && t && !e ? a.style.display = "none" : a && !t && e && (a.style.display = "flex")
}

function addNumberTags(e)
{
	const t = getFilteredNumbers(e).split(",");
	let a = "";
	for (let e of t)
		if (e)
		{
			let
			{
				isValid: t,
				nationalNumber: n,
				reason: o
			} = isValidNumber(e);
			a += `\n                <span class="number-tag CtaBtn ${t?"":"invalid"}">\n                    ${t?"":'<span class="invalid-reason" hidden="true">'+o+"</span>"}\n                    <span class="number" title="Edit Number">${n}</span>\n                    <img class="delete-number-tag" src="./logo/pro-closeBtn.png" title="Remove Number">\n                </span>`
		} $("#numbers-display").append(a), updateNumbersAndDisplay(), toggleUploadExcelText(!1)
}

function editNumberTag(e)
{
	const t = $(e).text(),
		a = $(e).parent(".number-tag"),
		n = $(e).width() + 7 + "px",
		o = $(`<input type="text" class="number-tag-input" maxlength="16" style="max-width:${n};">`);
	a.html(o), a.addClass("active-input"), a.removeClass("CtaBtn"), o.val(t), o.focus(), o.on("blur keydown keyup", (function (e)
	{
		if (e.keyCode && ![13, 188].includes(e.keyCode)) return;
		let n = getFilteredNumbers($(this).val()).split(",")[0];
		if (n)
		{
			is_excel_uploaded && removeNumbers();
			let
			{
				isValid: e,
				nationalNumber: o,
				reason: s
			} = isValidNumber(n);
			for (let e = 0; e < csv_data.length; e++)
				if (csv_data[e][0] && csv_data[e][0].toString().includes(t))
				{
					csv_data[e][0] = parseInt(n);
					break
				} chrome.storage.local.set(
			{
				csv_data: csv_data
			}), a.toggleClass("invalid", !e), a.removeClass("active-input"), a.addClass("CtaBtn"), a.html(`\n                ${e?"":'<span class="invalid-reason" hidden="true">'+s+"</span>"}\n                <span class="number" title="Edit Number">${o}</span>\n                <img class="delete-number-tag" src="./logo/pro-closeBtn.png" title="Remove Number">\n            `)
		}
		else $(this).parent(".number-tag").remove();
		updateNumbersAndDisplay()
	}))
}

function updateNumbersAndDisplay()
{
	const e = $("#numbers-display .number-tag .number"),
		t = [];
	e.each((function ()
	{
		let e = $(this).text().trim();
		t.push(e)
	})), $("#numbers").val(t.join(", ")), $("#numbers").trigger("change");
	let a = $(".number-tag.invalid").length;
	Number(a) > 500 && (a = "500+"), $("#invalid-numbers").css("display", a ? "flex" : "none"), $("#invalid-count").text(a), $("#delete-all-numbers").css("display", t.length ? "block" : "none"), $("#numbers-input").attr("placeholder", t.length ? "" : getCustomNumberPlaceholder()), $("#numbers-display").animate(
	{
		scrollTop: $("#numbers-display")[0].scrollHeight
	}, 500)
}

function removeNumbers()
{
	unset_csv_styles(), hideCustomizationContainer(), toggleUploadExcelText(!0)
}

function handleDeleteBin()
{
	$("#delete-all").css("display", "groups" === messageToggleSwitchValue ? groups_selected.length > 0 ? "block" : "none" : contacts_selected.length > 0 ? "block" : "none")
}
async function translate(e, t = "en", a = currentLanguage)
{
	return null == e || 0 === e.trim().length ? "" : new Promise((n =>
	{
		chrome.storage.local.get(["translatedCache"], (async function (o)
		{
			const s = o.translatedCache ||
			{};
			if (s[e] && s[e][a]) n(s[e][a]);
			else
			{
				const o = await translateAPI(e, t, a);
				s[e] || (s[e] = {}), s[e][a] = o, chrome.storage.local.set(
				{
					translatedCache: s
				}, (function ()
				{
					n(o)
				}))
			}
		}))
	}))
}
async function translateAPI(e, t = "en", a = currentLanguage)
{
	let n = e => e.replaceAll(/<<(.*?)>>/gi, '<span class="styled_text">$1</span>');
	if (null == e || 0 === e.trim().length) return "";
	if ("default" === a || a === t) return n(e);
	const o = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${t}&tl=${a}&dt=t&q=${encodeURI(e)}`;
	return await new Promise((t =>
	{
		try
		{
			$.getJSON(o, (function (e)
			{
				let a = e[0].map((e => e[0])).join(" ");
				t(n(a))
			}))
		}
		catch (a)
		{
			console.log("Translation Error:", a), t(n(e))
		}
	}))
}

function createOption(e, t, a = !1, n = !1)
{
	let o = document.createElement("option");
	return o.text = e, o.value = t, o.selected = a, o.disabled = n, o
}

function getFet(e)
{
	let t;
	return "groupContactExport" == e && (t = "Export Group Contacts"), "customisation" == e && (t = "Customization"), "batching" == e && (t = "Batching"), "timeGap" == e && (t = "Time Gap"), "stop" == e && (t = "Stop"), "quickReplies" == e && (t = "Quick Replies"), "schedule" == e && (t = "Schedule"), "multipleAttachment" == e && (t = "Multiple Attachment"), "attachment" == e && (t = "Attachment"), "caption" == e && (t = "Caption"), t
}

function changeInputPercentage()
{
	chrome.storage.local.get(["premiumUsageObject"], (async function (e)
	{
		let t, a, n = e.premiumUsageObject,
			o = 0,
			s = null,
			c = null,
			l = null;
		for (const e in n)
			if (1 == n[e]) o++;
			else if ("lastDate" != e && "lastMonth" != e)
		{
			let t = getFet(e);
			null == s ? s = t : null == c ? c = t : null == l && (l = t)
		}
		isAdvance() ? a = 10 : isBasic() ? a = 8 : (o = 0, a = 10);
		let i = o / a * 100;
		isPremium() || (i = 0), document.getElementsByClassName("premium-utlisation-precentage")[0].innerText = `${i}%`;
		let r = 100 - i;
		document.getElementById("pie").style.backgroundImage = `conic-gradient(#000 ${r.toString()}%, #009188 0%)`;
		let
		{
			name: u,
			name_code: d,
			currency: m
		} = location_info;
		u = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(d) ? COUNTRY_WITH_SPECIFIC_PRICING[d] : "international";
		"Basic" == last_plan_type ? pricing_link = `` : "Advance" == last_plan_type && (pricing_link = ``), t = 100 == i ? `<p>${await translate("Congrats! Your premium features utilisation is at 100%")}</p>` : isPremium() ? `\n            <p>\n                <span style="color: #FFA500">Alert: </span>\n                <span>${await translate("You are not using all the features you have paid for! You have used "+i+"% of the paid features in the last week. Please use features like ")}</span>\n                <span style="color: #009A88; font-weight: 800;">${null!=s?`'${s}'`:""}</span> \n                <span style="color: #009A88; font-weight: 800;">${null!=c?`, '${c}'`:""}</span>\n                <span style="color: #009A88; font-weight: 800;">${null!=l?` and '${l}'`:""} </span> \n                <span>${await translate("to utilise premium to the fullest. Click on ")}</span>\n                <span class="CtaBtn" id="premium_help" style="text-decoration: underline; cursor: pointer;">${await translate("Live Support")}</span> \n                <span>${await translate(" to understand these features in detail")}</span>\n            </p>` : `\n            <p>\n                <span>${await translate("Your premium utilisation is at "+i+"%. Please purchase premium to utilise all the features.")}</span>\n                <span>${await translate("To checkout pricing")} </span>\n                <a class="CtaBtn" href="" target="_blank" style="color: #009A88; font-weight: 800;">${await translate("Click Here")}</a>  -\n                <span style="color: #2758D4">${await translate("Discount now available")}</span>\n            </p>`, document.getElementById("premium_utilisation_text").innerHTML = t, $("#premium_help").click((function ()
		{
			sendMessageToBackground(
			{
				type: "help"
			}), trackButtonClick("help"), window.close()
		}))
	}))
}
async function getMultipleAccountsData()
{
	chrome.storage.local.get(["multipleAccountsData"], (async function (e)
	{
		if (!e || !e?.isFetchedToday || subscribed_date == getTodayDate()) try
		{
			await fetch("api",
			{
				method: "POST",
				headers:
				{
					"Content-Type": "application/json"
				},
				body: JSON.stringify(
				{
					email: parentEmail
				})
			})
		}
		catch (e)
		{
			console.log("Error while fetching multiple accounts data", e)
		}
	}))
}

function showMultipleAccountSection()
{
	if (getMultipleAccountsData(), !isMultipleAccount) return;
	const e = document.querySelector(".mult_account_block");
	e.classList.remove("hide");
	let t = "",
		a = "",
		n = '<div style="color:#fff;display:flex;justify-content:flex-start;align-items:center;gap:5px;flex-wrap:wrap;">\n            <p style="margin:0px !important;">Other numbers in the plan :</p>';
	t = n;
	for (let e = 0; e < 5; e++) t += `<span class="mult_num_tag" style="background:#009a88 !important">${otherNumbers[e]}</span>`;
	t += '<span class="mult_show_more_section">... <span class="show_all_mult_numbers" style="cursor:pointer;text-decoration:underline;">show more</span></span></div>', t += "</div>", a = n;
	for (let e = 5; e < otherNumbers.length; e++) a += `<span class="mult_num_tag" style="background:#009a88 !important">${otherNumbers[e]}</span>`;
	a += '<span class="mult_show_more_section"><span class="show_all_mult_numbers" style="cursor:pointer;text-decoration:underline;">show less</span></span></div>', a += "</div>", e.innerHTML = t, document.querySelector(".mult_show_more_section").addEventListener("click", (function ()
	{
		showAllMultNumbers = !showAllMultNumbers, e.innerHTML = showAllMultNumbers ? t : a, document.querySelector(".show_all_mult_numbers").addEventListener("click", (function ()
		{
			showAllMultNumbers = !showAllMultNumbers, showMultipleAccountSection()
		}))
	}))
}

function showFaqsSection()
{
	const e = document.querySelector(".premium_feature_faq");
	if (!e) return;
	let t = "";
	FAQS.forEach(((e, a) =>
	{
		t += `\n            <div class="premium_feature_block">\n                <div class="faq_question_block">\n                    <p class="faq_question">${a+1}) ${e.question}</p>\n                    <img src="logo/pro-dropdown_icon.png" />\n                </div>\n                <p class="faq_answer">${e.answer}</p>\n            </div>\n            `
	})), e.innerHTML = t;
	const a = document.querySelectorAll(".faq_question_block");
	a.length > 0 && a.forEach(((e, t) =>
	{
		e.addEventListener("click", (function ()
		{
			const t = e.nextElementSibling;
			"block" == t.style.display ? (t.style.display = "none", e.children[1].style.transform = "rotate(0deg)") : (t.style.display = "block", e.children[1].style.transform = "rotate(180deg)")
		}))
	}))
}
async function showBuyPremiumButtons()
{
	let e;
	if (e = "Advance" == last_plan_type || "Advance" == plan_type ? PRICING_DATA.free_trial_expired : PRICING_DATA.premium_expired, !e) return "";
	let t = document.querySelector("#buy_premium_block"),
		a = `\n            <div class="premium_features_divider">\n<p style="z-index: 1000; color: #fff; margin: 0px; margin-left: 16px;">Buy ${"Basic"==plan_type||"Advance"==plan_type?"Multiple Users":"Premium"} :</p>\n        </div>`,
		n = !0,
		o = !1;
	"Advance" == last_plan_type && (n = !1, o = !0), "Basic" != plan_type && "Advance" != plan_type || (n = !1, o = !1);
	let
	{
		name: s,
		name_code: c,
		currency: l
	} = location_info;
	s = Object.keys(COUNTRY_WITH_SPECIFIC_PRICING).includes(c) ? COUNTRY_WITH_SPECIFIC_PRICING[c] : "international";
	let i = ``,
		r = e.advance_price[s],
		u = e.basic_price[s],
		d = await convertPriceToLocale(r.substring(1)),
		m = await convertPriceToLocale(u.substring(1)),
		p = await basicButton(i + "basic", u, m),
		g = await advanceButton(i + "advance", r, d);
	n && (a += p), o && (a += g), a += await multipleAccountButton(), t.innerHTML = a
}
async function getInvoiceData()
{
	chrome.storage.local.get(["invoiceObject"], (function (e)
	{
		let t = [];
		const a = e.invoiceObject;
		t = null == a ? [] : a;
		const n = document.getElementById("invoice_input");
		let o = "";
		t.length > 0 ? (t.map((e => o += `<option value="${e.date}">${e.date}</option>`)), document.getElementById("download_invoice_button").href = t[0]?.invoice_pdf_url) : o = '<option value="invoice_not_found">No Receipt Found</option>', "" == o && (o = '<option value="invoice_not_found">No Receipt Found</option>'), n.innerHTML = o, n.addEventListener("change", (e =>
		{
			const a = e.target.value,
				n = t.find((e => e.date == a));
			n && (document.getElementById("download_invoice_button").href = n.invoice_pdf_url)
		}));
		const s = document.getElementById("invoice_button_loader"),
			c = document.getElementById("invoice_button_text");
		document.getElementById("download_invoice_button").addEventListener("click", (() =>
		{
			s.style.display = "flex", c.style.display = "none", setTimeout((() =>
			{
				const e = document.getElementById("invoice_button_loader"),
					t = document.getElementById("invoice_button_text");
				e && t && (e.style.display = "none", t.style.display = "flex")
			}), 5e3)
		}))
	}))
}
async function makeNewDesignResponse(e)
{
	try
	{
		const t = await fetch("https://sheetdb.io/api/v1/wbzt6s0lud7bg",
		{
			method: "post",
			headers:
			{
				"Content-Type": "application/json"
			},
			body: JSON.stringify([
			{
				"Contact Number": my_number,
				"Yes/No": e,
				"Date/time": (new Date).toLocaleString("en-in")
			}])
		});
		await t.json()
	}
	catch (e)
	{
		console.log("error from sheetdb api call", e)
	}
}
async function showNewDesignReviewButtons()
{
	chrome.storage.local.get(["campaignNumber", "newDesignLiked", "newDesignSessions"], (function (e)
	{
		let t = e.campaignNumber,
			a = e.newDesignLiked,
			n = e.newDesignSessions;
		null != e.newDesignLiked && null != e.newDesignLiked || (chrome.storage.local.set(
		{
			newDesignLiked: !1
		}), a = !1), null != e.newDesignSessions && null != e.newDesignSessions || (chrome.storage.local.set(
		{
			newDesignSessions: 0
		}), n = 0);
		if (t && !a && n < 10)
		{
			const e = setInterval((() =>
			{
				const t = document.querySelector(".new_popup_question_strip");
				if (t)
				{
					clearInterval(e), t.style.display = "flex", t.hidden = !1;
					const a = document.querySelector(".question_yes_button"),
						o = document.querySelector(".question_no_button");
					a.addEventListener("click", (async () =>
					{
						await makeNewDesignResponse("Yes"), chrome.storage.local.set(
						{
							newDesignLiked: !0
						}), document.body.removeChild(t)
					})), o.addEventListener("click", (async () =>
					{
						await makeNewDesignResponse("No"), chrome.storage.local.set(
						{
							newDesignLiked: !0
						}), document.body.removeChild(t)
					})), chrome.storage.local.set(
					{
						newDesignSessions: n + 1
					})
				}
			}), 200)
		}
	}))
}

function elementsToBeHighlighted()
{
	const e = document.querySelector(".numbers-box"),
		t = document.querySelector(".message-box"),
		a = document.querySelector(".numbers-box .text_title"),
		n = document.querySelector(".message-box .text_title"),
		o = document.querySelector(".action_buttons_div"),
		s = document.querySelectorAll(".numbers-box .navigation_container"),
		c = document.querySelectorAll(".message-box .navigation_container"),
		l = document.querySelectorAll(".action_buttons_div .navigation_container"),
		i = document.querySelector("#report-box"),
		r = document.getElementById("sender");
	return [
	{
		element: e,
		element2: a,
		child: s
	},
	{
		element: t,
		child: c,
		element2: n,
		element6: document.querySelector(".tooltip-popup-container")
	},
	{
		element: o,
		child: l,
		element3: i,
		element5: r
	}]
}

function highlightIndexedSection(e)
{
	elementsToBeHighlighted().forEach(((t, a) =>
	{
		e == a ? (t.element.classList.add("focus_element"), t.element2?.classList.add("title_focus"), t.element3?.classList.add("reduce_opacity"), t.element4?.classList.add("reduce_opacity"), t.element5?.classList.add("focus_border"), t.element6?.classList.add("display_none_class"), t.child.forEach((e =>
		{
			e.hidden = !1
		}))) : (t.element.classList.remove("focus_element"), t.element2?.classList.remove("title_focus"), t.element3?.classList.remove("reduce_opacity"), t.element4?.classList.remove("reduce_opacity"), t.element5?.classList.remove("focus_border"), t.element6?.classList.remove("display_none_class"), t.child.forEach((e =>
		{
			e.hidden = !0
		})))
	}));
	const t = document.querySelector(".tooltip-popup-container");
	t && (1 == e || 2 == e ? t.classList.add("display_none_class") : t.classList.remove("display_none_class"))
}

function scrollToSection(e)
{
	let t = null;
	0 == e ? window.scrollTo(
	{
		top: 0,
		behavior: "smooth"
	}) : t = 1 == e ? document.querySelector(".message-box") : document.querySelector(".action_buttons_div"), t && t.scrollIntoView(
	{
		behavior: "smooth"
	})
}

function startNavigationTour()
{
	let e = 0;
	const t = document.querySelector(".background_overlay");
	if (t)
	{
		t.hidden = !1;
		const a = document.querySelector(".how_to_use_buttons"),
			n = document.querySelector(".how_to_use_left"),
			o = document.querySelector(".how_to_use_right");
		a && (a.style.display = "flex", a.hidden = !1, n.style.display = "none", n.hidden = !0), scrollToSection(e), highlightIndexedSection(e), n.addEventListener("click", (() =>
		{
			e--, e = Math.max(Number(e), 0), highlightIndexedSection(e), 0 == e && (n.hidden = !0, n.style.display = "none"), o.innerHTML = '<span>Next</span><img src="logo/pro-arrow-right.png" alt="left_arrow">', scrollToSection(e)
		})), o.addEventListener("click", (() =>
		{
			if (e++, e > 2) return e = 0, t.hidden = !0, a.hidden = !0, a.style.display = "none", o.innerHTML = '<span>Next</span><img src="logo/pro-arrow-right.png" alt="left_arrow">', highlightIndexedSection(3), void scrollToSection(0);
			highlightIndexedSection(e), 2 == e && (o.innerHTML = "<span>Close</span>"), n.hidden = !1, n.style.display = "flex", scrollToSection(e)
		}))
	}
}

function startNavigationTourOnFirstVisit()
{
	const e = setInterval((async () =>
	{
		const t = document.querySelector(".numbers-box");
		translatedSendObj = await fetchTranslations(sendObj), t && (clearInterval(e), chrome.storage.local.get(["no_of_visit"], (function (e)
		{
			1 == e.no_of_visit && driver(translatedSendObj).drive()
		})))
	}), 500)
}

function getCurrentTimein24HourFormat()
{
	let e = new Date,
		t = e.getHours(),
		a = e.getMinutes();
	return t = t < 10 ? "0" + t : t, a = a < 10 ? "0" + a : a, `${t}:${a}`
}

function getCurrentDate()
{
	let e = new Date,
		t = e.getFullYear(),
		a = e.getMonth() + 1,
		n = e.getDate();
	return a = a < 10 ? "0" + a : a, n = n < 10 ? "0" + n : n, `${t}-${a}-${n}`
}

function showScheduleExpiredPopup(e, t)
{
	const a = document.querySelector(".schedule_expired_popup_container");
	a && document.body.removeChild(a);
	const n = document.createElement("div");
	n.className = "schedule_expired_popup_container", n.innerHTML = `<div class="schedule_popup_title">\n    <img src="logo/pro-clock.png" alt="" />\n    <p>Reminder: Scheduled campaign not sent</p>\n    </div>\n    <div class="schedule_popup_content">\n    <p>Your campaign scheduled at <span class="schedule_date_time">${formatScheduleDate(e.campaign_date)} ${convertTo12Hour(e.schedule_time)}</span> <br /> is not send.</p>\n    <div class="schedule_popup_buttons_container">\n                <button id="send_schedule_btn" class="CtaBtn" style="background:#fff; color:#009a88; border:2px solid #009a88">Send now</button>\n                <button id="reschedule_btn" class="CtaBtn" style="background:#009a88; color:#fff; border: 2px solid #fff">Reschedule</button>\n                <button id="delete_schedule_btn" class="CtaBtn" style="color:red; border:2px solid red; background:#fff">Delete</button>\n            </div>\n        </div>\n        <div class="popup-footer">\n            <div class="popup-footer-container">\n                <div class="logo-div">\n                    <img class="logo-icon" src="logo/pro-logo-img.png" alt="Logo"/>\n                    <img class="logo-text" src="logo/pro-logo-text.png" alt="Logo Text"/>\n                </div>\n                <div class="contact-div">\n                    <p>Any questions?</p>\n                    <a class="handle_help_btn CtaBtn">Contact Support</a>\n                </div>\n            </div>\n        </div>\n        `, document.body.appendChild(n);
	const o = document.querySelector(".background_overlay");
	o && (o.hidden = !1);
	const s = document.getElementById("send_schedule_btn"),
		c = document.getElementById("reschedule_btn"),
		l = document.getElementById("delete_schedule_btn");
	s.addEventListener("click", (() =>
	{
		const
		{
			numbers: a,
			message: n,
			time_gap: o,
			csv_data: s,
			customization: c,
			random_delay: l,
			batch_size: i,
			batch_gap: r,
			caption_customization: u,
			caption: d
		} = e;
		let m = getCurrentTimein24HourFormat(),
			p = getCurrentDate();
		chrome.storage.local.get(["scheduled_campaigns"], (function (e)
		{
			const g = e.scheduled_campaigns || [];
			g.splice(t, 1);
			let _ = "Campaign-" + t,
				{
					time: h,
					date: y
				} = addSecondsToScheduleTime(p, m, calculateCampaignDuration(o, l, i, r, a));
			g.push(
			{
				campaign_name: _,
				numbers: a,
				message: n,
				time_gap: o,
				csv_data: s,
				customization: c,
				caption_customization: u,
				schedule_time: m,
				random_delay: l,
				batch_size: i,
				batch_gap: r,
				campaign_duration: h,
				campaign_date: p,
				end_date: y,
				caption: d
			}), g.sort(((e, t) => convertToTimestamp(e.campaign_date, e.schedule_time) - convertToTimestamp(t.campaign_date, t.schedule_time))), chrome.storage.local.set(
			{
				scheduled_campaigns: g
			}), sendMessageToBackground(
			{
				type: "schedule_message",
				numbers: a,
				message: n,
				time_gap: o,
				csv_data: s,
				customization: c,
				schedule_time: m,
				campaign_date: p,
				random_delay: l,
				batch_size: i,
				batch_gap: r
			}), window.close()
		}))
	})), c.addEventListener("click", (() =>
	{
		chrome.storage.local.get(["scheduled_campaigns"], (function (e)
		{
			const a = e.scheduled_campaigns || [];
			a.splice(t, 1), chrome.storage.local.set(
			{
				scheduled_campaigns: a
			}), o.hidden = !0, document.body.removeChild(n);
			const s = document.getElementById("schedule_checkbox");
			s && (s.checked = !0, document.getElementById("schedule").hidden = !1, document.getElementById("sender").hidden = !0, document.querySelector("#schedule_day_div").style.display = "flex", document.querySelector("#schedule_time_div").style.display = "flex")
		}))
	})), l.addEventListener("click", (() =>
	{
		chrome.storage.local.get(["scheduled_campaigns"], (function (e)
		{
			const a = e.scheduled_campaigns || [];
			a.splice(t, 1), chrome.storage.local.set(
			{
				scheduled_campaigns: a
			}), o.hidden = !0, document.body.removeChild(n)
		}))
	}))
}
async function renderSelectedItems()
{
	const e = "groups" === messageToggleSwitchValue ? allGroups : allContacts,
		t = "groups" === messageToggleSwitchValue ? groups_selected : contacts_selected;
	let a = 0;
	const n = document.querySelector(".groups_display_box");
	("groups" === messageToggleSwitchValue ? groups_selected : contacts_selected).length, n.innerHTML = "", requestAnimationFrame((function o()
	{
		const s = document.createDocumentFragment();
		for (let n = 100 * a; n < Math.min(e.length, 100 * (a + 1)); n++)
		{
			const a = e[n],
				o = t.includes(a.id._serialized);
			if (selectedAll || o && !selectedAll)
			{
				const e = document.createElement("span");
				e.className = "group_tag CtaBtn", e.id = a.objId, e.setAttribute("data-id-field", a.id._serialized), e.innerHTML = `\n                    <span class="group">${a.name}</span>\n                    <img class="delete_group_tag" src="./logo/pro-closeBtn.png" title="Remove ${"groups"===messageToggleSwitchValue?"Group":"Contact"}">\n                `, s.appendChild(e)
			}
		}
		n.appendChild(s), a++, 100 * a < e.length ? requestAnimationFrame(o) : selectedAll && (selectedAll = !1, fetching = !1)
	}))
}

function updateGroupBoxDisplay()
{
	const e = document.querySelector("#box_label"),
		t = document.querySelector(".groups_display_box"),
		a = document.querySelector(".search_group_input");
	e.innerHTML = `Select ${messageToggleSwitchValue} to message`, a.placeholder = `Search ${messageToggleSwitchValue} by name`, t.innerHTML = `<p style="color:gray;font-size:13px;margin:0px;">Select ${messageToggleSwitchValue} from the dropdown . . .</p>`, ("groups" === messageToggleSwitchValue && groups_selected.length > 0 || "contacts" === messageToggleSwitchValue && contacts_selected.length > 0) && renderSelectedItems(), handleDeleteBin()
}

function toggleSendMessageToInput(e)
{
	messageToggleSwitchValue = e, chrome.storage.local.set(
	{
		send_messages_to: messageToggleSwitchValue
	}), "numbers" === messageToggleSwitchValue ? (document.querySelector(".numbers-box").style.display = "revert", document.querySelector(".groups_box").style.display = "none") : (document.querySelector(".numbers-box").style.display = "none", document.querySelector(".groups_box").style.display = "flex", updateGroupBoxDisplay())
}

function getTodayDate()
{
	let e = new Date,
		t = String(e.getDate()).padStart(2, "0"),
		a = String(e.getMonth() + 1).padStart(2, "0");
	return e.getFullYear() + "-" + a + "-" + t
}

function dateDiffInDays(e, t)
{
	const [a, n, o] = e.split("-").map(Number), [s, c, l] = t.split("-").map(Number), i = new Date(a, n - 1, o), r = new Date(s, c - 1, l), u = Math.abs(r - i);
	return Math.ceil(u / 864e5)
}

function convertCSVtoExcel(e)
{
	return new Promise(((t, a) =>
	{
		Papa.parse(e,
		{
			complete: function (e)
			{
				try
				{
					const a = XLSX.utils.json_to_sheet(e.data),
						n = XLSX.utils.book_new();
					XLSX.utils.book_append_sheet(n, a, "Sheet 1");
					const o = XLSX.utils.sheet_to_json(a,
					{
						header: 1,
						raw: !0
					});
					t(o)
				}
				catch (e)
				{
					a(e)
				}
			},
			header: !0,
			error: function (e)
			{
				a(e)
			}
		})
	}))
}

function disableNumberTimeGapInput(e = "random")
{
	const t = document.querySelector("#slider_time_gap_sec"),
		a = document.querySelector("#time_gap_sec"),
		n = document.querySelector("#random_label_text"),
		o = document.querySelector("#random_label_text span");
	"sec" == e ? (t && (t.disabled = !0), a && (a.disabled = !0), n && n.classList.remove("text_color_gray"), o && o.classList.remove("text_color_gray")) : (t && (t.disabled = !1), a && (a.disabled = !1), n && n.classList.add("text_color_gray"), o && o.classList.add("text_color_gray"))
}
chrome.windows.getCurrent().then((e =>
{
	"fullscreen" === e.state && isMac && chrome.windows.update(e.id,
	{
		state: "normal"
	})
})), $((function ()
{
	init()
})), window.addEventListener("DOMContentLoaded", (e =>
{
	handleMoreButtons(), handleDeleteBin(), document.querySelector("#schedule_day").valueAsDate = new Date;
	let t = getCurrentTimein24HourFormat();
	setTimeout((() =>
	{
		document.querySelector("input#schedule_time").value = t
	}), 100), document.querySelectorAll('input[name="message_type"]').forEach((e =>
	{
		e.addEventListener("change", (() =>
		{
			toggleSendMessageToInput(document.querySelector('input[name="message_type"]:checked').value)
		}))
	}))
})), $(document).ready((async function ()
{
	const e = chrome.runtime.getManifest().version;

	function t(e, t, a, n)
	{
		if ($("#caption-checkbox").prop("checked") && !document.querySelector(".captionCheckBoxDiv"))
		{
			let e = document.createElement("div");
			e.className = "captionCheckBoxDiv", document.querySelector("#caption-section").insertBefore(e, document.querySelector("#caption-section").children[0])
		}
		let o = "",
			s = "";
		for (let a = 0; a < e; a++)
		{
			let e = t[a],
				n = e.name.trim();
			n = n.length > 9 ? e.name.trim().substring(0, 9) + "..." : e.name.trim(), 0 == a ? (o += `\n                <div>\n                <input type="radio" id=radio${a} name="attachment" class="attachmentNames" value=${n} checked>\n                <label>${n}</label></div>\n                `, s += `\n                <textarea type="text" id="caption-input${a}" class="caption-input" style="width: 434px; font-size: 12px; padding: 7px;resize:none" placeholder="Type your caption for the file: ${e.name.trim().length>50?e.name.trim().substring(0,50)+"...":e.name.trim()}" data-translate-placeholder></textarea>\n                `) : (o += `\n                <div>\n                <input type="radio" name="attachment" class="attachmentNames" id=radio${a} value=${n}>\n                <label>${n}</label></div>\n                `, s += `\n                <textarea type="text" id="caption-input${a}" class="caption-input hide" style="width: 434px; font-size: 12px; padding: 7px;resize:none" placeholder="Type your caption for the file: ${e.name.trim().length>50?e.name.trim().substring(0,50)+"...":e.name.trim()}" data-translate-placeholder></textarea>\n                `)
		}
		if (1 == e && (o = ""), $(".captionCheckBoxDiv").html(`${o}`), $(".captionTextAreas").html(`${s}`), n)
			for (let t = 0; t < e; t++) document.querySelector(`#caption-input${t}`) && a[t] && (document.querySelector(`#caption-input${t}`).value = a[t]);
		document.querySelectorAll(".attachmentNames").forEach((t =>
		{
			t.addEventListener("change", (() =>
			{
				for (let t = 0; t < e; t++) document.getElementById(`radio${t}`).checked ? document.querySelector(`#caption-input${t}`).classList.remove("hide") : document.getElementById(`radio${t}`).classList.contains("hide") || document.querySelector(`#caption-input${t}`).classList.add("hide")
			}))
		})), document.querySelectorAll(".caption-input").forEach((e =>
		{
			e.addEventListener("input", (async () =>
			{
				var t = e.id.substring(e.id.search(/\d/));
				let a = await new Promise((e =>
				{
					chrome.storage.local.get(["captionForIndividualAttachment"], (t =>
					{
						e(t.captionForIndividualAttachment)
					}))
				}));
				a[t] = e.value, chrome.storage.local.set(
				{
					captionForIndividualAttachment: a
				})
			}))
		}))
	}
	async function n()
	{
		$("#attachments-container").html('<span style="margin-right:10px">Fetching...</span>');
		let e = await new Promise((e =>
			{
				chrome.storage.local.get(["attachmentsData"], (t =>
				{
					e(t.attachmentsData || [])
				}))
			})),
			a = await new Promise((e =>
			{
				chrome.storage.local.get("showAllAttachments", (t =>
				{
					e(t.showAllAttachments || !1)
				}))
			}));
		if (e.length > 0)
		{
			let o = "",
				s = e.length,
				c = !0,
				l = !0;
			for (let t = 0; t < s; t++)
			{
				let n = e[t],
					c = !0,
					i = n.name.trim();
				s - 1 == t && (c = !1), s <= 3 ? i.length > 24 / s && (i = i.slice(0, 24 / s) + "...") : t < 2 ? i.length > 8 && (i = i.slice(0, 8) + "...") : a || (l = !1), a && (i = i.length > 7 ? n.name.trim().slice(0, 7) + "..." : n.name.trim()), l && c ? o += `<span class="attachment-name">${i}<img src="/logo/pro-remove-attachments-icon.png" alt="Remove Icon" id="${t}"/>,</span>` : l && (o += `<span class="attachment-name">${i}<img src="/logo/pro-remove-attachments-icon.png" alt="Remove Icon" id="${t}"/></span>`)
			}
			if (s > 3 && !a && (o += `<span class="show_more" style="margin-right: 5px;">and <span style="text-decoration:underline;">${s-2} more</span></span>`), s > 3 && a && (o += '<span class="show_less" style="margin-right: 5px;">... <span style=\'text-decoration:underline\'>show less</span></span>'), $("#attachments-container").html(o), a ? 0 == $("#message").val().length ? document.querySelector("#attachments-container").style.maxWidth = "250px" : document.querySelector("#attachments-container").style.maxWidth = "333px" : (document.querySelector("#attachments-container").style.textDecoration = "none", document.querySelector("#attachments-container").style.maxWidth = "270px"), document.querySelector("#message").addEventListener("input", (() =>
				{
					0 == $("#message").val().length ? document.querySelector("#attachments-container").style.maxWidth = "250px" : document.querySelector("#attachments-container").style.maxWidth = "333px"
				})), document.querySelectorAll(".attachment-name img").forEach((t =>
				{
					t.addEventListener("click", (async a =>
					{
						let o = await new Promise((e =>
						{
							chrome.storage.local.get(["captionForIndividualAttachment"], (t =>
							{
								e(t.captionForIndividualAttachment || [])
							}))
						}));
						e.splice(t.id, 1), o.splice(t.id, 1), e.length <= 3 && chrome.storage.local.set(
						{
							showAllAttachments: !1
						}), chrome.storage.local.set(
						{
							attachmentsData: e
						}), chrome.storage.local.set(
						{
							captionForIndividualAttachment: o
						}), n()
					}))
				})), document.querySelector(".show_more") && document.querySelector(".show_more").addEventListener("click", (() =>
				{
					chrome.storage.local.set(
					{
						showAllAttachments: !0
					}), n()
				})), document.querySelector(".show_less") && document.querySelector(".show_less").addEventListener("click", (() =>
				{
					document.querySelector("#attachments-container").style.textDecoration = "none", chrome.storage.local.set(
					{
						showAllAttachments: !1
					}), n()
				})), $("#add-attachments").removeClass("contrast-0"), c)
			{
				let a = await new Promise((e =>
				{
					chrome.storage.local.get(["captionForIndividualAttachment"], (t =>
					{
						e(t.captionForIndividualAttachment || [])
					}))
				}));
				$("#add-caption-container").prop("hidden", !1);
				let n = !1;
				for (let e = 0; e < a.length; e++)
				{
					if (0 != a[e].replace(/\s/g, "").length)
					{
						$("#caption-checkbox").prop("checked", !0), n = !0;
						break
					}
				}
				toggleCaptionCustomizationInputDiv(), $("#caption-section").prop("hidden", !$("#caption-checkbox").is(":checked")), t(s, e, a, n), document.querySelector("#caption-checkbox").addEventListener("change", (() =>
				{
					t(s, e, a, n)
				})), chrome.storage.local.get(["dsi854", "itc856", "icu861", "tooltip_popup_count"], (e =>
				{
					let t = e.dsi854;
					void 0 === e.dsi854 && (t = e.tooltip_popup_count || 1);
					let a = e.itc856,
						n = e.icu861;
					![11, 14, 17, 20].includes(t) || a || n || ($(".caption-tooltip").removeClass("hide"), $(".checkbox-section > .add-tooltip-overlay").removeClass("hide"))
				}))
			}
		}
		else $("#attachments-container").html(""), $("#add-attachments").addClass("contrast-0"), $("#add-caption-container").prop("hidden", !0)
	}

	function o()
	{
		chrome.storage.local.get(["templates"], (e =>
		{
			let t = !1;
			const a = $("#message").val().trim();
			(e.templates || []).forEach((e =>
			{
				a === e.message && (t = !0)
			})), t || 0 == a.length ? ($("#template-selector").removeClass("hide"), $("#template-save-icon").addClass("hide"), $(".tooltip-popup-content").removeClass("right-side")) : ($("#template-selector").addClass("hide"), $("#template-save-icon").removeClass("hide"), $(".tooltip-popup-content").addClass("right-side"))
		}))
	}

	function s()
	{
		$("#templates-container").html(""), chrome.storage.local.get(["templates"], (async e =>
		{
			let t = e.templates || [];
			if (t.length > 0)
				for (let e = t.length - 1; e >= 0; e--) $("#templates-container").append(`\n                    <div class="dropdown-item">\n                    <p id="${e}" class="template-text text">${t[e].name}</p>\n                     <img id="${e}" class="template-edit btn" src="./logo/pro-edit_icon.png" />\n                    <img id="${e}" class="template-delete btn" src="./logo/pro-template_delete.png" />\n                    </div>`);
			else $("#templates-container").append(`<div class="dropdown-item">${await translate("Nothing to show!")}</div>`);
			$(".template-text").click((function ()
			{
				let e = $(this).attr("id"),
					a = t[e].message;
				$("#message").val(a), $("#templates-container").addClass("hide"), $("#template-selector").removeClass("active")
			})), $(".template-delete").click((async function ()
			{
				let e = $(this).attr("id"),
					a = await translate('Are you sure, you want to remove template "TEMPLATE NAME" ?');
				a = a.replace(/"(.*?)"/gi, `"${t[e].name}"`), confirm(a) && (t.splice(e, 1), chrome.storage.local.set(
				{
					templates: t
				}), s())
			})), $(".template-edit").click((async function ()
			{
				let e = $(this).attr("id");
				var t;
				t = e, chrome.storage.local.get(["templates"], (async e =>
				{
					let a = e.templates,
						n = a[t].message,
						o = a[t].name;
					const s = Math.max(0, (window.innerHeight - 250) / 2 + window.pageYOffset) + "px";
					$(".template-save-popup").css("top", s), $(".template-save-popup-container").removeClass("hide"), $("#template-msg").val(n), $("#template-name").val(o).focus(), $("#edit-template-index").val(t)
				}))
			}))
		}))
	}

	function c()
	{
		chrome.storage.local.get(["campaigns"], (e =>
		{
			let t = !1;
			const a = getFilteredNumbers($("#numbers").val());
			(e.campaigns || []).forEach((e =>
			{
				a === e.numbers && (t = !0)
			})), t || 0 == a.length ? ($("#campaign-selector").removeClass("hide"), $("#campaign-save-icon").addClass("hide")) : ($("#campaign-selector").addClass("hide"), $("#campaign-save-icon").removeClass("hide"))
		}))
	}

	function l()
	{
		$("#campaigns-container").html(""), chrome.storage.local.get(["campaigns"], (async e =>
		{
			let t = e.campaigns || [];
			if (t.length > 0)
				for (let e = t.length - 1; e >= 0; e--) $("#campaigns-container").append(`\n                        <div class="dropdown-item">\n                        <p id="${e}" class="campaign-name text">${t[e].name}</p>\n                        <img id="${e}" class="campaign-edit btn" src="./logo/pro-edit_icon.png" />\n                        <img id="${e}" class="campaign-delete btn" src="./logo/pro-template_delete.png"  />\n                        </div>`);
			else $("#campaigns-container").append(`<div class="dropdown-item">${await translate("Nothing to show!")}</div>`);
			$(".campaign-name").click((function ()
			{
				let e = $(this).attr("id");
				replaceNumbers(t[e].numbers), $("#campaigns-container").addClass("hide"), $("#campaign-selector").removeClass("active")
			})), $(".campaign-delete").click((async function ()
			{
				let e = $(this).attr("id"),
					a = await translate('Are you sure, you want to remove campaign "CAMPAIGN NAME" ?');
				a = a.replace(/"(.*?)"/gi, `"${t[e].name}"`), confirm(a) && (t.splice(e, 1), chrome.storage.local.set(
				{
					campaigns: t
				}), l())
			})), $(".campaign-edit").click((async function ()
			{
				let e = $(this).attr("id");
				var t;
				t = e, chrome.storage.local.get(["campaigns"], (async e =>
				{
					let a = e.campaigns,
						n = a[t].numbers,
						o = a[t].name;
					const s = Math.max(0, (window.innerHeight - 250) / 2 + window.pageYOffset) + "px";
					$(".campaign-save-popup").css("top", s), $(".campaign-save-popup-container").removeClass("hide"), $("#campaign-numbers").val(n), $("#campaign-name").val(o).focus(), $("#edit-index").val(t)
				}))
			}))
		}))
	}
	async function i(e)
	{
		let t = document.querySelectorAll("[data-translate-text]"),
			a = document.querySelectorAll("[data-translate-placeholder]");
		chrome.storage.local.get(["defaultLanguageData", "translatedCache"], (async n =>
		{
			let o = n.defaultLanguageData.texts,
				s = n.defaultLanguageData.placeholders,
				c = n.translatedCache ||
				{};
			const l = o.map((async t =>
				{
					if (c[t] && c[t][e]) return c[t][e];
					const a = await translateAPI(t);
					return c[t] || (c[t] = {}), c[t][e] = a, a
				})),
				i = s.map((async t =>
				{
					if (c[t] && c[t][e]) return c[t][e];
					const a = await translateAPI(t);
					return c[t] || (c[t] = {}), c[t][e] = a, a
				})),
				r = await Promise.all(l),
				u = await Promise.all(i);
			t.forEach(((e, t) => e.innerText = r[t])), a.forEach(((e, t) => e.placeholder = u[t])), chrome.storage.local.set(
			{
				translatedCache: c
			})
		}))
	}
	document.getElementById("extension-version").textContent = e, chrome.storage.local.get(["country_info", "popup_numbers"], (e =>
		{
			country_info = e.country_info ||
			{
				name: "India",
				name_code: "IN",
				dial_code: "91"
			}, addCountryCodeSelector(), replaceNumbers(popup_numbers = e.popup_numbers || "")
		})), $("#numbers-input").on("blur keydown keyup", (function (e)
		{
			if (e.keyCode && ![13, 188].includes(e.keyCode)) return;
			const t = $(this).val();
			$(this).val(""), addNumberTags(t)
		})), $("#numbers-display").on("click", ".number", (function ()
		{
			editNumberTag($(this))
		})), $("#numbers-display").on("click", ".delete-number-tag", (function ()
		{
			$(this).parent(".number-tag").remove();
			let e = $(this).parent(".number-tag").children().text();
			for (let t = 0; t < csv_data.length; t++)
				if (csv_data[t][0] && csv_data[t][0].toString().includes(e))
				{
					csv_data.splice(t, 1);
					break
				} chrome.storage.local.set(
			{
				csv_data: csv_data
			}), updateNumbersAndDisplay(), toggleUploadExcelText(!0)
		})), $("#numbers-display").on("click", (function (e)
		{
			const t = $(e.target);
			t && !t.is(".number, .delete-number-tag, .number-tag-input") && $("#numbers-input").focus()
		})), $("#delete-all-numbers").on("click", (async function ()
		{
			let e = await translate("Are you sure, you want to delete all numbers?");
			confirm(e) && (replaceNumbers(""), removeNumbers())
		})), $("#groups_container").on("scroll", (function ()
		{
			const e = document.getElementById("groups_container");
			let t = $("#groups_container .dropdown-item:visible").length;
			"groups" === messageToggleSwitchValue && allGroups.length - groups_selected.length === t ? lastScrollPosition = e.scrollTop : "contacts" === messageToggleSwitchValue && allContacts.length - contacts_selected.length === t && (lastScrollPosition_contacts = e.scrollTop)
		})), $("#delete-all").on("click", (async function ()
		{
			let e = await translate(`Are you sure, you want to delete all ${"groups"===messageToggleSwitchValue?"groups":"contacts"}?`);
			confirm(e) && ("groups" === messageToggleSwitchValue ? (groups_selected = [], chrome.storage.local.set(
			{
				groups_selected: groups_selected
			})) : (contacts_selected = [], chrome.storage.local.set(
			{
				contacts_selected: contacts_selected
			})), updateGroupBoxDisplay())
		})), $("#select_all_text").on("click", (function ()
		{
			document.getElementById("select-all").checked = !0
		})), $(".select_all").on("click", (function ()
		{
			document.getElementById("select-all").checked && (!fetching && handleSelectAll(), handleDeleteBin())
		})), $("#invalid-numbers").on("click", (function ()
		{
			const e = Math.max(0, (window.innerHeight - 250) / 2 + window.pageYOffset) + "px";
			$(".invalid-numbers-popup").css("top", e), $(".invalid-numbers-popup-container").removeClass("hide");
			const t = $(".number-tag.invalid").length;
			$("#popup-invalid-count").text(t)
		})), $(".invalid-numbers-popup-close-button").on("click", (function ()
		{
			$(".invalid-numbers-popup-container").addClass("hide")
		})), $("#remove-all-invalid").on("click", (function ()
		{
			! function ()
			{
				let e = [];
				$(".number-tag.invalid").each((function ()
				{
					e.push($(this).index())
				}));
				let t = csv_data.filter(((t, a) => !e.includes(a - 1)));
				csv_data = t, chrome.storage.local.set(
				{
					csv_data: t
				})
			}(), $(".number-tag.invalid").remove(), $(".invalid-numbers-popup-container").addClass("hide"), updateNumbersAndDisplay()
		})), $("#download-all-invalid").on("click", (function ()
		{
			const e = [
				["Invalid Number", "Reason"]
			];
			$(".number-tag.invalid").each((function ()
			{
				const t = country_info.dial_code + $(this).find(".number").text(),
					a = $(this).find(".invalid-reason").text();
				e.push([t, a])
			})), download_csv(e, "Invalid Numbers"), $(".invalid-numbers-popup-container").addClass("hide")
		})), n(), $("#select-attachments").change((async function ()
		{
			const e = $(this).get(0).files;
			let t = Array.from(e);
			t.length > 1 && !isAdvanceFeatureAvailable() && (t = [], sendMessageToBackground(
			{
				type: "show_advance_popup",
				feature: "multiple_attachments"
			}), window.close()), trackEvent("add_attachments", t.length), $("#attachments-container").html('<span style="margin-right:10px">Fetching...</span>');
			let o = await new Promise((e =>
			{
				chrome.storage.local.get(["attachmentsData"], (n =>
				{
					let o = n.attachmentsData || [],
						s = o.length;
					!async function (e)
					{
						if (0 == e.length) return !1;
						if (e.length > 7)
						{
							let e = await translate("Maximum 7 files can be send at a time.");
							return alert(e), !1
						}
						let t = !0;
						return e.every((async e =>
						{
							if ("application/pdf" == e.type && e.size > 22e6 || "application/pdf" != e.type && e.size > 16e6)
							{
								const a = e.size / 1e6;
								let n = await translate(`${e.name} size is too large, [ file size: ${a} MB]. Maximum size recommended: 16MB`);
								alert(n), $("#select-attachments").val(""), t = !1
							}
							return t
						})), t
					}(t) ? e(o) : (t.forEach((async a =>
					{
						await
						function (e)
						{
							return new Promise(((t, a) =>
							{
								const n = new FileReader;
								n.readAsDataURL(e), n.onload = () => t(n.result), n.onerror = e => a(e)
							}))
						}(a).then((async n =>
						{
							o.push(
							{
								name: a.name,
								data: JSON.stringify(n)
							}), o.length - s === t.length && e(o)
						}))
					})), chrome.storage.local.get(["attachmentsData"], (e =>
					{
						a = e.attachmentsData || []
					})))
				}))
			}));
			await chrome.storage.local.set(
			{
				attachmentsData: o
			}), await n(), $(this).val("")
		})), $("#add-attachments").click((function ()
		{
			chrome.storage.local.get(["fva853", "facc859"], (e =>
			{
				0 == e.facc859 && chrome.storage.local.set(
				{
					facc859: 1
				}), 1 == e.fva853 ? ($(".tooltip-container ").addClass("hide"), $("#add-attachments").addClass("contrast-0"), document.getElementById("help_popup").style.display = "block") : isLinux ? (sendMessageToBackground(
				{
					type: "add_attachments"
				}), window.close()) : $("#select-attachments").click()
			}))
		})), $(".group").click((async function ()
		{
			translatedGroupMsgObj = await fetchTranslations(groupMsgObj), "groups" !== messageToggleSwitchValue && document.querySelector("#message_type_groups").click(), driver(translatedGroupMsgObj).drive()
		})), $(".contact").click((async function ()
		{
			translatedContactMsgObj = await fetchTranslations(contactMsgObj), "contacts" !== messageToggleSwitchValue && document.querySelector("#message_type_contact").click(), driver(translatedContactMsgObj).drive()
		})), $(".customize").click((async function ()
		{
			translatedCustomObj = await fetchTranslations(customizationObj), translatedCustomObj.steps[1].popover.onNextClick = () =>
			{
				document.querySelector(".upload_excel_text").click(), $("#csv").on("change", (function (e)
				{
					driver(translatedCustomObj).moveNext()
				}))
			}, "numbers" !== messageToggleSwitchValue && document.querySelector("#message_type_numbers").click(), customization_obj = !0, driver(translatedCustomObj).drive()
		})), $(".attachments").click((async function ()
		{
			translatedAttachments = await fetchTranslations(attachmentObj), translatedAttachments.steps[2].popover.onNextClick = () =>
			{
				attachment_obj = !0;
				const e = document.querySelector("#select-attachments");
				e.click(), e.addEventListener("change", (() =>
				{
					driver(translatedAttachments).moveNext()
				}),
				{
					once: !0
				})
			}, "numbers" !== messageToggleSwitchValue && document.querySelector("#message_type_numbers").click(), driver(translatedAttachments).drive()
		})), $(".unsaved").click((function ()
		{
			sendMessageToBackground(
			{
				type: "unsaved_contacts_demo"
			})
		})), $("#caption-checkbox").change((function ()
		{
			$("#caption-section").prop("hidden", !$(this).is(":checked"));
			$(this).is(":checked");
			toggleCaptionCustomizationInputDiv(), $("#caption-checkbox").is(":checked") && chrome.storage.local.get(["premiumUsageObject"], (function (e)
			{
				if (void 0 !== e.premiumUsageObject)
				{
					let t = {
						...e.premiumUsageObject,
						caption: !0
					};
					chrome.storage.local.set(
					{
						premiumUsageObject: t
					})
				}
			})), trackButtonClick("add_caption")
		})), chrome.storage.local.get(["dsi854", "ltod857", "id855", "tooltip_popup_count"], (e =>
		{
			let t = e.dsi854;
			void 0 === e.dsi854 && (t = e.tooltip_popup_count || 1);
			const a = new Date(e.id855).toDateString(),
				n = e.ltod857 ? new Date(e.ltod857) : null,
				o = (new Date).toDateString();
			a && o !== a && (null != n && n.toDateString() === o || (chrome.storage.local.set(
			{
				ltod857: o
			}), chrome.storage.local.set(
			{
				dsi854: t + 1
			}), chrome.storage.local.set(
			{
				itc856: !1
			}), t < 3 && chrome.storage.local.set(
			{
				fva853: !0
			}))), chrome.storage.local.get(["dsi854", "itc856"], (e =>
			{
				let t = e.dsi854,
					a = e.itc856;
				[1, 4, 7, 10].includes(t) && !a && ($(".tooltip-popup-container").removeClass("hide"), $(".add-tooltip-overlay").removeClass("hide"))
			}))
		})), $(".close-tooltip").on("click", (() =>
		{
			$(".tooltip-popup-container").addClass("hide"), $(".caption-tooltip").addClass("hide"), $(".add-tooltip-overlay").addClass("hide"), chrome.storage.local.set(
			{
				ltod857: (new Date).toDateString()
			}), chrome.storage.local.set(
			{
				itc856: !0
			})
		})), o(), $("#message").on("input click", (function ()
		{
			o(), $("#template-selector").removeClass("active"), $(".tooltip-container ").addClass("hide"), $("#templates-container").addClass("hide")
		})), $("#template-save-icon").click((function ()
		{
			const e = Math.max(0, (window.innerHeight - 250) / 2 + window.pageYOffset) + "px";
			$(".template-save-popup").css("top", e), $(".template-save-popup-container").removeClass("hide"), $("#template-msg").val($("#message").val().trim()), $("#template-name").val("").focus()
		})), $("#save-template-form").submit((function (e)
		{
			e.preventDefault();
			const t = $("#template-name").val(),
				a = $("#template-msg").val(),
				n = $("#edit-template-index").val();
			chrome.storage.local.get(["templates"], (e =>
			{
				let o = e.templates || [],
					s = !1;
				if ("" === n) o.forEach((e =>
				{
					e.name === t && (s = !0)
				})), s ? alert(`Template name "${t}" already exists!`) : o.push(
				{
					name: t,
					message: a
				});
				else
				{
					const e = parseInt(n);
					o[e].name = t, o[e].message = a
				}
				chrome.storage.local.set(
				{
					templates: o
				}), $(".template-save-popup-container").addClass("hide"), $(".template-container").addClass("hide"), $("#template-save-icon").addClass("hide"), $("#template-selector").removeClass("hide"), $(".tooltip-popup-content").removeClass("right-side"), $("#edit-template-index").val(""), trackButtonClick("save_template_message")
			}))
		})), $("#template-selector").click((function (e)
		{
			s(), trackButtonClick("select_template_message"), $(".tooltip-container ").addClass("hide"), $("#templates-container").toggleClass("hide"), $("#template-selector").toggleClass("active")
		})), $(".template-popup-close-button").click((function ()
		{
			$(".template-save-popup-container").addClass("hide")
		})), c(), $("#numbers").on("click change", (function ()
		{
			c(), $("#campaign-selector").removeClass("active"), $("#campaigns-container").addClass("hide")
		})), $("#campaign-save-icon").click((function ()
		{
			let e = getFilteredNumbers($("#numbers").val());
			const t = Math.max(0, (window.innerHeight - 250) / 2 + window.pageYOffset) + "px";
			$(".campaign-save-popup").css("top", t), $(".campaign-save-popup-container").removeClass("hide"), $("#campaign-numbers").val(e), $("#campaign-name").val(csv_name).focus()
		})), $("#save-campaign-form").submit((function (e)
		{
			e.preventDefault();
			const t = $("#campaign-name").val(),
				a = getFilteredNumbers($("#campaign-numbers").val()),
				n = $("#edit-index").val();
			chrome.storage.local.get(["campaigns"], (e =>
			{
				let o = e.campaigns || [],
					s = !1;
				if ("" === n) o.forEach((e =>
				{
					e.name === t && (s = !0)
				})), s ? alert(`Campaign name "${t}" already exists!`) : o.push(
				{
					name: t,
					numbers: a
				});
				else
				{
					const e = parseInt(n);
					o[e].name = t, o[e].numbers = a
				}
				chrome.storage.local.set(
				{
					campaigns: o
				}), $("#campaign-selector").removeClass("hide"), $("#campaigns-container").addClass("hide"), $("#campaign-save-icon").addClass("hide"), $(".campaign-save-popup-container").addClass("hide"), $("#edit-index").val(""), trackButtonClick("save_campaign_numbers")
			}))
		})), $("#campaign-selector").click((function (e)
		{
			l(), trackButtonClick("select_campaign_numbers"), $("#campaigns-container").toggleClass("hide"), $("#campaign-selector").toggleClass("active")
		})), $(".campaign-popup-close-button").click((function ()
		{
			$(".campaign-save-popup-container").addClass("hide")
		})), $(".invalid-excel-popup-close-button").click((function ()
		{
			$(".invalid-excel-popup-container").addClass("hide"), unset_csv_styles(), hideCustomizationContainer(), replaceNumbers(""), toggleUploadExcelText(!0)
		})), $(".template-excel-button").click((function ()
		{
			$(".invalid-excel-popup-container").addClass("hide"), unset_csv_styles(), hideCustomizationContainer(), replaceNumbers(""), toggleUploadExcelText(!0)
		})), $("#report-selector").click((function (e)
		{
			$("#reports-container").html(""), chrome.storage.local.get(["deliveryReports"], (async e =>
			{
				let t = e.deliveryReports || [];
				if (t.length > 0)
					for (let e = t.length - 1; e >= 0; e--)
					{
						let a = getReportDateFormat(t[e].date),
							n = t[e].name || "Campaign " + (e + 1);
						$("#reports-container").append(`\n                        <div class="dropdown-item">\n                            <p id="${e}" class="report-name text">\n                                <img src="./logo/pro-excel_icon.png"/>\n                                <span style="color: #009A88;">${n}</span>\n                                <span style="color: #5D6063;">${a}</span>\n                            </p>\n                            <img id="${e}" class="report-download btn CtaBtn" src="./logo/pro-download_icon.png" />\n                        </div>`)
					}
				else $("#reports-container").append(`<div class="dropdown-item">${await translate("Nothing to show!")}</div>`);
				$(".report-download").click((function ()
				{
					let e = $(this).prop("id"),
						a = encodeURI(t[e].data),
						n = getReportDateFormat(t[e].date, !0),
						o = `${t[e].name||"Campaign "+(+e+1)} ${n}.csv`,
						s = document.createElement("a");
					s.setAttribute("href", a), s.setAttribute("download", o), document.body.appendChild(s), s.click(), trackButtonClick("download_delivery_report")
				}))
			})), trackButtonClick("select_delivery_report"), $("#reports-container").toggleClass("hide"), $("#report-selector").toggleClass("active")
		})), $(".search_group_input").click((function (e)
		{
			0 !== allGroups.length && ("contacts" === messageToggleSwitchValue && contacts_selected.length === allContacts.length || "groups" === messageToggleSwitchValue && groups_selected.length === allGroups.length || (document.querySelector(".search_group_input").value = "", $("#select-all").prop("checked", !1), showItems("groups" === messageToggleSwitchValue), $("#groups_container").removeClass("hide"), "groups" === messageToggleSwitchValue ? $("#groups_container").scrollTop(lastScrollPosition) : $("#groups_container").scrollTop(lastScrollPosition_contacts), $(".message-box").addClass("hide_visibility")))
		})), document.addEventListener("click", (function (e)
		{
			const t = document.querySelectorAll(".dropdown-container"),
				a = document.querySelectorAll(".dropdown-box"),
				n = document.querySelectorAll(".dropdown"),
				o = document.querySelectorAll(".groups_searchbar");
			for (let s = 0; s < a.length; s++) a[s].contains(e.target) || t[s].contains(e.target) || o[0].contains(e.target) || e.target.classList.contains("dropdown-item") || e.target.classList.contains("dropdown-container") || (t[s].classList.add("hide"), n[s]?.classList.remove("active"), $(".message-box").removeClass("hide_visibility"), document.querySelector(".search_group_input").value = "", $("#select-all").prop("checked", !1))
		})), document.querySelector(".groups_display_box").addEventListener("click", (function (e)
		{
			if (e.target && e.target.classList.contains("delete_group_tag"))
			{
				const t = e.target.closest(".group_tag");
				if (t)
				{
					let e = t.id,
						a = t.getAttribute("data-id-field"),
						n = "groups" === messageToggleSwitchValue,
						o = n ? groups_selected : contacts_selected;
					o = o.filter((e => e !== a)), n ? groups_selected = o : contacts_selected = o, chrome.storage.local.set(
					{
						[n ? "groups_selected" : "contacts_selected"]: o
					});
					const s = document.querySelector(`#group_container #${e}`);
					s && s.classList.remove("hide"), t.remove();
					const c = document.querySelector(".groups_display_box");
					0 === o.length && (c.innerHTML = `<p style="color:gray;font-size:13px;margin:0px;">Select ${n?"groups":"contacts"} from the dropdown . . .</p>`)
				}
			}
		})),
		function ()
		{
			let e = document.querySelectorAll("[data-translate-text]"),
				t = Object.values(e).map((e => e.innerText)),
				a = document.querySelectorAll("[data-translate-placeholder]"),
				n = Object.values(a).map((e => e.placeholder));
			chrome.storage.local.set(
			{
				defaultLanguageData:
				{
					texts: t,
					placeholders: n
				}
			})
		}(),
		function ()
		{
			let e = new Intl.DisplayNames(["en"],
				{
					type: "language"
				}),
				t = navigator.languages.map((e => e.split("-")[0]));
			t = t.filter(((e, t, a) => a.indexOf(e) === t));
			let a = document.getElementById("language-selector");
			a.innerHTML = "", a.appendChild(createOption("English (Default)", "default")), chrome.storage.local.get(["currentLanguage"], (n =>
			{
				currentLanguage = n.currentLanguage || "default", i(currentLanguage), t.forEach((t =>
				{
					"en" !== t && a.appendChild(createOption(e.of(t), t, t === currentLanguage))
				})), a.appendChild(createOption("-----------------------", "", !1, !0)), allLanguageCodes.forEach((n =>
				{
					"en" === n || t.includes(n) || a.appendChild(createOption(e.of(n), n, n === currentLanguage))
				}))
			}))
		}(), $("#language-selector").change((function ()
		{
			currentLanguage = $(this).val(), chrome.storage.local.set(
			{
				currentLanguage: currentLanguage
			}), i(currentLanguage), trackEvent("translate_language", currentLanguage), sendMessageToBackground(
			{
				type: "translate_language",
				language: currentLanguage
			})
		}))
})), showNewDesignReviewButtons(), startNavigationTourOnFirstVisit();