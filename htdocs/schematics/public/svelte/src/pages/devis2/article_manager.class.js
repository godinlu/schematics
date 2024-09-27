/**
 * @typedef {Object} article
 * @property {string} ref
 * @property {string} label
 * @property {Float32Array} prix
 * @property {int} category_id
 * @property {int} [priority]
 * @property {int} [base_category_id]
 */

import { Categ } from "./categ.class";

export class ArticleManager{
    /**
     * 
     * @param {article[]} all_articles 
     * @param {Categ} categ 
     */
    constructor(all_articles, categ){
        this.all_articles = all_articles;
        this.categ = categ;
        /**
         * @type {article[]} list_articles
         */
        this.list_articles = [];

    }

    /**
     * ajoute un article à la liste à l'emplacement de 
     * sa catégorie de base
     * @param {string} ref 
     */
    add_article(ref){
        const article_index = this.all_articles.findIndex(row => row.ref === ref);
        if (article_index == -1) throw new Error(`L'article ${ref} n'existe pas !`);
        const article = this.all_articles[article_index];

        const base_category = this.categ.get_path(article.category_id)[0];
        this.list_articles.push({...article, "base_category_id":base_category, "priority":article_index*10});
    }

    /**
     * remplace l'article identifié par son ancienne référence par l'article identifié
     * par new_ref
     * @param {string} old_ref 
     * @param {string} new_ref 
     */
    edit_article(old_ref, new_ref){
        console.log("edit article");
    }

    /**
     * déplace l'article identifié par sa référence en fonction de la direction:
     * -1 déplace en haut, 1 déplace en bas
     * @param {string} ref 
     * @param {int} direction 
     */
    move_article(ref, direction){
        console.log("move article");
    }

    /**
     * supprime l'article identifié par sa référence dans la liste.
     * @param {string} ref 
     */
    remove_article(ref){
        console.log("remove article");
    }

    get_articles(base_category_id){
        return this.list_articles.filter(row => row.base_category_id == base_category_id);
    }
}


