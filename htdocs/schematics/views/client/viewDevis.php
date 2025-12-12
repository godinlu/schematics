
<div id="main-content">
    <div id="editable-devis">
        <div class="devis-header">
            <div>
                <div class="tampon-solisart">
                    <img src="../public/img/Solisart-menue.jpg" alt="logo solisart" width="200">
                    <p>220, voie Aristide Bergès<br>73800 SAINTE-HELENE DU LAC<br>Tél: 04 79 60 42 06 <br> Email : contact@solisart.fr </p>
                    <p>
                        <strong>
                            <span>Objet : <input type="text" data-field_name="header-objet"></span>
                            <br>
                            <span>Affaire : <input type="text" data-field_name="header-affaire"></span>
                        </strong>
                    </p>
                </div>
                <div>
                    <table>
                        <tr><th>CHIFFRAGE ESTIMATIF</th></tr>
                        <tr><td><input type="date" data-field_name="header-date"></td></tr>
                    </table>
                    <p>
                        Mail: <input type="text"  data-field_name="header-mail">
                        <br>
                        A l'attention de <input type="text" data-field_name="header-installateur">
                    </p>
                </div>
            </div>
            <table>
                <tr>
                    <td>Affaire suivie par</td>
                    <td>Mode de règlement</td>
                    <td>Validité</td>
                    <td>Délai</td>
                </tr>
                <tr>
                    <td><textarea data-field_name="header-field1" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea data-field_name="header-field2" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea data-field_name="header-field3" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea data-field_name="header-field4" rows="2" placeholder="texte…"></textarea></td>
                </tr>
            </table>
        </div>
        <table class="devis-body articles-table"></table>
        <div class="devis-footer">
        </div>
    </div>
    
    <aside id="sidebar">
    </aside>
</div>
<form id="formulaire" action="" method="post">
</form>


<script id="data-articles" type="application/json">
<?= json_encode($articles, JSON_UNESCAPED_UNICODE) ?>
</script>

<script id="data-categories" type="application/json">
<?= json_encode($categories, JSON_UNESCAPED_UNICODE) ?>
</script>

<script id="data-actions-saved" type="application/json">
<?= json_encode($actions_saved, JSON_UNESCAPED_UNICODE) ?>
</script>

<script id="data-formulaire" type="application/json">
<?= json_encode($formulaire, JSON_UNESCAPED_UNICODE) ?>
</script>

