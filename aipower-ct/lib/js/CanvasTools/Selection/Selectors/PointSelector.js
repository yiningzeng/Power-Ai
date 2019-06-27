"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const RegionData_1 = require("../../Core/RegionData");
const CrossElement_1 = require("../Component/CrossElement");
const Selector_1 = require("./Selector");
/**
 * The selector to define a point-region.
 */
class PointSelector extends Selector_1.Selector {
    /**
     * Creates new `PointSelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
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
        this.crossA.resize(width, height);
    }
    /**
     * Hides the selector.
     */
    hide() {
        super.hide();
        this.hideAll([this.crossA, this.point]);
    }
    /**
     * Shows the selector.
     */
    show() {
        super.show();
        this.showAll([this.crossA, this.point]);
    }
    /**
     * Builds selector's UI.
     */
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("pointSelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.point = this.paper.circle(0, 0, PointSelector.DEFAULT_POINT_RADIUS);
        this.point.addClass("pointStyle");
        this.node.add(this.crossA.node);
        this.node.add(this.point);
        const listeners = [
            {
                event: "pointerenter",
                base: this.parentNode,
                listener: () => this.show(),
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.parentNode,
                listener: () => this.hide(),
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.parentNode,
                listener: (e) => {
                    this.show();
                    this.movePoint(this.point, this.crossA);
                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.parentNode,
                listener: (e) => {
                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        this.callbacks.onSelectionEnd(RegionData_1.RegionData.BuildPointRegionData(this.crossA.x, this.crossA.y));
                    }
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.parentNode,
                listener: (e) => {
                    const rect = this.parentNode.getClientRects();
                    const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.show();
                    this.moveCross(this.crossA, p);
                    this.movePoint(this.point, this.crossA);
                    e.preventDefault();
                },
                bypass: false,
            },
        ];
        this.subscribeToEvents(listeners);
    }
}
/**
 * Default radius for the point element. Can be redefined through css styles.
 */
PointSelector.DEFAULT_POINT_RADIUS = 6;
exports.PointSelector = PointSelector;
//# sourceMappingURL=PointSelector.js.map