function getOptionS10(formulaire){
    if (/S10/.test(formulaire['sondes']) && formulaire['optionS10'] === "Aucun"){
        return formulaire['champCapteur'].replace(/^\d/,"");
    }else{
        return formulaire['optionS10'];
    }
}

function getOptionS11(formulaire){
    if (/S11/.test(formulaire['sondes']) && formulaire['optionS11'] === "Aucun"){
        return formulaire['champCapteur'].replace(/^\d/,"");
    }else{
        return formulaire['optionS11'];
    }
}

function getList_emplacement(formulaire){
    /** cette fonction pousse toute les valeurs une fois à droite
    * les valeurs peuvent être poussé si à droite il y a une chaine vide ""
    */
    Array.prototype.pushRight = function(){
        //on met -2 car le dernière objet ne peut jamais être déplacé vu qu'il est tout à droite
        for (var i = this.length-2 ; i >= 0 ; i-- ){
            if (this[i+1] == ""){ //on test si il n'y a aucun objet à droite
                this[i+1] = this[i]; //on copie l'objet pour le mettre à droite
                this[i] = "";   //on met vide l'objet que l'on vien de déplacer
            }
        }
    }

    var list_zones = ["circulateurC1","circulateurC2","circulateurC3","circulateurC7"];
    if (formulaire['typeInstallation'] === "SC1Z") list_zones = ["circulateurC3","circulateurC1","circulateurC2","circulateurC7"];
    var res = [];

    list_zones.forEach((id,i) =>{
        if (formulaire[id]  !== "Aucun") res.push(id);
        else res.push("");
    });
    res.pushRight();
    return res;
}
/**
 * renvoie le nombre totale de zone qu'il y a
 * @param {object} formulaire
 * @returns {int} nbzone
 */
function getNbZones(formulaire){
    const list_zones = ["circulateurC1","circulateurC2","circulateurC3","circulateurC7"];
    var nbZone = 0;
    list_zones.forEach(id => {
        if (formulaire[id] != "Aucun") nbZone ++;
    });
    return nbZone;
} 

/**
 * @param {string} key
 * @param {string} value 
 * @param {HTMLFormElement} form 
 */
function saveAdditionalData(key, value, form) {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
    
}

/**
 * cette fonction supprimes les input type hidden qui ont été rajouté par la fonction
 * saveAdditionalData
 * @param {HTMLFormElement} formulaire 
 */
function deleteAdditionalData(form){
    form.querySelectorAll("input[type=hidden]").forEach(element =>{
        element.remove();
    });
}

function recupName(response) {
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/['"]/g, '') : 'document.pdf';

    return { response, filename };
}

function toPDF({ response, filename }) {
    response.blob()
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors du téléchargement du PDF :', error);
    });
}

function toPNG({ response, filename }) {
    response.blob()
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors du téléchargement du PNG :', error);
    });
}