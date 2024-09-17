<form id="formulaire_devis"  action="" method="post">
    <!-- <input type="hidden" name="SC1ZBMOD" value='{"tag":"default", "categ":"hey", "qte":3}'> -->

    <table id="table_devis">
        <tr>
            <td>Référence</td>
            <td>Désignation</td>
            <td>Qté</td>
            <td>Prix tarif</td>
            <td>Édition</td>
        </tr>
        <?php foreach ($base_categories as $i => $item):?>
            <tr>
                <th colspan="2"><?=$item["name"]?></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            <tbody class="category-content" id="div_<?=$item["id"]?>"></tbody>
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
        <div id="modal_content">

        </div>
    </div>
</div>


<script>
    const articles_in_devis =  <?=json_encode($articles_in_devis)?>;
    document.addEventListener('DOMContentLoaded', function() {
        Category.set_categories(<?=json_encode($categories)?>);
        Devis.articles = <?=json_encode($articles)?>;
    });
    
</script>