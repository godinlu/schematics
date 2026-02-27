
<div class="flex">
  <!--canvas ou est déssiné la schématèque il fait la taille de de base schema -->
  <div id="img_container">
    <!-- <canvas id="canvas" width="891" height="666">
    </canvas> -->
    <img id="schema_exe" alt="Schéma d'EXE" >
    <img id="etiquetage" alt="Etiquetage" style="display: none;" >

  </div>
  <aside>
    <button type="button" id="btn_toggle_etiquetage">étiquetage module<i class="fa-regular fa-square"></i></button>
    <button type="button" id="btn_download_png">télécharger (png)<i class="fa-regular fa-file-image"></i></button>
    <button type="button" id="btn_download_pdf">télécharger (pdf)<i class="fa-regular fa-file-pdf"></i></button>
  </aside>  
</div>
<script>
  const formulaire = <?=json_encode($formulaire)?>;
</script>