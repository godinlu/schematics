#!/bin/bash

# Chemin vers le fichier PHP à modifier
php_file="htdocs/schematics/config/config.php"

# Extraire la version actuelle du fichier PHP
current_version=$(grep -oP '(?<=const VERSION = ")[^"]*(?=";)' "$php_file")

# Vérification si la version actuelle a été trouvée
if [ -z "$current_version" ]; then
  echo "Impossible de trouver la version actuelle dans le fichier $php_file."
  exit 1
fi

# Demander le numéro de version à l'utilisateur, en affichant la version actuelle comme exemple
read -p "Entrez le nouveau numéro de version (version actuelle: $current_version) : " new_version

# Utilisation de sed pour modifier la ligne contenant la constante VERSION
sed -i "s/^\(const VERSION = \)\"[^\"]*\";/\1\"$new_version\";/" "$php_file"

# Vérification si sed a réussi
if [ $? -eq 0 ]; then
    git add htdocs/schematics/config/config.php 
    echo "Le fichier $php_file a été mis à jour avec succès à la version $new_version."
else
    echo "Une erreur est survenue lors de la mise à jour du fichier $php_file."
fi
