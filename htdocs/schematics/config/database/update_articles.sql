-- ATTENTION : this refs are added into 2 different categories : 'MOD0275', 'MOD0294'

CREATE TABLE IF NOT EXISTS article (
    ref VARCHAR(25) PRIMARY KEY,
    label VARCHAR(255) NULL DEFAULT NULL,
    prix FLOAT NOT NULL DEFAULT 0,
    category_id VARCHAR(25) NULL DEFAULT NULL,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(id)
        ON DELETE SET NULL,
    INDEX idx_category_id (category_id) 
);


-- #####################################################################
--                          MODULE + ACCESSOIRE
-- #####################################################################
-- SC1Z
UPDATE article SET category_id = 'module SC1Z' WHERE ref in ("SC1ZBMOD", "SC1ZBMOD500", "SC1ZBPACMOD", "SC1ZBPACMOD500");
UPDATE article SET category_id = 'kit SC1Z' WHERE ref in ("SC1ZKIT", "SC1ZKIT50", "SC1ZKIT80");

-- SC1
UPDATE article SET category_id = 'module SC1' WHERE ref in ("SC1BMOD");
UPDATE article SET category_id = 'kit SC1' WHERE ref in ("SC1KIT", "SC1KIT50", "SC1KIT80", "SC1KIT140");

-- SC2
UPDATE article SET category_id = 'module SC2' WHERE ref in ("SC2BMOD");
UPDATE article SET category_id = 'kit SC2' WHERE ref in ("SC2KIT", "SC2KIT5050", "SC2KIT5080", "SC2KIT8080", "SC2KIT80140", "SC2KIT80200", "SC2KIT140200", "SC2KIT80", "SC2KIT140");

-- SC1K
UPDATE article SET category_id = 'module SC1K' WHERE ref in ("SC1K1BMOD", "SC1K1,5BMOD");
UPDATE article SET category_id = 'kit SC1K' WHERE ref in ("SC1K1KIT", "SC1K1KIT5", "SC1K1KIT10");

-- SC2K
UPDATE article SET category_id = 'module SC2K' WHERE ref in ("SC2K1BMOD", "SC2K1,5BMOD");
UPDATE article SET category_id = 'kit SC2K' WHERE ref in ("SC2K1KIT", "SC2K1KIT5", "SC2K1KIT10");

-- HydrauBox 1
UPDATE article SET category_id = 'module Hydraubox 1' WHERE ref in ("HYBX1MOD");
UPDATE article SET category_id = 'kit Hydraubox' WHERE ref in ("HYBXKIT");

-- HydrauBox 2
UPDATE article SET category_id = 'module Hydraubox 2' WHERE ref in ("HYBX2MOD");
UPDATE article SET category_id = 'kit Hydraubox' WHERE ref in ("HYBXKIT");

-- #####################################################################
--                          SC OPTIONS
-- #####################################################################

-- global options
UPDATE article SET category_id = "options" WHERE ref in ('KITSSC006','KITSSC060','OPT0016','OPT0017','OPT0031','OPT0030','OPT0018','OPT0019','OPT0028','OPT0027');

-- collectif options
UPDATE article SET category_id = "options col" WHERE ref in ('KITSSC049','KITSSC179','OPT0021','OPT0022','OPT0023','OPT0024','KITSSC071','KITSSC072','KITSSC028');

-- upgrades
UPDATE article SET category_id = "upgrade part" WHERE ref in ('KITSSC031','KITSSC105','KITSSC107','KITSSC106', 'KITSSC085', 'KITSSC126', 'KITSSC127');


-- #####################################################################
--                       ACCESSOIRES SSC
-- #####################################################################

-- Bouclage sanitaire
UPDATE article SET category_id = 'SSC bouclage' WHERE ref IN (
    'MOD0275', 'MOD0294', 'MOD0044'
);

-- Flexibles pour liaison module - ballon(s) - Vases
UPDATE article SET category_id = 'SSC flexible' WHERE ref IN (
    'KITSSC222', 'KITSSC223', 'KITSSC179', 'KITSSC177', 'KITSSC220',
    'KITSSC212', 'KITSSC175', 'KITSSC176', 'MOD0702', 'MOD0709',
    'MOD0252'
);

