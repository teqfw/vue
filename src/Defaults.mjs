export default class Vendor_Project_Defaults {
    BACK_REALM = 'project';  // realm for API services ('/api/project/...') and CLI commands ('project-...')
    /** @type {TeqFw_Core_App_Defaults} */
    MOD_CORE;

    constructor(spec) {
        /** @type {TeqFw_Core_App_Defaults} */
        this.MOD_CORE = spec['TeqFw_Core_App_Defaults$'];    // pin 'core' defaults
        Object.freeze(this);
    }
}
