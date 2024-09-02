<div id="main">
    <div>
        <div id="container_devis" class="scroll-container">
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Objet</th>
                        <th>Cout Total</th>
                        <th>Nom commercial</th>
                    </tr>
                </thead> 
                <tbody>
                    <?php foreach ($list_devis as $devis):?>
                        <tr class="devis-row" data-additional='<?=$devis->toJson()?>'>
                            <td><?=$devis->getId()?></td>
                            <td><?=$devis->getDate()->format('d/m/Y') ?></td>
                            <td><?=$devis->getObjet()?></td>
                            <td><?=$devis->getCout_total()?></td>
                            <td><?=$devis->getNom_commercial()?></td>

                        </tr>
                    <?php endforeach;?>
                </tbody>
                
            </table>
        </div>
    </div>
    
    <div id="extra_information">
        <h2></h2>
        <div id="client_installateur">
        </div>
        <fieldset>
            <legend>Articles</legend>
            <div id="articles" class="scroll-container">
            </div>
        </fieldset>

    </div>
    

</div>

