export default class TeqFw_Vue_Defaults {
    BACK_REALM = 'vue';  // realm for API services ('/api/project/...') and CLI commands ('project-...')
    DI_APP = 'vue_app'; // ID of the Vue application singleton in DI-container.
    DI_ROUTER = 'vue_router'; // ID of the Vue Router singleton.
    DI_VUE = 'vue_vue'; // ID of the Vue lib singleton.
    DI_VUEX = 'vue_vuex'; // ID of the Vuex singleton.

    /** @type {TeqFw_Core_Defaults} */
    MOD_CORE;

    constructor(spec) {
        /** @type {TeqFw_Core_Defaults} */
        this.MOD_CORE = spec['TeqFw_Core_Defaults$'];    // pin 'core' defaults
        Object.freeze(this);
    }
}
