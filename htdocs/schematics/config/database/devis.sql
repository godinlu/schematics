CREATE TABLE IF NOT EXISTS devis_genere(
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- infos du devis
    date_generation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(50) UNIQUE,
    objet VARCHAR(255) NOT NULL,
    cout_total DECIMAL(10,2) NOT NULL,
    taux_remise DECIMAL(5,2) NOT NULL DEFAULT 0,
    nom_commercial VARCHAR(150),
    statut ENUM('brouillon', 'finalise') DEFAULT 'brouillon',

    -- client
    client_prenom VARCHAR(100),
    client_nom VARCHAR(100),
    client_mail VARCHAR(255),
    client_code_postal VARCHAR(10),
    client_ville VARCHAR(100),

    -- installateur (snapshot)
    installateur_societe VARCHAR(150),
    installateur_prenom_nom VARCHAR(150),
    installateur_mail VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS devis_ligne (
    id INT PRIMARY KEY AUTO_INCREMENT,

    id_devis INT NOT NULL,
    article_ref VARCHAR(25),
    prix_tarif DECIMAL(10,2) NOT NULL,
    taux_remise DECIMAL(5,2) NOT NULL DEFAULT 0,
    quantite INT NOT NULL DEFAULT 1,
    cout_total DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_ligne_devis
        FOREIGN KEY (id_devis)
        REFERENCES devis_genere(id)
        ON DELETE CASCADE
);