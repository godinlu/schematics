<?php
abstract class Schema{
    protected GdImage $_image;
    private static string $_verdana = APP_BASE_PATH."config/client/Verdana.ttf";
    protected string $_pathToImg = APP_BASE_PATH."public/img/";
    protected array $_offset = [0 , 0];
    protected string $_orientation = 'l';    //orientation du schéma lors d'un téléchargement en pdf (landscape, portrait)

    protected function __construct(int $width, int $heigth){
        $this->_image = imagecreatetruecolor($width,$heigth);
        $whiteColor = imagecolorallocate($this->_image, 255, 255, 255);
        imagefill($this->_image,0 , 0 , $whiteColor);

    }
    abstract public function getName();

    protected function addImage(string $pathImage, array $coord) {
        $img_name = $this->_pathToImg . $pathImage . '.png';

        $imageAjoutee = imagecreatefrompng($img_name);
        if (!$imageAjoutee){
            throw new Exception("Image " . $img_name . " introuvable");
        }
        $largeurAjoutee = imagesx($imageAjoutee);
        $hauteurAjoutee = imagesy($imageAjoutee);
        imagecopy($this->_image, $imageAjoutee, $this->getX($coord), $this->getY($coord), 0, 0, $largeurAjoutee, $hauteurAjoutee);
        imagedestroy($imageAjoutee);
    }

    protected function addLabel(string $text, array $coord, int $size = 9, array $color = [0,0,0]){
        $color = imagecolorallocate($this->_image, $color[0], $color[1], $color[2]);
        imagettftext($this->_image, $size, 0, $this->getX($coord), $this->getY($coord), $color, self::$_verdana, $text);
    }
    protected function addParagraphe(string $text, array $coord, int $maxWidth, int $size = 9, array $color = [0, 0, 0]){
        $lines = explode("\n", wordwrap($text, $maxWidth, "\n"));
        $color = imagecolorallocate($this->_image, $color[0], $color[1], $color[2]);

        #ceci permet d'adapter légèrement la taille du text si il est trop grand 
        if (count($lines) > 3){
            $size-=1.6;
            $lines = explode("\n", wordwrap($text, $maxWidth * 1.2, "\n"));
        }

        $y = $this->getY($coord);
        foreach ($lines as $line) {
            imagettftext($this->_image, $size, 0, $this->getX($coord), $y, $color, self::$_verdana, $line);
            $y += $size + 3; // Espacement entre les lignes (ajustez selon vos besoins)
        }
    }
    protected function addTitle(
        string $text , 
        array $coord,
        int $size = 15,
        array $default_color = [0, 0 , 0],
        array $color_in = [246, 196, 55],
        string $separator = '|'
        ){
            $space = 0 ; $color = $default_color;
            $title = explode($separator , $text);
            foreach($title as $label){
                $pos = array( $coord[0] + $space , $coord[1]);
                $this->addLabel($label , $pos , $size , $color);

                //calcul de la largeur du texte que l'on vient d'ajouter
                $bbox = imagettfbbox($size , 0 , self::$_verdana , $label);
                $space += $bbox[2] - $bbox[0] + 1;

                //switch de la couleur
                $color = ($color === $default_color)? $color_in : $default_color;

            }

    }
    protected function addTable(
        array $table,
        array $coord,
        string|null $title = null,
        int $padding = 5,
        int $font_size = 9,
        array $font_color = [0,0,0]
        ){
        $max_width = $this->maxWidthTable($table , $padding , $font_size);

        $bbox = imagettfbbox($font_size , 0 , self::$_verdana , "TEXT");
        $max_height = $bbox[1] - $bbox[7] + 2*$padding;

        $cursor = [$coord[0] , $coord[1]];  //copie de $coord


        if (isset($title)){
            $this->addCell($title , $cursor , array_sum($max_width) , $max_height , $padding , true , $font_size, $font_color);
            $cursor[1] += $max_height;
        }

        foreach($table as $i => $row){
            $cursor[0] = $coord[0];
            foreach($row as $j => $cell_content){
                $this->addCell(
                    $cell_content,
                    $cursor,
                    $max_width[$j],
                    $max_height, $padding, false, $font_size, $font_color);
                    $cursor[0] += $max_width[$j];
            }
            $cursor[1] += $max_height;
        }
        

    }

    protected function addCell(
        string $text,
        array $coord,
        int $cell_width,
        int $cell_height,
        int $padding_right = 5,
        bool $text_centered = false,
        int $font_size = 9,
        array $font_color = [0,0,0]
        ){
        $bbox = imagettfbbox($font_size , 0 , self::$_verdana , $text);
        $textWidth = $bbox[2] - $bbox[0];
        $textHeight = $bbox[1] - $bbox[7];
        $color = imagecolorallocate($this->_image, $font_color[0], $font_color[1], $font_color[2]);

        imagerectangle($this->_image , $this->getX($coord) , $this->getY($coord) , $this->getX($coord) + $cell_width , $this->getY($coord) + $cell_height , $color);

        if ($text_centered){
            $x_label = $this->getX($coord) + (($cell_width - $textWidth) / 2);
        }else{
            $x_label = $this->getX($coord) + $padding_right;
        }
         $y_label = $this->getY($coord) + (($cell_height - $textHeight) / 2) + $textHeight;

        $this->addLabel( $text, [$x_label , $y_label] , $font_size , $font_color);
    }

