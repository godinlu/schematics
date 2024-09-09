function main(){
    let devis = new Devis(articles, articles_tree);
    //console.log(devis.tr_categories);
    devis.add_row("SC2BMOD", "00000001", "hey");
}

 // Ajout de l'événement DOMContentLoaded
 document.addEventListener('DOMContentLoaded', function() {
    main();
  });