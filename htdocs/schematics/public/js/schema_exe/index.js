
document.addEventListener("DOMContentLoaded", async () =>{
    const images = {
        schema_exe: document.querySelector("#schema_exe"),
        etiquetage: document.querySelector("#etiquetage")
    };

    let current_image = "schema_exe";

    ///////////////////////////////////////////////////////
    //            INITIAL IMAGE SOURCES
    ///////////////////////////////////////////////////////
    images[current_image].src = `../api/generateSchema.php?image=${current_image}&format=png`;


    ///////////////////////////////////////////////////////
    //            TOGGLE IMAGES
    ///////////////////////////////////////////////////////
    const btn = document.querySelector("#btn_toggle_etiquetage");
    btn.addEventListener("click", () =>{
        // toggle the current_image
        current_image = (current_image === "schema_exe") ? "etiquetage" : "schema_exe";

        // load the other image if not already loaded.
        if (!images[current_image].src){
            images[current_image].src = `../api/generateSchema.php?image=${current_image}&format=png`;
        }

        // hide all images
        for (const img of Object.values(images)){
            img.style.display = "none";
        }
        // show the current image
        images[current_image].style.display = "";

        // toggle the class of the button 
        const icon = btn.querySelector("i");
        if (current_image === "schema_exe"){
            icon.classList.remove("fa-square-check");
            icon.classList.add("fa-square");
        }else{
            icon.classList.remove("fa-square");
            icon.classList.add("fa-square-check");
        }

    });


    ///////////////////////////////////////////////////////
    //            PNG DOWNLOAD
    ///////////////////////////////////////////////////////
    document.querySelector("#btn_download_png").addEventListener("click", ()=>{
        const link = document.createElement("a");
        
        link.href = images[current_image].src;
        link.download = `${current_image}${formulaire['nom_affaire']}.png`;
        link.click();
    });

    ///////////////////////////////////////////////////////
    //            PDF DOWNLOAD
    ///////////////////////////////////////////////////////
    document.querySelector("#btn_download_pdf").addEventListener("click", async ()=>{
        try {
            const response = await fetch(`../api/generateSchema.php?image=${current_image}&format=pdf`);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${current_image}${formulaire['nom_affaire']}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Erreur téléchargement PDF :", err);
        }
    });


});