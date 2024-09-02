<nav>
    <div>
        <img src="../public/img/Solisart-menue.png" alt="logo solisart" width="200">
        <br>
        <a href="../client/version">Version <?=VERSION?></a>
    </div>
    <ul>
    
        <li><a href="devis" class="<?=($t === "Devis")? "jaune": NULL?>">Devis</a></li>
        <li><a href="tarif" class="<?=($t === "Tarif")? "jaune": NULL?>">Tarif</a></li>
        <li><a href="../" class="bleue">Sortir</a></li>
    </ul>
</nav>