import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { AnchorsComponent } from "../Component/AnchorsComponent";
/**
 * `AnchorsComponent` for the `PolylineRegion` class.
 */
export declare class AnchorsElement extends AnchorsComponent {
    /**
     * Default threshold distance to define whether ctrl-pointer click is on point or line.
     */
    static ANCHOR_POINT_LINE_SWITCH_THRESHOLD: number;
    /**
     * Internal flag to delete a point on pointer up event.
     */
    private deleteOnPointerUp;
    /**
     * Internal flat to add a point on pointer up event.
     */
    private addOnPointerUp;
    /**
     * Current number of anchors.
     */
    private anchorsLength;
    /**
     * Reference to the polyline object, used to trigger adding/deleting points.
     */
    private anchorsPolyline;
    /**
     * Creates a new `AnchorsElement` object.
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
    /**
     * Creates a collection on anchors.
     */
    protected buildAnchors(): void;
    /**
     * Creates acollection of anchor points.
     */
    protected buildPolylineAnchors(): void;
    /**
     * Subscribe an anchor to events.
     * @param anchor - The anchor to wire up with events.
     */
    protected subscribeLineToEvents(anchor: Snap.Element): void;
    /**
     * Updated the `regionData` based on the new ghost anchor location. Should be redefined in child classes.
     * @param p - The new ghost anchor location.
     */
    protected updateRegion(p: Point2D): void;
    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerEnter(e: PointerEvent): void;
    /**
     * Callback for the pointermove event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerMove(e: PointerEvent): void;
    /**
     * Callback for the pointerup event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerUp(e: PointerEvent): void;
}
