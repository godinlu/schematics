
<div id="main-content">
    <div id="editable-devis">
        <div class="devis-header">
            <div>
                <div class="tampon-solisart">
                    <img src="../public/img/LogoS0LISART-vertical.png" alt="logo solisart">
                    <p>220, voie Aristide Bergès<br>73800 SAINTE-HELENE DU LAC<br>Tél: 04 79 60 42 06 <br> Email : contact@solisart.fr </p>
                    <p>
                        <strong>
                            <span>Objet : <input type="text" name="devis-objet"></span>
                            <br>
                            <span>Affaire : <input type="text" name="devis-affaire"></span>
                        </strong>
                    </p>
                </div>
                <div>
                    <table>
                        <tr><th>CHIFFRAGE ESTIMATIF</th></tr>
                        <tr><td><input type="date" name="devis-date"></td></tr>
                    </table>
                    <p>
                        Mail: <input type="text" name="devis-mail">
                        <br>
                        A l'attention de <input type="text" name="devis-installateur">
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
                    <td><textarea name="devis-field1" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea name="devis-field2" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea name="devis-field3" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea name="devis-field4" rows="2" placeholder="texte…"></textarea></td>
                </tr>
            </table>
        </div>
        <table id="devis-articles" class="devis-container articles-table"></table>
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

<script id="data-header-actions-saved" type="application/json">
<?= json_encode($header_actions_saved, JSON_UNESCAPED_UNICODE) ?>
</script>

<script id="data-formulaire" type="application/json">
<?= json_encode($formulaire, JSON_UNESCAPED_UNICODE) ?>
</script>

