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
const categoryFilter = document.getElementById("categoryFilter");

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
function displayRandomQuote(filteredList = quotes) {
    if (filteredList.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredList.length);
    const randomQuote = filteredList[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;

    // Save last viewed quote in session storage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// ---- Populate Category Dropdown ---- //
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category from storage
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
    }
}

// ---- Filter Quotes ---- //
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory); // remember last selection

    if (selectedCategory === "all") {
        displayRandomQuote(quotes);
    } else {
        const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
        displayRandomQuote(filteredQuotes);
    }
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
    populateCategories();

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
            populateCategories();
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
    populateCategories();

    const lastQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastQuote) {
        const parsedQuote = JSON.parse(lastQuote);
        quoteDisplay.textContent = `"${parsedQuote.text}" — (${parsedQuote.category})`;
    } else {
        filterQuotes();
    }
};

// ---- Event Listeners ---- //
newQuoteBtn.addEventListener("click", filterQuotes);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFile.addEventListener("change", importFromJsonFile);
