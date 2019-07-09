import { Rect } from "../../Core/Rect";
import { IHideable } from "../../Interface/IHideadble";
import { IResizable } from "../../Interface/IResizable";
/**
 * Abstract class for building blocks of selectors.
 */
export declare abstract class Element implements IHideable, IResizable {
    /**
     * The `Snap.Element` object for external integration into SVG-tree.
     */
    node: Snap.Element;
    /**
     * The `Snap.Paper` object to draw on.
     */
    protected paper: Snap.Paper;
    /**
     * The parent bounding box for selection.
     */
    protected boundRect: Rect;
    /**
     * The element visibility flag.
     */
    protected isVisible: boolean;
    /**
     * The `width` of the element.
     */
    readonly width: number;
    /**
     * The `height` of the element.
     */
    readonly height: number;
    /**
     * Creates new `Element` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     */
    constructor(paper: Snap.Paper, boundRect: Rect);
    /**
     * Makes elemement visually hidden.
     */
    hide(): void;
    /**
     * Makes element visible.
     */
    show(): void;
    /**
     * Resizes element to specified `width` and `height`.
     * @param width - New element `width`.
     * @param height - New element `height`.
     */
    resize(width: number, height: number): void;
}
