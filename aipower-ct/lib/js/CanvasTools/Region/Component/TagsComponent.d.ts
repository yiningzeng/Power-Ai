import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";
import { RegionComponent } from "./RegionComponent";
/**
 * An abstract visual component used internall do draw tags data for regions.
 */
export declare abstract class TagsComponent extends RegionComponent {
    /**
     * The reference to region's `TagsDescriptor` object.
     */
    tags: TagsDescriptor;
    /**
     * The grouping element for primary tag.
     */
    protected primaryTagNode: Snap.Element;
    /**
     * The grouping element for secondary tags.
     */
    protected secondaryTagsNode: Snap.Element;
    /**
     * The array of secondary tags elements.
     */
    protected secondaryTags: Snap.Element[];
    /**
     * Unique css style id associated with the region.
     */
    protected styleId: string;
    /**
     * Reference to the stylesheet element.
     */
    protected styleSheet: CSSStyleSheet;
    /**
     * The settings for redrawing tags.
     */
    protected tagsUpdateOptions: ITagsUpdateOptions;
    /**
     * Default styling rules.
     */
    protected styleMap: Array<{
        rule: string;
        style: string;
    }>;
    /**
     * Light styling rules used when `showRegionBackground` is set to `false`.
     */
    protected styleLightMap: Array<{
        rule: string;
        style: string;
    }>;
    /**
     * Creates a new `TagsComponent` object.
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
     * Updates component with new `TagsDescriptor` object and new drawing settings.
     * @param tags - The new `TagsDescriptor` object.
     * @param options - The new drawing settings.
     */
    updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions): void;
    /**
     * Inits the styling rules for the component. Should be redefined in child classes.
     * @param tags -- The `TagsDescriptor` object to define new styles.
     */
    protected abstract initStyleMaps(tags: TagsDescriptor): any;
    /**
     * Rebulds the tags elements. Should be redefined in child classes.
     */
    protected abstract rebuildTagLabels(): any;
    /**
     * Clears current styling rules.
     */
    protected clearStyleMaps(): void;
    /**
     * Inserts the styling rules into the `styleSheet` object.
     * @param showRegionBackground - The flag to make background visible or transparent.
     */
    protected applyStyleMaps(showRegionBackground?: boolean): void;
}
