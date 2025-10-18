// Array of quote objects
let quotes = [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Knowledge is power.", category: "Wisdom" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const quoteFormContainer = document.getElementById("quoteFormContainer");

// Function to show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available yet!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
}

// Function to create and add a quote form dynamically
function createAddQuoteForm() {
    const form = document.createElement("div");

    form.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

    quoteFormContainer.appendChild(form);

    // Add quote event listener
    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// Function to add a new quote
function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));

    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
}

// Retrieve stored quotes and initialize
window.onload = function() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    showRandomQuote();
    createAddQuoteForm();
};

// Event listener for new quote button
newQuoteBtn.addEventListener("click", showRandomQuote);
