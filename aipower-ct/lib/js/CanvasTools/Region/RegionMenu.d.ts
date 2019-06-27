import { Rect } from "../Core/Rect";
import { RegionData } from "../Core/RegionData";
import { IMovable } from "../Interface/IMovable";
import { IRegionCallbacks } from "../Interface/IRegionCallbacks";
import { RegionComponent } from "./Component/RegionComponent";
import { Region } from "./Region";
/**
 * The region menu element.
 */
export declare class MenuElement extends RegionComponent {
    /**
     * The SVG path for x-button (close).
     */
    static PathCollection: {
        delete: {
            iconSize: number;
            path: string;
        };
    };
    /**
     * Menu group object.
     */
    menuGroup: Snap.Paper;
    /**
     * Menu background rect.
     */
    menuRect: Snap.Element;
    /**
     * Reference to the grouping object for menu items.
     */
    menuItemsGroup: Snap.Element;
    /**
     * Menu items collection.
     */
    menuItems: Snap.Element[];
    /**
     * Default menu item size.
     */
    private menuItemSize;
    /**
     * Menu x-coordinate.
     */
    private mx;
    /**
     * Menu y-coordinate.
     */
    private my;
    /**
     * Default menu width.
     */
    private mw;
    /**
     * Default menu height.
     */
    private mh;
    /**
     * Threshold for positioning menu inside/outside
     */
    private dh;
    /**
     * Threshold for positioning menu left/right
     */
    private dw;
    /**
     * Reference to the host region element.
     */
    private region;
    /**
     * Creates the menu component.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, callbacks: IRegionCallbacks);
    /**
     * Add a new icon with action to menu.
     * @param action - Item action description.
     * @param icon - Item SVG-path string.
     * @param actor - The callback function.
     */
    addAction(action: string, icon: string, actor: (component: RegionComponent, action?: string) => void): void;
    /**
     * Attach the menu to specified region element.
     * @param region - The host region element.
     */
    attachTo(region: Region): void;
    /**
     * Move menu according to new region location
     * @remarks This method moves the virtual shadow of the region and then rearranges menu position.
     * @param point - New region location.
     */
    move(point: IMovable): void;
    /**
     * Move menu according to new region coordinates.
     * @remarks This method moves the virtual shadow of the region and then rearranges menu position.
     * @param x - New region x-coordinate.
     * @param y - New region y-coordinate.
     */
    move(x: number, y: number): void;
    /**
     * Move menu according to new region size.
     * @remarks This method moves the virtual shadow of the region and then rearranges menu position.
     * @param width - New region width.
     * @param height - New region height.
     */
    resize(width: number, height: number): void;
    /**
     * Redraw menu element.
     */
    redraw(): void;
    /**
     * Visually hide menu element.
     */
    hide(): void;
    /**
     * Visually show menu element.
     */
    show(): void;
    /**
     * Show menu element on the specified region.
     * @param region - The host region element.
     */
    showOnRegion(region: Region): void;
    /**
     * Creates the menu element UI.
     */
    private buildUI;
    /**
     * Updates menu position.
     */
    private rearrangeMenuPosition;
}
