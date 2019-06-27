"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An abstract visial component to define a component of region presentation UI.
 */
class RegionComponent {
    /**
     * Creates a new UI component (part of the region).
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper, paperRect, regionData, callbacks = null) {
        /**
         * Defines if the component is visible.
         */
        this.isVisible = true;
        /**
         * Defines if the component is in a frozen state.
         */
        this.isFrozen = false;
        /**
         * Defines if the component is selected.
         */
        this.isSelected = false;
        this.paper = paper;
        this.paperRect = paperRect;
        this.regionData = regionData;
        this.callbacks = {
            onChange: null,
            onManipulationBegin: null,
            onManipulationEnd: null,
        };
        if (callbacks !== null && callbacks !== undefined) {
            if (callbacks.onManipulationBegin !== undefined) {
                this.callbacks.onManipulationBegin = callbacks.onManipulationBegin;
            }
            if (callbacks.onManipulationEnd !== undefined) {
                this.callbacks.onManipulationEnd = callbacks.onManipulationEnd;
            }
            if (callbacks.onChange !== undefined) {
                this.callbacks.onChange = callbacks.onChange;
            }
        }
    }
    /**
     * The `x`-coordinate of the component. Defined through the `regionaData`.
     */
    get x() {
        return this.regionData.x;
    }
    /**
     * The `y`-coordinate of the component. Defined through the `regionaData`.
     */
    get y() {
        return this.regionData.y;
    }
    /**
     * The `width` of the component. Defined through the `regionaData`.
     */
    get width() {
        return this.regionData.boundRect.width;
    }
    /**
     * The `height` of the component. Defined through the `regionaData`.
     */
    get height() {
        return this.regionData.boundRect.height;
    }
    /**
     * The `area` of the component. Defined through the `regionaData`.
     */
    get area() {
        return this.regionData.area;
    }
    /**
     * The `boundRect` of the component. Defined through the `regionaData`.
     * @remarks Returns the `Rect` object of the same `width` and `height` as the component.
     */
    get boundRect() {
        return this.regionData.boundRect;
    }
    /**
     * Switches the component presentstion to the hidden state.
     */
    hide() {
        this.node.node.setAttribute("visibility", "hidden");
        this.isVisible = false;
    }
    /**
     * Switches the component presentation to the visibile state.
     */
    show() {
        this.node.node.setAttribute("visibility", "visible");
        this.isVisible = true;
    }
    /**
     * Selects the component.
     */
    select() {
        this.isSelected = true;
        this.node.addClass("selected");
    }
    /**
     * Unselecets the component.
     */
    unselect() {
        this.isSelected = false;
        this.node.removeClass("selected");
    }
    /**
     * Switches the component to the frozen state.
     */
    freeze() {
        this.isFrozen = true;
    }
    /**
     * Switches the component to the unfrozen state.
     */
    unfreeze() {
        this.isFrozen = false;
    }
    move(arg1, arg2) {
        this.regionData.move(arg1, arg2);
        this.redraw();
    }
    /**
     * Resizes the component to specified `width` and `height`.
     * @param width - The new `width` for the component.
     * @param height - The new `height` for the component.
     */
    resize(width, height) {
        this.regionData.resize(width, height);
        this.redraw();
    }
    /**
     * Resizes the bounding box for the component.
     * @param width - The new `width` of the bounding box.
     * @param height - The new `height` of the bounding box.
     */
    resizePaper(width, height) {
        this.paperRect.resize(width, height);
    }
    /**
     * The wrapper around external `onChange` callback. Checks whether the callback is defined.
     * @param region - Reference to the component.
     * @param regionData - The `RegionData` object to be passed.
     * @param eventType - The event type.
     * @param multiSelection - The flag for multiple regions selection.
     */
    onChange(region, regionData, eventType, multiSelection) {
        if (this.callbacks.onChange !== null && this.callbacks.onChange !== undefined) {
            this.callbacks.onChange(region, regionData, eventType, multiSelection);
        }
    }
    /**
     * The wrapper around external `onManipulationBegin` callback. Checks whether the callback is defined.
     * @param region - Reference to the component.
     */
    onManipulationBegin(region) {
        if (this.callbacks.onManipulationBegin !== null && this.callbacks.onManipulationBegin !== undefined) {
            this.callbacks.onManipulationBegin(region);
        }
    }
    /**
     * The wrapper around external `onManupulationEnd` callback. Checks whether the callback is defined.
     * @param region - Reference to the component.
     */
    onManipulationEnd(region) {
        if (this.callbacks.onManipulationEnd !== null && this.callbacks.onManipulationEnd !== undefined) {
            this.callbacks.onManipulationEnd(region);
        }
    }
    /**
     * Subscrubes the component elements according to provided event descriptors. Binds to the `this` object.
     * @param listeners - The collection of event descriptors.
     */
    subscribeToEvents(listeners) {
        listeners.forEach((e) => {
            e.base.addEventListener(e.event, this.makeFreezable(e.listener.bind(this), e.bypass));
        });
    }
    /**
     * A helper function to make event listeners froozen if the component state is frozen.
     * @param f - Function to wrap.
     * @param bypass - A flag whether event should bypass.
     */
    makeFreezable(f, bypass = false) {
        return (args) => {
            if (!this.isFrozen || bypass) {
                f(args);
            }
        };
    }
}
exports.RegionComponent = RegionComponent;
//# sourceMappingURL=RegionComponent.js.map