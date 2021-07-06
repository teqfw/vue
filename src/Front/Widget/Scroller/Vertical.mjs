/**
 * Vertical scroller to select one value from a set.
 *
 * @namespace TeqFw_Vue_Front_Widget_Scroller_Vertical
 */
// MODULE'S VARS
const NS = 'TeqFw_Vue_Front_Widget_Scroller_Vertical';
const CLASS_DISPLAY = 'teq_ui_scroller_v_display';
const CLASS_ITEMS = 'teq_ui_scroller_v_values';
const CSS_VAR_HEIGHT = '--value-height';
const EVT_SELECTED = 'selected';
const SCROLL_DURATION_DEF = 1000;   // default for animation duration (in msec.)
const SCROLL_ITEM_DURATION = 100;   // minimal animation duration for one item in scroller (in msec.)

const template = `
<div class="teq_ui_scroller_v" >
    <div class="teq_ui_scroller_v_mask"></div>
    <div class="${CLASS_DISPLAY}"></div>
    <div class="${CLASS_ITEMS}">
        <div v-for="(item, index) in items" class="teq_ui_scroller_v_value">{{item.value}}</div>
    </div>
</div>
`;

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @memberOf TeqFw_Vue_Front_Widget_Scroller_Vertical
 * @returns {TeqFw_Vue_Front_Widget_Scroller_Vertical.vueCompTmpl}
 */
