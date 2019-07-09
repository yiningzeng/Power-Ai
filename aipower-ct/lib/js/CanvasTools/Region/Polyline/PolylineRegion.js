"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = require("../../Core/Rect");
const Region_1 = require("../Region");
const AnchorsElement_1 = require("./AnchorsElement");
const DragElement_1 = require("./DragElement");
const TagsElement_1 = require("./TagsElement");
/**
 * The polyline-type region class.
 */
class PolylineRegion extends Region_1.Region {
    /**
     * Creates new `PolylineRegion` object.
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
        if (paperRect !== null) {
            this.paperRects = {
                actual: new Rect_1.Rect(paperRect.width - regionData.width, paperRect.height - regionData.height),
                host: paperRect,
            };
        }
        this.buildOn(paper);
    }
    /**
     * The callback function fot internal components.
     * @param component - Reference to the UI component.
     * @param regionData - New RegionData object.
     * @param state - New state of the region.
     * @param multiSelection - Flag for multiselection.
     */
    onChange(component, regionData, state, multiSelection = false) {
        this.paperRects.actual.resize(this.paperRects.host.width - regionData.width, this.paperRects.host.height - regionData.height);
        super.onChange(component, regionData, state, multiSelection);
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
     * Resizes the region to specified `width` and `height`.
     * @param width - The new region width.
     * @param height - The new region height.
     */
    resize(width, height) {
        this.paperRects.actual.resize(this.paperRects.host.width - width, this.paperRects.host.height - height);
        super.resize(width, height);
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
        this.dragNode = new DragElement_1.DragElement(paper, this.paperRects.actual, this.regionData, callbacks);
        this.tagsNode = new TagsElement_1.TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.anchorNode = new AnchorsElement_1.AnchorsElement(paper, this.paperRect, this.regionData, callbacks);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.node.add(this.anchorNode.node);
        this.UI.push(this.tagsNode, this.dragNode, this.anchorNode);
    }
}
exports.PolylineRegion = PolylineRegion;
//# sourceMappingURL=PolylineRegion.js.map