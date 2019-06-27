"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RegionComponent_1 = require("./RegionComponent");
/**
 * An abstract visual component used internall do draw tags data for regions.
 */
class TagsComponent extends RegionComponent_1.RegionComponent {
    /**
     * Creates a new `TagsComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param tags - The `TagsDescriptor` object presenting colors and names for region tags.
     * @param styleId - The unique css style id for region.
     * @param styleSheet - The regerence to the stylesheet object for rules insection.
     * @param tagsUpdateOptions - The settings for redrawing tags.
     */
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, null);
        /**
         * Reference to the stylesheet element.
         */
        this.styleSheet = null;
        /**
         * Default styling rules.
         */
        this.styleMap = [];
        /**
         * Light styling rules used when `showRegionBackground` is set to `false`.
         */
        this.styleLightMap = [];
        this.styleId = styleId;
        this.styleSheet = styleSheet;
        this.tags = tags;
        this.tagsUpdateOptions = tagsUpdateOptions;
        this.node = paper.g();
        this.node.addClass("tagsLayer");
    }
    /**
     * Updates component with new `TagsDescriptor` object and new drawing settings.
     * @param tags - The new `TagsDescriptor` object.
     * @param options - The new drawing settings.
     */
    updateTags(tags, options) {
        this.tags = tags;
        this.tagsUpdateOptions = options;
        this.rebuildTagLabels();
        this.clearStyleMaps();
        this.initStyleMaps(tags);
        const showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyStyleMaps(showBackground);
    }
    /**
     * Clears current styling rules.
     */
    clearStyleMaps() {
        while (this.styleSheet.cssRules.length > 0) {
            this.styleSheet.deleteRule(0);
        }
    }
    /**
     * Inserts the styling rules into the `styleSheet` object.
     * @param showRegionBackground - The flag to make background visible or transparent.
     */
    applyStyleMaps(showRegionBackground = true) {
        // Map primary tag color
        if (this.tags && this.tags.primary !== undefined) {
            window.requestAnimationFrame(() => {
                const sm = (showRegionBackground ? this.styleMap : this.styleLightMap);
                for (const r of sm) {
                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                }
            });
        }
    }
}
exports.TagsComponent = TagsComponent;
//# sourceMappingURL=TagsComponent.js.map