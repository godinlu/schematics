<?php
require_once("image_utils.php");
require_once (APP_BASE_PATH ."config/utils/formulaire_utils.php");

function add_legend_equipments(GdImage $gd_image, array $formulaire): GdImage{
    // define the static new width of the img
    $NEW_WIDTH = 1170;

    // create a new white image with the same height and the new width
    $new_img = imagecreatetruecolor($NEW_WIDTH, imagesy($gd_image));
    imagefill($new_img, 0 , 0 , imagecolorallocate($new_img, 255, 255, 255));

    // copy the $gd_img to new img
    imagecopy($new_img, $gd_image, 0, 0, 0, 0, imagesx($gd_image), imagesy($gd_image));

    // construct the table of equipments
    $table = construct_table_of_equipments($formulaire);

    // draw the table on the right of the new img
    draw_table($new_img, $table, [880 ,30], "Légende des équipements");
    return $new_img;
}


function add_header_and_footer_on_base(GdImage $gd_image, array $formulaire): GdImage{
    $new_image = imagecreatetruecolor(891, 666);
    imagefill($new_image,0 , 0 , imagecolorallocate($new_image, 255, 255, 255));

    // Copier l'image originale aux coordonnées données
    imagecopy($new_image, $gd_image, 0, 40, 0, 0, imagesx($gd_image), imagesy($gd_image));

    // ajout du titre du schéma
    if (preg_match('/SC/', $formulaire['typeInstallation'])){
        $title = "Schéma hydraulique |S|olis |C|onfort |SC|" . str_replace( "SC", "", $formulaire['typeInstallation']);
    }else{
        $title = "Schéma hydraulique " . $formulaire['typeInstallation'];
    }
    add_title_inplace($new_image, $title, [250, 20]);

    // ajout de l'image du footer
    $footer = imagecreatefrompng(APP_BASE_PATH . "public/img/schema_hydro/footer.png");
    imagecopy($new_image, $footer, 8, 517, 0, 0, imagesx($footer), imagesy($footer));

    // ajout des labels pour les sorties S10 S11
    $opt_S10 = $formulaire["sorties"]["S10"] ?? "";
    $opt_S11 = $formulaire["sorties"]["S11"] ?? "";
    add_label_inplace($new_image, "option S10 : " . $opt_S10, [433, 572]);
    add_label_inplace($new_image, "option S11 : " . $opt_S11, [433, 584]);

    // ajout du paragraphe de description
    add_paragraph_inplace($new_image, "Schéma hydraulique " . $formulaire['description'], [433, 587] , 350, 8);

    // ajout de la date
    add_label_inplace($new_image, date("d/m/Y"), [710, 648]);

    // ajout du nom de l'affaire
    $affaire_value = "non renseigné";
    if ($formulaire['nom_client'] != "" || $formulaire['prenom_client'] != "") {
        $affaire_value = strtoupper($formulaire['nom_client']) . " " . strtoupper($formulaire['prenom_client']);
    }
    add_label_inplace($new_image, "Affaire : $affaire_value", [433, 646]);

    // ajout de la légende en cas d'appoint sur C7
    if (preg_match('/Appoint/', $formulaire['circulateurC7'])){
        $legend_APP = imagecreatefrompng(APP_BASE_PATH . "public/img/schema_hydro/legend_appoint_C7.png");
        imagecopy($new_image, $legend_APP, 0, 0, 0, 0, imagesx($legend_APP), imagesy($legend_APP));
    }

    return $new_image;
}

/**
 * Generate the hydraulic sub-diagram.
 *
 * This function creates only the hydraulic schematic (sub-diagram) without
 * any additional legends or annotations.
 * 
 * @param array $formulaire Input data defining the hydraulic system components and connections.
 *
 * @return GdImage Returns the image generated.
 */
function generate_hydraulic_base_diagram(array $formulaire): GdImage{
    $img_composer = new ImageComposer(APP_BASE_PATH . "public/img/schema_hydro/");

    generate_hydraulic_components($formulaire, $img_composer);

    return $img_composer->render();
}



