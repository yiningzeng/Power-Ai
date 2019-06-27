import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { AnchorsComponent } from "../Component/AnchorsComponent";
/**
 * `AnchorsComponent` for the `RectRegion` class.
 * @todo Current implementations of bones reuses existing aprroach with anchor index
 * by using negative indexes and manually correcting them to actual indexes.
 * It seems like it should be refactored some how.
 */
export declare class AnchorsElement extends AnchorsComponent {
    private anchorPointStyles;
    private anchorBoneStyles;
    private boneThickness;
    private anchorBones;
    /**
     * Creates a new `AnchorsElement` object.
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
     * Creates a collection on anchors.
     */
    protected buildAnchors(): void;
    /**
     * Creates collection of anchor points.
     */
    protected buildPointAnchors(): void;
    /**
     * Creates collection of anchor bones.
     */
    protected buildBoneAnchors(): void;
    /**
     * Helper function to create a new anchor bone.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param x - The `x`-coordinate of the acnhor bone.
     * @param y - The `y`-coordinate of the anchor bone.
     * @param width - The `width` of the anchor bone.
     * @param height - The `height` of the anchor bone.
     * @param style - Additional css style class to be applied.
     * @param thickness - The `thickness` of the bone (activation area).
     */
    protected createAnchorBone(paper: Snap.Paper, x: number, y: number, width: number, height: number, style?: string, thickness?: number): Snap.Element;
    /**
     * Updates the `regionData` based on the new ghost anchor location. Should be redefined in child classes.
     * @param p - The new ghost anchor location.
     */
    protected updateRegion(p: Point2D): void;
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
     * Helper function to subscribe anchor to activation event.
     * @param bone - The anchor bone for wire up.
     * @param index - The index of the anchor used to define which one is active.
     */
    protected subscribeAnchorBoneToEvents(bone: Snap.Element, index: number): void;
    /**
     * Internal helper function to get active anchor.
     */
    private getActiveAnchor;
}
