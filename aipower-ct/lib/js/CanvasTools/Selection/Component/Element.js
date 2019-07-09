"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract class for building blocks of selectors.
 */
class Element {
    /**
     * Creates new `Element` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     */
    constructor(paper, boundRect) {
        /**
         * The element visibility flag.
         */
        this.isVisible = true;
        this.paper = paper;
        this.boundRect = boundRect;
    }
    /**
     * The `width` of the element.
     */
    get width() {
        return this.boundRect.width;
    }
    /**
     * The `height` of the element.
     */
    get height() {
        return this.boundRect.height;
    }
    /**
     * Makes elemement visually hidden.
     */
    hide() {
        this.node.node.setAttribute("visibility", "hidden");
        this.isVisible = false;
    }
    /**
     * Makes element visible.
     */
    show() {
        this.node.node.setAttribute("visibility", "visible");
        this.isVisible = true;
    }
    /**
     * Resizes element to specified `width` and `height`.
     * @param width - New element `width`.
     * @param height - New element `height`.
     */
    resize(width, height) {
        this.boundRect.resize(width, height);
    }
}
exports.Element = Element;
//# sourceMappingURL=Element.js.map