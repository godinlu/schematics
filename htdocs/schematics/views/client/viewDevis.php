    <form id="formulaire" action="" method="post">

        <!-- menu déroulant pour la partie module -->
        <div>
            <button  type="button" class="accordion" id="AC_module">Module</button>
            <div class="panel" id="panel_module">
                <!-- partie module -->
                <div id="module_accesssoires" class="flex">
                    <div>
                        <table>
                            <tr>
                                <td>Module : </td>
                                <td><select id="module" name="module" class="SC_part bigSelect"></select></td>
                            </tr>
                        </table>
                        <fieldset id="div_appoint_c7" class="filled">
                            <legend>Appoint C7</legend>
                            <span>Appoint 2 : </span>
                            <select id="appoint_c7" name="appoint_c7" class="SC_part bigSelect"></select>
                        </fieldset>
                        <fieldset id="div_appoint" class="filled">
                            <legend>Appoint</legend>
                            <span>Appoint : </span>
                            <select id="appoint" name="appoint" class="appoint_part bigSelect"></select>
                        </fieldset>
                        <div id="div_piscine_zone"></div>
                        <div id="div_kit_v3v">
                            V3V bypass appoint 1:
                            <select name="kit_v3v" id="kit_v3v" class="SC_part"></select>
                        </div>

                    </div>
                    

                    <fieldset>
                        <legend>Vase : </legend>
                        <div id="div_vaseExpension"></div>
                        <button id="bt_add_vaseExpension" class="addButton"><i class="fa fa-plus-circle" aria-hidden="true"></i>Ajouter</button>
                    </fieldset>
                </div>
                
            </div>
        </div>
        <!-- menu déroulant pour la partie ballon -->
        <div>
            <button  type="button" class="accordion" id="AC_ballon">Ballons ECS / Tampon</button>
            <div id="panel_ballon" class="panel flex equal">
                <fieldset>
                    <legend>Ballons ECS</legend>
                    <div id="div_ballonECS"></div>
                    <button id="bt_add_ballonECS" class="addButton"><i class="fa fa-plus-circle" aria-hidden="true"></i>Ajouter</button>
                </fieldset>
                <fieldset>
                    <legend>Ballons tampons</legend>
                    <div id="div_ballonTampon"></div>
                    <button id="bt_add_ballonTampon" class="addButton"><i class="fa fa-plus-circle" aria-hidden="true"></i>Ajouter</button>
                </fieldset>
                
                
            </div>
        </div>
        <!-- menu déroulant pour la partie capteurs -->
        <div>
            <button  type="button" class="accordion" id="AC_capteur">Capteurs</button>
            <div class="panel flex" id="panel_capteurs">
                <fieldset>
                    <legend>Capteurs</legend>
                    <div id="div_capteur"></div>
                    <button id="bt_add_capteur" class="addButton"><i class="fa fa-plus-circle" aria-hidden="true"></i>Ajouter</button>
                </fieldset>
                <fieldset id="kit_capteur">
                    <legend>Kit capteurs</legend>
                    <div class="row">
                        <table>
                            <tr id="tr_module_1">
                                <td>Module:</td>
                                <td><select id="kit_capteur_mod1" name="kit_capteur_mod1" class="tubeInox_part bigSelect"></select></td>
                            </tr>
                            <tr>
                                <td>Kit:</td>
                                <td><select id="kit_capteur_kit1" name="kit_capteur_kit1" class="tubeInox_part bigSelect"></select></td>
                            </tr>
                            <tr id="tr_module_2">
                                <td>Module 2:</td>
                                <td><select id="kit_capteur_mod2" name="kit_capteur_mod2" class="tubeInox_part bigSelect"></select></td>
                            </tr>
                        </table>
                    </div>
                </fieldset>
                <!-- div pour l'option ON en mode excédent d'énergie l'été -->
                <div id="div_option_ON_excedent"></div>
            </div>
        </div>
        
        <!-- menu déroulant pour la partie raccordement capteur -->
        <div>
            <button  type="button" class="accordion" id="AC_raccordement_capteur">Raccordement capteur</button>
            <div class="panel flex equal" id="panel_racc_capt">
                <fieldset>
                    <legend>Flexibles inox</legend>
                    <div id="div_flexible_inox"></div>
                    <button id="bt_add_flexible_inox" class="addButton"><i class="fa fa-plus-circle" aria-hidden="true"></i>Ajouter</button>
                </fieldset>
                <fieldset>
                    <legend>Accessoires</legend>
                    <div id="div_accessoire"></div>
                    <button id="bt_add_accessoire" class="addButton"><i class="fa fa-plus-circle" aria-hidden="true"></i>Ajouter</button>
                </fieldset>
            </div>
        </div>
        <!-- division qui regroupe les deux menue déroulant divers et services -->
        <div class="flex">
            <div>
                <button  type="button" class="accordion" id="AC_divers">Divers</button>
                <div id="panel_divers" class="panel">
                    <fieldset id="fd_resistance_elec">
                        <legend>Resistance électrique</legend>
                        <div id="div_resistance_elec"></div>
                    </fieldset>
                    <fieldset id="fd_rechauffeur_boucle">
                        <legend>Réchauffeur de boucle</legend>
                        <div id="div_rechauffeur_boucle"></div>
                    </fieldset>
                </div>
            </div>
            <div>
                <button  type="button" class="accordion" id="AC_services">Services</button>
                <div id="panel_services" class="panel">
                    <div id="div_service"></div>
                </div>
            </div>
        </div>
        <!-- menu déroulant pour ajouter un article -->
        <div>
            <button  type="button" class="accordion" id="AC_ajouter_ligne">Ajouter un article / commentaire</button>
            <div class="panel" id="panel_article_commentaire">
                <div id="panel_article" class="flex">
                    <div class="scroll-container">
                        <table id="table_article">
                            <thead>
                                <tr>
                                    <th>Quantité</th>
                                    <th>
                                        Référence 
                                        <br>
                                        <i class="fa fa-filter"></i>
                                        <input type="text" id="filtre_ref">
                                    </th>
                                    <th>
                                        Désignation
                                        <br>
                                        <i class="fa fa-filter"></i>
                                        <input type="text" id="filtre_label">
                                    </th>
                                    <th>Prix</th>
                                    <th>Catégorie</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <label for="filtre_article_ajouter">Voir que les articles ajoutés</label>
                        <input type="checkbox" id="filtre_article_ajouter" name="filtre_article_ajouter">
                    </div>
                </div>
                <div id="panel_commentaire">
                    <fieldset>
                        <legend>Commentaires</legend>
                        <div id="div_commentaire"></div>
                        <button id="bt_add_commentaire" class="addButton"><i class="fa fa-plus-circle" aria-hidden="true"></i>Ajouter</button>
                    </fieldset>
                </div>
            </div>
        </div>
        <!--partie type installation-->
        <div class="rectangle">
                <p>remise : <input id="input_remise" name="input_remise" type="number" min="0" max="100" step="1" placeholder="0%" /></p>
            </div>
        
        <div id="button_bar">
            <button id="bt_dl_xlsx">télécharger (XLSX)</button>
            <button id="bt_dl_pdf">télécharger (PDF)</button>
        </div>
    </form>

    <div id="div_affichage_devis">
        <div id="header">
            <div>
                <div id="tampon_solisart">
                    <img src="../public/img/LogoS0LISART-vertical.png" alt="logo solisart">
                    <p>
                        220, voie Aristide Bergès <br>
                        73800 SAINTE-HELENE DU LAC <br>
                        Tél: 04 79 60 42 06 Fax : <br>
                        Email : contact@solisart.fr <br>
                    </p>
                    <p>
                        <strong>
                            <span class="underline">Objet :</span> <span id="devis_object"></span><br>
                            <span class="underline">Affaire :</span> <span id="installateur" class="replace_field"></span>
                        </strong>
                    </p>
                </div>
                <div>
                    <table>
                        <tr>
                            <th>CHIFFRAGE ESTIMATIF</th>
                        </tr>
                        <tr>
                            <td><?=date('d/m/Y')?></td>
                        </tr>
                    </table>
                    <p>
                        <strong><span id="installateur" class="replace_field"></strong> <br>
                        Mail : <span id="adresse_mail" class="replace_field"></span><br>
                        <i>A l'attention de <span id="Prénom/nom" class="replace_field"></span></i>
                    </p>
                </div>
            </div>
            <table id="tableAffaire">
                <tr>
                    <td><i>Affaire suivie par</i></td>
                    <td><i>Mode de règlement</i></td>
                    <td><i>Validité</i></td>
                    <td><i>Délai</i></td>
                </tr>
                <tr>
                    <td><span id="commercial" class="replace_field"></span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>
        <table id="table_devis"></table>
        <div id="footer">
            <table></table>
            <table></table>
        </div>
    </div>
    <!--=========================== TEMPLATE ===========================-->
    <!-- template pour les vases d'expension-->
    <template id="tp_vaseExpension">
        <div id="champ_vaseExpension" class="row">
            <table>
                <tr>
                    <td>Accessoires : </td>
                    <td><select id="gamme_kit" class="SC_part bigSelect"></select></td>
                </tr>
            </table>
            <i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
        </div>
    </template>

    <!-- template pour les ballon ecs-->
    <template id="tp_ballonECS">
        <div id="champ_ballonECS" class="row">
            <table>
                <tr>
                    <td>Ballon ECS : </td>
                    <td><select id="ballon_ecs" class="ballon_part bigSelect"></select></td>
                </tr>
            </table>
            <i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
        </div>
    </template>

    <!-- template pour les ballon tampon-->
    <template id="tp_ballonTampon">
        <div id="champ_ballonTampon" class="row">
            <table>
                <tr>
                    <td>Ballon Tampon : </td>
                    <td><select id="ballon_tampon" class="ballon_part bigSelect"></select></td>
                </tr>
            </table>
            <i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
        </div>
    </template>

    <!-- template pour les capteurs-->
    <template id="tp_capteur">
        <div id="champ_capteur" class="row">
            <table>
                <tr>
                    <td>Type : </td>
                    <td><select id="type_capteur" class="small"></select></td>
                </tr>
                <tr>
                    <td>Nb capteurs : </td>
                    <td><select id="nb_capteur" class="small"></select></td>
                </tr>
                <tr id="row_nb_range">
                    <td>Nb de rangées : </td>
                    <td><select id="nb_range" class="small"></select></td>
                </tr>
                <tr id="row_nb_champs" class="hidden">
                    <td>Nb de champs : </td>
                    <td> <input type="number" id="nb_champs" class="small" min="1" value="1"></td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>Type de pose : </td>
                    <td>
                        <select id="type_pose" class="small"></select>
                    </td>
                </tr>
                <tr>
                    <td>Type toiture : </td>
                    <td>
                        <select id="type_toiture" class="small"></select>
                    </td>
                </tr>
                <tr>
                    <td>Inclinaison : </td>
                    <td><select id="inclinaison" class="small"></select></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="checkbox" id="habillage" class="capteur_part">
                        <label for="habillage">habillage capteur</label>
                    </td>
                </tr>
                
            </table>
            
            <i id="suppr_capt" class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
        </div>
        
    </template>

    <!-- template pour les résistance électrique-->
    <template id="tp_resistance_elec">
        <div id="champ_resistance_elec" class="row">
            <table>
                <tr>
                    <td>Résistance Electrique : </td>
                    <td><select id="resistance_elec" name="resistance_elec" class="elecAnode_part"></select></td>
                </tr>
            </table>            
            
        </div>
    </template>

    <!-- template pour les réchauffeur de boucle-->
    <template id="tp_rechauffeur_boucle">
        <div id="champ_rechauffeur_boucle" class="row">
            <table>
                <tr>
                    <td>Réchauffeur de boucle : </td>
                    <td><select id="rechauffeur_boucle" name="rechauffeur_boucle" class="elecAnode_part small"></select></td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>Contacteur :</td>
                    <td><select id="contacteur" name="contacteur"  class="elecAnode_part small"></select></td>
                </tr>
            </table>
            <div>
                <input type="checkbox" id="kit_montage_SC1Z" name="kit_montage_SC1Z" class="elecAnode_part" >
                <label for="kit_montage_SC1Z"></label>
            </div>
        </div>
    </template>

    <!-- template pour les tubes inox-->
    <template id="tp_flexible_inox">
        <div id="champ_flexible_inox" class="row">
            <table>
                <tr>
                    <td>Type flexibles : </td>
                    <td><select id="type_flexible" class="small"></select></td>
                </tr>
                <tr>
                    <td>Dimension : </td>
                    <td><select id="Dimension_flexible"  class="small"></select></td>
                </tr>
                <tr>
                    <td>Flexibles inox : </td>
                    <td><select id="flexible_inox" class="tubeInox_part small"></select></td>
                </tr>
            </table>
            <i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
        </div>
    </template>

    <!-- template pour les accessoires pour les tubes inox-->
    <template id="tp_accessoire">
        <div id="champ_accessoire" class="row">
            <table>
                <tr>
                    <td>
                    Type de joint:
                        <select name="type_joint" id="type_joint">
                            <option value="metal">métal/métal</option>
                            <option value="joint">métal joint</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <ul id="accessoires">
                        </ul>
                    </td>
                </tr>
            </table>
            
            
            <i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
        </div>
    </template>

    <!-- template pour les piscines-->
    <template id="tp_piscine_zone">
        <fieldset class="filled">
            <legend></legend>
            <span>Kit piscine : </span>
            <select class="SC_part bigSelect"></select>
            <br>
            <input type="checkbox" class="SC_part">
            <label></label>
        </fieldset>
        
    </template>

    <!-- template pour la service_part -->
    <template id="tp_service_part">
        <fieldset>
            <legend></legend>
            <select class="service_part"></select>

            <div></div>
        </fieldset> 
    </template>

    <!-- template pour les commentaire -->
    <template id="tp_commentaire">
        <div id="champ_commentaire" class="row">
            <table>
                <tr>
                    <td><textarea id="ta_commentaire" cols="30" rows="2"></textarea></td>
                    <td>Catégorie : </td>
                    <td><select id="s_commentaire"></select></td>
                    <td>Prix : </td>
                    <td><input id="in_commentaire" type="number" value="0" min="0" step="1" ></td>
                </tr>
            </table>
            <i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
        </div>
    </template>
<script>
    const json_tarif = <?=$articles?>;
    const formulaire = <?=json_encode($formulaire)?>;
    const devis_index = <?=json_encode($devis_index)?>;
    const default_devis_index = <?=json_encode($default_devis_index)?>;
    
</script>
