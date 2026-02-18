-- 1. drop the table category_article
DROP TABLE IF EXISTS category_article;


-- 2. recreate the table
CREATE TABLE IF NOT EXISTS category_article (
    category_id VARCHAR(25) NOT NULL,
    article_ref VARCHAR(25) NOT NULL,

    PRIMARY KEY (category_id, article_ref),

    FOREIGN KEY (category_id)
        REFERENCES category(id)
        ON DELETE CASCADE,

    FOREIGN KEY (article_ref)
        REFERENCES article(ref)
        ON DELETE CASCADE
);

-- 3. Insert all rows
-- #####################################################################
--                          MODULE + ACCESSOIRE
-- #####################################################################
-- SC1Z
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES 
    ('module SC1Z', 'SC1ZBMOD'),
    ('module SC1Z', 'SC1ZBMOD500'),
    ('module SC1Z', 'SC1ZBPACMOD'),
    ('module SC1Z', 'SC1ZBPACMOD500'),
    ('kit SC1Z', 'SC1ZKIT'),
    ('kit SC1Z', 'SC1ZKIT50'),
    ('kit SC1Z', 'SC1ZKIT80');

-- SC1
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('module SC1', 'SC1BMOD'),
    ('kit SC1', 'SC1KIT'),
    ('kit SC1', 'SC1KIT50'),
    ('kit SC1', 'SC1KIT80'),
    ('kit SC1', 'SC1KIT140');

-- SC2
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('module SC2', 'SC2BMOD'),
    ('kit SC2', 'SC2KIT'),
    ('kit SC2', 'SC2KIT5050'),
    ('kit SC2', 'SC2KIT5080'),
    ('kit SC2', 'SC2KIT8080'),
    ('kit SC2', 'SC2KIT80140'),
    ('kit SC2', 'SC2KIT80200'),
    ('kit SC2', 'SC2KIT140200'),
    ('kit SC2', 'SC2KIT80'),
    ('kit SC2', 'SC2KIT140');

-- SC1K
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('module SC1K', 'SC1K1BMOD'),
    ('module SC1K', 'SC1K1,5BMOD'),
    ('kit SC1K', 'SC1K1KIT'),
    ('kit SC1K', 'SC1K1KIT5'),
    ('kit SC1K', 'SC1K1KIT10');

-- SC2K
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('module SC2K', 'SC2K1BMOD'),
    ('module SC2K', 'SC2K1,5BMOD'),
    ('kit SC2K', 'SC2K1KIT'),
    ('kit SC2K', 'SC2K1KIT5'),
    ('kit SC2K', 'SC2K1KIT10');

-- HydrauBox 1
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('module Hydraubox 1', 'HYBX1MOD'),
    ('kit Hydraubox', 'HYBXKIT');

-- HydrauBox 2
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('module Hydraubox 2', 'HYBX2MOD'),
    ('kit Hydraubox', 'HYBXKIT');

-- ECS
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('module ECS', 'SCECS'),
    ('module ECS', 'SCECSK'),
    ('kit ECS', 'SCECSKIT');

-- #####################################################################
--                          SC OPTIONS
-- #####################################################################

-- global options
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('options', 'KITSSC006'),
    ('options', 'KITSSC060'),
    ('options', 'OPT0016'),
    ('options', 'OPT0017'),
    ('options', 'OPT0031'),
    ('options', 'OPT0030'),
    ('options', 'OPT0018'),
    ('options', 'OPT0019'),
    ('options', 'OPT0028'),
    ('options', 'OPT0027');

-- collectif options
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('options col', 'KITSSC049'),
    ('options col', 'KITSSC179'),
    ('options col', 'OPT0021'),
    ('options col', 'OPT0022'),
    ('options col', 'OPT0023'),
    ('options col', 'OPT0024'),
    ('options col', 'KITSSC071'),
    ('options col', 'KITSSC072'),
    ('options col', 'KITSSC028');

-- collectif multi-zones
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('col multi zone', 'KITSSC148'),
    ('col multi zone', 'MOD0806'),
    ('col multi zone', 'KITSSC079'),
    ('col multi zone', 'KITSSC219'),
    ('col multi zone', 'KITSSC052'),
    ('col multi zone', 'KITSSC053'),
    ('col multi zone', 'KITSSC054'),
    ('col multi zone', 'KITSSC059');


