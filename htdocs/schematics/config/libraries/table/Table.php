<?php

use Table as GlobalTable;

class Table{
    private ?int $_width;
    private array $_rows;
    private int $_mode;

    public static int $MODE_FLEX = 0;
    public static int $MODE_EQUAL = 1;

    public function __construct(?int $width = null , int $mode = 0){
        $this->_width = $width;
        $this->_rows = array();
        $this->_mode = $mode;

        if (!isset($width) && $mode === self::$MODE_EQUAL){
            throw new Exception("erreur il faut obligatoirement une taille pour le mode EQUAL");
        }
    }
    public function addRow(Row $row){
        $this->_rows[] = $row;
    }
    public function getHeight() : int {
        $height = 0;
        foreach($this->_rows as $row){
            $height += $row->getHeight();
        }
        return $height;
    }
    public function getWidth() : int {
        return array_sum($this->calculatedCellsWidth());
    }
    public function setMaxWidth(int $maxWidth){
        $cellsWidth = $this->calculatedCellsWidth();
        if ($this->_mode === self::$MODE_FLEX){
            $width = array_sum($cellsWidth);

            foreach($cellsWidth as &$cell_width){
                $cell_width = ($cell_width / $width) * $maxWidth;
            }
        }else if ($this->_mode === self::$MODE_EQUAL){
            foreach($cellsWidth as &$cell_width){
                $cell_width = $maxWidth / count($cellsWidth);
            }
        }

        foreach($this->_rows as $row){
            if ($row->getNbCells() === 1) $row->setCellsMaxWidth(array($maxWidth));
            else $row->setCellsMaxWidth($cellsWidth);
        }

    }

    public function setAttribute(array $attributes){
        foreach($this->_rows as $row){
            $row->setAttribute($attributes);
        }
    }
    /**
     * renvoie la largeur de chaque cellules du tableau
     * en fonction du mode choisi 
     * -le mode equal calcul la largeur des cellules en fonction de la width indiqué
     */
    private function calculatedCellsWidth():array{
        $nb_cells = $this->getNbCells();
        $cells_width = array();

        if ($this->_mode === self::$MODE_EQUAL){
            for ($i=0; $i < $nb_cells; $i++) { 
                $cells_width[] = $this->_width / $nb_cells;
            }
        }else{
            for ($i=0; $i < $nb_cells; $i++) { 
                $cells_width[] = 0;
            }

            foreach($this->_rows as $row){
                foreach($row->getCellsWidth() as $index => $width){
                    if ($width > $cells_width[$index]){
                        $cells_width[$index] = $width;
                    }
                }
            }
        }

        return $cells_width;

    }

    /**
     * cette fonction renvoie le max de cellules contenue dans les lignes
     */
    private function getNbCells():int{
        $maxNbCell = 0;
        foreach($this->_rows as $row){
            if ($row->getNbCells() > $maxNbCell) $maxNbCell = $row->getNbCells();
        }
        return $maxNbCell;
    }

    public function render(GdImage $image , int $x , int $y){
        if (isset($this->_width)) $this->setMaxWidth($this->_width);

        $cellsWidth = $this->calculatedCellsWidth();

        //ici si le tableau à une width prédéfinie et que le mode est en flex alors 
        //on recalcule les longueur de chaque cellule pour les augmenter proportionellement
        if (isset($this->_width) && $this->_mode === self::$MODE_FLEX){
            $width = array_sum($cellsWidth);
            foreach($cellsWidth as &$cell_width){
                $cell_width = ($cell_width / $width) * $this->_width;
            }
        }
        $width = array_sum($cellsWidth);
        

        foreach($this->_rows as $row){
            if ($row->getNbCells() === 1) $row->render($image ,$x , $y , array($width));
            else $row->render($image ,$x , $y , $cellsWidth);
            $y += $row->getHeight();
        }

        
    }
}
?>