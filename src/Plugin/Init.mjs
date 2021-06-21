/**
 * Class to integrate plugin into TeqFW application.
 * @extends TeqFw_Core_App_Plugin_Init_Base
 */
export default class TeqFw_Vue_Plugin_Init {

    constructor(spec) {
        /** @type {TeqFw_Vue_Defaults} */
        const DEF = spec['TeqFw_Vue_Defaults$'];    // singleton

        this.getCommands = function () {
            return [];
        };

        this.getHttpStaticMaps = function () {
            return {
                '/vue-router/': '/vue-router/dist/',
                '/vue/': '/vue/dist/',
                '/vuex/': '/vuex/dist/',
            };
        };

        this.getServicesList = function () {
            return [];
        };

        this.getServicesRealm = function () {
            return DEF.BACK_REALM;
        };
    }


}
