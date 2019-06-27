import { Rect } from "../../Core/Rect";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";
import { Selector } from "./Selector";
/**
 * The selector to define a polyline-region.
 */
export declare class PolylineSelector extends Selector {
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
     * The grouping element for polyline points.
     */
    private pointsGroup;
    /**
     * The polyline element.
     */
    private polyline;
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
     * Creates new `PolylineSelector` object.
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
     * Adds a new point to polyline at specified coordinates
     * @param x - x-coordinate of the new point.
     * @param y - y-coordinate of the new point.
     */
    private addPoint;
    /**
     * Listener for the pointer enter event.
     * @param e PointerEvent
     */
    private onPointerEnter;
    /**
     * Listener for the pointer leave event.
     * @param e PointerEvent
     */
    private onPointerLeave;
    /**
     * Listener for the pointer down event.
     * @param e PointerEvent
     */
    private onPointerDown;
    /**
     * Listener for the mouse click event.
     * @param e MouseEvent
     */
    private onClick;
    /**
     * Listener for the pointer move event.
     * @param e PointerEvent
     */
    private onPointerMove;
    /**
     * Listener for the mouse double click event.
     * @param e MouseEvent
     */
    private onDoubleClick;
    /**
     * Submits the new polygon region to the callback function.
     */
    private submitPolyline;
    /**
     * Returns the polyline points, closes it if required.
     * @param close - A flag to "close" the polyline if last point is near to the first one.
     * @param threshold - The threshold to calculate what is "near".
     */
    private getPolylinePoints;
    /**
     * Listener for the key up event.
     * @param e KeyboardEvent
     */
    private onKeyUp;
}
