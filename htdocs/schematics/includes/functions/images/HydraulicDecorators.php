<?php

require_once __DIR__ . "/image_utils.php";
require_once __DIR__ . "/table/Label.php";
require_once __DIR__ . "/table/Cell.php";
require_once __DIR__ . "/table/Row.php";
require_once __DIR__ . "/table/Table.php";


abstract class HydraulicDecorator implements ImageModifier{
    protected array $ctx;
    protected string $base_path;

    public function __construct(array $ctx, string $base_path)
    {
        $this->ctx  = $ctx;
        $this->base_path = $base_path;
    }
}


class CapteurDecorator extends HydraulicDecorator{
    public function apply(GdImage $image): GdImage
    {
        $val = $this->ctx['champCapteur'];

        $mapping = [
            "capteurs.png"                    => preg_match('/capteurs/', $val),
            "casse pression.png"              => preg_match('/casse pression/', $val),
            "échangeur.png"                   => preg_match('/échangeur/', $val),
            "2 champs capteurs en.png"        => preg_match('/2 champs capteurs en/', $val),
            "2 champs capteurs découplés.png" => preg_match('/2 champs capteurs découplés/', $val),
            "V3V.png"                         => preg_match('/V3V/', $val),
            "double circulateur.png"          => preg_match('/double circulateur/', $val),
            "hide capteur cols.png"           => $val === 'Aucun' && $this->ctx['ballonTampon'] === 'Aucun',
        ];

        foreach ($mapping as $img_name => $cond) {
            if ($cond) {
                add_image($image, $this->base_path . $img_name);
            }
        }

        if (preg_match('/T15|T16/', $val, $matches)) {
            add_label_inplace($image, $matches[0], [94, 239]);
        }
        return $image;
    }
}


class BallonTamponDecorator extends HydraulicDecorator{
    public function apply(GdImage $image): GdImage
    {
        $bt     = $this->ctx['ballonTampon'];
        $is_ech = $this->ctx['EchangeurDansBT'] === "on";

        if ($bt === 'Aucun') return $image;

        $mapping = [
            "Ballon tampon [ech].png"                         => $bt === 'Ballon tampon' && $is_ech,
            "Ballon tampon.png"                               => $bt === 'Ballon tampon' && !$is_ech,
            "2 ballons tampons en série [ech].png"            => $bt === '2 ballons tampons en série' && $is_ech,
            "2 ballons tampons en série.png"                  => $bt === '2 ballons tampons en série' && !$is_ech,
            "3 ballons tampons en série.png"                  => $bt === '3 ballons tampons en série',
            "ballon tampon en eau chaude sanitaire [ech].png" => $bt === 'ballon tampon en eau chaude sanitaire',
            "raccord capteur.png"                             => $this->ctx['champCapteur'] !== 'Aucun',
            "resistance electrique.png"                       => $this->ctx['resistanceElectriqueBT'] === 'on',
        ];

        foreach ($mapping as $img_name => $cond) {
            if ($cond) {
                add_image($image, $this->base_path . $img_name);
            }
        }

        return $image;
    }
}


