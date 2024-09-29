<script>
    import {Actions, RemoveAction} from "./Action.class";
    import {modal_info} from "./store";
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
<tr>
    <td>{article.ref}</td>
    <td>{article.label}</td>
    <td><input type="number" min="1" max="99" bind:value={article.quantity}></td>
    <td>{article.prix}</td>
    <td>
        <button on:click={edit_article}><i class="fa-solid fa-pen"></i></button>
    </td>
    <td>
        <button on:click={remove_article} ><i class="fa-solid fa-trash"></i></button>
    </td>
</tr>

<style>
</style>