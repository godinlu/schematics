import { writable} from "svelte/store";
/**
 * Un objet représentant une categorie.
 * @typedef {Object} category
 * @property {number} id - identifiant de la catégorie
 * @property {string} name - nom complet de la catégorie
 * @property {string} short_name - nom court de la catégorie
 * @property {string} type - type de la catégorie
 * @property {int} priority - ordre de priority de la catégorie
 * @property {int} parent_id - id de la catégorie parent
*/

/**
 * @typedef {object} ModalInfo
 * @property {string} type
 * @property {category} category
 * @property {string} [ref]
 */


export let articles_in_devis = writable([]);

/**
 * @type {Writable<?ModalInfo>} modal_info
 */
export let modal_info = writable(null);


export const articles = window.global_vars["all_articles"];


export const categories = window.global_vars["categories"];
 