class AppointDecorator extends HydraulicDecorator{
    public function apply(GdImage $image): GdImage
    {
        $rdh = $this->ctx['raccordementHydraulique'];

        if ($rdh === 'Aucun') return $image;

        $path = $this->base_path . "Appoint/";
        add_image($image, $path . "raccord Appoint.png");

        $mapping = [
            "Appoint.png"                      => preg_match('/Appoint/i', $rdh),
            "En direct.png"                    => preg_match('/En direct/i', $rdh),
            "RDH_app1.png"                     => $this->ctx['RDH_appoint1'] === 'on',
            "RDH_app2.png"                     => $this->ctx['RDH_appoint2'] === 'on' && $this->ctx['locAppoint2'] === 'cascade',
            "casse pression.png"               => preg_match('/casse pression/i', $rdh),
            "échangeur.png"                    => preg_match('/échangeur/i', $rdh),
            "en cascade.png"                   => preg_match('/Appoint double en cascade/i', $rdh),
            "double sur.png"                   => preg_match('/Appoint double sur/i', $rdh),
            "appoint sur tampon.png"           => preg_match('/Appoint sur tampon avec échangeur/i', $rdh),
            "T16 simple.png"                   => preg_match('/simple T16/i', $rdh),
            "T16.png"                          => (bool) preg_match('/^(?!.*simple)(?!.*tampon).*T16/i', $rdh),
            "réchauffeur de boucle Droite.png" => preg_match('/réchauffeur de boucle/i', $rdh) && $this->ctx['Gauche_droite'] === 'Droite',
            "réchauffeur de boucle Gauche.png" => preg_match('/réchauffeur de boucle/i', $rdh) && $this->ctx['Gauche_droite'] === 'Gauche',
            "Aucun appoint deshu [droite].png" => $this->ctx['appoint1'] === 'Aucun' && $this->ctx['divers'] !== 'Aucun' && !preg_match('/gauche/', $this->ctx['divers']),
            "Aucun appoint deshu [gauche].png" => $this->ctx['appoint1'] === 'Aucun' && (bool) preg_match('/gauche/', $this->ctx['divers']),
        ];

        foreach ($mapping as $img_name => $cond) {
            if ($cond) {
                add_image($image, $path . $img_name);
            }
        }

        return $image;
    }
}


class BallonECSDecorator extends HydraulicDecorator{
    public function apply(GdImage $image): GdImage
    {
        $ecs = $this->ctx['ballonECS'];

        if ($ecs === 'Aucun') return $image;

        $mapping = [
            "$ecs.png"                   => true,
            "circulateur c5.png"         => $this->ctx['champCapteur'] !== 'Aucun' || $this->ctx['ballonTampon'] !== 'Aucun',
            "resistance electrique.png"  => $this->ctx['resistanceElectriqueBECS'] === 'on',
        ];

        foreach ($mapping as $img_name => $cond) {
            if ($cond) {
                add_image($image, $this->base_path . $img_name);
            }
        }

        return $image;
    }
}


class DiversDecorator extends HydraulicDecorator{
    public function apply(GdImage $image): GdImage
    {
        $divers = $this->ctx['divers'];

        $mapping = [
            "comptage energétique utile solaire D3.png"  => $this->ctx['D3'] === 'on',
            "comptage energétique utile appoint D5.png"  => $this->ctx['D5'] === 'on',
            "$divers.png"                                => $divers !== 'Aucun',
        ];

        foreach ($mapping as $img_name => $cond) {
            if ($cond) {
                add_image($image, $this->base_path . $img_name);
            }
        }

        return $image;
    }
}


class CirculateursDecorator extends HydraulicDecorator{

    private const CIRCULATEURS = ['circulateurC1', 'circulateurC2', 'circulateurC3', 'circulateurC7'];

    // Valeurs qui cachent le raccord de la zone (utilisé par hide_inactive_raccords)
    private const RACCORD_HIDE_VALUES = [
        'Aucun',
        'Rehaussement des retours sur V3V',
        'Rehaussement des retours sur circulateur',
    ];

    private const PILOTAGE_RAD_COORDS = [
        'circulateurC1' => [809, 345],
        'circulateurC2' => [809, 245],
        'circulateurC3' => [809, 145],
    ];

    private const SONDE_MAP = [
        'circulateurC1' => 'T11',
        'circulateurC2' => 'T12',
        'circulateurC3' => 'T13',
        'circulateurC7' => 'T14',
    ];

    public function apply(GdImage $image): GdImage
    {
        $this->hide_inactive_raccords($image);

        for ($i = 0; $i < count(self::CIRCULATEURS); $i++) {
            $circ = self::CIRCULATEURS[$i];
            $val  = $this->ctx[$circ];

            if ($val === 'Aucun') continue;

            if ($val === 'Rehaussement des retours sur circulateur') {
                $this->handle_rdr_circ($image, $circ);
                continue;
            }

            if ($val === 'Rehaussement des retours sur V3V') {
                $this->handle_rdr_v3v($image, $circ);
                continue;
            }

            if ($val === 'Idem S11') {
                $this->handle_idem_s11($image, $circ);
                continue;
            }

            if (preg_match('/Appoint/', $val)) {
                $this->handle_appoint_c7($image, $val);
                continue;
            }

            if ($this->is_pilotage_radiateur($val)) {
                $i += $this->handle_pilotage_radiateur($image, $circ, $i);
            }

            add_image($image, $this->base_path . "$circ/$val.png");
        }

        return $image;
    }

