<?php
require_once("image_utils.php");
require_once (APP_BASE_PATH ."config/utils/formulaire_utils.php");

/**
 * Generate the full hydraulic diagram.
 *
 * This function creates a complete hydraulic diagram, optionally including
 * legends. The diagram is generated based on the input form data provided
 * in the $formulaire array.
 *
 * @param array $formulaire Input data defining the hydraulic system components and connections.
 * @param bool $legend Optional. If true, legends will be included in the diagram. Default is false.
 *
 * @return GdImage Returns image generated.
 */
function generate_full_hydraulic_diagram(array $formulaire, bool $legend = false): GdImage{
    return generate_hydraulic_sub_diagram($formulaire);
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
function generate_hydraulic_sub_diagram(array $formulaire): GdImage{
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
        'Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC' => [true, [20, 20]],
        'CESI déportée sur T15' => [true, [50, 190]],
        'CESI déportée sur T16' => [true, [50, 284]],
        'Piscine déportée T15' => [true, [50, 190]],
        'Piscine déportée T6' => [true, [50, 190]],
        'ON en mode excédent d\'énergie l\'été S10' => [true, [50, 190]],
        'ON en mode excédent d\'énergie l\'été S11' => [true, [50, 284]],
        'charge BTC si excédent APP1 sur T16 & T6 < T5_1BT' => [true, [317, 157]],
        'charge BTC si excédent APP1 sur T16 & T6 < T5_2BT' => [true, [317, 157]],
        'charge BTC si excédent APP1 sur T16 & T6 > T5_1BT' => [true, [317, 157]],
        'charge BTC si excédent APP1 sur T16 & T6 > T5_2BT' => [true, [317, 157]]

    ];
    foreach (['S10', 'S11'] as $output) {
        $val = $ctx['option' . $output];

        // pour l'option ON en mode excédent d'énergie l'été l'option peut être à 2 endroit
        // possible en fonction de S10 ou S11 pour cela on rajoute la sortie au nom de l'image.
        if ($val === 'ON en mode excédent d\'énergie l\'été') $val .= ' ' . $output;

        // l'option charge BTC si excédent APP1 sur T16 se branche sur le BT
        // donc on ajoute au nom le nombre de ballon
        if ($val === 'charge BTC si excédent APP1 sur T16 & T6 < T5' ||
        $val === 'charge BTC si excédent APP1 sur T16 & T6 > T5'){
            $nb_BT = preg_replace('/\D/', '', $ctx['ballonTampon']) ?: "1";
            $val .= "_" . $nb_BT . 'BT';
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
?>