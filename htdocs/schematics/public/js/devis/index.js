/**
 * @type {import('./model/data_manager.class.js').DataManager}
 * @type {import('./components/devis_app.js').DevisApp}
 * @type {import('./store/devis_store.js').devisStore}
 */ 

document.addEventListener("DOMContentLoaded", () =>{
    init_app();
});


function init_app(){
    const {articles, categories, actions_saved, formulaire} = loadInitialData();

    const data_manager = new DataManager(articles, categories);
    // const devis_model = new DevisModel(data_manager, formulaire, actions_saved);

    devisStore.init(data_manager, actions_saved);

    const devis_app = new DevisApp(formulaire, actions_saved);
    devis_app.mount();

    // register all events
    register_events();
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
    let action_list_input = document.createElement("input");
    action_list_input.type = "hidden";
    action_list_input.name = "actions";
    action_list_input.value = JSON.stringify(devisStore.action_history);

    form.appendChild(action_list_input);
}


