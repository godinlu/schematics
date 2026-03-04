document.addEventListener("DOMContentLoaded", async () => {

    const images = {
        brut: document.getElementById("schema_brut"),
        annote: document.getElementById("schema_annote"),
        complet: document.getElementById("schema_complet")
    };

    const buttons = {
        brut: document.getElementById("btn_brut"),
        annote: document.getElementById("btn_annote"),
        complet: document.getElementById("btn_complet")
    };

    let currentVersion = "annote";

    ///////////////////////////////////////////////////////
    //            INITIAL IMAGE SOURCES
    ///////////////////////////////////////////////////////
    // console.log(get_equipment_from_form(get_formulaire()));
    const form_data = sessionStore.formulaire;
    form_data["used_equipment"] = get_equipment_from_form(sessionStore.formulaire);
    const response = await post_data(`generateSchema.php?image=schema_hydrau_${currentVersion}&format=png`, form_data);
    const blob = await response.blob();
    const img_url = URL.createObjectURL(blob);

    images[currentVersion].src = img_url;


    ///////////////////////////////////////////////////////
    //            MANAGE RADIO BUTTON
    ///////////////////////////////////////////////////////
    function setActive(version) {

        currentVersion = version;

        // Reset images
        Object.values(images).forEach(img => img.style.display = "none");

        // load img if src not defined
        if(!images[version].src) {
            images[version].src = `../api/generateSchema.php?image=schema_hydrau_${version}&format=png`;
        }

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
        link.href = images[currentVersion].src;
        link.download = `schemaHydrau${formulaire['nom_affaire']}.png`;
        link.click();
    });


    ///////////////////////////////////////////////////////
    //           PDF DOWNLOAD
    ///////////////////////////////////////////////////////
    document.querySelector("#btn_download_pdf").addEventListener("click", async () => {
        try {
            const response = await fetch(`../api/generateSchema.php?image=schema_hydrau_${currentVersion}&format=pdf`);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `schemaHydrau${formulaire['nom_affaire']}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Erreur téléchargement PDF :", err);
        }
    });


});



