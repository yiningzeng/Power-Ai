"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DragComponent_1 = require("../Component/DragComponent");
/**
 * `DragComponent` for the `PointRegion` class.
 */
class DragElement extends DragComponent_1.DragComponent {
    /**
     * Creates a new `DragElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.dragNode = paper.circle(this.x, this.y, DragElement.DEFAULT_DRAG_RADIUS);
        this.dragNode.addClass("dragPointStyle");
        this.node.add(this.dragNode);
        this.subscribeToDragEvents();
    }
    /**
     * Redraws the componnent.
     */
    redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                cx: this.x,
                cy: this.y,
            });
        });
    }
}
/**
 * Default (visual) radius for point drag-component.
 */
DragElement.DEFAULT_DRAG_RADIUS = 7;
exports.DragElement = DragElement;
//# sourceMappingURL=DragElement.js.map