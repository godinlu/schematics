/**
 * 
 * @param {number} number 
 * @returns {string}
 */
function format_number(number, digit = 1){
    return number.toLocaleString("fr-FR", {
        minimumFractionDigits: digit,
        maximumFractionDigits: digit
    });
}
/**
 * 
 * @param {Function} fn 
 * @param {number} delay 
 * @returns 
 */
function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}