
document.addEventListener("DOMContentLoaded", async () =>{
    const formulaire = sessionStore.formulaire;
    const images = {
        schema_exe: document.querySelector("#schema_exe"),
        etiquetage: document.querySelector("#etiquetage")
    };

    const loader = document.querySelector("#schema_loader");

    let current_image = "schema_exe";

    const SCHEMA_ROUTES = {
        schema_exe: "schemas/exe",
        etiquetage: "schemas/etiquetage"
    };

    ///////////////////////////////////////////////////////
    //            INITIAL IMAGE SOURCES
    ///////////////////////////////////////////////////////
    async function load_current_image(){
        // avoid reloading images
        if (images[current_image].src) return;

        loader.style.display = "flex";
        try {
            const blob = await fetch_schema_blob(`${SCHEMA_ROUTES[current_image]}?format=png`, formulaire, "image/png");
            images[current_image].src = URL.createObjectURL(blob);
        } catch (err) {
            show_error_toast(`Impossible de générer le schéma : ${err.message}`);
        } finally {
            loader.style.display = "none";
        }
    }


    load_current_image().then(() => {
        if (images[current_image].src) images[current_image].style.display = "";
    });


    ///////////////////////////////////////////////////////
    //            TOGGLE IMAGES
    ///////////////////////////////////////////////////////
    const btn = document.querySelector("#btn_toggle_etiquetage");
    btn.addEventListener("click", () =>{
        // toggle the current_image
        current_image = (current_image === "schema_exe") ? "etiquetage" : "schema_exe";

        // hide all images
        for (const img of Object.values(images)){
            img.style.display = "none";
        }

        // load the other image if not already loaded, then show it
        load_current_image().then(() => {
            if (images[current_image].src) images[current_image].style.display = "";
        });

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
        link.download = `${current_image}-${sessionStore.name}.png`;
        link.click();
    });

    ///////////////////////////////////////////////////////
    //            PDF DOWNLOAD
    ///////////////////////////////////////////////////////
    document.querySelector("#btn_download_pdf").addEventListener("click", async ()=>{
        try {
            const blob = await fetch_schema_blob(`${SCHEMA_ROUTES[current_image]}?format=pdf`, sessionStore.formulaire, "application/pdf");

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${current_image}-${sessionStore.name}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            show_error_toast(`Impossible de télécharger le PDF : ${err.message}`);
        }
    });


});