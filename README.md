# schematics
code de la schemateque en ligne de solisart

## Installation
1. Clonez ce dépôt de code source : git clone https://github.com/godinlu/schematics.git
2. Accédez au répertoire du projet : schematics/
4. Mettre le dossier schematics/ dans un serveur correctement configurer
5. lancer le site web en utilisant la bonne url : www.monserveur/schematics


## Explication du code

### table des matière
1. [Organisation des dossiers et fichiers](#1-Organisation-des-dossiers-et-fichiers)
    1. [ajax](#1-ajax)
    2. [api](#2-api)
    3. [Images](#3-Images)
    4. [Pages](#4-Pages)
    5. [Scripts](#5-Scripts)
    6. [Serveur](#6-Serveur)
    7. [Style](#7-Style)
2. [Explication des classes](#2-Explication-des-classes)
3. [Mise à jour du site](#3-Mise-à-jour-du-site)

### 1. Organisation des dossiers et fichiers

#### 1. ajax

    Le dossier ajax contient 3 fichiers qui sont appelé en asynchrone depuis le site:
    -'downloadFolder.php' : sert à télécharger le dossier complet
    - 'sauvegarderDevis.php' : sert à sauvegarder le devis dans la base de données afin de pouvoir visualiser les devis créer à partir de l'espace admin
    -'save.php' : sert à sauvegarder une installation en fichier json localement

#### 2. api

    Le dossier api contient 5 fichiers utils depuis le site mais aussi depuis l'extérieur
#### 3. Images
    Le dossier images contient toute les images de la schématèque. Il contient 2 principaux dossiers:
    -schema_exe
    -schema_hydro
    Ces dossiers contienent les images nécessaire à la génération des schémas ils sont répartie en plein de sous catégorie,
    qui ont leurs importance dans le code, les images ont tous un nom important aussi.
    Certaine image ont le même nom qu'une option dans un HTMLSelectElement et d'autre dépendent de plusieurs options.
    !ATTENTION! lors d'une modification d'image il faut impérativement garder le même nom.
#### 4. Pages
    Le dossier page contient le code php et html des différentes pages. C'est dans ces pages que les scripts JavaScript et les feuilles de
    style CSS sont appelée. 
    !ATTENTION! certaine page JavaScript nécessite d'autre page pour leurs bon fonctionnement il est donc 
    nécessaire de bien appelée toute les pages dans les import de .

    Le dossier contient aussi un dossier ressource qui contient les menus, footer, et différents template pour le site
#### 5. Scripts
    Le dossier scripts contient les pages JavaScript
#### 6. Serveur
    Le dossier serveur contient les scripts python qui permettent de générer les devis.
    !ATTENTION! il est important de bien vérifier que les chemins des fichiers sont correctes.
#### 7. Style
    Le dossier style contient les feuilles de style CSS du site.
    !ATTENTION! il est important de bien vérifier que les chemins des fichiers sont correctes.
### 2. Explication des classes
### 3. Mise à jour du site
