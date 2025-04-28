let DID_YOU_KNOW_TIPS = ["You can add batching to reduce the chances of getting your number banned", "You can increase the time gap or change it to random to reduce the chances of getting your number banned", "You can create a business chat link for your business/organisation's website with the 'Business chat link' feature on the bottom left of the extension", "You can request for voice call and video call support", "You can customise your messages to the customer while sending messages", "You can edit and create your own quick responses to respond to messages faster and efficiently"],
	TRIAL_FEATURES = ["Export Group Contacts", "Translate Conversation", "Quick Replies", "Customizable Time Gap", "Random Time Gap", "Chat Support", "Batching", "Caption", "Save Message Template", "Detailed Delivery report"],
	PREMIUM_FEATURES = ["Schedule ", "Business Chat Link ", "Meet/Zoom Support ", "Multiple Attachments "],
	PREMIUM_REMINDER = {
		time_gap:
		{
			title: "Default time gap is 30 seconds",
			description: "to randomize or customize the time gap"
		},
		download_group_contacts:
		{
			title: "Export group contacts is a Premium feature",
			description: "to download group contacts"
		},
		smart_reply:
		{
			title: "Quick reply is a Premium feature",
			description: "to use quick reply"
		},
		batching:
		{
			title: "Batching is a Premium feature",
			description: "to use batching"
		},
		stop_campaign:
		{
			title: "Stop campaign is a Premium feature",
			description: "to stop your campaign"
		},
		send_message:
		{
			title: "Premium Expired",
			description: "to send messages"
		},
		schedule:
		{
			title: "Scheduling is an Advance Plan feature",
			description: "to schedule your messages"
		},
		business_chat_link:
		{
			title: "Business chat link is only for Advance Plan users",
			description: "to generate a business chat link"
		},
		zoom_call_support:
		{
			title: "Zoom call support is only for Advance Plan users",
			description: "to request zoom call support"
		},
		multiple_attachments:
		{
			title: "You can only send 1 attachment at a time",
			description: "to send multiple attachments"
		},
		pause_campaign:
		{
			title: "Pause campaign is an Advance Plan feature",
			description: "to pause your campaign"
		},
		resume_campaign:
		{
			title: "Resume campaign is an Advance Plan feature",
			description: "to resume your campaign"
		},
		download_chat_contacts:
		{
			title: "Export chat contacts is an Advance feature",
			description: "to download chat contacts"
		},
		default:
		{
			title: "",
			description: "to continue using that feature"
		}
	},
	SUCCESS_POPUP_DATA = {
		advance_promo_activated:
		{
			icon: "success_gif",
			title: "Congrats!",
			description: "You're now using Advance Premium",
			background_color: "#f99909",
			action_button:
			{
				text: "Okay",
				class: "action-green-btn",
				id: "close_advance_promo_activated_popup"
			}
		}
	},
	POPUP_DATA = {
		common:
		{
			recommend_text: "Recommended based on your usage",
			discount_text: "Discount applicable for only first month",
			purchase_note: "While purchasing, please enter the WhatsApp number you want to send messages from"
		},
		free_trial_start:
		{
			heading: "Congratulations!",
			title: "You get free trial for PREMIUM features!",
			icon: "free_trial_src",
			note: "Note: Main features will remain free even after trial",
			background_color: "#fff",
			action_button:
			{
				text: "Okay",
				class: "action-green-btn",
				id: "close_free_trial_start_popup"
			}
		},
		free_trial_reminder:
		{
			title: "Your trial of PREMIUM features expires in {VAR_DATE_DIFF} days! But do not worry",
			description: "Flat discount of 30% on PREMIUM EXCLUSIVELY for you!",
			background_color: "#f99909",
			pricing_buttons: !0,
			recommend_price: !0,
			discount_text: !0,
			purchase_note: !0,
			close_button: !0
		},
		free_trial_expired:
		{
			title: "Your trial for PREMIUM features has expired!! But do not worry",
			description: "Flat discount of 30% on PREMIUM EXCLUSIVELY for you!",
			icon: "wall_clock_white_icon",
			background_color: "#80C0B7",
			pricing_buttons: !0,
			recommend_price: !0,
			discount_text: !0,
			purchase_note: !0,
			close_button: !0
		},
		advance_promo_start:
		{
			heading: "Congratulations!",
			title: "You've received a coupon for {VAR_DATE_DIFF} days of Advance Premium for Free!",
			icon: "advance_promo_src",
			background_color: "#A480C0",
			action_button:
			{
				text: "Claim Now!",
				class: "action-green-btn claim-advance-promo",
				id: "close_advance_promo_start_popup"
			}
		},
		advance_promo_reminder:
		{
			title: "Your Advance Promo of PREMIUM features expires in {VAR_DATE_DIFF} days! But do not worry",
			description: "Flat discount of 30% on PREMIUM EXCLUSIVELY for you!",
			background_color: "#A480C0",
			pricing_buttons: !0,
			recommend_price: !0,
			discount_text: !0,
			purchase_note: !0,
			close_button: !0
		},
		advance_promo_expired:
		{
			title: "Your Advance Promo for PREMIUM features has expired!! But do not worry",
			description: "Flat discount of 30% on PREMIUM EXCLUSIVELY for you!",
			background_color: "#A480C0",
			icon: "wall_clock_white_icon",
			pricing_buttons: !0,
			recommend_price: !0,
			discount_text: !0,
			purchase_note: !0,
			close_button: !0
		},
		premium_expired:
		{
			title: "Your PREMIUM features {VAR_EXP_TEXT}! BUT don’t worry...",
			background_color: "#80C0B7",
			icon: "wall_clock_white_icon",
			pricing_buttons: !0,
			purchase_note: !0,
			close_button: !0
		}
	};
