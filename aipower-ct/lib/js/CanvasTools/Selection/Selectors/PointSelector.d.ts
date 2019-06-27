import { Rect } from "../../Core/Rect";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";
import { Selector } from "./Selector";
/**
 * The selector to define a point-region.
 */
export declare class PointSelector extends Selector {
    /**
     * Default radius for the point element. Can be redefined through css styles.
     */
    private static DEFAULT_POINT_RADIUS;
    /**
     * The `CrossElement` to define point position
     */
    private crossA;
    /**
     * The temporary point element.
     */
    private point;
    /**
     * Creates new `PointSelector` object.
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
     * Builds selector's UI.
     */
    private buildUIElements;
}
