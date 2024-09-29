<script>
    import { modal_info } from "./store";
    import { fade } from "svelte/transition";
    export let categories;
    const click_on_categ = (category) =>{
        modal_info.update(old_info => ({...old_info, category}));
    };
</script>
<div>
    {#each categories as category (category.id)}
        <button on:click={() => {click_on_categ(category)}}>{category.name}</button>
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