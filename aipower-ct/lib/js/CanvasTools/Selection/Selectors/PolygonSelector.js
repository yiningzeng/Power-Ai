"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const RegionData_1 = require("../../Core/RegionData");
const CrossElement_1 = require("../Component/CrossElement");
const Selector_1 = require("./Selector");
/**
 * The selector to define a polygon-region.
 */
class PolygonSelector extends Selector_1.Selector {
    /**
     * Creates new `PolygonSelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        /**
         * Default point radius.
         */
        this.pointRadius = 3;
        /**
         * Current state of selector.
         */
        this.isCapturing = false;
        this.buildUIElements();
        this.reset();
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
        this.hideAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }
    /**
     * Shows the selector.
     */
    show() {
        super.show();
        this.showAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }
    /**
     * Disables and hides this selector.
     */
    disable() {
        this.reset();
        super.disable();
    }
    /**
     * Builds selector's UI.
     */
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("polygonSelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.nextPoint = this.paper.circle(0, 0, this.pointRadius);
        this.nextPoint.addClass("nextPointStyle");
        this.nextSegment = this.paper.g();
        this.nextL1 = this.paper.line(0, 0, 0, 0);
        this.nextLN = this.paper.line(0, 0, 0, 0);
        this.nextL1.addClass("nextSegmentStyle");
        this.nextLN.addClass("nextSegmentStyle");
        this.nextSegment.add(this.nextL1);
        this.nextSegment.add(this.nextLN);
        this.pointsGroup = this.paper.g();
        this.pointsGroup.addClass("polygonGroupStyle");
        this.polygon = this.paper.polygon([]);
        this.polygon.addClass("polygonStyle");
        this.node.add(this.polygon);
        this.node.add(this.pointsGroup);
        this.node.add(this.crossA.node);
        this.node.add(this.nextSegment);
        this.node.add(this.nextPoint);
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
                listener: (e) => {
                    if (!this.isCapturing) {
                        this.hide();
                    }
                    else {
                        const rect = this.parentNode.getClientRects();
                        const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.nextPoint, p);
                    }
                },
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.parentNode,
                listener: (e) => {
                    if (!this.isCapturing) {
                        this.isCapturing = true;
                        if (typeof this.callbacks.onSelectionBegin === "function") {
                            this.callbacks.onSelectionBegin();
                        }
                    }
                },
                bypass: false,
            },
            {
                event: "click",
                base: this.parentNode,
                listener: (e) => {
                    if (e.detail <= 1) {
                        window.requestAnimationFrame(() => {
                            const p = new Point2D_1.Point2D(this.crossA.x, this.crossA.y);
                            this.addPoint(p.x, p.y);
                            this.lastPoint = p;
                        });
                    }
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.parentNode,
                listener: (e) => {
                    window.requestAnimationFrame(() => {
                        const rect = this.parentNode.getClientRects();
                        const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.show();
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.nextPoint, p);
                        if (this.lastPoint != null) {
                            this.moveLine(this.nextLN, this.lastPoint, p);
                            this.moveLine(this.nextL1, this.points[0], p);
                        }
                        else {
                            this.moveLine(this.nextLN, p, p);
                            this.moveLine(this.nextL1, p, p);
                        }
                    });
                    e.preventDefault();
                },
                bypass: false,
            },
            {
                event: "dblclick",
                base: this.parentNode,
                listener: () => this.submitPolygon(),
                bypass: false,
            },
            {
                event: "keyup",
                base: window,
                listener: (e) => {
                    if (e.code === "Escape") {
                        this.submitPolygon();
                    }
                },
                bypass: true,
            },
        ];
        this.subscribeToEvents(listeners);
    }
    /**
     * Resets the selector.
     */
    reset() {
        this.points = new Array();
        this.lastPoint = null;
        let ps = this.pointsGroup.children();
        while (ps.length > 0) {
            ps[0].remove();
            ps = this.pointsGroup.children();
        }
        this.polygon.attr({
            points: "",
        });
        if (this.isCapturing) {
            this.isCapturing = false;
        }
    }
    /**
     * Adds a new point to polygon at specified coordinates
     * @param x - x-coordinate of the new point.
     * @param y - y-coordinate of the new point.
     */
    addPoint(x, y) {
        this.points.push(new Point2D_1.Point2D(x, y));
        const point = this.paper.circle(x, y, this.pointRadius);
        point.addClass("polygonPointStyle");
        this.pointsGroup.add(point);
        let pointsStr = "";
        this.points.forEach((p) => {
            pointsStr += `${p.x},${p.y},`;
        });
        this.polygon.attr({
            points: pointsStr.substr(0, pointsStr.length - 1),
        });
    }
    /**
     * Submits the new polygon region to the callback function.
     */
    submitPolygon() {
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const box = this.polygon.getBBox();
            this.callbacks.onSelectionEnd(new RegionData_1.RegionData(box.x, box.y, box.width, box.height, this.points.map((p) => p.copy()), RegionData_1.RegionDataType.Polygon));
        }
        this.reset();
    }
}
exports.PolygonSelector = PolygonSelector;
//# sourceMappingURL=PolygonSelector.js.map