-- upgrades
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('upgrade part', 'KITSSC031'),
    ('upgrade part', 'KITSSC105'),
    ('upgrade part', 'KITSSC107'),
    ('upgrade part', 'KITSSC106'),
    ('upgrade part', 'KITSSC085'),
    ('upgrade part', 'KITSSC126'),
    ('upgrade part', 'KITSSC127');


-- #####################################################################
--                       ACCESSOIRES SSC
-- #####################################################################

-- Bouclage sanitaire
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('SSC bouclage', 'MOD0275'),
    ('SSC bouclage', 'MOD0294'),
    ('SSC bouclage', 'MOD0044');

-- Flexibles pour liaison module - ballon(s) - Vases
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('SSC flexible', 'KITSSC222'),
    ('SSC flexible', 'KITSSC223'),
    ('SSC flexible', 'KITSSC179'),
    ('SSC flexible', 'KITSSC177'),
    ('SSC flexible', 'KITSSC220'),
    ('SSC flexible', 'KITSSC212'),
    ('SSC flexible', 'KITSSC175'),
    ('SSC flexible', 'KITSSC176'),
    ('SSC flexible', 'MOD0702'),
    ('SSC flexible', 'MOD0709'),
    ('SSC flexible', 'MOD0252');

-- Divers
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('SSC divers', 'MOD0165'),
    ('SSC divers', 'MOD0700'),
    ('SSC divers', 'KITSSC139'),
    ('SSC divers', 'KITSSC076'),
    ('SSC divers', 'KITSSC157'),
    ('SSC divers', 'KITSSC083'),
    ('SSC divers', 'MOD0072'),
    ('SSC divers', 'MOD0563'),
    ('SSC divers', 'MOD0310');

-- Kit circulateurs
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('SSC circulateurs', 'KITSSC066'),
    ('SSC circulateurs', 'KITSSC067'),
    ('SSC circulateurs', 'KITSSC091'),
    ('SSC circulateurs', 'KITSSC092'),
    ('SSC circulateurs', 'KITSSC093');


-- #####################################################################
--                          SC Piscine
-- #####################################################################

-- Kit piscine déporté
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit piscine déportée', 'KITSSC039'),
    ('kit piscine déportée', 'KITSSC041');

-- échangeur piscine
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('echangeur piscine', 'KITSSC016'),
    ('echangeur piscine', 'KITSSC029'),
    ('echangeur piscine', 'KITSSC089'),
    ('echangeur piscine', 'MOD0256'),
    ('echangeur piscine', 'MOD0459'),
    ('echangeur piscine', 'MOD0460'),
    ('echangeur piscine', 'MOD0324'),
    ('echangeur piscine', 'MOD0325'),
    ('echangeur piscine', 'KITSSC026'),
    ('echangeur piscine', 'MOD0377');

-- accessoires piscine
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('accessoires piscine', 'MOD0637'),
    ('accessoires piscine', 'MOD0023'),
    ('accessoires piscine', 'MOD0045');


-- #####################################################################
--                          BALLONS ECS + TAMPON
-- #####################################################################

-- Ballons Sanitaires simples échangeurs
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bal simple ech', 'BAL0116'),
    ('bal simple ech', 'BAL0167'),
    ('bal simple ech', 'BAL0168');

-- Ballons Sanitaires doubles échangeurs
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bal double ech', 'BAL0001'),
    ('bal double ech', 'BAL0002'),
    ('bal double ech', 'BAL0052'),
    ('bal double ech', 'BAL0112'),
    ('bal double ech', 'BAL0113'),
    ('bal double ech', 'BAL0018'),
    ('bal double ech', 'BAL0114'),
    ('bal double ech', 'BAL0115'),
    ('bal double ech', 'BAL0093'),
    ('bal double ech', 'BAL0021'),
    ('bal double ech', 'BAL0101'),
    ('bal double ech', 'BAL0009'),
    ('bal double ech', 'BAL0086');

INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bal sans ech', 'BAL0036'),
    ('bal sans ech', 'BAL0037');

-- Ballons Tampons avec un échangeur bas
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bal tamp ech bas', 'BAL0079'),
    ('bal tamp ech bas', 'BAL0058'),
    ('bal tamp ech bas', 'BAL0064'),
    ('bal tamp ech bas', 'BAL0082');

