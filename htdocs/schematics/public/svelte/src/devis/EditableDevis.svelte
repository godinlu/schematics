<script>
    import {get_base_categories} from "./utils";
    import Category from "./Category.svelte";

    export let article_list;
    export let categories;

</script>

<table class="style-table">
    <thead>
        <tr>
            <th>Référence</th>
            <th>Désignation</th>
            <th>Quantité</th>
            <th>Prix Tarif</th>
            <th>Édition</th>
        </tr>
    </thead>
    <tbody>
        {#each get_base_categories(categories) as category (category.id)}
            <Category on:start_modal {category} article_list={
                article_list.filter(row => row.base_category_id === category.id)
            } />
        {/each}
    </tbody>
</table>
<style>

</style>
