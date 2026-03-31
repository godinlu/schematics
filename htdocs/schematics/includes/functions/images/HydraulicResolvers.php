<?php

require_once __DIR__ . "/image_utils.php";


class HydraulicDiagramResolver implements LayerResolver{
    private array $resolvers = [
        CapteurResolver::class,
        BallonTamponResolver::class,
        AppointResolver::class,
        BallonECSResolver::class,
        DiversResolver::class,
        CirculateursResolver::class,
        OptionsResolver::class
    ];


    public function resolve(array $ctx): array
    {

        return array_merge(...array_map(
            fn($class) => (new $class)->resolve($ctx),
            $this->resolvers
        ));
    }
}

class CapteurResolver implements LayerResolver{
    public function resolve(array $ctx): array
    {
        $layers =  [];
        $val = $ctx['champCapteur'];

        $mapping = [
            "capteurs.png"                    => preg_match('/capteurs/', $val),
            "casse pression.png"              => preg_match('/casse pression/', $val),
            "échangeur.png"                   => preg_match('/échangeur/', $val),
            "2 champs capteurs en.png"        => preg_match('/2 champs capteurs en/', $val),
            "2 champs capteurs découplés.png" => preg_match('/2 champs capteurs découplés/', $val),
            "V3V.png"                         => preg_match('/V3V/', $val),
            "double circulateur.png"          => preg_match('/double circulateur/', $val),
            "hide capteur cols.png"           => $val === 'Aucun' && $ctx['ballonTampon'] === 'Aucun',
        ];

        foreach ($mapping as $img_name => $cond) {
            if ($cond) {
                $layers[] = new ImageLayer("champCapteur/" . $img_name);
            }
        }

        if (preg_match('/T15|T16/', $val, $matches)) {
            $layers[] = new LabelLayer($matches[0], [94, 239]);
        }
        return $layers;
    }
}

class BallonTamponResolver implements LayerResolver{
    public function resolve(array $ctx): array
    {
        $bt     = $ctx['ballonTampon'];
        $is_ech = $ctx['EchangeurDansBT'] === 'on';

        if ($bt === 'Aucun') return [];

        $mapping = [
            "Ballon tampon [ech].png"                         => $bt === 'Ballon tampon' && $is_ech,
            "Ballon tampon.png"                               => $bt === 'Ballon tampon' && !$is_ech,
            "2 ballons tampons en série [ech].png"            => $bt === '2 ballons tampons en série' && $is_ech,
            "2 ballons tampons en série.png"                  => $bt === '2 ballons tampons en série' && !$is_ech,
            "3 ballons tampons en série.png"                  => $bt === '3 ballons tampons en série',
            "ballon tampon en eau chaude sanitaire [ech].png" => $bt === 'ballon tampon en eau chaude sanitaire',
            "raccord capteur.png"                             => $ctx['champCapteur'] !== 'Aucun',
            "resistance electrique.png"                       => $ctx['resistanceElectriqueBT'] === 'on',
        ];

        $layers = [];
        foreach ($mapping as $img_name => $cond) {
            if ($cond) $layers[] = new ImageLayer("ballonTampon/$img_name");
        }
        return $layers;
    }
}

class AppointResolver implements LayerResolver{
    public function resolve(array $ctx): array
    {
        $rdh = $ctx['raccordementHydraulique'];

        if ($rdh === 'Aucun') return [];

        $mapping = [
            "raccord Appoint.png"              => true,
            "Appoint.png"                      => (bool) preg_match('/Appoint/i', $rdh),
            "En direct.png"                    => (bool) preg_match('/En direct/i', $rdh),
            "RDH_app1.png"                     => $ctx['RDH_appoint1'] === 'on',
            "RDH_app2.png"                     => $ctx['RDH_appoint2'] === 'on' && $ctx['locAppoint2'] === 'cascade',
            "casse pression.png"               => (bool) preg_match('/casse pression/i', $rdh),
            "échangeur.png"                    => (bool) preg_match('/échangeur/i', $rdh),
            "en cascade.png"                   => (bool) preg_match('/Appoint double en cascade/i', $rdh),
            "double sur.png"                   => (bool) preg_match('/Appoint double sur/i', $rdh),
            "appoint sur tampon.png"           => (bool) preg_match('/Appoint sur tampon avec échangeur/i', $rdh),
            "T16 simple.png"                   => (bool) preg_match('/simple T16/i', $rdh),
            "T16.png"                          => (bool) preg_match('/^(?!.*simple)(?!.*tampon).*T16/i', $rdh),
            "réchauffeur de boucle Droite.png" => (bool) preg_match('/réchauffeur de boucle/i', $rdh) && $ctx['Gauche_droite'] === 'Droite',
            "réchauffeur de boucle Gauche.png" => (bool) preg_match('/réchauffeur de boucle/i', $rdh) && $ctx['Gauche_droite'] === 'Gauche',
            "Aucun appoint deshu [droite].png" => $ctx['appoint1'] === 'Aucun' && $ctx['divers'] !== 'Aucun' && !(bool) preg_match('/gauche/', $ctx['divers']),
            "Aucun appoint deshu [gauche].png" => $ctx['appoint1'] === 'Aucun' && (bool) preg_match('/gauche/', $ctx['divers']),
        ];

        $layers = [];
        foreach ($mapping as $img_name => $cond) {
            if ($cond) $layers[] = new ImageLayer("Appoint/$img_name");
        }
        return $layers;
    }
}

