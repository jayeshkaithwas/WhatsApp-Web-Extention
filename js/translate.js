let translate_icon_1 = chrome.runtime.getURL("logo/pro-translation_1.png"),
	translate_icon_2 = chrome.runtime.getURL("logo/pro-translation_2.png"),
	is_translate_enabled = !1,
	is_translate_message_used = !1,
	languageNames = new Intl.DisplayNames(["en"],
	{
		type: "language"
	}),
	currentLanguage = "en",
	last_day_since_translate_used = "",
	count_of_days_translate_used = 0;

function replace_HTML_tags(e)
{
	let t = e;
	Object.keys(REPLACEMENT_HTML_TAGS).forEach((e =>
	{
		let a = REPLACEMENT_HTML_TAGS[e];
		t = t.replaceAll(a.replacement_regex, a.replacement_pattern)
	}));
	let a = document.createElement("div");
	return a.innerHTML = t, t = a.innerText, t
}

function replace_back_HTML_tags(e, t)
{
	let a = e;
	return Object.keys(REPLACEMENT_HTML_TAGS).forEach((e =>
	{
		let n = REPLACEMENT_HTML_TAGS[e];
		if (n.replaceback_regex) a = a.replaceAll(n.replaceback_regex, n.replaceback_pattern);
		else
		{
			let e = t.match(n.replacement_regex);
			e && e.forEach((e => a = a.replace(n.replacement_pattern, e))), a = a.replaceAll(n.replacement_pattern, "")
		}
	})), a
}

