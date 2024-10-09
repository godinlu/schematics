<script>
    import Article from "./Article.svelte";
    import {get_category_from_id} from "./utils.js";
    import { articles_in_devis, modal_info} from "./store";
    import {Actions, MoveAction} from "./Action.class";
    import { dndzone } from 'svelte-dnd-action';
    import { flip } from "svelte/animate";

    export let category_id;

    let flipDurationMs = 200;
    let articles;
    $:articles = $articles_in_devis.filter(article => article.base_category_id === category_id);

    const category = get_category_from_id(category_id);    

    function add_article(){
        modal_info.set({type:"add", category});
    }

    const handleConsider = evt => {
		articles = evt.detail.items;
	};
	const handleFinalize = evt => {
        const ref = evt.detail.info.id;
        const i = evt.detail.items.findIndex(a => a.ref === ref);
        let move_action = new MoveAction(ref, i);
        Actions.push(move_action);
	};

</script> 
<div class="categ-header"><strong>{category.name}</strong>  <button on:click={add_article}><i class="fa-solid fa-circle-plus"></i></button></div>
<div
    use:dndzone="{{items: articles, flipDurationMs , type:category.id}}"
    on:consider="{handleConsider}"
    on:finalize="{handleFinalize}"
>
    {#each articles as article (article.id)}
        <div class="custom-row" animate:flip="{{duration:flipDurationMs}}">
            <Article {article}/>
        </div>
        
    {/each}
</div>

<style>
    .categ-header{
        display: flex;
        justify-content: center;
        padding: 8px;
        border-right: 1px solid #ddd;
        border-left: 1px solid #ddd;
    }
    .categ-header strong{
        margin-right: 5px;
    }
</style>

