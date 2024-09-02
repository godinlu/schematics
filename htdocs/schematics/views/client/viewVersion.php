<main>
    <?php foreach ($versions as $name_version => $version):?>
        <article>
            <?php if ($name_version === $actual_version):?>
                <h2>Schematèque v<?=$name_version?> Release Notes <span>Latest</span></h2>
            <?php else:?>
                <h2>Schematèque v<?=$name_version?> Release Notes</h2>
            <?php endif;?>

            <?php foreach ($version['content'] as $title => $listes):?>
                <h3><?=$title?></h3>
                <ul>
                    <?php foreach ($listes as $liste):?>
                        <li><?=$liste?></li>
                    <?php endforeach;?>
                </ul>
            <?php endforeach;?>

            <time><?=$version['date']?></time>
        </article>
    <?php endforeach;?>
</main>

