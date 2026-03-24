<?php
require_once("image_utils.php");
require_once(__DIR__ . "/table/Label.php");
require_once(__DIR__ . "/table/Cell.php");
require_once(__DIR__ . "/table/Row.php");
require_once(__DIR__ . "/table/Table.php");

function add_legend_equipments(GdImage $gd_image, array $formulaire): GdImage
{
    // define the static new width of the img
    $NEW_WIDTH = 1170;

    // create a new white image with the same height and the new width
    $new_img = imagecreatetruecolor($NEW_WIDTH, imagesy($gd_image));
    imagefill($new_img, 0, 0, imagecolorallocate($new_img, 255, 255, 255));

    // copy the $gd_img to new img
    imagecopy($new_img, $gd_image, 0, 0, 0, 0, imagesx($gd_image), imagesy($gd_image));

    // construct and draw the table of equipments using OOP classes
    $equipment_rows = construct_table_of_equipments($formulaire);

    $table = new Table();

    // title row (single cell, centered, full width)
    $title_cell = new Cell(new Label("Légende des équipements"));
    $title_cell->setAttribute(['centered_x' => true, 'centered_y' => true]);
    $title_row = new Row();
    $title_row->addCell($title_cell);
    $table->addRow($title_row);

    // data rows
    foreach ($equipment_rows as [$key, $label]) {
        $row = new Row();
        $row->addCell(new Cell(new Label($key)));
        $row->addCell(new Cell(new Label($label)));
        $table->addRow($row);
    }

    $table->render($new_img, 880, 30);
    return $new_img;
}


