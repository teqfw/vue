/**
 * Wrap Vue 3 library to use as ES6 module in TeqFW on the front.
 *
 * @namespace TeqFw_Vue_Front_Ext_Vue
 */
// MODULE'S IMPORTS
import {loadUmd} from '../../../../web/@teqfw/web/js/loaders.mjs';

// MODULE'S MAIN
if (!window.Vue) await loadUmd('../../../../src/vue/vue.runtime.global.prod.js');
if (!window.VueRouter) await loadUmd('../../../../src/vue-router/vue-router.global.prod.js');

const Vue = window.Vue;
const VueRouter = window.VueRouter;

export {Vue, VueRouter};