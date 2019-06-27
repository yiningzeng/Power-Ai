"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const RegionData_1 = require("../../Core/RegionData");
const CrossElement_1 = require("../Component/CrossElement");
const Selector_1 = require("./Selector");
/**
 * The selector to define a polyline-region.
 */
class PolylineSelector extends Selector_1.Selector {
    /**
     * Creates new `PolylineSelector` object.
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
        this.crossA.hide();
        this.nextPoint.node.setAttribute("visibility", "hidden");
        this.nextSegment.node.setAttribute("visibility", "hidden");
        this.polyline.node.setAttribute("visibility", "hidden");
        this.pointsGroup.node.setAttribute("visibility", "hidden");
    }
    /**
     * Shows the selector.
     */
    show() {
        super.show();
        this.crossA.show();
        this.nextPoint.node.setAttribute("visibility", "visible");
        this.nextSegment.node.setAttribute("visibility", "visible");
        this.polyline.node.setAttribute("visibility", "visible");
        this.pointsGroup.node.setAttribute("visibility", "visible");
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
        this.node.addClass("polylineSelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.nextPoint = this.paper.circle(0, 0, this.pointRadius);
        this.nextPoint.addClass("nextPointStyle");
        this.nextSegment = this.paper.line(0, 0, 0, 0);
        this.nextSegment.addClass("nextSegmentStyle");
        this.pointsGroup = this.paper.g();
        this.pointsGroup.addClass("polylineGroupStyle");
        this.polyline = this.paper.polyline([]);
        this.polyline.addClass("polylineStyle");
        this.node.add(this.polyline);
        this.node.add(this.pointsGroup);
        this.node.add(this.crossA.node);
        this.node.add(this.nextSegment);
        this.node.add(this.nextPoint);
        const listeners = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "click", listener: this.onClick, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "dblclick", listener: this.onDoubleClick, base: this.parentNode, bypass: false },
            { event: "keyup", listener: this.onKeyUp, base: window, bypass: true },
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
        this.polyline.attr({
            points: "",
        });
        if (this.isCapturing) {
            this.isCapturing = false;
        }
    }
    /**
     * Adds a new point to polyline at specified coordinates
     * @param x - x-coordinate of the new point.
     * @param y - y-coordinate of the new point.
     */
    addPoint(x, y) {
        this.points.push(new Point2D_1.Point2D(x, y));
        const point = this.paper.circle(x, y, this.pointRadius);
        point.addClass("polylinePointStyle");
        this.pointsGroup.add(point);
        let pointsStr = "";
        this.points.forEach((p) => {
            pointsStr += `${p.x},${p.y},`;
        });
        this.polyline.attr({
            points: pointsStr.substr(0, pointsStr.length - 1),
        });
    }
    /**
     * Listener for the pointer enter event.
     * @param e PointerEvent
     */
    onPointerEnter(e) {
        window.requestAnimationFrame(() => {
            this.show();
        });
    }
    /**
     * Listener for the pointer leave event.
     * @param e PointerEvent
     */
    onPointerLeave(e) {
        if (!this.isCapturing) {
            window.requestAnimationFrame(() => {
                this.hide();
            });
        }
        else {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
            this.moveCross(this.crossA, p);
            this.movePoint(this.nextPoint, p);
        }
    }
    /**
     * Listener for the pointer down event.
     * @param e PointerEvent
     */
    onPointerDown(e) {
        if (!this.isCapturing) {
            this.isCapturing = true;
            if (typeof this.callbacks.onSelectionBegin === "function") {
                this.callbacks.onSelectionBegin();
            }
        }
    }
    /**
     * Listener for the mouse click event.
     * @param e MouseEvent
     */
    onClick(e) {
        if (e.detail <= 1) {
            window.requestAnimationFrame(() => {
                const p = new Point2D_1.Point2D(this.crossA.x, this.crossA.y);
                this.addPoint(p.x, p.y);
                this.lastPoint = p;
            });
        }
    }
    /**
     * Listener for the pointer move event.
     * @param e PointerEvent
     */
    onPointerMove(e) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
            this.show();
            this.moveCross(this.crossA, p);
            this.movePoint(this.nextPoint, p);
            if (this.lastPoint != null) {
                this.moveLine(this.nextSegment, this.lastPoint, p);
            }
            else {
                this.moveLine(this.nextSegment, p, p);
            }
        });
        e.preventDefault();
    }
    /**
     * Listener for the mouse double click event.
     * @param e MouseEvent
     */
    onDoubleClick(e) {
        this.submitPolyline();
    }
    /**
     * Submits the new polygon region to the callback function.
     */
    submitPolyline() {
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const box = this.polyline.getBBox();
            this.callbacks.onSelectionEnd(new RegionData_1.RegionData(box.x, box.y, box.width, box.height, this.getPolylinePoints(), RegionData_1.RegionDataType.Polyline));
        }
        this.reset();
    }
    /**
     * Returns the polyline points, closes it if required.
     * @param close - A flag to "close" the polyline if last point is near to the first one.
     * @param threshold - The threshold to calculate what is "near".
     */
    getPolylinePoints(close = true, threshold = 5) {
        const points = this.points.map((p) => p.copy());
        if (points.length >= 3 && close) {
            const fp = points[0];
            const lp = points[points.length - 1];
            const distanceSquare = (fp.x - lp.x) * (fp.x - lp.x) + (fp.y - lp.y) * (fp.y - lp.y);
            if (distanceSquare <= threshold * threshold) {
                points[points.length - 1] = fp.copy();
            }
        }
        return points;
    }
    /**
     * Listener for the key up event.
     * @param e KeyboardEvent
     */
    onKeyUp(e) {
        // Holding shift key enable square drawing mode
        if (e.code === "Escape") {
            this.submitPolyline();
        }
    }
}
exports.PolylineSelector = PolylineSelector;
//# sourceMappingURL=PolylineSelector.js.map