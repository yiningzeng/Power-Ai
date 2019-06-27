import { IRegionsManagerCallbacks } from "../Interface/IRegionsManagerCallbacks";
import { TagsDescriptor } from "../Core/TagsDescriptor";
import { RegionData } from "../Core/RegionData";
/**
 * The manager for visual region objects.
 */
export declare class RegionsManager {
    /**
     * Reference to external callbacks.
     */
    callbacks: IRegionsManagerCallbacks;
    /**
     * Reference to the host SVG element.
     */
    private baseParent;
    /**
     * Reference to the `Snap.Paper` object to draw on.
     */
    private paper;
    /**
     * The paper bounding box.
     */
    private paperRect;
    /**
     * Collection of regions.
     */
    private regions;
    /**
     * Grouping element for menu element.
     */
    private menuLayer;
    /**
     * Reference to the `MenuElement` object.
     */
    private menu;
    /**
     * Grouping layer for the manager.
     */
    private regionManagerLayer;
    /**
     * Global freezing state.
     */
    private isFrozenState;
    /**
     * Internal manipulation flag.
     */
    private justManipulated;
    /**
     * Returns current freezing state.
     */
    readonly isFrozen: boolean;
    /**
     * Additional CSS class to be added when manager is frozen.
     */
    private frozenNuance;
    /**
     * Tags create/redraw options.
     */
    private tagsUpdateOptions;
    /**
     * Creates new `RegionsManager`.
     * @param svgHost - The hosting SVG element.
     * @param callbacks - Reference to the callbacks collection.
     */
    constructor(svgHost: SVGSVGElement, callbacks: IRegionsManagerCallbacks);
    /**
     * Add new region to the manager. Automatically defines region type based on the `type` property.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor): void;
    /**
     * Add new rect region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addRectRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor): void;
    /**
     * Add new point region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addPointRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor): void;
    /**
     * Add new polyline region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addPolylineRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor): void;
    /**
     * Add new polygon region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addPolygonRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor): void;
    /**
     * Redraws all regions. Reinserts regions in actual order.
     */
    redrawAllRegions(): void;
    /**
     * Returns bounding boxes of the selected regions.
     * @deprecated Use `getSelectedRegions` method instead
     */
    getSelectedRegionsBounds(): {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }[];
    /**
     * Returns a collection of selected regions.
     */
    getSelectedRegions(): Array<{
        id: string;
        regionData: RegionData;
    }>;
    /**
     * Deletes a region with specified `id`.
     * @param id - Id of the region to delete.
     */
    deleteRegionById(id: string): void;
    /**
     * Deletes all the regions from the manager.
     */
    deleteAllRegions(): void;
    /**
     * Updates tags of the specified region.
     * @param id - The `id` of the region to update.
     * @param tagsDescriptor - The new tags descriptor object.
     */
    updateTagsById(id: string, tagsDescriptor: TagsDescriptor): void;
    /**
     * Updates tags for all selected regions.
     * @param tagsDescriptor - The new tags descriptor object.
     */
    updateTagsForSelectedRegions(tagsDescriptor: TagsDescriptor): void;
    /**
     * Selects the region specified by `id`.
     * @param id - The `id` of the region to select.
     */
    selectRegionById(id: string): void;
    /**
     * Resizes the manager to specified `width` and `height`.
     * @param width - The new manager width.
     * @param height - The new manager height.
     */
    resize(width: number, height: number): void;
    /**
     * Freezes the manager and all its current regions.
     * @param nuance - [optional] Additional css-class to add to the manager.
     */
    freeze(nuance?: string): void;
    /**
     * Unfreezes the manager and all its regions.
     */
    unfreeze(): void;
    /**
     * Toggles freezing mode.
     */
    toggleFreezeMode(): void;
    /**
     * Finds the region by specified `id`.
     * @param id - The `id` to look for.
     */
    private lookupRegionByID;
    /**
     * Internal helper function to sort regions by their area.
     */
    private sortRegionsByArea;
    /**
     * Finds all selected regions.
     */
    private lookupSelectedRegions;
    /**
     * Deletes provided region.
     * @param region - The region to delete.
     */
    private deleteRegion;
    /**
     * Deletes all selected regions.
     */
    private deleteSelectedRegions;
    /**
     * Selects specified region.
     * @param region - The region to select.
     */
    private selectRegion;
    /**
     * Selects all the regions.
     */
    private selectAllRegions;
    /**
     * Selects the next region (based on current order, e.g., sorted by area).
     */
    private selectNextRegion;
    /**
     * Moves or changes region size
     * @param region - The region to be changed.
     * @param dx - x-coordinate shift.
     * @param dy - y-coordinate shift.
     * @param dw - width-shift.
     * @param dh - height-shift.
     * @param inverse - flag if the change is inverted.
     */
    private reshapeRegion;
    /**
     * Moves the selected region with specified shift in coordinates
     * @param dx - x-coordinate shift.
     * @param dy - y-coordinate shift.
     */
    private moveSelectedRegions;
    /**
     * Resizes the selected region with specified width and height shifts.
     * @param dw - width-shift.
     * @param dh - height-shift.
     * @param inverse - flag if the change is inverted.
     */
    private resizeSelectedRegions;
    /**
     * The callback function fot internal components.
     * @param component - Reference to the UI component.
     * @param regionData - New RegionData object.
     * @param state - New state of the region.
     * @param multiSelection - Flag for multiselection.
     */
    private onRegionChange;
    /**
     * Unselects all the regions, naybe except the one specified.
     * @param except - Region to ignore.
     */
    private unselectRegions;
    /**
     * Changes the tags drawing setting to draw background or make it transparent.
     */
    private toggleBackground;
    /**
     * Inits regions manager UI.
     * @param paper - The `Snap.Paper` element to draw on.
     */
    private buildOn;
    /**
     * Helper function to subscribe manager to pointer and keyboard events.
     */
    private subscribeToEvents;
    /**
     * Registers the provided region in the manager.
     * @param region - The new region to register.
     */
    private registerRegion;
}
