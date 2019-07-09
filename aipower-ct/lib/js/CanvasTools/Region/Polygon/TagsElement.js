"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TagsComponent_1 = require("../Component/TagsComponent");
/**
 * `TagsComponent` for the `PolygonRegion` class.
 */
class TagsElement extends TagsComponent_1.TagsComponent {
    /**
     * Creates a new `TagsElement` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param tags - The `TagsDescriptor` object presenting colors and names for region tags.
     * @param styleId - The unique css style id for region.
     * @param styleSheet - The regerence to the stylesheet object for rules insection.
     * @param tagsUpdateOptions - The settings for redrawing tags.
     */
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);
        this.buildOn(paper, tags);
    }
    /**
     * Redraws the componnent.
     */
    redraw() {
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        const size = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
        const cx = this.x + this.width / 2;
        const cy = this.y - size - 5;
        window.requestAnimationFrame(() => {
            this.primaryTagBoundRect.attr({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            });
            this.primaryTagPolygon.attr({
                points: pointsData.toString(),
            });
            // Secondary Tags
            if (this.secondaryTags && this.secondaryTags.length > 0) {
                const length = this.secondaryTags.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.secondaryTags[i];
                    const x = cx + (2 * i - length + 0.5) * size;
                    stag.attr({
                        x,
                        y: cy,
                    });
                }
            }
        });
    }
    /**
     * Inits style maps.
     */
    initStyleMaps(tags) {
        if (tags !== null) {
            if (tags.primary !== null) {
                this.styleMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure}`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill:transparent;`,
                    },
                ];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: none;
                                stroke: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: none;
                                stroke: ${tags.primary.colorPure};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure}`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill:transparent;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                        style: `opacity:0.25;`,
                    },
                ];
            }
            else {
                this.styleMap = [];
                this.styleLightMap = [];
            }
            if (tags.secondary !== null && tags.secondary !== undefined) {
                tags.secondary.forEach((tag) => {
                    const rule = {
                        rule: `.secondaryTagStyle.secondaryTag-${tag.name}`,
                        style: `fill: ${tag.colorAccent};`,
                    };
                    this.styleMap.push(rule);
                    this.styleLightMap.push(rule);
                });
            }
        }
    }
    /**
     * Internal function to recreate tag labels.
     */
    rebuildTagLabels() {
        // Clear secondary tags -> redraw from scratch
        for (const tag of this.secondaryTags) {
            tag.remove();
        }
        this.secondaryTags = [];
        // If there are tags assigned
        if (this.tags) {
            if (this.tags.primary !== undefined && this.tags.primary !== null) {
                // Primary Tag
            }
            // Secondary Tags
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                const length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.tags.secondary[i];
                    const s = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
                    const x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                    const y = this.y - s - 5;
                    const tagel = this.paper.rect(x, y, s, s);
                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });
                    this.secondaryTagsNode.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
        }
    }
    /**
     * Internal function to create tag labels
     * @param paper - The `Snap.Paper` object to draw on.
     * @param tags - The `TagsDescriptor` object defining tags.
     */
    buildOn(paper, tags) {
        this.primaryTagNode = paper.g();
        this.primaryTagBoundRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.primaryTagBoundRect.addClass("primaryTagBoundRectStyle");
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagPolygon = paper.polygon(pointsData);
        this.primaryTagPolygon.addClass("primaryTagPolygonStyle");
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagNode.add(this.primaryTagBoundRect);
        this.primaryTagNode.add(this.primaryTagPolygon);
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondatyTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
/**
 * Default (visual) radius for primary tag point.
 */
TagsElement.DEFAULT_PRIMARY_TAG_RADIUS = 3;
/**
 * Default (visual) size for secondary tag boxes.
 */
TagsElement.DEFAULT_SECONDARY_TAG_SIZE = 6;
/**
 * Default (visual) vertical shift for secondary tag boxes.
 */
TagsElement.DEFAULT_SECONDARY_TAG_DY = 6;
exports.TagsElement = TagsElement;
//# sourceMappingURL=TagsElement.js.map