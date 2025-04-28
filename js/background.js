let trial_days, number, redirect_url = "",
	bookmark_url = "https://chromewebstore.google.com/detail/pro-sender-bulk-whatsapp/nnaaobbghcgbefbkhinikgdolfkgnhfj";
const countryToCurrency = {
		AD: "EUR",
		AE: "AED",
		AF: "AFN",
		AG: "XCD",
		AI: "XCD",
		AL: "ALL",
		AM: "AMD",
		AN: "ANG",
		AO: "AOA",
		AQ: "USD",
		AR: "ARS",
		AS: "USD",
		AT: "EUR",
		AU: "AUD",
		AW: "AWG",
		AX: "EUR",
		AZ: "AZN",
		BA: "BAM",
		BB: "BBD",
		BD: "BDT",
		BE: "EUR",
		BF: "XOF",
		BG: "BGN",
		BH: "BHD",
		BI: "BIF",
		BJ: "XOF",
		BL: "EUR",
		BM: "BMD",
		BN: "BND",
		BO: "BOB",
		BQ: "USD",
		BR: "BRL",
		BS: "BSD",
		BT: "BTN",
		BV: "NOK",
		BW: "BWP",
		BY: "BYN",
		BZ: "BZD",
		CA: "CAD",
		CC: "AUD",
		CD: "CDF",
		CF: "XAF",
		CG: "XAF",
		CH: "CHF",
		CI: "XOF",
		CK: "NZD",
		CL: "CLP",
		CM: "XAF",
		CN: "CNY",
		CO: "COP",
		CR: "CRC",
		CU: "CUP",
		CV: "CVE",
		CW: "ANG",
		CX: "AUD",
		CY: "EUR",
		CZ: "CZK",
		DE: "EUR",
		DJ: "DJF",
		DK: "DKK",
		DM: "XCD",
		DO: "DOP",
		DZ: "DZD",
		EC: "USD",
		EE: "EUR",
		EG: "EGP",
		EH: "MAD",
		ER: "ERN",
		ES: "EUR",
		ET: "ETB",
		FI: "EUR",
		FJ: "FJD",
		FK: "FKP",
		FM: "USD",
		FO: "DKK",
		FR: "EUR",
		GA: "XAF",
		GB: "GBP",
		GD: "XCD",
		GE: "GEL",
		GF: "EUR",
		GG: "GBP",
		GH: "GHS",
		GI: "GIP",
		GL: "DKK",
		GM: "GMD",
		GN: "GNF",
		GP: "EUR",
		GQ: "XAF",
		GR: "EUR",
		GS: "FKP",
		GT: "GTQ",
		GU: "USD",
		GW: "XOF",
		GY: "GYD",
		HK: "HKD",
		HM: "AUD",
		HN: "HNL",
		HR: "EUR",
		HT: "HTG",
		HU: "HUF",
		ID: "IDR",
		IE: "EUR",
		IL: "ILS",
		IM: "GBP",
		IN: "INR",
		IO: "USD",
		IQ: "IQD",
		IR: "IRR",
		IS: "ISK",
		IT: "EUR",
		JE: "GBP",
		JM: "JMD",
		JO: "JOD",
		JP: "JPY",
		KE: "KES",
		KG: "KGS",
		KH: "KHR",
		KI: "AUD",
		KM: "KMF",
		KN: "XCD",
		KP: "KPW",
		KR: "KRW",
		KW: "KWD",
		KY: "KYD",
		KZ: "KZT",
		LA: "LAK",
		LB: "LBP",
		LC: "XCD",
		LI: "CHF",
		LK: "LKR",
		LR: "LRD",
		LS: "LSL",
		LT: "EUR",
		LU: "EUR",
		LV: "EUR",
		LY: "LYD",
		MA: "MAD",
		MC: "EUR",
		MD: "MDL",
		ME: "EUR",
		MF: "EUR",
		MG: "MGA",
		MH: "USD",
		MK: "MKD",
		ML: "XOF",
		MM: "MMK",
		MN: "MNT",
		MO: "MOP",
		MP: "USD",
		MQ: "EUR",
		MR: "MRU",
		MS: "XCD",
		MT: "EUR",
		MU: "MUR",
		MV: "MVR",
		MW: "MWK",
		MX: "MXN",
		MY: "MYR",
		MZ: "MZN",
		NA: "NAD",
		NC: "XPF",
		NE: "XOF",
		NF: "AUD",
		NG: "NGN",
		NI: "NIO",
		NL: "EUR",
		NO: "NOK",
		NP: "NPR",
		NR: "AUD",
		NU: "NZD",
		NZ: "NZD",
		OM: "OMR",
		PA: "PAB",
		PE: "PEN",
		PF: "XPF",
		PG: "PGK",
		PH: "PHP",
		PK: "PKR",
		PL: "PLN",
		PM: "EUR",
		PN: "NZD",
		PR: "USD",
		PS: "ILS",
		PT: "EUR",
		PW: "USD",
		PY: "PYG",
		QA: "QAR",
		RE: "EUR",
		RO: "RON",
		RS: "RSD",
		RU: "RUB",
		RW: "RWF",
		SA: "SAR",
		SB: "SBD",
		SC: "SCR",
		SD: "SDG",
		SE: "SEK",
		SG: "SGD",
		SH: "SHP",
		SI: "EUR",
		SJ: "NOK",
		SK: "EUR",
		SL: "SLE",
		SM: "EUR",
		SN: "XOF",
		SO: "SOS",
		SR: "SRD",
		SS: "SSP",
		ST: "STN",
		SV: "USD",
		SX: "ANG",
		SY: "SYP",
		SZ: "SZL",
		TC: "USD",
		TD: "XAF",
		TF: "EUR",
		TG: "XOF",
		TH: "THB",
		TJ: "TJS",
		TK: "NZD",
		TL: "USD",
		TM: "TMT",
		TN: "TND",
		TO: "TOP",
		TR: "TRY",
		TT: "TTD",
		TV: "AUD",
		TW: "TWD",
		TZ: "TZS",
		UA: "UAH",
		UG: "UGX",
		UM: "USD",
		US: "USD",
		UY: "UYU",
		UZ: "UZS",
		VA: "EUR",
		VC: "XCD",
		VE: "VES",
		VG: "USD",
		VI: "USD",
		VN: "VND",
		VU: "VUV",
		WF: "XPF",
		WS: "WST",
		YE: "YER",
		YT: "EUR",
		ZA: "ZAR",
		ZM: "ZMW",
		ZW: "ZWL"
	},
	countryToDialCode = {
		AF: "+93",
		AL: "+355",
		DZ: "+213",
		AS: "+1684",
		AD: "+376",
		AO: "+244",
		AI: "+1264",
		AQ: "+672",
		AG: "+1268",
		AR: "+54",
		AM: "+374",
		AW: "+297",
		AU: "+61",
		AT: "+43",
		AZ: "+994",
		BS: "+1242",
		BH: "+973",
		BD: "+880",
		BB: "+1246",
		BY: "+375",
		BE: "+32",
		BZ: "+501",
		BJ: "+229",
		BM: "+1441",
		BT: "+975",
		BO: "+591",
		BA: "+387",
		BW: "+267",
		BR: "+55",
		IO: "+246",
		BN: "+673",
		BG: "+359",
		BF: "+226",
		BI: "+257",
		KH: "+855",
		CM: "+237",
		CA: "+1",
		CV: "+238",
		KY: "+345",
		CF: "+236",
		TD: "+235",
		CL: "+56",
		CN: "+86",
		CX: "+61",
		CC: "+61",
		CO: "+57",
		KM: "+269",
		CG: "+242",
		CD: "+243",
		CK: "+682",
		CR: "+506",
		CI: "+225",
		HR: "+385",
		CU: "+53",
		CY: "+357",
		CZ: "+420",
		CW: "+599",
		IC: "+34",
		DK: "+45",
		DJ: "+253",
		DM: "+1767",
		DO: "+1809",
		EC: "+593",
		EG: "+20",
		SV: "+503",
		GQ: "+240",
		ER: "+291",
		EE: "+372",
		ET: "+251",
		FK: "+500",
		FO: "+298",
		FJ: "+679",
		FI: "+358",
		FR: "+33",
		GF: "+594",
		PF: "+689",
		TF: "+262",
		GA: "+241",
		GM: "+220",
		GE: "+995",
		DE: "+49",
		GH: "+233",
		GI: "+350",
		GR: "+30",
		GL: "+299",
		GD: "+1473",
		GP: "+590",
		GU: "+1671",
		GT: "+502",
		GG: "+44",
		GN: "+224",
		GW: "+245",
		GY: "+592",
		HT: "+509",
		HM: "+672",
		VA: "+379",
		HN: "+504",
		HK: "+852",
		HU: "+36",
		IS: "+354",
		IN: "+91",
		ID: "+62",
		IR: "+98",
		IQ: "+964",
		IE: "+353",
		IM: "+44",
		IL: "+972",
		IT: "+39",
		JM: "+1658",
		JP: "+81",
		JE: "+44",
		JO: "+962",
		KZ: "+77",
		KE: "+254",
		KI: "+686",
		KP: "+850",
		KR: "+82",
		KW: "+965",
		KG: "+996",
		XK: "+383",
		LA: "+856",
		LV: "+371",
		LB: "+961",
		LS: "+266",
		LR: "+231",
		LY: "+218",
		LI: "+423",
		LT: "+370",
		LU: "+352",
		MO: "+853",
		MK: "+389",
		MG: "+261",
		MW: "+265",
		MY: "+60",
		MV: "+960",
		ML: "+223",
		MT: "+356",
		MH: "+692",
		MQ: "+596",
		MR: "+222",
		MU: "+230",
		YT: "+262",
		MX: "+52",
		FM: "+691",
		MD: "+373",
		MC: "+377",
		MN: "+976",
		ME: "+382",
		MS: "+1664",
		MA: "+212",
		MZ: "+258",
		MM: "+95",
		NA: "+264",
		NR: "+674",
		NP: "+977",
		NL: "+31",
		BQ: "+599",
		NC: "+687",
		NZ: "+64",
		NI: "+505",
		NE: "+227",
		NG: "+234",
		NU: "+683",
		NF: "+672",
		MP: "+1670",
		NO: "+47",
		OM: "+968",
		PK: "+92",
		PW: "+680",
		PS: "+970",
		PA: "+507",
		PG: "+675",
		PY: "+595",
		PE: "+51",
		PH: "+63",
		PN: "+872",
		PL: "+48",
		PT: "+351",
		PR: "+1787",
		QA: "+974",
		RO: "+40",
		RU: "+7",
		RW: "+250",
		RE: "+262",
		BL: "+590",
		SH: "+290",
		KN: "+1869",
		LC: "+1758",
		MF: "+590",
		PM: "+508",
		VC: "+1784",
		WS: "+685",
		SM: "+378",
		ST: "+239",
		SA: "+966",
		SN: "+221",
		RS: "+381",
		SC: "+248",
		SL: "+232",
		SG: "+65",
		SK: "+421",
		SI: "+386",
		SB: "+677",
		SO: "+252",
		ZA: "+27",
		GS: "+500",
		ES: "+34",
		LK: "+94",
		SD: "+249",
		SS: "+211",
		SR: "+597",
		SJ: "+47",
		SZ: "+268",
		SE: "+46",
		CH: "+41",
		SY: "+963",
		SX: "+721",
		TW: "+886",
		TJ: "+992",
		TZ: "+255",
		TH: "+66",
		TL: "+670",
		TG: "+228",
		TK: "+690",
		TO: "+676",
		TT: "+1868",
		TN: "+216",
		TR: "+90",
		TM: "+993",
		TC: "+1649",
		TV: "+688",
		UG: "+256",
		UA: "+380",
		AE: "+971",
		GB: "+44",
		US: "+1",
		UY: "+598",
		UZ: "+998",
		VU: "+678",
		VE: "+58",
		VN: "+84",
		VG: "+1284",
		VI: "+1340",
		WF: "+681",
		EH: "+212",
		YE: "+967",
		ZM: "+260",
		ZW: "+263",
		AX: "+358"
	};

