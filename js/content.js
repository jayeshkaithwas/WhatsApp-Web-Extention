var close_img_src = chrome.runtime.getURL("logo/closeBtn.png");
var recommend_tick = chrome.runtime.getURL("logo/recommend-tickmark.png");
var export_contacts_text_src = chrome.runtime.getURL("logo/export-contact.svg");
var email_icon_src = chrome.runtime.getURL("logo/email.png");
var error_icon_src = chrome.runtime.getURL("logo/error.png");
var read_icon_src = chrome.runtime.getURL("logo/read.png");
var wall_clock_white_icon = chrome.runtime.getURL("logo/wall-clock-white.png");
var smile_icon = chrome.runtime.getURL("logo/smile.png");
var logo_img = chrome.runtime.getURL("logo/logo-img.png");
var arrow_left = chrome.runtime.getURL("logo/prime_arrow-left.png");
var arrow_right = chrome.runtime.getURL("logo/arrow-right.png");
var bulb_icon = chrome.runtime.getURL("logo/lightbulb.png");
var man_thinking = chrome.runtime.getURL("logo/man-thinking.png");
var cross_icon_src = chrome.runtime.getURL("logo/close-1.png");
var check_icon_src = chrome.runtime.getURL("logo/check-mark.png");
var eye_visible = chrome.runtime.getURL("logo/prime_eye-visible.png");
var eye_hidden = chrome.runtime.getURL("logo/prime_eye-hidden.png");
var delete_icon_src = chrome.runtime.getURL("logo/delete-icon.png");
var edit_icon_src = chrome.runtime.getURL("logo/edit_icon.png");   
var down_arrow_src = chrome.runtime.getURL("logo/down-arrow.png");
var drag_icon_src = chrome.runtime.getURL("logo/drag_icon.png");
var attachment_icon = chrome.runtime.getURL("logo/attach_symbol.png")

let link = document.createElement("link");
link.rel = "stylesheet";
link.href =
    "https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&family=PT+Sans+Caption&family=Reem+Kufi+Ink&display=swap";
document.head.appendChild(link);

let my_number = null,
    logged_in_user = null,
    my_account_type = null,
    plan_type = "Expired";

var rows = [],
    notifications_hash = {},
    stop = false,
    groupIdToName = {},
    contactIdToName = {};

var messages = ['Hello! how can we help you?', 'Hello!', 'Thank you for using service!'], reload_quick_reply_div = false, imageData;

let totalConvertedSize = 0;;

var location_info = { name: 'international', name_code: "US", currency: "USD", default: true };

var init_store_type = null, whatsapp_version = null, extension_version = chrome.runtime.getManifest().version;

