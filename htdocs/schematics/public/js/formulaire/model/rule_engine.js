/**
 * @type {import('./rules.js').Rule}
 * @type {import('./rules.js').RULES}
 */ 

class RuleEngine{
    /** @type {Object<string, Rule>} */
    rules

    /** @type {Map<string, string>} */
    rule_map

    constructor(){
        this.rules = RULES;
        this.rule_map = new Map();

        for (const [rule_id, rule] of Object.entries(this.rules)){
            for (const field of Object.keys(rule.when)){
                if (!this.rule_map.has(field)) {
                    this.rule_map.set(field, []);
                }
                this.rule_map.get(field).push(rule_id);
            }
        }
    }


}