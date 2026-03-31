<?php

/**
 * Envoie une réponse JSON et termine l'exécution.
 */
function respond(int $code, mixed $data): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Vérifie l'authentification via le header Authorization: Bearer <API_KEY>.
 * Termine avec 401 si invalide.
 */
function requireAuth(): void {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token  = str_replace('Bearer ', '', $header);

    if ($token !== $_ENV['API_KEY']) {
        respond(401, ['error' => 'Unauthorized']);
    }
}

/**
 * Lit et décode le corps JSON de la requête.
 * Termine avec 422 si le JSON est invalide ou absent.
 */
function readJsonBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        respond(422, ['error' => 'Corps de la requête vide']);
    }

    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        respond(422, ['error' => 'JSON invalide : ' . json_last_error_msg()]);
    }

    return $data;
}