(function addInject() {
    let jsPath = "/js/inject.js";
    let script_element = document.createElement("script");
    script_element.setAttribute("type", "text/javascript");
    script_element.setAttribute("id", "inject");
    script_element.src = chrome.runtime.getURL(jsPath);
    script_element.onload = function () {
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(script_element);
})();

// InjectJS Message Listener
window.addEventListener("message", injectMessageListner, false);

function injectMessageListner(event) {
    if (event.source != window || !event.data.type)
        return;

    let message_type = event.data.type;
    let message_payload = event.data.payload;

    // Handle error and success
    if (message_payload) {
        if (message_payload.error) {
            trackError(message_type, message_payload.error);
        } else if (message_type.includes('send')) {
            trackSuccess(message_type + "_success");
        }
    }

    // Handle message type
    switch (message_type) {
        case "get_init_store_type":
            init_store_type = localStorage.getItem('pro-sender::init_store_type');
            if (!init_store_type || init_store_type != message_payload) {
                init_store_type = message_payload;
                localStorage.setItem('pro-sender::init_store_type', init_store_type);
                trackSystemEvent("init_store_type", init_store_type);
            }
            break;

        case "get_whatsapp_version":
            whatsapp_version = localStorage.getItem('pro-sender::whatsapp-version');
            if (!whatsapp_version || whatsapp_version != message_payload) {
                whatsapp_version = message_payload;
                localStorage.setItem('pro-sender::whatsapp-version', whatsapp_version);
                trackSystemEvent("whatsapp_version", whatsapp_version);
            }
            break;

        case "get_all_groups":
            setGroupDataToLocalStorage(message_payload);
            break;

        case "get_all_contacts":
            setContactDataToLocalStorage(message_payload);
            break;
            
        case "get_all_labels":
            setLabelDataToLocalStorage(message_payload)
            break;
        
        case "get_all_lists":
            setListDataToLocalStorage(message_payload)
            break;
        

        // Handle send_message responses
        case "send_message_to_number":
        case "send_message_to_number_error":
            resolveSendMessageToNumber(message_payload);
            break;

        case "send_message_to_group":
        case "send_message_to_group_error":
            resolveSendMessageToGroup(message_payload);
            break;

        // Handle send_attachments responses
        case "send_attachments_to_number":
        case "send_attachments_to_number_error":
            resolveSendAttachmentsToNumber(message_payload);
            break;

        case "send_attachments_to_group":
        case "send_attachments_to_grpup_error":
            resolveSendAttachmentsToGroup(message_payload);
            break;

        default:
            break;
    }
}

// Close Reminder Popup if user clicks outside of it
document.addEventListener('click', (event) => {
    if(document.querySelector('.trial_popup')) {
        let popup = document.querySelectorAll('.trial_popup')[0];
        if(!popup.contains(event.target)) {
            document.body.removeChild(popup);
        }
    }
});

function setGroupDataToLocalStorage(data) {
    let finalGroupData = data.map((group) => {
        return {
            ...group,
            objId: 'g' + group.id._serialized.replace(/\D+/g, ""),
        }
    })
    chrome.storage.local.set({ "allGroupData": finalGroupData });

    const groupData = data;
    groupData.forEach((group) => {
        const groupid = group.id._serialized;
        if (groupid && group.name)
            groupIdToName[groupid] = group.name;
    })
}

function setContactDataToLocalStorage(data) {
    let finalContactData = data.map((contact) => {
        return {
            ...contact,
            objId: 'c' + contact.id._serialized.replace(/\D+/g, ""),
        }
    })
    chrome.storage.local.set({ "allContactData": finalContactData });

    const contactData = data;
    contactData.forEach((contact) => {
        const contact_id = contact.id._serialized;
        if (contact.id && contact.name)
            contactIdToName[contact_id] = contact.name;
        if (contact.id.user && contact.id.user === my_number){
            my_account_type = contact.isBusiness ? "Business" : "Normal";
            console.log(my_account_type)
            chrome.storage.local.set({"my_account_type" : my_account_type});
        }
    })
}

function setLabelDataToLocalStorage(data){
    chrome.storage.local.set({ "allLabelData" : data })
}

function setListDataToLocalStorage(data){
     let finalListData = data.map((list) => {
        return {
            ...list,
            objId: list.number ? 'c'+ list.number : 'g'+ list.id.replace(/\D+/g, ""),
        }
    })
    chrome.storage.local.set({ "allListData" : finalListData })
}

function init() {
    messageListener();
    fetchLocalStorage();
    fetchConfigData();
    callIfNoOtherPopups(showHowToUsePopup);

    window.onload = function () {
        if (window.location.host === "web.whatsapp.com") {
            reload_my_number();
            chrome.storage.local.get(["messages"], function (result) {
                if (result.messages) messages = result.messages;
            });

            setInterval(() => {
                const quick_reply_div = document.getElementById("quick_reply_div");
                if (!quick_reply_div || reload_quick_reply_div) {
                    quick_reply_messages();
                }

                const profile_header_buttons_div = document.getElementById('profile_header_buttons_div');
                if (!profile_header_buttons_div) {
                    profile_header_buttons();
                }

                const main_panel = document.getElementById('main') || document.querySelector(".x1m6msm");
                if (main_panel) {
                    toggle_blur(null);
                }

                const sidePanel = document.querySelector('#pane-side');
                if (!sidePanel) {
                    detectBanText();
                }
            }, 1000);

            trackSystemEvent('whatsapp_visit', my_number);
        }
        const profileHeaderInterval = setInterval(() => {
            const profile_header = getDocumentElement("profile_header");
            if (profile_header) {
                clearInterval(profileHeaderInterval);
            }
        }, 100);
    };
};
init();

function messageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case "number_message":
            case "group_message":
            case 'list_message':
                messenger(
                    request.numbers || request.groups || request.lists,
                    request.message,
                    request.time_gap,
                    request.csv_data,
                    request.customization,
                    request.caption_customization,
                    request.random_delay,
                    request.batch_size,
                    request.batch_gap,
                    request.caption,
                    request.send_attachment_first,
                    request.type
                );
                break;

            case "add_attachments":
                handleAddAttachment();
                break;

            case "reload_contacts":
                window.dispatchEvent(new CustomEvent("ProSender::get-all-contacts"));
                break;

            case "reload_favorites":
                window.dispatchEvent(new CustomEvent("ProSender::get-all-lists"));
                break;

            default:
                console.warn("Unknown request type:", request.type);
                break;
        }
    });
}

function fetchLocalStorage() {
    chrome.storage.local.get(['location_info'], (result) => {
        location_info = result.location_info || location_info;
    });
}

function profile_header_buttons() {
    const profile_header = getDocumentElement('profile_header');
    if (!profile_header) return;

    const profile_header_buttons_div = document.createElement('div');
    profile_header_buttons_div.id = 'profile_header_buttons_div';

    const profile_header_buttons_list = profile_header.children[0];
    profile_header_buttons_list.insertBefore(profile_header_buttons_div, profile_header_buttons_list.children[0]);

    // Profile Header Buttons
    add_profile_header_btn('blur_contacts', 'Blur chat, contact name and profile picture - Pro Sender', eye_hidden, generateBlurDropdown);

    // Handle other 
    const new_chat_btn = getDocumentElement('new_chat_btn');
    if (new_chat_btn && !new_chat_btn.classList.contains('CtaBtn')) {
        new_chat_btn.classList.add('CtaBtn');
    }
    const new_chat_parent = getDocumentElement('new_chat_parent');
    if (new_chat_parent) {
        new_chat_btn.title = "";
        handleShowTooltip({
            query: DOCUMENT_ELEMENT_SELECTORS['new_chat_parent'][0],
            text: "New chat",
            bottom: "-30px",
        });
    }
}

function add_profile_header_btn(btn_id, btn_title, btn_image = null, on_click) {
    const profile_header_buttons_div = document.querySelector('#profile_header_buttons_div');
    if (!profile_header_buttons_div) return;

    const existing_btn = document.querySelector(`#${btn_id}`);
    if (existing_btn) return;

    const btn = document.createElement('div');
    btn.id = btn_id;
    btn.classList.add('profile_header_button');
    btn.innerHTML = `<img src=${btn_image} class='${btn_id}_icon CtaBtn' alt='${btn_id}'>`;
    btn.addEventListener('click', on_click);

    profile_header_buttons_div.appendChild(btn);
    handleShowTooltip({
        query: `#${btn_id}`,
        text: btn_title,
        bottom: "-30px",
    });
}

