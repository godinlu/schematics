<?php
require_once("image_utils.php");

/**
 * Generate the full hydraulic diagram.
 *
 * This function creates a complete hydraulic diagram, optionally including
 * legends. The diagram is generated based on the input form data provided
 * in the $formulaire array.
 *
 * @param array $formulaire Input data defining the hydraulic system components and connections.
 * @param bool $legend Optional. If true, legends will be included in the diagram. Default is false.
 *
 * @return GdImage Returns image generated.
 */
function generate_full_hydraulic_diagram(array $formulaire, bool $legend = false): GdImage{
    return generate_hydraulic_sub_diagram($formulaire);
}

/**
 * Generate the hydraulic sub-diagram.
 *
 * This function creates only the hydraulic schematic (sub-diagram) without
 * any additional legends or annotations.
 * 
 * @param array $formulaire Input data defining the hydraulic system components and connections.
 *
 * @return GdImage Returns the image generated.
 */
function generate_hydraulic_sub_diagram(array $formulaire): GdImage{
    $img_composer = new ImageComposer(APP_BASE_PATH . "public/img/schema_hydro/");

    generate_hydraulic_components($formulaire, $img_composer);

    return $img_composer->render();
}



function generate_hydraulic_components(array $ctx, ImageComposer $ic): void{
    ////////////////////////////////////////////////////////////////////////
    //                          DEFAULT
    ////////////////////////////////////////////////////////////////////////
    $ic->add_image('template schema');

    ////////////////////////////////////////////////////////////////////////
    //                          champCapteur
    ////////////////////////////////////////////////////////////////////////
    $capteursMap = [
        '/capteurs/' => 'champCapteur/capteurs',
        '/casse pression/' => 'champCapteur/casse pression',
        '/échangeur/' => 'champCapteur/échangeur',
        '/2 champs capteurs en/' => 'champCapteur/2 champs capteurs en',
        '/2 champs capteurs découplés/' => 'champCapteur/2 champs capteurs découplés',
        '/V3V/' => 'champCapteur/V3V',
        '/double circulateur/' => 'champCapteur/double circulateur',
    ];
    foreach ($capteursMap as $pattern => $path) {
        if (preg_match($pattern, $ctx['champCapteur'])) {
            $ic->add_image($path);
        }
    }
    if (preg_match('/T15|T16/', $ctx['champCapteur'], $matches)){
        $ic->add_label($matches[0], 94, 226);
    }

}
?>