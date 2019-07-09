"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const Rect_1 = require("../../Core/Rect");
const RegionData_1 = require("../../Core/RegionData");
const CrossElement_1 = require("../Component/CrossElement");
const RectElement_1 = require("../Component/RectElement");
const Selector_1 = require("./Selector");
/**
 * The selector to define a rect-region using a template.
 */
class RectCopySelector extends Selector_1.Selector {
    /**
     * Creates new `RectCopySelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param copyRect - The template rect for selection.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent, paper, boundRect, copyRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.copyRect = copyRect;
        this.buildUIElements();
        this.hide();
    }
    /**
     * Updates the template for selector.
     * @param copyRect - New template rect.
     */
    setTemplate(copyRect) {
        this.copyRect = new Rect_1.Rect(copyRect.width, copyRect.height);
        this.copyRectEl.resize(copyRect.width, copyRect.height);
        this.moveCopyRect(this.copyRectEl, this.crossA);
    }
    /**
     * Resizes the selector to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    resize(width, height) {
        super.resize(width, height);
        this.crossA.resize(width, height);
    }
    /**
     * Hides the selector.
     */
    hide() {
        super.hide();
        this.hideAll([this.crossA, this.copyRectEl]);
    }
    /**
     * Shows the selector.
     */
    show() {
        super.show();
        this.showAll([this.crossA, this.copyRectEl]);
    }
    /**
     * Builds selector's UI.
     */
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectCopySelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.copyRectEl = new RectElement_1.RectElement(this.paper, this.boundRect, this.copyRect);
        this.copyRectEl.node.addClass("copyRectStyle");
        this.node.add(this.crossA.node);
        this.node.add(this.copyRectEl.node);
        const listeners = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "wheel", listener: this.onWheel, base: this.parentNode, bypass: false },
        ];
        this.subscribeToEvents(listeners);
    }
    /**
     * Helper function to move rect to specified point.
     * @param copyRect - The rect element to move.
     * @param p - The new location.
     */
    moveCopyRect(copyRect, p) {
        const x = p.x - copyRect.rect.width / 2;
        const y = p.y - copyRect.rect.height / 2;
        copyRect.move(new Point2D_1.Point2D(x, y));
    }
    /**
     * Listener for the pointer enter event.
     * @param e PointerEvent
     */
    onPointerEnter(e) {
        window.requestAnimationFrame(() => {
            this.crossA.show();
            this.copyRectEl.show();
        });
    }
    /**
     * Listener for the pointer leave event.
     * @param e PointerEvent
     */
    onPointerLeave(e) {
        window.requestAnimationFrame(() => {
            this.hide();
        });
    }
    /**
     * Listener for the pointer down event.
     * @param e PointerEvent
     */
    onPointerDown(e) {
        window.requestAnimationFrame(() => {
            this.show();
            this.moveCopyRect(this.copyRectEl, this.crossA);
            if (typeof this.callbacks.onSelectionBegin === "function") {
                this.callbacks.onSelectionBegin();
            }
        });
    }
    /**
     * Listener for the pointer up event.
     * @param e PointerEvent
     */
    onPointerUp(e) {
        window.requestAnimationFrame(() => {
            if (typeof this.callbacks.onSelectionEnd === "function") {
                let p1 = new Point2D_1.Point2D(this.crossA.x - this.copyRect.width / 2, this.crossA.y - this.copyRect.height / 2);
                let p2 = new Point2D_1.Point2D(this.crossA.x + this.copyRect.width / 2, this.crossA.y + this.copyRect.height / 2);
                p1 = p1.boundToRect(this.boundRect);
                p2 = p2.boundToRect(this.boundRect);
                const width = p2.x - p1.x;
                const height = p2.y - p1.y;
                const regionData = RegionData_1.RegionData.BuildRectRegionData(p1.x, p1.y, width, height);
                this.callbacks.onSelectionEnd(regionData);
            }
        });
    }
    /**
     * Listener for the pointer move event.
     * @param e PointerEvent
     */
    onPointerMove(e) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
            this.crossA.show();
            this.copyRectEl.show();
            this.moveCross(this.crossA, p);
            this.moveCopyRect(this.copyRectEl, this.crossA);
        });
        e.preventDefault();
    }
    /**
     * Listener for the wheel event.
     * @param e WheelEvent
     */
    onWheel(e) {
        let width = this.copyRect.width;
        let height = this.copyRect.height;
        const k = height / width;
        if (e.shiftKey) {
            if (e.deltaY > 0) {
                width *= 1.1;
                height *= 1.1;
            }
            else {
                width /= 1.1;
                height /= 1.1;
            }
        }
        else {
            if (e.deltaY > 0) {
                width += 1.0;
                height += k;
            }
            else {
                width -= 1.0;
                height -= k;
            }
        }
        if (width < 1.0) {
            width = 1.0;
            height = k;
        }
        if (height < 1.0) {
            height = 1.0;
            width = 1.0 / k;
        }
        window.requestAnimationFrame(() => {
            this.copyRect.resize(width, height);
            this.copyRectEl.resize(width, height);
            this.moveCopyRect(this.copyRectEl, this.crossA);
        });
    }
}
exports.RectCopySelector = RectCopySelector;
//# sourceMappingURL=RectCopySelector.js.map