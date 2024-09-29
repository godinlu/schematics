<script>
    import {get_base_categories} from "./utils";
    import Category from "./Category.svelte";
    import CustomRow from "./components/CustomRow.svelte";
    import CustomCol from "./components/CustomCol.svelte";
    import {categories, articles_in_devis, articles} from "./store.js";

</script>
<div class="custom-table">
    <div class="custom-header">
        <div class="custom-row">
            <div class="custom-col">Référence</div>
            <div class="custom-col">Désignation</div>
            <div class="custom-col">Quantité</div>
            <div class="custom-col">Prix Tarif</div>
            <div class="custom-col"></div>
            <div class="custom-col"></div>

        </div>
    </div>
    <div class="grid-body">
        {#each get_base_categories() as category (category.id)}
            <Category category_id={category.id} />
        {/each}
    </div>
</div>
<style>
    .custom-table{
        max-width: 800px;
    }
    .custom-header{
        background-color: #04AA6D;
        color: white;
        font-weight: bold;
    }
</style>
