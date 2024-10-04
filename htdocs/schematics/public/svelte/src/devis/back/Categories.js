import {articles, categories} from "./Store";

export class Categories{
    static instance = null;

    constructor(){
        // Vérifie si l'instance existe déjà
        if (Categories.instance){
            return Categories.instance;
        }
        // Initialise les catégories à partir de "global_vars"
        /**
         * @type {Category[]} categories
         */
        this.categories = window.global_vars["categories"].map(category_obj => new Category(category_obj));

        // Sauvegarde l'instance dans la propriété statique
        Categories.instance = this;

        // Retourne l'instance nouvellement créée
        return this;

    }

    get_base_categories(){
        return this.categories.filter(category => category.parent_id === 0);
    }
}

export class Category{
    /**
     * 
     * @param {object} category_obj 
     */
    constructor(category_obj){
        this.id = category_obj.id;
        this.name = category_obj.name;
        this.short_name = category_obj.short_name;
        this.priority = category_obj.priority;
        this.parent_id = category_obj.parent_id;
    }
}