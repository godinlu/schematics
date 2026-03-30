<?php
require_once __DIR__ . "/HydraulicDecorators.php";


class HydraulicSchema{
    private array $ctx;
    private string $base_path;
    private GdImage $brut;

    public function __construct(array $context)
    {
        $this->ctx = $context;
        $this->base_path = IMG_DIR . "schema_hydro/";
        $this->brut = $this->generate_brut();
    }

    public function brut(): GdImage{
        return $this->brut;
    }

    public function annote(): GdImage{
        return (new AnnoteDecorator($this->ctx, $this->base_path))->apply($this->brut);
    }

    public function full(): GdImage{
        return (new FullDecorator($this->ctx, $this->base_path))->apply($this->annote());
    }

    private function generate_inital_canva(): GdImage{
        $template = imagecreatefrompng($this->base_path . "template schema.png");
        $w = imagesx($template);
        $h = imagesy($template);
        $base_img = imagecreatetruecolor($w, $h);
        imagefill($base_img, 0, 0, imagecolorallocate($base_img, 255, 255, 255));
        imagecopy($base_img, $template, 0, 0, 0, 0, $w, $h);
        return $base_img;
    }


    private function generate_brut(): GdImage{
        $img = $this->generate_inital_canva();

        (new CapteurDecorator($this->ctx, $this->base_path . "champCapteur/"))->apply($img);
        (new BallonTamponDecorator($this->ctx, $this->base_path . "ballonTampon/"))->apply($img);
        (new AppointDecorator($this->ctx, $this->base_path))->apply($img);
        (new BallonECSDecorator($this->ctx, $this->base_path . "ballonECS/"))->apply($img);
        (new DiversDecorator($this->ctx, $this->base_path . "divers/"))->apply($img);
        (new CirculateursDecorator($this->ctx, $this->base_path))->apply($img);
        (new OptionsDecorator($this->ctx, $this->base_path . "options/"))->apply($img);

        return $img;
    }
}

