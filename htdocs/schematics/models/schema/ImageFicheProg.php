<?php
require_once (APP_BASE_PATH.'config/libraries/table/Cell.php');
require_once (APP_BASE_PATH.'config/libraries/table/Row.php');
require_once (APP_BASE_PATH.'config/libraries/table/Table.php');
require_once (APP_BASE_PATH.'config/libraries/table/Label.php');
require_once (URL_FICHE_PROG);
require_once (URL_SCHEMA);


class ImageFicheProg extends Schema{
    private static int $WIDTH = 210 * 3;
    private static int $HEIGHT = 297 * 3;
    private static int $PADDING = 5;

    private FicheProg $_fiche_prog;

    public function __construct(array $formulaire , ?array $fiche_prog){
        $this->_orientation = "p";
        parent::__construct(self::$WIDTH, self::$HEIGHT);

        $this->_fiche_prog = new FicheProg($formulaire , $fiche_prog);
        $this->render();
    }   
    public function getName():string{
        return $this->_fiche_prog->getName();
    }

    public function render(){
        $table = new Table(self::$WIDTH - 2*self::$PADDING , Table::$MODE_EQUAL);
        
        $table->addRow($this->getRowHeader());
        foreach($this->_fiche_prog->getContent() as $row_content){
            $row = new Row();
            foreach($row_content as $cell_content){
                $cell = new Cell(new Label($cell_content));
                if (count($row_content) === 1){
                    $cell->setAttribute(array(
                        'background_color' => 0xadd8e6,
                        'centered_x' => true

                    ));
                }
                $row->addCell($cell);
            }
            $table->addRow($row);
        }
        $table->setAttribute(array(
            'fontSize' => 12,
            'padding' => 5
        ));
        $table->render($this->_image , self::$PADDING , self::$PADDING);
    }


    private function getRowHeader():Row{
        $header = new Row();
        $right_side = new Table();

        foreach($this->_fiche_prog->getHeader() as $row_content){
            $row = new Row();
            foreach($row_content as $cell_content){
                $cell = new Cell(new Label($cell_content));
                $row->addCell($cell);
            }
            $right_side->addRow($row);
        }

        $header->addCell(new Cell($right_side));
        $cell = new Cell(new Label($this->_fiche_prog->getTitle()));
        $cell->setAttribute(array(
            'centered_x' => true,
            'centered_y' => true
        ));
        $header->addCell($cell);
        $header->setAttribute(array(
            'border' => false
        ));
        return $header;
    }



}
?>