<form action="#" method="post">
    <table>
        <tr>
            <td><label for="in_username">Nom d'utilisateur : </label></td>
            <td><input type="text" name="username" id="in_username" placeholder="username" require></td>
        </tr>
        <tr>
            <td><label for="in_password">Mot de passe : </label></td>
            <td><input type="password" name="password" id="in_password" placeholder="password" require></td>
        </tr>
        <tr>
            <td colspan="2"><input type="submit" value="Se connecter"></td>
        </tr>
    </table>
    <?php if (isset($message)):?>
        <p class="errorMsg">Erreur : <?=$message?></p>
    <?php endif;?>
    
    
    
    

</form>