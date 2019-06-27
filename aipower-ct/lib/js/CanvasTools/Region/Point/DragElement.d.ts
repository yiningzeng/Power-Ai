import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { DragComponent } from "../Component/DragComponent";
/**
 * `DragComponent` for the `PointRegion` class.
 */
export declare class DragElement extends DragComponent {
    /**
     * Default (visual) radius for point drag-component.
     */
    static DEFAULT_DRAG_RADIUS: number;
    /**
     * Creates a new `DragElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, callbacks: IRegionCallbacks);
    /**
     * Redraws the componnent.
     */
    redraw(): void;
}
