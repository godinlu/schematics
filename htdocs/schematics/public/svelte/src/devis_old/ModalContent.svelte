<script>
    import {get_sub_categories, get_articles_by_categ, get_path_category} from "./utils.js";
    import CategoryForm from "./CategoryForm.svelte";
    import ArticleForm from "./ArticleForm.svelte";
    import {modal_info} from "./store.js"

    let sub_categories;
    let articles;
    let category_path;
    if ($modal_info !== null){
        const category_id = $modal_info.category.id;
        category_path = get_path_category($modal_info.category.id);
        console.log(category_path);
        
        sub_categories = get_sub_categories(category_id);

        if (sub_categories.length === 0){
            articles = get_articles_by_categ(category_id);
        } 
    }

    function click_on_path(category){
        modal_info.update(old_info =>({...old_info, category}));
    }
</script>
{#if $modal_info !== null}
    <span>
        {#each category_path as category,i (category.id)}
            <a on:click|preventDefault={() => click_on_path(category) } href={""}>{category.name}</a>
            {#if i < category_path.length -1}
                &nbsp;&gt;&nbsp;
            {/if}
        {/each}
    </span>
    {#if sub_categories.length !== 0}
        <CategoryForm categories={sub_categories}/>
    {:else}
        <ArticleForm {articles}/>
    
    {/if}
{/if}

<style>
</style>