async function generateBlurDropdown() {
    const blurBtn = document.getElementById("blur_contacts");
    const parentDiv = document.querySelector('#profile_header_buttons_div');
    const { isBlurred } = await chrome.storage.local.get("isBlurred");

    if (isBlurred) {
        await chrome.storage.local.set({ isBlurred: false });
        await toggle_blur(true);
        return;
    }

    if (!parentDiv || !blurBtn) return;

    const existingDropdown = document.querySelector('#blur_dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }

    const mainDiv = document.createElement("div");
    mainDiv.id = "blur_dropdown";
    mainDiv.classList.add("prime_profile_main", "blur_main");
    mainDiv.dir = "ltr";

    const topSection = document.createElement("div");
    topSection.classList.add("prime_profile_top");
    topSection.innerHTML = `
        <div class="prime_profile_cross" id="close_blur_dropdown">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" 
                viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M405 136.798L375.202 107 256 226.202 136.798 107 
                         107 136.798 226.202 256 107 375.202 136.798 405 
                         256 285.798 375.202 405 405 375.202 285.798 256z"></path>
            </svg>
        </div>
        <div class="prime_profile_logo">
            <div class="prime_profile_img blur_img">
                <img src="${logo_img}" alt="">
            </div>
            <h1>Blur Settings</h1>
        </div>`;

    const blurOptions = [
        { key: 'blur_chat_name', label: 'Chat Name' },
        { key: 'blur_profile_pic', label: 'Profile Picture' },
        { key: 'blur_chat_messages', label: 'Chat Messages' },
    ];

    const bodySection = document.createElement("div");
    bodySection.classList.add("prime_profile_body", "blur_body");

    const storedValues = await chrome.storage.local.get(blurOptions.map(opt => opt.key));

    let html = '';
    for (const item of blurOptions) {
        const checked = storedValues[item.key] ? 'checked' : '';
        html += `
            <div class="prime_rows blur_rows">
                <p class="prime_col prime_col_end blur_end">
                    <input type="checkbox" class="blur_checkbox" id="${item.key}" ${checked}>
                </p>
                <span class="prime_col">${item.label}</span>
            </div>`;
    }
    html += `<button class="blur_btn" id="blur_btn">Blur</button>`;
    bodySection.innerHTML = html;

    bodySection.querySelectorAll('.blur_checkbox').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            chrome.storage.local.set({ [checkbox.id]: checkbox.checked });
        });
    });

    mainDiv.append(topSection, bodySection);
    parentDiv.appendChild(mainDiv);

    document.getElementById("blur_btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        await chrome.storage.local.set({ isBlurred: true });
        await toggle_blur(true);
        mainDiv.remove()
    });

    document.getElementById("close_blur_dropdown").addEventListener("click", (e) => {
        e.stopPropagation();
        mainDiv.remove();
    });
}

async function toggle_blur(click_event) {
    try {
        const blurContactsBtn = document.getElementById('blur_contacts');
        const { isBlurred } = await chrome.storage.local.get("isBlurred");
        const blurKeys = ['blur_chat_name', 'blur_profile_pic', 'blur_chat_messages'];
        const blurSettings = await chrome.storage.local.get(blurKeys);
   
        const blurGroups = {
            blur_chat_name: [
                getDocumentElement('conversation_header_name_div'),
                ...getDocumentElement('left_side_contacts_name', true)
            ],
            blur_profile_pic: [...getDocumentElement('contact_profile_div', true),
                ...getDocumentElement("conversation_panel_profile",true)
            ],
            blur_chat_messages: [...getDocumentElement('conversation_message_div', true),
                ...getDocumentElement("left_side_contacts_message",true),
                ...getDocumentElement('conversation_non_message_div', true)
            ],

        };

        const alwaysBlur = [
            document.querySelector('#reply_div')
        ];

        for (const [key, elements] of Object.entries(blurGroups)) {
            if (blurSettings[key]) {
                elements.forEach(el => {
                    applyOrRemoveBlur(el, 'blur', isBlurred);
                });
            }
        }

        alwaysBlur.forEach(el => {
            applyOrRemoveBlur(el, 'blur', isBlurred);
        });

        if (click_event) {
            blurContactsBtn.classList.toggle('blurred', isBlurred);
            blurContactsBtn.innerHTML = `<img class='blur_icon' src=${isBlurred ? eye_visible : eye_hidden} alt='blur-info'>`;

            if (isBlurred) {
                trackButtonClick('blur_contacts');
            }
        }
    } catch (e) {
        console.error('Error :: toggle_blur :: ', e);
    }
}

function applyOrRemoveBlur(element, className, shouldApply) {
    try {
        if (!element)
            return;

        if (shouldApply) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    } catch (error) {
        console.log(error);
    }
}

function addAppBackdrop() {
    let app = getDocumentElement('app_div');
    if (app) {
        app.classList.add("edit_backdrop")
        app.addEventListener('click', handleAppClick, true);
    }
}

function handleAppClick(e) {
  e.stopImmediatePropagation(); 
  e.preventDefault();           
}

function removeAppBackdrop() {
    let app = getDocumentElement('app_div');
    if (app) {
        app.classList.remove("edit_backdrop")
        app.removeEventListener('click', handleAppClick, true);
    }
}


