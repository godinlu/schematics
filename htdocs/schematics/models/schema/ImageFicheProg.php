<?php
require_once (APP_BASE_PATH.'config/libraries/table/Cell.php');
require_once (APP_BASE_PATH.'config/libraries/table/Row.php');
require_once (APP_BASE_PATH.'config/libraries/table/Table.php');
require_once (APP_BASE_PATH.'config/libraries/table/Label.php');
require_once("image_utils.php");
require_once (URL_FICHE_PROG);
require_once (URL_SCHEMA);


function generate_fiche_prog_img(array $data, array $size = [210*5, 297*5]): GdImage{
    // create the new img in white 
    $img = imagecreatetruecolor($size[0], $size[1]);
    imagefill($img, 0, 0, imagecolorallocate($img, 255, 255, 255));

    // create a table instance
    $table = new Table($size[0]-1, Table::$MODE_EQUAL);


    // add the first header row
    $table->addRow(_get_row_header($data));

    // add all row for the body
    foreach ($data["body"] as $data_row) {
        $row = new Row();
        if (count($data_row) === 1){
            $cell = new Cell(new Label($data_row[0]));
            $cell->setAttribute(array(
                'background_color' => 0xadd8e6,
                'centered_x' => true
            ));
            $row->addCell($cell);
        }else{
            $row->addCell(new Cell(new Label($data_row[0])));
            $row->addCell(new Cell(new Label($data_row[1])));
        }
        $table->addRow($row);
    }

    $table->setAttribute(array('fontSize' => 14, 'padding'=> 10));

    $table->render($img, 0, 0);

    return $img;
}


function _get_row_header(array $data): Row{
    $header = new Row();
    $right_side = new Table();

    foreach($data['header'] as $data_row){
        $row = new Row();
        $row->addCell(new Cell(new Label($data_row[0])));
        $row->addCell(new Cell(new Label($data_row[1])));
        $right_side->addRow($row);
    }

    $header->addCell(new Cell($right_side));
    $cell = new Cell(new Label($data['title']));
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
?>