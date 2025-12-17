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
UPDATE article SET category_id = 'kit SC1Z' WHERE ref in ("SC1KIT", "SC1KIT50", "SC1KIT80", "SC1KIT140");

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


