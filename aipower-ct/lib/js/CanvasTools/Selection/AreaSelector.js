"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = require("../Core/Rect");
const ISelectorSettings_1 = require("../Interface/ISelectorSettings");
const PointSelector_1 = require("./Selectors/PointSelector");
const PolylineSelector_1 = require("./Selectors/PolylineSelector");
const PolygonSelector_1 = require("./Selectors/PolygonSelector");
const RectCopySelector_1 = require("./Selectors/RectCopySelector");
const RectSelector_1 = require("./Selectors/RectSelector");
/**
 * The region selection manager.
 * @remarks The naming of the class is historical per the idea to specify the
 * region area to be selected. Thus AreaSelector.
 * @todo Consider renaming.
 */
class AreaSelector {
    /**
     * Creates a new `AreaSelector` manager.
     * @param svgHost - The host SVG element.
     * @param callbacks - The collection of callbacks.
     */
    constructor(svgHost, callbacks) {
        /**
         * Internal flag to track selector visibility.
         */
        this.isVisible = true;
        this.parentNode = svgHost;
        if (callbacks !== undefined) {
            this.callbacks = callbacks;
        }
        else {
            this.callbacks = {
                onLocked: null,
                onSelectionBegin: null,
                onSelectionEnd: null,
                onUnlocked: null,
            };
        }
        this.buildUIElements();
    }
    /**
     * Resizes selectors to specified `width` and `height`.
     * @param width - The new `width` for selector.
     * @param height - The new `height` for selector.
     */
    resize(width, height) {
        if (width !== undefined && height !== undefined) {
            this.boundRect.resize(width, height);
        }
        else {
            this.boundRect.resize(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
        }
        if (this.selector !== null) {
            this.selector.resize(width, height);
        }
    }
    /**
     * Enables the current selector.
     */
    enable() {
        if (this.selector !== null) {
            this.selector.enable();
            this.selector.resize(this.boundRect.width, this.boundRect.height);
        }
    }
    /**
     * Disables the current selector.
     */
    disable() {
        if (this.selector !== null) {
            this.selector.disable();
        }
    }
    /**
     * Makes current selector visible and enabled.
     */
    show() {
        this.enable();
        this.isVisible = true;
    }
    /**
     * Makes current selector hidden and disabled.
     */
    hide() {
        this.disable();
        this.isVisible = false;
    }
    setSelectionMode(settings) {
        this.disable();
        if (settings === null || settings === undefined) {
            this.selectorSettings = {
                mode: ISelectorSettings_1.SelectionMode.NONE,
            };
        }
        else if (settings.mode !== undefined) {
            this.selectorSettings = settings;
        }
        else {
            this.selectorSettings = { mode: settings };
        }
        const selectionMode = this.selectorSettings.mode;
        if (selectionMode === ISelectorSettings_1.SelectionMode.NONE) {
            this.selector = null;
            return;
        }
        else if (selectionMode === ISelectorSettings_1.SelectionMode.COPYRECT) {
            this.selector = this.rectCopySelector;
            const template = this.selectorSettings.template;
            if (template !== undefined) {
                this.rectCopySelector.setTemplate(template);
            }
            else {
                this.rectCopySelector.setTemplate(AreaSelector.DefaultTemplateSize);
            }
        }
        else if (selectionMode === ISelectorSettings_1.SelectionMode.RECT) {
            this.selector = this.rectSelector;
        }
        else if (selectionMode === ISelectorSettings_1.SelectionMode.POINT) {
            this.selector = this.pointSelector;
        }
        else if (selectionMode === ISelectorSettings_1.SelectionMode.POLYLINE) {
            this.selector = this.polylineSelector;
        }
        else if (selectionMode === ISelectorSettings_1.SelectionMode.POLYGON) {
            this.selector = this.polygonSelector;
        }
        // restore enablement status
        this.enable();
        if (this.isVisible) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    /**
     * Returns current options (settings) for selector.
     */
    getSelectorSettings() {
        return this.selectorSettings;
    }
    /**
     * Creates UI of the AreaSelector.
     */
    buildUIElements() {
        this.paper = Snap(this.parentNode);
        this.boundRect = new Rect_1.Rect(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
        this.areaSelectorLayer = this.paper.g();
        this.areaSelectorLayer.addClass("areaSelector");
        this.rectSelector = new RectSelector_1.RectSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.rectCopySelector = new RectCopySelector_1.RectCopySelector(this.parentNode, this.paper, this.boundRect, new Rect_1.Rect(0, 0), this.callbacks);
        this.pointSelector = new PointSelector_1.PointSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.polylineSelector = new PolylineSelector_1.PolylineSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.polygonSelector = new PolygonSelector_1.PolygonSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.selector = this.rectSelector;
        this.rectSelector.enable();
        this.rectCopySelector.disable();
        this.pointSelector.disable();
        this.polylineSelector.disable();
        this.polygonSelector.disable();
        this.selector.hide();
        this.areaSelectorLayer.add(this.rectSelector.node);
        this.areaSelectorLayer.add(this.rectCopySelector.node);
        this.areaSelectorLayer.add(this.pointSelector.node);
        this.areaSelectorLayer.add(this.polylineSelector.node);
        this.areaSelectorLayer.add(this.polygonSelector.node);
    }
}
/**
 * Default template size for the `RectCopySelector`.
 * @todo Move to the `RectCopySelector` class.
 */
AreaSelector.DefaultTemplateSize = new Rect_1.Rect(20, 20);
exports.AreaSelector = AreaSelector;
//# sourceMappingURL=AreaSelector.js.map