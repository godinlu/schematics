




function get_default_articles_ref(formulaire){
    console.log(formulaire);
    let refs = ["S7 2,5-CS-45-6", "MOD0757", "KITCAP015", "KITCAP012", "MISE001", "TRANS001"];
    let type_installation = formulaire.typeInstallation;
    let ballon_ecs = formulaire.ballonECS;
    let ballon_tampon = formulaire.ballonTampon;


    const bal_simple_ech = /ballon ECS tank in tank|Ballon hygiénique avec 1 echangeur/.test(formulaire.ballonECS);

    const mapping = [
        // Module part
        [type_installation === "SC1Z", ["SC1ZBMOD500", "SC1ZKIT50"]],
        [type_installation === "SC1", ["SC1BMOD", "SC1KIT50"]],
        [type_installation === "SC2", ["SC2BMOD", "SC2KIT5050"]],
        [type_installation === "SC1K", ["SC1K1,5BMOD", "SC1K1KIT5"]],
        [type_installation === "SC2K", ["SC2K1BMOD", "SC2K1KIT5"]],
        [type_installation === "HydrauBox 1", ["HYBX1MOD", "HYBXKIT"]],
        [type_installation === "HydrauBox 2", ["HYBX2MOD", "HYBXKIT"]],
        // Ballon part
        [ballon_ecs === "Ballon hygiénique avec 2 echangeurs", ["BAL0098"]],
        [(type_installation !== "SC1Z" && /ballon ECS (2|et)/.test(ballon_ecs)), ["BAL0001"]], // ajout du ballon double échangeur
        [/ballon ECS et/.test(ballon_ecs), ["BAL0001"]], // ajoute un deuxième ballon double échangeur
        [ballon_ecs === "ballon elec en sortie ballon solaire avec bouclage sanitaire", ["BAL0001", "BAL0001"]] // ajout 2 ballon double éch

    ];


    for(const elem of mapping){
        if (elem[0]){
            for (const ref of elem[1]){
                refs.push(ref);
            }
        }
    }



    return refs;
}



