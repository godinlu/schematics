/**
 * @typedef {import('../../../core/session.store.js')}
 * @type {import('../model/data_manager.class.js').DataManager} 
 * 
 * @typedef action
 * @property {string} type
 * @property {Object} payload
 * @property {number} [timestamp]
 * */

var DEBUG = true;

/**
 * 
 */
const devisStore = {
    /** @type {Object[]} */
    action_history: [],

    /** @type {number} */
    history_cursor: -1,

    /** @type {Map<string, Set<Function>>} */
    listeners: new Map(),

    /** @type {DataManager} */
    data_manager: null,

    /**
     * 
     * @param {DataManager} data_manager 
     * @param {{
     *  action_history?: action[],
     *  history_cursor?: number
     * } |null|undefined} [devis_data]
     */
    init(data_manager, devis_data = {}) {
        const {action_history = [], history_cursor = action_history.length - 1} = devis_data ?? {};
        this.data_manager = data_manager;
        this.action_history = action_history;
        this.history_cursor = history_cursor;
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
    },

    /**
     * 
     * @param {action} action 
     * @param {boolean} [add_to_history=true]
     */
    submit_action(action, add_to_history = true){
        ["type", "payload"].forEach(key =>{
            if (!(key in action)){
                throw new Error(`The action : ${JSON.stringify(action)} don't have the key : '${key}'`);
            }
        });
        try{
            this.dispatch("submit-action", action);

            if (add_to_history){
                // truncate future actions if cursor is not at the end
                if (devisStore.history_cursor < devisStore.action_history.length - 1) {
                    devisStore.action_history = devisStore.action_history.slice(0, devisStore.history_cursor+1);
                }

                // push the action in the history and set the cursor to the end 
                this.action_history.push({...action, timestamp: Date.now()});
                this.history_cursor = this.action_history.length - 1;

                // save into the session
                sessionStore.devis = {
                    action_history: this.action_history,
                    history_cursor: this.history_cursor
                };

                // logging if DEBUG is true
                if (DEBUG){
                    console.log(this.action_history);
                    console.log(this.history_cursor);
                }

                this._update_history_button();
            } 
        }catch (error){
            console.warn(`can't submitting action ${JSON.stringify(action)} : ${error}`);

            // remove the action of the history 
            const idx = this.action_history.findIndex(a => a === action || a.timestamp === action.timestamp);
            if (idx !== -1){
                this.action_history.splice(idx, 1);
                this.history_cursor -= 1;
            }
        }
    },

    /**
     * Rebuild the entire application state by replaying actions
     * up to the current history cursor.
     */
    rebuild(){
        // 1. Reset everything
        this.dispatch("reset");

        // 2. Replay actions up to the cursor
        for (let i = 0; i <= this.history_cursor; i++) {
            // Important: do NOT re-add to history so we set the add_to_history to false
            this.submit_action(this.action_history[i], false);
        }

        // 3. force a full render
        this.dispatch("render");

        // Dispatch history update here
        this._update_history_button();

    },

    /**
     * Undo the last action by moving the history cursor backward
     * and rebuilding the application state.
     */
    undo() {
        if (this.history_cursor < 0) return;

        this.history_cursor--;

        if (DEBUG) {
            console.log("[UNDO] cursor =", this.history_cursor);
        }

        this.rebuild();
    },

    /**
     * Redo the next action by moving the history cursor forward
     * and rebuilding the application state.
     */
    redo() {
        if (this.history_cursor >= this.action_history.length - 1) return;

        this.history_cursor++;

        if (DEBUG) {
            console.log("[REDO] cursor =", this.history_cursor);
        }

        this.rebuild();
    },


    /**
     * update history button to inform if we can undo or redo
     */
    _update_history_button(){
        this.dispatch("history-update", {
            can_undo: this.history_cursor >= 0,
            can_redo: this.history_cursor < this.action_history.length - 1
        });
    }

};
