<form id="devis"  action="" method="post">
    <table id="table_devis">
        <tr>
            <td>Référence</td>
            <td>Désignation</td>
            <td>Qté</td>
            <td>Prix tarif</td>
            <td>Édition</td>
        </tr>
        <?php foreach ($devis_categ as $i => $item):?>
            <tr>
                <th colspan="2"><?=$item["name"]?></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
        <?php endforeach;?>
        
        <tr>
            <td>SC2BMOD</td>
            <td>Module hydraulique de chaufferie Solisconfort 2</td>
            <td><input type="number" name="" id="" value="1"></td>
            <td>6 896,00</td>
            <td><button>edit</button><button>supprimer</button></td>
        </tr>
    </table>
</form>
<script>
  const devis_categ = <?=json_encode($devis_categ)?>;
</script>