import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";
import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { RegionComponent } from "../Component/RegionComponent";
import { Region } from "../Region";
/**
 * The rect-type region class.
 */
export declare class RectRegion extends Region {
    /**
     * Bounding rects for the region.
     */
    private paperRects;
    /**
     * Reference to the internal AnchorsElement.
     */
    private anchorNode;
    /**
     * Reference to the internal DragElement.
     */
    private dragNode;
    /**
     * Reference to the internal TagsElement.
     */
    private tagsNode;
    /**
     * Reference to the tooltip element.
     */
    private toolTip;
    /**
     * Creates new `RectRegion` object.
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
     * Updates region tags.
     * @param tags - The new tags descriptor object.
     * @param options - The tags drawing options.
     */
    updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions): void;
    /**
     * Resizes the region to specified `width` and `height`.
     * @param width - The new region width.
     * @param height - The new region height.
     */
    resize(width: number, height: number): void;
    /**
     * The callback function fot internal components.
     * @param component - Reference to the UI component.
     * @param regionData - New RegionData object.
     * @param state - New state of the region.
     * @param multiSelection - Flag for multiselection.
     */
    onChange(component: RegionComponent, regionData: RegionData, state: ChangeEventType, multiSelection?: boolean): void;
    /**
     * Creates the UI of the region component.
     * @param paper - The `Snap.Paper` element to draw on.
     */
    private buildOn;
}
