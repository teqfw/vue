/**
 * This is a set of utilities for the frontend that is related to Vue.
 */
export default class TeqFw_Vue_Front_Util {
    // CLASS' METHODS
    /**
     * Go to the previous web route or go to the default route if the history is absent.
     * @param {Router} router - Vue router
     * @param {string} route - default route
     */
    goBack(router, route) {
        if (window.history.state.position === 0) router.push(route);
        else router.back();
    }
}