<script lang="ts">
    import Modal from "../components/Modal.svelte";
    import EditableDevis from "./EditableDevis.svelte";
    import ModalContent from "./ModalContent.svelte";
    import {get_article_by_ref} from "./utils.js";
    import {articles_in_devis, modal_info} from "./store.js";

    export let default_articles;

    let action_list = [];

    // initialisation des articles par défault
    articles_in_devis.set(default_articles.map(article => get_article_by_ref(article.ref)));
    
    // trie des articles par leurs priorité
    articles_in_devis.update(arts => arts.sort((a, b) => a.priority - b.priority) );
    //article_list.sort((a, b) => a.priority - b.priority);

    /**
     * ajoute l'action passé en paramètre à la file d'actions (action_queue)
     * et execute l'action passé en paramètre
     * @param {object} action 
     */
    function push_action(action){
        if (execute_action(action)){
            action_list.push(action);
        }
    }

    /**
     * execute l'action passé en paramètre
     * @param {object} action 
     * @returns {boolean}
     */
    function execute_action(action){
        try{
            if (action.type == "add"){
                add_article(action.ref);
            }else if (action.type == "edit"){
                //edit_article(action.old_ref, action.new_ref);
            }else if (action.type == "move"){
                //move_article(action.ref, action.direction);
            }else if (action.type == "remove"){
                //remove_article(action.ref);
            }else{
                throw new Error();
            }
            return true;
        }catch (e){
            return false;
        }
    }

    function toogle_modal(){
        modal_info.set(null);
    }

</script>
<EditableDevis/>
<Modal modal_show={$modal_info !== null} slot_key={$modal_info} on:toogle_modal={toogle_modal}>
    {#if $modal_info !== null}
        <ModalContent/> 
    {/if}
</Modal>
<style>
    
</style>
