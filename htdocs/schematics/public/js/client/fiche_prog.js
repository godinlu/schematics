//////////////////////////////////////////////////////////////////////////
//----------------------- VARIABLE GLOBAL--------------------------------             
var template = document.getElementById("FP_template");
var table = document.getElementById("ficheProgrammation");

//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//----------------------------- FONCTION ---------------------------------- 

/**
 * télécharge le tableau en format pdf avec le bon nom
 */
function downloadPDF(){
    const imageUrl = "../api/getSchema.php?image=ImageFicheProg";
    const form = document.getElementById('formulaire');
  
    fetch(imageUrl + "&format=PDF",{
        method:'POST',
        body:new FormData(form)
    })
    .then(response => recupName(response))
    .then( ({response , filename}) => toPDF({response , filename}) )
    .catch(error => {
      console.error('Une erreur s\'est produite lors du téléchargement du PDF :', error);
    });
    

    
}

/**
 * cette fonction redirige le formulaire vers la page souhaité pour envoyé les donnée en POST
 * à la page qui les sauvegardera
 * @param {Event} event 
 */
function handleMenuClick(event){
    event.preventDefault();
    
    const form = document.getElementById('formulaire');
    form.action = event.target.href
    form.submit();

}
//////////////////////////////////////////////////////////////////////////
//----------------------------- MAIN ---------------------------------- 
function main(){
    document.getElementById('btn_download_pdf').addEventListener('click',downloadPDF);

    document.querySelectorAll(".saveForm").forEach(a =>{
        a.addEventListener("click" , handleMenuClick);
    });
}



document.addEventListener("DOMContentLoaded", main);