function quick_reply_messages() {
    let reply_div = document.getElementById("quick_reply_div");
    if (reply_div) {
        reply_div.parentNode.removeChild(reply_div);
    }

    reply_div = document.createElement("div");
    reply_div.id = 'quick_reply_div';

    const messagesHTML = messages.map(message => {
        let text = typeof message === "object" && message !== null
            ? message.title || message.message
            : message;

        let displayText = text.length > 47 ? text.substring(0, 47) + '...' : text;
        let background = message.color || 'var(--outgoing-background)';

        return `
            <button class="reply_click message_btn CtaBtn" style="background:${background}" value="${text}">
                ${message.title ? `<img src="${attachment_icon}" class="attachment_reply"/>` : ""}
                ${displayText}
            </button>`;
    }).join("");

    const buttonsHTML = `
        <div id="quick_reply_buttons_container" class="quick_reply_container">
            <button class="CtaBtn menu_btn" id="expand_quick_reply_btn" isExpand="false" style="display: none;">
                <img src="${down_arrow_src}" />
            </button>
            <button class="CtaBtn menu_btn" id="edit_quick_reply_btn">Edit</button>
        </div>`;

    reply_div.innerHTML = `
        <div id="quick_reply_messages_container" class="quick_reply_container">
            ${messagesHTML}
        </div>
        ${buttonsHTML}`;

    reply_div.addEventListener('click', (event) => {
        let message = event.target.value;
        send_quick_reply_message(message);
    });


    let footer_div = getDocumentElement('footer_div');
    if (footer_div) {
        footer_div.style.paddingTop = '36px';
        footer_div.appendChild(reply_div);

        let conversation_panel = getDocumentElement('conversation_panel');
        if (conversation_panel) {
            conversation_panel.scrollBy(0, 33);
        }

        reload_quick_reply_div = false;
    } else {
        return;
    }  

    let edit_btn = document.getElementById("edit_quick_reply_btn");
    edit_btn.addEventListener('click', (e) => {
        e.stopPropagation();
        edit_quick_reply_popup();
        addAppBackdrop();

        trackButtonClick('smart_reply_edit');
    }); 

    let expand_quick_reply_btn = document.getElementById("expand_quick_reply_btn");
    expand_quick_reply_btn.addEventListener('click', (e) => {
        e.stopPropagation();

        let isExpand = e.target.getAttribute('isExpand') === "true";
        let footer_div = getDocumentElement('footer_div')
        let quick_reply_div = document.getElementById("quick_reply_div");
        let messages_container = document.getElementById("quick_reply_messages_container");
    
        if (footer_div && quick_reply_div && messages_container) {
            if (!isExpand) {
                messages_container.style.flexWrap = 'wrap';
                footer_div.style.paddingTop = `${quick_reply_div.offsetHeight}px`;
                expand_quick_reply_btn.style.rotate = '180deg';
                trackButtonClick('smart_reply_div_expanded');
            } else {
                messages_container.style.flexWrap = 'nowrap';
                footer_div.style.paddingTop = '36px';
                expand_quick_reply_btn.style.rotate = '0deg';
            }    

            e.target.setAttribute('isExpand', (!isExpand).toString());
            // TRACK GOOGLE ANALYTICS FOR THIS NEW BUTTON
        }
    });

    // Show / Not show expand quick reply button
    setTimeout(() => {
        let container = document.getElementById("quick_reply_messages_container");
        let expand_btn = document.getElementById("expand_quick_reply_btn");
    
        if (container && expand_btn) {
            expand_btn.style.display = isOverflowing(container) ? "block" : "none";
        }
    }, 100);


    // updating premium usage for quick replies
    let quickReplyButton= document.getElementsByClassName('reply_click')[0];
    if(quickReplyButton){
        quickReplyButton.addEventListener('click', function (){
            chrome.storage.local.get(['premiumUsageObject'], function(result){
                if(result.premiumUsageObject!==undefined){
                    let updatedPremiumUsageObject = {...result.premiumUsageObject, quickReplies: true};
                    chrome.storage.local.set({'premiumUsageObject': updatedPremiumUsageObject});
                }
            });
        })
    }
}