-- Ballons Tampons avec un échangeur total
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bal tamp ech total', 'BAL0085'),
    ('bal tamp ech total', 'BAL0028'),
    ('bal tamp ech total', 'BAL0087'),
    ('bal tamp ech total', 'BAL0088'),
    ('bal tamp ech total', 'BAL0059'),
    ('bal tamp ech total', 'BAL0138'),
    ('bal tamp ech total', 'BAL0006'),
    ('bal tamp ech total', 'BAL0055'),
    ('bal tamp ech total', 'BAL0063'),
    ('bal tamp ech total', 'BAL0152'),
    ('bal tamp ech total', 'BAL0066');

-- Ballons Tampons sans échangeur
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bal tamp sans ech', 'BAL0103'),
    ('bal tamp sans ech', 'BAL0117'),
    ('bal tamp sans ech', 'BAL0161'),
    ('bal tamp sans ech', 'BAL0162'),
    ('bal tamp sans ech', 'BAL0163'),
    ('bal tamp sans ech', 'BAL0166'),
    ('bal tamp sans ech', 'BAL0033'),
    ('bal tamp sans ech', 'BAL0061'),
    ('bal tamp sans ech', 'BAL0062'),
    ('bal tamp sans ech', 'BAL0078'),
    ('bal tamp sans ech', 'BAL0081')
;

-- Ballons Tampons avec serpentin sanitaire Inox
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bal tamp inox', 'BAL0094'),
    ('bal tamp inox', 'BAL0099'),
    ('bal tamp inox', 'BAL0102'),
    ('bal tamp inox', 'BAL0098'),
    ('bal tamp inox', 'BAL0095');

-- #####################################################################
--                          CAPTEURS
-- #####################################################################

-- capteurs SID2,5
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'capteurs', ref
FROM article
WHERE ref REGEXP '^SID2,5-(A|T)' AND is_used = 1;

-- capteurs S7 2,5
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'capteurs', ref
FROM article
WHERE ref REGEXP '^S7 2,5-(ST|CT|CS|CM|V)' AND is_used = 1;

-- capteurs SH 2,5
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'capteurs', ref
FROM article
WHERE ref REGEXP '^SH 2,5-(ST|CT|CS|CM|V)' AND is_used = 1;

-- capteurs S7 2,5 black frame
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'capteurs', ref
FROM article
WHERE ref REGEXP '^S7 2,5B-(ST|CT|CS|CM|V)' AND is_used = 1;

-- capteurs S7 2 portrait
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'capteurs', ref
FROM article
WHERE ref REGEXP '^S7-(ST|CT|CS|CM|V)' AND is_used = 1;

-- capteurs S7 2 paysage
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'capteurs', ref
FROM article
WHERE ref REGEXP '^SH 2-(ST|CT|CS|CM|V)' AND is_used = 1;

-- capteurs SM 2,3
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'capteurs', ref
FROM article
WHERE ref REGEXP '^SM 2,3-' AND is_used = 1;

-- capteurs SMV 2,3
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'capteurs', ref
FROM article
WHERE ref REGEXP '^SMV 2,3-' AND is_used = 1;


-- #####################################################################
--                          HABILLAGE CAPTEURS
-- #####################################################################

-- habillage S7
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('habillage capteur S7', 'KITCS7 2'),
    ('habillage capteur S7', 'KITCS7 3'),
    ('habillage capteur S7', 'KITCS7 4'),
    ('habillage capteur S7', 'KITCS7 5'),
    ('habillage capteur S7', 'KITCS7 6')
;

-- habillage S7 2,5
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('habillage capteur S7 2,5', 'KITCS7 2,5-2'),
    ('habillage capteur S7 2,5', 'KITCS7 2,5-3'),
    ('habillage capteur S7 2,5', 'KITCS7 2,5-4'),
    ('habillage capteur S7 2,5', 'KITCS7 2,5-5'),
    ('habillage capteur S7 2,5', 'KITCS7 2,5-6')
;

-- #####################################################################
--                          FIXATION CAPTEURS
-- #####################################################################

-- fixation S7
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'kit fix capt S7', ref
FROM article
WHERE ref REGEXP '^FIX-S7-HL-' AND is_used = 1;

