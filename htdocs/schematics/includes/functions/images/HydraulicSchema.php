<?php
require_once __DIR__ . "/HydraulicResolvers.php";


interface Renderable{
    public function render(): GdImage;
}

class HydraulicSchema{

    public function __construct(
        private array $ctx,
        private string $base_path
    ){}

    public function brut(): Renderable{
        return new HydraulicDiagram($this->ctx, $this->base_path);
    }

    public function annote(): Renderable{
        return new DocumentFrame($this->brut(), $this->ctx, $this->base_path);
    }

    public function full(): Renderable{
        return new EquipmentLegend($this->annote(), $this->ctx);
    }

}


// Niveau 1 le diagram seul
class HydraulicDiagram implements Renderable {
    public function __construct(private array $ctx, private string $base_path){}


    public function render(): GdImage
    {
        $layers = (new HydraulicDiagramResolver())->resolve($this->ctx);
        $canvas = $this->create_canvas();
        (new LayerRenderer($this->base_path))->render_all($canvas, $layers);
        return $canvas;

    }

    private function create_canvas(): GdImage{
        $template = imagecreatefrompng($this->base_path . "template schema.png");
        $w = imagesx($template);
        $h = imagesy($template);
        $canvas = imagecreatetruecolor($w, $h);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopy($canvas, $template, 0, 0, 0, 0, $w, $h);
        return $canvas;
    }
}

// niveau 2 - cadre documentaire (titre, footer, client, date)
class DocumentFrame implements Renderable{
    public function __construct(
        private Renderable $inner,
        private array $ctx,
        private string $base_path
    ){}

    public function render(): GdImage
    {
        $inner  = $this->inner->render();
        $canvas = $this->expand_canva($inner);

        $this->add_title($canvas);
        $this->add_footer($canvas);
        $this->add_option_labels($canvas);
        $this->add_description($canvas);
        $this->add_date($canvas);
        $this->add_affaire($canvas);
        $this->add_appoint_c7_legend($canvas);

        return $canvas;
    }

    private function expand_canva(GdImage $inner): GdImage{
        $canvas = imagecreatetruecolor(891, 666);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopy($canvas, $inner, 0, 40, 0, 0, imagesx($inner), imagesy($inner));
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


// Niveau 3 - légende des équipements
class EquipmentLegend implements Renderable{
    public function __construct(
        private Renderable $inner,
        private array $ctx
    ){}

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

    public function render(): GdImage
    {
        $inner  = $this->inner->render();
        $canvas = $this->expand_canvas_right($inner);
        $this->add_legend($canvas);
        return $canvas;
    }

    private function expand_canvas_right(GdImage $inner): GdImage{
        $canvas = imagecreatetruecolor(1170, imagesy($inner));
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopy($canvas, $inner, 0, 0, 0, 0, imagesx($inner), imagesy($inner));
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