function isOverflowing(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

async function send_quick_reply_message(message) {
    if (!message || message.trim().length == 0) return;

    let message_input_box = getDocumentElement('input_message_div');
    if (!message_input_box) return;

    trackButtonClick("smart_reply_sent");
    let result = messages.find(msg => typeof msg === "object" && msg.title === message);
    if(result){
        let conv_header = getDocumentElement('conversation_header');
        if (!conv_header) return;
        
        let conv_msg_div = getDocumentElement('conversation_message_div');
        let curr_chat_id = conv_msg_div.dataset['id'];
        if(!conv_msg_div || !conv_msg_div.dataset['id'].includes('@g.us')){
            let number_id = curr_chat_id.split('_')[1];
            window.dispatchEvent(new CustomEvent("ProSender::send-attachments", {
                detail: {
                    number: number_id,
                    attachments: result.blob,
                    name:result.name,
                    caption: result.caption,
                    quick:true
                }
            }));
        }else{
            let group_id = curr_chat_id.split('_')[1];
            window.dispatchEvent(new CustomEvent("ProSender::send-attachments-to-group", {
                detail: {
                    groupId: group_id,
                    attachments: result.blob,
                    name:result.name,
                    caption: result.caption,
                    quick:true
                }
            }));   
        }
    } else{
        pasteMessage(message);
        await sendMessageToNumber();
    }
}

function pasteMessage(text) {
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text", text);
    const event = new ClipboardEvent("paste", {
        clipboardData: dataTransfer,
        bubbles: true,
    });
    
    const inputMessageBox = getDocumentElement('input_message_div');
    inputMessageBox.dispatchEvent(event);
}

function filter_quick_reply_message(message) {
    return message
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

function refresh_quick_replies() {
    let messages_list = document.getElementById('quick_reply_messages_list');
    if (messages_list) {
        messages_list.innerHTML = messages.map((message, index) => {
            let message_bg_color = message.color || (document.body.classList.contains('dark') ? '#005c4b' : '#d9fdd3');
            return `
                <div class="message_row drag_handle" draggable="true" index="${index}">
                    <img class="CtaBtn drag_handle" src="${drag_icon_src}" title="Reorder"/>
                    <div class="message_div drag_handle" title="Send" style="background-color: ${message_bg_color}">${message.title || message.message || message}</div>
                    <input type="color" class="color-picker" index=${index} id="color${index}" value="${message_bg_color}" title="Change Background"/>
                    <img class="CtaBtn edit_message_btn" index="${index}" src="${edit_icon_src}" title="Edit"/>
                    <img class="CtaBtn delete_message_btn" index="${index}" src="${delete_icon_src}" title="Delete"/>
                </div>
            `;
        }).join("");        
    }

    chrome.storage.local.set({ messages: messages });
    chrome.storage.local.set({ totalConvertedSize: totalConvertedSize });
    reload_quick_reply_div = true;

    // Handle Drag and Drop Listenre
    let dragged_index = null;
    document.querySelectorAll('.message_row').forEach((row) => {
        row.addEventListener('dragstart', (e) => {
            let target_element = e.target;
            let target_row = target_element.closest('.message_row');
            
            if (target_element.classList.contains('drag_handle')) {
                dragged_index = parseInt(target_row.getAttribute('index'));
                target_row.style.opacity = '0.5';
            } else {
                e.preventDefault();
            }
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.target.closest('.message_row').classList.add('dragged');
        });

        row.addEventListener('dragleave', (e) => {
            e.target.closest('.message_row').classList.remove('dragged');
        });

        row.addEventListener('drop', (e) => {
            e.preventDefault();
            let target_element = e.target;
            let target_row = target_element.closest('.message_row');
            let dropped_index = parseInt(target_row.getAttribute('index'));
            
            if (dragged_index !== dropped_index) {
                let moved_item = messages.splice(dragged_index, 1)[0];
                messages.splice(dropped_index, 0, moved_item);
                refresh_quick_replies();
                trackButtonClick('smart_reply_reordered');
            }
        });

        row.addEventListener('dragend', (e) => {
            e.target.closest('.message_row').classList.remove('dragged');
            e.target.closest('.message_row').style.opacity = '1';
        });
    });
}

function getFileDetails(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("No file provided"));
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit per file
            resolve("More than 10MB file size is not allowed!");
            return;
        }

        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => {
            const base64String = fr.result;
            totalConvertedSize += base64String.length; // Track encoded data size
            if (totalConvertedSize > 50 * 1024 * 1024) { // 50MB total limit
                resolve("Upload limit reached. You can only upload up to 50MB in total.");
                return;
            }
            resolve({ name: file.name, blob: JSON.stringify(base64String) });
        };
        fr.onerror = err => reject(err);
    });
}

    // Toggle UI elements based on image selection
function toggleUI(showImageOptions) {
    document.getElementById("add_quick_img_btn_container").style.display = showImageOptions ? "flex" : "none";
    document.getElementById("add_quick_reply_btn_container").style.display = showImageOptions ? "none" : "flex";
    document.getElementById("title_input").style.display = showImageOptions ? "block" : "none";
    document.getElementById("add_quick_img_btn").style.display = showImageOptions ? "none" : "block";

    const captionField = document.getElementById("add_quick_reply_textarea");
    captionField.placeholder = showImageOptions ? "Type your caption here ..." : "Type your quick reply here";
    captionField.classList.toggle("title_textarea", showImageOptions);
}

// Display selected image name
function displayImageName(imageName,classRed) {
    let existingPTag = document.getElementById("image_name");
    if (!existingPTag) {
        existingPTag = document.createElement("p");
        existingPTag.className = `image_name ${classRed}`;
        existingPTag.id = "image_name";
        document.getElementById("inputs_container").append(existingPTag);
    }
    existingPTag.innerText = imageName;
}

// Reset UI elements after saving
function resetUI() {
    toggleUI(false);
    document.getElementById("image_name")?.remove();
    document.getElementById("title_input").value = "";
    document.getElementById("add_quick_reply_textarea").value = "";
}

async function handleImageSelection(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show and hide relevant UI elements
    toggleUI(true);

    try {
        imageData = await getFileDetails(file);
        if(typeof imageData !== 'string'){
            displayImageName(imageData.name,'');
        }else{
            resetUI()
            displayImageName(imageData,"error_class")
            setTimeout(() => {
                resetUI()
            }, 2000);
        }
    } catch (error) {
        resetUI()
        console.error(error.message);
    }
}

