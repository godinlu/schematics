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
     * @param {string} ref
     */
    static add_article(ref){
        // on commence par trouvé l'index de l'article en question.
        const article_index = this.articles.findIndex(row => row.ref === ref);
        if (article_index == -1) throw new Error(`L'article ${ref} n'existe pas !`);
        const article = this.articles[article_index];

        const base_category = Category.get_category_path(article.category_id)[1];

        // construction de la ligne produit
        let article_row = new ArticleRow(article);
        article_row.dataset.priority = article_index*10;

        // on boucle dans toute les lignes de produits pour savoir ou placer 
        // le nouvelle article
        const tr_articles = this.div_categories.get(base_category).children;
        let inserted = false;
        for (let i = 0; i < tr_articles.length; i++) {
            if (article_index*10 < tr_articles[i].dataset.priority) {
                tr_articles[i].before(article_row);
                inserted = true;
                break;
            }else if (article_index*10 == tr_articles[i].dataset.priority){
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
     * Modifie l'article identifier par sa référence par le nouvelle article.
     * @param {string} old_ref
     * @param {string} new_ref 
     */
    static edit_article(old_ref, new_ref){
        let old_tr = document.getElementById(`article_${old_ref}`);
        const old_qte = parseInt(old_tr.querySelector(".qte input").value);
        old_tr.remove();
        this.add_article(new_ref);
        let input_qte = document.querySelector(`input[name="qte_${new_ref}"]`);
        input_qte.value = old_qte;
    }

    /**
     * Déplace la ligne de l'article en fonction de la direction 1:en bas et -1 : en haut
     * @param {string} ref 
     * @param {int} direction 
     */
    static move_article(ref, direction){
        const tr = document.getElementById(`article_${ref}`);
        const tbody = tr.parentNode;
        const tr_articles = tbody.querySelectorAll(".article");
        const index = Array.from(tr_articles).indexOf(tr);

        if (index + direction >= 0 && index + direction < tr_articles.length) {
            const new_index = (direction >= 0)? index+2 : index-1
            const priority = tr_articles[index+direction].dataset.priority
            tr.dataset.priority = parseInt(priority) + direction;
            tbody.insertBefore(tr, tr_articles[new_index]);
        }
    }

    /**
     * supprime la ligne correspondant à l'article identifié par sa référence.
     * @param {string} ref 
     */
    static remove_article(ref){
        document.getElementById(`article_${ref}`).remove();
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