/**
 * @typedef {Object} Effect
 * @property {string} field - target name of the effect
 * @property {string} action - name of the action
 * @property {RegExp} match - regex of the action
 * @property {boolean} [hide] - Optional if true hide option instead of disabled it
 */

/**
 * @typedef {Object} Rule
 * @property {Object<string, RegExp>} when - conditions to match fields
 * @property {Effect[]>} effects - List of Effect to apply if all conditions are true
 * @property {string} [reason] - Optional reason of the rule
 */


/** @type {Object<string, Rule>} */
const RULES = {
    SC1Z_NO_BALLOON:{
        when: {typeInstallation: /^SC1Z$/i},
        effects: [
            {field: "ballonECS", action:"forbid", match: ""}
        ],
        reason: "Les installations SC1Z ne permettent pas ce ballon ECS"
    }
};