<script>
    export let articles;
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
            {#each articles as article}
                <tr>
                    <td>{article.ref}</td>
                    <td>{article.label}</td>
                    <td>{article.prix}</td>
                </tr>
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