    /**
     * Cache les raccords des zones inactives en partant de C1.
     * S'arrête au premier circulateur actif.
     */
    private function hide_inactive_raccords(GdImage $image): void
    {
        foreach (self::CIRCULATEURS as $circ) {
            if (!in_array($this->ctx[$circ], self::RACCORD_HIDE_VALUES, true)) break;
            add_image($image, $this->base_path . "raccord/hide $circ.png");
        }
    }

    private function handle_rdr_circ(GdImage $image, string $circ): void
    {
        $bt = preg_match('/2/', $this->ctx['ballonTampon']) ? '2BT' : '1BT';
        add_image($image, $this->base_path . "options/Rehaussement des retours sur circulateur [$bt].png");
        add_label_inplace($image, preg_replace('/circulateur/', '', $circ), [343, 314]);
        add_label_inplace($image, self::SONDE_MAP[$circ], [345, 188]);
    }

    private function handle_rdr_v3v(GdImage $image, string $circ): void
    {
        $bt   = preg_match('/2/', $this->ctx['ballonTampon']) ? '2BT'    : '1BT';
        $side = preg_match('/gauche/', $this->ctx['divers'])  ? 'gauche' : 'droite';
        $label_coords = $side === 'gauche' ? [322, 135] : [450, 135];
        $sonde_coords = $side === 'gauche' ? [357, 172] : [487, 172];
        add_image($image, $this->base_path . "options/Rehaussement des retours sur V3V [$bt-$side].png");
        add_label_inplace($image, preg_replace('/circulateur/', '', $circ), $label_coords);
        add_label_inplace($image, self::SONDE_MAP[$circ], $sonde_coords);
    }

    
    private function handle_idem_s11(GdImage $image, string $circ): void
    {
        $circ_label = preg_replace('/circulateur/', '', $circ);
        add_image($image, $this->base_path . "champCapteur/Idem S11.png");
        add_label_inplace($image, $circ_label, [70, 280], 12);
    }

    /**
     * Appoint 2 sur C7 : l'image dépend du type d'appoint, du raccordement hydraulique
     * (RH_appoint2) et de la présence d'un RDH. Les variantes "bois" et "granulé"
     * partagent les mêmes images qu'un "Appoint" simple.
     */
    private function handle_appoint_c7(GdImage $image, string $val): void
    {
        $rdh       = $this->ctx['RDH_appoint2'] === 'on' ? ' avec RDH' : '';
        $base_name = preg_replace('/ bois| granulé/', '', $val);
        $img_name  = "$base_name {$this->ctx['RH_appoint2']}$rdh.png";

        add_image($image, $this->base_path . "circulateurC7/AppointC7/$img_name");
    }

    private function is_pilotage_radiateur(string $val): bool
    {
        return (bool) preg_match('/Radiateurs.*(échangeur|casse pression)/', $val);
    }

    /**
     * Quand une zone est un radiateur sur échangeur/casse pression,
     * les zones suivantes marquées "Idem" sont fusionnées visuellement :
     * on place un label sur les coords de la zone courante et on saute ces zones.
     *
     * @return int Nombre de zones à sauter dans la boucle principale.
     */
    private function handle_pilotage_radiateur(GdImage $image, string $circ, int $from): int
    {
        $label = null;
        $skip  = 0;

        for ($j = $from + 1; $j < count(self::CIRCULATEURS); $j++) {
            if (!preg_match('/Idem/', $this->ctx[self::CIRCULATEURS[$j]])) break;
            $label = preg_replace('/circulateur/', '', self::CIRCULATEURS[$j]);
            $skip++;
        }

        if ($label !== null) {
            add_label_inplace($image, $label, self::PILOTAGE_RAD_COORDS[$circ], 8);
        }

        return $skip;
    }
}


class OptionsDecorator extends HydraulicDecorator{