-- Divers
UPDATE article SET category_id = 'SSC divers' WHERE ref IN (
    'MOD0165', 'MOD0700', 'KITSSC139', 'KITSSC076', 'KITSSC157',
    'KITSSC083', 'MOD0072', 'MOD0563', 'MOD0310'
);

-- Kit circulateurs
UPDATE article SET category_id = 'SSC circulateurs' WHERE ref IN (
    'KITSSC066', 'KITSSC067', 'KITSSC091', 'KITSSC092', 'KITSSC093'
);


-- #####################################################################
--                          SC Piscine
-- #####################################################################

-- Kit piscine déporté
UPDATE article SET category_id = "kit piscine déportée" WHERE ref in ('KITSSC039', 'KITSSC041');

-- échangeur piscine
UPDATE article SET category_id = "echangeur piscine" WHERE ref in ('KITSSC016','KITSSC029','KITSSC089','MOD0256','MOD0459','MOD0460','MOD0324','MOD0325','KITSSC026','MOD0377');

-- accessoires piscine
UPDATE article SET category_id = "accessoires piscine" WHERE ref in ('MOD0637','MOD0023','MOD0045');


-- #####################################################################
--                          BALLONS ECS + TAMPON
-- #####################################################################

-- Ballons Sanitaires simples échangeurs
UPDATE article SET category_id = 'bal simple ech' WHERE ref in ("BAL0116", "BAL0167", "BAL0168");

-- Ballons Sanitaires doubles échangeurs
UPDATE article SET category_id = 'bal double ech' WHERE ref in ("BAL0001", "BAL0002", "BAL0052", "BAL0112", "BAL0113", "BAL0018", "BAL0114", "BAL0115", "BAL0093", "BAL0021", "BAL0101", "BAL0009", "BAL0086");

-- Ballons Tampons avec un échangeur bas
UPDATE article SET category_id = 'bal tamp ech bas' WHERE ref in ("BAL0079", "BAL0058", "BAL0064", "BAL0082");

-- Ballons Tampons avec un échangeur total
UPDATE article SET category_id = 'bal tamp ech total' WHERE ref in ("BAL0085", "BAL0028", "BAL0087", "BAL0088", "BAL0059", "BAL0138", "BAL0006", "BAL0055", "BAL0063", "BAL0152", "BAL0066");

-- Ballons Tampons sans échangeur
UPDATE article SET category_id = 'bal tamp sans ech' WHERE ref in ("BAL0103", "BAL0117", "BAL0161", "BAL0162", "BAL0163", "BAL0166", "BAL0033", "BAL0061", "BAL0062");

-- Ballons Tampons avec serpentin sanitaire Inox
UPDATE article SET category_id = 'bal tamp inox' WHERE ref in ("BAL0094", "BAL0099", "BAL0102", "BAL0098", "BAL0095");

-- Kit purgeur air + réduction sommet Ballon tampon
-- UPDATE article SET category_id = 29 WHERE ref = "KITSSC157";


-- #####################################################################
--                          CAPTEURS
-- #####################################################################

-- capteurs SID2,5
UPDATE article SET category_id = 'SID 2,5' WHERE ref REGEXP '^SID2,5-(A|T)';

-- capteurs S7 2,5
UPDATE article SET category_id = 'S7 2,5' WHERE ref REGEXP '^S7 2,5-(ST|CT|CS|V)';

-- capteurs SH 2,5
UPDATE article SET category_id = 'SH 2,5' WHERE ref REGEXP '^SH 2,5-(ST|CT|CS|V)';

-- capteurs S7 2,5 black frame
UPDATE article SET category_id = 'S7 2,5B' WHERE ref REGEXP '^S7 2,5B-(ST|CT|CS|V)';

-- capteurs S7 2 portrait
UPDATE article SET category_id = 'S7 2,0' WHERE ref REGEXP '^S7-(ST|CT|CS|V)';

-- capteurs S7 2 paysage
UPDATE article SET category_id = 'SH 2,0' WHERE ref REGEXP '^SH 2-(ST|CT|CS|V)';

-- #####################################################################
--                          BITUBE / MONOTUBE / KIT DE RACCORDEMENT
-- #####################################################################
-- Bitube inox DN16
UPDATE article SET category_id = 'bitube DN16' WHERE ref in ("MOD0752", "MOD0753", "MOD0697");

