<script>
    import { createEventDispatcher } from "svelte";

    export let categories;

    const dispatcher = createEventDispatcher();

    const click_on_categ = (category_id) =>{
        dispatcher("click_on_categ",{category_id});
    };
</script>
<div>
    {#each categories as category (category.id)}
        <button on:click={() => {click_on_categ(category.id)}}>{category.name}</button>
    {/each}
</div>
    
<style>
    div{
        display: flex;
        flex-direction: column;
    }
    button{
        margin: 5px;
        padding: 4px;
    }

</style>