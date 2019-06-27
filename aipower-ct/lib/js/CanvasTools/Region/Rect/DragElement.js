"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DragComponent_1 = require("../Component/DragComponent");
/**
 * `DragComponent` for the `RectRegion` class.
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
        this.dragNode = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
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
                height: this.height,
                width: this.width,
                x: this.x,
                y: this.y,
            });
        });
    }
}
exports.DragElement = DragElement;
//# sourceMappingURL=DragElement.js.map