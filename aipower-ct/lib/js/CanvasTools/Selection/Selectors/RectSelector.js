"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const Rect_1 = require("../../Core/Rect");
const RegionData_1 = require("../../Core/RegionData");
const CrossElement_1 = require("../Component/CrossElement");
const MaskElement_1 = require("../Component/MaskElement");
const RectElement_1 = require("../Component/RectElement");
const Selector_1 = require("./Selector");
/**
 * Enum to specify selection mode.
 */
var SelectionModificator;
(function (SelectionModificator) {
    SelectionModificator[SelectionModificator["RECT"] = 0] = "RECT";
    SelectionModificator[SelectionModificator["SQUARE"] = 1] = "SQUARE";
})(SelectionModificator = exports.SelectionModificator || (exports.SelectionModificator = {}));
/**
 * The selector to define a rect-region.
 */
class RectSelector extends Selector_1.Selector {
    /**
     * Creates new `RectSelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        /**
         * Internal flag for selection state.
         */
        this.capturingState = false;
        /**
         * Internal flag for selection mode.
         */
        this.isTwoPoints = false;
        /**
         * Internal flag for selection type.
         */
        this.selectionModificator = SelectionModificator.RECT;
        this.buildUIElements();
        this.hide();
    }
    /**
     * Resizes the selector to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    resize(width, height) {
        super.resize(width, height);
        this.resizeAll([this.mask, this.crossA, this.crossB]);
    }
    /**
     * Hides the selector.
     */
    hide() {
        super.hide();
        this.hideAll([this.crossA, this.crossB, this.mask]);
    }
    /**
     * Shows the selector.
     */
    show() {
        super.show();
        this.crossA.show();
    }
    /**
     * Builds selector's UI.
     */
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectSelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.crossB = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.selectionBox = new RectElement_1.RectElement(this.paper, this.boundRect, new Rect_1.Rect(0, 0));
        this.selectionBox.node.addClass("selectionBoxStyle");
        this.mask = new MaskElement_1.MaskElement(this.paper, this.boundRect, this.selectionBox);
        this.node.add(this.mask.node);
        this.node.add(this.crossA.node);
        this.node.add(this.crossB.node);
        const listeners = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "keydown", listener: this.onKeyDown, base: window, bypass: false },
            { event: "keyup", listener: this.onKeyUp, base: window, bypass: true },
        ];
        this.subscribeToEvents(listeners);
    }
    /**
     * Helper function to move the rect element to specified locations.
     * @param box - The box to move.
     * @param pa - The first corner point.
     * @param pb - The opposite corner point.
     */
    moveSelectionBox(box, pa, pb) {
        const x = (pa.x < pb.x) ? pa.x : pb.x;
        const y = (pa.y < pb.y) ? pa.y : pb.y;
        const w = Math.abs(pa.x - pb.x);
        const h = Math.abs(pa.y - pb.y);
        box.move(new Point2D_1.Point2D(x, y));
        box.resize(w, h);
    }
    /**
     * Listener for the pointer enter event.
     * @param e PointerEvent
     */
    onPointerEnter(e) {
        window.requestAnimationFrame(() => {
            this.crossA.show();
        });
    }
    /**
     * Listener for the pointer leave event.
     * @param e PointerEvent
     */
    onPointerLeave(e) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
            if (!this.capturingState) {
                this.hideAll([this.crossA, this.crossB, this.selectionBox]);
            }
            else if (this.isTwoPoints && this.capturingState) {
                this.moveCross(this.crossB, p);
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
            }
        });
    }
    /**
     * Listener for the pointer down event.
     * @param e PointerEvent
     */
    onPointerDown(e) {
        window.requestAnimationFrame(() => {
            if (!this.isTwoPoints) {
                this.capturingState = true;
                this.parentNode.setPointerCapture(e.pointerId);
                this.moveCross(this.crossB, this.crossA);
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                this.showAll([this.mask, this.crossB, this.selectionBox]);
                if (typeof this.callbacks.onSelectionBegin === "function") {
                    this.callbacks.onSelectionBegin();
                }
            }
        });
    }
    /**
     * Listener for the pointer up event.
     * @param e PointerEvent
     */
    onPointerUp(e) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
            if (!this.isTwoPoints) {
                this.capturingState = false;
                this.parentNode.releasePointerCapture(e.pointerId);
                this.hideAll([this.crossB, this.mask]);
                if (typeof this.callbacks.onSelectionEnd === "function") {
                    const x = Math.min(this.crossA.x, this.crossB.x);
                    const y = Math.min(this.crossA.y, this.crossB.y);
                    const w = Math.abs(this.crossA.x - this.crossB.x);
                    const h = Math.abs(this.crossA.y - this.crossB.y);
                    this.callbacks.onSelectionEnd(RegionData_1.RegionData.BuildRectRegionData(x, y, w, h));
                }
            }
            else {
                if (this.capturingState) {
                    this.capturingState = false;
                    this.hideAll([this.crossB, this.mask]);
                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        const x = Math.min(this.crossA.x, this.crossB.x);
                        const y = Math.min(this.crossA.y, this.crossB.y);
                        const w = Math.abs(this.crossA.x - this.crossB.x);
                        const h = Math.abs(this.crossA.y - this.crossB.y);
                        this.callbacks.onSelectionEnd(RegionData_1.RegionData.BuildRectRegionData(x, y, w, h));
                    }
                    this.moveCross(this.crossA, p);
                    this.moveCross(this.crossB, p);
                }
                else {
                    this.capturingState = true;
                    this.moveCross(this.crossB, p);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                    this.showAll([this.crossA, this.crossB, this.selectionBox, this.mask]);
                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                }
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
            if (!this.isTwoPoints) {
                if (this.capturingState) {
                    this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                }
                else {
                    this.moveCross(this.crossA, p);
                }
            }
            else {
                if (this.capturingState) {
                    this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                }
                else {
                    this.moveCross(this.crossA, p);
                    this.moveCross(this.crossB, p);
                }
            }
        });
        e.preventDefault();
    }
    /**
     * Listener for the key down event.
     * @param e KeyboardEvent
     */
    onKeyDown(e) {
        // Holding shift key enable square drawing mode
        if (e.shiftKey) {
            this.selectionModificator = SelectionModificator.SQUARE;
        }
        if (e.ctrlKey && !this.capturingState) {
            this.isTwoPoints = true;
        }
    }
    /**
     * Listener for the key up event.
     * @param e KeyboardEvent
     */
    onKeyUp(e) {
        // Holding shift key enable square drawing mode
        if (!e.shiftKey) {
            this.selectionModificator = SelectionModificator.RECT;
        }
        // Holding Ctrl key to enable two point selection mode
        if (!e.ctrlKey && this.isTwoPoints) {
            this.isTwoPoints = false;
            this.capturingState = false;
            this.moveCross(this.crossA, this.crossB);
            this.hideAll([this.crossB, this.selectionBox, this.mask]);
        }
    }
}
exports.RectSelector = RectSelector;
//# sourceMappingURL=RectSelector.js.map