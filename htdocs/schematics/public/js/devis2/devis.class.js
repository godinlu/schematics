class Devis{
    constructor(articles, categories){
        this.articles = articles;
        this.categories = categories;
        /**
         * @type {Map<string, HTMLTableRowElement>} tr_categories
         */
        this.tr_categories = new Map();

        // on initalise tr_categories
        for (let i = 0; i < this.categories.length; i++) {
            const id = this.categories[i]["id"];
            this.tr_categories.set(id, document.getElementById("categorie_"+id));
        }

        console.log(this.get_category_path(1));

    }

    /**
     * 
     * @param {string} ref 
     * @param {string} categorie 
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
        tag="default",
        qte = 1,
        editable_qte = true,
        editable_price = false,
        editable = true,
        removeable = true
    ){
        // on commence par trouver l'article par sa référence
        const article = this.get_article(ref);

        // on récupère le chemin de la catégorie
        const category_path = this.get_category_path(categorie);

        // ensuite on trouve la ligné associé à la catégorie 
        const tr_categ = this.tr_categories.get(parseInt(category_path.split("/")[1]));

        // construction de la ligne produit
        const article_row = new ArticleRow(
            article, category_path, tag, qte, editable_qte, editable_price, editable, removeable
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

    get_category_path(category_id) {
        const category_map = new Map(this.categories.map(cat => [cat.id, cat.parent_id]));
        const path = [];

        while (category_id !== null) {
            path.unshift(category_id); // Ajouter l'ID au début du tableau
            category_id = category_map.get(category_id); // Monter au parent
        }

        return path.join('/'); // Joindre les IDs avec "/"
    }
}