const COUNTRY_WITH_SPECIFIC_PRICING = {
	IN: "india",
	ID: "indonesia",
	AE: "uae",
	EG: "egypt",
	GB: "uk",
	SA: "saudi_arabia",
	KW: "kuwait",
	SG: "singapore",
	IL: "israel"
};
let BASIC_DISCOUNTED_PRICE = {
		india: "293*",
		indonesia: "33180* IDR",
		international: "$5.99*",
		uae: "AED 26.99*",
		egypt: "EGP 185.99*",
		kuwait: "$6.99*",
		singapore: "SGD 11*",
		israel: "ILS 26.99*",
		uk: "GBP 5.99*",
		saudi_arabia: "SAR 24.99*"
	},
	BASIC_NORMAL_PRICE = {
		india: "351",
		indonesia: "39510 IDR",
		international: "$6.99",
		uae: "AED 31.99",
		egypt: "EGP 220",
		kuwait: "$8",
		singapore: "SGD 12",
		israel: "ILS 32",
		uk: "GBP 6.99",
		saudi_arabia: "SAR 28.99"
	},
	BASIC_ACTUAL_PRICE = {
		international: "$12.99",
		india: "699",
		indonesia: "IDR 79000",
		uae: "AED 62.99",
		egypt: "EGP 439.99",
		kuwait: "$15.99",
		singapore: "SGD 23.99",
		israel: "ILS 62.99",
		uk: "GBP 13.99",
		saudi_arabia: "SAR 56.99"
	},
	ADVANCE_DISCOUNTED_PRICE = {
		india: "357*",
		indonesia: "41580* IDR",
		international: "$6.99*",
		uae: "AED 31.99*",
		egypt: "EGP 223.99*",
		kuwait: "$7.99*",
		singapore: "SGD 11.99*",
		israel: "ILS 31.99*",
		uk: "GBP 7.99*",
		saudi_arabia: "SAR 31.99*"
	},
	ADVANCE_NORMAL_PRICE = {
		india: "426",
		indonesia: "49500 IDR",
		international: "$7.99",
		uae: "AED 36.99",
		egypt: "EGP 265",
		kuwait: "$9.99",
		singapore: "SGD 13.99",
		israel: "ILS 36.99",
		uk: "GBP 8.99",
		saudi_arabia: "SAR 37.99"
	},
	ADVANCE_ACTUAL_PRICE = {
		international: "$9.99",
		india: "499",
		indonesia: "IDR 59400",
		uae: "AED 44.99",
		egypt: "EGP 318",
		kuwait: "$11.99",
		singapore: "SGD 16.99",
		israel: "ILS 44.99",
		uk: "GBP 10.99",
		saudi_arabia: "SAR 45.99"
	},
	MULT25ACCOUNTPRICE = {
		international: "$3.49",
		india: "149",
		indonesia: "IDR 49999",
		uae: "AED 11.49",
		egypt: "EGP 150.99",
		kuwait: "$3.49",
		singapore: "SGD 4.49",
		israel: "ILS 11.49",
		uk: "GBP 2.99",
		saudi_arabia: "SAR 11.49"
	},
	PRICING_DATA = {
		free_trial_reminder:
		{
			lastPlan: "Advance",
			basic_price: BASIC_DISCOUNTED_PRICE,
			advance_price: ADVANCE_DISCOUNTED_PRICE
		},
		free_trial_expired:
		{
			lastPlan: "Advance",
			basic_price: BASIC_DISCOUNTED_PRICE,
			advance_price: ADVANCE_DISCOUNTED_PRICE
		},
		advance_promo_reminder:
		{
			lastPlan: "Advance",
			basic_price: BASIC_DISCOUNTED_PRICE,
			advance_price: ADVANCE_DISCOUNTED_PRICE
		},
		advance_promo_expired:
		{
			lastPlan: "Advance",
			basic_price: BASIC_DISCOUNTED_PRICE,
			advance_price: ADVANCE_DISCOUNTED_PRICE
		},
		premium_expired:
		{
			lastPlan: "planExpired",
			basic_price: BASIC_NORMAL_PRICE,
			advance_price: ADVANCE_NORMAL_PRICE
		},
		buy_annual:
		{
			lastPlan: "Basic",
			basic_price: BASIC_NORMAL_PRICE,
			advance_price: ADVANCE_NORMAL_PRICE,
			basic_actual_price: BASIC_ACTUAL_PRICE,
			advance_actual_price: ADVANCE_ACTUAL_PRICE
		}
	},
	REPLACEMENT_HTML_TAGS = {
		BOLD:
		{
			replacement_regex: /<strong(.*?)>(.*?)<\/strong>/gi,
			replacement_pattern: "◉☰$2☰◉",
			replaceback_regex: /◉☰(.*?)☰◉/gi,
			replaceback_pattern: '<strong class="_ao3e selectable-text copyable-text" data-app-text-template="*${appText}*">$1</strong>'
		},
		ITALIC:
		{
			replacement_regex: /<em(.*?)>(.*?)<\/em>/gi,
			replacement_pattern: "◈☱$2☱◈",
			replaceback_regex: /◈☱(.*?)☱◈/gi,
			replaceback_pattern: '<em class="_ao3e selectable-text copyable-text" data-app-text-template="_${appText}_">$1</em>'
		},
		STRIKETHROUGH:
		{
			replacement_regex: /<del(.*?)>(.*?)<\/del>/gi,
			replacement_pattern: "◎☲$2☲◎",
			replaceback_regex: /◎☲(.*?)☲◎/gi,
			replaceback_pattern: '<del class="_ao3e selectable-text copyable-text" data-app-text-template="~${appText}~">$1</del>'
		},
		CODE:
		{
			replacement_regex: /<code(.*?)>(.*?)<\/code>/gi,
			replacement_pattern: "▮☳$2☳▮",
			replaceback_regex: /▮☳(.*?)☳▮/gi,
			replaceback_pattern: '<code class="_ao3e selectable-text copyable-text x1lcm9me x1yr5g0i xrt01vj x10y3i5r x14bl8p4 x10jhi2x x1e558r4 x150jy0e x1nn3v0j x1120s5i" data-app-text-template="`${appText}`">$1</code>'
		},
		ORDERED_LIST:
		{
			replacement_regex: /<li(.*?)value="(.*?)"(.*?)><span(.*?)>(.*?)<\/span><\/li>/gi,
			replacement_pattern: "❖⚌$2= $5⚌❖",
			replaceback_regex: /❖⚌(.*?)= (.*?)⚌❖/gi,
			replaceback_pattern: '<li dir="auto" value="$1" class="x1h0ha7o"><span class="_ao3e selectable-text copyable-text" data-pre-plain-text="$1. ">$2</span></li>'
		},
		UNORDERED_LIST:
		{
			replacement_regex: /<li(.*?)><span(.*?)>(.*?)<\/span><\/li>/gi,
			replacement_pattern: "⚉⚏$3⚏⚉",
			replaceback_regex: /⚉⚏(.*?)⚏⚉/gi,
			replaceback_pattern: '<li dir="auto" class="x1ye3gou x1jieuv1 xo7wnuk x1sy0ulg xt1y1ed xlu7um4 xm78dhd x1r4uxqn"><span class="_ao3e selectable-text copyable-text" data-pre-plain-text="- ">$1</span></li>'
		},
		EMOJI:
		{
			replacement_regex: /<img(.*?)>/gi,
			replacement_pattern: "▣▤▥"
		},
		MENTION:
		{
			replacement_regex: /<span role="button"(.*?)><span(.*?)>(.*?)<span(.*?)>(.*?)<\/span><\/span><\/span>/gi,
			replacement_pattern: "▩▨▧"
		},
		LINK:
		{
			replacement_regex: /<a(.*?)>(.*?)<\/a>/gi,
			replacement_pattern: "◬◭◮"
		},
		ORDERED_LIST_START:
		{
			replacement_regex: /<ol(.*?)>/gi,
			replacement_pattern: "🀞🀝🀜"
		},
		ORDERED_LIST_END:
		{
			replacement_regex: /<\/ol>/gi,
			replacement_pattern: "🀜🀝🀞"
		},
		UNORDERED_LIST_START:
		{
			replacement_regex: /<ul(.*?)>/gi,
			replacement_pattern: "🀕🀔🀓"
		},
		UNORDERED_LIST_END:
		{
			replacement_regex: /<\/ul>/gi,
			replacement_pattern: "🀓🀔🀕"
		}
	},
	DOCUMENT_ELEMENT_SELECTORS = {
		left_side_contacts_panel: ["#pane-side"],
		contact_profile_div: ["img.x1hc1fzr._ao3e"],
		today_yesterday_div: ["._1fyro", "._ao3e"],
		profile_header: ["._604FD", "._ak0z", "span.x1okw0bk"],
		conversation_panel: ['[data-testid="conversation-panel-messages"]', "._5kRIK", "._ajyl", ".x1rife3k"],
		conversation_panel_wrapper: ['[data-testid="conversation-panel-body"]', "._3B19s", "._amm9"],
		conversation_header: ['[data-testid="conversation-header"]', ".AmmtE", "._amid"],
		conversation_header_name_div: ["._amie"],
		conversation_message_div: ['[data-testid^="conv-msg"]', '[data-id^="true"]', '[data-id^="false"]'],
		conversation_non_message_div: [".focusable-list-item"],
		conversation_title_div: ['[data-testid="conversation-info-header-chat-title"]', ".AmmtE span", "._amid span"],
		conversation_compose_div: ['[data-testid="conversation-compose-box-input"]', "._4r9rJ", "._ak1p", "._ak1r"],
		block_message_div: ['[data-testid="block-message"]', "._1alON"],
		input_message_div: ['#main [contenteditable="true"][role="textbox"]'],
		footer_div: ["footer._3E8Fg", "footer._ak1i"],
		new_chat_btn: ['[data-icon="new-chat-outline"]'],
		starting_chat_popup: ['[data-animate-modal-popup="true"]:has(svg circle)'],
		invalid_chat_popup: ['[data-animate-modal-popup="true"]:not(:has(svg circle))'],
		invalid_popup_ok_btn: ['[data-testid="popup-controls-ok"]', '[data-animate-modal-popup="true"]:not(:has(svg circle)) button'],
		send_message_btn: ['span[data-icon="send"]']
	},
	
	ALL_LANGUAGE_CODES = ["af", "am", "an", "ar", "ast", "az", "be", "bg", "bn", "br", "bs", "ca", "ckb", "co", "cs", "cy", "da", "de", "el", "en", "eo", "es", "et", "eu", "fa", "fi", "fil", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "ha", "haw", "he", "hi", "hr", "hu", "hy", "ia", "id", "is", "it", "ja", "ka", "kk", "km", "kn", "ko", "ku", "ky", "la", "ln", "lo", "lt", "lv", "mk", "ml", "mn", "mo", "mr", "ms", "mt", "nb", "ne", "nl", "nn", "no", "oc", "om", "or", "pa", "pl", "ps", "pt", "qu", "rm", "ro", "ru", "sd", "sh", "si", "sk", "sl", "sn", "so", "sq", "sr", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "to", "tr", "tt", "tw", "ug", "uk", "ur", "uz", "vi", "wa", "xh", "yi", "yo", "zh", "zu"];
