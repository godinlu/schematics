
<div class="flex">
    <form id="formulaire" action="" method="post">
        <table id="ficheProgrammation">
            <thead>
                <tr>
                    <td>
                        <table>
                            <?php foreach ($header as $key => $row):?>
                                <tr>
                                    <?php if (is_string($key)): ?>
                                        <td><?=$row[0]?></td>
                                        <td><input type="text" name="<?=$key?>" value="<?=$row[1]?>"></td>
                                    <?php else:?>
                                        <?php foreach ($row as $cell):?>
                                            <td><?=$cell?></td>
                                        <?php endforeach;?>
                                    <?php endif;?>
                                </tr>
                            <?php endforeach;?>
                        </table>
                    </td>
                    <td id="title"><?=$title?></td>
                </tr>
            </thead>
            <tbody id="border">
                <?php foreach ($content as $key => $row):?>
                    <tr>
                        <?php if (count($row) === 1):?>
                            <td colspan="2"><?=$row[0]?></td>
                        <?php elseif (is_string($key)) :?>
                            <td><?=$row[0]?></td>
                            <td><textarea name="<?=$key?>" cols="55" rows="5"><?=$row[1]?></textarea></td>
                        <?php else :?>
                            <?php foreach ($row as $cell):?>
                                <td><?=$cell?></td>
                            <?php endforeach;?>
                        <?php endif;?>
                    </tr>
                <?php endforeach;?>
            </tbody>
        </table>
    </form>
    <div id="sideBar">
        <button type="button" id="btn_download_pdf">télécharger (pdf)<i class="fa fa-file-pdf-o" aria-hidden="true"></i></button>
    </div>  
    
</div>

        
