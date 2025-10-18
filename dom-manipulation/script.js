// --- Initial Quotes Array (Loaded from Local Storage or Defaults) ---
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { id: 1, text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { id: 2, text: "Knowledge is power.", category: "Wisdom" },
    { id: 3, text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// --- Select Elements ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const importFile = document.getElementById("importFile");
const exportBtn = document.getElementById("exportBtn");

// --- Simulated Server URL ---
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// --- Save to Local Storage ---
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --- Populate Categories Dynamically ---
function populateCategories() {
    const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = uniqueCategories
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("");

    const lastFilter = localStorage.getItem("selectedCategory");
    if (lastFilter) categoryFilter.value = lastFilter;
}

// --- Filter Quotes Based on Category ---
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);

    const filteredQuotes =
        selectedCategory === "all"
            ? quotes
            : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes found for this category.";
    } else {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
    }
}

// --- Display Random Quote ---
function displayRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available yet!";
        return;
    }

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// --- Add New Quote ---
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { id: Date.now(), text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();

    alert("Quote added locally and will sync soon!");
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    newQuoteText.focus();

    syncWithServer(newQuote);
}

// --- Fetch Quotes from Server ---
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();

        // Simulate 5 random quotes from server
        const fetchedQuotes = serverQuotes.slice(0, 5).map(item => ({
            id: item.id,
            text: item.title,
            category: "Server"
        }));

        // Merge without duplicates
        quotes = [...quotes, ...fetchedQuotes].reduce((acc, curr) => {
            if (!acc.some(q => q.id === curr.id)) acc.push(curr);
            return acc;
        }, []);

        saveQuotes();
        populateCategories();
        showNotification("Fetched latest quotes from server!");
        console.log("Fetched and merged quotes from server:", fetchedQuotes);
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// --- Simulate Sync with Server ---
async function syncWithServer(newQuote = null) {
    try {
        if (newQuote) {
            await fetch(SERVER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQuote),
            });
            console.log("Quote synced to server:", newQuote);
        }

        const response = await fetch(SERVER_URL);
        const serverData = await response.json();

        quotes = [...quotes, ...serverData].reduce((acc, curr) => {
            if (!acc.some(q => q.id === curr.id)) acc.push(curr);
            return acc;
        }, []);
        saveQuotes();
        console.log("Data synced with server and conflicts resolved.");

        showNotification("Quotes synced with server successfully!");
    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// --- Notification System ---
function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.background = "#333";
    notification.style.color = "#fff";
    notification.style.padding = "10px 15px";
    notification.style.borderRadius = "6px";
    notification.style.fontSize = "14px";
    notification.style.opacity = "0.9";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// --- Periodic Sync Every 20 Seconds ---
setInterval(syncWithServer, 20000);

// --- Initialize App ---
window.onload = async function () {
    const lastQuote = sessionStorage.getItem("lastViewedQuote");

    if (lastQuote) {
        const parsedQuote = JSON.parse(lastQuote);
        quoteDisplay.textContent = `"${parsedQuote.text}" — (${parsedQuote.category})`;
    } else {
        displayRandomQuote();
    }

    populateCategories();
    await fetchQuotesFromServer(); // ✅ fixed: waits for promise to resolve
};

// --- Event Listeners ---
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
