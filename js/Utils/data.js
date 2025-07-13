
let ALL_LANGUAGE_CODES = ["af", "am", "an", "ar", "ast", "az", "be", "bg", "bn", "br", "bs", "ca", "ckb", "co", "cs", "cy", "da", "de", "el", "en", "eo", "es", "et", "eu", "fa", "fi", "fil", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "ha", "haw", "he", "hi", "hr", "hu", "hy", "ia", "id", "is", "it", "ja", "ka", "kk", "km", "kn", "ko", "ku", "ky", "la", "ln", "lo", "lt", "lv", "mk", "ml", "mn", "mo", "mr", "ms", "mt", "nb", "ne", "nl", "nn", "no", "oc", "om", "or", "pa", "pl", "ps", "pt", "qu", "rm", "ro", "ru", "sd", "sh", "si", "sk", "sl", "sn", "so", "sq", "sr", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "to", "tr", "tt", "tw", "ug", "uk", "ur", "uz", "vi", "wa", "xh", "yi", "yo", "zh", "zu"];

//Classes or Selectors used in whatsapp content 
let DOCUMENT_ELEMENT_SELECTORS = {
    "app_div": [
        "#app"
    ],
    "main_panel": [
        "#main"
    ],
    "side_panel": [
        "#side"
    ],
    "left_side_contacts_panel": [
        "#pane-side"
    ],
    "contact_profile_div": [
        "._ak8h",
        "img.x1hc1fzr._ao3e",
        "svg.x1g40iwv"
    ],
    "conversation_panel_profile": [
        "[title=\"Profile details\"]"
    ],
    "today_yesterday_div": [
        "._1fyro",
        "._ao3e"
    ],
    "profile_header": [
        "._604FD",
        "._ak0z",
        "span.x1okw0bk"
    ],
    "conversation_panel": [
        "[data-testid=\"conversation-panel-messages\"]",
        "._5kRIK",
        "._ajyl",
        ".x1ewm37j"
    ],
    "left_side_contacts_name": [
        "#side ._ak8q span"
    ],
    "left_side_contacts_message": [
        "#side ._ak8j .x1cy8zhl"
    ],
    "conversation_panel_wrapper": [
        "[data-testid=\"conversation-panel-body\"]",
        "._3B19s",
        "._amm9",
        ".xnpuxes"
    ],
    "conversation_header": [
        "[data-testid=\"conversation-header\"]",
        "#main header"
    ],
    "conversation_header_name_div": [
        "._amie",
        "#main header .xeuugli"
    ],
    "conversation_message_div": [
        "[data-testid^=\"conv-msg\"]",
        "[data-id^=\"true\"]",
        "[data-id^=\"false\"]"
    ],
    "conversation_non_message_div": [
        ".focusable-list-item"
    ],
    "conversation_title_div": [
        "[data-testid=\"conversation-info-header-chat-title\"]",
        "#main header span"
    ],
    "conversation_compose_div": [
        "[data-testid=\"conversation-compose-box-input\"]",
        "._4r9rJ",
        "._ak1p",
        "._ak1r"
    ],
    "block_message_div": [
        "[data-testid=\"block-message\"]",
        "._1alON"
    ],
    "input_message_div": [
        "#main [contenteditable=\"true\"][role=\"textbox\"]",
        "#main p.selectable-text.copyable-text",
        "div[aria-placeholder=\"Type a message\"]",
        "div[aria-placeholder=\"Digite uma mensagem\"]",
        "div[aria-placeholder=\"اكتب رسالة\"]",
        "div[aria-activedescendant]"
    ],
    "footer_div": [
        "footer._3E8Fg",
        "footer._ak1i"
    ],
    "new_chat_btn": [
        "[data-icon=\"new-chat-outline\"]"
    ],
    "new_chat_parent": [
        "[aria-label=\"New chat\"]"
    ],
    "starting_chat_popup": [
        "[aria-label='Starting chat']",
        "[data-animate-modal-popup=\"true\"]:has(svg circle)"
    ],
    "invalid_chat_popup": [
        "[aria-label='Phone number shared via url is invalid.']",
        "[data-animate-modal-popup=\"true\"]:not(:has(svg circle))"
    ],
    "invalid_popup_ok_btn": [
        "[data-testid=\"popup-controls-ok\"]",
        "[data-animate-modal-popup=\"true\"]:not(:has(svg circle)) button"
    ],
    "send_message_btn": [
        "span[data-icon=\"send\"]",
        "span[data-icon=\"wds-ic-send-filled\"]",
        "button[aria-label=\"Send\"]",
        "button[aria-label=\"Enviar\"]",
        "button[aria-label=\"إرسال\"]"
    ]
};

// Google Analytics Config Data
let GA_CONFIG = {
    GA_ENDPOINT: 'https://www.google-analytics.com/mp/collect',
    GA_DEBUG_ENDPOINT: 'https://www.google-analytics.com/debug/mp/collect',
    MEASUREMENT_ID: 'G-RKJ49K5JXL',
    API_SECRET: 'jJNQa1g_Qw64CF4MRAKj7A',
    DEFAULT_ENGAGEMENT_TIME_MSEC: 100,
    SESSION_EXPIRATION_IN_MIN: 30,
}

// AWS APIs / URLs
let AWS_API = {
    GET_CONFIG_DATA: 'https://hpm53jwusnnb4vmbpmyzjppecy0omfxw.lambda-url.ap-south-1.on.aws/',
}

// FAQs
let FAQS = [
    {
        question: "Does it work in the desktop app?",
        answer: "No, it is a chrome extension and it works only on Google Chrome (Mac, Windows, and Linux)."
    },
    {
        question: "Does it work in my country?",
        answer: "Yes, every country in the world can use the extension."
    },
    {
        question: "How to send clickable links through WA Sender?",
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
    }
];

// Other Variables
let RUNTIME_CONFIG = {
    reloadInject: false,
    useOldInjectMethod: true,
    useOldMessageSending: true,
}
