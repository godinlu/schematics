<div class="flex">
  <!--canvas ou est déssiné la schématèque il fait la taille de base schema -->
  <div id="canvas_container">
    <img id="schema_brut" alt="Schéma hydraulique">
    <img id="schema_annote" style="display: none;" alt="Schéma hydraulique annoté">
    <img id="schema_complet" style="display: none;" alt="Schéma hydraulique complet">
  </div>

  <aside>
    <button type="button" id="btn_brut" class="schema-btn">
      Schéma brut <i class="fa-regular fa-square"></i>
    </button>

    <button type="button" id="btn_annote" class="schema-btn">
      Schéma annoté <i class="fa-regular fa-square"></i>
    </button>

    <button type="button" id="btn_complet" class="schema-btn">
      Schéma complet <i class="fa-regular fa-square"></i>
    </button>
    <button type="button" id="btn_download_png">télécharger (png)<i class="fa-regular fa-file-image"></i></button>
    <button type="button" id="btn_download_pdf">télécharger (pdf)<i class="fa-regular fa-file-pdf"></i></button>
  </aside>
</div>
<script>
  const formulaire = <?= json_encode($formulaire) ?>;
</script>