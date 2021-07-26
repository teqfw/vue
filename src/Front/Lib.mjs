/**
 * DI-compatible wrapper for 'vue' library.
 * 'vue' library does not compatible with DI-container and should be loaded on front with HTML '<script>' tag.
 */
export default class TeqFw_Vue_Front_Lib {
    /** Vue Router object from globals. */
    #router;
    /** Vue 3 object from globals. */
    #vue;

    constructor() {
        // noinspection JSValidateTypes
        /** @type {{Vue, VueRouter}} */
        const window = self;
        if (window.Vue) {
            this.#vue = window.Vue;
            if (window.VueRouter) {
                this.#router = window.VueRouter;
            } else {
                console.log(`
Add '<script type="application/javascript" src="./src/vue-router/vue-router.global.js"></script>' 
to your startup HTML to use Vue Router.            
`);
            }
        } else {
            console.log(`
Add '<script type="application/javascript" src="./src/vue/vue.global.prod.js"></script>' to your startup HTML
to use Vue 3.            
`);
        }
    }

    getRouter() {
        return this.#router;
    }

    getVue() {
        return this.#vue;
    }
}

