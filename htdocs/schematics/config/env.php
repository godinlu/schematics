<?php

function load_env($path)
{
    if (!file_exists($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;

        [$key, $value] = explode('=', $line, 2);

        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}