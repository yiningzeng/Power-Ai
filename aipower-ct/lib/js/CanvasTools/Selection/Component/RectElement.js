"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const Rect_1 = require("../../Core/Rect");
const Element_1 = require("./Element");
/**
 * The rect element for selectors
 */
class RectElement extends Element_1.Element {
    /**
     * The `x`-coordinate of the cross center.
     */
    get x() {
        return this.originPoint.x;
    }
    /**
     * The `y`-coordinate of the cross center.
     */
    get y() {
        return this.originPoint.y;
    }
    /**
     * Creates the new `RectElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     * @param rect - The rect size.
     */
    constructor(paper, boundRect, rect) {
        super(paper, boundRect);
        this.rect = new Rect_1.Rect(rect.width, rect.height);
        this.originPoint = new Point2D_1.Point2D(0, 0);
        this.buildUIElements();
        this.hide();
    }
    /**
     * Moves rect element to specified location.
     * @param p - The new rect location.
     */
    move(p) {
        this.node.node.setAttribute("x", p.x.toString());
        this.node.node.setAttribute("y", p.y.toString());
        this.originPoint.move(p);
    }
    /**
     * Resizes the element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    resize(width, height) {
        this.rect.resize(width, height);
        this.node.node.setAttribute("height", height.toString());
        this.node.node.setAttribute("width", width.toString());
    }
    /**
     * Builds the visual presentation of the element.
     */
    buildUIElements() {
        this.node = this.paper.rect(0, 0, this.rect.width, this.rect.height);
    }
}
exports.RectElement = RectElement;
//# sourceMappingURL=RectElement.js.map