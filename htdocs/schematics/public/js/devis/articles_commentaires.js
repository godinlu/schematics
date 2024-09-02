/**
 * 
 */
//ces deux variable doivent être global
var lignes = [];
var index_articles = [];


function initTableArticle(){
    //=======================================================================================================
    //========================================== CONSTANTE ==================================================
    const ARTICLE_AJOUTER = "article_ajouter";
    const HIDE_ARTICLE = "hide_article_ajouter";

    //=======================================================================================================
    //========================================== FONCTIONS ==================================================
    
    /**
     * fonction asynchrone qui permet de générer le tableau
     * @returns {Promise} prommesse
     */
    function initTableAsync(){
        return new Promise((resolve) =>{
            setTimeout(()=>{
                initTable();
                resolve();
            },0);
        });
    }
    /**
     * cette fonction à pour but de créer le tableau d'article 
     */
    function initTable(){
        let tbody = document.querySelector("#table_article tbody");
        json_tarif.forEach((article, index)=>{
            //on commence par créer tout les éléments
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            let td4 = document.createElement("td");
            let td5 = document.createElement("td");
            let inputNumber = document.createElement("input");
            inputNumber.addEventListener('input',ecouteurQuantite);

            //on met toute les attributs nécessaire
            inputNumber.type = "number";
            inputNumber.value = "0";
            inputNumber.min = "0";
            inputNumber.setAttribute("index",index);
            td2.textContent = article.ref;
            td3.textContent = article.label;
            td4.textContent = article.prix;
            td5.textContent = devis.getCategByFamily(article.famille);

            //ensuite on ajoute les élements 
            td1.appendChild(inputNumber);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tbody.appendChild(tr);

            lignes.push(tr);

        });
    }
    
    
    /**
     * fonction appelé lorsque l'on tape dans le filtre de colonne
     * elle affiche ou cache les lignes en fonction du filtre
     */
    function filtreColonne(){
        const filter = this.value.toUpperCase();
        const column = this.parentElement.cellIndex;
        
        lignes.forEach(element => {
            //on prend la column correspondante au filtre
            let td = element.querySelectorAll("td")[column]; 
            
            //on récupère sa valeur
            const texte = td.textContent || td.innerText;

            //on compare la valeur avec le filtre
            if (texte.toUpperCase().indexOf(filter) > -1) {
                element.classList.remove("hide_colonne"+column);
            } else {
                element.classList.add("hide_colonne"+column);
            }
        });
    }

    /**
     * cette fonction est appelé lorsque l'on clique sur la checkbox filtre_article_ajouter
     * si la checkbox est coché alors on affiche que les articles qui sont déjà dans le devis
     * sinon on affiche tout les articles
     */
    function filtreArticleAjouter(){
        if (this.checked){
            for (let i = 0 ; i < lignes.length ; i++){
                if (index_articles.includes(i)) continue;
                lignes[i].classList.add(HIDE_ARTICLE);
            }
        }else{
            lignes.forEach(element => {
                element.classList.remove(HIDE_ARTICLE);
            });
        }

    }

    /**
     * cette fonction est appelé lorsqu'un input de quantité est modifié
     * elle ajoute ou modifie la quantité de l'article dans le devis
     * @returns 
     */
    function ecouteurQuantite(){
        const qte = parseInt(this.value); 
        //on récupère l'index de l'article dans le tableau
        const index = parseInt(this.getAttribute("index"));

        const tr = lignes[index];
        const ref = tr.querySelectorAll("td")[1].textContent; 
        const td_categ = tr.querySelectorAll("td")[4];

        if (qte <= 0){
            devis.removeRow(ref);
            VisualDevis.show();
            if (td_categ.querySelector("select")) td_categ.innerHTML = "inutiliser";
            //on test si l'article est présent dans le tableau des articles ajouté si oui on le supprime
            const i = index_articles.indexOf(index);
            if (i !== -1){
                index_articles.splice(i, 1);
            }
            return;
        }

        if (!index_articles.includes(index)) index_articles.push(index);


        if (td_categ.textContent === "inutiliser"){
            ajouterSelectCateg(td_categ, ref);
            return;
        }
       
        if (!devis.updateQuantity(ref, qte)){
            const article = json_tarif.filter(ligne => ligne.ref == ref)[0];
            devis.add(ref, article);
        }
        VisualDevis.show();
    }
    /**
     * 
     * @param {HTMLTableCellElement} td 
     * @param {string} ref
     */
    function ajouterSelectCateg(td, ref){
        function ecouteurCategorie(){
            
            const quantite = devis.map.get(ref) ? devis.map.get(ref).qte : 1;

            //on commence par enlever la ligne du devis
            devis.removeRow(ref);
            //esnuite on récupère l'article avec sa référence et on modifie sa catégorie
            let article = json_tarif.filter(ligne => ligne.ref == ref)[0];
            article.famille = this.value;
            //enfin on ajoute l'article au devis avec sa quantité et on met à jour l'affichage
            devis.add(ref, article);
            devis.updateQuantity(ref, quantite);
            VisualDevis.show();
        }

        //MAIN
        let select = document.createElement("select");
        devis.getListCateg().forEach(categ =>{
            select.addOption(categ, categ);
        });
        select.addEventListener("change", ecouteurCategorie);
        ecouteurCategorie.call(select);
        
        td.innerHTML = "";
        td.appendChild(select);
    }

    //=======================================================================================================
    //========================================== MAIN =======================================================
    initTableAsync().then(()=>{
        const table = document.getElementById('table_article');

        //si il y a dans la session un devis alors on initialise les articles en fonction de ce qu'il y a dans la session
        if (devis_index !== null){
            if (devis_index.articles){

                devis_index.articles.forEach((article) =>{
                    const index = json_tarif.findIndex(row => row.ref === article.ref);
                    let input = lignes[index].querySelector("input[type=number]");
                    setElementValue(input, article.qte);

                    let select = lignes[index].querySelector("select");
                    if (select){
                        setElementValue(select, article.categ);
                    }
                });
            }   
        }
    });


    document.getElementById("filtre_ref").addEventListener("keyup",filtreColonne);
    document.getElementById("filtre_label").addEventListener("keyup",filtreColonne);
    document.getElementById("filtre_article_ajouter").addEventListener("input",filtreArticleAjouter);

    



    
}

