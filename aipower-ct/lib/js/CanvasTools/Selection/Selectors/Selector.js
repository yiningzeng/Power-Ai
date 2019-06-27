"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Element_1 = require("../Component/Element");
/**
 * The abstract class to define region selectors.
 */
class Selector extends Element_1.Element {
    /**
     * Creates new selector.
     * @param parent - The parent (host) SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box for selector.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent, paper, boundRect, callbacks) {
        super(paper, boundRect);
        /**
         * The flag to define if selector is enabled or disabled.
         */
        this.isEnabled = true;
        this.parentNode = parent;
        if (callbacks !== undefined) {
            this.callbacks = callbacks;
        }
        else {
            this.callbacks = {
                onLocked: null,
                onSelectionBegin: null,
                onSelectionEnd: null,
                onUnlocked: null,
            };
        }
    }
    /**
     * Enables and shows this selector.
     */
    enable() {
        if (!this.isEnabled) {
            this.isEnabled = true;
            this.show();
        }
    }
    /**
     * Disables and hides this selector.
     */
    disable() {
        if (this.isEnabled) {
            this.isEnabled = false;
            this.hide();
        }
    }
    /**
     * Helper function to subscribe collection of elements to specified listeners.
     * @param listeners - The collection of `IEventDescriptor` objects.
     */
    subscribeToEvents(listeners) {
        listeners.forEach((e) => {
            e.base.addEventListener(e.event, this.enablify(e.listener.bind(this), e.bypass));
        });
    }
    /**
     * Helper function to wrap listener with the enablement flag.
     * @param f - The function to wrap.
     * @param bypass - The `bypass` flag to define whether event should be captured.
     */
    enablify(f, bypass = false) {
        return (args) => {
            if (this.isEnabled || bypass) {
                f(args);
            }
        };
    }
    /**
     * Shows all the elements in specified array.
     * @param elements - The array of elements to show.
     */
    showAll(elements) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                if (element.show !== undefined) {
                    element.show();
                }
                else {
                    element.node.setAttribute("visibility", "visible");
                }
            });
        });
    }
    /**
     * Hides all the elements in specified array.
     * @param elements - The array of elements to hide.
     */
    hideAll(elements) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                if (element.hide !== undefined) {
                    element.hide();
                }
                else {
                    element.node.setAttribute("visibility", "hidden");
                }
            });
        });
    }
    /**
     * Resizes all the elements to the `boundRect` of this element.
     * @param elemenets - The array of elements to resize.
     */
    resizeAll(elements) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                element.resize(this.boundRect.width, this.boundRect.height);
            });
        });
    }
    /**
     * Helper function to move the cross element to specified position.
     * @param cross - The cross element to move.
     * @param pointTo - The new position of the cross element.
     * @param square - The flag that movement should be related to reference point of a square
     */
    moveCross(cross, pointTo, square = false, ref = null) {
        cross.move(pointTo, this.boundRect, square, ref);
    }
    /**
     * Helper function to move a point element to specified position
     * @param point - The point element to move.
     * @param pointTo - The new position of the point.
     */
    movePoint(point, pointTo) {
        point.attr({
            cx: pointTo.x,
            cy: pointTo.y,
        });
    }
    /**
     * Helper function to move a line element to specified begin and end positions
     * @param line - The line element to move.
     * @param pointFrom - The begin point.
     * @param pointTo - The end point.
     */
    moveLine(line, pointFrom, pointTo) {
        line.attr({
            x1: pointFrom.x,
            x2: pointTo.x,
            y1: pointFrom.y,
            y2: pointTo.y,
        });
    }
}
exports.Selector = Selector;
//# sourceMappingURL=Selector.js.map