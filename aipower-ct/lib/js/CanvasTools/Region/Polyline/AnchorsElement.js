"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const IRegionCallbacks_1 = require("../../Interface/IRegionCallbacks");
const AnchorsComponent_1 = require("../Component/AnchorsComponent");
/**
 * `AnchorsComponent` for the `PolylineRegion` class.
 */
class AnchorsElement extends AnchorsComponent_1.AnchorsComponent {
    /**
     * Creates a new `AnchorsElement` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        /**
         * Internal flag to delete a point on pointer up event.
         */
        this.deleteOnPointerUp = false;
        /**
         * Internal flat to add a point on pointer up event.
         */
        this.addOnPointerUp = false;
        this.anchorsLength = regionData.points.length;
    }
    /**
     * Redraws the componnent.
     */
    redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
            const points = this.regionData.points;
            // rebuild anchors
            if (this.anchorsLength !== points.length) {
                window.requestAnimationFrame(() => {
                    this.anchors.forEach((anchor) => {
                        anchor.remove();
                    });
                    this.anchors = [];
                    this.buildPointAnchors();
                });
                this.anchorsLength = points.length;
            }
            else {
                window.requestAnimationFrame(() => {
                    this.regionData.points.forEach((p, index) => {
                        this.anchors[index].attr({
                            cx: p.x,
                            cy: p.y,
                        });
                    });
                });
            }
            const pointsData = [];
            this.regionData.points.forEach((p) => {
                pointsData.push(p.x, p.y);
            });
            this.anchorsPolyline.attr({
                points: pointsData.toString(),
            });
        }
    }
    /**
     * Creates a collection on anchors.
     */
    buildAnchors() {
        this.buildPolylineAnchors();
        this.buildPointAnchors();
    }
    /**
     * Creates acollection of anchor points.
     */
    buildPolylineAnchors() {
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.anchorsPolyline = this.paper.polyline(pointsData);
        this.anchorsPolyline.addClass("anchorLineStyle");
        this.subscribeLineToEvents(this.anchorsPolyline);
        this.anchorsNode.add(this.anchorsPolyline);
    }
    /**
     * Subscribe an anchor to events.
     * @param anchor - The anchor to wire up with events.
     */
    subscribeLineToEvents(anchor) {
        anchor.node.addEventListener("pointermove", (e) => {
            if (!this.isFrozen) {
                if (e.ctrlKey) {
                    this.dragOrigin = new Point2D_1.Point2D(e.offsetX, e.offsetY);
                    this.activeAnchorIndex = -1;
                    this.addOnPointerUp = true;
                    window.requestAnimationFrame(() => {
                        this.ghostAnchor.attr({
                            cx: this.dragOrigin.x,
                            cy: this.dragOrigin.y,
                            display: "block",
                        });
                    });
                }
                else {
                    this.addOnPointerUp = false;
                }
                this.onManipulationBegin();
            }
        }, false);
    }
    /**
     * Updated the `regionData` based on the new ghost anchor location. Should be redefined in child classes.
     * @param p - The new ghost anchor location.
     */
    updateRegion(p) {
        const rd = this.regionData.copy();
        if (this.activeAnchorIndex >= 0 && this.activeAnchorIndex < this.regionData.points.length) {
            rd.setPoint(p, this.activeAnchorIndex);
        }
        this.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVING);
    }
    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerEnter(e) {
        if (e.ctrlKey) {
            if (this.addOnPointerUp && this.activeAnchorIndex < 0) {
                this.ghostAnchor.addClass("add");
            }
            else if (this.regionData.points.length > 2) {
                this.ghostAnchor.addClass("delete");
                this.deleteOnPointerUp = true;
                this.addOnPointerUp = false;
            }
        }
        else {
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
            this.deleteOnPointerUp = false;
        }
        this.ghostAnchor.drag(this.anchorDragMove.bind(this), this.anchorDragBegin.bind(this), this.anchorDragEnd.bind(this));
        this.onManipulationBegin();
    }
    /**
     * Callback for the pointermove event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerMove(e) {
        if (e.ctrlKey) {
            const p = new Point2D_1.Point2D(e.offsetX, e.offsetY);
            let dist = Number.MAX_VALUE;
            let nearestPoint = null;
            let index = -1;
            this.regionData.points.forEach((point, i) => {
                const d = p.squareDistanceToPoint(point);
                if (d < dist) {
                    dist = d;
                    nearestPoint = point;
                    index = i;
                }
            });
            const swapToDelete = dist < AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD;
            if (this.addOnPointerUp && this.activeAnchorIndex < 0 && !swapToDelete) {
                this.ghostAnchor.addClass("add");
                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: p.x,
                        cy: p.y,
                    });
                });
            }
            else if (this.regionData.points.length > 2 || swapToDelete) {
                this.ghostAnchor.removeClass("add");
                this.ghostAnchor.addClass("delete");
                this.activeAnchorIndex = index;
                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: nearestPoint.x,
                        cy: nearestPoint.y,
                    });
                });
                this.deleteOnPointerUp = true;
                this.addOnPointerUp = false;
            }
        }
        else {
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
        }
    }
    /**
     * Callback for the pointerup event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerUp(e) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        const rd = this.regionData.copy();
        if (this.deleteOnPointerUp) {
            if (this.activeAnchorIndex >= 0 && this.activeAnchorIndex < this.regionData.points.length) {
                const points = rd.points;
                points.splice(this.activeAnchorIndex, 1);
                rd.setPoints(points);
            }
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
        }
        else if (this.addOnPointerUp) {
            const point = new Point2D_1.Point2D(e.offsetX, e.offsetY);
            const points = rd.points;
            // Find the nearest segment of polyline
            let index = 0;
            let distance = Number.MAX_VALUE;
            for (let i = 0; i < points.length - 1; i++) {
                const d = this.dragOrigin.squareDistanceToLine(points[i], points[i + 1]);
                if (d < distance) {
                    index = i;
                    distance = d;
                }
            }
            points.splice(index + 1, 0, point);
            rd.setPoints(points);
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
            this.ghostAnchor.addClass("delete");
        }
        this.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVEEND);
    }
}
/**
 * Default threshold distance to define whether ctrl-pointer click is on point or line.
 */
AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD = 5;
exports.AnchorsElement = AnchorsElement;
//# sourceMappingURL=AnchorsElement.js.map