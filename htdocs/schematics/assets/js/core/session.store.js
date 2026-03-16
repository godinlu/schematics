class __SessionStore {
    constructor() {
        this.keys = {
            formulaire: "formulaire",
            fiche_prog: "fiche_prog",
            devis: "devis"
        };
    }

    /**
     * Save data to sessionStorage
     */
    _save(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Load data from sessionStorage
     */
    _load(key, fallback = null) {
        const stored = sessionStorage.getItem(key);

        if (!stored) return fallback;

        try {
            return JSON.parse(stored);
        } catch (err) {
            console.warn(`Corrupted sessionStorage for key "${key}"`, err);
            return fallback;
        }
    }

    get name() {
        const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '');
        return (this.formulaire.nom_client || date) + ((this.formulaire.nom_client) ? `-${date}` : '');
    }

    // ===== Formulaire =====
    get formulaire() {
        const data = this._load(this.keys.formulaire);
        if (!data && !window.location.pathname.endsWith("/formulaire")){
            window.location.href  = "./formulaire";
        }
        return data
    }

    set formulaire(data) {
        this._save(this.keys.formulaire, data);
    }

    // ===== Fiche Prog =====
    get fiche_prog() {
        return this._load(this.keys.fiche_prog, null);
    }

    set fiche_prog(data) {
        this._save(this.keys.fiche_prog, data);
    }

    // ===== Devis =====
    get devis() {
        return this._load(this.keys.devis, null);
    }

    set devis(data) {
        this._save(this.keys.devis, data);
    }

    // ===== All state =====
    get all() {
        return {
            formulaire: this.formulaire,
            fiche_prog: this.fiche_prog,
            devis: this.devis
        };
    }

    set all(data){
        this.formulaire = data.formulaire;
        this.fiche_prog = data.fiche_prog;
        this.devis = data.devis;
    }

    // ===== Clear all =====
    clear() {
        Object.values(this.keys).forEach(key => sessionStorage.removeItem(key));
    }
}

const sessionStore = new __SessionStore();

