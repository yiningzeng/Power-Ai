"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RegionComponent_1 = require("./Component/RegionComponent");
/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */
class Region extends RegionComponent_1.RegionComponent {
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
    constructor(paper, paperRect = null, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions) {
        super(paper, paperRect, regionData, callbacks);
        /**
         * The reference to the CSSStyleSheet object.
         */
        this.styleSheet = null;
        this.ID = id;
        this.tags = tagsDescriptor;
        this.regionID = this.s8();
        this.styleID = `region_${this.regionID}_style`;
        this.styleSheet = this.insertStyleSheet();
        this.tagsUpdateOptions = tagsUpdateOptions;
        this.UI = [];
    }
    /**
     * Clear region styles.
     */
    removeStyles() {
        document.getElementById(this.styleID).remove();
    }
    /**
     * The callback function fot internal components.
     * @param component - Reference to the UI component.
     * @param regionData - New RegionData object.
     * @param state - New state of the region.
     * @param multiSelection - Flag for multiselection.
     */
    onChange(component, regionData, state, multiSelection = false) {
        this.regionData.initFrom(regionData);
        this.redraw();
        super.onChange(this, this.regionData.copy(), state, multiSelection);
    }
    /**
     * Updates region tags.
     * @param tags - The new tags descriptor object.
     * @param options - The tags drawing options.
     */
    updateTags(tags, options) {
        this.tags = tags;
        this.tagsUpdateOptions = options;
    }
    move(arg1, arg2) {
        super.move(arg1, arg2);
        this.redraw();
    }
    /**
     * Resizes the region to specified `width` and `height`.
     * @param width - The new region width.
     * @param height - The new region height.
     */
    resize(width, height) {
        super.resize(width, height);
        this.redraw();
    }
    /**
     * Redraws the region component.
     */
    redraw() {
        this.UI.forEach((element) => {
            element.redraw();
        });
    }
    /**
     * Visually freeze the region.
     */
    freeze() {
        super.freeze();
        this.node.addClass("old");
        this.UI.forEach((element) => {
            element.freeze();
        });
    }
    /**
     * Visually unfreeze the region.
     */
    unfreeze() {
        super.unfreeze();
        this.node.removeClass("old");
        this.UI.forEach((element) => {
            element.unfreeze();
        });
    }
    /**
     * Internal helper function to generate random id.
     */
    s8() {
        return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
    }
    /**
     * Helper function to insert a new stylesheet into the document.
     */
    insertStyleSheet() {
        const style = document.createElement("style");
        style.setAttribute("id", this.styleID);
        document.head.appendChild(style);
        return style.sheet;
    }
}
exports.Region = Region;
//# sourceMappingURL=Region.js.map