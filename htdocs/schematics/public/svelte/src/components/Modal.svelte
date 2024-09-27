<script>
    import { createEventDispatcher } from "svelte";

    export let modal_show = false;
    const dispatcher = createEventDispatcher();

    const toggle_modal = () =>{
        dispatcher("toogle_modal");
    };

</script>
{#if modal_show}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal" on:click|self={toggle_modal}>
        <div class="modal-content">
            <slot></slot>
        </div>
    </div>
{/if}

<style>
    .modal{
        background-color: rgba(0, 0, 0 , 0.5);
        width: 100%;
        height:100%;
        position:fixed;
        text-align:center;
        color: black;
        top:0;
        display: flex;
        justify-content: center; /* Centrage horizontal */
        align-items: center;     /* Centrage vertical */
        z-index:10000;
    }
    .modal-content {
        background-color: #fff;
        box-shadow: 10px 10px 60px #555;
        padding: 5px;
    }
</style>