    public function apply(GdImage $image): GdImage
    {
        foreach (['S10', 'S11'] as $output) {
            $val = $this->ctx['option' . $output];
            if ($val === 'Aucun') continue;
            $this->handle($image, $val, $output);
        }

        return $image;
    }

    private function handle(GdImage $image, string $val, string $output): void
    {
        match($val) {
            'CESI déportée sur T15'     => $this->add($image, $val, $output, [ 50, 190]),
            'CESI déportée sur T16'     => $this->add($image, $val, $output, [ 50, 284]),
            'Piscine déportée T15'      => $this->add($image, $val, $output, [ 50, 190]),
            'Piscine déportée T6'       => $this->add($image, $val, $output, [ 50, 190]),

            "ON en mode excédent d'énergie l'été"
                => $this->on_exedent_ete($image, $output),

            'charge BTC si excédent APP1 sur T16 & T6 < T5',
            'charge BTC si excédent APP1 sur T16 & T6 > T5'
                => $this->charge_btc($image, $val, $output),

            'Décharge sur zone 1'       => $this->decharge($image, $output),
            'V3V décharge zone 1'       => $this->v3v_decharge($image, $output),

            'Free Cooling Zone 1'       => $this->add($image, $val, $output, [778, 449]),
            'Free Cooling Zone 2'       => $this->add($image, $val, $output, [804, 285]),
            'Free Cooling Zone 3'       => $this->add($image, $val, $output, [810, 192]),
            'Free Cooling Zone 4'       => $this->add($image, $val, $output, [692, 184]),

            'Electrovanne Appoint 1 ou Flow Switch'
                => $this->electrovanne($image, $output),

            'V3V bypass appoint 1'
                => $this->add($image, $val, $output, [543, 154]),
            'V3V retour bouclage sanitaire solaire'
                => $this->add($image, $val, $output, [363, 320]),
            'recharge nappes goethermiques sur T15 sur échangeur BTC'
                => $this->add($image, $val, $output, [326, 376]),
            'recharge nappes goethermiques sur T15 sur serpentin BTC'
                => $this->add($image, $val, $output, [323, 408]),

            'Aquastat différentiel avec circulateur si T5>T15 sur BTC'
                => $this->rdr_circ_option($image, $output),
            'Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC'
                => $this->rdr_v3v_option($image, $output),

            default => null,
        };
    }

    /** Cas simple : image dont le nom = valeur + label de sortie aux coords données. */
    private function add(GdImage $image, string $val, string $output, array $coords): void
    {
        add_image($image, $this->base_path . "$val.png");
        add_label_inplace($image, $output, $coords);
    }

    private function on_exedent_ete(GdImage $image, string $output): void
    {
        $coords = $output === 'S10' ? [50, 190] : [50, 284];
        add_image($image, $this->base_path . "ON en mode excédent d'énergie l'été [$output].png");
        add_label_inplace($image, $output, $coords);
    }

    private function charge_btc(GdImage $image, string $val, string $output): void
    {
        $nb_bt = preg_replace('/\D/', '', $this->ctx['ballonTampon']) ?: '1';
        // < et > sont remplacés par x dans les noms de fichiers (contrainte filesystem)
        $img   = preg_replace('/[<>]/', 'x', "$val [{$nb_bt}BT]");
        add_image($image, $this->base_path . "$img.png");
        add_label_inplace($image, $output, [317, 157]);
    }

    private function decharge(GdImage $image, string $output): void
    {
        $pc     = (bool) preg_match('/Plancher chauffant|PC/', $this->ctx['circulateurC1']);
        $suffix = $pc ? ' [PC]' : '';
        $coords = $pc ? [762, 413] : [820, 413];
        add_image($image, $this->base_path . "Décharge sur zone 1$suffix.png");
        add_label_inplace($image, $output, $coords);
    }

