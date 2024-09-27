/**
 * @typedef {Object} actionAdd
 * @property {string} type
 * @property {string} ref
 */
/**
 * @typedef {Object} actionEdit
 * @property {string} type
 * @property {string} old_ref
 * @property {string} new_ref
 */
/**
 * @typedef {Object} actionRemove
 * @property {string} type
 * @property {string} ref
 */
/**
 * @typedef {Object} actionMove
 * @property {string} type
 * @property {string} ref
 * @property {int} direction
 */
/**
 * @typedef	{actionAdd|actionEdit|actionRemove|actionMove} action
 */

import { ArticleManager } from "./article_manager.class";

export class Devis{
    /**
     * 
     * @param {ArticleManager} article_manager 
     * @param {?action[]} devis_data 
     */
    constructor(article_manager, devis_data = []){
        this.action_queue = devis_data;
        this.article_manager = article_manager;
    }

    /**
     * execute l'action passé en paramètre
     * @param {action} action 
     * @returns {boolean}
     */
    execute_action(action){
        try{
            if (action.type == "add"){
                this.article_manager.add_article(action.ref);
            }else if (action.type == "edit"){
                this.article_manager.edit_article(action.old_ref, action.new_ref);
            }else if (action.type == "move"){
                this.article_manager.move_article(action.ref, action.direction);
            }else if (action.type == "remove"){
                this.article_manager.remove_article(action.ref);
            }else{
                throw new Error();
            }
            return true;
        }catch (e){
            return false;
        }
    }


    push(){
        
    }
}