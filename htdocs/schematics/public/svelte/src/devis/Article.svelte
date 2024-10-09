<script>
    import {Actions, RemoveAction} from "./Action.class";
    import {modal_info} from "./store";
    import CustomRow from "./components/CustomRow.svelte";
    import CustomCol from "./components/CustomCol.svelte";
    import {get_category_from_id} from "./utils";
    export let article;

    function remove_article(){
        const remove_action = new RemoveAction(article.ref);
        Actions.push(remove_action);
    }

    function edit_article(){
        modal_info.set({
            type:"edit",
            category: get_category_from_id(article.category_id),
            ref:article.ref
        });
    }
</script>
<div class="custom-col">{article.ref}</div>
<div class="custom-col">{article.label}</div>
<div class="custom-col"><input type="number" min="1" max="99" bind:value={article.quantity}></div>
<div class="custom-col">{article.prix}</div>
<div class="custom-col"><button on:click={edit_article}><i class="fa-solid fa-pen"></i></button></div>
<div class="custom-col"><button on:click={remove_article} ><i class="fa-solid fa-trash"></i></button></div>
<style>
</style>