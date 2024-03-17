/**
 * Wrap Vue 3 library to use as ES6 module in TeqFW on the front.
 *
 * @namespace TeqFw_Vue_Front_Ext_Vue
 */

// MODULE'S FUNCS
/**
 * Load UMD script from the back and execute it.
 * @param {string} url
 * @return {Promise<unknown>}
 */
async function loadUmd(url) {
    return new Promise((resolve, reject) => {
        // Create a script element
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
    });
}

// MODULE'S MAIN
if (!window.Vue) await loadUmd('../../../../src/vue/vue.runtime.global.prod.js');
if (!window.VueRouter) await loadUmd('../../../../src/vue-router/vue-router.global.prod.js');

const Vue = window.Vue;
const VueRouter = window.VueRouter;

export {Vue, VueRouter};