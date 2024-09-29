<script>
    import {get_sub_categories, get_articles_by_categ, get_category_from_id} from "./utils.js";
    import CategoryForm from "./CategoryForm.svelte";
    import ArticleForm from "./ArticleForm.svelte";
    

    export let modal_info;

    let sub_categories;
    let articles;
    $:{
        const category_id = modal_info.category.id;
        
        sub_categories = get_sub_categories(category_id);

        if (sub_categories.length === 0){
            articles = get_articles_by_categ(category_id);
        } 
    }

</script>

    {#if sub_categories.length !== 0}
        <CategoryForm categories={sub_categories}/>
    {:else}
        <ArticleForm {articles}/>

    {/if}


