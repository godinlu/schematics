document.addEventListener("DOMContentLoaded", async () => {
    const formulaire = sessionStore.formulaire;

    const images = {
        brut: document.getElementById("schema_hydrau_brut"),
        annote: document.getElementById("schema_hydrau_annote"),
        complet: document.getElementById("schema_hydrau_complet")
    };

    const loader = document.getElementById("schema_loader");

    const buttons = {
        brut: document.getElementById("btn_brut"),
        annote: document.getElementById("btn_annote"),
        complet: document.getElementById("btn_complet")
    };

    let current_version = "annote";

    ///////////////////////////////////////////////////////
    //            INITIAL IMAGE SOURCES
    ///////////////////////////////////////////////////////
    async function load_current_image(){
        // avoid reloading images
        if (images[current_version].src) return;

        loader.style.display = "flex";
        try {
            const blob = await fetch_schema_blob(`schemas/hydrau/${current_version}?format=png`, formulaire, "image/png");
            images[current_version].src = URL.createObjectURL(blob);
        } catch (err) {
            show_error_toast(`Impossible de générer le schéma : ${err.message}`);
        } finally {
            loader.style.display = "none";
        }
    }


    ///////////////////////////////////////////////////////
    //            MANAGE RADIO BUTTON
    ///////////////////////////////////////////////////////
    async function setActive(version) {

        current_version = version;

        // Reset images
        Object.values(images).forEach(img => img.style.display = "none");

        // load img if src not defined
        await load_current_image();

        // activate corresponding img
        images[version].style.display = "block";

        // Reset boutons
        Object.values(buttons).forEach(btn => {
            btn.classList.remove("active");
            const icon = btn.querySelector("i");
            icon.classList.remove("fa-square-check");
            icon.classList.add("fa-square");
        });

        // activate button
        buttons[version].classList.add("active");
        const icon = buttons[version].querySelector("i");
        icon.classList.remove("fa-square");
        icon.classList.add("fa-square-check");
    }

    buttons.brut.addEventListener("click", () => setActive("brut"));
    buttons.annote.addEventListener("click", () => setActive("annote"));
    buttons.complet.addEventListener("click", () => setActive("complet"));

    // default selection
    setActive("annote");


    ///////////////////////////////////////////////////////
    //           PNG DOWNLOAD
    ///////////////////////////////////////////////////////
    document.querySelector("#btn_download_png").addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = images[current_version].src;
        link.download = `schemaHydrau-${sessionStore.name}.png`;
        link.click();
    });


    ///////////////////////////////////////////////////////
    //           PDF DOWNLOAD
    ///////////////////////////////////////////////////////
    document.querySelector("#btn_download_pdf").addEventListener("click", async () => {
        try {
            const blob = await fetch_schema_blob(`schemas/hydrau/${current_version}?format=pdf`, sessionStore.formulaire, "application/pdf");

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `schemaHydrau-${sessionStore.name}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            show_error_toast(`Impossible de télécharger le PDF : ${err.message}`);
        }
    });


});