-- Bitube inox DN20
UPDATE article SET category_id = 'bitube DN20' WHERE ref in ("MOD0757", "MOD0758", "MOD0759", "MOD0760");

-- Bitube inox DN25
UPDATE article SET category_id = 'bitube DN25' WHERE ref in ("MOD0102", "MOD0233", "MOD0272", "MOD0263");

-- Monotube Inox
UPDATE article SET category_id = 'monotube inox' WHERE ref in ("MOD0225", "MOD0276", "MOD0408", "KITCAP002", "MOD0409", "KITCAP003", "MOD0784");

-- Kit de raccordement DN16
UPDATE article SET category_id = 'kit DN16' WHERE ref in ("MOD0430", "KITCAP006", "KITCAP011", "KITCAP010", "MOD0755", "KITCAP005");

-- Kit de raccordement DN20
UPDATE article SET category_id = 'kit DN20' WHERE ref in ("MOD0431", "KITCAP015", "KITCAP012", "KITCAP009", "MOD0762", "KITCAP004");

-- Kit de raccordement DN25
UPDATE article SET category_id = 'kit DN25' WHERE ref in ("MOD0432", "KITCAP016", "KITCAP014", "MOD0795", "KITSSC055");

-- Kit de raccordement DN32
UPDATE article SET category_id = 'kit DN32' WHERE ref in ("MOD0244", "KITSSC146");

-- #####################################################################
--                          CES
-- #####################################################################

-- =====================================================
-- CESI
-- =====================================================
-- kit CESI regul
UPDATE article SET category_id = 'kit CESI regul' WHERE ref IN ('ECSCESI_18L', 'ECSCESI_35L', 'ECSCESI_50L');

-- kit CESI bal
UPDATE article SET category_id = 'kit CESI bal' WHERE ref IN ('KITCESI-200', 'KITCESI-300', 'KITCESI-400', 'KITCESI-600', 'KITCESI-800');

-- accessoires CESI
UPDATE article SET category_id = 'accessoires CESI' WHERE ref IN ('MOD0771', 'KITSSC002', 'BAL0158');

-- =====================================================
-- CESC
-- =====================================================
-- Régulation Solisart
UPDATE article SET category_id = 'CESC regul' WHERE ref IN ('CESC1', 'CESC1KIT', 'CESC2', 'CESC2KIT');

-- Station solaire Resol
UPDATE article SET category_id = 'CESC resol' WHERE ref IN (
    'MOD0500', 'MOD0524', 'MOD0197', 'MOD0522', 'MOD0266', 'MOD0521',
    'MOD0163', 'MOD0533', 'KITSSC069', 'KITSSC084'
);

-- Groupes production ECS instantanée - échangeur Inox
UPDATE article SET category_id = 'CESC prod' WHERE ref IN (
    'MOD0367', 'MOD0347', 'MOD0350', 'MOD0352',
    'KITECS006', 'KITECS003', 'KITECS004', 'KITECS005',
    'MOD0349', 'MOD0351', 'MOD0355',
    'MOD0368', 'MOD0348', 'MOD0380', 'MOD0381'
);

-- kit comptage eau sanitaire
UPDATE article SET category_id = 'kit comptage eau' WHERE ref IN (
    'KITCPT005', 'KITCPT006', 'KITCPT007', 'KITCPT003'
);

-- kit comptage tuyauterie horizontale Circuit solaire ou Chauffage
UPDATE article SET category_id = 'kit comptage tuyau' WHERE ref IN (
    'KITCPT008', 'KITCPT009', 'KITCPT010',
    'CPT0042', 'CPT0041', 'CPT0019', 'KITCPT014'
);

-- centrale d'acquisition
UPDATE article SET category_id = 'kit comptage centrale' WHERE ref IN (
    'KITCPT004', 'CPT0036', 'CPT0017', 'MOD0191',
    'CPT0022', 'CPT0016', 'CPT0023'
);

-- accessoires comptage / CESC
UPDATE article SET category_id = 'kit comptage accessoires' WHERE ref IN (
    'MOD0275', 'MOD0294', 'MOD0650', 'MOD0734',
    'KITSSC002', 'MOD0173', 'MOD0398', 'MOD0665'
);

-- #####################################################################
--                       CAPTEURS DÉPORTÉS
-- #####################################################################
-- Kit V3V
UPDATE article SET category_id = 'kit V3V' WHERE ref IN (
    'KITSSC018', 'KITSSC235'
);