    private function maxWidthTable(array $table, int $padding, int $font_size):array{
        $max_width = array();
        //parcours en colone
        for ($j=0; $j < count($table[0]); $j++) { 
            $max_width[$j] = 0;
            for ($i=0; $i < count($table) ; $i++) { 
                $bbox = imagettfbbox($font_size , 0 , self::$_verdana , $table[$i][$j]);
                $textWidth = $bbox[2] - $bbox[0]; 
                $width = $textWidth + 2*$padding;
                if ($width > $max_width[$j]){
                    $max_width[$j] = $width;
                }
            }
        }
        return $max_width;
    }

    public function show() {
        header('Content-Type: image/png');
        header('Content-Disposition: attachment; filename="' . $this->getName().'.png' . '"');
        imagepng($this->_image);
        imagedestroy($this->_image);
    }

    public function saveAt(string $file_path) {
        imagepng($this->_image , $file_path);
        imagedestroy($this->_image);
    }
    public function getWidth() : int {
        return imagesx($this->_image);
    }
    public function getHeight() : int{
        return imagesy($this->_image);
    }
    public function getOrientation() : string{
        return $this->_orientation;
    }

    public function addToPDF(FPDF &$pdf , string $name = "schema.png"){
        $this->saveAt($name);
        $pdf->AddPage($this->_orientation);
        // Récupère les dimensions du PDF
        $pdfWidth = $pdf->GetPageWidth();
        $pdfHeight = $pdf->GetPageHeight();

        $imageWidth = $pdfWidth; // Largeur de l'image égale à la largeur du PDF
        $imageHeight = $imageWidth * ($this->getHeight() / $this->getWidth()); // Hauteur calculée en conservant les proportions

        // Ajustement de la taille de l'image pour correspondre à la hauteur du PDF
        if ($imageHeight > $pdfHeight) {
            $imageHeight = $pdfHeight;
            $imageWidth = ($pdfHeight / $this->getHeight()) * $this->getWidth();
        }

        // Calcule les coordonnées pour centrer l'image horizontalement et verticalement
        $x = ($pdfWidth - $imageWidth) / 2;
        $y = ($pdfHeight - $imageHeight) / 2;

        // Ajout de l'image au PDF
        $pdf->Image($name, $x, $y, $imageWidth, $imageHeight);

        //on supprime toute les images 
        if (file_exists($name)){
            unlink($name);
        }
    }
    private function getX(array $coord):int{
        return (int) $coord[0] + $this->_offset[0];
    }
    private function getY(array $coord):int{
        return (int) $coord[1] + $this->_offset[1];
    }

    /**
     * Dessine une flèche d'un point A à un point B sur une image GD avec une couleur spécifique.
     * @param resource $image L'image GD sur laquelle dessiner la flèche
     * @param int[] $point_a Les coordonnées du point de départ de la flèche
     * @param int[] $point_b Les coordonnées du point d'arrivée de la flèche
     * @param int $color La couleur de la flèche au format RGB
     */
    protected function drawArrow(
        array $point_a, 
        array $point_b, 
        int $color = 0x000000,
        int $arrow_width = 3, 
        int $arrow_length = 6,
        ) {
            $color = imagecolorallocate($this->_image, ($color >> 16) & 0xFF, ($color >> 8) & 0xFF, $color & 0xFF);
            $point_a = [$this->getX($point_a), $this->getY($point_a)];
            $point_b = [$this->getX($point_b), $this->getY($point_b)];
        
            // Dessine une ligne du point A au point B avec une épaisseur de trait réduite
            imagesetthickness($this->_image, $arrow_width);
            imageline($this->_image, $point_a[0], $point_a[1], $point_b[0], $point_b[1], $color);
        
            // Calcul des coordonnées des points pour la tête de la flèche en prenant en compte l'épaisseur du trait
            $angle = atan2($point_b[1] - $point_a[1], $point_b[0] - $point_a[0]);
            $arrow_length = $arrow_length + $arrow_width;
        
            $arrow_point1 = [
                $point_b[0] - $arrow_length * cos($angle + M_PI / 6),
                $point_b[1] - $arrow_length * sin($angle + M_PI / 6)
            ];
        
            $arrow_point2 = [
                $point_b[0] - $arrow_length * cos($angle - M_PI / 6),
                $point_b[1] - $arrow_length * sin($angle - M_PI / 6)
            ];
        
            // Dessine la tête de la flèche avec l'épaisseur du trait originale
            imagesetthickness($this->_image, $arrow_width);
            imagefilledpolygon($this->_image, [$point_b[0], $point_b[1], $arrow_point1[0], $arrow_point1[1], $arrow_point2[0], $arrow_point2[1]], $color);
    }

    

}

?>