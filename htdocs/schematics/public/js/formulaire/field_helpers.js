/**
 * Update a form field UI according to the provided option states.
 *
 * This function:
 *  - Computes and applies the global hidden state
 *  - Computes and applies the global disabled state
 *  - Renders <option> elements when the field is a <select>
 *
 * @param {HTMLSelectElement|HTMLInputElement} field
 * The target form field to update.
 *
 * @param {Map<string, {disabled: boolean, hidden: boolean, reason: string}>} states
 * A map describing the state of each option:
 *  - key: option value
 *  - disabled: whether the option is disabled
 *  - hidden: whether the option is hidden
 *  - reason: explanation associated with the disabled state
 */
function set_field_states(field, states){
    if (!field) return;

    _manage_hide_field(field, states);
    _manage_disabled_field(field, states);    

    if (field.tagName === "SELECT"){
        field.innerHTML = `
            ${Array.from(states, ([opt_value, state]) =>`
                    <option
                        value="${opt_value}"
                        ${state.disabled ? "disabled" : ""}
                        ${state.hidden ? "hidden" : ""}
                        title="${state.reason ?? ""}"
                    >${opt_value}</option>
                `).join("")}
        `;
    }
}

/**
 * Set the value of a form field according to its type.
 *
 * Supported types:
 *  - HTMLSelectElement
 *  - Input[type="checkbox"]
 *  - Input[type="text"]
 *
 * @param {HTMLSelectElement|HTMLInputElement} field
 * The target form field.
 *
 * @param {string} value
 * The value to apply to the field.
 */
function set_field_value(field, value){
    if (!field) return;

    if (field instanceof HTMLSelectElement){
        field.value = value;
    }else if (field instanceof HTMLInputElement && field.type === "checkbox"){
        field.checked = (value === "on");
    }else if (field instanceof HTMLInputElement && field.type === "text"){
        field.value = value;
    }else{
        console.warn(`[set_field_states] unsupported instance of field : ${field}`);
    }
}

/**
 * Manage the global visibility of a field based on its option states.
 *
 * The field (and its associated label) is hidden if all options
 * are marked as hidden.
 *
 *
 * @param {HTMLSelectElement|HTMLInputElement} field
 * The target field.
 *
 * @param {Map<string, {disabled: boolean, hidden: boolean, reason: string}>} states
 * The option state definitions.
 */
function _manage_hide_field(field, states){
    const all_hidden = [...states.values()].every(s => s.hidden);

    if (field.tagName === "SELECT"
        || (field.tagName === "INPUT" && (field.type === "checkbox" || field.type === "text"))
    ){
        field.style.display = (all_hidden)? "none": "";

        const label = _get_label(field);
        if (!label) return;
        label.style.display = (all_hidden)? "none": "";
    }else{
        console.warn(`[hide_field] unsupported field type : ${field}`);
    }

    
}

/**
 * Manage the global disabled state of a field.
 *
 * The field is disabled when there is zero or one available option
 * (i.e., options that are neither hidden nor disabled).
 *
 * When disabling the field, the most frequent "reason" among
 * the option states is computed and applied as a tooltip.
 *
 * Text inputs are excluded from this logic.
 *
 * @param {HTMLSelectElement|HTMLInputElement} field
 * The target field.
 *
 * @param {Map<string, {disabled: boolean, hidden: boolean, reason: string}>} states
 * The option state definitions.
 */
function _manage_disabled_field(field, states){
    if (field.tagName === "INPUT" && field.type === "text") return;
    const values = [...states.values()];

    const should_disabled = values.filter(s => !s.disabled && !s.hidden).length <= 1;

    let majority_reason = "";

    if (should_disabled){
        // count reason
        const reason_count = new Map();
        for (const s of values){
            reason_count.set(s.reason, (reason_count.get(s.reason)?? 0) + 1 )
        }

        // get the majority reason
        let max = 0;
        for (const [reason, count] of reason_count){
            if (count > max){
                max = count;
                majority_reason = reason;
            }
        }

    }

    field.disabled = should_disabled;
    field.title = majority_reason;

    const label = _get_label(field);
    if (!label) return;
    label.classList.toggle("disabled", should_disabled);
    label.title = majority_reason;

}


/**
 * Retrieve the <label> element associated with a field.
 *
 * The function attempts resolution in the following order:
 *  1. label[data-field-label="<field.dataset.field>"]
 *  2. label[for="<field.id>"]
 *
 * @param {HTMLElement} field
 * The form field whose label should be retrieved.
 *
 * @returns {HTMLLabelElement|null}
 * The associated label element, or null if none is found.
 */
function _get_label(field) {
    return (
        document.querySelector(`label[data-field-label="${field.dataset.field}"]`) ||
        document.querySelector(`label[for="${field.id}"]`) ||
        null
    );
}
