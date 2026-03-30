
/**
 * @typedef {import('./rule_engine.js')}
 * @typedef {import('./rules.config.js')}
 * @typedef {import('./options.config.js')}
 */

/**
 * 
 */
class FormulaireApp {
    constructor() {
        this._context = sessionStore.formulaire ?? DEFAULT_CONTEXT;

        this._rule_engine = new RuleEngine(rule_config, options);

        this._fields = new Map();

        // init all fields
        for (const field of document.querySelector("main").querySelectorAll("[data-field]")) {
            const field_key = field.dataset.field;
            this._fields.set(field_key, field);
        }

        this._description = document.querySelector("#description");

        // render once at the init
        this.render();

        // attach all event
        this._attach_events();
    }

    render() {
        // here this._context will be updated inplace
        const all_states = this._rule_engine.resolve(this._context);

        // render the description
        const description = this._get_description();
        this._description.innerText = `Description : ${description}`;

        // save the context in the session
        sessionStore.formulaire = {...this._context, description};

        for (const [field_key, states] of Object.entries(all_states)) {
            set_field_states(this._fields.get(field_key), states);
        }

        for (const [field_key, value] of Object.entries(this._context)) {
            set_field_value(this._fields.get(field_key), value);
        }


    }


    _on_field_update(field_key, new_value) {
        // appply default selection and update inplace the context
        this._rule_engine.apply_default_selection_on_context(this._context, field_key, new_value);

        // render all field with new computed states
        this.render();
    }


    _attach_events() {
        for (const [field_key, field] of this._fields) {
            field.addEventListener("change", () => {
                this._on_field_update(field_key, get_field_value(field));
            });
        }
    }


    /**
    * return the description of the current context this._context
    * the description is a str resume of the installation.
    * @returns {string}
    */
    _get_description() {
        let res = "";
        // add the type installation first
        res += this._context.typeInstallation;

        // create a counter for zones withour appoint and with an exception for PC V3V.
        let zones_count = {};
        for (const circ of ["circulateurC1", "circulateurC2", "circulateurC3", "circulateurC7"]) {
            let value = this._context[circ];
            if (value === "Aucun" || /appoint/i.test(value)) continue;
            if (this._context.circulateurC1 === "Plancher chauffant sur V3V" && value === "Plancher chauffant") {
                value = "Plancher chauffant sur V3V";
            }
            zones_count[value] = (zones_count[value] ?? 0) + 1;
        }
        // add zone str description
        for (const [zone, count] of Object.entries(zones_count)) {
            res += `, ${count} ${zone}`;
        }

        // add appoint 1
        if (this._context.appoint1 !== "Aucun") res = res + ", Appoint 1 " + this._context.appoint1;

        // add appoint 2
        if (this._context.appoint2 !== "Aucun") {
            if (/Appoint/.test(this._context.appoint2)) { //si cette condition est vérifié alors on est dans le cas d'un appoint sur C7
                res = res + ", " + this._context.appoint2.replace(/Appoint/, "Appoint 2") + " sur C7";
            } else {  //sinon on est sur un appoint 2 en cascade d'appoint 1
                res = res + ", Appoint 2 " + this._context.appoint2 + " en cascade";
            }
        }

        // add capteur surface
        if (!isNaN(parseFloat(this._context.champCapteur_surface))) {
            res += `, ${this._context.champCapteur_surface} m² de capteurs`;
        }
        return res;
    }
}