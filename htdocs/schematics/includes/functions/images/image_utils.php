<?php

const VERDANA = __DIR__ . "/../../../assets/fonts/Verdana.ttf";

class ImageComposer{
    /**
     * @var array List of PNG image paths to compose
     */
    private array $image_paths = [];

    /**
     * @var array List of labels to add
     * Each label: [
     *     'text' => string,
     *     'x' => int,
     *     'y' => int,
     *     'size' => int,
     *     'color' => [R, G, B]
     * ]
     */
    private array $labels = [];

    private string $base_path;

    public function __construct(string $base_path) {
        $this->base_path = $base_path;
    }

    /**
     * Add an image path to the composition stack.
     *
     * @param string $path Path to a PNG image
     * @return void
     */
    public function add_image(string $img_name): void{
        if (pathinfo($img_name, PATHINFO_EXTENSION) === ''){
            $img_name .= '.png';
        }
        $img_path = $this->base_path . $img_name;
       
        $this->image_paths[] = $img_path;
    }

    /**
     * Add a label to be rendered on the final image.
     *
     * @param string $text Text to display
     * @param int $x X coordinate
     * @param int $y Y coordinate
     * @param int $size GD font size (1–5)
     * @param array $color RGB color [R, G, B]
     * @return void
     */
    public function add_label(
        string $text,
        int $x,
        int $y,
        int $size = 9,
        array $color = [0, 0, 0]
    ): void {
        $this->labels[] = [
            'text' => $text,
            'x' => $x,
            'y' => $y,
            'size' => $size,
            'color' => $color
        ];
    }

    /**
     * Compose all images and apply labels.
     *
     * @return GDImage The final composed GD image
     */
    public function render(): GDImage{
        // 1. Compose all image layers
        $image = compose_images($this->image_paths);

        // 2. Apply all labels
        foreach ($this->labels as $label) {
            add_label_inplace(
                $image,
                $label['text'],
                [$label['x'], $label['y']],
                $label['size'],
                $label['color']
            );
        }

        return $image;
    }
}

/**
 * Superpose une liste d'images PNG et retourne l'image finale GD
 *
 * @param array $paths Liste de chemins vers les images PNG (toutes de même taille)
 * @return GDImage L'image finale superposée
 */
function compose_images(array $paths): GDImage{
    if (empty($paths)) {
        throw new InvalidArgumentException("La liste des images est vide.");
    }

    // Charger la première image
    $first = imagecreatefrompng($paths[0]);

    // créer la base avec un fond blanc de la taille de la première image
    $base = imagecreatetruecolor(imagesx($first), imagesy($first));
    imagefill($base, 0, 0, imagecolorallocate($base, 255, 255, 255));

    // Boucler sur les autres images
    foreach ($paths as $path) {
        $layer = imagecreatefrompng($path);
        imagesavealpha($layer, true);
        imagealphablending($layer, true);

        // Copier le calque sur l'image de base
        imagecopy(
            $base,
            $layer,
            0, 0,             // position sur la base
            0, 0,             // position sur le calque
            imagesx($layer),
            imagesy($layer)
        );
    }

    return $base;
}

/**
 * Ajoute un texte directement sur une image GD
 *
 * @param GDImage $image      L'image GD sur laquelle écrire
 * @param string  $text       Texte à ajouter
 * @param array   $coord      Coordonnées [x, y] du texte
 * @param int     $size       Taille du texte (1 à 5 pour imagestring)
 * @param array   $color      Couleur [R,G,B], par défaut noir
 * @return void
 */
function add_label_inplace(GDImage $image, string $text, array $coord, int $size = 9, array $color = [0,0,0]): void{
    // Vérifier que $coord a bien 2 éléments
    if (count($coord) !== 2) {
        throw new InvalidArgumentException("Coord doit être un tableau [x, y]");
    }
    list($x, $y) = $coord;

    // Créer la couleur
    $col = imagecolorallocate($image, $color[0], $color[1], $color[2]);

    // Ajouter le texte (fonction GD standard)
    imagettftext($image, $size, 0, (int) $x, (int)$y, $col, VERDANA, $text);
}


/**
 * Ajoute un titre sur une image GD, avec possibilité de changer de couleur entre les mots séparés
 *
 * @param GDImage $image          L'image GD sur laquelle écrire
 * @param string  $text           Le texte à ajouter, séparé par un séparateur
 * @param array   $coord          Coordonnées [x, y] du point de départ
 * @param int     $size           Taille du texte
 * @param array   $default_color  Couleur par défaut [R,G,B]
 * @param array   $color_in       Couleur alternative [R,G,B]
 * @param string  $separator      Séparateur pour découper le texte
 * @return void
 */
function add_title_inplace(
    GDImage $image,
    string $text,
    array $coord,
    int $size = 15,
    array $default_color = [0, 0, 0],
    array $color_in = [246, 196, 55],
    string $separator = '|'
): void {
    $space = 0;
    $color = $default_color;

    // Séparer le texte selon le séparateur
    $titleParts = explode($separator, $text);

    foreach ($titleParts as $label) {
        // Calculer la position de ce label
        $pos = [$coord[0] + $space, $coord[1]];

        // Ajouter le texte sur l'image
        add_label_inplace($image, $label, $pos, $size, $color);

        // Calcul de la largeur du texte ajouté pour décaler le suivant
        $bbox = imagettfbbox($size, 0, VERDANA, $label);
        $space += $bbox[2] - $bbox[0] + 1;

        // Alterner la couleur
        $color = ($color === $default_color) ? $color_in : $default_color;
    }
}


