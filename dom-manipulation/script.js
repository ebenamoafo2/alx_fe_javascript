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

// Function to show a random quote
function displayRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available yet!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
}

// Function to add a new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);

    // Optionally store in localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));

    alert("Quote added successfully!");
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    newQuoteText.focus();
}

// Retrieve quotes from localStorage if available
window.onload = function() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    displayRandomQuote();
};

// Event listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
