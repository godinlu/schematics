<div id="devis-app">
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
                        <tr>
                            <th><input type="text" data-field_name="header-type_devis"></th>
                        </tr>
                        <tr>
                            <td><input type="date" data-field_name="header-date_devis"></td>
                        </tr>
                    </table>
                    <p>
                        A l'attention de <input type="text" data-field_name="header-installateur_nom_prenom">
                        <br>
                        Nom de l'entreprise <input type="text" data-field_name="header-installateur_entreprise">
                        <br>
                        Mail <input type="text" data-field_name="header-installateur_mail">
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
                    <td><textarea data-field_name="header-affaire_suivie_par" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea data-field_name="header-mode_reglement" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea data-field_name="header-validite" rows="2" placeholder="texte…"></textarea></td>
                    <td><textarea data-field_name="header-delai_livraison" rows="2" placeholder="texte…"></textarea></td>
                </tr>
            </table>
        </div>


        <table class="devis-body articles-table">
            <thead>
                <tr>
                    <th>Ref</th>
                    <th>Désignation</th>
                    <th>Prix</th>
                    <th>Remise %<br><input type="number" value="0" min="0" max="35"> </th>
                    <th>Quantité</th>
                    <th>Montant HT</th>
                    <th>Edition</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>

        <div class="devis-footer">
        </div>
        <devis-footer>
        </devis-footer>

    </div>
    <aside id="sidebar">
        <div id="undo-redo">
            <button id="undo" title="Ctrl + z">Annuler <i class="fa-solid fa-rotate-left"></i></button>
            <button id="redo" title="Ctrl + y">Rétablir <i class="fa-solid fa-rotate-right"></i></button>
        </div>
        <div class="hint">
            <button id="download-devis-pdf" disabled >Télécharger <i class="fa-regular fa-file-pdf"></i></button>
            <span class="hint-tooltip">
                Veuillez renseigner l’affaire et le nom <br>de l’entreprise pour télécharger le devis.
            </span>
        </div>
        
        <button id="info-user" class="hint">
            <i class="fa-solid fa-info"></i>
            <span class="hint-tooltip">Notice</span>
        </button>
    </aside>
</div>

<div class="modal" id="modal-info">
    <div class="modal-content">
        <h2>Comment créer un devis</h2>

        <p>Avant de créer votre devis, voici quelques raccourcis utiles :</p>

        <ul>
            <li><strong>Ctrl + Z</strong> : Annuler la dernière action</li>
            <li><strong>Ctrl + Y</strong> ou <strong>Ctrl + Shift + Z</strong> : Rétablir la dernière action</li>
            <li>Double-clic sur une désignation : éditer la ligne</li>
            <li><strong>Échap</strong> : fermer n’importe quelle modale</li>
        </ul>

        <section>
            <h3>1. Entête</h3>
            <p>
                La plupart des champs de l’entête se remplissent automatiquement à partir des informations saisies dans le formulaire.
                Tous les champs restent cependant modifiables manuellement.
            </p>
        </section>

        <section>
            <h3>2. Détail du devis</h3>
            <p>
                Des articles peuvent être ajoutés automatiquement selon les informations du formulaire (indiqués par un bouton <i class="fa-solid fa-info"></i> dans la colonne "Édition").
                En survolant ce bouton, un texte explique pourquoi l’article a été ajouté par défaut.
            </p>
            <p><strong>Actions possibles sur les lignes :</strong></p>
            <ul>
                <li><i class="fa-regular fa-pen-to-square"></i> Éditer : modifier le contenu d’une ligne</li>
                <li><i class="fa-solid fa-angle-up"></i>/<i class="fa-solid fa-angle-down"></i> Déplacer : changer l’ordre des lignes</li>
                <li><i class="fa-solid fa-xmark"></i> Supprimer : retirer une ligne du devis</li>
                <li>Modifier la quantité : via l’input de la colonne "Quantité"</li>
                <li>Modifier la remise : par ligne ou globalement (remarque : la remise globale n’affecte pas les catégories Service et Transport)</li>
                <li><i class="fa-solid fa-plus"></i> Ajouter un article : ouvre une modale pour naviguer dans les catégories et sélectionner l’article</li>
                <li>Ajouter un commentaire : via le bouton "TEXT" (les commentaires n’ont pas de prix et modifient uniquement leur libellé)</li>
            </ul>
        </section>

        <section>
            <h3>3. Bas du devis</h3>
            <p>
                Vous trouverez ici les totaux : HT, TVA et TTC. Vous pouvez modifier le taux de TVA et le code correspondant si nécessaire.
            </p>
        </section>

        <section>
            <h3>Conseils</h3>
            <p>
                Toutes les actions sont sauvegardées temporairement. Pour une sauvegarde définitive, utilisez le menu <strong>Fichier &gt; Sauvegarder</strong>.
                Les données seront enregistrées dans un fichier ".json".
            </p>
            <p>
                Un historique est disponible pour annuler ou rétablir les actions via les boutons <strong>Annuler</strong> et <strong>Rétablir</strong>.
            </p>
        </section>
    </div>

</div>

<script id="data-devis_tables" type="application/json">
    <?= json_encode($devis_tables, JSON_UNESCAPED_UNICODE) ?>
</script>
