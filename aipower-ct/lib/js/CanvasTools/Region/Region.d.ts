import { Rect } from "../Core/Rect";
import { RegionData } from "../Core/RegionData";
import { TagsDescriptor } from "../Core/TagsDescriptor";
import { IMovable } from "../Interface/IMovable";
import { ITagsUpdateOptions } from "../Interface/ITagsUpdateOptions";
import { ChangeEventType, IRegionCallbacks } from "../Interface/IRegionCallbacks";
import { RegionComponent } from "./Component/RegionComponent";
export declare abstract class Region extends RegionComponent {
    /**
     * Reference to the tags descriptor object.
     */
    tags: TagsDescriptor;
    /**
     * External region ID. E.g., used in the `RegionsManager`.
     */
    ID: string;
    /**
     * Internal region ID. Used to simplify debugging and for styling.
     */
    regionID: string;
    /**
     * Building blocks of the region component.
     */
    protected UI: RegionComponent[];
    /**
     * Internal id to insert/track stylesheets.
     */
    protected styleID: string;
    /**
     * The reference to the CSSStyleSheet object.
     */
    protected styleSheet: CSSStyleSheet;
    /**
     * Configuration to draw/redraw tags.
     */
    protected tagsUpdateOptions: ITagsUpdateOptions;
    /**
     * Creates new `Region` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     * @param id - The region `id` used to identify regions in `RegionsManager`.
     * @param tagsDescriptor - The descriptor of region tags.
     * @param tagsUpdateOptions - The drawing options for tags.
     */
    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, callbacks: IRegionCallbacks, id: string, tagsDescriptor: TagsDescriptor, tagsUpdateOptions?: ITagsUpdateOptions);
    /**
     * Clear region styles.
     */
    removeStyles(): void;
    /**
     * The callback function fot internal components.
     * @param component - Reference to the UI component.
     * @param regionData - New RegionData object.
     * @param state - New state of the region.
     * @param multiSelection - Flag for multiselection.
     */
    onChange(component: RegionComponent, regionData: RegionData, state: ChangeEventType, multiSelection?: boolean): void;
    /**
     * Updates region tags.
     * @param tags - The new tags descriptor object.
     * @param options - The tags drawing options.
     */
    updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions): void;
    /**
     * Move region to specified location.
     * @param point - New region location.
     */
    move(point: IMovable): void;
    /**
     * Move region to specified coordinates.
     * @param x - New x-coordinate.
     * @param y - New y-coordinate.
     */
    move(x: number, y: number): void;
    /**
     * Resizes the region to specified `width` and `height`.
     * @param width - The new region width.
     * @param height - The new region height.
     */
    resize(width: number, height: number): void;
    /**
     * Redraws the region component.
     */
    redraw(): void;
    /**
     * Visually freeze the region.
     */
    freeze(): void;
    /**
     * Visually unfreeze the region.
     */
    unfreeze(): void;
    /**
     * Internal helper function to generate random id.
     */
    protected s8(): string;
    /**
     * Helper function to insert a new stylesheet into the document.
     */
    private insertStyleSheet;
}
