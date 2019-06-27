import { Rect } from "../../Core/Rect";
import { Element } from "./Element";
/**
 * The mask element for selectors
 */
export declare class MaskElement extends Element {
    /**
     * Internal mask composition element.
     */
    private mask;
    /**
     * Internal layer for the mask cover.
     */
    private maskIn;
    /**
     * External layer for the mask filter.
     */
    private maskOut;
    /**
     * Creates a new `MaskElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     * @param maskOut - The element to be used as mask filter.
     */
    constructor(paper: Snap.Paper, boundRect: Rect, maskOut: {
        node: Snap.Element;
    });
    /**
     * Resize the element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    resize(width: number, height: number): void;
    /**
     * Builds the visual presentation of the element.
     */
    private buildUIElements;
    /**
     * Helper function to build the mask rect.
     */
    private createMask;
    /**
     * Helper function to build the mask-in rect.
     */
    private createMaskIn;
}
