"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Element_1 = require("./Element");
const RectElement_1 = require("./RectElement");
/**
 * The mask element for selectors
 */
class MaskElement extends Element_1.Element {
    /**
     * Creates a new `MaskElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     * @param maskOut - The element to be used as mask filter.
     */
    constructor(paper, boundRect, maskOut) {
        super(paper, boundRect);
        this.maskOut = maskOut;
        this.buildUIElements();
        this.resize(boundRect.width, boundRect.height);
        this.hide();
    }
    /**
     * Resize the element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    resize(width, height) {
        super.resize(width, height);
        this.mask.resize(width, height);
        this.maskIn.resize(width, height);
    }
    /**
     * Builds the visual presentation of the element.
     */
    buildUIElements() {
        this.mask = this.createMask();
        this.maskIn = this.createMaskIn();
        this.maskOut.node.addClass("maskOutStyle");
        const combinedMask = this.paper.g();
        combinedMask.add(this.maskIn.node);
        combinedMask.add(this.maskOut.node);
        this.mask.node.attr({
            mask: combinedMask,
        });
        this.node = this.mask.node;
    }
    /**
     * Helper function to build the mask rect.
     */
    createMask() {
        const r = new RectElement_1.RectElement(this.paper, this.boundRect, this.boundRect);
        r.node.addClass("maskStyle");
        return r;
    }
    /**
     * Helper function to build the mask-in rect.
     */
    createMaskIn() {
        const r = new RectElement_1.RectElement(this.paper, this.boundRect, this.boundRect);
        r.node.addClass("maskInStyle");
        return r;
    }
}
exports.MaskElement = MaskElement;
//# sourceMappingURL=MaskElement.js.map