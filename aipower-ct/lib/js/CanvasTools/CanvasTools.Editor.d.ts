import { FilterPipeline } from "./CanvasTools.Filter";
import { RegionData } from "./Core/RegionData";
import { RegionManipulationFunction } from "./Interface/IRegionCallbacks";
import { RegionUpdateFunction, RegionSelectionFunction } from "./Interface/IRegionsManagerCallbacks";
import { SelectionNotifyFunction, SelectionConfirmFunction } from "./Interface/ISelectorCallbacks";
import { RegionsManager } from "./Region/RegionsManager";
import { AreaSelector } from "./Selection/AreaSelector";
import { ToolbarItemType } from "./Toolbar/ToolbarIcon";
/**
 * Internal type to describe toolbar presets
 */
declare type ToolbarIconDescription = {
    type: ToolbarItemType.SELECTOR | ToolbarItemType.SWITCH | ToolbarItemType.TRIGGER;
    action: string;
    iconFile: string;
    tooltip: string;
    keycode: string;
    actionCallback: (action: string, rm: RegionsManager, sl: AreaSelector) => void;
    width?: number;
    height?: number;
    activate: boolean;
} | {
    type: ToolbarItemType.SEPARATOR;
};
/**
 * Wraps internal CanvasTools components into one Editor experience.
 */
export declare class Editor {
    /**
     * The toolbar icons preset with all available features.
     */
    static FullToolbarSet: ToolbarIconDescription[];
    /**
     * The toolbar icons preset with only rect-related features.
     */
    static RectToolbarSet: ToolbarIconDescription[];
    /**
     * Internal SVG template to define shadow filter.
     */
    private static SVGDefsTemplate;
    /**
     * Auto-resize flag to automatically update editor internals when the container (window) size is changed.
     */
    autoResize: boolean;
    /**
     * A proxi wrapper around internal API for the `Editor` itself, `RegionsManager` (`RM`), `AreaSelector` (`AS`) and
     * `FilterPipeline` (`FP`).
     * @remarks As of now those apis do not overlap, so all methods/properties might be mapped from unified API.
     */
    readonly api: Editor & RegionsManager & AreaSelector & FilterPipeline;
    /**
     * Callback for `RegionsManager` called when some region is selected or unselected.
     */
    onRegionSelected: RegionSelectionFunction;
    /**
     * Callback for `RegionsManager` called when some region is moving.
     */
    onRegionMove: RegionUpdateFunction;
    /**
     * Callback for `RegionsManager` called when some region began moving.
     */
    onRegionMoveBegin: RegionUpdateFunction;
    /**
     * Callback for `RegionsManager` called when some region ended moving.
     */
    onRegionMoveEnd: RegionUpdateFunction;
    /**
     * Callback for `RegionsManager` called when some region is deleted from UI.
     */
    onRegionDelete: RegionUpdateFunction;
    /**
     * Callback for `RegionsManager` called when pointer entered manipulation area.
     */
    onManipulationBegin: RegionManipulationFunction;
    /**
     * Callback for `RegionsManager` called when pointer leaved manipulation area.
     */
    onManipulationEnd: RegionManipulationFunction;
    /**
     * Callback for `AreaSelector` called when user began selecting (creating) new region.
     */
    onSelectionBegin: SelectionNotifyFunction;
    /**
     * Callback for `AreaSelector` called when user ended selecting (creating) new region.
     */
    onSelectionEnd: SelectionConfirmFunction;
    /**
     * Reference to the host canvas element.
     */
    public contentCanvas;
    /**
     * Internal reference to the proxi of APIs.
     */
    private mergedAPI;
    /**
     * Internal reference to the `Toolbar` component.
     */
    private toolbar;
    /**
     * Internal reference to the `RegionsManager` component.
     */
    private regionsManager;
    /**
     * Internal reference to the `AresSelector` component.
     */
    private areaSelector;
    /**
     * Internal reference to the `FilterPipeline` component.
     */
    private filterPipeline;
    /**
     * Reference to the host SVG element.
     */
    private editorSVG;
    /**
     * Reference to the host div element (contains SVG and Canvas elements).
     */
    private editorDiv;
    /**
     * Internal reference to the RegionsManager freezing state.
     */
    private isRMFrozen;
    /**
     * The width of the source content.
     */
    private sourceWidth;
    /**
     * The height of the source content.
     */
    private sourceHeight;
    /**
     * The current frame width.
     */
    private frameWidth;
    /**
     * The current frame height.
     */
    private frameHeight;
    /**
     * Creates a new `Editor` in specified div-container.
     * @param container - The div-container for the editor.
     */
    constructor(container: HTMLDivElement);
    /**
     * Creates a new `Editor` in specified div-container and with custom building components.
     * @remarks - Originally created for testing purposes.
     * @param container - The div-container for the editor.
     * @param areaSelector - The `AresSelector` component to use.
     * @param regionsManager - The `RegionsManager` component to use.
     */
    constructor(container: HTMLDivElement, areaSelector: AreaSelector, regionsManager: RegionsManager);
    /**
     * Creates a new `Editor` in specified div-container and with custom building components.
     * @remarks - Originally created for testing purposes.
     * @param container - The div-container for the editor.
     * @param areaSelector - The `AresSelector` component to use.
     * @param regionsManager - The `RegionsManager` component to use.
     * @param filterPipeline - The `FilterPipeline` component to use.
     */
    constructor(container: HTMLDivElement, areaSelector: AreaSelector, regionsManager: RegionsManager, filterPipeline: FilterPipeline);
    /**
     * Creates a new toolbar in specified div-container
     * @param container - The div-container for the toolbar.
     * @param toolbarSet - Icons set for the toolbar.
     * @param iconsPath - Path to the toolbar icons.
     */
    addToolbar(container: HTMLDivElement, toolbarSet: ToolbarIconDescription[], iconsPath: string): void;
    /**
     * Updates the content source for the editor.
     * @param source - Content source.
     * @returns A new `Promise` resolved when content is drawn and Editor is resized.
     */
    addContentSource(source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement): Promise<void>;
    /**
     * Resize editor to new width and height.
     * @remarks - Use if the `autoResize` is `false`.
     * @param containerWidth - The new container width.
     * @param containerHeight - The new container height.
     */
    resize(containerWidth: number, containerHeight: number): void;
    /**
     * Short reference to the `RegionsManager` component.
     */
    readonly RM: RegionsManager;
    /**
     * Short reference to the `AreaSelector` component.
     */
    readonly AS: AreaSelector;
    /**
     * Short reference to the `FilterPipeline` component.
     */
    readonly FP: FilterPipeline;
    /**
     * Scales the `RegionData` object from frame to source size.
     * @param regionData - The `RegionData` object.
     * @param sourceWidth - [Optional] The source width.
     * @param sourceHeight - [Optional] The source height.
     * @returns Resized `RegionData` object.
     */
    scaleRegionToSourceSize(regionData: RegionData, sourceWidth?: number, sourceHeight?: number): RegionData;
    /**
     * Scales the `RegionData` object from source to frame size.
     * @param regionData - The `RegionData` object.
     * @param sourceWidth - [Optional] The source width.
     * @param sourceHeight - [Optional] The source height.
     * @returns Resized `RegionData` object.
     */
    scaleRegionToFrameSize(regionData: RegionData, sourceWidth?: number, sourceHeight?: number): RegionData;
    /**
     * Internal helper to create a new SVG element.
     */
    private createSVGElement;
    /**
     * Internal helper to create a new HTMLCanvas element.
     */
    private createCanvasElement;
}
export {};
