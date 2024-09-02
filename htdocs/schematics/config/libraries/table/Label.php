<?php
class Label{
    private string $_string;
    private int $_color = 0x000000;
    private int $_size = 9;
    private string $_fontFile = APP_BASE_PATH . "config/client/Verdana.ttf";

    public function __construct(string $string){
        $this->_string = $string;
    }

    public function setAttribute(array $attributes){
        if (isset($attributes['fontFile'])) $this->_fontFile = $attributes['fontFile'];
        if (isset($attributes['color'])) $this->_color = $attributes['color'];
        if (isset($attributes['fontSize']))$this->_size = $attributes['fontSize'];
        
    }

    public function setMaxWidth(int $maxWidth){
        if ($this->getWidth() > $maxWidth +1){
            $this->_string = $this->wrapText($this->_string , $maxWidth);
        }
        
    }

    public function getWidth():int{
        $bbox = imagettfbbox($this->_size, 0, $this->_fontFile, $this->_string);
        return $bbox[2] - $bbox[0];
    }

    public function getHeight():int{
        $bbox = imagettfbbox($this->_size, 0, $this->_fontFile, $this->_string);
        return $bbox[1] - $bbox[7];
    }
    public function render(GdImage $image , int $x , int $y){
        $bbox = imagettfbbox($this->_size, 0, $this->_fontFile, $this->_string);
        //le - $this->_bbox[5] sert à positionner le label par le coin haut gauche
        imagettftext($image , $this->_size , 0 , $x , $y - $bbox[5] , $this->_color , $this->_fontFile , $this->_string);
    }

    private function wrapText(string $text, int $maxWidth):string {
        $wrappedText = '';
        $words = explode(' ', $text);
        $line = '';
        
        foreach ($words as $word) {
            $testLine = $line . ' ' . $word;
            $dimensions = imagettfbbox($this->_size, 0, $this->_fontFile, $testLine);
            $lineWidth = $dimensions[2] - $dimensions[0];
            
            if ($lineWidth > $maxWidth) {
                $wrappedText .= trim($line) . "\n";
                $line = $word;
            } else {
                $line = $testLine;
            }
        }
        $wrappedText .= trim($line);
        
        return $wrappedText;
    }
}
?>