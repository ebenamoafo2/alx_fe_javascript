// Initial array of quotes
let quotes = [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Knowledge is power.", category: "Wisdom" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Select elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const importFile = document.getElementById("importFile");
const exportBtn = document.getElementById("exportBtn");

// ---- Local & Session Storage Helpers ---- //
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// ---- Display Random Quote ---- //
function displayRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available yet!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;

    // Save last viewed quote in session storage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// ---- Add New Quote ---- //
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();

    alert("Quote added successfully!");
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    newQuoteText.focus();
}

// ---- JSON Export ---- //
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ---- JSON Import ---- //
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) {
                alert("Invalid file format. Must be an array of quotes.");
                return;
            }
            quotes.push(...importedQuotes);
            saveQuotes();
            alert("Quotes imported successfully!");
        } catch (error) {
            alert("Error importing file. Please check your JSON format.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// ---- Initialization ---- //
window.onload = function () {
    loadQuotes();

    const lastQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastQuote) {
        const parsedQuote = JSON.parse(lastQuote);
        quoteDisplay.textContent = `"${parsedQuote.text}" — (${parsedQuote.category})`;
    } else {
        displayRandomQuote();
    }
};

// ---- Event Listeners ---- //
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFile.addEventListener("change", importFromJsonFile);