function generate_hydraulic_components(array $ctx, ImageComposer $ic): void{
    ////////////////////////////////////////////////////////////////////////
    //                          DEFAULT
    ////////////////////////////////////////////////////////////////////////
    $ic->add_image('template schema');

    ////////////////////////////////////////////////////////////////////////
    //                          champCapteur
    ////////////////////////////////////////////////////////////////////////
    $capteursMap = [
        '/capteurs/' => 'champCapteur/capteurs',
        '/casse pression/' => 'champCapteur/casse pression',
        '/échangeur/' => 'champCapteur/échangeur',
        '/2 champs capteurs en/' => 'champCapteur/2 champs capteurs en',
        '/2 champs capteurs découplés/' => 'champCapteur/2 champs capteurs découplés',
        '/V3V/' => 'champCapteur/V3V',
        '/double circulateur/' => 'champCapteur/double circulateur',
    ];
    foreach ($capteursMap as $pattern => $path) {
        if (preg_match($pattern, $ctx['champCapteur'])) {
            $ic->add_image($path);
        }
    }
    if (preg_match('/T15|T16/', $ctx['champCapteur'], $matches)){
        $ic->add_label($matches[0], 94, 238);
    }

    ////////////////////////////////////////////////////////////////////////
    //                          ballonTampon
    ////////////////////////////////////////////////////////////////////////
    
    if ($ctx["ballonTampon"] !== "Aucun"){
        // ajout du bon ballon tampon avec ou sans échangeur en fonction de la case à cocher "EchangeurDansBT"
        $ech = ($ctx["EchangeurDansBT"] === "on") ? "avec échangeur" : "sans échangeur";
        $ic->add_image('ballonTampon/' . $ctx["ballonTampon"] . " " . $ech);

        // ajout du raccord du ballon tampon avec une V3V
        // seulement si il y a un champ capteur
        if ($ctx["champCapteur"] !== "Aucun"){
            $ic->add_image("ballonTampon/raccord capteur");
        }

        // ajout de la resistance electrique dans le ballon tampon si activé
        if ($ctx["resistanceElectriqueBT"] === "on"){
            $ic->add_image("ballonTampon/resistance electrique");
        }

        // suppression du ou des vases d'expension dans le cas bien précis 
        // ou il y a un échangeur en appoint 1 et l'option charge BTC en S10 ou S11.
        if (preg_match('/échangeur/', $ctx["raccordementHydraulique"]) &&
            (preg_match('/charge BTC/', $ctx["optionS10"]) || preg_match('/charge BTC/', $ctx["optionS11"]))
        ){
            // TODO
        }
        
    }

    ////////////////////////////////////////////////////////////////////////
    //                          appoint
    ////////////////////////////////////////////////////////////////////////
    if ($ctx["raccordementHydraulique"] !== "Aucun"){
        // ajout de l'image de raccord d'appoint dans tous les cas
        $ic->add_image('Appoint/raccord Appoint');

        // mapping des images à ajouté avec le nom de l'image en key
        // et la condition d'ajout de l'image en value
        $mapping = [
            "Appoint" => preg_match("/Appoint/i", $ctx["raccordementHydraulique"]),
            "En direct" => preg_match("/En direct/i", $ctx["raccordementHydraulique"]),
            "RDH_app1" => ($ctx['RDH_appoint1'] === "on"),
            "RDH_app2" => ($ctx['RDH_appoint2'] === "on" && $ctx['locAppoint2'] === "cascade"),
            "casse pression" => preg_match("/casse pression/i", $ctx["raccordementHydraulique"]),
            "échangeur" => preg_match("/échangeur/i", $ctx["raccordementHydraulique"]),
            "en cascade" => preg_match("/Appoint double en cascade/i", $ctx["raccordementHydraulique"]),
            "double sur" => preg_match("/Appoint double sur/i", $ctx["raccordementHydraulique"]),
            "appoint sur tampon" => preg_match("/Appoint sur tampon avec échangeur/i", $ctx["raccordementHydraulique"]),
            "T16 simple" => preg_match("/simple T16/i", $ctx["raccordementHydraulique"]),
            "T16" => preg_match('/^(?!.*simple)(?!.*tampon).*T16/i', $ctx["raccordementHydraulique"]),
            "réchauffeur de boucle Droite" => (preg_match("/réchauffeur de boucle/i", $ctx["raccordementHydraulique"]) && $ctx['Gauche_droite'] == "Droite"),
            "réchauffeur de boucle Gauche" => (preg_match("/réchauffeur de boucle/i", $ctx["raccordementHydraulique"]) && $ctx['Gauche_droite'] == "Gauche")
        ];

        // boucle dans le mapping pour ajouter les images si la condition est respecté
        foreach($mapping as $image_name => $is_matched){
            if ($is_matched){
                $ic->add_image('Appoint/' . $image_name);
            }
        }  
    }

    ////////////////////////////////////////////////////////////////////////
    //                          ballonECS
    ////////////////////////////////////////////////////////////////////////
    if ($ctx['ballonECS'] !== 'Aucun'){
        // ajout du ballonECS correspondant
        $ic->add_image('ballonECS/' . $ctx['ballonECS']);

        // ajout du circulateur C5 seulement si il y a soit un champ capteur soit 
        // un ballon tampon
        if ($ctx['champCapteur'] !== "Aucun" || $ctx['ballonTampon'] !== "Aucun"){
            $ic->add_image('ballonECS/circulateur c5');
        }
        // ajout de la resistance electrique en fonction de l'input resistanceElectriqueBECS
        if ($ctx['resistanceElectriqueBECS'] === "on"){
            $ic->add_image('ballonECS/resistance electrique');
        }
    }
    
    ////////////////////////////////////////////////////////////////////////
    //                          Circulateurs
    ////////////////////////////////////////////////////////////////////////
    $circulateurs = ['circulateurC1', 'circulateurC2', 'circulateurC3', 'circulateurC7'];

    for ($i=0; $i < count($circulateurs); $i++) { 
        $circ = $circulateurs[$i];

        // Cas 'Aucun' on ne fait rien
        if ($ctx[$circ] === 'Aucun') continue;

        // PILOTAGE DE RADIATEUR
        // dans le cas ou il y a un radiateur sur ECH ou CP et que la ou les zones d'après
        // sont "Idem zone n-1" alors on ajoute un label ('C2' ou 'C3' ou 'C7') correspondant
        // au dernier circulateurs contenant 'Idem zone n-1'
        // IMPORTANT : dans ce cas spécifique les images des 'Idem zone n-1' ne seront pas afficher
        // d'ou le $i++
        if (preg_match('/Radiateurs.*(échangeur|casse pression)/', $ctx[$circ])){
            $pilotage_rad = null;
            for ($j=$i+1; $j < count($circulateurs); $j++) { 
                if (!preg_match('/Idem/', $ctx[$circulateurs[$j]])){
                    break;
                }
                $pilotage_rad = preg_replace('/circulateur/', '', $circulateurs[$j]);
                $i++;
            }
            if (isset($pilotage_rad)){
                $pilotage_rad_coords = [
                    'circulateurC1'=> [809, 345],
                    'circulateurC2'=> [809, 245],
                    'circulateurC3'=> [809, 145]
                ];
                $ic->add_label($pilotage_rad, ...$pilotage_rad_coords[$circ], size:8);
            }
        }

        // cas particulier d'un appoint sur C7
        if (preg_match('/Appoint/', $ctx[$circ])){
            // ajout ' avec RDH' si il y a un réhaussement des retours sur l'appoint C7
            $rdh = ($ctx['RDH_appoint2'] === 'on')? ' avec RDH' : '';

            // construction du chemin de l'image avec l'appoint en question + le raccordement
            // hydraulique + le réhaussement des retours sur l'appoint
            $img_path = $circ . '/AppointC7/' . $ctx[$circ] . " ". $ctx['RH_appoint2'] . $rdh;

            // supprime bois ou granulé car les images sont les même dans les 2 cas
            $ic->add_image(preg_replace('/ bois| granulé/', '', $img_path));
            continue;
        }

        // cas par défaut d'ajout de l'image avec le nom de l'img correspondant au circulateur
        // en question
        $ic->add_image($circ . '/' . $ctx[$circ]);
    }

    ////////////////////////////////////////////////////////////////////////
    //                          DIVERS
    ////////////////////////////////////////////////////////////////////////
    if ($ctx['D3'] === 'on'){
        $ic->add_image('divers/comptage energétique utile solaire D3');
    }
    if ($ctx['D5'] === 'on'){
        $ic->add_image('divers/comptage energétique utile appoint D5');
    }
    if ($ctx['divers'] !== 'Aucun'){
        $ic->add_image('divers/' . $ctx['divers']);
    }

    ////////////////////////////////////////////////////////////////////////
    //                          OPTIONS S10 + S11
    ////////////////////////////////////////////////////////////////////////
    $opt_mapping = [
        'CESI déportée sur T15' => [true, [50, 190]],
        'CESI déportée sur T16' => [true, [50, 284]],
        'Piscine déportée T15' => [true, [50, 190]],
        'Piscine déportée T6' => [true, [50, 190]],
        'ON en mode excédent d\'énergie l\'été [S10]' => [true, [50, 190]],
        'ON en mode excédent d\'énergie l\'été [S11]' => [true, [50, 284]],
        'charge BTC si excédent APP1 sur T16 & T6 < T5 [1BT]' => [true, [317, 157]],
        'charge BTC si excédent APP1 sur T16 & T6 < T5 [2BT]' => [true, [317, 157]],
        'charge BTC si excédent APP1 sur T16 & T6 > T5 [1BT]' => [true, [317, 157]],
        'charge BTC si excédent APP1 sur T16 & T6 > T5 [2BT]' => [true, [317, 157]],
        'Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC [1BT-gauche]' => [true, [322, 135]],
        'Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC [2BT-gauche]' => [true, [322, 135]],
        'Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC [1BT-droite]' => [true, [450, 135]],
        'Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC [2BT-droite]' => [true, [450, 135]],
        'Décharge sur zone 1' => [true, [820, 413]],
        'Décharge sur zone 1 [PC]' => [true, [762, 413]],
        'V3V décharge zone 1' => [true, [868, 335]],
        'V3V décharge zone 1 [PC]' => [true, [858, 376]],
        'V3V décharge zone 1 [PISCINE]' => [true, [825, 352]],
        'Free Cooling Zone 1' => [true, [778, 449]],
        'Free Cooling Zone 2' => [true, [804, 285]],
        'Free Cooling Zone 3' => [true, [810, 192]],
        'Free Cooling Zone 4' => [true, [692, 184]],
        'Electrovanne Appoint 1 ou Flow Switch' => [true, [485, 75]],
        'V3V bypass appoint 1' => [true, [543, 154]],
        'V3V retour bouclage sanitaire solaire' => [true, [363, 320]],
        'recharge nappes goethermiques sur T15 sur échangeur BTC' => [true, [326, 376]],
        'recharge nappes goethermiques sur T15 sur serpentin BTC' => [true, [323, 408]]

    ];
    foreach (['S10', 'S11'] as $output) {
        $val = $ctx['option' . $output];

        // pour l'option ON en mode excédent d'énergie l'été l'option peut être à 2 endroit
        // possible en fonction de S10 ou S11 pour cela on rajoute la sortie au nom de l'image.
        if ($val === 'ON en mode excédent d\'énergie l\'été') $val .= ' [' . $output . ']';

        // l'option charge BTC si excédent APP1 sur T16 se branche sur le BT
        // donc on ajoute au nom le nombre de ballon
        if ($val === 'charge BTC si excédent APP1 sur T16 & T6 < T5' ||
        $val === 'charge BTC si excédent APP1 sur T16 & T6 > T5'){
            $nb_BT = preg_replace('/\D/', '', $ctx['ballonTampon']) ?: "1";
            $val .= ' [' . $nb_BT . 'BT]';
        }

        // l'option Aquastat différentiel ON si... se branche sur le BT et sur l'options de divers
        // pompe, ou deshu on a donc 4 images. prefix : [(1|2)BT-(gauche|droite)]
        if ($val === 'Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC'){
            $nb_BT = preg_replace('/\D/', '', $ctx['ballonTampon']) ?: "1";
            $gd = (preg_match('/gauche/', $ctx['divers'])) ? 'gauche' : 'droite';
            $val .= ' [' . $nb_BT . 'BT-' . $gd . ']';
        }

        // l'option Décharge sur zone 1 n'a pas la même image si elle est branché sur un PC prefix : [PC]
        if ($val === 'Décharge sur zone 1'){
            $val .= (preg_match('/Plancher chauffant|PC/', $ctx['circulateurC1']))? ' [PC]': '';
        }

        // l'option V3V décharge zone 1 n'a pas la même image si elle est branché sur un PC ou un piscine
        // prefix : [PC|PISCINE]
        if ($val === 'V3V décharge zone 1'){
            $pc = (preg_match('/Plancher chauffant|PC/', $ctx['circulateurC1']))? ' [PC]': '';
            $piscine = (preg_match('/Piscine/', $ctx['circulateurC1']))? ' [PISCINE]': '';
            $val .= $pc . $piscine;
        }

        // L'option Electrovanne Appoint 1 ou Flow Switch à son label de sortie dupliqué
        if ($val === 'Electrovanne Appoint 1 ou Flow Switch'){
            $ic->add_label($output, 485, 163);
        }
        

        if (isset($opt_mapping[$val])){
            if ($opt_mapping[$val][0]){
                $ic->add_image('options/' . preg_replace('/[<>]/', 'x', $val));
            }
            if (isset($opt_mapping[$val][1])){
                $ic->add_label($output, ...$opt_mapping[$val][1]);
            }
        }        
    }
}