-- fixation SH
INSERT IGNORE INTO category_article (category_id, article_ref)
SELECT 'kit fix capt SH', ref
FROM article
WHERE ref REGEXP '^FIX-SH-HL-' AND is_used = 1;


-- #####################################################################
--                  BITUBE / MONOTUBE / KIT DE RACCORDEMENT
-- #####################################################################

-- Bitube inox DN16
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bitube DN16', 'MOD0752'),
    ('bitube DN16', 'MOD0753'),
    ('bitube DN16', 'MOD0697');

-- Bitube inox DN20
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bitube DN20', 'MOD0757'),
    ('bitube DN20', 'MOD0758'),
    ('bitube DN20', 'MOD0759'),
    ('bitube DN20', 'MOD0760');

-- Bitube inox DN25
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('bitube DN25', 'MOD0102'),
    ('bitube DN25', 'MOD0233'),
    ('bitube DN25', 'MOD0272'),
    ('bitube DN25', 'MOD0263');

-- Monotube Inox
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('monotube inox', 'MOD0225'),
    ('monotube inox', 'MOD0276'),
    ('monotube inox', 'MOD0408'),
    ('monotube inox', 'KITCAP002'),
    ('monotube inox', 'MOD0409'),
    ('monotube inox', 'KITCAP003'),
    ('monotube inox', 'MOD0784');

-- Kit de raccordement DN16
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit DN16', 'MOD0430'),
    ('kit DN16', 'KITCAP006'),
    ('kit DN16', 'KITCAP011'),
    ('kit DN16', 'KITCAP010'),
    ('kit DN16', 'MOD0755'),
    ('kit DN16', 'KITCAP005');

-- Kit de raccordement DN20
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit DN20', 'MOD0431'),
    ('kit DN20', 'KITCAP015'),
    ('kit DN20', 'KITCAP012'),
    ('kit DN20', 'KITCAP009'),
    ('kit DN20', 'MOD0762'),
    ('kit DN20', 'KITCAP004');

-- Kit de raccordement DN25
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit DN25', 'MOD0432'),
    ('kit DN25', 'KITCAP016'),
    ('kit DN25', 'KITCAP014'),
    ('kit DN25', 'KITCAP008'),
    ('kit DN25', 'KITCAP013'),
    ('kit DN25', 'MOD0795'),
    ('kit DN25', 'KITSSC055');

-- Kit de raccordement DN32
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit DN32', 'MOD0244'),
    ('kit DN32', 'KITSSC146');


-- #####################################################################
--                          CES
-- #####################################################################

-- =====================================================
-- CESI
-- =====================================================
-- kit CESI regul
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit CESI regul', 'ECSCESI_18L'),
    ('kit CESI regul', 'ECSCESI_35L'),
    ('kit CESI regul', 'ECSCESI_50L'),
    ('kit CESI regul', 'ECSCESI400S')
;

-- kit CESI bal
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit CESI bal', 'KITCESI-200'),
    ('kit CESI bal', 'KITCESI-300'),
    ('kit CESI bal', 'KITCESI-400'),
    ('kit CESI bal', 'KITCESI-600'),
    ('kit CESI bal', 'KITCESI-800');

-- accessoires CESI
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('accessoires CESI', 'MOD0771'),
    ('accessoires CESI', 'KITSSC002'),
    ('accessoires CESI', 'BAL0158');

-- =====================================================
-- CESC
-- =====================================================
-- Régulation Solisart
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('CESC regul', 'CESC1'),
    ('CESC regul', 'CESC1KIT'),
    ('CESC regul', 'CESC2'),
    ('CESC regul', 'CESC2KIT');

-- Station solaire Resol
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('CESC resol', 'MOD0500'),
    ('CESC resol', 'MOD0524'),
    ('CESC resol', 'MOD0197'),
    ('CESC resol', 'MOD0522'),
    ('CESC resol', 'MOD0266'),
    ('CESC resol', 'MOD0521'),
    ('CESC resol', 'MOD0163'),
    ('CESC resol', 'MOD0533'),
    ('CESC resol', 'KITSSC069'),
    ('CESC resol', 'KITSSC084');

