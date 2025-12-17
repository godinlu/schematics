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
        ('accessoires', "Accessoires", "SC part"),
            ('kit SC1Z', "Gamme SC1Z", 'accessoires'),
            ('kit SC1', "Gamme SC1", 'accessoires'),
            ('kit SC2', "Gamme SC2", 'accessoires'),
            ('kit SC1K', "Gamme SC1K", 'accessoires'),
            ('kit SC2K', "Gamme SC2K", 'accessoires'),
            ('kit Hydraubox', "Gamme Hydraubox 1", 'accessoires'),
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
            ('SID 2,5', 'Capteurs intégrés SID 2,5 m2', 'capteurs'),
            ('S7 2,5', 'Capteurs S7 2,5 portrait', 'capteurs'),
            ('SH 2,5', 'Capteurs SH 2,5 paysage', 'capteurs'),
            ('S7 2,5B', 'Capteurs S7 2,5 cadre noir portrait', 'capteurs'),
            ('S7 2,0', 'Capteurs S7 2,0 portrait', 'capteurs'),
            ('SH 2,0', 'Capteurs SH 2,0 paysage', 'capteurs'),
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
    ('service transport', 'Service et Transport', 'articles'),
        ('assistance', 'Assistance à la mise en service', 'service transport'),
            ('assistance ind', 'Sur installation individuelle', 'assistance'),
            ('assistance col', 'Sur installation collectif', 'assistance'),
        ('transport', 'Transport', 'service transport'),
            ('transport fr', 'France sauf Corse', 'transport'),
            ('transport belglux', 'Belgique - Luxembourg', 'transport'),
            ('transport divers', 'Divers', 'transport')
;
