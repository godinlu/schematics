
/**
 * @type {import('./editable_devis.class').EditableDevis}
 */

/** @type {EditableDevis} */
let editable_devis;



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
    const {articles, categories, actions_saved, formulaire} = loadInitialData();
    const data_manager = new DataManager(articles, categories);

    let editable_devis_div = document.getElementById("editable-devis");
    
    editable_devis = new EditableDevis(editable_devis_div, data_manager, formulaire, actions_saved);
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
        const formulaire = JSON.parse(document.getElementById("data-formulaire").textContent); 
        return {articles, categories, actions_saved, formulaire};
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
    
    let form = document.getElementById('formulaire');

    saveAllData(form);

    form.action = event.target.href;
    form.submit();

}


/**
 * This function create hidden input in the form given to store all action done in the devis.
 * This function is also called by `header.js` when the user save his config
 * @param {HTMLElement} form 
 */
function saveAllData(form){
    let action_list_input = document.createElement("input");
    action_list_input.type = "hidden";
    action_list_input.name = "actions";
    action_list_input.value = JSON.stringify(editable_devis.action_list);

    form.appendChild(action_list_input);
}