function is_valid_translation(e, t, a, n)
{
	if (!e || !n) return !1;
	if (e === t || a == n) return !1;
	return a.replace(/[^a-zA-Z]/g, "").toLowerCase() !== n.replace(/[^a-zA-Z]/g, "").toLowerCase()
}
async function translate_message_HTML(e, t)
{
	if (null == e || 0 === e.trim().length) return "";
	let a = replace_HTML_tags(e);
	const n = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${t}&dt=t&q=${encodeURI(a)}`;
	return await new Promise((s =>
	{
		try
		{
			$.getJSON(n, (function (n)
			{
				let l = n[2],
					r = n[0].map((e => e[0])).join(" ");
				if (is_valid_translation(l, t, a, r))
				{
					let t = replace_back_HTML_tags(r, e);
					s([l, t])
				}
				else s([null, null])
			}))
		}
		catch (e)
		{
			s([null, null])
		}
	}))
}

function is_in_viewport(e, t)
{
	if (!e || !t) return !1;
	const a = e.getBoundingClientRect(),
		n = t.getBoundingClientRect();
	return a.bottom >= n.top && a.top <= n.bottom
}

function get_detected_language_names(e)
{
	let t = e.size;
	return 1 === t ? [...e][0] : 2 === t ? [...e].sort().join(", ") : "Multiple Languages"
}

function add_traslate_button()
{
	
}

function update_translate_button()
{
	let e = "default" === currentLanguage ? "en" : currentLanguage;
	document.getElementById("translate_div") || add_traslate_button();
	let t = document.getElementById("translate_div"),
		a = getDocumentElement("conversation_panel"),
		n = document.querySelectorAll(".message-in"),
		s = Array.from(n).filter((e => is_in_viewport(e, a))),
		l = new Set;
	if (s.forEach((e =>
		{
			if (e.querySelector(".detected_language_name"))
			{
				let t = e.querySelector(".detected_language_name").innerText;
				l.add(t)
			}
		})), 0 === l.size) return t.classList.add("hide"), void t.classList.remove("show");
	let r = get_detected_language_names(l),
		i = languageNames.of(e);
	t.classList.add("show"), t.classList.remove("hide"), t.querySelector("#detected_language_names").innerText = r, t.querySelector("#targeted_language_name").innerText = i, is_translate_message_used || t.classList.contains("shimmer") || (t.classList.add("shimmer"), setTimeout((() => t.classList.remove("shimmer")), 7e3))
}

function get_message_div(e)
{
	let t = e.querySelector(".selectable-text"),
		a = t.querySelectorAll(":scope > span");
	if (a.length > 1)
	{
		let e = "";
		e += Array.from(a).map((e => e.innerHTML)).filter((e => e.trim().length > 0)).join("\n");
		let n = document.createElement("span");
		n.className = a[0]?.className, n.innerHTML = e, t.innerHTML = "", t.appendChild(n)
	}
	return t.querySelector(":scope > span")
}

function replace_message(e)
{
	if (!e.querySelector(".selectable-text") || !e.querySelector(".translated_message")) return;
	let t = get_message_div(e),
		a = e.querySelector(".translated_message").innerHTML,
		n = e.querySelector(".original_message").innerHTML,
		s = e.querySelector(".targeted_language_code").innerText,
		l = e.querySelector(".detected_language_code").innerText;
	is_translate_enabled ? (t.innerHTML = a, t.setAttribute("dir", RTL_LANGUAGE_CODES.includes(s) ? "rtl" : "ltr")) : (t.innerHTML = n, t.setAttribute("dir", RTL_LANGUAGE_CODES.includes(l) ? "rtl" : "ltr"))
}

function translate_all_messages()
{
	is_translate_enabled = !is_translate_enabled, document.querySelectorAll(".message-in").forEach((e =>
	{
		replace_message(e)
	})), document.getElementById("original_message_btn").style.display = is_translate_enabled ? "flex" : "none", document.getElementById("translate_message_btn").style.display = is_translate_enabled ? "none" : "flex";
	let e = document.getElementById("translate_div");
	if (is_translate_enabled)
	{
		let t = (new Date).toDateString();
		t == last_day_since_translate_used || count_of_days_translate_used >= 5 ? e.classList.remove("shimmer") : (e.classList.add("shimmer"), setTimeout((() => e.classList.remove("shimmer")), 3e3), last_day_since_translate_used = t, count_of_days_translate_used++, chrome.storage.local.set(
		{
			lastDaySinceTranslateMessageUsed: last_day_since_translate_used,
			countOfDaysTranslateMessageUsed: count_of_days_translate_used
		}))
	}
	else e.classList.remove("shimmer");
	is_translate_message_used = !0, chrome.storage.local.set(
	{
		isTranslateMessageUsed: !0
	}), trackEvent("translate_message", currentLanguage)
}

function translate_visible_messages()
{
	let e = "default" === currentLanguage ? "en" : currentLanguage,
		t = document.querySelectorAll(".message-in");
	t.forEach((async (a, n) =>
	{
		if (!a.querySelector(".translated_message_div") && a.querySelector(".selectable-text"))
		{
			let t = document.createElement("div");
			t.className = "translated_message_div", t.hidden = !0, a.appendChild(t);
			let n = get_message_div(a);
			if (n && n.innerText.length > 0)
			{
				let s = n.innerHTML,
					[l, r] = await translate_message_HTML(s, e);
				l && r && (t.innerHTML = `\n                        <div class="targeted_language_code">${e}</div>\n                        <div class="detected_language_code">${l}</div>\n                        <div class="targeted_language_name">${languageNames.of(e)}</div>\n                        <div class="detected_language_name">${languageNames.of(l)}</div>\n                        <div class="translated_message">${r}</div>\n                        <div class="original_message">${s}</div>\n                    `, replace_message(a), a.addEventListener("click", (e =>
				{
					let t = e.target.dataset.jid || e.target.parentNode.dataset.jid || "";
					t && t.includes("@c.us") && openNumber(t.split("@c.us")[0], "")
				})))
			}
		}
		n == t.length - 1 && update_translate_button()
	}))
}

function translate_messages()
{
	let e = getDocumentElement("conversation_panel");
	if (!e) return;
	add_traslate_button();
	let t = null,
		a = e.scrollTop;

	function n(n = !1)
	{
		let s = Math.abs(e.scrollTop - a);
		(n || s > 33) && (a = e.scrollTop, translate_visible_messages()), window.clearTimeout(t);
		let l = getDocumentElement("today_yesterday_div"),
			r = document.getElementById("translate_div");
		r && (l ? (r.style.top = "35px", t = setTimeout((() => r.style.top = "0px"), 3200)) : r.style.top = "0px")
	}
	e.addEventListener("scroll", n), n(!0)
}
async function translate(e, t = "en", a = currentLanguage)
{
	return null == e || 0 === e.trim().length ? "" : new Promise((n =>
	{
		chrome.storage.local.get(["translatedCache"], (async function (s)
		{
			const l = s.translatedCache ||
			{};
			if (l[e] && l[e][a]) n(l[e][a]);
			else
			{
				const s = await translateAPI(e, t, a);
				l[e] || (l[e] = {}), l[e][a] = s, chrome.storage.local.set(
				{
					translatedCache: l
				}, (function ()
				{
					n(s)
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
	const s = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${t}&tl=${a}&dt=t&q=${encodeURI(e)}`;
	return await new Promise((t =>
	{
		try
		{
			$.getJSON(s, (function (e)
			{
				let a = e[0].map((e => e[0])).join(" ");
				t(n(a))
			}))
		}
		catch (a)
		{
			t(n(e))
		}
	}))
}
chrome.storage.local.get(["currentLanguage", "isTranslateMessageUsed", "lastDaySinceTranslateMessageUsed", "countOfDaysTranslateMessageUsed"], (e =>
{
	currentLanguage = e.currentLanguage || "default", is_translate_message_used = e.isTranslateMessageUsed || !1, last_day_since_translate_used = e.lastDaySinceTranslateMessageUsed || "", count_of_days_translate_used = e.countOfDaysTranslateMessageUsed || 0
})), chrome.runtime.onMessage.addListener(((e, t, a) =>
{
	"translate_language" === e.type && (currentLanguage = e.language)
}));