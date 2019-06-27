"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DragComponent_1 = require("../Component/DragComponent");
/**
 * `DragComponent` for the `PolylineRegion` class.
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
        this.dragNode = paper.rect(this.x, this.y, this.width, this.height);
        this.dragNode.addClass("dragRectStyle");
        this.node.add(this.dragNode);
        this.subscribeToDragEvents();
    }
    /**
     * Redraws the componnent.
     */
    redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            });
        });
    }
}
exports.DragElement = DragElement;
//# sourceMappingURL=DragElement.js.map