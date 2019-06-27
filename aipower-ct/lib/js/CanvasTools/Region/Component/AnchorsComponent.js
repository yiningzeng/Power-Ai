"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const IRegionCallbacks_1 = require("../../Interface/IRegionCallbacks");
const RegionComponent_1 = require("./RegionComponent");
/**
 * An abstract visual component used internall to draw anchor points that allow
 * region points moving and this component resizing.
 */
class AnchorsComponent extends RegionComponent_1.RegionComponent {
    /**
     * Creates a new `AnchorsComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        /**
         * The index of currently active anchor.
         */
        this.activeAnchorIndex = -1;
        this.node = paper.g();
        this.node.addClass("anchorsLayer");
        this.anchors = [];
        this.anchorsNode = paper.g();
        this.buildAnchors();
        this.ghostAnchor = this.createAnchor(paper, 0, 0, "ghost", AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS);
        this.ghostAnchor.attr({
            display: "none",
        });
        this.node.add(this.anchorsNode);
        this.node.add(this.ghostAnchor);
        const listeners = [
            { event: "pointerenter", listener: this.onGhostPointerEnter, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerleave", listener: this.onGhostPointerLeave, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerdown", listener: this.onGhostPointerDown, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerup", listener: this.onGhostPointerUp, base: this.ghostAnchor.node, bypass: false },
            { event: "pointermove", listener: this.onGhostPointerMove, base: this.ghostAnchor.node, bypass: false },
        ];
        this.subscribeToEvents(listeners);
    }
    /**
     * Redraws the visual on the component.
     */
    redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
            window.requestAnimationFrame(() => {
                this.regionData.points.forEach((p, index) => {
                    this.anchors[index].attr({
                        cx: p.x,
                        cy: p.y,
                    });
                });
            });
        }
    }
    /**
     * Switches the component to the frozen state.
     */
    freeze() {
        super.freeze();
        this.ghostAnchor.undrag();
        this.onManipulationEnd();
    }
    /**
     * Creates a collection on anchors.
     */
    buildAnchors() {
        this.buildPointAnchors();
    }
    /**
     * Creates a collection of anchor points.
     */
    buildPointAnchors() {
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);
            this.subscribeAnchorToEvents(anchor, index);
        });
    }
    /**
     * Helper function to subscribe anchor to activation event.
     * @param anchor - The anchor for wire up.
     * @param index - The index of the anchor used to define which one is active.
     */
    subscribeAnchorToEvents(anchor, index) {
        anchor.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                // Set drag origin point to current anchor
                this.dragOrigin = this.regionData.points[index];
                this.activeAnchorIndex = index;
                // Move ghost anchor to current anchor position
                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: this.dragOrigin.x,
                        cy: this.dragOrigin.y,
                        display: "block",
                    });
                });
                this.onManipulationBegin();
            }
        });
    }
    /**
     * Helper function to create a new anchor.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param x - The `x`-coordinate of the acnhor.
     * @param y - The `y`-coordinate of the anchor.
     * @param style - Additional css style class to be applied.
     * @param r - The radius of the anchor.
     */
    createAnchor(paper, x, y, style, r = AnchorsComponent.DEFAULT_ANCHOR_RADIUS) {
        const a = paper.circle(x, y, r);
        a.addClass("anchorStyle");
        if (style !== undefined && style !== "") {
            a.addClass(style);
        }
        return a;
    }
    /**
     * Callback for the dragbegin event.
     */
    anchorDragBegin() {
        // do nothing
    }
    /**
     * Callback for the dragmove event. Uses `dragOrigin` to calculate new position.
     * @param dx - Diff in the `x`-coordinate.
     * @param dy - Diff in the `y`-coordinate.
     * @param x - New `x`-coordinate.
     * @param y - New `y`-coordinate.
     * @remarks This method calls the `updateRegion` method to actually make any changes in data.
     */
    anchorDragMove(dx, dy, x, y) {
        let p = new Point2D_1.Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);
        if (this.paperRect !== null) {
            p = p.boundToRect(this.paperRect);
        }
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({ cx: p.x, cy: p.y });
        });
        this.updateRegion(p);
    }
    /**
     * Callback for the dranend event.
     */
    anchorDragEnd() {
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });
        this.activeAnchorIndex = -1;
    }
    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerEnter(e) {
        this.ghostAnchor.drag(this.anchorDragMove.bind(this), this.anchorDragBegin.bind(this), this.anchorDragEnd.bind(this));
        this.onManipulationBegin();
    }
    /**
     * Callback for the pointerleave event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerLeave(e) {
        this.ghostAnchor.undrag();
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });
        this.activeAnchorIndex = -1;
        this.onManipulationEnd();
    }
    /**
     * Callback for the pointerdown event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerDown(e) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);
        this.dragOrigin = new Point2D_1.Point2D(e.offsetX, e.offsetY);
        this.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEBEGIN);
    }
    /**
     * Callback for the pointermove event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerMove(e) {
        // do nothing
    }
    /**
     * Callback for the pointerup event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerUp(e) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        this.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEEND);
    }
}
/**
 * Default radius for anchor poitns. Can be redefined through CSS styles.
 */
AnchorsComponent.DEFAULT_ANCHOR_RADIUS = 3;
/**
 * Defailt radius for the ghost anchor, used activate dragging. Can be redefined through CSS styles.
 */
AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS = 7;
exports.AnchorsComponent = AnchorsComponent;
//# sourceMappingURL=AnchorsComponent.js.map