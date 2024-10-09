<script>
    import {Categories} from "./back/Categories";
    import Category from "./Category.svelte";

    let categories = new Categories();
    //let articles = $state();

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
        {#each categories.get_base_categories() as category (category.id)}
            <Category {category} />
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