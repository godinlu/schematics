/**
 * @typedef {Object} article_dict
 * @property {string} ref
 * @property {string} label
 * @property {float} prix
 * @property {string} category_id
 * @property {number} priority
 */
/**
 * @typedef {Object} category_dict
 * @property {string} id
 * @property {string} name
 * @property {?number} parent_id
 * @property {number} priority
 */


class DataManager{
    /** @type {article_dict[]} */
    #articles;
    /** @type {category_dict[]} */
    #categories;
    /** @type {Map<string, article_dict>} */
    #articles_map;
    /** @type {Map<string, category_dict>} */
    #categories_map;

    /**
     * 
     * @param {article_dict[]} articles 
     * @param {category_dict[]} categories 
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
     * return the Category identify by it's ID.
     * @param {string} category_id 
     * @returns {category_dict}
     */
    get_category(category_id){
        const category_dict = this.#categories_map.get(category_id);
        if (!category_dict) throw new Error(`Category with id ${category_id} does not exist.`);
        return category_dict
    }


    /**
     * Return the base category (level 1 categ)
     * @param {string} category_id 
     * @returns {category_dict} 
     */
    get_base_category_id(category_id){
        const cat = this.get_category(category_id);
        
        if (cat.parent_id === 'articles' || cat.parent_id === null){
            return cat;
        }else {
            return this.get_base_category_id(cat.parent_id);
        }
    }

    /**
     * return all childrens categ id of the category given
     * @param {string} category_id 
     * @returns {category_dict[]}
     */
    get_childrens_categories(category_id){
        return this.#categories.filter(cat => cat.parent_id === category_id);
    }

    /**
     * Return a list of article_dict which are in the category given.
     * @param {string} category_id 
     * @returns {article_dict[]}
     */
    get_articles_by_category_id(category_id){
        return this.#articles.filter(a => a.category_id === category_id);
    }

    /**
     * return the list of parent category, the last item will alway be the category given.
     * @param {string} category_id 
     * @returns {category_dict[]}
     */
    get_parents_categories(category_id){
        const cat = this.get_category(category_id);
        
        if (cat.parent_id === null){
            return [cat];
        }else {
            return [...this.get_parents_categories(cat.parent_id), cat];
        }
    }
}