import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { RegionComponent } from "./RegionComponent";
/**
 * An abstract visual component used internall do allow dragging the whole region.
 */
export declare abstract class DragComponent extends RegionComponent {
    /**
     * Grouping element for internal drag elements.
     */
    protected dragNode: Snap.Element;
    /**
     * Dragging state of the component.
     */
    protected isDragged: boolean;
    /**
     * The coordinates of the origin point on dragging.
     */
    protected dragOrigin: Point2D;
    /**
     * Creates a new `DragComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, callbacks: IRegionCallbacks);
    /**
     * Switches the component to the frozen state.
     */
    freeze(): void;
    /**
     * Callback for the dragbegin event.
     */
    protected onDragBegin(): void;
    /**
     * Callback for the dragmove event.
     * @param dx - Diff in the `x`-coordinate of draggable element.
     * @param dy - Diff in the `y`-coordinate of draggable element.
     * @remarks This method directly calls the `onChange` callback wrapper.
     */
    protected onDragMove(dx: number, dy: number): void;
    /**
     * Callback for the dragend event.
     */
    protected onDragEnd(): void;
    /**
     * Helper function to subscibe the draggable element to events.
     */
    protected subscribeToDragEvents(): void;
}
