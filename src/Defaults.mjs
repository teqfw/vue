export default class TeqFw_Vue_Defaults {
    BACK_REALM = 'vue';  // realm for API services ('/api/project/...') and CLI commands ('project-...')
    DI_ROUTER = 'vue_router'; // ID of the session singleton in DI-container.
    DI_VUE = 'vue_vue';
    DI_VUEX = 'vue_vuex';

    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;

    constructor(spec) {
        /** @type {TeqFw_Core_App_Defaults} */
        this.MOD_CORE = spec['TeqFw_Core_App_Defaults$'];    // pin 'core' defaults
        Object.freeze(this);
    }
}