const RTL_LANGUAGE_CODES = ["ar", "he", "fa", "ur", "ps", "ug", "sd", "yi"];
let HELP_MESSAGE_LANGUAGE_CODES = ["en", "pt", "es", "id", "ar", "zh", "ru", "fr", "it", "tr", "he", "de"],
	HELP_MESSAGES = {
		REQUEST_CHAT_SUPPORT_BASIC: "Hi, I would like to request chat support for Pro Sender Basic.",
		REQUEST_CHAT_SUPPORT_ADVANCE: "Hi, I would like to request chat support for Pro Sender Advance.",
		REQUEST_ZOOM_SUPPORT_BASIC: "Hi, I would like to request video call support for Pro Sender Basic.",
		REQUEST_ZOOM_SUPPORT_ADVANCE: "Hi, I would like to request video call support for Pro Sender Advance.",
		REQUEST_CALL_SUPPORT_ADVANCE: "Hi, I would like to request call support for Pro Sender Advance.",
		REQUEST_CALL_SUPPORT_BASIC: "Hi, I would like to request call support for Pro Sender Basic.",
		UNSUBSCRIBE_PLAN: "Hi, I would like to unsubscribe from my plan.",
		LEARN_SCHEDULE: "Hi, I want to learn more about the Schedule feature.",
		NEED_HELP_NON_PREMIUM: "Hi, I need help in using Pro Sender."
	},
	SHOW_UPDATE_REMINDER_POPUP = !1,
	FAQS = [
	{
		question: "Does it work in the desktop app?",
		answer: "No, it is a chrome extension and it works only on Google Chrome (Mac, Windows, and Linux)."
	},
	{
		question: "Does it work in my country?",
		answer: "Yes, every country in the world can use the extension."
	},
	{
		question: "How to send clickable links through Pro Sender?",
		answer: "You can send a clickable link to anyone who</br>- Either has your number saved in their phone book</br>- Or has replied to you at least once."
	},
	{
		question: "How to correctly format the numbers column in CSV file?",
		answer: "1. Select the numbers column -> Right click -> Click on ‘Format Cells’.</br>2. Go to the ‘Number‘ category -> Go to ‘Decimal Places‘ box</br>3. Change it ‘0’ and click ‘OK’.</br>4. Verify that the numbers are now coming correctly."
	},
	{
		question: "How to send an attachment?",
		answer: "1. Click on 'Add Attachment' and select the type of attachment</br>2. Select the file you want to send</br>3. Your personal chat would open up - send the file in the chat.</br>4. Now open the extension and click on 'Send Message'. Your file will be sent one by one to all the contacts."
	},
	{
		question: "Can I send message to people in a group separately without saving their contacts?",
		answer: "Yes, you can. Here's how:</br>1. Open the respective group and click on the extension</br>2. Click on 'Download Group Contacts' and an excel of contact numbers will be downloaded</br>3. Upload this csv and enter the message you want to send in the extension."
	}],
	RUNTIME_CONFIG = {
		reloadInject: !1,
		useOldInjectMethod: !1,
		useOldMessageSending: !0
	};