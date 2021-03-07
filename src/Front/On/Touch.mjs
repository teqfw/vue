/**
 * This handler processes one-finger touche and swipes or movements.
 * There are time and distance thresholds - quick movement is a swipe, very short movement is a single touch.
 * Handler has 8 callbacks:
 *  - start, end, cancel
 *  - move
 *  - swipes: left, right, up, down
 */
export default class TeqFw_Vue_Front_On_Touch {
    /** @type {Function} */
    callOnCancel
    /** @type {Function} */
    callOnEnd
    /** @type {Function} */
    callOnMove
    /** @type {Function} */
    callOnStart
    /** @type {Function} */
    callOnDown
    /** @type {Function} */
    callOnLeft
    /** @type {Function} */
    callOnRight
    /** @type {Function} */
    callOnUp
    /** @type {Element} */
    element
    /** @type {Date} */
    timeStart
    /** @type {Touch} */
    touchStart
    /**
     * Threshold for swipe (below) or movement (above) events.
     * @type {number}
     */
    thresholdTime = 500
    /**
     * Threshold (in pixels) for no touch (below)  events.
     * @type {number}
     */
    thresholdDistance = 10

    constructor(element) {
        // PARSE INPUT & DEFINE WORKING VARS
        const me = this;    // close instance for touch event handlers (funcs defined inside constructor)

        // DEFINE INNER FUNCTIONS
        /**
         * @param {TouchEvent} event
         */
        function handleCancel(event) {
            if (typeof me.callOnCancel === 'function') me.callOnCancel({
                touchStart: me.touchStart,
                timeStart: me.timeStart,
                eventCancel: event,
            });
        }

        /**
         * Execute onStart callback function if exists.
         *
         * @param {TouchEvent} evt
         */
        function handleStart(evt) {
            const touches = evt.changedTouches;
            me.touchStart = touches[0];
            me.timeStart = new Date();
            if (typeof me.callOnStart === 'function') me.callOnStart({
                touchStart: me.touchStart,
                timeStart: me.timeStart
            });
        }

        /**
         * Execute one of the swipe callback functions (onLeft, onRight, onUp, onDown) if exists
         * then execute onEnd callback function.
         *
         * @param {TouchEvent} evt
         */
        function handleEnd(evt) {
            const touches = evt.changedTouches;
            /** @type {Touch} */
            const touchEnd = touches[0];
            const timeEnd = new Date();
            const delta = timeEnd.getTime() - me.timeStart.getTime();
            // process swipe events
            if (delta <= me.thresholdTime) {
                // this is short enough event
                const dX = Math.abs(touchEnd.clientX - me.touchStart.clientX);
                const dY = Math.abs(touchEnd.clientY - me.touchStart.clientY);
                if ((dX > me.thresholdDistance) || (dY > me.thresholdDistance)) {
                    // this is significant movement
                    if (dX > dY) {
                        // horizontal swipe
                        if (touchEnd.clientX < me.touchStart.clientX) {    // to the left
                            if (typeof me.callOnLeft === 'function') me.callOnLeft({
                                touchStart: me.touchStart,
                                touchEnd,
                                timeStart: me.timeStart,
                                timeEnd,
                            });
                        } else {    // to the right
                            if (typeof me.callOnRight === 'function') me.callOnRight({
                                touchStart: me.touchStart,
                                touchEnd,
                                timeStart: me.timeStart,
                                timeEnd,
                            });
                        }
                    } else {
                        // vertical swipe
                        if (touchEnd.clientY < me.touchStart.clientY) {    // upward
                            if (typeof me.callOnUp === 'function') me.callOnUp({
                                touchStart: me.touchStart,
                                touchEnd,
                                timeStart: me.timeStart,
                                timeEnd,
                            });
                        } else {    // downward
                            if (typeof me.callOnDown === 'function') me.callOnDown({
                                touchStart: me.touchStart,
                                touchEnd,
                                timeStart: me.timeStart,
                                timeEnd,
                            });
                        }
                    }
                }
            } else {
                // process end event for movement
                if (typeof me.callOnEnd === 'function') me.callOnEnd({
                    touchStart: me.touchStart,
                    touchEnd,
                    timeStart: me.timeStart,
                    timeEnd,
                });
            }
        }

        /**
         * Execute onMove callback if time delta is above time threshold and movement is above distance threshold.
         * @param {TouchEvent} evt
         */
        function handleMove(evt) {
            evt.preventDefault();   // prevent page refresh on downward swipe
            if (typeof me.callOnMove === 'function') {
                const touches = evt.changedTouches;
                /** @type {Touch} */
                const touchEnd = touches[0];
                const dX = Math.abs(touchEnd.clientX - me.touchStart.clientX);
                const dY = Math.abs(touchEnd.clientY - me.touchStart.clientY);
                if ((dX > me.thresholdDistance) || (dY > me.thresholdDistance)) {
                    const timeEnd = new Date();
                    // this is significant movement
                    const touches = evt.changedTouches;
                    /** @type {Touch} */
                    const touchEnd = touches[0];
                    me.callOnMove({
                        touchStart: me.touchStart,
                        touchEnd,
                        timeStart: me.timeStart,
                        timeEnd
                    });
                }
            }
        }

        // MAIN FUNCTIONALITY
        this.element = typeof (element) === 'string' ? document.querySelector(element) : element;
        this.element.addEventListener('touchstart', handleStart, {passive: true});
        this.element.addEventListener('touchend', handleEnd, {passive: true});
        this.element.addEventListener('touchmove', handleMove, {passive: false});
        this.element.addEventListener('touchcancel', handleCancel, {passive: true});
    }