    private function v3v_decharge(GdImage $image, string $output): void
    {
        $c1 = $this->ctx['circulateurC1'];
        if (preg_match('/Plancher chauffant|PC/', $c1)) {
            add_image($image, $this->base_path . "V3V décharge zone 1 [PC].png");
            add_label_inplace($image, $output, [858, 376]);
        } elseif (preg_match('/Piscine/', $c1)) {
            add_image($image, $this->base_path . "V3V décharge zone 1 [PISCINE].png");
            add_label_inplace($image, $output, [825, 352]);
        } else {
            add_image($image, $this->base_path . "V3V décharge zone 1.png");
            add_label_inplace($image, $output, [868, 335]);
        }
    }

    private function electrovanne(GdImage $image, string $output): void
    {
        add_image($image, $this->base_path . "Electrovanne Appoint 1 ou Flow Switch.png");
        add_label_inplace($image, $output, [485,  75]);
        add_label_inplace($image, $output, [485, 163]); // label dupliqué à deux positions
    }

    private function rdr_circ_option(GdImage $image, string $output): void
    {
        $bt = preg_match('/2/', $this->ctx['ballonTampon']) ? '2BT' : '1BT';
        add_image($image, $this->base_path . "Rehaussement des retours sur circulateur [$bt].png");
        add_label_inplace($image, $output, [343, 314]);
        add_label_inplace($image, 'T15', [345, 188]);
    }

    private function rdr_v3v_option(GdImage $image, string $output): void
    {
        $bt   = preg_match('/2/', $this->ctx['ballonTampon']) ? '2BT'    : '1BT';
        $side = preg_match('/gauche/', $this->ctx['divers'])  ? 'gauche' : 'droite';
        $label_coords = $side === 'gauche' ? [322, 135] : [450, 135];
        $sonde_coords = $side === 'gauche' ? [357, 172] : [487, 172];
        add_image($image, $this->base_path . "Rehaussement des retours sur V3V [$bt-$side].png");
        add_label_inplace($image, $output, $label_coords);
        add_label_inplace($image, 'T15',   $sonde_coords);
    }
}


class AnnoteDecorator extends HydraulicDecorator{

    public function apply(GdImage $image): GdImage
    {
        $canvas = imagecreatetruecolor(891, 666);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopy($canvas, $image, 0, 40, 0, 0, imagesx($image), imagesy($image));

        $this->add_title($canvas);
        $this->add_footer($canvas);
        $this->add_option_labels($canvas);
        $this->add_description($canvas);
        $this->add_date($canvas);
        $this->add_affaire($canvas);
        $this->add_appoint_c7_legend($canvas);

        return $canvas;
    }

    private function add_title(GdImage $canvas): void
    {
        $type = $this->ctx['typeInstallation'];
        if (preg_match('/^SC/', $type)) {
            $title = "Schéma hydraulique |S|olis |C|onfort |SC|" . str_replace("SC", "", $type);
        } else {
            $title = "Schéma hydraulique $type";
        }
        add_title_inplace($canvas, $title, [250, 20]);
    }

    private function add_footer(GdImage $canvas): void
    {
        $footer = imagecreatefrompng($this->base_path . "footer.png");
        imagecopy($canvas, $footer, 8, 517, 0, 0, imagesx($footer), imagesy($footer));
    }

    private function add_option_labels(GdImage $canvas): void
    {
        add_label_inplace($canvas, "option S10 : " . $this->ctx['optionS10'], [433, 572]);
        add_label_inplace($canvas, "option S11 : " . $this->ctx['optionS11'], [433, 584]);
    }

    private function add_description(GdImage $canvas): void
    {
        add_paragraph_inplace($canvas, "Schéma hydraulique " . $this->ctx['description'], [433, 587], 350, 8);
    }

    private function add_date(GdImage $canvas): void
    {
        add_label_inplace($canvas, date("d/m/Y"), [710, 648]);
    }

    private function add_affaire(GdImage $canvas): void
    {
        $nom    = $this->ctx['nom_client'];
        $prenom = $this->ctx['prenom_client'];
        $affaire = ($nom !== '' || $prenom !== '')
            ? strtoupper($nom) . " " . strtoupper($prenom)
            : "non renseigné";
        add_label_inplace($canvas, "Affaire : $affaire", [433, 646]);
    }

