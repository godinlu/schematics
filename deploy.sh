#!/bin/bash

# Demande à l'utilisateur sur quel serveur il veut déployer
read -p "Sur quel serveur voulez-vous déployer ? (1 - dev.solisart.fr, 2 - www.solisart.fr) : " choice

if [ $choice -eq 1 ]; then
    # Exécute la commande pour le déploiement sur dev.solisart.fr
    git push dev.solisart.fr main
    ssh 2609665@git.sd5.gpaas.net deploy dev.solisart.fr.git main
elif [ $choice -eq 2 ]; then
    git push www.solisart.fr main
    ssh 2609665@git.sd5.gpaas.net deploy www.solisart.fr.git main
else
    # Si le choix est invalide
    echo "Choix invalide. Veuillez sélectionner 1 ou 2."
fi




