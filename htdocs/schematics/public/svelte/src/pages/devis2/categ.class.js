/**
 * Un objet représentant une categorie.
 * @typedef {Object} categorie
 * @property {number} id - identifiant de la catégorie
 * @property {string} name - nom complet de la catégorie
 * @property {string} short_name - nom court de la catégorie
 * @property {string} type - type de la catégorie
 * @property {int} priority - ordre de priority de la catégorie
 * @property {int} parent_id - id de la catégorie parent
*/
export class Categ{
    /**
     * 
     * @param {categorie[]} categories 
     */
    constructor(categories){
        this.categories = categories;
    }

    /**
     * Renvoie l'arborescence de la category sous la forme d'une liste d'id.
     * @param {int} category_id 
     * @returns {int[]}
     */
    get_path(category_id){
        let current_categorie = this.get(category_id);
        let path = [];
        while (current_categorie.id != 0) {
            path.unshift(current_categorie.id);
            current_categorie = this.get(current_categorie.parent_id);
        }
        return path;
    }

    /**
     * renvoie la catégory associé à l'id
     * @param {int} category_id 
     * @returns {?categorie}
     */
    get(category_id){
        let categorie = this.categories.filter(row => row.id == category_id);
        if (categorie) return categorie[0];
        else throw new Error(`la catégorie : '${category_id}' n'existe pas.`);
    }
    /**
     * renvoie les catégories par défault
     * @returns {categorie[]}
     */
    get_base(){
        return this.categories.filter(row => row.parent_id == 0);
    }
}