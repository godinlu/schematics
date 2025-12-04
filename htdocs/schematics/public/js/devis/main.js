// ---------------------------------------
// Main entry point for the application
// ---------------------------------------

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    console.log("App initialized");

    // Register event listeners
    registerEvents();

    // Initialize components
    initComponents();

    // Fetch data if needed
    const {articles, categories} = loadInitialData();
    const data_manager = new DataManager(articles, categories);

    const actions = [
        {type: "add", ref: "HYBX1MOD"},
        {type: "add", ref: "S7 2,5-CS-45-6"},
        {type: "add", ref: "MISE001"},
        {type: "add", ref: "SC2BMOD"}
    ]
    let render_div = document.getElementById("devis-container");

    let devis = new Devis(render_div, data_manager, actions);
    
    devis.render();
}

/**
 * Register all event listeners
 */
function registerEvents() {
    // Example: button click
}


/**
 * Initialize reusable UI components
 */
function initComponents() {
    // Example: sidebar, modals, dropdowns, etc.
    // initSidebar();
}

/**
 * Load initial 
 */
function loadInitialData() {
    try {
        const articles = JSON.parse(document.getElementById("data-articles").textContent); 
        const categories = JSON.parse(document.getElementById("data-categories").textContent); 
        return {articles: articles, categories: categories};
    } catch (error) {
        console.error("Error loading initial data:", error);
        return null;
    }
}