function add_header_and_footer_on_base(GdImage $gd_image, array $formulaire): GdImage
{
    $new_image = imagecreatetruecolor(891, 666);
    imagefill($new_image, 0, 0, imagecolorallocate($new_image, 255, 255, 255));

    // Copier l'image originale aux coordonnées données
    imagecopy($new_image, $gd_image, 0, 40, 0, 0, imagesx($gd_image), imagesy($gd_image));

    // ajout du titre du schéma
    if (preg_match('/^SC/', $formulaire['typeInstallation'])) {
        $title = "Schéma hydraulique |S|olis |C|onfort |SC|" . str_replace("SC", "", $formulaire['typeInstallation']);
    } else {
        $title = "Schéma hydraulique " . $formulaire['typeInstallation'];
    }
    add_title_inplace($new_image, $title, [250, 20]);

    // ajout de l'image du footer
    $footer = imagecreatefrompng(IMG_DIR . "schema_hydro/footer.png");
    imagecopy($new_image, $footer, 8, 517, 0, 0, imagesx($footer), imagesy($footer));

    // ajout des labels pour les sorties S10 S11
    add_label_inplace($new_image, "option S10 : " . $formulaire['optionS10'], [433, 572]);
    add_label_inplace($new_image, "option S11 : " . $formulaire['optionS11'], [433, 584]);

    // ajout du paragraphe de description
    add_paragraph_inplace($new_image, "Schéma hydraulique " . $formulaire['description'], [433, 587], 350, 8);

    // ajout de la date
    add_label_inplace($new_image, date("d/m/Y"), [710, 648]);

    // ajout du nom de l'affaire
    $affaire_value = "non renseigné";
    if ($formulaire['nom_client'] != "" || $formulaire['prenom_client'] != "") {
        $affaire_value = strtoupper($formulaire['nom_client']) . " " . strtoupper($formulaire['prenom_client']);
    }
    add_label_inplace($new_image, "Affaire : $affaire_value", [433, 646]);

    // ajout de la légende en cas d'appoint sur C7
    if (preg_match('/Appoint/', $formulaire['circulateurC7'])) {
        $legend_APP = imagecreatefrompng(IMG_DIR . "schema_hydro/legend_appoint_C7.png");
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
function generate_hydraulic_base_diagram(array $formulaire): GdImage
{
    $img_composer = new ImageComposer(IMG_DIR . "schema_hydro/");

    generate_hydraulic_components($formulaire, $img_composer);

    $img = $img_composer->render();

    $rules = [...get_rdr_circ_rules(), ...get_rdr_v3v_rules()];
    foreach ($rules as $rule) {
        foreach ($rule->evaluate($formulaire) as $element) {
            $element->render($img);
        }
    }
    return $img;
}


function generate_hydraulic_components(array $ctx, ImageComposer $ic): void
{
    add_default_layer($ctx, $ic);
    add_capteur_images($ctx, $ic);
    add_ballon_tampon_images($ctx, $ic);
    add_appoint_images($ctx, $ic);
    add_ballon_ecs_images($ctx, $ic);
    add_divers_images($ctx, $ic);
    add_circulateurs_images($ctx, $ic);
    add_options_images($ctx, $ic);
}


function add_default_layer(array $ctx, ImageComposer $ic): void
{
    $ic->add_image('template schema');

    if ($ctx['champCapteur'] === 'Aucun' && $ctx['ballonTampon'] === 'Aucun') {
        $ic->add_image('raccord/hide capteur racc');
    }
}


function add_capteur_images(array $ctx, ImageComposer $ic): void
{
    $capteursMap = [
        '/capteurs/'                    => 'champCapteur/capteurs',
        '/casse pression/'              => 'champCapteur/casse pression',
        '/échangeur/'                   => 'champCapteur/échangeur',
        '/2 champs capteurs en/'        => 'champCapteur/2 champs capteurs en',
        '/2 champs capteurs découplés/' => 'champCapteur/2 champs capteurs découplés',
        '/V3V/'                         => 'champCapteur/V3V',
        '/double circulateur/'          => 'champCapteur/double circulateur',
    ];
    foreach ($capteursMap as $pattern => $path) {
        if (preg_match($pattern, $ctx['champCapteur'])) {
            $ic->add_image($path);
        }
    }
    if (preg_match('/T15|T16/', $ctx['champCapteur'], $matches)) {
        $ic->add_label($matches[0], 94, 238);
    }
}


function add_ballon_tampon_images(array $ctx, ImageComposer $ic): void
{
    if ($ctx["ballonTampon"] === "Aucun") return;

    $ech = ($ctx["EchangeurDansBT"] === "on") ? "avec échangeur" : "sans échangeur";
    $ic->add_image('ballonTampon/' . $ctx["ballonTampon"] . " " . $ech);

    if ($ctx["champCapteur"] !== "Aucun") {
        $ic->add_image("ballonTampon/raccord capteur");
    }

    if ($ctx["resistanceElectriqueBT"] === "on") {
        $ic->add_image("ballonTampon/resistance electrique");
    }
}


function add_appoint_images(array $ctx, ImageComposer $ic): void
{
    if ($ctx["raccordementHydraulique"] === "Aucun") return;

    $ic->add_image('Appoint/raccord Appoint');

    $rdh = $ctx["raccordementHydraulique"];
    $mapping = [
        "Appoint"                    => preg_match("/Appoint/i", $rdh),
        "En direct"                  => preg_match("/En direct/i", $rdh),
        "RDH_app1"                   => ($ctx['RDH_appoint1'] === "on"),
        "RDH_app2"                   => ($ctx['RDH_appoint2'] === "on" && $ctx['locAppoint2'] === "cascade"),
        "casse pression"             => preg_match("/casse pression/i", $rdh),
        "échangeur"                  => preg_match("/échangeur/i", $rdh),
        "en cascade"                 => preg_match("/Appoint double en cascade/i", $rdh),
        "double sur"                 => preg_match("/Appoint double sur/i", $rdh),
        "appoint sur tampon"         => preg_match("/Appoint sur tampon avec échangeur/i", $rdh),
        "T16 simple"                 => preg_match("/simple T16/i", $rdh),
        "T16"                        => preg_match('/^(?!.*simple)(?!.*tampon).*T16/i', $rdh),
        "réchauffeur de boucle Droite" => (preg_match("/réchauffeur de boucle/i", $rdh) && $ctx['Gauche_droite'] == "Droite"),
        "réchauffeur de boucle Gauche" => (preg_match("/réchauffeur de boucle/i", $rdh) && $ctx['Gauche_droite'] == "Gauche"),
        "Aucun appoint deshu [droite]" => ($ctx['appoint1'] === 'Aucun' && !preg_match('/gauche/', $ctx['divers'])),
        "Aucun appoint deshu [gauche]" => ($ctx['appoint1'] === 'Aucun' && preg_match('/gauche/', $ctx['divers'])),
    ];

    foreach ($mapping as $image_name => $is_matched) {
        if ($is_matched) {
            $ic->add_image('Appoint/' . $image_name);
        }
    }
}


function add_ballon_ecs_images(array $ctx, ImageComposer $ic): void
{
    if ($ctx['ballonECS'] === 'Aucun') return;

    $ic->add_image('ballonECS/' . $ctx['ballonECS']);

    if ($ctx['champCapteur'] !== "Aucun" || $ctx['ballonTampon'] !== "Aucun") {
        $ic->add_image('ballonECS/circulateur c5');
    }

    if ($ctx['resistanceElectriqueBECS'] === "on") {
        $ic->add_image('ballonECS/resistance electrique');
    }
}



/**
 * Résout le label de pilotage radiateur et le nombre de zones "Idem" à sauter.
 * Retourne [$label|null, $nb_zones_à_sauter].
 */
function resolve_pilotage_radiateur(array $ctx, array $circulateurs, int $from): array
{
    $label = null;
    $skip  = 0;
    for ($j = $from + 1; $j < count($circulateurs); $j++) {
        if (!preg_match('/Idem/', $ctx[$circulateurs[$j]])) break;
        $label = preg_replace('/circulateur/', '', $circulateurs[$j]);
        $skip++;
    }
    return [$label, $skip];
}


function add_circulateurs_images(array $ctx, ImageComposer $ic): void
{
    $circulateurs = ['circulateurC1', 'circulateurC2', 'circulateurC3', 'circulateurC7'];

    // cache les raccords chaud et froid des zones de chauffage si toutes désactivées.
    foreach ($circulateurs as $circ) {
        if (
            $ctx[$circ] === 'Aucun' ||
            $ctx[$circ] === 'Rehaussement des retours sur V3V' ||
            $ctx[$circ] === 'Rehaussement des retours sur circulateur'
        ) $ic->add_image('raccord/hide ' . $circ);
        else break;
    }

    $pilotage_rad_coords = [
        'circulateurC1' => [809, 345],
        'circulateurC2' => [809, 245],
        'circulateurC3' => [809, 145],
    ];

    for ($i = 0; $i < count($circulateurs); $i++) {
        $circ = $circulateurs[$i];

        if (
            $ctx[$circ] === 'Aucun' ||
            $ctx[$circ] === 'Rehaussement des retours sur V3V' ||
            $ctx[$circ] === 'Rehaussement des retours sur circulateur'
        ) continue;

        // PILOTAGE DE RADIATEUR
        // si la zone courante est un radiateur sur ECH/CP et que les zones suivantes
        // sont "Idem zone n-1", on affiche uniquement le label du dernier circulateur
        // concerné et on saute ces zones.
        if (preg_match('/Radiateurs.*(échangeur|casse pression)/', $ctx[$circ])) {
            [$label, $skip] = resolve_pilotage_radiateur($ctx, $circulateurs, $i);
            $i += $skip;
            if ($label !== null) {
                $ic->add_label($label, ...$pilotage_rad_coords[$circ], size: 8);
            }
        }

        // cas particulier d'un appoint sur C7
        if (preg_match('/Appoint/', $ctx[$circ])) {
            $rdh      = ($ctx['RDH_appoint2'] === 'on') ? ' avec RDH' : '';
            $img_path = $circ . '/AppointC7/' . $ctx[$circ] . " " . $ctx['RH_appoint2'] . $rdh;
            $ic->add_image(preg_replace('/ bois| granulé/', '', $img_path));
            continue;
        }

        $ic->add_image($circ . '/' . $ctx[$circ]);
    }
}


function add_divers_images(array $ctx, ImageComposer $ic): void
{
    if ($ctx['D3'] === 'on') {
        $ic->add_image('divers/comptage energétique utile solaire D3');
    }
    if ($ctx['D5'] === 'on') {
        $ic->add_image('divers/comptage energétique utile appoint D5');
    }
    if ($ctx['divers'] !== 'Aucun') {
        $ic->add_image('divers/' . $ctx['divers']);
    }
}


/**
 * Résout la clé finale d'une option S10/S11 en ajoutant les suffixes contextuels
 * (nombre de ballons tampons, côté gauche/droite, type de zone, etc.).
 */
function resolve_option_key(string $val, string $output, array $ctx): string
{
    if ($val === "ON en mode excédent d'énergie l'été")
        return $val . ' [' . $output . ']';

    if (
        $val === 'charge BTC si excédent APP1 sur T16 & T6 < T5' ||
        $val === 'charge BTC si excédent APP1 sur T16 & T6 > T5'
    ) {
        $nb_BT = preg_replace('/\D/', '', $ctx['ballonTampon']) ?: "1";
        return $val . ' [' . $nb_BT . 'BT]';
    }

    if ($val === 'Aquastat différentiel avec circulateur si T5>T15 sur BTC') {
        $nb_BT = preg_replace('/\D/', '', $ctx['ballonTampon']) ?: "1";
        return 'Rehaussement des retours sur circulateur [' . $nb_BT . 'BT]';
    }

    if ($val === 'Décharge sur zone 1') {
        return $val . (preg_match('/Plancher chauffant|PC/', $ctx['circulateurC1']) ? ' [PC]' : '');
    }

    if ($val === 'V3V décharge zone 1') {
        $pc     = preg_match('/Plancher chauffant|PC/', $ctx['circulateurC1']) ? ' [PC]'     : '';
        $piscine = preg_match('/Piscine/',              $ctx['circulateurC1']) ? ' [PISCINE]' : '';
        return $val . $pc . $piscine;
    }

    return $val;
}


function add_options_images(array $ctx, ImageComposer $ic): void
{
    // Coordonnées [x, y] du label de sortie (S10/S11) pour chaque option.
    $opt_mapping = [
        'CESI déportée sur T15'                                                                        => [50,  190],
        'CESI déportée sur T16'                                                                        => [50,  284],
        'Piscine déportée T15'                                                                         => [50,  190],
        'Piscine déportée T6'                                                                          => [50,  190],
        "ON en mode excédent d'énergie l'été [S10]"                                                    => [50,  190],
        "ON en mode excédent d'énergie l'été [S11]"                                                    => [50,  284],
        'charge BTC si excédent APP1 sur T16 & T6 < T5 [1BT]'                                         => [317, 157],
        'charge BTC si excédent APP1 sur T16 & T6 < T5 [2BT]'                                         => [317, 157],
        'charge BTC si excédent APP1 sur T16 & T6 > T5 [1BT]'                                         => [317, 157],
        'charge BTC si excédent APP1 sur T16 & T6 > T5 [2BT]'                                         => [317, 157],
        'Décharge sur zone 1'                                                                          => [820, 413],
        'Décharge sur zone 1 [PC]'                                                                     => [762, 413],
        'V3V décharge zone 1'                                                                          => [868, 335],
        'V3V décharge zone 1 [PC]'                                                                     => [858, 376],
        'V3V décharge zone 1 [PISCINE]'                                                                => [825, 352],
        'Free Cooling Zone 1'                                                                          => [778, 449],
        'Free Cooling Zone 2'                                                                          => [804, 285],
        'Free Cooling Zone 3'                                                                          => [810, 192],
        'Free Cooling Zone 4'                                                                          => [692, 184],
        'Electrovanne Appoint 1 ou Flow Switch'                                                        => [485,  75],
        'V3V bypass appoint 1'                                                                         => [543, 154],
        'V3V retour bouclage sanitaire solaire'                                                        => [363, 320],
        'recharge nappes goethermiques sur T15 sur échangeur BTC'                                      => [326, 376],
        'recharge nappes goethermiques sur T15 sur serpentin BTC'                                      => [323, 408],
    ];

    foreach (['S10', 'S11'] as $output) {
        $val = resolve_option_key($ctx['option' . $output], $output, $ctx);

        // L'option Electrovanne Appoint 1 ou Flow Switch a son label de sortie dupliqué
        if ($val === 'Electrovanne Appoint 1 ou Flow Switch') {
            $ic->add_label($output, 485, 163);
        }

        if (isset($opt_mapping[$val])) {
            $ic->add_image('options/' . preg_replace('/[<>]/', 'x', $val));
            $ic->add_label($output, ...$opt_mapping[$val]);
        }
    }
}

function get_rdr_circ_rules(): array
{
    $rules = [];

    $mapping = [
        ["optionS10", "S10", "T15", "Aquastat différentiel avec circulateur si T5>T15 sur BTC"],
        ["optionS11", "S10", "T15", "Aquastat différentiel avec circulateur si T5>T15 sur BTC"],
        ["circulateurC1", "C1", "T11", "Rehaussement des retours sur circulateur"],
        ["circulateurC2", "C2", "T12", "Rehaussement des retours sur circulateur"],
        ["circulateurC3", "C3", "T13", "Rehaussement des retours sur circulateur"],
        ["circulateurC7", "C7", "T14", "Rehaussement des retours sur circulateur"]
    ];

    foreach ($mapping as $val) {
        $rules[] = new Rule(
            when: fn($ctx) => (
                $ctx[$val[0]] === $val[3] &&
                ! preg_match('/2/', $ctx['ballonTampon'])
            ),
            elements: [
                new Image(IMG_DIR . 'schema_hydro/options/Rehaussement des retours sur circulateur [1BT]'),
                new TextOverlay($val[1], [343, 314]),
                new TextOverlay($val[2], [345, 188])
            ]
        );

        $rules[] = new Rule(
            when: fn($ctx) => (
                $ctx[$val[0]] === $val[3] &&
                preg_match('/2/', $ctx['ballonTampon'])
            ),
            elements: [
                new Image(IMG_DIR . 'schema_hydro/options/Rehaussement des retours sur circulateur [2BT]'),
                new TextOverlay($val[1], [343, 314]),
                new TextOverlay($val[2], [345, 188])
            ]
        );
    }

    return $rules;
}


function get_rdr_v3v_rules(): array
{
    $rules = [];

    $entries = [
        ["circulateurC1", "C1", "T11", "Rehaussement des retours sur V3V"],
        ["circulateurC2", "C2", "T12", "Rehaussement des retours sur V3V"],
        ["circulateurC3", "C3", "T13", "Rehaussement des retours sur V3V"],
        ["circulateurC7", "C7", "T14", "Rehaussement des retours sur V3V"],
        ["optionS10", "S10", "T15", "Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC"],
        ["optionS11", "S11", "T15", "Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC"],
    ];

    // [bt_label, is_2bt, gd_label, is_gauche, label_coords, sonde_coords]
    $variants = [
        ["1BT", false, "gauche", true,  [322, 135], [357, 172]],
        ["1BT", false, "droite", false, [450, 135], [487, 172]],
        ["2BT", true,  "gauche", true,  [322, 135], [357, 172]],
        ["2BT", true,  "droite", false, [450, 135], [487, 172]],
    ];

    foreach ($entries as [$ctx_key, $circ_label, $sonde_label, $value]) {
        foreach ($variants as [$bt_label, $is_2bt, $gd_label, $is_gauche, $label_coords, $sonde_coords]) {
            $img_name = "Rehaussement des retours sur V3V [{$bt_label}-{$gd_label}]";
            $rules[] = new Rule(
                when: fn($ctx) => (
                    $ctx[$ctx_key] === $value &&
                    (bool) preg_match('/2/', $ctx['ballonTampon']) === $is_2bt &&
                    (bool) preg_match('/gauche/', $ctx['divers']) === $is_gauche
                ),
                elements: [
                    new Image(IMG_DIR . 'schema_hydro/options/' . $img_name),
                    new TextOverlay($circ_label, $label_coords),
                    new TextOverlay($sonde_label, $sonde_coords),
                ]
            );
        }
    }

    return $rules;
}

function get_ressources_from_ctx(array $ctx): array
{
    $mapping = [
        // Toujours présents
        "T7"  => true,
        "T8"  => true,
        "T9"  => true,

        // Ballon ECS
        "T3"  => $ctx['ballonECS'] !== 'Aucun',
        "T4"  => $ctx['ballonECS'] !== 'Aucun',
        "C4"  => $ctx['ballonECS'] !== 'Aucun',
        "C5"  => $ctx['ballonECS'] !== 'Aucun',

        // Ballon tampon
        "T5"  => $ctx['ballonTampon'] !== 'Aucun',
        "C6"  => $ctx['ballonTampon'] !== 'Aucun',

        // Champ capteur
        "T1"  => $ctx['champCapteur'] !== 'Aucun',
        "T2"  => $ctx['champCapteur'] !== 'Aucun',
        "T10" => (bool) preg_match('/2 champs|découplé|double circulateur/', $ctx['champCapteur']),

        // Circulateurs
        "C1"  => $ctx['circulateurC1'] !== 'Aucun',
        "T11" => $ctx['circulateurC1'] !== 'Aucun',
        "C2"  => $ctx['circulateurC2'] !== 'Aucun',
        "T12" => $ctx['circulateurC2'] !== 'Aucun',
        "C3"  => $ctx['circulateurC3'] !== 'Aucun',
        "T13" => $ctx['circulateurC3'] !== 'Aucun',
        "C7"  => $ctx['circulateurC7'] !== 'Aucun',
        "T14" => $ctx['circulateurC7'] !== 'Aucun' && !(bool) preg_match('/Appoint/', $ctx['circulateurC7']),

        // T6 : appoint sur C7 ou Piscine déportée T6
        "T6"  => (bool) preg_match('/Appoint/', $ctx['circulateurC7'])
               || $ctx['optionS10'] === 'Piscine déportée T6',

        // T15 : champCapteur T15 ou options S10 référençant T15
        "T15" => (bool) preg_match('/T15/', $ctx['champCapteur'])
               || (bool) preg_match('/T15/', $ctx['optionS10']),

        // T16 : champCapteur T16, raccordement T16, appoint bois T16, CESI S11 T16
        "T16" => (bool) preg_match('/T16/', $ctx['champCapteur'])
               || (bool) preg_match('/T16/', $ctx['raccordementHydraulique'])
               || (bool) preg_match('/T16/', $ctx['appoint1'])
               || $ctx['optionS11'] === 'CESI déportée sur T16',

        // Sorties S10 / S11
        "S10" => $ctx['optionS10'] !== 'Aucun',
        "S11" => $ctx['optionS11'] !== 'Aucun'
    ];

    return array_keys(array_filter($mapping));
}


function construct_table_of_equipments(array $ctx): array
{
    $equipment_mapping = [
        "C1" => "Circulateur chauffage zone 1",
        "C2" => "Circulateur chauffage zone 2",
        "C3" => "Circulateur chauffage zone 3",
        "C4" => "Circulateur ballon appoint",
        "C5" => "Circulateur ballon solaire",
        "C6" => "Circulateur ballon tampon",
        "C7" => "Circulateur appoint 2 / chauffage zone 4",
        "T1"  => "T° capteur chaud",
        "T2"  => "T° capteur froid",
        "T3"  => "T° bas de ballon / T° ballon solaire",
        "T4"  => "T° haut de ballon / T° ballon appoint",
        "T5"  => "T° ballon tampon",
        "T6"  => "T° appoint 2",
        "T7"  => "T° collecteur froid",
        "T8"  => "T° collecteur chaud",
        "T9"  => "T° extérieure",
        "T10" => "T° sonde d'option",
        "T11" => "T° ambiance zone 1",
        "T12" => "T° ambiance zone 2",
        "T13" => "T° ambiance zone 3",
        "T14" => "T° ambiance zone 4",
        "T15" => "T° sonde d'option",
        "T16" => "T° sonde d'option",
        "S10" => "Sortie disponible pour option 47/48",
        "S11" => "Sortie disponible pour option 49/50",

    ];

    $res = [];
    $resssources = get_ressources_from_ctx($ctx);

    foreach ($equipment_mapping as $ressource => $ressource_label) {
        if (in_array($ressource, $resssources)) {
            $res[] = [$ressource, $ressource_label];
        }
    }
    return $res;
}
