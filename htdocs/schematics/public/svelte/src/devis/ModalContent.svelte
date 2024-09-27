<script>
    import {get_sub_categories, get_articles_by_categ, get_category_from_id} from "./utils.js";
    import { createEventDispatcher } from "svelte";
    import CategoryForm from "./CategoryForm.svelte";
    import ArticleForm from "./ArticleForm.svelte";

    export let modal_info;
    export let categories;
    export let all_articles;

    let sub_categories;
    let articles;
    $:{
        const category_id = modal_info.category.id;
        
        sub_categories = get_sub_categories(categories, category_id);

        if (sub_categories.length === 0){
            articles = get_articles_by_categ(all_articles, category_id);
        }
    }

    const dispatcher = createEventDispatcher();

    function click_on_categ(e){
        const category = get_category_from_id(categories, e.detail.category_id);
        dispatcher("start_modal",{...modal_info, category});
    }
</script>
{#if sub_categories.length !== 0}
    <CategoryForm categories={sub_categories} on:click_on_categ={click_on_categ}/>
{:else}
    <ArticleForm {articles}/>
{/if}
<style>

</style>