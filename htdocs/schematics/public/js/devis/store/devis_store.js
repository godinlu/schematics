/**@type {import('../model/data_manager.class.js').DataManager} */

/**
 * 
 */
const devisStore = {
    /** @type {Object[]} */
    action_history: [],

    /** @type {Map<string, Set<Function>>} */
    listeners: new Map(),

    /** @type {DataManager} */
    data_manager: null,

    init(data_manager) {
        this.data_manager = data_manager;
    },

    subscribe(name, fn) {
        if (typeof fn !== "function") return;

        if (!this.listeners.has(name)) {
            this.listeners.set(name, new Set());
        }

        this.listeners.get(name).add(fn);

        // unsubscribe
        return () => {
            this.listeners.get(name)?.delete(fn);
        };
    },

    dispatch(name, context = {}) {
        // listeners spécifiques
        this.listeners.get(name)?.forEach(fn => fn(context));

        // wildcard
        this.listeners.get("*")?.forEach(fn =>
            fn({ name, context })
        );
    }
};
