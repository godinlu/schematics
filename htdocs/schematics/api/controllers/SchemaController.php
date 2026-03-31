<?php
require_once ROOT_PATH . 'includes/functions/images/HydraulicSchema.php';
require_once ROOT_PATH . 'includes/functions/images/ImageFicheProg.php';
require_once ROOT_PATH . 'includes/functions/images/SchemaExe.php';
require_once ROOT_PATH . 'includes/functions/images/Etiquetage.php';
require_once ROOT_PATH . 'includes/libs/fpdf/fpdf.php';

class SchemaController {

    /**
     * Génère un schéma unique (PNG ou PDF).
     * Route : POST /api/schemas/{type}[?format=png|pdf]
     */
    public function generate(string $type): void {
        $input  = readJsonBody();
        $format = strtolower($_GET['format'] ?? 'png');

        $gd_image = match($type) {
            'schema_hydrau_brut'    => (new HydraulicSchema($input, IMG_DIR . 'schema_hydro/'))->brut()->render(),
            'schema_hydrau_annote'  => (new HydraulicSchema($input, IMG_DIR . 'schema_hydro/'))->annote()->render(),
            'schema_hydrau_complet' => (new HydraulicSchema($input, IMG_DIR . 'schema_hydro/'))->full()->render(),
            'schema_exe'            => (new SchemaExe($input))->get_img(),
            'etiquetage'            => (new Etiquetage($input))->get_img(),
            'fiche_prog'            => generate_fiche_prog_img($input),
            default                 => respond(400, ['error' => "Type de schéma inconnu : $type"]),
        };

        $this->outputImage($gd_image, $format, $type);
    }

    /**
     * Génère un rapport PDF complet (hydrau + exe + etiquetage + fiche prog).
     * Route : POST /api/schemas/report
     */
    public function report(): void {
        $input = readJsonBody();

        if (!isset($input['formulaire'], $input['fiche_prog'])) {
            respond(422, ['error' => 'Le corps doit contenir les clés "formulaire" et "fiche_prog"']);
        }

        $formulaire = $input['formulaire'];
        $fiche_prog = $input['fiche_prog'];

        $img_hydrau     = (new HydraulicSchema($formulaire, IMG_DIR . 'schema_hydro/'))->full()->render();
        $img_exe        = (new SchemaExe($formulaire))->get_img();
        $img_etiquetage = (new Etiquetage($formulaire))->get_img();
        $img_fiche_prog = generate_fiche_prog_img($fiche_prog);

        $pdf = new FPDF();
        add_img_to_pdf($img_hydrau, $pdf);
        add_img_to_pdf($img_exe, $pdf);
        add_img_to_pdf($img_etiquetage, $pdf);
        add_img_to_pdf($img_fiche_prog, $pdf);

        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="dossier.pdf"');
        echo $pdf->Output('S');
        exit;
    }

    private function outputImage($gd_image, string $format, string $name): void {
        switch ($format) {
            case 'png':
                header('Content-Type: image/png');
                imagepng($gd_image);
                exit;

            case 'pdf':
                $pdf = new FPDF();
                add_img_to_pdf($gd_image, $pdf);
                header('Content-Type: application/pdf');
                header('Content-Disposition: inline; filename="' . $name . '.pdf"');
                echo $pdf->Output('S');
                exit;

            default:
                respond(400, ['error' => "Format invalide : $format. Valeurs acceptées : png, pdf"]);
        }
    }
}
