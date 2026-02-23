/**
 * 
 */
document.addEventListener("DOMContentLoaded", () =>{
    init_app();
});


async function show_schema_image(){
    const blob = await get_schema("SchemaHydrau", "PNG");

    const url = URL.createObjectURL(blob);

    const img = document.querySelector("#SchemaHydrau");
    img.src = url;
}


function init_app(){
    show_schema_image();
}