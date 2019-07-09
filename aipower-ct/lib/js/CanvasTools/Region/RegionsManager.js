"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../Core/Point2D");
const Rect_1 = require("../Core/Rect");
const IRegionCallbacks_1 = require("../Interface/IRegionCallbacks");
const RectRegion_1 = require("./Rect/RectRegion");
const PointRegion_1 = require("./Point/PointRegion");
const PolygonRegion_1 = require("./Polygon/PolygonRegion");
const PolylineRegion_1 = require("./Polyline/PolylineRegion");
const RegionMenu_1 = require("./RegionMenu");
const RegionData_1 = require("../Core/RegionData");
/**
 * The manager for visual region objects.
 */
class RegionsManager {
    /**
     * Creates new `RegionsManager`.
     * @param svgHost - The hosting SVG element.
     * @param callbacks - Reference to the callbacks collection.
     */
    constructor(svgHost, callbacks) {
        /**
         * Global freezing state.
         */
        this.isFrozenState = false;
        /**
         * Internal manipulation flag.
         */
        this.justManipulated = false;
        /**
         * Tags create/redraw options.
         */
        this.tagsUpdateOptions = {
            showRegionBackground: true,
        };
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect_1.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
        this.regions = new Array();
        if (callbacks !== undefined) {
            this.callbacks = callbacks;
            if (typeof callbacks.onChange === "function") {
                this.callbacks.onChange = (region, regionData, state, multiSelection = false) => {
                    this.onRegionChange(region, regionData, state, multiSelection);
                    callbacks.onChange(region, regionData, state, multiSelection);
                };
            }
            else {
                this.callbacks.onChange = this.onRegionChange.bind(this);
            }
        }
        else {
            this.callbacks = {
                onChange: this.onRegionChange.bind(this),
                onManipulationBegin: null,
                onManipulationEnd: null,
            };
        }
        this.buildOn(this.paper);
        this.subscribeToEvents();
    }
    /**
     * Returns current freezing state.
     */
    get isFrozen() {
        return this.isFrozenState;
    }
    /**
     * Add new region to the manager. Automatically defines region type based on the `type` property.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addRegion(id, regionData, tagsDescriptor) {
        if (regionData.type === RegionData_1.RegionDataType.Point) {
            this.addPointRegion(id, regionData, tagsDescriptor);
        }
        else if (regionData.type === RegionData_1.RegionDataType.Polyline) {
            this.addPolylineRegion(id, regionData, tagsDescriptor);
        }
        else if (regionData.type === RegionData_1.RegionDataType.Rect) {
            this.addRectRegion(id, regionData, tagsDescriptor);
        }
        else if (regionData.type === RegionData_1.RegionDataType.Polygon) {
            this.addPolygonRegion(id, regionData, tagsDescriptor);
        }
        this.sortRegionsByArea();
        this.redrawAllRegions();
    }
    /**
     * Add new rect region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addRectRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new RectRegion_1.RectRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
        this.registerRegion(region);
    }
    /**
     * Add new point region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addPointRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new PointRegion_1.PointRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
        this.registerRegion(region);
    }
    /**
     * Add new polyline region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addPolylineRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new PolylineRegion_1.PolylineRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
        this.registerRegion(region);
    }
    /**
     * Add new polygon region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    addPolygonRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new PolygonRegion_1.PolygonRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
        this.registerRegion(region);
    }
    /*     // REGION CREATION
        public drawRegion(x: number, y: number, rect: Rect, id: string, tagsDescriptor: TagsDescriptor) {
            this.menu.hide();
            let region = new RectRegion(this.paper, this.paperRect, new Point2D(x, y), rect, id, tagsDescriptor,
                this.onManipulationBegin_local.bind(this),
                this.onManipulationEnd_local.bind(this),
                this.tagsUpdateOptions);
            region.area = rect.height * rect.width;
            region.onChange = this.onRegionChange.bind(this);
    
            region.updateTags(region.tags, this.tagsUpdateOptions);
            this.regionManagerLayer.add(region.node);
            this.regions.push(region);
            // Need to do a check for invalid stacking from user generated or older saved json
            if (this.regions.length > 1) {
                this.sortRegionsByArea();
                this.redrawAllRegions();
            }
            //this.menu.showOnRegion(region);
        } */
    /**
     * Redraws all regions. Reinserts regions in actual order.
     */
    redrawAllRegions() {
        // re-add all elements to DOM based on new order
        window.requestAnimationFrame((e) => {
            this.regions.forEach((region) => {
                const node = region.node.remove();
                this.regionManagerLayer.add(node);
            });
        });
    }
    /**
     * Returns bounding boxes of the selected regions.
     * @deprecated Use `getSelectedRegions` method instead
     */
    getSelectedRegionsBounds() {
        const regions = this.lookupSelectedRegions().map((region) => {
            return {
                id: region.ID,
                x: region.x,
                y: region.y,
                width: region.boundRect.width,
                height: region.boundRect.height,
            };
        });
        return regions;
    }
    /**
     * Returns a collection of selected regions.
     */
    getSelectedRegions() {
        const regions = this.lookupSelectedRegions().map((region) => {
            return {
                id: region.ID,
                regionData: region.regionData,
            };
        });
        return regions;
    }
    /**
     * Deletes a region with specified `id`.
     * @param id - Id of the region to delete.
     */
    deleteRegionById(id) {
        const region = this.lookupRegionByID(id);
        if (region != null) {
            this.deleteRegion(region);
        }
        if (this.callbacks.onManipulationEnd !== null) {
            this.callbacks.onManipulationEnd();
        }
    }
    /**
     * Deletes all the regions from the manager.
     */
    deleteAllRegions() {
        for (const region of this.regions) {
            region.removeStyles();
            region.node.remove();
        }
        this.regions = [];
        this.menu.hide();
    }
    /**
     * Updates tags of the specified region.
     * @param id - The `id` of the region to update.
     * @param tagsDescriptor - The new tags descriptor object.
     */
    updateTagsById(id, tagsDescriptor) {
        const region = this.lookupRegionByID(id);
        if (region != null) {
            region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
        }
    }
    /**
     * Updates tags for all selected regions.
     * @param tagsDescriptor - The new tags descriptor object.
     */
    updateTagsForSelectedRegions(tagsDescriptor) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((region) => {
            region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
        });
    }
    /**
     * Selects the region specified by `id`.
     * @param id - The `id` of the region to select.
     */
    selectRegionById(id) {
        const region = this.lookupRegionByID(id);
        this.selectRegion(region);
    }
    /**
     * Resizes the manager to specified `width` and `height`.
     * @param width - The new manager width.
     * @param height - The new manager height.
     */
    resize(width, height) {
        const tw = width / this.paperRect.width;
        const th = height / this.paperRect.height;
        this.paperRect.resize(width, height);
        this.menu.hide();
        // recalculate size/position for all regions;
        for (const region of this.regions) {
            region.move(new Point2D_1.Point2D(region.x * tw, region.y * th));
            region.resize(region.boundRect.width * tw, region.boundRect.height * th);
        }
    }
    /**
     * Freezes the manager and all its current regions.
     * @param nuance - [optional] Additional css-class to add to the manager.
     */
    freeze(nuance) {
        this.regionManagerLayer.addClass("frozen");
        if (nuance !== undefined) {
            this.regionManagerLayer.addClass(nuance);
            this.frozenNuance = nuance;
        }
        else {
            this.frozenNuance = "";
        }
        this.menu.hide();
        this.regions.forEach((region) => {
            region.freeze();
        });
        this.isFrozenState = true;
    }
    /**
     * Unfreezes the manager and all its regions.
     */
    unfreeze() {
        this.regionManagerLayer.removeClass("frozen");
        if (this.frozenNuance !== "") {
            this.regionManagerLayer.removeClass(this.frozenNuance);
        }
        const selectedRegions = this.lookupSelectedRegions();
        if (selectedRegions.length > 0) {
            this.menu.showOnRegion(selectedRegions[0]);
        }
        this.regions.forEach((region) => {
            region.unfreeze();
        });
        this.isFrozenState = false;
    }
    /**
     * Toggles freezing mode.
     */
    toggleFreezeMode() {
        if (this.isFrozen) {
            this.unfreeze();
        }
        else {
            this.freeze();
        }
    }
    /**
     * Finds the region by specified `id`.
     * @param id - The `id` to look for.
     */
    lookupRegionByID(id) {
        let region = null;
        let i = 0;
        while (i < this.regions.length && region == null) {
            if (this.regions[i].ID === id) {
                region = this.regions[i];
            }
            i++;
        }
        return region;
    }
    /**
     * Internal helper function to sort regions by their area.
     */
    sortRegionsByArea() {
        function quickSort(arr, left, right) {
            let pivot;
            let partitionIndex;
            if (left < right) {
                pivot = right;
                partitionIndex = partition(arr, pivot, left, right);
                // sort left and right
                quickSort(arr, left, partitionIndex - 1);
                quickSort(arr, partitionIndex + 1, right);
            }
            return arr;
        }
        function partition(arr, pivot, left, right) {
            const pivotValue = arr[pivot].area;
            let partitionIndex = left;
            for (let i = left; i < right; i++) {
                if (arr[i].area > pivotValue) {
                    swap(arr, i, partitionIndex);
                    partitionIndex++;
                }
            }
            swap(arr, right, partitionIndex);
            return partitionIndex;
        }
        function swap(arr, i, j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        const length = this.regions.length;
        if (length > 1) {
            quickSort(this.regions, 0, this.regions.length - 1);
        }
    }
    /**
     * Finds all selected regions.
     */
    lookupSelectedRegions() {
        const collection = Array();
        for (const region of this.regions) {
            if (region.isSelected) {
                collection.push(region);
            }
        }
        return collection;
    }
    /**
     * Deletes provided region.
     * @param region - The region to delete.
     */
    deleteRegion(region) {
        // remove style
        region.removeStyles();
        // remove element
        region.node.remove();
        this.regions = this.regions.filter((r) => {
            return r !== region;
        });
        this.menu.hide();
        if ((typeof this.callbacks.onRegionDelete) === "function") {
            this.callbacks.onRegionDelete(region.ID, region.regionData);
        }
    }
    /**
     * Deletes all selected regions.
     */
    deleteSelectedRegions() {
        const collection = this.lookupSelectedRegions();
        for (const region of collection) {
            this.deleteRegion(region);
        }
        this.selectNextRegion();
        if (this.callbacks.onManipulationEnd !== null) {
            this.callbacks.onManipulationEnd();
        }
    }
    /**
     * Selects specified region.
     * @param region - The region to select.
     */
    selectRegion(region) {
        if (region !== null) {
            this.unselectRegions(region);
            region.select();
            this.menu.showOnRegion(region);
            if ((typeof this.callbacks.onRegionSelected) === "function") {
                this.callbacks.onRegionSelected(region.ID);
            }
        }
    }
    /**
     * Selects all the regions.
     */
    selectAllRegions() {
        let r = null;
        for (const region of this.regions) {
            r = region;
            r.select();
            if ((typeof this.callbacks.onRegionSelected) === "function") {
                this.callbacks.onRegionSelected(r.ID);
            }
        }
        if (r != null) {
            this.menu.showOnRegion(r);
        }
    }
    /**
     * Selects the next region (based on current order, e.g., sorted by area).
     */
    selectNextRegion() {
        let region = null;
        let i = 0;
        const length = this.regions.length;
        if (length === 1) {
            region = this.regions[0];
        }
        else if (length > 1) {
            while (i < length && region == null) {
                if (this.regions[i].isSelected) {
                    region = (i === length - 1) ? this.regions[0] : this.regions[i + 1];
                }
                i++;
            }
        }
        if (region == null && length > 0) {
            region = this.regions[0];
        }
        this.selectRegion(region);
    }
    /**
     * Moves or changes region size
     * @param region - The region to be changed.
     * @param dx - x-coordinate shift.
     * @param dy - y-coordinate shift.
     * @param dw - width-shift.
     * @param dh - height-shift.
     * @param inverse - flag if the change is inverted.
     */
    reshapeRegion(region, dx, dy, dw, dh, inverse = false) {
        let w;
        let h;
        let x;
        let y;
        if (!inverse) {
            w = region.boundRect.width + Math.abs(dw);
            h = region.boundRect.height + Math.abs(dh);
            x = region.x + dx + (dw > 0 ? 0 : dw);
            y = region.y + dy + (dh > 0 ? 0 : dh);
        }
        else {
            w = Math.max(0, region.boundRect.width - Math.abs(dw));
            h = Math.max(0, region.boundRect.height - Math.abs(dh));
            x = region.x + dx + (dw < 0 ? 0 : dw);
            y = region.y + dy + (dh < 0 ? 0 : dh);
        }
        const p1 = new Point2D_1.Point2D(x, y).boundToRect(this.paperRect);
        const p2 = new Point2D_1.Point2D(x + w, y + h).boundToRect(this.paperRect);
        region.move(p1);
        region.resize(p2.x - p1.x, p2.y - p1.y);
    }
    /**
     * Moves the selected region with specified shift in coordinates
     * @param dx - x-coordinate shift.
     * @param dy - y-coordinate shift.
     */
    moveSelectedRegions(dx, dy) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((r) => {
            this.reshapeRegion(r, dx, dy, 0, 0);
        });
        this.menu.showOnRegion(regions[0]);
    }
    /**
     * Resizes the selected region with specified width and height shifts.
     * @param dw - width-shift.
     * @param dh - height-shift.
     * @param inverse - flag if the change is inverted.
     */
    resizeSelectedRegions(dw, dh, inverse = false) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((r) => {
            this.reshapeRegion(r, 0, 0, dw, dh, inverse);
        });
        this.menu.showOnRegion(regions[0]);
    }
    /**
     * The callback function fot internal components.
     * @param component - Reference to the UI component.
     * @param regionData - New RegionData object.
     * @param state - New state of the region.
     * @param multiSelection - Flag for multiselection.
     */
    onRegionChange(region, regionData, state, multiSelection = false) {
        // resize or drag begin
        if (state === IRegionCallbacks_1.ChangeEventType.MOVEBEGIN) {
            if (!multiSelection) {
                this.unselectRegions(region);
            }
            this.menu.hide();
            if ((typeof this.callbacks.onRegionSelected) === "function") {
                this.callbacks.onRegionSelected(region.ID, multiSelection);
            }
            if ((typeof this.callbacks.onRegionMoveBegin) === "function") {
                this.callbacks.onRegionMoveBegin(region.ID, regionData);
            }
            this.justManipulated = false;
            // resizing or dragging
        }
        else if (state === IRegionCallbacks_1.ChangeEventType.MOVING) {
            if ((typeof this.callbacks.onRegionMove) === "function") {
                this.callbacks.onRegionMove(region.ID, regionData);
            }
            this.justManipulated = true;
            // resize or drag end
        }
        else if (state === IRegionCallbacks_1.ChangeEventType.MOVEEND) {
            if (this.justManipulated) {
                region.select();
                this.menu.showOnRegion(region);
                this.sortRegionsByArea();
                this.redrawAllRegions();
                if ((typeof this.callbacks.onRegionMoveEnd) === "function") {
                    this.callbacks.onRegionMoveEnd(region.ID, regionData);
                }
            }
        }
        else if (state === IRegionCallbacks_1.ChangeEventType.SELECTIONTOGGLE && !this.justManipulated) {
            // select
            if (!region.isSelected) {
                if (!multiSelection) {
                    this.unselectRegions(region);
                }
                region.select();
                this.menu.showOnRegion(region);
                if ((typeof this.callbacks.onRegionSelected) === "function") {
                    this.callbacks.onRegionSelected(region.ID, multiSelection);
                }
                // unselect
            }
            else {
                region.unselect();
                this.menu.hide();
                if ((typeof this.callbacks.onRegionSelected) === "function") {
                    this.callbacks.onRegionSelected("", multiSelection);
                }
            }
        }
    }
    /**
     * Unselects all the regions, naybe except the one specified.
     * @param except - Region to ignore.
     */
    unselectRegions(except) {
        for (const region of this.regions) {
            if (region !== except) {
                region.unselect();
            }
        }
    }
    /**
     * Changes the tags drawing setting to draw background or make it transparent.
     */
    toggleBackground() {
        this.tagsUpdateOptions.showRegionBackground = !this.tagsUpdateOptions.showRegionBackground;
        this.regions.forEach((r) => {
            r.updateTags(r.tags, this.tagsUpdateOptions);
        });
    }
    /**
     * Inits regions manager UI.
     * @param paper - The `Snap.Paper` element to draw on.
     */
    buildOn(paper) {
        this.regionManagerLayer = paper.g();
        this.regionManagerLayer.addClass("regionManager");
        this.menuLayer = paper.g();
        this.menuLayer.addClass("menuManager");
        this.menu = new RegionMenu_1.MenuElement(paper, this.paperRect, new RegionData_1.RegionData(0, 0, 0, 0), this.callbacks);
        this.menu.addAction("delete", "trash", (region) => {
            this.deleteRegion(region);
            this.menu.hide();
        });
        this.menuLayer.add(this.menu.menuGroup);
        this.menu.hide();
    }
    /**
     * Helper function to subscribe manager to pointer and keyboard events.
     */
    subscribeToEvents() {
        this.regionManagerLayer.mouseover((e) => {
            if (this.callbacks.onManipulationBegin !== null) {
                this.callbacks.onManipulationBegin();
            }
        });
        this.regionManagerLayer.mouseout((e) => {
            if (this.callbacks.onManipulationEnd !== null) {
                this.callbacks.onManipulationEnd();
            }
        });
        window.addEventListener("keyup", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (!this.isFrozen) {
                    switch (e.keyCode) {
                        // tab
                        case 9:
                            this.selectNextRegion();
                            break;
                        // delete, backspace
                        case 46:
                        case 8:
                            this.deleteSelectedRegions();
                            break;
                        // ctrl + up
                        case 38:
                            if (e.ctrlKey) {
                                if (!e.shiftKey && !e.altKey) {
                                    this.moveSelectedRegions(0, -5);
                                }
                                else if (e.shiftKey && !e.altKey) {
                                    this.resizeSelectedRegions(0, -5);
                                }
                                else if (e.altKey && !e.shiftKey) {
                                    this.resizeSelectedRegions(0, -5, true);
                                }
                            }
                            break;
                        // ctrl + down
                        case 40:
                            if (e.ctrlKey) {
                                if (!e.shiftKey && !e.altKey) {
                                    this.moveSelectedRegions(0, 5);
                                }
                                else if (e.shiftKey && !e.altKey) {
                                    this.resizeSelectedRegions(0, 5);
                                }
                                else if (e.altKey && !e.shiftKey) {
                                    this.resizeSelectedRegions(0, 5, true);
                                }
                            }
                            break;
                        // ctrl + left
                        case 37:
                            if (e.ctrlKey) {
                                if (!e.shiftKey && !e.altKey) {
                                    this.moveSelectedRegions(-5, 0);
                                }
                                else if (e.shiftKey && !e.altKey) {
                                    this.resizeSelectedRegions(-5, 0);
                                }
                                else if (e.altKey && !e.shiftKey) {
                                    this.resizeSelectedRegions(-5, 0, true);
                                }
                            }
                            break;
                        // ctrl + right
                        case 39:
                            if (e.ctrlKey) {
                                if (!e.shiftKey && !e.altKey) {
                                    this.moveSelectedRegions(5, 0);
                                }
                                else if (e.shiftKey && !e.altKey) {
                                    this.resizeSelectedRegions(5, 0);
                                }
                                else if (e.altKey && !e.shiftKey) {
                                    this.resizeSelectedRegions(5, 0, true);
                                }
                            }
                            break;
                        // default
                        default: return;
                    }
                    e.preventDefault();
                }
            }
        });
        window.addEventListener("keydown", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (!this.isFrozen) {
                    switch (e.code) {
                        // ctrl + A, ctrl + a
                        case "KeyA":
                        case "Numpad1":
                            if (e.ctrlKey) {
                                this.selectAllRegions();
                            }
                            break;
                        // ctrl + B, ctrl + b
                        case "KeyB":
                            if (e.ctrlKey) {
                                this.toggleBackground();
                            }
                            break;
                        // default
                        default: return;
                    }
                    // e.preventDefault();
                }
            }
        });
    }
    /**
     * Registers the provided region in the manager.
     * @param region - The new region to register.
     */
    registerRegion(region) {
        this.unselectRegions();
        region.select();
        this.regionManagerLayer.add(region.node);
        this.regions.push(region);
        this.menu.showOnRegion(region);
    }
}
exports.RegionsManager = RegionsManager;
//# sourceMappingURL=RegionsManager.js.map