-- Groupes production ECS instantanée - échangeur Inox
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('CESC prod', 'MOD0367'),
    ('CESC prod', 'MOD0347'),
    ('CESC prod', 'MOD0350'),
    ('CESC prod', 'MOD0352'),
    ('CESC prod', 'KITECS006'),
    ('CESC prod', 'KITECS003'),
    ('CESC prod', 'KITECS004'),
    ('CESC prod', 'KITECS005'),
    ('CESC prod', 'MOD0349'),
    ('CESC prod', 'MOD0351'),
    ('CESC prod', 'MOD0355'),
    ('CESC prod', 'MOD0368'),
    ('CESC prod', 'MOD0348'),
    ('CESC prod', 'MOD0380'),
    ('CESC prod', 'MOD0381');

-- kit comptage eau sanitaire
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit comptage eau', 'KITCPT005'),
    ('kit comptage eau', 'KITCPT006'),
    ('kit comptage eau', 'KITCPT007'),
    ('kit comptage eau', 'KITCPT003');

-- kit comptage tuyauterie horizontale Circuit solaire ou Chauffage
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit comptage tuyau', 'KITCPT008'),
    ('kit comptage tuyau', 'KITCPT009'),
    ('kit comptage tuyau', 'KITCPT010'),
    ('kit comptage tuyau', 'CPT0042'),
    ('kit comptage tuyau', 'CPT0041'),
    ('kit comptage tuyau', 'CPT0019'),
    ('kit comptage tuyau', 'KITCPT014');

-- centrale d'acquisition
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit comptage centrale', 'KITCPT004'),
    ('kit comptage centrale', 'CPT0036'),
    ('kit comptage centrale', 'CPT0017'),
    ('kit comptage centrale', 'MOD0191'),
    ('kit comptage centrale', 'CPT0022'),
    ('kit comptage centrale', 'CPT0016'),
    ('kit comptage centrale', 'CPT0023');

-- accessoires comptage / CESC
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit comptage accessoires', 'MOD0275'),
    ('kit comptage accessoires', 'MOD0294'),
    ('kit comptage accessoires', 'MOD0650'),
    ('kit comptage accessoires', 'MOD0734'),
    ('kit comptage accessoires', 'KITSSC002'),
    ('kit comptage accessoires', 'MOD0173'),
    ('kit comptage accessoires', 'MOD0398'),
    ('kit comptage accessoires', 'MOD0665');


-- #####################################################################
--                       CAPTEURS DÉPORTÉS
-- #####################################################################

-- Kit V3V
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit V3V', 'KITSSC018'),
    ('kit V3V', 'KITSSC235');

-- Module solaire 1 colonne pour casse-pression
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('mod sol 1 col', 'KITSSC197'),
    ('mod sol 1 col', 'KITSSC189'),
    ('mod sol 1 col', 'KITSSC190');

-- Kit à rajouter au module solaire 1 colonne
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit sol 1 col', 'KITSSC206'),
    ('kit sol 1 col', 'KITSSC207'),
    ('kit sol 1 col', 'KITSSC208'),
    ('kit sol 1 col', 'KITSSC209');

-- Module solaire 2 colonnes pour échangeur à plaques
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('mod sol 2 col', 'KITSSC199'),
    ('mod sol 2 col', 'KITSSC191'),
    ('mod sol 2 col', 'KITSSC192'),
    ('mod sol 2 col', 'MOD0197'),
    ('mod sol 2 col', 'MOD0506');

-- Kit à rajouter au module solaire 2 colonnes pour créer les options kit capteurs déportés sur échangeur à plaques
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('kit sol 2 col', 'KITSSC226'),
    ('kit sol 2 col', 'KITSSC200'),
    ('kit sol 2 col', 'KITSSC201'),
    ('kit sol 2 col', 'KITSSC202'),
    ('kit sol 2 col', 'KITSSC203'),
    ('kit sol 2 col', 'KITSSC204'),
    ('kit sol 2 col', 'KITSSC227'),
    ('kit sol 2 col', 'KITSSC211'),
    ('kit sol 2 col', 'KITSSC205'),
    ('kit sol 2 col', 'KITSSC210'),
    ('kit sol 2 col', 'KITSSC228'),
    ('kit sol 2 col', 'KITSSC229'),
    ('kit sol 2 col', 'KITSSC230'),
    ('kit sol 2 col', 'KITSSC231'),
    ('kit sol 2 col', 'KITSSC232');