function messageListner()
{
	chrome.runtime.onMessage.addListener(listner)
}

function listner(e, t, n)
{
	"send_notification" === e.type && send_notification(e.title, e.message), "ga" === e.type && _gaq.push(["_trackEvent", e.event + "v3", e.track, e.label]), "set_uninstall_url" === e.type && (trial_days = e.trial_days, number = e.number, redirect_url += `?trialDays=${trial_days}&number=${number}`, chrome.runtime.setUninstallURL(redirect_url))
}

function send_notification(e, t)
{
	
}

function sendMessageToContent(e)
{
	try
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
	catch (e)
	{}
}

function bcdinit()
{
	messageListner(), chrome.identity.getProfileUserInfo((function (e)
	{
		chrome.runtime.onMessage.addListener((function (t, n, o)
		{
			o(
			{
				email: e.email
			})
		}))
	}))
}
async function fetchCountryInfo()
{
	let e = {
			name: "India",
			name_code: "IN",
			dial_code: "91",
			currency: "INR",
			default: !0,
			ipAdd: ""
		},
		t = {
			name: "international",
			name_code: "US",
			currency: "USD",
			default: !0,
			ipAdd: ""
		},
		n = await new Promise(((e, t) =>
		{
			fetch("https://get.geojs.io/v1/ip/geo.json").then((e => e.json())).then((t => e(
			{
				name: t.country,
				name_code: t.country_code,
				dial_code: countryToDialCode[t.country_code],
				currency: countryToCurrency[t.country_code],
				city: t.city,
				region: t.region,
				country: t.country,
				default: !1,
				ipAdd: t.ip
			}))).catch((() => e(null)))
		}));
	null === n ? chrome.storage.local.set(
	{
		country_info: e,
		location_info: t
	}) : chrome.storage.local.set(
	{
		country_info: n,
		location_info: n
	})
}

