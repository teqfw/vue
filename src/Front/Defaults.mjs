/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class TeqFw_Vue_Front_Defaults {

    DI_APP = 'vue_app'; // ID of the Vue application singleton in DI-container.
    DI_ROUTER = 'vue_router'; // ID of the Vue Router singleton.
    DI_VUE = 'vue_vue'; // ID of the Vue lib singleton.

    constructor() {
        Object.freeze(this);
    }
}
