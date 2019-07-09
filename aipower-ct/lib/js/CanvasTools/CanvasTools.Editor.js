"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTools_Filter_1 = require("./CanvasTools.Filter");
const Rect_1 = require("./Core/Rect");
const ISelectorSettings_1 = require("./Interface/ISelectorSettings");
const RegionsManager_1 = require("./Region/RegionsManager");
const AreaSelector_1 = require("./Selection/AreaSelector");
const ToolbarIcon_1 = require("./Toolbar/ToolbarIcon");
const Toolbar_1 = require("./Toolbar/Toolbar");
/**
 * Wraps internal CanvasTools components into one Editor experience.
 */
class Editor {
    constructor(container, areaSelector, regionsManager, filterPipeline) {
        /**
         * Auto-resize flag to automatically update editor internals when the container (window) size is changed.
         */
        this.autoResize = true;
        /**
         * Internal reference to the RegionsManager freezing state.
         */
        this.isRMFrozen = false;
        // Create SVG Element
        this.contentCanvas = this.createCanvasElement();
        this.editorSVG = this.createSVGElement();
        this.editorDiv = container;
        this.editorDiv.classList.add("CanvasToolsEditor");
        this.editorDiv.append(this.contentCanvas);
        this.editorDiv.append(this.editorSVG);
        // automatically resize internals on window resize
        window.addEventListener("resize", (e) => {
            if (this.autoResize) {
                this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
            }
        });
        // Init regionsManager
        const rmCallbacks = {
            onChange: null,
            onManipulationBegin: (region) => {
                this.areaSelector.hide();
                if (typeof this.onManipulationBegin === "function") {
                    this.onManipulationBegin(region);
                }
            },
            onManipulationEnd: (region) => {
                this.areaSelector.show();
                if (typeof this.onManipulationEnd === "function") {
                    this.onManipulationEnd(region);
                }
            },
            onRegionSelected: (id, multiselection) => {
                if (typeof this.onRegionSelected === "function") {
                    this.onRegionSelected(id, multiselection);
                }
            },
            onRegionMove: (id, regionData) => {
                if (typeof this.onRegionMove === "function") {
                    this.onRegionMove(id, regionData);
                }
            },
            onRegionMoveBegin: (id, regionData) => {
                if (typeof this.onRegionMoveBegin === "function") {
                    this.onRegionMoveBegin(id, regionData);
                }
            },
            onRegionMoveEnd: (id, regionData) => {
                if (typeof this.onRegionMoveEnd === "function") {
                    this.onRegionMoveEnd(id, regionData);
                }
            },
            onRegionDelete: (id, regionData) => {
                if (typeof this.onRegionDelete === "function") {
                    this.onRegionDelete(id, regionData);
                }
            },
        };
        if (regionsManager !== null && regionsManager !== undefined) {
            this.regionsManager = regionsManager;
            regionsManager.callbacks = rmCallbacks;
        }
        else {
            this.regionsManager = new RegionsManager_1.RegionsManager(this.editorSVG, rmCallbacks);
        }
        // Init areaSeletor
        const asCallbacks = {
            onSelectionBegin: () => {
                this.isRMFrozen = this.regionsManager.isFrozen;
                this.regionsManager.freeze();
                if (typeof this.onSelectionBegin === "function") {
                    this.onSelectionBegin();
                }
            },
            onSelectionEnd: (regionData) => {
                if (!this.isRMFrozen) {
                    this.regionsManager.unfreeze();
                }
                if (typeof this.onSelectionEnd === "function") {
                    this.onSelectionEnd(regionData);
                }
            },
        };
        if (areaSelector !== null && areaSelector !== undefined) {
            this.areaSelector = areaSelector;
            this.areaSelector.callbacks = asCallbacks;
        }
        else {
            this.areaSelector = new AreaSelector_1.AreaSelector(this.editorSVG, asCallbacks);
        }
        // Init filterPipeline
        if (filterPipeline !== undefined && filterPipeline !== null) {
            this.filterPipeline = filterPipeline;
        }
        else {
            this.filterPipeline = new CanvasTools_Filter_1.FilterPipeline();
        }
        // Adjust editor size
        this.resize(container.offsetWidth, container.offsetHeight);
        // Add proxy to regionsManager, areaSelector and filterPipeline;
        this.mergedAPI = new Proxy(this, {
            get: (target, prop) => {
                let p;
                let t;
                if (prop in target) {
                    t = target;
                    p = t[prop];
                }
                else if (prop in target.regionsManager) {
                    t = target.RM;
                    p = t[prop];
                }
                else if (prop in target.areaSelector) {
                    t = target.AS;
                    p = t[prop];
                }
                else if (prop in target.filterPipeline) {
                    t = target.FP;
                    p = t[prop];
                }
                else {
                    p = undefined;
                }
                if (typeof p === "function") {
                    return (...args) => {
                        p.apply(t, args);
                    };
                }
                else {
                    return p;
                }
            },
        });
    }
    /**
     * A proxi wrapper around internal API for the `Editor` itself, `RegionsManager` (`RM`), `AreaSelector` (`AS`) and
     * `FilterPipeline` (`FP`).
     * @remarks As of now those apis do not overlap, so all methods/properties might be mapped from unified API.
     */
    get api() {
        return this.mergedAPI;
    }
    /**
     * Creates a new toolbar in specified div-container
     * @param container - The div-container for the toolbar.
     * @param toolbarSet - Icons set for the toolbar.
     * @param iconsPath - Path to the toolbar icons.
     */
    addToolbar(container, toolbarSet, iconsPath) {
        const svg = this.createSVGElement();
        container.append(svg);
        this.toolbar = new Toolbar_1.Toolbar(svg);
        if (toolbarSet === null || toolbarSet === undefined) {
            toolbarSet = Editor.FullToolbarSet;
        }
        let activeSelector;
        toolbarSet.forEach((item) => {
            if (item.type === ToolbarIcon_1.ToolbarItemType.SEPARATOR) {
                this.toolbar.addSeparator();
            }
            else {
                const toolbarItem = {
                    action: item.action,
                    iconUrl: iconsPath + item.iconFile,
                    tooltip: item.tooltip,
                    keycode: item.keycode,
                    width: item.width,
                    height: item.height,
                };
                const actionFn = (action) => {
                    item.actionCallback(action, this.regionsManager, this.areaSelector);
                };
                if (item.type === ToolbarIcon_1.ToolbarItemType.SELECTOR) {
                    this.toolbar.addSelector(toolbarItem, actionFn);
                    if (item.activate) {
                        activeSelector = item.action;
                    }
                }
                else if (item.type === ToolbarIcon_1.ToolbarItemType.SWITCH) {
                    this.toolbar.addSwitch(toolbarItem, actionFn);
                    this.toolbar.setSwitch(item.action, item.activate);
                }
                else if (item.type === ToolbarIcon_1.ToolbarItemType.TRIGGER) {
                    this.toolbar.addTrigger(toolbarItem, actionFn);
                }
            }
        });
        this.toolbar.select(activeSelector);
    }
    /**
     * Updates the content source for the editor.
     * @param source - Content source.
     * @returns A new `Promise` resolved when content is drawn and Editor is resized.
     */
    async addContentSource(source) {
        const buffCnvs = document.createElement("canvas");
        const context = buffCnvs.getContext("2d");
        if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
            this.sourceWidth = source.width;
            this.sourceHeight = source.height;
        }
        else if (source instanceof HTMLVideoElement) {
            this.sourceWidth = source.videoWidth;
            this.sourceHeight = source.videoHeight;
        }
        buffCnvs.width = this.sourceWidth;
        buffCnvs.height = this.sourceHeight;
        context.drawImage(source, 0, 0, buffCnvs.width, buffCnvs.height);
        return this.filterPipeline.applyToCanvas(buffCnvs).then((bcnvs) => {
            // Copy buffer to the canvas on screen
            this.contentCanvas.width = bcnvs.width;
            this.contentCanvas.height = bcnvs.height;
            const imgContext = this.contentCanvas.getContext("2d");
            imgContext.drawImage(bcnvs, 0, 0, bcnvs.width, bcnvs.height);
        }).then(() => {
            // resize the editor size to adjust to the new content size
            this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
        });
    }
    /**
     * Resize editor to new width and height.
     * @remarks - Use if the `autoResize` is `false`.
     * @param containerWidth - The new container width.
     * @param containerHeight - The new container height.
     */
    resize(containerWidth, containerHeight) {
        this.frameWidth = containerWidth;
        this.frameHeight = containerHeight;
        const imgRatio = this.contentCanvas.width / this.contentCanvas.height;
        const containerRatio = containerWidth / containerHeight;
        let hpadding = 0;
        let vpadding = 0;
        if (imgRatio > containerRatio) {
            vpadding = (containerHeight - containerWidth / imgRatio) / 2;
            this.editorDiv.style.height = `calc(100% - ${vpadding * 2}px)`;
            this.editorDiv.style.width = "";
        }
        else {
            hpadding = (containerWidth - containerHeight * imgRatio) / 2;
            this.editorDiv.style.height = "";
            this.editorDiv.style.width = `calc(100% - ${hpadding * 2}px)`;
        }
        this.editorDiv.style.padding = `${vpadding}px ${hpadding}px`;
        this.frameWidth = this.editorSVG.clientWidth;
        this.frameHeight = this.editorSVG.clientHeight;
        this.areaSelector.resize(this.frameWidth, this.frameHeight);
        this.regionsManager.resize(this.frameWidth, this.frameHeight);
    }
    /**
     * Short reference to the `RegionsManager` component.
     */
    get RM() {
        return this.regionsManager;
    }
    /**
     * Short reference to the `AreaSelector` component.
     */
    get AS() {
        return this.areaSelector;
    }
    /**
     * Short reference to the `FilterPipeline` component.
     */
    get FP() {
        return this.filterPipeline;
    }
    /**
     * Scales the `RegionData` object from frame to source size.
     * @param regionData - The `RegionData` object.
     * @param sourceWidth - [Optional] The source width.
     * @param sourceHeight - [Optional] The source height.
     * @returns Resized `RegionData` object.
     */
    scaleRegionToSourceSize(regionData, sourceWidth, sourceHeight) {
        const sw = (sourceWidth !== undefined) ? sourceWidth : this.sourceWidth;
        const sh = (sourceHeight !== undefined) ? sourceHeight : this.sourceHeight;
        const xf = sw / this.frameWidth;
        const yf = sh / this.frameHeight;
        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }
    /**
     * Scales the `RegionData` object from source to frame size.
     * @param regionData - The `RegionData` object.
     * @param sourceWidth - [Optional] The source width.
     * @param sourceHeight - [Optional] The source height.
     * @returns Resized `RegionData` object.
     */
    scaleRegionToFrameSize(regionData, sourceWidth, sourceHeight) {
        const sw = (sourceWidth !== undefined) ? sourceWidth : this.sourceWidth;
        const sh = (sourceHeight !== undefined) ? sourceHeight : this.sourceHeight;
        const xf = this.frameWidth / sw;
        const yf = this.frameHeight / sh;
        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }
    /**
     * Internal helper to create a new SVG element.
     */
    createSVGElement() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.innerHTML = Editor.SVGDefsTemplate;
        return svg;
    }
    /**
     * Internal helper to create a new HTMLCanvas element.
     */
    createCanvasElement() {
        const canvas = document.createElement("canvas");
        return canvas;
    }
}
/**
 * The toolbar icons preset with all available features.
 */
