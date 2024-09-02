<div class="flex">
  <!--canvas ou est déssiné la schématèque il fait la taille de base schema -->
  <div id="canvas_container">
    <img src="../api/getSchema.php?image=SchemaHydrau" id="SchemaHydrau" alt="Schéma hydraulique" >
    <img src="../api/getSchema.php?image=SchemaHydrauWithLegend" id="SchemaHydrauWithLegend" class="hidden" alt="Schéma hydraulique avec legend">
  </div> 
  
  <div id="sideBar">
    <button type="button" id="btn_legend">Légende<i class="fa fa-square-o" aria-hidden="true"></i></button>
    <button type="button" id="btn_download_png">télécharger (png)<i class="fa fa-file-image-o" aria-hidden="true"></i></button>
    <button type="button" id="btn_download_pdf">télécharger (pdf)<i class="fa fa-file-pdf-o" aria-hidden="true"></i></button>
  </div>     
</div>
<script>
  const formulaire = <?=json_encode($formulaire)?>;
</script>


    

