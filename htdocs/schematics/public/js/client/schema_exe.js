/*CHOSE à RETENIR:
    les images sont importer depuis les diaporama elle même convertie en pdf 
    la taille des images doit être divisé par 1.3
*/
//////////////////////////////////////////////////////////////////////////
//----------------------- VARIABLE GLOBAL-------------------------------- 


//variable du DOM    
var SchemaExe = document.getElementById("SchemaExe");       
var Etiquetage = document.getElementById("Etiquetage");
var btn_etiquetage = document.getElementById("btn_toggle_etiquetage");
var etiquetage = false;


//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//              Fonction diverse
/**
 * télécharge le canvas en png
 */
function downloadPng(){
    const imageUrl = (etiquetage) ? Etiquetage.src : SchemaExe.src;

    let link = document.createElement('a');
    link.href = imageUrl;
    link.click();
}
/**
 * télécharge le canvas en pdf
 */
function downloadPdf(){
    const imageUrl = (etiquetage) ? Etiquetage.src : SchemaExe.src;

    window.location.href = imageUrl + "&format=PDF&dl=TRUE";
}
//////////////////////////////////////////////////////////////////////////
//              FONCTION POUR L'ETIQUETAGE
//////////////////////////////////////////////////////////////////////////
/**
 * cette fonction active ou désactive la l'étiquetage du module
 * et coche ou décoche la case étiquetage du module
 */
function toggleEtiquetage(){
    let i = btn_etiquetage.querySelector("i");
    const HIDDEN = "hidden";
    etiquetage = !etiquetage;

    SchemaExe.classList.toggle(HIDDEN);
    Etiquetage.classList.toggle(HIDDEN);

    if (etiquetage){
        i.setAttribute("class" , "fa-regular fa-square-check");
    }else{
        i.setAttribute("class" , "fa-regular fa-square");
    }
}
/**
 * switch entre le mode paysage et le mode portrait et change la taille du canvas en fonction
 */
function toggleMode(){
    if (format == "l"){ //mode portait
        format = "p";
    }else{  //mode paysage
        format = "l";
    }


}

//////////////////////////////////////////////////////////////////////////
//----------------------------- MAIN ---------------------------------- 
function main(){
    document.getElementById("btn_download_png").addEventListener("click" , downloadPng);
    document.getElementById("btn_download_pdf").addEventListener("click" , downloadPdf);
    btn_etiquetage.addEventListener("click",toggleEtiquetage);
}

main(); //on appelle addEvent pour ajouter les evenements