/**
 * Wrap Vue Router library to use as ES6 module in TeqFW on the front.
 *
 * @namespace TeqFw_Vue_Front_Lib_Router
 */
if (window.Vue === undefined) {
    throw new Error(`
Add

<script type="application/javascript" src="./src/vue-router/vue-router.global.js"></script>

to your startup HTML to use Vue Router.           
`);
}
// export corresponds to Vue Router v. 4.0.12:
export const {
    createMemoryHistory,
    createRouter,
    createRouterMatcher,
    createWebHashHistory,
    createWebHistory,
    isNavigationFailure,
    matchedRouteKey,
    NavigationFailureType,
    onBeforeRouteLeave,
    onBeforeRouteUpdate,
    parseQuery,
    routeLocationKey,
    routerKey,
    RouterLink,
    RouterView,
    routerViewLocationKey,
    START_LOCATION,
    stringifyQuery,
    useLink,
    useRoute,
    useRouter,
    viewDepthKey,
} = window.VueRouter;
