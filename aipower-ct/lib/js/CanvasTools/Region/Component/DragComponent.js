"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const IRegionCallbacks_1 = require("../../Interface/IRegionCallbacks");
const RegionComponent_1 = require("./RegionComponent");
/**
 * An abstract visual component used internall do allow dragging the whole region.
 */
class DragComponent extends RegionComponent_1.RegionComponent {
    /**
     * Creates a new `DragComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        /**
         * Dragging state of the component.
         */
        this.isDragged = false;
        this.node = paper.g();
        this.node.addClass("dragLayer");
    }
    /**
     * Switches the component to the frozen state.
     */
    freeze() {
        super.freeze();
        this.dragNode.undrag();
        this.onManipulationEnd();
    }
    /**
     * Callback for the dragbegin event.
     */
    onDragBegin() {
        this.dragOrigin = new Point2D_1.Point2D(this.x, this.y);
    }
    /**
     * Callback for the dragmove event.
     * @param dx - Diff in the `x`-coordinate of draggable element.
     * @param dy - Diff in the `y`-coordinate of draggable element.
     * @remarks This method directly calls the `onChange` callback wrapper.
     */
    onDragMove(dx, dy) {
        if (dx !== 0 && dy !== 0) {
            let p = new Point2D_1.Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);
            if (this.paperRect !== null) {
                p = p.boundToRect(this.paperRect);
            }
            const rd = this.regionData.copy();
            rd.move(p);
            this.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVING);
        }
    }
    /**
     * Callback for the dragend event.
     */
    onDragEnd() {
        this.dragOrigin = null;
        this.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEEND);
    }
    /**
     * Helper function to subscibe the draggable element to events.
     */
    subscribeToDragEvents() {
        const listeners = [
            {
                event: "pointerenter",
                base: this.dragNode.node,
                listener: (e) => {
                    this.dragNode.undrag();
                    this.dragNode.drag(this.onDragMove.bind(this), this.onDragBegin.bind(this), this.onDragEnd.bind(this));
                    this.isDragged = true;
                    this.onManipulationBegin();
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.dragNode.node,
                listener: (e) => {
                    if (!this.isDragged) {
                        this.dragNode.undrag();
                        this.dragNode.drag(this.onDragMove.bind(this), this.onDragBegin.bind(this), this.onDragEnd.bind(this));
                        this.isDragged = true;
                        this.onManipulationBegin();
                    }
                },
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.dragNode.node,
                listener: (e) => {
                    this.dragNode.undrag();
                    this.isDragged = false;
                    this.onManipulationEnd();
                },
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.dragNode.node,
                listener: (e) => {
                    this.dragNode.node.setPointerCapture(e.pointerId);
                    const multiselection = e.ctrlKey;
                    this.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEBEGIN, multiselection);
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.dragNode.node,
                listener: (e) => {
                    this.dragNode.node.releasePointerCapture(e.pointerId);
                    const multiselection = e.ctrlKey;
                    this.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.SELECTIONTOGGLE, multiselection);
                },
                bypass: false,
            },
        ];
        this.subscribeToEvents(listeners);
    }
}
exports.DragComponent = DragComponent;
//# sourceMappingURL=DragComponent.js.map