/**
 * Wrap text to a maximum pixel width using imagettfbbox.
 *
 * @param string $text        Text to wrap
 * @param float  $fontSize    Font size
 * @param string $fontFile    Path to TTF font file
 * @param int    $maxWidthPx  Maximum width in pixels
 * @return array              Array of wrapped lines
 */
function wrap_text_to_width(string $text, float $fontSize, string $fontFile, int $maxWidthPx): array{
    $words = explode(' ', $text);
    $lines = [];
    $currentLine = '';

    foreach ($words as $word) {
        $testLine = $currentLine === '' ? $word : $currentLine . ' ' . $word;
        $box = imagettfbbox($fontSize, 0, $fontFile, $testLine);
        $lineWidth = $box[2] - $box[0];

        if ($lineWidth > $maxWidthPx) {
            if ($currentLine !== '') {
                $lines[] = $currentLine;
            }
            $currentLine = $word;
        } else {
            $currentLine = $testLine;
        }
    }

    if ($currentLine !== '') {
        $lines[] = $currentLine;
    }

    return $lines;
}

/**
 * Draw a wrapped paragraph inside a maximum width (in pixels).
 *
 * - Real pixel-based wrapping using imagettfbbox
 * - Optional max line limit with ellipsis
 * - Automatic minimal font size protection
 *
 * @param GDImage $image       Target GD image
 * @param string  $text        Text to render (UTF-8)
 * @param array   $coord       Base coordinates [x, y]
 * @param int     $maxWidthPx  Maximum width in pixels
 * @param float   $size        Font size
 * @param array   $colorRGB    RGB color [R, G, B]
 * @param int     $maxLines    Maximum allowed lines
 * @param string  $fontFile    Path to TTF font
 * @return void
 */
function add_paragraph_inplace(
    GDImage $image,
    string $text,
    array $coord,
    int $maxWidthPx,
    float $size = 9.0,
    array $colorRGB = [0, 0, 0],
    int $maxLines = 3,
    string $fontFile = VERDANA
): void {

    if (trim($text) === '') {
        return;
    }

    if (count($coord) !== 2) {
        throw new InvalidArgumentException("Coord must be [x, y]");
    }

    [$x, $y] = $coord;

    $minFontSize = 7;
    $lineSpacing = 3;

    $color = imagecolorallocate(
        $image,
        $colorRGB[0],
        $colorRGB[1],
        $colorRGB[2]
    );

    // Normalize whitespace
    $text = trim(preg_replace('/\s+/', ' ', $text));

    $lines = wrap_text_to_width($text, $size, $fontFile, $maxWidthPx);

    // Reduce font size once if too many lines
    if (count($lines) > $maxLines && $size > $minFontSize) {
        $size -= 1.5;
        $lines = wrap_text_to_width($text, $size, $fontFile, $maxWidthPx);
    }

    // Hard limit + ellipsis
    if (count($lines) > $maxLines) {
        $lines = array_slice($lines, 0, $maxLines);
        $lastIndex = $maxLines - 1;
        $lines[$lastIndex] = rtrim($lines[$lastIndex], '. ') . '…';
    }

    foreach ($lines as $line) {

        $box = imagettfbbox($size, 0, $fontFile, $line);
        $textHeight = abs($box[7] - $box[1]);

        imagettftext(
            $image,
            $size,
            0,
            $x,
            $y + $textHeight, // proper baseline alignment
            $color,
            $fontFile,
            $line
        );

        $y += $textHeight + $lineSpacing;
    }
}

/**
 * Adds a GDImage to an FPDF page, scaling it proportionally,
 * centering it inside a printable area defined by margins.
 *
 * This function converts a GDImage to a temporary PNG file,
 * computes the proper size to fit within the page margins
 * while maintaining aspect ratio, and centers the image.
 * The temporary file is automatically deleted after use.
 *
 * @param GdImage $img        The GD image resource to add to the PDF.
 * @param FPDF    &$pdf       An instance of FPDF where the image will be added.
 * @param float   $margin     Margin size in mm (applied on all sides).
 *
 * @return void
 */
function add_img_to_pdf(GdImage $img, FPDF &$pdf, float $margin = 10.0)
{
    // Determine best orientation based on image ratio
    $orientation = (imagesx($img) > imagesy($img)) ? "l" : "p";

    // Convert the GDImage into a temporary PNG file
    $tmpfile = tempnam(sys_get_temp_dir(), 'schema') . '.jpeg';
    imagejpeg($img, $tmpfile, 85);

    // Add a page with the correct orientation
    $pdf->AddPage($orientation, 'A4');

    // Get full page dimensions
    $pdf_width = $pdf->GetPageWidth();
    $pdf_height = $pdf->GetPageHeight();

    // Compute printable area dimensions (inside margins)
    $available_width = $pdf_width - (2 * $margin);
    $available_height = $pdf_height - (2 * $margin);

    // Safety check: avoid negative printable area
    if ($available_width <= 0 || $available_height <= 0) {
        unlink($tmpfile);
        throw new Exception("Margin too large for the selected page size.");
    }

    // Get image original dimensions
    $img_original_width = imagesx($img);
    $img_original_height = imagesy($img);

    // Scale image to fit within available width
    $img_width = $available_width;
    $img_height = $img_width * ($img_original_height / $img_original_width);

    // Adjust if height exceeds available height
    if ($img_height > $available_height) {
        $img_height = $available_height;
        $img_width = $img_height * ($img_original_width / $img_original_height);
    }

    // Compute centered coordinates inside margins
    $x = $margin + (($available_width - $img_width) / 2);
    $y = $margin + (($available_height - $img_height) / 2);

    // Add image to PDF
    $pdf->Image($tmpfile, $x, $y, $img_width, $img_height);

    // Clean up temporary file
    if (file_exists($tmpfile)) {
        unlink($tmpfile);
    }
}
?>