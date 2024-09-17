class Devis{
    /**
     * @typedef {Object} article
     * @property {string} ref
     * @property {string} label
     * @property {Float32Array} prix
     * @property {int} category_id
     */

    /**
     * @typedef {Object} virtualArticle
     * @property {string} ref
     * @property {int} category_id
     * @property {string} [tag]
     * @property {int} [qte]
     */

    /**
     * @type {article[]} articles
     */
    static articles;

    /**
     * @type {Map<int, HTMLTableSectionElement>}
     */
    static div_categories = new Map();

    /**
     * cette fonction initialise la variable statique div_categories
     */
    static init(){
        const tbodys = document.querySelectorAll("tbody.category-content");
        tbodys.forEach(tbody =>{
            const id = parseInt(tbody.id.split("_")[1]);
            this.div_categories.set(id, tbody);
        });        
    }

    /**
     * Ajoute un article au devis sous la forme d'une ligne de tableau
     * l'ordre de cette ligne est determiné par son index dans la list articles
     * qui est rangé par ordre d'importance.
     * @param {virtualArticle} virtual_article
     */
    static add_article(virtual_article){
        // on commence par trouvé l'index de l'article en question.
        const article_index = this.articles.findIndex(article => article.ref === virtual_article.ref);
        if (article_index == -1) throw new Error(`L'article ${virtual_article.ref} n'existe pas !`);

        const base_category = Category.get_category_path(virtual_article.category_id)[1];

        const tag = virtual_article.tag ?? "default";
        const qte = virtual_article.qte ?? 1;
        // construction de la ligne produit
        let article_row = new ArticleRow(
            this.articles[article_index], virtual_article.category_id, tag, qte
        );
        article_row.dataset.priority = article_index;

        // on boucle dans toute les lignes de produits pour savoir ou placer 
        // le nouvelle article
        const tr_articles = this.div_categories.get(base_category).children;
        let inserted = false;
        for (let i = 0; i < tr_articles.length; i++) {
            if (article_index < tr_articles[i].dataset.priority) {
                tr_articles[i].before(article_row);
                inserted = true;
                break;
            }else if (article_index == tr_articles[i].dataset.priority){
                let qte_input = tr_articles[i].querySelector(".qte input");
                qte_input.value = parseInt(qte_input.value) + 1;
                inserted = true;
                break;
            }
        }

        // Si l'article n'a pas été inséré, on le met à la fin (ou comme premier élément si la liste est vide)
        if (!inserted) {
            this.div_categories.get(base_category).appendChild(article_row);
        }       
    }

    /**
     * Renvoie une liste d'article appartenant à la catégorie d'id passé en paramètre.
     * @param {int} category_id 
     * @returns {article[]}
     */
    static get_articles_by_categ(category_id){
        return this.articles.filter(article => article.category_id == category_id);
    }
}