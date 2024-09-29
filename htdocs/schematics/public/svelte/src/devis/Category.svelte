<script lang="ts">
    import Article from "./Article.svelte";
    import {get_category_from_id} from "./utils.js";
    import { articles_in_devis, modal_info} from "./store";

    export let category_id;

    let articles;
    $:articles = $articles_in_devis.filter(article => article.base_category_id === category_id);

    const category = get_category_from_id(category_id);    

    function add_article(){
        modal_info.set({type:"add", category});
    }
</script>
<tr>
    <th colspan="6">{category.name} <button on:click={add_article}><i class="fa-solid fa-circle-plus"></i></button></th>
</tr>
{#each articles as article}
    <Article {article}/>
{/each}
<!--  -->
