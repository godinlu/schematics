<script>
    import {get_base_categories} from "./utils";
    import Category from "./Category.svelte";
    import {categories, articles_in_devis, articles} from "./store.js";

</script>

<table class="style-table">
    <thead>
        <tr>
            <th>Référence</th>
            <th>Désignation</th>
            <th>Quantité</th>
            <th>Prix Tarif</th>
            <th></th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each get_base_categories() as category (category.id)}
            <Category category_id={category.id} />
        {/each}
    </tbody>
</table>
<style>

</style>
