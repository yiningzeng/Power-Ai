"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Region_1 = require("../Region");
const DragElement_1 = require("./DragElement");
const TagsElement_1 = require("./TagsElement");
/**
 * The point-type region class.
 */
class PointRegion extends Region_1.Region {
    /**
     * Creates new `PointRegion` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     * @param id - The region `id` used to identify regions in `RegionsManager`.
     * @param tagsDescriptor - The descriptor of region tags.
     * @param tagsUpdateOptions - The drawing options for tags.
     */
    constructor(paper, paperRect = null, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions) {
        super(paper, paperRect, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions);
        this.buildOn(paper);
    }
    /**
     * Updates region tags.
     * @param tags - The new tags descriptor object.
     * @param options - The tags drawing options.
     */
    updateTags(tags, options) {
        super.updateTags(tags, options);
        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }
    /**
     * Creates the UI of the region component.
     * @param paper - The `Snap.Paper` element to draw on.
     */
    buildOn(paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);
        const callbacks = {
            onChange: this.onChange.bind(this),
            onManipulationBegin: this.onManipulationBegin.bind(this),
            onManipulationEnd: this.onManipulationEnd.bind(this),
        };
        this.dragNode = new DragElement_1.DragElement(paper, this.paperRect, this.regionData, callbacks);
        this.tagsNode = new TagsElement_1.TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.UI.push(this.tagsNode, this.dragNode);
    }
}
exports.PointRegion = PointRegion;
//# sourceMappingURL=PointRegion.js.map