/**
 * cette fonction renvoie un array contenant tout les articles qui ont été ajouté ainsi que la quantité
 */
function getArticlesContent(){
    let articles = [];
    index_articles.forEach((i)=>{
        const ref = lignes[i].querySelectorAll("td")[1].textContent;
        const qte = lignes[i].querySelector("input[type=number]").value;
        const select = lignes[i].querySelector("select");
        if (select){
            articles.push({ref:ref,qte:qte, categ:select.value});
        }else{
            articles.push({ref:ref,qte:qte});
        }
        
    });
    return articles;
}

class Commentaire extends Champ{
    constructor(id, texte, categorie){
        super(id, texte, categorie);

        //variable global
        let textfield = this.nodes.ta_commentaire;
        let select = this.nodes.s_commentaire;
        let input_num = this.nodes.in_commentaire;

        //fonctions écouteurs
        function ecouteur(){
            devis.removeRow(select.id);
            devis.addCommentaire(select.id, textfield.value, select.value, input_num.value);
            VisualDevis.show();
        }

        //main
        textfield.addEventListener("keyup",ecouteur.bind(this));
        select.addEventListener("change",ecouteur.bind(this));
        input_num.addEventListener("input",ecouteur.bind(this));

        devis.getListCateg().forEach(categ =>{
            select.addOption(categ, categ);
        });
        ecouteur();
    }

    supprimer(){
        devis.removeRow(this.nodes.s_commentaire.id);
        VisualDevis.show();
        delete this;
    }
}







