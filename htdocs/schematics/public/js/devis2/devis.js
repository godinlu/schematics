function main(){
    let devis = new Devis(articles, articles_tree);
    const url = window.location.href.match(/(.*\/devis2)(?:\/.*)?/)[1];
    let modal_window = document.getElementById("modal_window");

    modal_init(modal_window, url);
    action(modal_window);

    // ajoute les event listener au bouton d'ajout d'article
    document.querySelectorAll(".button_add").forEach(button =>{
      button.addEventListener("click", () =>{
        window.history.pushState({}, '', url + "/ajouter/" + button.value);
        action(modal_window);
      });
    });

    // ligne temporaire pour ajouter une ligne au devis
    devis.add_row("SC2BMOD", "00000001", "hey");

    // ajout
    window.addEventListener('popstate', function(event) {
      action(modal_window);
  });

}

/**
 * Cette fonction initalise la fenêtre modal (popup)
 * Elle ajoute les event listener pour quitter la fenêtre 
 * @param {HTMLDivElement} modal
 */
function modal_init(modal_window, url){
  // Fermer la modale en cliquant en dehors
  window.onclick = function(event) {
    if (event.target == modal_window) {
      modal_window.style.display = "none";
      window.history.pushState({}, '', url);
    }
  }

  // Fermer la modal_window
  modal_window.querySelector("span").onclick = function() {
    modal_window.style.display = "none";
    window.history.pushState({}, '', url);
}

}


function action(modal_window){
  const match = window.location.href.match(/devis2\/([^#]*)/);
  if (match){
    modal_window.style.display = "block";
  }else{
    modal_window.style.display = "none";
  }
}

 // Ajout de l'événement DOMContentLoaded
 document.addEventListener('DOMContentLoaded', function() {
    main();
  });