    private function add_appoint_c7_legend(GdImage $canvas): void
    {
        if (preg_match('/Appoint/', $this->ctx['circulateurC7'])) {
            add_image($canvas, $this->base_path . "legend_appoint_C7.png");
        }
    }
}


class FullDecorator extends HydraulicDecorator{

    private const EQUIPMENT_MAP = [
        "C1"  => "Circulateur chauffage zone 1",
        "C2"  => "Circulateur chauffage zone 2",
        "C3"  => "Circulateur chauffage zone 3",
        "C4"  => "Circulateur ballon appoint",
        "C5"  => "Circulateur ballon solaire",
        "C6"  => "Circulateur ballon tampon",
        "C7"  => "Circulateur appoint 2 / chauffage zone 4",
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

    public function apply(GdImage $image): GdImage
    {
        $canvas = imagecreatetruecolor(1170, imagesy($image));
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopy($canvas, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));

        $this->add_legend($canvas);

        return $canvas;
    }

    private function add_legend(GdImage $canvas): void
    {
        $table = new Table();

        $title_cell = new Cell(new Label("Légende des équipements"));
        $title_cell->setAttribute(['centered_x' => true, 'centered_y' => true]);
        $title_row = new Row();
        $title_row->addCell($title_cell);
        $table->addRow($title_row);

        foreach ($this->get_equipment_rows() as [$key, $label]) {
            $row = new Row();
            $row->addCell(new Cell(new Label($key)));
            $row->addCell(new Cell(new Label($label)));
            $table->addRow($row);
        }

        $table->render($canvas, 880, 30);
    }

    private function get_equipment_rows(): array
    {
        $active = $this->get_active_resources();
        $rows   = [];
        foreach (self::EQUIPMENT_MAP as $key => $label) {
            if (in_array($key, $active, true)) {
                $rows[] = [$key, $label];
            }
        }
        return $rows;
    }

    private function get_active_resources(): array
    {
        $ctx = $this->ctx;
        $map = [
            "T7"  => true,
            "T8"  => true,
            "T9"  => true,
            "T3"  => $ctx['ballonECS'] !== 'Aucun',
            "T4"  => $ctx['ballonECS'] !== 'Aucun',
            "C4"  => $ctx['ballonECS'] !== 'Aucun',
            "C5"  => $ctx['ballonECS'] !== 'Aucun',
            "T5"  => $ctx['ballonTampon'] !== 'Aucun',
            "C6"  => $ctx['ballonTampon'] !== 'Aucun',
            "T1"  => $ctx['champCapteur'] !== 'Aucun',
            "T2"  => $ctx['champCapteur'] !== 'Aucun',
            "T10" => (bool) preg_match('/2 champs|découplé|double circulateur/', $ctx['champCapteur']),
            "C1"  => $ctx['circulateurC1'] !== 'Aucun',
            "T11" => $ctx['circulateurC1'] !== 'Aucun',
            "C2"  => $ctx['circulateurC2'] !== 'Aucun',
            "T12" => $ctx['circulateurC2'] !== 'Aucun',
            "C3"  => $ctx['circulateurC3'] !== 'Aucun',
            "T13" => $ctx['circulateurC3'] !== 'Aucun',
            "C7"  => $ctx['circulateurC7'] !== 'Aucun',
            "T14" => $ctx['circulateurC7'] !== 'Aucun' && !(bool) preg_match('/Appoint/', $ctx['circulateurC7']),
            "T6"  => (bool) preg_match('/Appoint/', $ctx['circulateurC7']) || $ctx['optionS10'] === 'Piscine déportée T6',
            "T15" => (bool) preg_match('/T15/', $ctx['champCapteur']) || (bool) preg_match('/T15/', $ctx['optionS10']),
            "T16" => (bool) preg_match('/T16/', $ctx['champCapteur'])
                  || (bool) preg_match('/T16/', $ctx['raccordementHydraulique'])
                  || (bool) preg_match('/T16/', $ctx['appoint1'])
                  || $ctx['optionS11'] === 'CESI déportée sur T16',
            "S10" => $ctx['optionS10'] !== 'Aucun',
            "S11" => $ctx['optionS11'] !== 'Aucun',
        ];
        return array_keys(array_filter($map));
    }
}


