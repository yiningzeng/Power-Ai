import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";
import { TagsComponent } from "../Component/TagsComponent";
/**
 * `TagsComponent` for the `PolylineRegion` class.
 */
export declare class TagsElement extends TagsComponent {
    /**
     * Default (visual) radius for primary tag.
     */
    static DEFAULT_PRIMARY_TAG_RADIUS: number;
    /**
     * Default (visual) size for secondary tag boxes.
     */
    static DEFAULT_SECONDARY_TAG_SIZE: number;
    /**
     * Default (visual) vertical shift for secondary tag boxes.
     */
    static DEFAULT_SECONDARY_TAG_DY: number;
    /**
     * Reference to the bounding rect (background) object.
     */
    private primaryTagBoundRect;
    /**
     * Reference to the polygon line object.
     */
    private primaryTagPolyline;
    /**
     * Creates a new `TagsElement` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param tags - The `TagsDescriptor` object presenting colors and names for region tags.
     * @param styleId - The unique css style id for region.
     * @param styleSheet - The regerence to the stylesheet object for rules insection.
     * @param tagsUpdateOptions - The settings for redrawing tags.
     */
    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, tags: TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: ITagsUpdateOptions);
    /**
     * Redraws the componnent.
     */
    redraw(): void;
    /**
     * Inits style maps.
     */
    protected initStyleMaps(tags: TagsDescriptor): void;
    /**
     * Internal function to recreate tag labels.
     */
    protected rebuildTagLabels(): void;
    /**
     * Internal function to create tag labels
     * @param paper - The `Snap.Paper` object to draw on.
     * @param tags - The `TagsDescriptor` object defining tags.
     */
    private buildOn;
}
