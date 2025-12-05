var btn_legend = document.getElementById("btn_legend")
var SchemaHydrau = document.getElementById("SchemaHydrau");
var SchemaHydrauWithLegend = document.getElementById("SchemaHydrauWithLegend");
var legend_active = false;

/**
 * 
 * @param {Event} event 
 */
function toggleLegend(event){
    let i = btn_legend.querySelector("i")
    const HIDDEN = "hidden";
    legend_active = !legend_active;

    SchemaHydrau.classList.toggle(HIDDEN);
    SchemaHydrauWithLegend.classList.toggle(HIDDEN);

    if (legend_active){
        i.setAttribute("class" , "fa-regular fa-square-check");
    }else{
        i.setAttribute("class" , "fa-regular fa-square");
    }
}

function downloadPng(){
    const imageUrl = (legend_active) ? SchemaHydrauWithLegend.src : SchemaHydrau.src;
    let link = document.createElement('a');
    link.href = imageUrl;
    link.click();
}


function downloadPDF(){
    const imageUrl = (legend_active) ? SchemaHydrauWithLegend.src : SchemaHydrau.src;
  
    window.location.href = imageUrl + "&format=PDF&dl=TRUE";
  
}

function main(){
    btn_legend.addEventListener("click" , toggleLegend);
    document.getElementById("btn_download_png").addEventListener("click" , downloadPng)
    document.getElementById("btn_download_pdf").addEventListener("click" , downloadPDF)
}

main();




    