-- Module solaire 1 colonne pour casse-pression
UPDATE article SET category_id = 'mod sol 1 col' WHERE ref IN (
    'KITSSC197', 'KITSSC189', 'KITSSC190'
);

-- Kit à rajouter au module solaire 1 colonne
UPDATE article SET category_id = 'kit sol 1 col' WHERE ref IN (
    'KITSSC206', 'KITSSC207', 'KITSSC208', 'KITSSC209'
);

-- Module solaire 2 colonnes pour échangeur à plaques
UPDATE article SET category_id = 'mod sol 2 col' WHERE ref IN (
    'KITSSC199', 'KITSSC191', 'KITSSC192', 'MOD0197', 'MOD0506'
);

-- Kit à rajouter au module solaire 2 colonnes pour créer les options kit capteurs déportés sur échangeur à plaques
UPDATE article SET category_id = 'kit sol 2 col' WHERE ref IN (
    'KITSSC226', 'KITSSC200', 'KITSSC201', 'KITSSC202', 'KITSSC203',
    'KITSSC204', 'KITSSC227', 'KITSSC211', 'KITSSC205', 'KITSSC210',
    'KITSSC228', 'KITSSC229', 'KITSSC230', 'KITSSC231', 'KITSSC232'
);


-- #####################################################################
--          Résistances, réchauffeurs, brides et anodes
-- #####################################################################

-- Résistances électriques immergées
UPDATE article SET category_id = 'resistance' WHERE ref IN (
    'BAL0158', 'BAL0023', 'BAL0024', 'BAL0025', 'BAL0065'
);

-- Réchauffeurs de boucle
UPDATE article SET category_id = 'rechauffeur de boucle' WHERE ref IN (
    'MOD0315', 'MOD0306', 'MOD0801',
    'MOD0340', 'MOD0341', 'MOD0316',
    'KITSSC035', 'KITSSC234'
);

-- Brides
UPDATE article SET category_id = 'brides' WHERE ref IN (
    'BAL0068', 'BAL0069', 'BAL0035', 'BAL0034', 'BAL0142'
);

-- Anodes
UPDATE article SET category_id = 'anodes' WHERE ref IN (
    'BAL0017', 'BAL0104', 'BAL0105', 'BAL0074', 'BAL0073'
);

-- #####################################################################
--                VASES, MITIGEURS ET DÉCOUPLAGE HYDRAU
-- #####################################################################

-- Vases ECS
UPDATE article SET category_id = 'vases ECS' WHERE ref IN (
    'MOD0004', 'MOD0168', 'MOD0166', 'MOD0172', 'MOD0190', 'MOD0237', 'MOD0238', 'MOD0299'
);

-- Vases chauffage
UPDATE article SET category_id = 'vases chauffage' WHERE ref IN (
    'MOD0573', 'MOD0002', 'MOD0003', 'MOD0785', 'MOD0786', 'MOD0787', 'MOD0788', 'MOD0789', 'MOD0790'
);

-- Pièces pour vase
UPDATE article SET category_id = 'pieces vase' WHERE ref IN (
    'KITSSC003', 'MOD0135'
);

-- Mitigeur Thermostatique
UPDATE article SET category_id = 'mitigeur' WHERE ref IN (
    'MOD0022', 'MOD0192', 'MOD0193', 'MOD0194', 'MOD0195', 'MOD0196'
);

-- Découplage hydraulique par bouteille casse pression
UPDATE article SET category_id = 'decouplage CP' WHERE ref IN (
    'KITSSC046', 'KITSSC155', 'KITSSC113', 'KITSSC075', 'KITSSC059', 'KITSSC123',
    'MOD0531', 'BAL0157', 'BAL0103', 'BAL0117'
);

-- Découplage hydraulique par échangeurs à plaques inox
UPDATE article SET category_id = 'decouplage ech' WHERE ref IN (
    'MOD0459', 'MOD0460', 'MOD0324', 'MOD0325', 'MOD0504', 'MOD0505'
);

-- #####################################################################
--                         PIÈCES DÉTACHÉES
-- #####################################################################

-- Clapet
UPDATE article SET category_id = 'pièces clapet' WHERE ref IN (
    'MOD0008', 'MOD0151', 'MOD0011', 'MOD0740'
);

