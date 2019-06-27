import { Rect } from "../../Core/Rect";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";
import { Selector } from "./Selector";
/**
 * The selector to define a polygon-region.
 */
export declare class PolygonSelector extends Selector {
    /**
     * The `CrossElement` to define point position
     */
    private crossA;
    /**
     * The element to add a new point.
     */
    private nextPoint;
    /**
     * The line segment to add a new point.
     */
    private nextSegment;
    /**
     * The line to the new point from the first point.
     */
    private nextL1;
    /**
     * The line to the new point from the last point.
     */
    private nextLN;
    /**
     * The grouping element for polyline points.
     */
    private pointsGroup;
    /**
     * The polygon element.
     */
    private polygon;
    /**
     * Collection of points composing polyline data.
     */
    private points;
    /**
     * The last point.
     */
    private lastPoint;
    /**
     * Default point radius.
     */
    private pointRadius;
    /**
     * Current state of selector.
     */
    private isCapturing;
    /**
     * Creates new `PolygonSelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks);
    /**
     * Resizes the selector to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    resize(width: number, height: number): void;
    /**
     * Hides the selector.
     */
    hide(): void;
    /**
     * Shows the selector.
     */
    show(): void;
    /**
     * Disables and hides this selector.
     */
    disable(): void;
    /**
     * Builds selector's UI.
     */
    private buildUIElements;
    /**
     * Resets the selector.
     */
    private reset;
    /**
     * Adds a new point to polygon at specified coordinates
     * @param x - x-coordinate of the new point.
     * @param y - y-coordinate of the new point.
     */
    private addPoint;
    /**
     * Submits the new polygon region to the callback function.
     */
    private submitPolygon;
}