class BallonECSResolver implements LayerResolver{
    public function resolve(array $ctx): array
    {
        $ecs = $ctx['ballonECS'];

        if ($ecs === 'Aucun') return [];

        $mapping = [
            "$ecs.png"                  => true,
            "circulateur c5.png"        => $ctx['champCapteur'] !== 'Aucun' || $ctx['ballonTampon'] !== 'Aucun',
            "resistance electrique.png" => $ctx['resistanceElectriqueBECS'] === 'on',
        ];

        $layers = [];
        foreach ($mapping as $img_name => $cond) {
            if ($cond) $layers[] = new ImageLayer("ballonECS/$img_name");
        }
        return $layers;
    }
}

class DiversResolver implements LayerResolver{
    public function resolve(array $ctx): array
    {
        $divers  = $ctx['divers'];

        $mapping = [
            "comptage energétique utile solaire D3.png" => $ctx['D3'] === 'on',
            "comptage energétique utile appoint D5.png" => $ctx['D5'] === 'on',
            "$divers.png"                               => $divers !== 'Aucun',
        ];

        $layers = [];
        foreach ($mapping as $img_name => $cond) {
            if ($cond) $layers[] = new ImageLayer("divers/$img_name");
        }
        return $layers;
    }
}

class CirculateursResolver implements LayerResolver{

    private const CIRCULATEURS = ['circulateurC1', 'circulateurC2', 'circulateurC3', 'circulateurC7'];

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

    public function resolve(array $ctx): array
    {
        $layers = $this->hide_inactive_raccords($ctx);

        for ($i = 0; $i < count(self::CIRCULATEURS); $i++) {
            $circ = self::CIRCULATEURS[$i];
            $val  = $ctx[$circ];

            if ($val === 'Aucun') continue;

            if ($val === 'Rehaussement des retours sur circulateur') {
                $layers = array_merge($layers, $this->rdr_circ($ctx, $circ));
                continue;
            }

            if ($val === 'Rehaussement des retours sur V3V') {
                $layers = array_merge($layers, $this->rdr_v3v($ctx, $circ));
                continue;
            }

            if ($val === 'Idem S11') {
                $layers = array_merge($layers, $this->idem_s11($circ));
                continue;
            }

            if (preg_match('/Appoint/', $val)) {
                $layers = array_merge($layers, $this->appoint_c7($ctx, $val));
                continue;
            }

            if ($this->is_pilotage_radiateur($val)) {
                [$pilotage_layers, $skip] = $this->pilotage_radiateur($ctx, $circ, $i);
                $layers = array_merge($layers, $pilotage_layers);
                $i += $skip;
            }

            $layers[] = new ImageLayer("$circ/$val.png");
        }

        return $layers;
    }

    /** Cache les raccords des zones inactives en partant de C1, s'arrête au premier actif. */
    private function hide_inactive_raccords(array $ctx): array
    {
        $layers = [];
        foreach (self::CIRCULATEURS as $circ) {
            if (!in_array($ctx[$circ], self::RACCORD_HIDE_VALUES, true)) break;
            $layers[] = new ImageLayer("raccord/hide $circ.png");
        }
        return $layers;
    }

