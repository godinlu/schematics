-- 1. Déconnecter les articles de leurs catégories
UPDATE article
SET category_id = NULL;

-- 2. Supprimer la table catégories
ALTER TABLE article DROP FOREIGN KEY fk_category;
DROP TABLE IF EXISTS category;

-- 3. Recréer la table
CREATE TABLE category (
    id VARCHAR(25) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id VARCHAR(25) NULL,
    priority INT NOT NULL AUTO_INCREMENT UNIQUE,
    CONSTRAINT fk_parent
        FOREIGN KEY (parent_id)
        REFERENCES category(id)
        ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id) 
);

ALTER TABLE article
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id)
REFERENCES category(id)
ON DELETE SET NULL
ON UPDATE CASCADE;


-- 4. insertion de toute les catégories
INSERT INTO category (id, name, parent_id) VALUES
('articles', 'Articles', NULL),
    ('SC part', 'Module de chauffage solaire', 'articles'),
        ('module', "Module de chauffage", 'SC part'),
            ('module SC1Z', "Gamme SC1Z", 'module'),
            ('module SC1', "Gamme SC1", 'module'),
            ('module SC2', "Gamme SC2", 'module'),
            ('module SC1K', "Gamme SC1K", 'module'),
            ('module SC2K', "Gamme SC2K", 'module'),
            ('module Hydraubox 1', "Gamme Hydraubox 1", 'module'),
            ('module Hydraubox 2', "Gamme Hydraubox 2", 'module'),
        ('SC kit', 'SC Kit (sondes, mitigeur thermostatique, bidons de fluide glycolé, vase …)', 'SC part'),
            ('kit SC1Z', "Gamme SC1Z", 'SC kit'),
            ('kit SC1', "Gamme SC1", 'SC kit'),
            ('kit SC2', "Gamme SC2", 'SC kit'),
            ('kit SC1K', "Gamme SC1K", 'SC kit'),
            ('kit SC2K', "Gamme SC2K", 'SC kit'),
            ('kit Hydraubox', "Gamme Hydraubox 1", 'SC kit'),
        ('options', 'Options', 'SC part'),
        ('options col', 'Options Collectif', 'SC part'),
        ('upgrade part', 'Upgrades', 'SC part'),
        ('accessoires SSC', 'Accessoires SSC', 'SC part'),
            ('SSC bouclage', 'Bouclage sanitaire', 'accessoires SSC'),
            ('SSC flexible', 'Flexibles pour liaison module - ballon(s) - Vases', 'accessoires SSC'),
            ('SSC divers', 'Divers', 'accessoires SSC'),
            ('SSC circulateurs', 'Kit circulateurs', 'accessoires SSC'),
        ('kit piscine', 'Kit Piscine', 'SC part'),
            ('kit piscine déportée', 'Kit Piscine déportée', 'kit piscine'),
            ('echangeur piscine', 'Echangeur piscine', 'kit piscine'),
            ('accessoires piscine', 'Accessoires piscine', 'kit piscine'),
    ('ballon part', 'Ballons', 'articles'),
        ('ballon ECS', 'Ballon ECS', 'ballon part'),
            ('bal simple ech', 'Ballon Sanitaire simple échangeur HT (95°C)', 'ballon ECS'),
            ('bal double ech', 'Ballon Sanitaire double échangeur HT (95°C)', 'ballon ECS'),
        ('ballon tampon', 'Ballon Tampon', 'ballon part'),
            ('bal tamp ech bas', 'Ballon Tampon avec un échangeur bas', 'ballon tampon'),
            ('bal tamp ech total', 'Ballon Tampon avec un échangeur total', 'ballon tampon'),
            ('bal tamp sans ech', 'Ballon Tampon sans échangeur', 'ballon tampon'),
            ('bal tamp inox', 'Ballon Tampon avec serpentin sanitaire Inox', 'ballon tampon'),
    ('capteur part', 'Capteurs solaires thermiques', 'articles'),
        ('capteurs', 'Champs capteurs', 'capteur part'),
        ('capteurs racc', 'Liaison Capteur', 'capteur part'),
            ('bitube inox', 'Bitube Inox', 'capteurs racc'),
                ('bitube DN16', 'Bitube Inox DN16', 'bitube inox'),
                ('bitube DN20', 'Bitube Inox DN20', 'bitube inox'),
                ('bitube DN25', 'Bitube Inox DN25', 'bitube inox'),
            ('monotube inox', 'Monotube Inox', 'capteurs racc'),
            ('kit racc', 'Kit de Raccordement', 'capteurs racc'),
                ('kit DN16', 'Kit de Raccordement DN16', 'kit racc'),
                ('kit DN20', 'Kit de Raccordement DN20', 'kit racc'),
                ('kit DN25', 'Kit de Raccordement DN25', 'kit racc'),
                ('kit DN32', 'Kit de Raccordement DN32', 'kit racc'),
        ('CES', 'CES', 'capteur part'),
            ('CESI', 'Chauffe-eau solaire individuel (CESI)', 'CES'),
                ('kit CESI regul', 'Kit CESI avec régulation, vase, vanne d''arrêt et 20 L Solisgel', 'CESI'),
                ('kit CESI bal', 'Kit CESI avec ballon, liaison bitube 15 m, régulation', 'CESI'),
                ('accessoires CESI', 'Accessoires', 'CESI'),
            ('CESC', 'Chauffe-eau solaire collectif (CESC)', 'CES'),
                ('CESC regul','Régulation Solisart', 'CESC'),
                ('CESC resol','Station solaire Resol', 'CESC'),
                ('CESC prod','Groupes production ECS instantannée - échangeur Inox', 'CESC'),
                ('CESC comptage','Comptage énergétique', 'CESC'),
                    ('kit comptage eau', 'Kit comptage Eau sanitaire', 'CESC comptage'),
                    ('kit comptage tuyau', 'Kit comptage tuyauterie horizontale Circuit solaire ou Chauffage', 'CESC comptage'),
                    ('kit comptage centrale', 'Centrale d''aquisition', 'CESC comptage'),
                    ('kit comptage accessoires', 'Accessoires', 'CESC comptage'),
        ('capteurs déportés', 'Capteurs déportés', 'capteur part'),
            ('kit V3V', 'Kit V3V', 'capteurs déportés'),
            ('mod sol 1 col', 'Module solaire 1 colonne pour casse-pression', 'capteurs déportés'),
            ('kit sol 1 col', 'Kit à rajouter au module solaire 1 colonne', 'capteurs déportés'),
            ('mod sol 2 col', 'Module solaire 2 colonnes pour échangeur à plaques', 'capteurs déportés'),
            ('kit sol 2 col', 'Kit à rajouter au module solaire 2 colonnes pour créer les options kit capteurs déportés sur échangeur à plaques', 'capteurs déportés'),
    ('elec anodes', 'Résistances, réchauffeurs, brides et anodes', 'articles'),
        ('resistance', 'Résistance électrique immergée sur piquage 1''1/2 (lg donnée du plat du piquage 1''1/2)', 'elec anodes'),
        ('rechauffeur de boucle', 'Réchauffeur de boucle sans contacteur de puissance ni relais', 'elec anodes'),
        ('brides', 'Brides', 'elec anodes'),
        ('anodes', 'Anodes', 'elec anodes'),
    ('vases', 'Vases, mitigeurs et découplage Hydrau', 'articles'),
        ('vases ECS', 'vase d''expansion ECS collectif Pneumatex P > 3 bars et <= 10 bars', 'vases'),
        ('vases chauffage', 'Vase d''expansion chauffage Pneumatex < 3 bars', 'vases'),
        ('pieces vase', 'Pièces pour vase', 'vases'),
        ('mitigeur', 'Mitigeur Thermostatique, plage 38-60°C', 'vases'),
        ('decouplage CP', 'Découplage hydraulique par bouteille casse pression', 'vases'),
        ('decouplage ech', 'Découplage hydraulique par échangeurs à plaques inox', 'vases'),
    ('pièces', 'Pièces Détachées', 'articles'),
        ('pièces clapet','Clapet','pièces'),
        ('pièces racc','Té et Raccords','pièces'),
        ('pièces vannes','Vannes','pièces'),
        ('pièces V3V','V3V','pièces'),
        ('pièces carrosserie','Carrosserie, module SolisConfort','pièces'),
        ('pièces joints','Joints EPDM solaires Ep 3mm','pièces'),
        ('pièces capteur','Capteur solaire seul, sans abergement ni patte de fixation','pièces'),
        ('pièces regul','Régulation SolisConfort','pièces'),
        ('pièces sonde','Sonde de température','pièces'),
        ('pièces circulateurs','Circulateurs','pièces'),
        ('pièces soupapes','Soupapes','pièces'),
        ('pièces divers','Composants divers','pièces'),
        ('pièces outillage','Outillage installateur (article sans remise installateur)','pièces'),
    ('service transport', 'Service et Transport', 'articles'),
        ('assistance', 'Assistance à la mise en service', 'service transport'),
            ('assistance ind', 'Sur installation individuelle', 'assistance'),
            ('assistance col', 'Sur installation collectif', 'assistance'),
        ('transport', 'Transport', 'service transport'),
            ('transport fr', 'France sauf Corse', 'transport'),
            ('transport belglux', 'Belgique - Luxembourg', 'transport'),
            ('transport divers', 'Divers', 'transport')
;
