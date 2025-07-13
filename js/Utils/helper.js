function sendChromeMessage(message) {
    chrome.runtime.sendMessage(message);
}

function hasLeadingOrTrailingSpaces(inputString) {
    // Use a regular expression to check for leading or trailing white spaces
    const regex = /^\s+|\s+$/g;

    // Test the input string against the regular expression
    return regex.test(inputString);
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

// getting date format for the delivery report
function getReportDateFormat(date_ms, isDownloadName = false) {
    const today = new Date();
    const reportDate = new Date(date_ms);
    const diffDays = Math.round(Math.abs((today - reportDate) / (24 * 60 * 60 * 1000)));

    const reportDay = reportDate.getDate();
    const dayString = reportDay + getDaySuffix(reportDay);

    let reportTimeString = reportDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
    let reportDateString;

    if (isDownloadName || diffDays > 1) {
        reportDateString = `${dayString} ${reportDate.toLocaleDateString("en-US", { month: "short" })}`
    } else if (diffDays === 0) {
        reportDateString = "Today";
    } else if (diffDays === 1) {
        reportDateString = "Yesterday";
    }

    if (isDownloadName) {
        return `(Last Run at ${reportDateString} ${reportTimeString})`;
    }
    return `(Last Run: ${reportDateString} ${reportTimeString})`;
}

function getRandomNumber(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

function getTodayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

function isWithin24Hours(date, time) {
    let dateTime = new Date(date + 'T' + time);
    let now = new Date();
    let diffMs = Math.abs(now - dateTime);
    let diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 24;
}

function download_report() {
    let s = "data:text/csv;charset=utf-8," + rows.map(e => e.join(","))
        .join("\n");
    var o = encodeURI(s),
        l = document.createElement("a");
    l.setAttribute("href", o), l.setAttribute("download", "report.csv"), document.body.appendChild(l), l.click()
};

function get_label() {
    var label = '';
    if (my_number)
        label += my_number + ' ';
    if (plan_type)
        label += plan_type + ' ';
    chrome.storage.local.get(['plan_duration'], function (result) {
        if (result.plan_duration)
            label += result.plan_duration;
    })
    return label
}

function convertDate(date = null) {
    if (!date)
        date = new Date();
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function dateDiff(date1, date2) {
    if (date1 && date2)
        return Math.ceil((date2 - date1) / (1000 * 24 * 3600));
}

// Invoice Feature
// formatting the date
function formatDate(inputDate) {
    const dateParts = inputDate.split('/');
    const day = parseInt(dateParts[1]);
    const month = parseInt(dateParts[0]) - 1;
    const year = parseInt(dateParts[2]);
    const formattedDate = new Date(year, month, day);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDateString = formattedDate.toLocaleDateString('en-US', options);
    const splittedDate = formattedDateString.split(' ');
    let returnDateString = `${splittedDate[0]}, ${splittedDate[2]}`
    return returnDateString;
}

function getMonthIndex(month) {
    return MONTH_NAMES.indexOf(month);
}

function formatToIsoDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
}

function dateDiffInDays(date1, date2) {
    if (!date1 || !date2)
        return NaN;

    const [year1, month1, day1] = date1.split('-').map(Number);
    const [year2, month2, day2] = date2.split('-').map(Number);
    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getMonthDifference(date1, date2) {
    const [month1, year1] = date1.split(', ');
    const [month2, year2] = date2.split(', ');

    return (parseInt(year2) - parseInt(year1)) * 12 +
        (getMonthIndex(month2) - getMonthIndex(month1));
}

// sorting dates in descending order
function sortDatesDescending(dateArray) {
    return dateArray.sort(function (a, b) {
        const datePartsA = a.date.split('/').map(Number);
        const datePartsB = b.date.split('/').map(Number);

        const dateA = new Date(datePartsA[2], datePartsA[0] - 1, datePartsA[1]);
        const dateB = new Date(datePartsB[2], datePartsB[0] - 1, datePartsB[1]);

        return dateB - dateA;
    });
}

// ------ ASYNC FUNCTION -------

// Translate Function
async function translate(text, sourceLanguage = 'en', targetLanguage = 'default') {
    if (text === undefined || text === null || text.trim().length === 0)
        return "";

    // Check if the translation is already in cache
    return new Promise(resolve => {
        chrome.storage.local.get(['translatedCache', 'currentLanguage'], async function (result) {
            const cache = result.translatedCache || {};
            const currentLanguage = result.currentLanguage || 'default';

            if (currentLanguage !== 'default') {
                targetLanguage = currentLanguage;
            }

            if (cache[text] && cache[text][targetLanguage]) {
                resolve(cache[text][targetLanguage]);
            } else {
                const translatedText = await translateAPI(text, sourceLanguage, targetLanguage);

                if (!cache[text]) cache[text] = {};
                cache[text][targetLanguage] = translatedText;

                chrome.storage.local.set({ 'translatedCache': cache }, function () {
                    resolve(translatedText);
                });
            }
        });
    });
}

async function translateAPI(text, sourceLanguage = 'en', targetLanguage = 'default') {
    let filter = (normalText) => normalText.replaceAll(/<<(.*?)>>/gi, '<span class="styled_text">$1</span>');

    if (text === undefined || text === null || text.trim().length === 0)
        return "";
    if (targetLanguage === 'default' || targetLanguage === sourceLanguage)
        return filter(text);

    const translateAPI = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`;
    try {
        let response = await fetch(translateAPI);
        let data = await response.json();
        let translatedText = data[0].map(row => row[0]).join(' ');
        return filter(translatedText);
    } catch (e) {
        return filter(text);
    }
}