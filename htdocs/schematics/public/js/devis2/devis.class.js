class Devis{
    constructor(articles, articles_tree){
        this.articles = articles;
        this.articles_tree = articles_tree;
        /**
         * @type {Map<string, HTMLTableRowElement>} tr_categories
         */
        this.tr_categories = new Map();

        // on initalise tr_categories
        for (let i = 0; i < this.articles_tree.length; i++) {
            const id = this.articles_tree[i]["id"];
            this.tr_categories.set(id, document.getElementById(id));
        }

    }

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
    add_row(
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
        const article = this.get_article(ref);

        // ensuite on trouve la ligné associé à la catégorie 
        const tr_categ = this.tr_categories.get(categorie);

        // construction de la ligne produit
        const article_row = new ArticleRow(
            article, tree_path, tag, qte, editable_qte, editable_price, editable, removeable
        );
        
        // ajout de la ligne produit dans le tableau
        tr_categ.after(article_row);
    }

    /**
     * renvoie l'article identifié par sa ref.
     * lève une erreur si la référence n'existe pas
     * @param {string} ref 
     * @returns {JSON}
     */
    get_article(ref){
        const arts = this.articles.filter(raw => raw.ref == ref);
        if (arts.length != 1) throw new Error("Article " + ref + " not found !");
        return arts[0];
    }
}