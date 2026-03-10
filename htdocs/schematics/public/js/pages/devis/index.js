/**
 * @typedef {import('../../core/session.store.js')}
 * @type {import('./model/data_manager.class.js').DataManager}
 * @type {import('./components/devis_app.js').DevisApp}
 * @type {import('./store/devis_store.js').devisStore}
 */ 

document.addEventListener("DOMContentLoaded", () =>{
    // load initial data
    const devis_tables = JSON.parse(document.getElementById("data-devis_tables").textContent);

    const data_manager = new DataManager(devis_tables);

    devisStore.init(data_manager, sessionStore.devis);

    const devis_app = new DevisApp(sessionStore.formulaire);

    devisStore.rebuild();
});



