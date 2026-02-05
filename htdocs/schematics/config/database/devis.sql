CREATE TABLE IF NOT EXISTS devis_genere(
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- identification du devis
    reference VARCHAR(50) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    date_generation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_devis DATE NOT NULL,
    
    -- clé requise pour enregistrer un devis
    affaire VARCHAR(100) NOT NULL,
    installateur_entreprise VARCHAR(100) NOT NULL,

    -- Informations obligatoire
    type_devis VARCHAR(50) NOT NULL DEFAULT 'CHIFFRAGE ESTIMATIF',
    cout_total_ht DECIMAL(10,2) NOT NULL,
    cout_total_ttc DECIMAL(10,2) NOT NULL,
    taux_remise DECIMAL(5,2) NOT NULL DEFAULT 0,
    taux_tva DECIMAL(5,2) NOT NULL DEFAULT 20,
    code_tva INT NOT NULL DEFAULT 3,

    -- Informations complémentaires
    objet VARCHAR(255),
    installateur_nom_prenom VARCHAR(100),
    installateur_mail VARCHAR(255),
    affaire_suivie_par VARCHAR(100),
    mode_reglement VARCHAR(255),
    validite VARCHAR(100),
    delai_livraison VARCHAR(255),

    UNIQUE KEY unique_ref_version (reference, version)  -- <-- couple unique
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