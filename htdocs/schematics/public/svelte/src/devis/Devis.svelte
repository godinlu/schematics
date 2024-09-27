<script>
    import Modal from "../components/Modal.svelte";
    import EditableDevis from "./EditableDevis.svelte";
    import ModalContent from "./ModalContent.svelte";
    import {get_article_by_ref} from "./utils.js";

    export let default_articles;
    export let categories;
    export let all_articles;
    export let devis_data = [];

    let article_list = [];
    let action_list = [];
    let modal_info = {display:false};

    // initialisation des articles par défault
    for (const article of default_articles) {
        article_list.push(get_article_by_ref(all_articles, categories, article.ref));
    }
    // trie des articles par leurs priorité
    article_list.sort((a, b) => a.priority - b.priority);


    const toogle_modal = ()=>{
        modal_info = { ...modal_info, display: !modal_info.display };
    }

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
                edit_article(action.old_ref, action.new_ref);
            }else if (action.type == "move"){
                move_article(action.ref, action.direction);
            }else if (action.type == "remove"){
                remove_article(action.ref);
            }else{
                throw new Error();
            }
            return true;
        }catch (e){
            return false;
        }
    }

    /**
     * 
     * @param ref
     */
    function add_article(ref){
        const new_article = get_article_by_ref(all_articles, categories, ref);
        article_list = [...article_list, new_article];
        article_list.sort((a, b) => a.priority - b.priority);
    }

    function start_modal(e){
        modal_info = {...modal_info, display: true, ...e.detail};
        //console.log(modal_info);
    }

</script>
<EditableDevis on:start_modal={start_modal} {article_list} {categories}/>
<Modal modal_show={modal_info.display} on:toogle_modal={toogle_modal}>
    <ModalContent {modal_info} {all_articles} {categories} on:start_modal={start_modal}/>
</Modal>
<style>
    
</style>
