import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { RegionComponent } from "./RegionComponent";
/**
 * An abstract visual component used internall to draw anchor points that allow
 * region points moving and this component resizing.
 */
export declare abstract class AnchorsComponent extends RegionComponent {
    /**
     * Default radius for anchor poitns. Can be redefined through CSS styles.
     */
    static DEFAULT_ANCHOR_RADIUS: number;
    /**
     * Defailt radius for the ghost anchor, used activate dragging. Can be redefined through CSS styles.
     */
    static DEFAULT_GHOST_ANCHOR_RADIUS: number;
    /**
     * The array of anchors.
     */
    protected anchors: Snap.Element[];
    /**
     * The grouping element for anchors.
     */
    protected anchorsNode: Snap.Element;
    /**
     * The ghost anchor.
     */
    protected ghostAnchor: Snap.Element;
    /**
     * The index of currently active anchor.
     */
    protected activeAnchorIndex: number;
    /**
     * The coordinates of the origin point on dragging.
     */
    protected dragOrigin: Point2D;
    /**
     * Creates a new `AnchorsComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, callbacks: IRegionCallbacks);
    /**
     * Redraws the visual on the component.
     */
    redraw(): void;
    /**
     * Switches the component to the frozen state.
     */
    freeze(): void;
    /**
     * Creates a collection on anchors.
     */
    protected buildAnchors(): void;
    /**
     * Creates a collection of anchor points.
     */
    protected buildPointAnchors(): void;
    /**
     * Helper function to subscribe anchor to activation event.
     * @param anchor - The anchor for wire up.
     * @param index - The index of the anchor used to define which one is active.
     */
    protected subscribeAnchorToEvents(anchor: Snap.Element, index: number): void;
    /**
     * Helper function to create a new anchor.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param x - The `x`-coordinate of the acnhor.
     * @param y - The `y`-coordinate of the anchor.
     * @param style - Additional css style class to be applied.
     * @param r - The radius of the anchor.
     */
    protected createAnchor(paper: Snap.Paper, x: number, y: number, style?: string, r?: number): Snap.Element;
    /**
     * Updated the `regionData` based on the new ghost anchor location. Should be redefined in child classes.
     * @param p - The new ghost anchor location.
     */
    protected abstract updateRegion(p: Point2D): any;
    /**
     * Callback for the dragbegin event.
     */
    protected anchorDragBegin(): void;
    /**
     * Callback for the dragmove event. Uses `dragOrigin` to calculate new position.
     * @param dx - Diff in the `x`-coordinate.
     * @param dy - Diff in the `y`-coordinate.
     * @param x - New `x`-coordinate.
     * @param y - New `y`-coordinate.
     * @remarks This method calls the `updateRegion` method to actually make any changes in data.
     */
    protected anchorDragMove(dx: number, dy: number, x: number, y: number): void;
    /**
     * Callback for the dranend event.
     */
    protected anchorDragEnd(): void;
    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerEnter(e: PointerEvent): void;
    /**
     * Callback for the pointerleave event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerLeave(e: PointerEvent): void;
    /**
     * Callback for the pointerdown event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerDown(e: PointerEvent): void;
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
