import { Rect } from "../Core/Rect";
import { ISelectorCallbacks } from "../Interface/ISelectorCallbacks";
import { ISelectorSettings, SelectionMode } from "../Interface/ISelectorSettings";
/**
 * The region selection manager.
 * @remarks The naming of the class is historical per the idea to specify the
 * region area to be selected. Thus AreaSelector.
 * @todo Consider renaming.
 */
export declare class AreaSelector {
    /**
     * Default template size for the `RectCopySelector`.
     * @todo Move to the `RectCopySelector` class.
     */
    static DefaultTemplateSize: Rect;
    /**
     * The collection of selector's callbacks.
     */
    callbacks: ISelectorCallbacks;
    /**
     * The reference to the host SVG element.
     */
    private parentNode;
    /**
     * The reference to the `Snap.Paper` element to draw on.
     */
    private paper;
    /**
     * The bounding rect for selectors.
     */
    private boundRect;
    /**
     * The grouping element for selectors.
     */
    private areaSelectorLayer;
    /**
     * Reference to the current selector.
     */
    private selector;
    /**
     * Current selector options, if any.
     */
    private selectorSettings;
    /**
     * Reference to a `RectSelector` object.
     */
    private rectSelector;
    /**
     * Reference to a `RectCopySelector` object.
     */
    private rectCopySelector;
    /**
     * Reference to a `PointSelector` object.
     */
    private pointSelector;
    /**
     * Reference to a `PolylineSelector` object.
     */
    private polylineSelector;
    /**
     * Reference to a `PolygonSelector` object.
     */
    private polygonSelector;
    /**
     * Internal flag to track selector visibility.
     */
    private isVisible;
    /**
     * Creates a new `AreaSelector` manager.
     * @param svgHost - The host SVG element.
     * @param callbacks - The collection of callbacks.
     */
    constructor(svgHost: SVGSVGElement, callbacks?: ISelectorCallbacks);
    /**
     * Resizes selectors to specified `width` and `height`.
     * @param width - The new `width` for selector.
     * @param height - The new `height` for selector.
     */
    resize(width: number, height: number): void;
    /**
     * Enables the current selector.
     */
    enable(): void;
    /**
     * Disables the current selector.
     */
    disable(): void;
    /**
     * Makes current selector visible and enabled.
     */
    show(): void;
    /**
     * Makes current selector hidden and disabled.
     */
    hide(): void;
    /**
     * Sets new selection mode (changes active selector).
     * @param selectionMode - Selector mode.
     */
    setSelectionMode(selectionMode: SelectionMode): any;
    /**
     * Sets new selection mode (changes active selector).
     * @param settings - Selector settings, including selection mode
     */
    setSelectionMode(settings: ISelectorSettings): any;
    /**
     * Returns current options (settings) for selector.
     */
    getSelectorSettings(): ISelectorSettings;
    /**
     * Creates UI of the AreaSelector.
     */
    private buildUIElements;
}
