


/**
 * 
 * @param {string} ref 
 * @param {string} categorie 
 * @param {string} tree_path 
 * @param {string} tag 
 * @param {int} qte 
 * @param {boolean} editable_qte 
 * @param {boolean} editable_price 
 * @param {boolean} editable 
 * @param {boolean} removeable 
 */
function add_article(
    ref,
    categorie,
    tree_path,
    tag="default",
    qte = 1,
    editable_qte = true,
    editable_price = false,
    editable = true,
    removeable = true
){
    // on commence par trouver l'article par sa référence
    const article = articles.filter(raw => raw.ref == ref);
    if (article.length != 1) throw new Error("Article " + ref + " not found !");

    // ensuite on trouve la ligné associé à la catégorie 
    let tr_categ = document.getElementById(categorie);
    if (!tr_categ) throw new Error("Categorie " + categorie + " does not exist !");

    tr_categ.after()
}