-- #####################################################################
--          Résistances, réchauffeurs, brides et anodes
-- #####################################################################

-- Résistances électriques immergées
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('resistance', 'BAL0158'),
    ('resistance', 'BAL0023'),
    ('resistance', 'BAL0024'),
    ('resistance', 'BAL0025'),
    ('resistance', 'BAL0065');

-- Réchauffeurs de boucle
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('rechauffeur de boucle', 'MOD0315'),
    ('rechauffeur de boucle', 'MOD0306'),
    ('rechauffeur de boucle', 'MOD0801'),
    ('rechauffeur de boucle', 'MOD0340'),
    ('rechauffeur de boucle', 'MOD0341'),
    ('rechauffeur de boucle', 'MOD0316'),
    ('rechauffeur de boucle', 'KITSSC035'),
    ('rechauffeur de boucle', 'KITSSC234');

-- Brides
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('brides', 'BAL0068'),
    ('brides', 'BAL0069'),
    ('brides', 'BAL0035'),
    ('brides', 'BAL0034'),
    ('brides', 'BAL0142');

-- Anodes
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('anodes', 'BAL0017'),
    ('anodes', 'BAL0104'),
    ('anodes', 'BAL0105'),
    ('anodes', 'BAL0074'),
    ('anodes', 'BAL0073'),
    ('anodes', 'BAL0148'),
    ('anodes', 'BAL0149')
;


-- #####################################################################
--                VASES, MITIGEURS ET DÉCOUPLAGE HYDRAU
-- #####################################################################

-- Vases ECS
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('vases ECS', 'MOD0004'),
    ('vases ECS', 'MOD0168'),
    ('vases ECS', 'MOD0166'),
    ('vases ECS', 'MOD0172'),
    ('vases ECS', 'MOD0190'),
    ('vases ECS', 'MOD0237'),
    ('vases ECS', 'MOD0238'),
    ('vases ECS', 'MOD0299');

-- Vases chauffage
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('vases chauffage', 'MOD0573'),
    ('vases chauffage', 'MOD0002'),
    ('vases chauffage', 'MOD0003'),
    ('vases chauffage', 'MOD0785'),
    ('vases chauffage', 'MOD0786'),
    ('vases chauffage', 'MOD0787'),
    ('vases chauffage', 'MOD0788'),
    ('vases chauffage', 'MOD0789'),
    ('vases chauffage', 'MOD0790');

-- Pièces pour vase
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pieces vase', 'KITSSC003'),
    ('pieces vase', 'MOD0135');

-- Mitigeur Thermostatique
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('mitigeur', 'MOD0022'),
    ('mitigeur', 'MOD0192'),
    ('mitigeur', 'MOD0193'),
    ('mitigeur', 'MOD0194'),
    ('mitigeur', 'MOD0195'),
    ('mitigeur', 'MOD0196');

-- Découplage hydraulique par bouteille casse pression
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('decouplage CP', 'KITSSC046'),
    ('decouplage CP', 'KITSSC155'),
    ('decouplage CP', 'KITSSC113'),
    ('decouplage CP', 'KITSSC075'),
    ('decouplage CP', 'KITSSC059'),
    ('decouplage CP', 'KITSSC123'),
    ('decouplage CP', 'MOD0531'),
    ('decouplage CP', 'BAL0157'),
    ('decouplage CP', 'BAL0103'),
    ('decouplage CP', 'BAL0117');

-- Découplage hydraulique par échangeurs à plaques inox
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('decouplage ech', 'MOD0459'),
    ('decouplage ech', 'MOD0460'),
    ('decouplage ech', 'MOD0324'),
    ('decouplage ech', 'MOD0325'),
    ('decouplage ech', 'MOD0504'),
    ('decouplage ech', 'MOD0505');


-- #####################################################################
--                         PIÈCES DÉTACHÉES
-- #####################################################################

-- Clapet
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces clapet', 'MOD0008'),
    ('pièces clapet', 'MOD0151'),
    ('pièces clapet', 'MOD0011'),
    ('pièces clapet', 'MOD0740');

