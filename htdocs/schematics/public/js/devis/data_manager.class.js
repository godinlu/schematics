/**
 * @typedef {Object} article_dict
 * @property {string} ref
 * @property {string} label
 * @property {float} prix
 * @property {number} categorie_id
 * @property {number} priority
 */
/**
 * @typedef {Object} categorie_dict
 * @property {number} id
 * @property {string} name
 * @property {string} short_name
 * @property {string} type
 * @property {number} priority
 * @property {?number} parent_id
 */


class DataManager{
    /** @type {article_dict[]} */
    #articles;
    /** @type {categorie_dict[]} */
    #categories;
    /** @type {Map<string, article_dict>} */
    #articles_map;
    /** @type {Map<number, categorie_dict>} */
    #categories_map;

    /**
     * 
     * @param {article_dict[]} articles 
     * @param {categorie_dict[]} categories 
     */
    constructor(articles, categories){
        this.#articles = articles;
        this.#categories = categories;

        this.#articles_map = new Map(articles.map(art => [art.ref, art]));
        this.#categories_map = new Map(categories.map(cat => [cat.id, cat]));

    }

    /**
     * return the Article identify by it's ref.
     * @param {string} ref 
     * @returns {article_dict}
     */
    get_article(ref){
        const article_dict = this.#articles_map.get(ref);
        if (!article_dict) throw new Error(`Article with ref ${ref} does not exist.`);
        return article_dict;
    }

    /**
     * return the Categorie identify by it's ID.
     * @param {number} categorie_id 
     * @returns {categorie_dict}
     */
    get_categorie(categorie_id){
        const categorie_dict = this.#categories_map.get(categorie_id);
        if (!categorie_dict) throw new Error(`Category with id ${categorie_id} does not exist.`);
        return categorie_dict
    }


    /**
     * Return the base category (level 1 categ)
     * @param {number} categorie_id 
     * @returns {categorie_dict} 
     */
    get_base_categorie_id(categorie_id){
        const cat = this.get_categorie(categorie_id);
        
        if (cat.parent_id === 0 || cat.parent_id === null){
            return cat;
        }else {
            return this.get_base_categorie_id(cat.parent_id);
        }
    }

    /**
     * return all childrens categ id of the categorie given
     * @param {number} categorie_id 
     * @returns {categorie_dict[]}
     */
    get_childrens_categories(categorie_id){
        return this.#categories.filter(cat => cat.parent_id === categorie_id);
    }

    /**
     * Return a list of article_dict which are in the categorie given.
     * @param {number} categorie_id 
     * @returns {article_dict[]}
     */
    get_articles_by_categorie_id(categorie_id){
        return this.#articles.filter(a => a.categorie_id === categorie_id);
    }

    /**
     * return the list of parent categorie, the last item will alway be the categorie given.
     * @param {number} categorie_id 
     * @returns {categorie_dict[]}
     */
    get_parents_categories(categorie_id){
        const cat = this.get_categorie(categorie_id);
        
        if (cat.parent_id === null){
            return [cat];
        }else {
            return [...this.get_parents_categories(cat.parent_id), cat];
        }
    }
}