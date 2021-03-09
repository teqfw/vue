/**
 * Vertical scroller to select one value from a set.
 */
const CLASS_DISPLAY = 'teq_ui_scroller_v_display';
const CLASS_ITEMS = 'teq_ui_scroller_v_values';
const CSS_VAR_HEIGHT = '--value-height';
const SCROLL_DURATION = 2000;   // animation duration (in msec.)

const template = `
<div class="teq_ui_scroller_v" >
    <div class="teq_ui_scroller_v_mask"></div>
    <div class="${CLASS_DISPLAY}"></div>
    <div class="${CLASS_ITEMS}">
        <div v-for="(item, index) in items" class="teq_ui_scroller_v_value">{{item.value}}</div>
    </div>
</div>
`;

/**
 * Constructor to create Vue component for vertical scroller.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {VueComponent}
 * @constructor
 */
function TeqFw_Vue_Front_Widget_Scroller_Vertical(spec) {
    /** @type {typeof TeqFw_Vue_Front_On_Touch} */
    const OnTouch = spec['TeqFw_Vue_Front_On_Touch#'];    // class constructor

    return {
        template,
        props: {
            items: Array, // [key, value] pairs
            initValue: null, // initial position of the scroller
        },
        emits: ['selected'],
        data: function () {
            return {
                initTop: 0,             // initial position of the top of the values DIV on movements
                selectedKey: null,
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
                this.$emit('selected', this.selectedKey);
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
                this.$emit('selected', this.selectedKey);
            },

            /**
             * Animate scrolling from ${currentTop} to ${targetTop}.
             *
             * @param {HTMLElement} element
             * @param {number} currentTop
             * @param {number} targetTop
             */
            scroll(element, currentTop, targetTop) {
                const me = this;
                const styleValues = element.style;
                element.animate([
                    // keyframes
                    {top: `${currentTop}px`},
                    {top: `${targetTop}px`}
                ], {
                    direction: 'alternate',
                    duration: SCROLL_DURATION,
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
                me.scroll(elValues, currentTop, displayTop);
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
                me.scroll(elValues, currentTop, targetTop);
            }

            // MAIN FUNCTIONALITY
            // mark handlers to get sources in debugger
            Object.defineProperty(onCancel, 'name', {
                writable: true,
                value: 'TeqFw_Vue_Front_Widget_Scroller_Vertical/mounted/onCancel'
            });
            Object.defineProperty(onDown, 'name', {
                writable: true,
                value: 'TeqFw_Vue_Front_Widget_Scroller_Vertical/mounted/onDown'
            });
            Object.defineProperty(onEnd, 'name', {
                writable: true,
                value: 'TeqFw_Vue_Front_Widget_Scroller_Vertical/mounted/onEnd'
            });
            Object.defineProperty(onMove, 'name', {
                writable: true,
                value: 'TeqFw_Vue_Front_Widget_Scroller_Vertical/mounted/onMove'
            });
            Object.defineProperty(onStart, 'name', {
                writable: true,
                value: 'TeqFw_Vue_Front_Widget_Scroller_Vertical/mounted/onStart'
            });
            Object.defineProperty(onUp, 'name', {
                writable: true,
                value: 'TeqFw_Vue_Front_Widget_Scroller_Vertical/mounted/onUp'
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

export default TeqFw_Vue_Front_Widget_Scroller_Vertical;
