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
<!-- Fenêtre modale -->
<div id="modal_window" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <div id="modal_content">

        </div>
    </div>
</div>

<!-- template pour le champ capteur -->
<template id="tp_categ_12">
    <div class="flex">
        <fieldset>
                <legend>Filtres</legend>
                <table>
                    <tr>
                        <td><label for="s_12_type_capteur">Type de capteurs : </label></td>
                        <td><select id="s_12_type_capteur" class="capteur-filter" data-filter_func="get_type">
                            <option value="Aucun">Aucun</option>
                            <option value="S7 2,5">S7 2,5</option>
                            <option value="S7 2,5B">S7 2,5B</option>
                            <option value="S7">S7</option>
                            <option value="SH 2,5">SH 2,5</option>
                            <option value="SH 2">SH 2</option>
                            <option value="SID2,5">SID2,5</option>
                            <option value="SM 2,3">SM 2,3</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td><label for="i_12_nb_capteur">Nb de capteurs : </label></td>
                        <td><input type="number" id="i_12_nb_capteur" min=0 max=12 value="0" class="capteur-filter" data-filter_func="get_nb_capteur"></td>
                    </tr>
                    <tr>
                        <td><label for="i_12_nb_range">Nb de rangées : </label></td>
                        <td><input type="number" id="i_12_nb_range" min=0 max=3 value="0" class="capteur-filter" data-filter_func="get_nb_range"></td>
                    </tr>
                    <tr>
                        <td><label for="s_12_type_pose">Type de pose : </label></td>
                        <td><select id="s_12_type_pose" class="capteur-filter" data-filter_func="get_type_pose">
                            <option value="Aucun">Aucun</option>
                            <option value="CM">Chassis murale</option>
                            <option value="CS">Chassis au sol</option>
                            <option value="CT">Chassis de toit</option>
                            <option value="ST">Surtoiture</option>
                            <option value="V">Vertical</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td><label for="s_12_type_toiture">Type de toiture : </label></td>
                        <td><select id="s_12_type_toiture" class="capteur-filter" data-filter_func="get_type_toiture">
                            <option value="Aucun">Aucun</option>
                            <option value="A">Ardoise</option>
                            <option value="R">Tuile romane ou forte ondulation</option>
                            <option value="T">Autre</option><option value="TO">Tôle ondulée</option>
                        </select></td>
                    </tr>
                </table>
        </fieldset> 
        <div id="div_12_articles" class="scroll-container"></div>
    </div>
        
</template>

<template id="tp_categ_19">
    <div class="flex">
        <fieldset>
                <legend>Filtres</legend>
                <table>
                    <tr>
                        <td><label for="s_19_dimension">Dimension : </label></td>
                        <td><select id="s_19_dimension" class="flexible-filter" data-filter_func="">
                            <option value="Aucun">Aucun</option>
                            <option value="DN16">DN16</option>
                            <option value="DN20">DN20</option>
                            <option value="DN25">DN25</option>
                            <option value="DN32">DN32</option>

                        </select></td>
                    </tr>
                    <tr>
                        <td><label for="s_19_type">Type flexible : </label></td>
                        <td><select id="s_19_type" class="flexible-filter" data-filter_func="">
                            <option value="Aucun">Aucun</option>
                            <option value="Bi tube">Bi tube</option>
                            <option value="Mono tube|monotube">Mono tube</option>
                            <option value="^(?!.*\b(Mono tube|monotube|Bi tube)\b).*">tube avec écrou soudé</option>
                        </select></td>
                    </tr>
                </table>
        </fieldset> 
        <div id="div_19_articles" class="scroll-container"></div>
    </div>
        
</template>

<template id="tp_categ_20">
    <div class="flex">
        <fieldset>
                <legend>Filtres</legend>
                <table>
                    <tr>
                        <td><label for="s_20_dimension">Dimension : </label></td>
                        <td><select id="s_20_dimension" class="kitracc-filter">
                            <option value="Aucun">Aucun</option>
                            <option value="DN16">DN16</option>
                            <option value="DN20">DN20</option>
                            <option value="DN25">DN25</option>
                            <option value="DN32">DN32</option>

                        </select></td>
                    </tr>
                    <tr>
                        <td><label for="s_20_type">Type de joint : </label></td>
                        <td><select id="s_20_type" class="kitracc-filter">
                            <option value="Aucun">Aucun</option>
                            <option value="Bi tube">Bi tube</option>
                            <option value="Mono tube|monotube">Mono tube</option>
                            <option value="^(?!.*\b(Mono tube|monotube|Bi tube)\b).*">tube avec écrou soudé</option>
                        </select></td>
                    </tr>
                </table>
        </fieldset> 
        <div id="div_19_articles" class="scroll-container"></div>
    </div>
        
</template>

<script>
    const default_articles =  <?=json_encode($default_articles)?>;
    <?php if (isset($devis_data)):?>
        const devis_data = <?=json_encode($devis_data)?>;
    <?php endif;?>
    document.addEventListener('DOMContentLoaded', function() {
        Category.set_categories(<?=json_encode($categories)?>);
        Devis.articles = <?=json_encode($articles)?>;
    });
    
</script>