function edit_quick_reply_popup() {
    let edit_popup = document.getElementById('edit_quick_reply_popup');
    if (edit_popup) {
        document.body.removeChild(edit_popup);
    }

    edit_popup = document.createElement('div');
    edit_popup.id = 'edit_quick_reply_popup';
    edit_popup.className = 'edit_quick_reply_popup trial_popup';
    edit_popup.style.width = 'min(600px, 95%)';
    edit_popup.style.maxHeight = 'min(600px, 85%)';
    edit_popup.innerHTML = `
        <div class="edit_quick_reply_content trial_content">
            <span class="CtaCloseBtn popup-close-btn" id="close_edit_quick_reply_popup"><img src="${close_img_src}" /></span>

            <div class="trial_big_title">Edit / Add Quick Replies</div>
            <div id="quick_reply_messages_list" class="messages_list"></div>
            
            <div class="input_container">
                <div id="inputs_container">
                    <input type="text" id="title_input" placeholder="Name tag your quick reply here" class="title_input_container" style="display:none;" >
                    <textarea id="add_quick_reply_textarea" type="text" placeholder="Type your quick reply here"></textarea>
                    <img src="${attachment_icon}" alt="Add Attachment" id="add_quick_img_btn" class="attachment_icon tool-icon shimmer">
                </div>
                <div id="add_quick_reply_btn_container" class="btn_container">
                    <button id="add_quick_reply_btn" class="CtaBtn text_btn">Add Template</button>
                    <input type="file" id="select-image" hidden>
                </div>
                <div id="edit_quick_reply_btn_container" class="btn_container" style="display: none;">
                    <button id="save_quick_reply_btn" class="CtaBtn text_btn">Save</button>
                    <button id="cancel_quick_reply_btn" class="CtaBtn text_btn">Cancel</button>
                </div>
                <div id="add_quick_img_btn_container" class="btn_container" style="display: none;">
                    <button id="save_quick_img_btn" class="CtaBtn text_btn">Save</button>
                    <button id="cancel_quick_img_btn" class="CtaBtn text_btn">Cancel</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(edit_popup);
    refresh_quick_replies();

    // On close button click
    document.getElementById('close_edit_quick_reply_popup').addEventListener('click', () => {
        document.body.removeChild(edit_popup);
        removeAppBackdrop();
    })

    // Handle Delete, Edit, Save and Send functions
    document.getElementById('quick_reply_messages_list').addEventListener('click', (event) => {
        event.stopPropagation();

        let targetElement = event.target;
        let targetClass = event.target.classList;
        let targetIndex = parseInt(event.target.getAttribute('index'));
        
        if (targetClass.contains('delete_message_btn')) {
            // Delete quick reply message
            const [deletedItem] = messages.splice(targetIndex, 1); // Remove the file
            if (deletedItem && deletedItem.blob) {
                const byteSize = Math.ceil((deletedItem.blob.length * 3) / 4);
                totalConvertedSize -= byteSize; // Deduct from total size
            }
            refresh_quick_replies();

            trackButtonClick('smart_reply_deleted');
        } else if (targetClass.contains('edit_message_btn')) {
            // Add textarea to edit message
            if (!isNaN(targetIndex)) {
                refresh_quick_replies();
                document.querySelectorAll('.message_row')[targetIndex].classList.add('disabled');
                if(typeof messages[targetIndex] === 'object'){
                    toggleUI(true)
                    displayImageName(messages[targetIndex].name,'')
                    document.getElementById("title_input").value = messages[targetIndex].title;
                    document.getElementById("add_quick_reply_textarea").value = messages[targetIndex].caption;
                    document.getElementById('add_quick_img_btn_container').setAttribute('index', targetIndex);   
                } else {
                    document.getElementById('add_quick_reply_textarea').value = messages[targetIndex];
                    document.getElementById('add_quick_reply_btn_container').style.display = 'none';   
                    document.getElementById('edit_quick_reply_btn_container').style.display = 'flex';   
                    document.getElementById('edit_quick_reply_btn_container').setAttribute('index', targetIndex);   
                }

            }
        } else if (targetClass.contains('message_div')) {
            // Close popup and Send quick reply message
            document.body.removeChild(edit_popup);
            removeAppBackdrop();

            send_quick_reply_message(targetElement.innerText);
        }else if(targetClass.contains('color-picker')){

            targetElement.addEventListener("change", (e) => {
                let newColor = e.target.value;
                if(typeof messages[targetIndex] === 'object'){
                    messages[targetIndex].color = newColor;
                }else{
                    messages[targetIndex] = { message : messages[targetIndex], color : newColor }
                }
                refresh_quick_replies();
            }, { once: true });
            

        }
    })

    // Add quick reply message
    document.getElementById('add_quick_reply_btn').addEventListener('click', (event) => {
        event.stopPropagation();

        let new_message = document.getElementById('add_quick_reply_textarea').value;
        new_message = filter_quick_reply_message(new_message);

        if(new_message) {
            messages.push(new_message);
            refresh_quick_replies();

            document.getElementById('add_quick_reply_textarea').value = '';
            trackButtonClick('smart_reply_added');
        }
    })

    document.getElementById("add_quick_img_btn").addEventListener("click", (event) => {
        event.stopPropagation();
        
        const inputImage = document.getElementById("select-image");
        inputImage.click();
        inputImage.addEventListener("change", handleImageSelection, { once: true });
    });
    
    document.getElementById("save_quick_img_btn").addEventListener("click", () => {
        const inputContent = document.getElementById("title_input");
        const captionContent = document.getElementById("add_quick_reply_textarea");
        let target_index = document.getElementById('add_quick_img_btn_container').getAttribute('index'); 
    
        if (inputContent.value.trim()) {
            if(target_index){
                messages[target_index].title = filter_quick_reply_message(inputContent.value);
                messages[target_index].caption = filter_quick_reply_message(captionContent.value);
                document.getElementById('add_quick_img_btn_container').setAttribute('index', '');
            } else {
                imageData.title = filter_quick_reply_message(inputContent.value);
                imageData.caption = filter_quick_reply_message(captionContent.value);
                messages.push(imageData);
            }
    
            refresh_quick_replies();
            resetUI();
        } else {
            inputContent.focus();
        }
    });

    document.getElementById("cancel_quick_img_btn").addEventListener("click", () => {
        resetUI()
        let target_index = document.getElementById('add_quick_img_btn_container').getAttribute('index');
        if(target_index){
            document.querySelectorAll('.message_row')[target_index].classList.remove('disabled');
            document.getElementById('add_quick_img_btn_container').setAttribute('index', '');
        }

    });
        
    // Save edited quick reply message
    document.getElementById('save_quick_reply_btn').addEventListener('click', (event) => {
        event.stopPropagation();
        
        let new_message = document.getElementById('add_quick_reply_textarea').value.trim();
        let target_index = document.getElementById('edit_quick_reply_btn_container').getAttribute('index');   
        new_message = filter_quick_reply_message(new_message);

        if(new_message && target_index) {
            messages[target_index] = new_message;
            refresh_quick_replies();

            document.getElementById('add_quick_reply_textarea').value = '';
            document.getElementById('add_quick_reply_btn_container').style.display = 'flex';   
            document.getElementById('edit_quick_reply_btn_container').style.display = 'none';   
            document.getElementById('edit_quick_reply_btn_container').setAttribute('index', '');   
            trackButtonClick('smart_reply_edited');
        }
    });

    // Cancel edit quick reply message
    document.getElementById('cancel_quick_reply_btn').addEventListener('click', (event) => {
        event.stopPropagation();

        refresh_quick_replies();
        document.getElementById('add_quick_reply_textarea').value = '';
        document.getElementById('add_quick_reply_btn_container').style.display = 'flex';   
        document.getElementById('edit_quick_reply_btn_container').style.display = 'none';   
        document.getElementById('edit_quick_reply_btn_container').setAttribute('index', '');   
    });

    trackButtonView('edit_smart_reply_popup');
}

document.addEventListener('click', (event) => {
    if(document.querySelector("#blur_dropdown")){
        let popup = document.querySelector("#blur_dropdown");
        let icon = document.querySelector(".blur_contacts_icon")
        if(!popup.contains(event.target) && event.target !== icon){
            popup.remove()
        }
    }

    if(!document.querySelector("#edit_quick_reply_popup")){
        removeAppBackdrop();
    }
})

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        if (document.querySelector("#edit_quick_reply_popup")) {
            document.body.removeChild(document.querySelector("#edit_quick_reply_popup"));
            removeAppBackdrop();
        }
    }
});

async function reload_my_number() {
    let result = await chrome.storage.local.get('my_number');
    my_number = result.my_number || null;
    if (!my_number) {
        var last_wid = window.localStorage.getItem("last-wid");
        var last_wid_md = window.localStorage.getItem("last-wid-md");
        if (last_wid_md)
            my_number = window.localStorage.getItem("last-wid-md").split("@")[0].substring(1).split(":")[0];
        else if (last_wid)
            my_number = window.localStorage.getItem("last-wid").split("@")[0].substring(1);
        if (my_number)
            chrome.storage.local.set({ my_number: my_number });
    }
    if (!my_number) {
        trackSystemEvent('no_number', 'track');
        try {
            trackSystemEvent('no_number_local_storage', window.localStorage);
        } catch (e) {
            console.log(e)
        }
    } else {
        trackSystemEvent('my_number', my_number);
    }
}

async function readFileAndSaveToLocalStorage(e, localStorageName) {
    let files = e.target.files;
    let renderedFiles = [];

    let fileReadPromises = Array.from(files).map((file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Data = event.target.result;
                const fileData = {
                    name: file.name,
                    type: file.type,
                    data: base64Data
                };
                renderedFiles.push(fileData);
                resolve();
            };
            reader.readAsDataURL(file);
        });
    });
    await Promise.all(fileReadPromises);
    chrome.storage.local.set({ [localStorageName]: renderedFiles });
}

async function handleAddAttachment() {
    let inputElement = document.createElement('input');
    inputElement.type = "file";
    inputElement.id = "new_input_element";
    inputElement.multiple = true;
    document.body.appendChild(inputElement);
    inputElement.click();

    inputElement.addEventListener("change", async function(e) {
        let selectedFiles = inputElement.files;
        trackEvent('add_attachments', selectedFiles.length);
        await readFileAndSaveToLocalStorage(e, "linuxInputAttachments")
        inputElement.remove();
    });
}

function handleAddCSVInput(){
    let inputElement = document.createElement('input');
    inputElement.type = "file";
    inputElement.id = "new_csv_input_element";
    inputElement.accept = ".xls,.xlsx,.ods,.csv";
    document.body.appendChild(inputElement);
    inputElement.click();

    inputElement.addEventListener("change", async function(e){
        await readFileAndSaveToLocalStorage(e, "linuxCSVAttachment")
        inputElement.remove();
    });
}

// Google Analytics
function getTrackLabel() {
    try {
        return [my_number, plan_type, plan_duration].join(' ').trim();
    } catch {
        return '';
    }
}

function getTrackLocation() {
    return location_info.default ? {} : {
        city: location_info.city,
        region: location_info.region,
        country: location_info.country,
        dial_code: location_info.dial_code,
    }
}

function getTrackContext() {
    return {
        init_store_type: init_store_type,
        whatsapp_version: whatsapp_version,
        extension_version: extension_version,
    }
}

function trackEvent(event, track) {
    trackGenericEvent(event, { type: 'event', track, natural_interaction: true });
}

function trackButtonClick(event) {
    trackGenericEvent(event, { type: 'clicked', natural_interaction: true });
}

function trackCloseButtonClick(event) {
    trackGenericEvent(event, { type: 'clicked' });
}

function trackButtonView(event) {
    trackGenericEvent(event, { type: 'viewed' });
}

function trackSystemEvent(event, track = '') {
    trackGenericEvent(event, { type: 'event', track });
}

function trackSuccess(event) {
    trackGenericEvent(event, { type: 'success' });
}

function trackError(event, error = '') {
    trackGenericEvent(event, { type: 'error', error: String(error) })
}

function trackGenericEvent(event, data) {
    let label = getTrackLabel();
    let location = getTrackLocation();
    let context = getTrackContext();

    // Filters null and undefined values
    let combinedData = { ...location, ...context, ...data };
    let eventData = Object.fromEntries(
        Object.entries(combinedData).filter(([key, value]) => value != null || value != undefined) 
    );
    GoogleAnalytics.trackEvent(event, { label, ...eventData });
}

// ---- config-data OR data.js related functions ---

function getDocumentElement(key, selectAll = false) {
    try {
        if (DOCUMENT_ELEMENT_SELECTORS[key]) {
            for (const className of DOCUMENT_ELEMENT_SELECTORS[key]) {
                const element = (selectAll) ? document.querySelectorAll(className) : document.querySelector(className);
                if (element) {
                    return element;
                }
            }
        } else {
            console.log("Selector not exists:", key);
        }
    } catch (err) {
        console.log("Error while finding document element", err);
    }
    return null;
}

async function fetchConfigData() {
    try {
        const url = ``
        const response = await fetch(url);
        const jsonData = await response.json();
        const allConfigData = jsonData.data;

        if (allConfigData && Array.isArray(allConfigData)) {
            const configMap = createConfigMap(allConfigData);
            loadConfigData(configMap);
            console.log(`%cConfig Data Loaded`, 'color: lightGreen; font-weight: bold; font-size: 14px;');

            chrome.storage.local.get(['CONFIG_DATA'], (res) => {
                // console.log("OLD CONFIG DATA:", res.CONFIG_DATA);
                chrome.storage.local.set({ 
                    CONFIG_DATA: configMap,
                    RUNTIME_CONFIG: RUNTIME_CONFIG 
                });
                // console.log("NEW CONFIG DATA:", configMap);
            })
        } else {
            console.log("Config data not found. Api response:", jsonData);
        }
    } catch (err) {
        trackError("get_config_data_api_error", err);
        console.log("Error while fetching config data:", err);
    }
};

function createConfigMap(configArray) {
    const configMap = {};
    configArray.forEach(item => {
        if (item.name && item.data !== null) {
            configMap[item.name] = item.data;
        }
    });
    return configMap;
}

// Load AWS Config Data from API to Local Data (for content js)
function loadConfigData(configMap) {
    // Constant Objects
    if (configMap.GA_CONFIG)
        GA_CONFIG = { ...configMap.GA_CONFIG };
    if (configMap.DOCUMENT_ELEMENT_SELECTORS)
        DOCUMENT_ELEMENT_SELECTORS = { ...configMap.DOCUMENT_ELEMENT_SELECTORS };
    if (configMap.RUNTIME_CONFIG) {
        RUNTIME_CONFIG = { ...configMap.RUNTIME_CONFIG };
        if (RUNTIME_CONFIG.reloadInject) {
            window.dispatchEvent(new CustomEvent("ProSender::init", {
                detail: { useOldMethod: RUNTIME_CONFIG.useOldInjectMethod }
            }));
        }
    }
}

var ban_text_detected = false;
function detectBanText() {
    if (ban_text_detected)
        return;

    let banMessages = [
        "verify your phone number",
        "you will need to verify your phone number",
        "You have been logged out. To log back in, you will need to verify your phone number.", // English
        "आप लॉग आउट हो गए हैं। फिर से लॉग इन करने के लिए, आपको अपना फ़ोन नंबर सत्यापित करना होगा।", // Hindi
        "Você foi desconectado. Para fazer login novamente, será necessário verificar seu número de telefone.", // Brazilian Portuguese
        "Has cerrado sesión. Para volver a iniciar sesión, deberás verificar tu número de teléfono." // Spanish    
    ]

    for (const message of banMessages) {
        if (document.body.innerText.includes(message) || document.body.innerText.toLowerCase().includes(message.toLocaleLowerCase())) {
            // trackSystemEvent('banned_text', banMessages);
            trackSystemEvent('banned_text');
            ban_text_detected = true;
        }
    }
}

function showTooltip({ elementParentClass, text, positionTop, positionBottom, positionLeft, positionRight }) {
    const parentElement = document.querySelector(elementParentClass);
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip_main_container";
    if (positionTop)
        tooltip.style.top = positionTop;
    if (positionBottom)
        tooltip.style.bottom = positionBottom;
    if (positionLeft)
        tooltip.style.left = positionLeft;
    if (positionRight)
        tooltip.style.right = positionRight;
    tooltip.innerHTML = `
        <div>
            ${text}
        </div>
        <div class="tooltip_arrow"></div>
    `;
    parentElement.appendChild(tooltip);
}

function removeTooltip() {
    const tooltip = document.querySelector(".tooltip_main_container");
    if (tooltip) {
        tooltip.remove();
    }
}

function handleShowTooltip(element) {
    const parentElement = document.querySelector(element.query);
    if (parentElement) {
        parentElement.addEventListener("mouseover", () => {
            showTooltip({
                elementParentClass: element.query,
                text: element.text,
                positionTop: element.top,
                positionLeft: element.left,
                positionRight: element.right,
                positionBottom: element.bottom,
            });
        });
        parentElement.addEventListener("mouseout", () => {
            removeTooltip();
        });
    }
}
