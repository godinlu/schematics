
<div class="flex">
  <!--canvas ou est déssiné la schématèque il fait la taille de de base schema -->
  <div id="img_container">
    <!-- <canvas id="canvas" width="891" height="666">
    </canvas> -->
    <img src="../api/getSchema.php?image=SchemaExe" id="SchemaExe" alt="Schéma d'EXE" >
    <img src="../api/getSchema.php?image=Etiquetage" id="Etiquetage" alt="Etiquetage" class="hidden" >

  </div>
  <div id="sideBar">
    <button type="button" id="btn_toggle_etiquetage">étiquetage module<i class="fa fa-square-o" aria-hidden="true"></i></button>
    <button type="button" id="btn_download_png">télécharger (png)<i class="fa fa-file-image-o" aria-hidden="true"></i></button>
    <button type="button" id="btn_download_pdf">télécharger (pdf)<i class="fa fa-file-pdf-o" aria-hidden="true"></i></button>
  </div>     
</div>
<script>
  const formulaire = <?=json_encode($formulaire)?>;
</script>