function hasAnHourPassed(e)
{
	return getCurrentTime() - e >= 36e5
}

function getCurrentTime()
{
	return (new Date).getTime()
}
chrome.runtime.onInstalled.addListener((async function (e)
{
	send_notification("Pro Sender is installed", ""), fetchCountryInfo(), chrome.storage.local.set(
	{
		ptc852: 0,
		fva853: !0,
		dsi854: 1,
		id855: (new Date).toDateString(),
		itc856: !1,
		ltod857: null,
		facc859: 0,
		atd860: !1,
		icu861: !1,
		coeu862: 0,
		ldeu863: null
	}), chrome.tabs.query(
	{
		url: "*://web.whatsapp.com/*"
	}, (function (e)
	{
		e.length > 0 ? chrome.tabs.update(e[0].id,
		{
			active: !0
		}, (function ()
		{
			chrome.tabs.reload(e[0].id)
		})) : chrome.tabs.create(
		{
			url: "https://web.whatsapp.com/"
		})
	})), chrome.bookmarks.search(
	{
		url: bookmark_url
	}, (function (e)
	{
		0 === e.length && chrome.bookmarks.create(
		{
			parentId: "1",
			title: "Pro Sender",
			url: bookmark_url
		})
	}))
})), chrome.storage.session.setAccessLevel(
{
	accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"
}), chrome.runtime.setUninstallURL(redirect_url), bcdinit(), chrome.tabs.onActivated.addListener((async e =>
{
	try
	{
		let t = e.tabId,
			n = await chrome.tabs.get(t);
		n.url && n.url.includes("") && chrome.storage.local.set(
		{
			visitedProSender: !0
		}), n.url && n.url.includes("web.whatsapp.com") && chrome.storage.local.get("visitedProSender", (function (e)
		{
			e.visitedProSender && (chrome.tabs.reload(t), chrome.storage.local.set(
			{
				visitedProSender: !1
			}))
		}))
	}
	catch (e)
	{
		console.error("Error getting tab info:", e)
	}
})), chrome.runtime.onUpdateAvailable.addListener((e =>
{
	console.log("Update available:", e.version)
}));