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
class Actions {
    /**
     * @type {action[]} action_queue
     */
    static action_queue = [];

    /**
     * ajoute l'action passé en paramètre à la file d'actions (action_queue)
     * et execute l'action passé en paramètre
     * @param {action} action 
     */
    static push(action){
        if (this.execute(action)){
            this.action_queue.push(action);
        }
        
    }
    /**
     * execute l'action passé en paramètre
     * @param {action} action 
     * @returns {boolean}
     */
    static execute(action){
        try{
            if (action.type == "add"){
                Devis.add_article(action.ref);
            }else if (action.type == "edit"){
                Devis.edit_article(action.old_ref, action.new_ref);
            }else if (action.type == "move"){
                Devis.move_article(action.ref, action.direction);
            }else if (action.type == "remove"){
                Devis.remove_article(action.ref);
            }else{
                throw new Error();
            }
            return true;
        }catch (e){
            return false;
        }
        

    }

    static undo(objetc){

    }

    /**
     * 
     * @param {string} ref 
     * @param {int} direction 
     */
    static move_article(ref, direction){
        const action = {"type":"move","ref":ref,"direction":direction};
        this.push(action);
    }
    
}