Editor.FullToolbarSet = [
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "none-select",
        iconFile: "none-selection.svg",
        tooltip: "Regions Manipulation (M)",
        keycode: "KeyM",
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.NONE });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "point-select",
        iconFile: "point-selection.svg",
        tooltip: "Point-selection (P)",
        keycode: "KeyP",
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POINT });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "rect-select",
        iconFile: "rect-selection.svg",
        tooltip: "Rectangular box (R)",
        keycode: "KeyR",
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.RECT });
        },
        activate: true,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "copy-select",
        iconFile: "copy-t-selection.svg",
        tooltip: "Template-based box (T)",
        keycode: "KeyT",
        actionCallback: (action, rm, sl) => {
            const regions = rm.getSelectedRegions();
            if (regions !== undefined && regions.length > 0) {
                const r = regions[0];
                sl.setSelectionMode({
                    mode: ISelectorSettings_1.SelectionMode.COPYRECT,
                    template: new Rect_1.Rect(r.regionData.width, r.regionData.height),
                });
            }
            else {
                sl.setSelectionMode({
                    mode: ISelectorSettings_1.SelectionMode.COPYRECT,
                    template: new Rect_1.Rect(40, 40),
                });
            }
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "polyline-select",
        iconFile: "polyline-selection.svg",
        tooltip: "Polyline-selection (Y)",
        keycode: "KeyY",
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POLYLINE });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "polygon-select",
        iconFile: "polygon-selection.svg",
        tooltip: "Polygon-selection (O)",
        keycode: "KeyO",
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POLYGON });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.TRIGGER,
        action: "delete-all-select",
        iconFile: "delete-all-selection.svg",
        tooltip: "Delete all regions",
        keycode: "",
        actionCallback: (action, rm, sl) => {
            rm.deleteAllRegions();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SWITCH,
        action: "selection-lock",
        iconFile: "selection-lock.svg",
        tooltip: "Lock/unlock regions (L)",
        keycode: "KeyL",
        actionCallback: (action, rm, sl) => {
            rm.toggleFreezeMode();
        },
        activate: false,
    },
];
/**
 * The toolbar icons preset with only rect-related features.
 */
