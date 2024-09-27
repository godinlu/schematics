<script>
    import Article from "./Article.svelte";
    import { createEventDispatcher } from "svelte";

    export let category;
    export let article_list;

    const dispatcher = createEventDispatcher();

    const add_article = () =>{
        dispatcher("start_modal",{action:"add", category});
    }
</script>
<tr>
    <th colspan="2">{category.name}</th>
    <td></td>
    <td></td>
    <td><button on:click={add_article}>Ajouter</button></td>
</tr>
{#each article_list as article (article.ref)}
    <Article {article} />
{/each}
