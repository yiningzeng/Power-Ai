import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { Element } from "./Element";
import { IPoint2D } from "../../Interface/IPoint2D";
import { IRect } from "../../Interface/IRect";
/**
 * The rect element for selectors
 */
export declare class RectElement extends Element implements IPoint2D {
    /**
     * The rect size.
     */
    rect: Rect;
    /**
     * Visual center of the cross.
     */
    private originPoint;
    /**
     * The `x`-coordinate of the cross center.
     */
    readonly x: number;
    /**
     * The `y`-coordinate of the cross center.
     */
    readonly y: number;
    /**
     * Creates the new `RectElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     * @param rect - The rect size.
     */
    constructor(paper: Snap.Paper, boundRect: Rect, rect: IRect);
    /**
     * Moves rect element to specified location.
     * @param p - The new rect location.
     */
    move(p: Point2D): void;
    /**
     * Resizes the element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    resize(width: number, height: number): void;
    /**
     * Builds the visual presentation of the element.
     */
    private buildUIElements;
}
