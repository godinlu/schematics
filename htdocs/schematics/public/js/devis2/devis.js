function main(){
    Modal.init(document.getElementById("modal_window"));
    Devis.init();

    Modal.update();

    document.querySelectorAll(".saveForm").forEach(a =>{
      a.addEventListener("click" , handleMenuClick);
    });

    // ajoute les event listener au bouton d'ajout d'article
    document.querySelectorAll(".button_add").forEach(button =>{
      button.addEventListener("click", () =>{
        Url.add_article(button.value);
      });
    });

    // ajoute les articles par défault
    articles_in_devis.forEach(virtual_article =>{
      console.log(virtual_article);
      Devis.add_article(virtual_article);
    }); 

    // ajout
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
  form.submit();
}

 // Ajout de l'événement DOMContentLoaded
 document.addEventListener('DOMContentLoaded', function() {
    main();
  });