function Factory(spec) {
    /** @type {typeof TeqFw_Vue_Front_On_Touch} */
    const OnTouch = spec['TeqFw_Vue_Front_On_Touch#'];

    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf TeqFw_Vue_Front_Widget_Scroller_Vertical
     */
    return {
        name: NS,
        template,
        props: {
            items: Array, // [key, value] pairs
            initValue: null, // initial position of the scroller
        },
        emits: [EVT_SELECTED],
        data: function () {
            return {
                initTop: 0,             // initial position of the top of the values DIV on movements
                selectedKey: null,
                scrollDurationTotal: SCROLL_DURATION_DEF, // total animation duration based on items count
            };
        },
        computed: {},
        methods: {
            /**
             * Get height of one item defined in CSS var.
             * @return {number}
             */
            getItemHeight() {
                const elem = this.$el.querySelector(`.${CLASS_ITEMS}`);
                const cssHeight = self.window
                    .getComputedStyle(elem)
                    .getPropertyValue(CSS_VAR_HEIGHT);
                return Number.parseInt(cssHeight.replace('px', '').trim());
            },

            getDisplayTop() {
                const elem = this.$el.querySelector(`.${CLASS_DISPLAY}`);
                return elem.offsetTop;
            },

            /**
             * Set scroller position to the closes value on UI and get code of the selected value.
             */
            freezePosition() {
                const elValues = this.$el.querySelector(`.${CLASS_ITEMS}`);
                const valuesTop = elValues.offsetTop;
                const displayTop = this.getDisplayTop();
                const rowHeight = this.getItemHeight();
                const deltaTops = displayTop - valuesTop;
                const idx = Math.floor(deltaTops / rowHeight); // number of items
                const tail = deltaTops % rowHeight;
                const fixedIdx = (tail >= (rowHeight / 2)) ? idx + 1 : idx;
                const newTop = displayTop - (fixedIdx * rowHeight);
                elValues.style.top = `${newTop}px`;
                this.selectedKey = (this.items[fixedIdx]) ? this.items[fixedIdx]['key'] : null;
                this.$emit(EVT_SELECTED, this.selectedKey);
            },

            /**
             * Set scroller to initial position.
             */
            initPosition() {
                const init = this.initValue;
                const values = this.items;
                const idx = values.findIndex((item) => String(item.key) === String(init));
                const fixedIdx = (idx >= 0) ? idx : 0;
                const elValues = this.$el.querySelector(`.${CLASS_ITEMS}`);
                const displayTop = this.getDisplayTop();
                const rowHeight = this.getItemHeight();
                const newTop = displayTop - (fixedIdx * rowHeight);
                elValues.style.top = `${newTop}px`;
                this.selectedKey = (this.items[fixedIdx]) ? this.items[fixedIdx]['key'] : null;
                this.$emit(EVT_SELECTED, this.selectedKey);
            },

            /**
             * Animate scrolling from ${currentTop} to ${targetTop}.
             *
             * @param {HTMLElement} element
             * @param {Number} currentTop
             * @param {Number} targetTop
             * @param {Number} duration
             */
            scroll(element, currentTop, targetTop, duration) {
                const me = this;
                const styleValues = element.style;
                if (duration < SCROLL_DURATION_DEF) duration = SCROLL_DURATION_DEF;
                element.animate([
                    // keyframes
                    {top: `${currentTop}px`},
                    {top: `${targetTop}px`}
                ], {
                    direction: 'alternate',
                    duration,
                    // easing: 'ease-out',
                    iterations: 1,
                });
                const anime = element.getAnimations()[0];
                anime.onfinish = function () {
                    styleValues.top = `${targetTop}px`;
                    me.freezePosition();
                };
            },

        },
        watch: {
            initValue(current, old) {
                if (current !== old) {
                    // set initial position for the scroll on value change
                    this.initPosition();
                }
            },
            items(current) {
                // set total scroll duration for all items
                if (Array.isArray(current)) {
                    const length = current.length;
                    const duration = length * SCROLL_ITEM_DURATION;
                    this.scrollDurationTotal = Math.min(SCROLL_DURATION_DEF, duration);
                } else {
                    this.scrollDurationTotal = SCROLL_DURATION_DEF;
                }
            }
        },
        mounted() {
            // PARSE INPUT & DEFINE WORKING VARS
            const me = this;

            // DEFINE INNER FUNCTIONS

            /**
             * Restore initial position.
             */
            function onCancel() {
                const elValues = me.$el.querySelector(`.${CLASS_ITEMS}`);
                elValues.style.top = `${me.initTop}px`;
                me.freezePosition();
            }

            /**
             * Start scroll downward animation.
             */
            function onDown() {
                const displayTop = me.getDisplayTop();
                const elValues = me.$el.querySelector(`.${CLASS_ITEMS}`);
                const currentTop = elValues.offsetTop;
                // calc duration
                const rowHeight = me.getItemHeight();
                const height = elValues.offsetHeight;
                const duration = height / rowHeight * SCROLL_ITEM_DURATION;
                me.scroll(elValues, currentTop, displayTop, duration);
            }

            /**
             * Process end of movement.
             */
            function onEnd() {
                me.freezePosition();
            }

            /**
             * Process touch movement.
             *
             * @param {Touch} touchStart
             * @param {Touch} touchEnd
             */
            function onMove({touchStart, touchEnd}) {
                const elValues = me.$el.querySelector(`.${CLASS_ITEMS}`);
                const valuesHeight = elValues.offsetHeight;
                const displayTop = me.getDisplayTop();
                const rowHeight = me.getItemHeight();
                const delta = Number.parseInt(touchEnd.clientY - touchStart.clientY);
                const newTop = me.initTop + delta;
                // move DIV if new position is available
                if (
                    // values DIV end is greater then display top
                    ((newTop + valuesHeight - rowHeight) > displayTop) &&
                    // values DIV begin is less then display top
                    (newTop < displayTop)
                ) {
                    elValues.style.top = `${newTop}px`;
                }
            }

            /**
             * Save position of the values DIV, stop any animations.
             */
            function onStart() {
                // pin new top
                const elValues = me.$el.querySelector(`.${CLASS_ITEMS}`);
                const topPinned = `${elValues.offsetTop}`;
                // cancel all existing animations and set new top
                elValues.getAnimations().forEach(anime => anime.cancel());
                elValues.style.top = `${topPinned}px`;
                // freeze position and save new top
                me.freezePosition();
                me.initTop = elValues.offsetTop;
            }

            /**
             * Start scroll upward animation.
             */
            function onUp() {
                const displayTop = me.getDisplayTop();
                const rowHeight = me.getItemHeight();
                const elValues = me.$el.querySelector(`.${CLASS_ITEMS}`);
                const currentTop = elValues.offsetTop;
                const height = elValues.offsetHeight;
                const targetTop = displayTop - height + rowHeight;
                const duration = height / rowHeight * SCROLL_ITEM_DURATION;
                me.scroll(elValues, currentTop, targetTop, duration);
            }

            // MAIN FUNCTIONALITY
            // mark handlers to get sources in debugger
            Object.defineProperty(onCancel, 'name', {
                writable: true,
                value: `${NS}/mounted/onCancel`
            });
            Object.defineProperty(onDown, 'name', {
                writable: true,
                value: `${NS}/mounted/onDown`
            });
            Object.defineProperty(onEnd, 'name', {
                writable: true,
                value: `${NS}/mounted/onEnd`
            });
            Object.defineProperty(onMove, 'name', {
                writable: true,
                value: `${NS}/mounted/onMove`
            });
            Object.defineProperty(onStart, 'name', {
                writable: true,
                value: `${NS}/mounted/onStart`
            });
            Object.defineProperty(onUp, 'name', {
                writable: true,
                value: `${NS}/mounted/onUp`
            });

            /** @type {TeqFw_Vue_Front_On_Touch} */
            const handler = new OnTouch(this.$el);
            handler.setOnCancel(onCancel);  // reset scroller to initial position
            handler.setOnStart(onStart);    // save init position of the scroller
            handler.setOnEnd(onEnd);        // set target position and selected value
            handler.setOnMove(onMove);      // move scroller with touch movement
            handler.setOnUp(onUp);          // swipe scroller upward
            handler.setOnDown(onDown);      // swipe scroller downward

            // emit event for initial positions
            this.initPosition();
        },
    };
}

// MODULE'S FUNCTIONALITY
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});

// MODULE'S EXPORT
export default Factory;
