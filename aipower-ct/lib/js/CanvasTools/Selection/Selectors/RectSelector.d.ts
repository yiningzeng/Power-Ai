import { Rect } from "../../Core/Rect";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";
import { Selector } from "./Selector";
/**
 * Enum to specify selection mode.
 */
export declare enum SelectionModificator {
    RECT = 0,
    SQUARE = 1
}
/**
 * The selector to define a rect-region.
 */
export declare class RectSelector extends Selector {
    /**
     * The `CrossElement` to set the first corner of the rect.
     */
    private crossA;
    /**
     * The `CrossElement` to set the opposite corner of the rect.
     */
    private crossB;
    /**
     * The `RectElement` to draw selection box.
     */
    private selectionBox;
    /**
     * The `MaskElement` to hide rest of the source image.
     */
    private mask;
    /**
     * Internal flag for selection state.
     */
    private capturingState;
    /**
     * Internal flag for selection mode.
     */
    private isTwoPoints;
    /**
     * Internal flag for selection type.
     */
    private selectionModificator;
    /**
     * Creates new `RectSelector` object.
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
    /**
     * Helper function to move the rect element to specified locations.
     * @param box - The box to move.
     * @param pa - The first corner point.
     * @param pb - The opposite corner point.
     */
    private moveSelectionBox;
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
     * Listener for the key down event.
     * @param e KeyboardEvent
     */
    private onKeyDown;
    /**
     * Listener for the key up event.
     * @param e KeyboardEvent
     */
    private onKeyUp;
}
