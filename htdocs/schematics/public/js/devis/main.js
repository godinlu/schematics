
/** @type {Devis} */
let devis;


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
    const {articles, categories, actions_saved} = loadInitialData();
    const data_manager = new DataManager(articles, categories);

    let render_div = document.getElementById("devis-container");

    devis = new Devis(render_div, data_manager, actions_saved);
    devis.render();
}

/**
 * Register all event listeners
 */
function registerEvents() {
    document.querySelectorAll(".saveForm").forEach(a =>{
        a.addEventListener("click" , handle_save_form);
    });
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
        const actions_saved = JSON.parse(document.getElementById("data-actions-saved").textContent); 
        return {articles, categories, actions_saved};
    } catch (error) {
        console.error("Error loading initial data:", error);
        return null;
    }
}


/**
 * Prevent the default event to submit some form data :
 * - action list
 * - articles quantity
 * @param {Event} event 
 */
function handle_save_form(event){
    event.preventDefault();
    
    let form = document.getElementById('devis');

    // add the action list in a hidden input
    let action_list_input = document.createElement("input");
    action_list_input.type = "hidden";
    action_list_input.name = "actions";
    action_list_input.value = JSON.stringify(devis.actions);
    form.appendChild(action_list_input);

    form.action = event.target.href
    form.submit();

}