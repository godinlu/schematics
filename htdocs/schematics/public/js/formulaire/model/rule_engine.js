/**
 * @type {import('../rules.js').Rules}
 * @type {import('../rules.js').Rule}
 */

class RuleEngine{



    constructor(){
        /** @type {Map<string, Array<{id: string, rule_fn: Rule}>>} */
        this._rules = new Map();
        let rule_counter = 0;
        for (const [triggered_field, rule_or_array] of Object.entries(RULES)){
            const rule_fns = (Array.isArray(rule_or_array))? rule_or_array : [rule_or_array];

            this._rules.set(triggered_field, rule_fns.map(rule_fn => ({id: `rule_${rule_counter++}`, rule_fn})));
        }

    }

    /**
     * 
     * @param {string} triggered_field 
     * @param {Object<string, string>} ctx
     */
    update(triggered_field, ctx){
        console.log(this._rules.get(triggered_field));
    }



}



// const rules = {
//     typeInstallation: ctx => 
//         ctx.typeInstallation === "SC1Z" && forbid("ballonECS", /^ballon ecs 2|^aucun$/i)
// }


// /**
//  * 
//  */
// function forbid(field, regex, reason){
//     return {
//         type: "forbid-options",
//         field,
//         regex,
//         reason
//     };
// }

// class RuleEngine{
//     constructor(){
//         this.rules = }
//             ctx => ctx.typeInstallation === "SC1Z" && this._forbid("ballonECS", /^ballon ecs 2|^aucun$/i)
//         };

//         this.handlers = new Map();
//     }

//     /**
//      * 
//      */
//     _forbid(field_name, regex, reason){
//         this.handlers.get("forbid")(field_name, regex, reason);
//     }

//     on_forbid(handler){
//         this.handlers.set("forbid", handler);
//     }
// }



// /**
//  * @type {import('./rules.js').Rule}
//  * @type {import('./rules.js').RULES}
//  */ 

// class RuleEngine{
//     /** @type {Map<string, Rule>} */
//     rules

//     constructor(){
//         this.rules = new Map(Object.entries(RULES));
//     }

//     /**
//      * 
//      * @param {Object<string, string>} field_values 
//      * @returns {Instruction[]}
//      */
//     evaluate(field_values){
//         let instructions = [];
//         for (const [rule_id, rule] of this.rules){
//             const is_match = Object.entries(rule.when).every(([field_name, regex]) => {
//                 return regex.test(field_values[field_name]);
//             });

//             if (!is_match) continue;

//             instructions.push(...rule.instructions);
//         }
//         return instructions;
//     }

// }