    /**
     * Handler to process 'cancel' event.
     *
     * Input arguments: {
     *  touchStart: Touch,
     *  timeStart: Date,
     *  eventCancel: TouchEvent
     * }
     * @param {Function} callback
     */
    setOnCancel(callback) {
        this.callOnCancel = callback;
    }

    /**
     * Handler to process 'swipe down' event (if touch time is below threshold).
     *
     * Input arguments: {
     *  touchStart: Touch,
     *  touchEnd: Touch,
     *  timeStart: Date,
     *  timeEnd: Date
     * }
     * @param {Function} callback
     */
    setOnDown(callback) {
        this.callOnDown = callback;
    }

    /**
     * Handler to process 'start' event.
     *
     * Input arguments: {
     *  touchStart: Touch,
     *  timeStart: Date
     * }
     * @param {Function} callback
     */
    setOnEnd(callback) {
        this.callOnEnd = callback;
    }

    /**
     * Handler to process 'swipe left' event (if touch time is below threshold).
     *
     * Input arguments: {
     *  touchStart: Touch,
     *  touchEnd: Touch,
     *  timeStart: Date,
     *  timeEnd: Date
     * }
     * @param {Function} callback
     */
    setOnLeft(callback) {
        this.callOnLeft = callback;
    }

    /**
     * Handler to process 'move' event (if touch time and movement distance are above thresholds).
     *
     * Input arguments: {
     *  touchStart: Touch,
     *  touchEnd: Touch,
     *  timeStart: Date,
     *  timeEnd: Date
     * }
     * @param {Function} callback
     */
    setOnMove(callback) {
        this.callOnMove = callback;
    }

    /**
     * Handler to process 'swipe right' event (if touch time is below threshold).
     *
     * Input arguments: {
     *  touchStart: Touch,
     *  touchEnd: Touch,
     *  timeStart: Date,
     *  timeEnd: Date
     * }
     * @param {Function} callback
     */
    setOnRight(callback) {
        this.callOnRight = callback;
    }

    /**
     * Handler to process 'start' event.
     *
     * Input arguments: {
     *  touchStart: Touch,
     *  timeStart: Date
     * }
     * @param {Function} callback
     */
    setOnStart(callback) {
        this.callOnStart = callback;
    }

    /**
     * Handler to process 'swipe up' event (if touch time is below threshold).
     *
     * Input arguments: {
     *  touchStart: Touch,
     *  touchEnd: Touch,
     *  timeStart: Date,
     *  timeEnd: Date
     * }
     * @param {Function} callback
     */
    setOnUp(callback) {
        this.callOnUp = callback;
    }
}
