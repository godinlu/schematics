<?php
class Cell{
    private Label|Table $_content;
    private int $_padding = 3;
    private int $_background_color = 0xffffff;
    private int $_border_color = 0x000000;
    private bool $_centered_x = false;
    private bool $_centered_y = false;
    private bool $_border = true;

    public function __construct(Label|Table $content){
        $this->_content = $content;
    }
    public function setAttribute(array $attributes){
        if (isset($attributes['centered_x'])) $this->_centered_x = $attributes['centered_x'];
        if (isset($attributes['centered_y'])) $this->_centered_y = $attributes['centered_y'];
        if (isset($attributes['border'])) $this->_border = $attributes['border'];
        if (isset($attributes['border_color'])) $this->_border_color = $attributes['border_color'];
        if (isset($attributes['background_color'])) $this->_background_color = $attributes['background_color'];
        if (isset($attributes['padding'])) $this->_padding = $attributes['padding'];
        $this->_content->setAttribute($attributes);
    }

    /**
     * renvoie la largeur d'une cellule
     */
    public function getWidth(): int{
        return $this->_content->getWidth() +2*$this->_padding;
    }
    public function getHeight():int{
        return $this->_content->getHeight() + 2 * $this->_padding;
    }
    public function setMaxWidth(int $maxWidth){
        $this->_content->setMaxWidth($maxWidth - 2*$this->_padding);
    }

    public function render(GdImage $image, int $x , int $y, int $width , int $height){
        $x2 = $x + $width;
        $y2 = $y + $height;

        //Dessin de la cellule
        imagefilledrectangle($image , $x , $y , $x2 , $y2 , $this->_background_color);
        if ($this->_border){
            imagerectangle($image , $x , $y , $x2 , $y2 , $this->_border_color);
        }

        //positionnement du contenue de la cellule
        if ($this->_centered_x) $x = $x + ( $width - $this->_content->getWidth() )/2;
        else $x =  $x + $this->_padding;
        
        if ($this->_centered_y) $y = $y + ( $height - $this->_content->getHeight() )/2;
        else $y  = $y + $this->_padding;
        
        $this->_content->render($image , $x , $y);

    }

    
}
?>