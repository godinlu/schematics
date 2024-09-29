import {categories, articles} from "./store.js";
/**
 * Un objet représentant une categorie.
 * @typedef {Object} category
 * @property {number} id - identifiant de la catégorie
 * @property {string} name - nom complet de la catégorie
 * @property {string} short_name - nom court de la catégorie
 * @property {string} type - type de la catégorie
 * @property {int} priority - ordre de priority de la catégorie
 * @property {int} parent_id - id de la catégorie parent
*/

/**
 * @typedef {Object} article
 * @property {string} ref
 * @property {string} label
 * @property {Float32Array} prix
 * @property {int} category_id
 * @property {int} [priority]
 * @property {int} [base_category_id]
 */


/**
 * renvoies les catégories de bases.
 * @returns {category[]}
 */
export function get_base_categories(){
    return categories.filter(row => row.parent_id == 0);
}

/**
 * Renvoie l'arborescence de la category sous la forme d'une liste d'id.
 * @param {int} category_id 
 * @returns {category[]}
 */
export function get_path_category(category_id){
    let current_categorie = get_category_from_id(category_id);
    let categories = [];
    while (current_categorie.id != 0) {
        categories.unshift(current_categorie);
        current_categorie = get_category_from_id(current_categorie.parent_id)
    }
    return categories;
}

/**
 * Renvoie la catégorie identifé par son id, si aucune categories 
 * n'esite pour cette id alors renvoie une erreur
 * @param {int} category_id 
 * @returns 
 */
export function get_category_from_id(category_id){
    let categorie = categories.filter(row => row.id == category_id);
    if (categorie) return categorie[0];
    else throw new Error(`la catégorie : '${category_id}' n'existe pas.`);
}

/**
 * Renvoie la liste des sous catégorie de la catégorie passé en paramètre
 * @param {int} category_id 
 * @returns {categorie[]}
 */
export function get_sub_categories(category_id){
    return categories.filter(category => category.parent_id == category_id);
}

/**
 * Renvoie la liste des sous catégorie de la catégorie passé en paramètre
 * @param {int} category_id 
 * @returns {categorie[]}
 */
export function get_articles_by_categ(category_id){
    return articles.filter(article => article.category_id == category_id);
}


/**
 * Renvoie l'article identifié par sa référence.
 * Cette fonction initialise également les champs priority et base_category_id
 * @param {string} ref 
 * @returns {article}
 */
export function get_article_by_ref(ref){
     // on commence par trouvé l'index de l'article en question.
     const article_index = articles.findIndex(row => row.ref === ref);
     if (article_index == -1) throw new Error(`L'article ${ref} n'existe pas !`);
     const article = articles[article_index];

     const base_category_id = get_path_category(article.category_id)[0].id;
     const priority = article_index * 10;
    
     return {...article, priority, base_category_id, quantity:1, id:ref};

} 