-- Té et Raccords
UPDATE article SET category_id = 'pièces racc' WHERE ref IN (
    'MOD0822', 'MOD0625', 'MOD0016', 'MOD0668', 'MOD0075', 'MOD0456', 'MOD0800'
);

-- Vannes
UPDATE article SET category_id = 'pièces vannes' WHERE ref IN (
    'MOD0650', 'MOD0561', 'MOD0012', 'MOD0613', 'MOD0614', 'MOD0054', 'MOD0055', 
    'MOD0056', 'MOD0057', 'MOD0058', 'MOD0704', 'MOD0087', 'MOD0088', 'MOD0089'
);

-- V3V
UPDATE article SET category_id = 'pièces V3V' WHERE ref IN (
    'MOD0059', 'MOD0060', 'MOD0061', 'MOD0381', 'MOD0803', 'MOD0275', 'MOD0294'
);

-- Carrosserie, module SolisConfort
UPDATE article SET category_id = 'pièces carrosserie' WHERE ref IN (
    'MOD0651', 'MOD0486', 'MOD0228', 'MOD0116'
);

-- Joints EPDM solaires Ep 3mm
UPDATE article SET category_id = 'pièces joints' WHERE ref IN (
    'MOD0675', 'MOD0633', 'MOD0733', 'MOD0404', 'KITSSC025', 'KITSSC024', 'KITSSC221'
);

-- Capteur solaire seul, sans abergement ni patte de fixation
UPDATE article SET category_id = 'pièces capteur' WHERE ref IN (
    'CAP0036', 'CAP0031', 'CAP0328', 'CAP0240', 'CAP0241', 'CAP0200', 'CAP0093', 'CAP0165'
);

-- Régulation SolisConfort
UPDATE article SET category_id = 'pièces regul' WHERE ref IN (
    'MOD0635', 'MOD0574', 'MOD0183', 'MOD0640', 'MOD0297', 'MOD0721', 'MOD0720', 
    'MOD0719', 'MOD0718', 'MOD0717', 'MOD0165', 'MOD0283', 'MOD0700'
);

-- Sonde de température
UPDATE article SET category_id = 'pièces sonde' WHERE ref IN (
    'MOD0656', 'MOD0388', 'MOD0045', 'MOD0046', 'MOD0403', 'MOD0274', 'MOD0513', 'MOD0048'
);

-- Circulateurs
UPDATE article SET category_id = 'pièces circulateurs' WHERE ref IN (
    'MOD0042', 'MOD0043', 'MOD0426', 'MOD0725', 'MOD0498'
);

-- Soupapes
UPDATE article SET category_id = 'pièces soupapes' WHERE ref IN (
    'MOD0020', 'MOD0410', 'KITSCC239', 'MOD0779'
);

-- Composants divers
UPDATE article SET category_id = 'pièces divers' WHERE ref IN (
    'MOD0049', 'KITSSC002', 'MOD0187', 'MOD0021', 'MOD0398', 'MOD0665', 'MOD0023', 'MOD0311', 'MOD0342'
);

-- Outillage installateur
UPDATE article SET category_id = 'pièces outillage' WHERE ref IN (
    'OUT001', 'OUT002', 'OUT003', 'OUT004', 'OUT005', 'OUT006', 'OUT008', 'OUT009', 'OUT010'
);


-- #####################################################################
--                    SERVICES ET TRANSPORTS
-- #####################################################################

-- Assistance à la mise en service
-- Sur installation individuelle
UPDATE article SET category_id = 'assistance ind' WHERE ref IN ('MISE001','MISE008','MISE012','MISE011','ETUD001');

-- Sur installation collectif
UPDATE article SET category_id = 'assistance col' WHERE ref IN ('MISE003','MISE015','MISE019','MISE004','MISE016','MISE017','MISE010');

-- Transport
-- France sauf Corse
UPDATE article SET category_id = 'transport fr' WHERE ref IN ('TRANS001','TRANS002','TRANS003','TRANS006');

-- Belgique - Luxembourg
UPDATE article SET category_id = 'transport belglux' WHERE ref IN ('TRANS010','TRANS020','TRANS030','TRANS060');

-- Divers
UPDATE article SET category_id = 'transport divers' WHERE ref IN ('TRANS007','TRANS008','TRANS009');


