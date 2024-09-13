<?php
// Tableau de catégories d'entrée
$categories = [
    ['id' => 0, 'name' => 'Articles', 'short_name' => 'articles', 'type' => 'categ', 'priority' => 0, 'parent_id' => null],
    ['id' => 1, 'name' => 'Module de chauffage solaire et ballon ECS', 'short_name' => 'module', 'type' => 'categ', 'priority' => 1, 'parent_id' => 0],
    ['id' => 2, 'name' => 'Capteurs solaires thermiques', 'short_name' => 'capteur', 'type' => 'categ', 'priority' => 2, 'parent_id' => 0],
    ['id' => 3, 'name' => 'Gestion de l\'appoint PAC', 'short_name' => 'pac', 'type' => 'categ', 'priority' => 3, 'parent_id' => 0],
    ['id' => 4, 'name' => 'Appoint électrique ecs en option', 'short_name' => 'appoint', 'type' => 'categ', 'priority' => 4, 'parent_id' => 0],
    ['id' => 5, 'name' => 'Services', 'short_name' => 'services', 'type' => 'categ', 'priority' => 5, 'parent_id' => 0],
    ['id' => 6, 'name' => 'Module', 'short_name' => 'module', 'type' => 'categ', 'priority' => 1, 'parent_id' => 1]
];






// Générer les priorités pour chaque catégorie
addCategoryPrioritiesInPlace($categories);

print_r($categories);
// Afficher les résultats pour vérifier
foreach ($categories as $category) {
    echo "Catégorie ID: " . $category['id'] . ", Priorité: [" . implode(', ', $category['list_priority']) . "]\n";
}
// Afficher les résultats
// foreach ($priorities as $id => $priorityPath) {
//     echo "Catégorie ID: $id, Priorité: [" . implode(', ', $priorityPath) . "]\n";
// }
// Afficher les résultats
