<?php

const VERDANA = APP_BASE_PATH . "config/client/Verdana.ttf";

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
    public function add_image(string $img_name): void
    {
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
function compose_images(array $paths): GDImage
{
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
function add_label_inplace(GDImage $image, string $text, array $coord, int $size = 1, array $color = [0,0,0]): void
{
    // Vérifier que $coord a bien 2 éléments
    if (count($coord) !== 2) {
        throw new InvalidArgumentException("Coord doit être un tableau [x, y]");
    }
    list($x, $y) = $coord;

    // Créer la couleur
    $col = imagecolorallocate($image, $color[0], $color[1], $color[2]);

    // Ajouter le texte (fonction GD standard)
    imagettftext($image, $size, 0, $x, $y, $col, VERDANA, $text);
}

?>