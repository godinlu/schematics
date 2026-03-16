document.addEventListener("DOMContentLoaded", async () => {
    const formulaire = sessionStore.formulaire;

    const images = {
        brut: document.getElementById("schema_hydrau_brut"),
        annote: document.getElementById("schema_hydrau_annote"),
        complet: document.getElementById("schema_hydrau_complet")
    };

    const buttons = {
        brut: document.getElementById("btn_brut"),
        annote: document.getElementById("btn_annote"),
        complet: document.getElementById("btn_complet")
    };

    let current_version = "annote";

    ///////////////////////////////////////////////////////
    //            INITIAL IMAGE SOURCES
    ///////////////////////////////////////////////////////
    load_current_image();

    async function load_current_image(){
        // avoid reloading images
        if (images[current_version].src) return;

        const response = await fetch(`api/generateSchema.php?image=schema_hydrau_${current_version}&format=png`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formulaire)
        });

        const blob = await response.blob();
        const img_url = URL.createObjectURL(blob);

        images[current_version].src = img_url;
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
            const response = await fetch(`api/generateSchema.php?image=schema_hydrau_${current_version}&format=pdf`, {
                method: "POST",
                headers:{ "Content-Type": "application/json" },
                body: JSON.stringify(sessionStore.formulaire),
            });
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `schemaHydrau-${sessionStore.name}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Erreur téléchargement PDF :", err);
        }
    });


});



