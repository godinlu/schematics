<script>
    import {AddAction, EditAction, Actions} from "./Action.class"
    import {modal_info} from "./store";

    export let articles;

    function execute_action(ref){
        if ($modal_info.type ===  "add"){
            let add_action = new AddAction(ref);
            Actions.push(add_action);
        }else if ($modal_info.type === "edit"){
            let edit_action = new EditAction($modal_info.ref, ref);
            Actions.push(edit_action);
        }
        modal_info.set(null);
        

    }
</script>
<div class="scroll-container">
    <table class="style-table">
        <thead>
            <tr>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Prix Tarif</th>
            </tr>
        </thead>
        <tbody>
            {#each articles as article (article.ref)}
                <tr on:click={() => execute_action(article.ref)}>
                    <td>{article.ref}</td>
                    <td>{article.label}</td>
                    <td>{article.prix}</td>
                </tr>

            {:else}
                <p>Aucun article...</p>
            {/each}
        </tbody>
        
    </table>
</div>

<style>
    .scroll-container{
        height: 400px; /* Hauteur du conteneur */
        overflow: auto; /* Activer le scroll si nécessaire */
        border: 1px solid #ccc; /* Bordure pour délimiter le conteneur */
    }
    table{
        width: 600px;
    }
    thead tr th{
        position: sticky;
        top: 0;
    }
    tr:hover {
        background-color: #ddd;
        cursor: pointer;
    }
    
</style>