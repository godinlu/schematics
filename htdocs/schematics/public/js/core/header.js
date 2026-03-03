document.addEventListener("DOMContentLoaded", () => {
    /////////////////////////////////////////////////////////////
    //                  MANAGE TOOLBAR
    /////////////////////////////////////////////////////////////

    // reinit
    document.querySelector("#TB_reinitialisation").addEventListener("click", ()=>{
        sessionStore.clear();
        location.reload();
    });

    // save the installation
    document.querySelector("#TB_sauvegarder").addEventListener("click", ()=>{
        // Convert object to formatted JSON string
        const json = JSON.stringify(sessionStore.all, null, 2);

        // Create a Blob
        const blob = new Blob([json], { type: "application/json" });

        // Create a temporary link
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `installation-${sessionStore.name}`; 
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);

    });

    // open installation
    document.querySelector("#TB_charger").addEventListener("click", () => {
        let modal = new Modal();
        modal.content_div.innerHTML = `
            <div style="width: max-content">
                <p>Choisissez le fichier à importer</p>
                <input type="file" accept="application/JSON" id="import_fichier">
                <label for="import_fichier">
                    <i class="fa fa-upload" aria-hidden="true"></i><span>Choisissez un fichier</span> 
                </label>
                <button id="charger" disabled> Ouvrir <i class="fa fa-check" aria-hidden="true"></i></button>
            </div>
        `;
        

        const input = modal.content_div.querySelector("#import_fichier");
        const button = modal.content_div.querySelector("button");
        const span = modal.content_div.querySelector("span");

        input.addEventListener("change", () => {
            if (input.files.length) {
                span.textContent = input.files[0].name;
                button.disabled = false;
            } else {
                span.textContent = "Choisissez un fichier";
                button.disabled = true;
            }
        });

        button.addEventListener("click", () =>{
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    sessionStore.all = jsonData;
                    location.reload();
                } catch (err) {
                    console.error("Erreur lors de la lecture du JSON :", err);
                }
            };
            reader.readAsText(file);

        });

        modal.show();
    });
});

// //////////////////////////////////////////////////////////////////////////
// //----------------------- VARIABLE GLOBAL--------------------------------             
// var TB_sauvegarder = document.querySelector("#TB_sauvegarder"); 
// var TB_charger = document.querySelector("#TB_charger");
// var TB_download_folder = document.querySelector("#TB_télécharger_dossier");
// var TB_power_point = document.querySelector("#TB_power_point");

// //variable du DOM pour la fenêtre popup de l'import du fichier  
// var popupImport = document.querySelector("#popupImport");
// var form_import = document.querySelector("#popupImport form");
// var input_file = document.querySelector("#import_fichier");

// //variable du DOM pour la fenêtre popup du téléchargement du powerPoint
// var popupPowerPoint = document.querySelector("#popupPowerPoint");

// //////////////////////////////////////////////////////////////////////////

// //////////////////////////////////////////////////////////////////////////
// //----------------------- FONCTION ACTION--------------------------------   

// /**
//  * met à jour le text de l'input file pour qu'il prenne le nom du fichier
//  */
// function manageFile(){
//     const T = input_file.value.split("\\"); //on récupère sous forme de tableau le nom du fichier qui a été déposé
//     var file_name = T[T.length -1]; //on prend le dernière éléments du tableau qui correspond au nom dud fichier
//     form_import.querySelector("span").innerHTML = file_name;
// }

// /**
//  * télécharge sous forme de fichier Json l'installation actuel
//  * @param {Event} event 
//  */
// function donwload_json(event){
//     event.preventDefault();
//     const URL = '../ajax/save.php';
    
//     let formulaire = document.getElementById("formulaire");
//     if (formulaire){
//         if (typeof saveAllData === 'function') saveAllData(formulaire);
//         const dataForm = new FormData(formulaire);

//         //ensuite on supprime les données qui ont été ajouté par saveAllData
//         deleteAdditionalData(formulaire);
//         fetch(URL,{method:'POST',body: dataForm}).then(handlerResponse);

//     }else{
//         fetch(URL,{method:'GET'}).then(handlerResponse);
//     }

//     function handlerResponse(response){
//         // Vérifier si la requête a réussi
//         if (response.ok) {
//             // Déclencher le téléchargement
//             response.blob().then(function(blob) {
//                 var url = window.URL.createObjectURL(blob);
//                 var a = document.createElement('a');
//                 a.href = url;
//                 a.download = response.headers.get('X-Filename'); // Nom du fichier de téléchargement
//                 a.click();
//                 window.URL.revokeObjectURL(url);
//             });
//         } else {
//             console.error('La requête a échoué.');
//         }
//     }
    
// }
// /**
//  * renvoie vrai si tout les champs installateurs on été remplie correctement
//  * @param {FormData} formData 
//  * @return {boolean}
//  */
// function isFieldInstallateurValid(formData){
//     const INSTALLATEUR = 'installateur';
//     const PRENOM_NOM = 'Prénom/nom';
//     const MAIL = 'adresse_mail';
//     const COMMERCIAL = 'commercial';

//     if (document.title === "Formulaire"){
//         return (
//             formData.get(INSTALLATEUR) !== "" && formData.get(PRENOM_NOM) !== "" &&
//             formData.get(MAIL) !== "" && formData.get(COMMERCIAL) !== ""
//         );
//     }else{
//         return (
//             formulaire[INSTALLATEUR] !== "" && formulaire[PRENOM_NOM] !== "" &&
//             formulaire[MAIL] !== "" && formulaire[COMMERCIAL] !== ""
//         );
//     }
// }

// function download_folder(){
//     let form = document.getElementById('formulaire');
    
//     if (typeof saveAllData === 'function') saveAllData(form);
//     let formData = (form) ? new FormData(form) : new FormData();

//     if (!isFieldInstallateurValid(formData) ){
//         sessionStorage.setItem("error","miss text");
//         alert("Attention ! pour enregistrer le dossier, vous devez remplir tout les champs de la description de l'installateur");
//         location.href = "formulaire";
//         return;
//     }
//     if (form){
//         form.action = "../api/generateSchemaReport.php";
//         form.submit();
//         form.action = "";
//     }else{
//         window.location.href = "../api/generateSchemaReport.php";
//     }
    
    
// }



// //////////////////////////////////////////////////////////////////////////
// //----------------------- MAIN--------------------------------  

// function main(){
//     TB_charger.addEventListener("click", ()=>{
//         popupImport.style.display = "block";
//     });
//     TB_download_folder.addEventListener("click", download_folder);
//     TB_sauvegarder.addEventListener("click" , donwload_json);

//     input_file.addEventListener("change",manageFile);

//     document.querySelector(".popupCloseButton").addEventListener('click',()=>{
//         document.querySelector(".popup_content").style.display = "none";
//     });
// }

// main();