    private function rdr_circ(array $ctx, string $circ): array
    {
        $bt         = preg_match('/2/', $ctx['ballonTampon']) ? '2BT' : '1BT';
        $circ_label = preg_replace('/circulateur/', '', $circ);
        return [
            new ImageLayer("options/Rehaussement des retours sur circulateur [$bt].png"),
            new LabelLayer($circ_label, [343, 314]),
            new LabelLayer(self::SONDE_MAP[$circ], [345, 188]),
        ];
    }

    private function rdr_v3v(array $ctx, string $circ): array
    {
        $bt           = preg_match('/2/', $ctx['ballonTampon']) ? '2BT'    : '1BT';
        $side         = preg_match('/gauche/', $ctx['divers'])  ? 'gauche' : 'droite';
        $label_coords = $side === 'gauche' ? [322, 135] : [450, 135];
        $sonde_coords = $side === 'gauche' ? [357, 172] : [487, 172];
        $circ_label   = preg_replace('/circulateur/', '', $circ);
        return [
            new ImageLayer("options/Rehaussement des retours sur V3V [$bt-$side].png"),
            new LabelLayer($circ_label, $label_coords),
            new LabelLayer(self::SONDE_MAP[$circ], $sonde_coords),
        ];
    }

    private function idem_s11(string $circ): array
    {
        $circ_label = preg_replace('/circulateur/', '', $circ);
        return [
            new ImageLayer("champCapteur/Idem S11.png"),
            new LabelLayer($circ_label, [70, 280], 12),
        ];
    }

    /**
     * Appoint 2 sur C7 : les variantes "bois" et "granulé" partagent les mêmes images.
     */
    private function appoint_c7(array $ctx, string $val): array
    {
        $rdh       = $ctx['RDH_appoint2'] === 'on' ? ' avec RDH' : '';
        $base_name = preg_replace('/ bois| granulé/', '', $val);
        return [new ImageLayer("circulateurC7/AppointC7/$base_name {$ctx['RH_appoint2']}$rdh.png")];
    }

    private function is_pilotage_radiateur(string $val): bool
    {
        return (bool) preg_match('/Radiateurs.*(échangeur|casse pression)/', $val);
    }

    /**
     * Quand une zone est un radiateur sur échangeur/casse pression, les zones suivantes
     * marquées "Idem" sont fusionnées visuellement : on place un label et on saute ces zones.
     *
     * @return array{0: Layer[], 1: int} [layers à ajouter, nombre de zones à sauter]
     */
    private function pilotage_radiateur(array $ctx, string $circ, int $from): array
    {
        $label  = null;
        $skip   = 0;

        for ($j = $from + 1; $j < count(self::CIRCULATEURS); $j++) {
            if (!preg_match('/Idem/', $ctx[self::CIRCULATEURS[$j]])) break;
            $label = preg_replace('/circulateur/', '', self::CIRCULATEURS[$j]);
            $skip++;
        }

        $layers = $label !== null
            ? [new LabelLayer($label, self::PILOTAGE_RAD_COORDS[$circ], 8)]
            : [];

        return [$layers, $skip];
    }
}

class OptionsResolver implements LayerResolver{

    public function resolve(array $ctx): array
    {
        $layers = [];
        foreach (['S10', 'S11'] as $output) {
            $val = $ctx['option' . $output];
            if ($val === 'Aucun') continue;
            $layers = array_merge($layers, $this->handle($ctx, $val, $output));
        }
        return $layers;
    }

