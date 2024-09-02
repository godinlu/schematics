<?php
class Row{
    private array $_cells;

    public function __construct(){
        $this->_cells = array();
    }
    public function addCell(Cell $cell){
        $this->_cells[] = $cell;
    }
    public function setAttribute(array $attributes){
        foreach($this->_cells as $cell){
            $cell->setAttribute($attributes);
        }
    }

    /**
     * @return int[] cellsWidth
     */
    public function getCellsWidth():array{
        $cellWidth = array();
        foreach($this->_cells as $cell){
            $cellWidth[] = $cell->getWidth();
        }
        return $cellWidth;
    }
    public function getWidth():int{
        $width = 0;
        foreach($this->_cells as $cell){
            $width += $cell->getWidth();
        }
        return $width;
    }
    public function getHeight():int{
        //on commence la cellule qui à la hauteur la plus haute
        $height = 0;
        foreach ($this->_cells as $cell){
            if ($cell->getHeight() > $height) $height = $cell->getHeight();
        }
        return $height;
    }
    public function getNbCells():int{
        return count($this->_cells);
    }
    public function setCellsMaxWidth(array $cellsMaxWidth){
        foreach($this->_cells as $i => $cell){
            $cell->setMaxWidth( $cellsMaxWidth[$i]);
        }
    }

    public function render(GdImage $image, int $x , int $y , array $cells_width) {
        //on commence par calculer la hauteur de la lignes
        $height = $this->getHeight();
        //on assigne à tout les cellules cette hauteur et on les dessines
        foreach($this->_cells as $i => $cell){
            $cell->render($image , $x , $y ,$cells_width[$i] , $height);
            $x += $cells_width[$i];
        }
    }
}
?>