Editor.RectToolbarSet = [
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "none-select",
        iconFile: "none-selection.svg",
        tooltip: "Regions Manipulation (M)",
        keycode: "KeyM",
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.NONE });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "rect-select",
        iconFile: "rect-selection.svg",
        tooltip: "Rectangular box (R)",
        keycode: "KeyR",
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.RECT });
        },
        activate: true,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "copy-select",
        iconFile: "copy-t-selection.svg",
        tooltip: "Template-based box (T)",
        keycode: "KeyT",
        actionCallback: (action, rm, sl) => {
            const regions = rm.getSelectedRegions();
            if (regions !== undefined && regions.length > 0) {
                const r = regions[0];
                sl.setSelectionMode({
                    mode: ISelectorSettings_1.SelectionMode.COPYRECT,
                    template: new Rect_1.Rect(r.regionData.width, r.regionData.height),
                });
            }
            else {
                sl.setSelectionMode({
                    mode: ISelectorSettings_1.SelectionMode.COPYRECT,
                    template: new Rect_1.Rect(40, 40),
                });
            }
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.TRIGGER,
        action: "delete-all-select",
        iconFile: "delete-all-selection.svg",
        tooltip: "Delete all regions",
        keycode: "",
        actionCallback: (action, rm, sl) => {
            rm.deleteAllRegions();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SWITCH,
        action: "selection-lock",
        iconFile: "selection-lock.svg",
        tooltip: "Lock/unlock regions (L)",
        keycode: "KeyL",
        actionCallback: (action, rm, sl) => {
            rm.toggleFreezeMode();
        },
        activate: false,
    },
];
/**
 * Internal SVG template to define shadow filter.
 */
Editor.SVGDefsTemplate = `
        <defs>
            <filter id="black-glow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.8" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>`;
exports.Editor = Editor;
//# sourceMappingURL=CanvasTools.Editor.js.map