    private function handle(array $ctx, string $val, string $output): array
    {
        return match($val) {
            'CESI déportée sur T15'    => $this->simple($val, $output, [50,  190]),
            'CESI déportée sur T16'    => $this->simple($val, $output, [50,  284]),
            'Piscine déportée T15'     => $this->simple($val, $output, [50,  190]),
            'Piscine déportée T6'      => $this->simple($val, $output, [50,  190]),
            'Free Cooling Zone 1'      => $this->simple($val, $output, [778, 449]),
            'Free Cooling Zone 2'      => $this->simple($val, $output, [804, 285]),
            'Free Cooling Zone 3'      => $this->simple($val, $output, [810, 192]),
            'Free Cooling Zone 4'      => $this->simple($val, $output, [692, 184]),
            'V3V bypass appoint 1'     => $this->simple($val, $output, [543, 154]),
            'V3V retour bouclage sanitaire solaire'
                => $this->simple($val, $output, [363, 320]),
            'recharge nappes goethermiques sur T15 sur échangeur BTC'
                => $this->simple($val, $output, [326, 376]),
            'recharge nappes goethermiques sur T15 sur serpentin BTC'
                => $this->simple($val, $output, [323, 408]),

            "ON en mode excédent d'énergie l'été"
                => $this->on_exedent_ete($output),

            'charge BTC si excédent APP1 sur T16 & T6 < T5',
            'charge BTC si excédent APP1 sur T16 & T6 > T5'
                => $this->charge_btc($ctx, $val, $output),

            'Décharge sur zone 1'  => $this->decharge($ctx, $output),
            'V3V décharge zone 1'  => $this->v3v_decharge($ctx, $output),

            'Electrovanne Appoint 1 ou Flow Switch'
                => $this->electrovanne($output),

            'Aquastat différentiel avec circulateur si T5>T15 sur BTC'
                => $this->rdr_circ_option($ctx, $output),
            'Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC'
                => $this->rdr_v3v_option($ctx, $output),

            default => [],
        };
    }

    /** Cas simple : image dont le nom = valeur + label de sortie aux coords données. */
    private function simple(string $val, string $output, array $coords): array
    {
        return [
            new ImageLayer("options/$val.png"),
            new LabelLayer($output, $coords),
        ];
    }

    private function on_exedent_ete(string $output): array
    {
        $coords = $output === 'S10' ? [50, 190] : [50, 284];
        return [
            new ImageLayer("options/ON en mode excédent d'énergie l'été [$output].png"),
            new LabelLayer($output, $coords),
        ];
    }

    private function charge_btc(array $ctx, string $val, string $output): array
    {
        $nb_bt = preg_replace('/\D/', '', $ctx['ballonTampon']) ?: '1';
        $img   = preg_replace('/[<>]/', 'x', "$val [{$nb_bt}BT]");
        return [
            new ImageLayer("options/$img.png"),
            new LabelLayer($output, [317, 157]),
        ];
    }

    private function decharge(array $ctx, string $output): array
    {
        $pc     = (bool) preg_match('/Plancher chauffant|PC/', $ctx['circulateurC1']);
        $suffix = $pc ? ' [PC]' : '';
        $coords = $pc ? [762, 413] : [820, 413];
        return [
            new ImageLayer("options/Décharge sur zone 1$suffix.png"),
            new LabelLayer($output, $coords),
        ];
    }

    private function v3v_decharge(array $ctx, string $output): array
    {
        $c1 = $ctx['circulateurC1'];
        if (preg_match('/Plancher chauffant|PC/', $c1)) {
            return [new ImageLayer("options/V3V décharge zone 1 [PC].png"),      new LabelLayer($output, [858, 376])];
        }
        if (preg_match('/Piscine/', $c1)) {
            return [new ImageLayer("options/V3V décharge zone 1 [PISCINE].png"), new LabelLayer($output, [825, 352])];
        }
        return     [new ImageLayer("options/V3V décharge zone 1.png"),            new LabelLayer($output, [868, 335])];
    }

    private function electrovanne(string $output): array
    {
        return [
            new ImageLayer("options/Electrovanne Appoint 1 ou Flow Switch.png"),
            new LabelLayer($output, [485,  75]),
            new LabelLayer($output, [485, 163]), // label dupliqué à deux positions
        ];
    }

    private function rdr_circ_option(array $ctx, string $output): array
    {
        $bt = preg_match('/2/', $ctx['ballonTampon']) ? '2BT' : '1BT';
        return [
            new ImageLayer("options/Rehaussement des retours sur circulateur [$bt].png"),
            new LabelLayer($output, [343, 314]),
            new LabelLayer('T15',   [345, 188]),
        ];
    }

    private function rdr_v3v_option(array $ctx, string $output): array
    {
        $bt           = preg_match('/2/', $ctx['ballonTampon']) ? '2BT'    : '1BT';
        $side         = preg_match('/gauche/', $ctx['divers'])  ? 'gauche' : 'droite';
        $label_coords = $side === 'gauche' ? [322, 135] : [450, 135];
        $sonde_coords = $side === 'gauche' ? [357, 172] : [487, 172];
        return [
            new ImageLayer("options/Rehaussement des retours sur V3V [$bt-$side].png"),
            new LabelLayer($output, $label_coords),
            new LabelLayer('T15',   $sonde_coords),
        ];
    }
}