-- Té et Raccords
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces racc', 'MOD0822'),
    ('pièces racc', 'MOD0625'),
    ('pièces racc', 'MOD0016'),
    ('pièces racc', 'MOD0668'),
    ('pièces racc', 'MOD0075'),
    ('pièces racc', 'MOD0456'),
    ('pièces racc', 'MOD0800');

-- Vannes
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces vannes', 'MOD0650'),
    ('pièces vannes', 'MOD0561'),
    ('pièces vannes', 'MOD0012'),
    ('pièces vannes', 'MOD0613'),
    ('pièces vannes', 'MOD0614'),
    ('pièces vannes', 'MOD0054'),
    ('pièces vannes', 'MOD0055'),
    ('pièces vannes', 'MOD0056'),
    ('pièces vannes', 'MOD0057'),
    ('pièces vannes', 'MOD0058'),
    ('pièces vannes', 'MOD0704'),
    ('pièces vannes', 'MOD0087'),
    ('pièces vannes', 'MOD0088'),
    ('pièces vannes', 'MOD0089');

-- V3V
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces V3V', 'MOD0059'),
    ('pièces V3V', 'MOD0060'),
    ('pièces V3V', 'MOD0061'),
    ('pièces V3V', 'MOD0381'),
    ('pièces V3V', 'MOD0803'),
    ('pièces V3V', 'MOD0275'),
    ('pièces V3V', 'MOD0294');

-- Carrosserie, module SolisConfort
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces carrosserie', 'MOD0651'),
    ('pièces carrosserie', 'MOD0486'),
    ('pièces carrosserie', 'MOD0228'),
    ('pièces carrosserie', 'MOD0116');

-- Joints EPDM solaires Ep 3mm
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces joints', 'MOD0675'),
    ('pièces joints', 'MOD0633'),
    ('pièces joints', 'MOD0733'),
    ('pièces joints', 'MOD0404'),
    ('pièces joints', 'KITSSC025'),
    ('pièces joints', 'KITSSC024'),
    ('pièces joints', 'KITSSC221');

-- Capteur solaire seul, sans abergement ni patte de fixation
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces capteur', 'CAP0036'),
    ('pièces capteur', 'CAP0031'),
    ('pièces capteur', 'CAP0328'),
    ('pièces capteur', 'CAP0240'),
    ('pièces capteur', 'CAP0241'),
    ('pièces capteur', 'CAP0200'),
    ('pièces capteur', 'CAP0093'),
    ('pièces capteur', 'CAP0165'),
    ('pièces capteur', 'CAP0201'),
    ('pièces capteur', 'CAP0242'),
    ('pièces capteur', 'CAP0273');

-- Régulation SolisConfort
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces regul', 'MOD0635'),
    ('pièces regul', 'MOD0574'),
    ('pièces regul', 'MOD0183'),
    ('pièces regul', 'MOD0640'),
    ('pièces regul', 'MOD0297'),
    ('pièces regul', 'MOD0721'),
    ('pièces regul', 'MOD0720'),
    ('pièces regul', 'MOD0719'),
    ('pièces regul', 'MOD0718'),
    ('pièces regul', 'MOD0717'),
    ('pièces regul', 'MOD0165'),
    ('pièces regul', 'MOD0283'),
    ('pièces regul', 'MOD0700');

-- Sonde de température
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces sonde', 'MOD0656'),
    ('pièces sonde', 'MOD0388'),
    ('pièces sonde', 'MOD0045'),
    ('pièces sonde', 'MOD0046'),
    ('pièces sonde', 'MOD0403'),
    ('pièces sonde', 'MOD0274'),
    ('pièces sonde', 'MOD0513'),
    ('pièces sonde', 'MOD0048');

-- Circulateurs
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces circulateurs', 'MOD0042'),
    ('pièces circulateurs', 'MOD0043'),
    ('pièces circulateurs', 'MOD0426'),
    ('pièces circulateurs', 'MOD0725'),
    ('pièces circulateurs', 'MOD0498');

-- Soupapes
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces soupapes', 'MOD0020'),
    ('pièces soupapes', 'MOD0410'),
    ('pièces soupapes', 'KITSCC239'),
    ('pièces soupapes', 'MOD0779');

