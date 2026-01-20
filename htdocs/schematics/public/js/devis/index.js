/**
 * @type {import('./model/data_manager.class.js').DataManager}
 * @type {import('./components/devis_app.js').DevisApp}
 * @type {import('./store/devis_store.js').devisStore}
 */ 

document.addEventListener("DOMContentLoaded", () =>{
    init_app();
});


function init_app(){
    const {devis_tables, formulaire, devis_saved} = loadInitialData();

    const data_manager = new DataManager(devis_tables);

    devisStore.init(data_manager, devis_saved);

    const devis_app = new DevisApp(formulaire);

    devisStore.rebuild();

    // register all events
    register_events();
}


/**
 * Load initial 
 */
function loadInitialData() {
    try {
        const devis_tables = JSON.parse(document.getElementById("data-devis_tables").textContent); 
        const formulaire = JSON.parse(document.getElementById("data-formulaire").textContent); 
        const devis_saved = JSON.parse(document.getElementById("data-devis-saved").textContent);

        return {devis_tables, formulaire, devis_saved};
    } catch (error) {
        console.error("Error loading initial data:", error);
        return null;
    }
}


function register_events(){
    document.querySelectorAll(".saveForm").forEach(a =>{
        a.addEventListener("click" , handle_save_form);
    });
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
    form.innerHTML = ''; // clear previous hidden inputs

    const inputHistory = document.createElement("input");
    inputHistory.type = "hidden";
    inputHistory.name = "action_history";
    inputHistory.value = JSON.stringify(devisStore.action_history);

    const inputCursor = document.createElement("input");
    inputCursor.type = "hidden";
    inputCursor.name = "history_cursor";
    inputCursor.value = String(devisStore.history_cursor);

    form.appendChild(inputHistory);
    form.appendChild(inputCursor);
}