function construct_table_of_equipments(array $ctx):array{
    $equipment_mapping = [
        "circulateurs" => [
            "C1" => "Circulateur chauffage zone 1",
            "C2" => "Circulateur chauffage zone 2",
            "C3" => "Circulateur chauffage zone 3",
            "C4" => "Circulateur ballon appoint",
            "C5" => "Circulateur ballon solaire",
            "C6" => "Circulateur ballon tampon",
            "C7" => "Circulateur appoint 2 / chauffage zone 4"
        ],
        "sondes" => [
            "T1" => "T° capteur chaud",
            "T2" => "T° capteur froid",
            "T3" => "T° bas de ballon / T° ballon solaire",
            "T4" => "T° haut de ballon / T° ballon appoint",
            "T5" => "T° ballon tampon",
            "T6" => "T° appoint 2",
            "T7" => "T° collecteur froid",
            "T8" => "T° collecteur chaud",
            "T9" => "T° extérieure",
            "T10" => "T° sonde d’option",
            "T11" => "T° ambiance zone 1",
            "T12" =>  "T° ambiance zone 2",
            "T13" => "T° ambiance zone 3",
            "T14" => "T° ambiance zone 4",
            "T15" => "T° sonde d’option",
            "T16" => "T° sonde d’option"
        ],
        "sorties" => [
            "S10" => "Sortie disponible pour option 47/48",
            "S11" => "Sortie disponible pour option 49/50"
        ]
    ];

    $res = [];

    foreach ($equipment_mapping as $ctx_key => $sub_mapping) {
        if (isset($ctx[$ctx_key]) && is_array($ctx[$ctx_key])){
            foreach ($sub_mapping as $key => $label) {
                if (array_key_exists($key, $ctx[$ctx_key])) {
                    $res[] = [$key, $label];
                }
            }
        }
    }
    return $res;
}
?>