function main(){
    Modal.init(document.getElementById("modal_window"));
    Devis.init();

    Modal.update();

    // ajoute les articles par défault
    for (const row of default_articles) {
      Devis.add_article(row.ref);
    }

    // si une sauvegarde de devis existe alors:
    if (typeof devis_data !== 'undefined'){
      // on commence par faire toute les actions qui ont été sauvegarder
      for (const action of devis_data["actions"]) {
        Actions.push(action);
      }

      //ensuite on met à jour toute les quantités sauvegardé
      for (const key in devis_data) {
        let input_qte = document.querySelector(`input[name="${key}"]`);
        if (input_qte) input_qte.value = devis_data[key];
      }
    }

    add_event_listener();

}
/**
 * cette fonction est appelé à l'initialisation.
 * Elle ajoute les event listener global
 */
function add_event_listener(){
  // ajoute l'event pour gérer la sauvegarde des actions lors du changement de page.
  document.querySelectorAll(".saveForm").forEach(a =>{
    a.addEventListener("click" , handleMenuClick);
  });

  // ajoute les event listener au bouton d'ajout d'article
  document.querySelectorAll(".button_add").forEach(button =>{
    button.addEventListener("click", () =>{
      Url.add_article(parseInt(button.value));
    });
  });

  // update la fenêtre modale pour l'evenement popstate
  window.addEventListener('popstate', function(event) {
    Modal.update();
  });
}

/**
 * cette fonction redirige le formulaire vers la page souhaité pour sauvegarder les données du devis
 * @param {Event} event 
 */
function handleMenuClick(event){
  event.preventDefault();
  const form = document.getElementById('formulaire_devis');
  form.action = event.target.href
  form.appendChild(Utils.create_hide_input("actions",JSON.stringify(Actions.action_queue)));
  form.submit();
}

 // Ajout de l'événement DOMContentLoaded
 document.addEventListener('DOMContentLoaded', function() {
    main();
  });