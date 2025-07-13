const driver = window.driver.js.driver;

const sendObj = {
  showProgress: true,
  popoverClass: "driverjs-theme",
  steps: [
    {
      element: ".numbers-box",
      popover: {
        title: "Input Recipient Numbers",
        description:
          "Enter the contact numbers here to which your message will be delivered.",
      },
    },
    {
      element: ".message-box",
      popover: {
        title: "Compose Your Message",
        description:
          "Write the message you'd like to send to your recipients in this field.",
      },
    },
    {
      element: "#sender",
      popover: {
        title: "Initiate Message Dispatch",
        description:
          "Click the send button to begin the message-sending process. The extension will handle the rest automatically.",
        side: "left",
        align: "center",
      },
    },
  ],
};

const attachmentObj = {
  showProgress: true,
  popoverClass: "driverjs-theme",
  steps: [
    {
      element: ".numbers-box",
      popover: {
        title: "Enter Recipient Contact Numbers",
        description:
          "Input the contact numbers of the recipients to whom you would like to send the message.",
      },
    },
    {
      element: ".message-box",
      popover: {
        title: "Compose Your Message",
        description:
          "Write the message you'd like to send to your recipients in this field.",
      },
    },
    {
      element: ".attach_symbol.tooltip-trigger",
      popover: {
        title: "Select Attachment",
        description:
          "Click the attachment icon to open the file explorer and choose the files you wish to send.",
        onNextClick: () => {
          attachment_obj = true;
          document.querySelector("#select-attachments").click();
        },
      },
    },
    {
      element: ".checkbox-section",
      popover: {
        title: "Add Captions for Attachments",
        description:
          "Provide captions or descriptions to give more context or information about the attached files.",
      },
    },
    {
      element: "#sender",
      popover: {
        title: "Send Your Message",
        description:
          "Click the send button to dispatch the message along with the selected attachments. The extension will handle the process from here.",
        side: "left",
        align: "center",
      },
    },
  ],
};

const groupMsgObj = {
  showProgress: true,
  popoverClass: "driverjs-theme",
  steps: [
    {
      element: ".group_id",
      popover: {
        title: "Switch to Group Messaging",
        description:
          "Select the 'Groups' radio button to send messages to groups.",
      },
    },
    {
      element: ".groups_searchbar",
      popover: {
        title: "Choose Groups",
        description:
          "Select one or more groups where you want to send your message.",
      },
    },
    {
      element: ".message-box",
      popover: {
        title: "Compose Your Message",
        description:
          "Write the message you want to send to the selected groups.",
      },
    },
    {
      element: "#sender",
      popover: {
        title: "Send Your Message",
        description:
          "Click the send button to dispatch your message. The extension will take care of the rest.",
        side: "left",
        align: "center",
      },
    },
  ],
};

const customizationObj = {
  showProgress: true,
  popoverClass: "driverjs-theme",
  steps: [
    {
      element: "#download_template",
      popover: {
        title: "Download Sample Excel",
        description: "Click to download a sample Excel file. Use it as a guide to format your data correctly for this feature."
      }
    },
    {
      element: ".upload_excel_box",
      popover: {
        title: "Upload Excel",
        description:
          "Upload your excel here in which all the numbers are saved",
        onNextClick: () => {
          const excelElement = document.querySelector(".upload_excel_text");
          excelElement.click();
          customization_obj = true;
        },
      },
    },
    {
      element: ".customize_section",
      popover: {
        title: "Select customization",
        description:
          "click on the buttons which are the columns of your excel is add to your message box. It will send different messages to each as from the column select.",
      },
    },
    {
      element: ".message-box",
      popover: {
        title: "Compose Your Message",
        description:
          "Write the message you want to send to the selected numbers.",
      },
    },
    {
      element: "#sender",
      popover: {
        title: "Send Your Message",
        description:
          "Click the send button to dispatch your message. The extension will take care of the rest.",
        side: "left",
        align: "center",
      },
    },
  ],
};

const contactMsgObj = {
  showProgress: true,
  popoverClass: "driverjs-theme",
  steps: [
    {
      element: ".contact_id",
      popover: {
        title: "Switch to Contact Messaging",
        description: "Select the 'Contacts' radio button to send messages to your contacts.",
      },
    },
    {
      element: ".groups_searchbar",
      popover: {
        title: "Choose Contact Numbers",
        description: "Select one or more contact numbers where you want to send your message.",
      },
    },
    {
      element: ".message-box",
      popover: {
        title: "Compose Your Message",
        description: "Write the message you want to send to the selected contact numbers.",
      },
    },
    {
      element: "#sender",
      popover: {
        title: "Send Your Message",
        description: "Click the send button to dispatch your message. The extension will take care of the rest.",
        side: "left",
        align: "center",
      },
    },
  ],
};

async function fetchTranslations(obj) {
  const translatedObj = JSON.parse(JSON.stringify(obj));

  for (const step of translatedObj.steps) {
    if (step.popover) {
      step.popover.title = await translate(step.popover.title);
      step.popover.description = await translate(step.popover.description);
    }
  }

  return translatedObj;
}