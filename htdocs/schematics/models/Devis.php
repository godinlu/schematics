<?php
require_once "Installateur.php";
require_once "Client.php";
class Devis{
    private int $_id;
    private $_date;
    private string $_objet;
    private float $_cout_total;
    private int $_taux_remise;
    private null|string $_nom_commercial = null;
    private Installateur $_installateur;
    private Client $_client;
    private array $_articles;


    public function __construct(array $data){
        $this->hydrate($data);
        $this->_articles = [];
    }
    public function toArray(){
        $data = array(
            'id' => $this->_id,
            'date' => $this->getDate()->format('d/m/Y'),
            'objet' => $this->_objet,
            'cout_total' => $this->_cout_total,
            'nom_commercial' => $this->_nom_commercial,
            'installateur' => (isset($this->_installateur)) ? $this->_installateur->toArray() : null,
            'client' => $this->_client->toArray(),
            'articles' => $this->articlesToJson()
        );

        return $data;
    }
    public function toJson(){
        return htmlspecialchars(
            json_encode($this->toArray()),
            ENT_QUOTES,
            'UTF-8'
        );
    }

    private function articlesToJson(){
        $articlesData = array();
        foreach ($this->_articles as $item) {
            $articleData = array(
                'article' => $item['article']->toArray(),
                'quantity' => $item['quantity']
            );

            $articlesData[] = $articleData;
        }

        return $articlesData;
    }

    private function hydrate(array $data){
        foreach($data as $key => $value){
            $method = 'set'.ucfirst($key);

            if (method_exists($this,$method)){
                $this->$method($value);
            }
        }
    }
    //SETTERS
    public function setId($id){
        $id = (int) $id;
        if ($id > 0){
            $this->_id = $id;
        }
    }
    public function setDate($date){
        $date = date_create_from_format('Y-m-d H:i:s',$date);
        if ($date){
            $this->_date = $date;
        }
    }
    public function setObjet($objet){
        if (isset($objet) && is_string($objet)){
            $this->_objet = $objet;
        }
    }
    public function setCout_total($cout_total){
        $this->_cout_total = (float) $cout_total;
    }
    public function setTaux_remise($taux_remise){
        $this->_taux_remise = (int) $taux_remise;
    }
    public function setNom_commercial($nom_commercial){
        if (!empty($nom_commercial)){
            $this->_nom_commercial = $nom_commercial;
        }
    }
    public function setInstallateur(Installateur $installateur){
        $this->_installateur = $installateur;
    }
    public function setClient(Client $client){
        $this->_client = $client;
    }
    public function addArticle(Article $article, int $quantity){
        if ($quantity > 0){     
            $this->_articles[] = ['article'=>$article , 'quantity'=>$quantity];
        }
    }


    //GETTER
    public function getId():int{
        return $this->_id;
    }
    public function getDate(){
        return $this->_date;
    }
    public function getObjet():string|null{
        return $this->_objet;
    }
    public function getCout_total():float{
        return $this->_cout_total;
    }
    public function getTaux_remise():int{
        return $this->_taux_remise;
    }

    public function getNom_commercial():string|null{
        return $this->_nom_commercial;
    }
    public function getInstallateur():Installateur|null{
        if (isset($this->_installateur)){
            return $this->_installateur;
        }else{
            return null;
        }
        
    }
    public function getClient():Client{
        return $this->_client;
    }
    public function getArticles():array{
        return $this->_articles;
    }
}
?>