<form id="devis"  action="" method="post">
    <table id="table_devis">
        <tr>
            <td>Référence</td>
            <td>Désignation</td>
            <td>Qté</td>
            <td>Prix tarif</td>
            <td>Édition</td>
        </tr>
        <?php foreach ($base_categories as $i => $item):?>
            <tr id="<?=$item['id']?>">
                <th colspan="2"><?=$item["name"]?></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            <tr >
                <td colspan="2"><button class="button_add" type="button" value="<?=$item['id']?>">Ajouter</button></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        <?php endforeach;?>
    </table>
</form>
<button id="ajouter" type="button">add</button>

<!-- Fenêtre modale -->
<div id="modal_window" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Ajouter un article</h2>
        <!-- Contenu de la modale -->
        <form id="articleForm">
            <label for="articleName">Nom de l'article:</label>
            <input type="text" id="articleName" name="articleName">
            <button type="submit">Ajouter</button>
        </form>
    </div>
</div>


<script>
    const articles =  <?=$articles?>;
</script>