import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { Element } from "./Element";
import { IPoint2D } from "../../Interface/IPoint2D";
/**
 * The cross element for selectors.
 */
export declare class CrossElement extends Element implements IPoint2D {
    /**
     * Horizontal line element.
     */
    private hl;
    /**
     * Vertical line element.
     */
    private vl;
    /**
     * Visual center of the cross.
     */
    private center;
    /**
     * The `x`-coordinate of the cross center.
     */
    readonly x: number;
    /**
     * The `y`-coordinate of the cross center.
     */
    readonly y: number;
    /**
     * Creates new `CrossElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     */
    constructor(paper: Snap.Paper, boundRect: Rect);
    /**
     * Bounds the cross center to the specified box.
     * @param rect - The bounding box.
     */
    boundToRect(rect: Rect): Point2D;
    /**
     * Moves cross to specified point, applying bounding and taking into account square movement modificator.
     * @param p - The new cross center location.
     * @param rect - The bounding box.
     * @param square - The square movement flag.
     * @param ref - The reference point for square.
     */
    move(p: IPoint2D, boundRect: Rect, square?: boolean, ref?: IPoint2D): void;
    /**
     * Resizes the cross element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    resize(width: number, height: number): void;
    /**
     * Builds the visual presentation of the element.
     */
    private buildUIElements;
}