-- Composants divers
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces divers', 'MOD0049'),
    ('pièces divers', 'KITSSC002'),
    ('pièces divers', 'MOD0187'),
    ('pièces divers', 'MOD0021'),
    ('pièces divers', 'MOD0398'),
    ('pièces divers', 'MOD0665'),
    ('pièces divers', 'MOD0023'),
    ('pièces divers', 'MOD0311'),
    ('pièces divers', 'MOD0342'),
    ('pièces divers', 'KITSSC052'),
    ('pièces divers', 'KITSSC053'),
    ('pièces divers', 'KITSSC054'),
    ('pièces divers', 'KITSSC079'),
    ('pièces divers', 'KITSSC148'),
    ('pièces divers', 'KITSSC219'),
    ('pièces divers', 'KITSSC236'),
    ('pièces divers', 'KITSSC237'),
    ('pièces divers', 'KITSSC238'),
    ('pièces divers', 'KITSSC239'),
    ('pièces divers', 'MOD0014'),
    ('pièces divers', 'MOD0109'),
    ('pièces divers', 'MOD0110'),
    ('pièces divers', 'MOD0213'),
    ('pièces divers', 'MOD0216'),
    ('pièces divers', 'MOD0218'),
    ('pièces divers', 'MOD0313'),
    ('pièces divers', 'MOD0653'),
    ('pièces divers', 'MOD0672'),
    ('pièces divers', 'MOD0706'),
    ('pièces divers', 'MOD0767'),
    ('pièces divers', 'MOD0781'),
    ('pièces divers', 'MOD0806'),
    ('pièces divers', 'MOD0808'),
    ('pièces divers', 'MOD0809'),
    ('pièces divers', 'MOD0817'),
    ('pièces divers', 'MOD0819'),
    ('pièces divers', 'MOD0820'),
    ('pièces divers', 'MOD0821'),
    ('pièces divers', 'MOD0824'),
    ('pièces divers', 'MOD0834'),
    ('pièces divers', 'MOD0835'),
    ('pièces divers', 'ECSECH01');

-- Outillage installateur
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('pièces outillage', 'OUT001'),
    ('pièces outillage', 'OUT002'),
    ('pièces outillage', 'OUT003'),
    ('pièces outillage', 'OUT004'),
    ('pièces outillage', 'OUT005'),
    ('pièces outillage', 'OUT006'),
    ('pièces outillage', 'OUT008'),
    ('pièces outillage', 'OUT009'),
    ('pièces outillage', 'OUT010');


-- #####################################################################
--                    SERVICES ET TRANSPORTS
-- #####################################################################

-- Assistance à la mise en service
-- Sur installation individuelle
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('assistance ind', 'MISE001'),
    ('assistance ind', 'MISE008'),
    ('assistance ind', 'MISE012'),
    ('assistance ind', 'MISE011'),
    ('assistance ind', 'ETUD001');

-- Sur installation collectif
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('assistance col', 'MISE003'),
    ('assistance col', 'MISE015'),
    ('assistance col', 'MISE019'),
    ('assistance col', 'MISE004'),
    ('assistance col', 'MISE016'),
    ('assistance col', 'MISE017'),
    ('assistance col', 'MISE010');

-- Transport
INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
    ('transport', 'TRANS001'),
    ('transport', 'TRANS002'),
    ('transport', 'TRANS003'),
    ('transport', 'TRANS006'),
    ('transport', 'TRANS010'),
    ('transport', 'TRANS020'),
    ('transport', 'TRANS030'),
    ('transport', 'TRANS060'),
    ('transport', 'TRANS007'),
    ('transport', 'TRANS008'),
    ('transport', 'TRANS009');

-- -- France sauf Corse
-- INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
--     ('transport fr', 'TRANS001'),
--     ('transport fr', 'TRANS002'),
--     ('transport fr', 'TRANS003'),
--     ('transport fr', 'TRANS006');

-- -- Belgique - Luxembourg
-- INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
--     ('transport belglux', 'TRANS010'),
--     ('transport belglux', 'TRANS020'),
--     ('transport belglux', 'TRANS030'),
--     ('transport belglux', 'TRANS060');

-- -- Divers
-- INSERT IGNORE INTO category_article (category_id, article_ref) VALUES
--     ('transport divers', 'TRANS007'),
--     ('transport divers', 'TRANS008'),
--     ('transport divers', 'TRANS009');




    


