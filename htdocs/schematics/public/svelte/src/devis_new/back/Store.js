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
 * @typedef {Object} article_obj
 * @property {string} ref
 * @property {string} label
 * @property {Float32Array} prix
 * @property {int} category_id
 */

/**
 * @type {article_obj[]} articles
 */
export const articles = window.global_vars["all_articles"];

/**
 * @type {category[]} categories
 */
export const categories = window.global_vars["categories"];