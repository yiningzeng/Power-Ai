import { Rect } from "../../Core/Rect";
import { IRect } from "../../Interface/IRect";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";
import { Selector } from "./Selector";
/**
 * The selector to define a rect-region using a template.
 */
export declare class RectCopySelector extends Selector {
    /**
     * Current template for selection.
     */
    private copyRect;
    /**
     * The `CrossElement` to define rect center.
     */
    private crossA;
    /**
     * The `RectElement` to show current rect.
     */
    private copyRectEl;
    /**
     * Creates new `RectCopySelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param copyRect - The template rect for selection.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, copyRect: Rect, callbacks?: ISelectorCallbacks);
    /**
     * Updates the template for selector.
     * @param copyRect - New template rect.
     */
    setTemplate(copyRect: IRect): void;
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
    /**
     * Helper function to move rect to specified point.
     * @param copyRect - The rect element to move.
     * @param p - The new location.
     */
    private moveCopyRect;
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
     * Listener for the pointer up event.
     * @param e PointerEvent
     */
    private onPointerUp;
    /**
     * Listener for the pointer move event.
     * @param e PointerEvent
     */
    private onPointerMove;
    /**
     * Listener for the wheel event.
     * @param e WheelEvent
     */
    private onWheel;
}
