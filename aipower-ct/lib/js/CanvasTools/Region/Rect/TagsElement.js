"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TagsComponent_1 = require("../Component/TagsComponent");
/**
 * `TagsComponent` for the `RectRegion` class.
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
    redraw(rebuildTags = false) {
        // If there are tags assigned
        if (this.tags) {
            window.requestAnimationFrame(() => {
                if (this.tags.primary !== undefined && this.tags.primary !== null) {
                    // Update primaty tag rect
                    this.primaryTagRect.attr({
                        height: this.height,
                        width: this.width,
                        x: this.x,
                        y: this.y,
                    });
                    // Update primary tag text
                    if (rebuildTags) {
                        this.primaryTagText.node.innerHTML = (this.tags.primary !== null) ? this.tags.primary.name : "";
                        this.textBox = this.primaryTagText.getBBox();
                    }
                    const showTextLabel = (this.textBox.width + 10 <= this.width)
                        && (this.textBox.height <= this.height);
                    if (showTextLabel) {
                        this.primaryTagTextBG.attr({
                            height: this.textBox.height + 5,
                            width: this.textBox.width + 10,
                            x: this.x + 1,
                            y: this.y + 1,
                        });
                        this.primaryTagText.attr({
                            visibility: "visible",
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                        });
                    }
                    else {
                        this.primaryTagTextBG.attr({
                            height: Math.min(10, this.height),
                            width: Math.min(10, this.width),
                            x: this.x,
                            y: this.y,
                        });
                        this.primaryTagText.attr({
                            visibility: "hidden",
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                        });
                    }
                }
                else {
                    this.primaryTagRect.attr({
                        height: this.height,
                        width: this.width,
                        x: this.x,
                        y: this.y,
                    });
                    this.primaryTagTextBG.attr({
                        height: 0,
                        width: 0,
                    });
                    this.primaryTagText.attr({
                        visibility: "hidden",
                        x: this.x + 5,
                        y: this.y + this.textBox.height,
                    });
                }
                // Clear secondary tags -> redraw from scratch
                if (rebuildTags) {
                    this.secondaryTags.forEach((tag) => {
                        tag.remove();
                    });
                    this.secondaryTags = [];
                }
                // Recreate secondary tags
                if (this.tags.secondary && this.tags.secondary.length > 0) {
                    const s = 6;
                    const cx = this.x + 0.5 * this.boundRect.width;
                    const cy = this.y - s - 5;
                    const length = this.tags.secondary.length;
                    for (let i = 0; i < length; i++) {
                        const stag = this.tags.secondary[i];
                        const x = cx + (2 * i - length + 1) * s - s / 2;
                        if (rebuildTags) {
                            const tagel = this.paper.rect(x, cy, s, s);
                            tagel.addClass("secondaryTagStyle");
                            tagel.addClass(`secondaryTag-${stag.name}`);
                            this.secondaryTagsNode.add(tagel);
                            this.secondaryTags.push(tagel);
                        }
                        else {
                            const tagel = this.secondaryTags[i];
                            tagel.attr({
                                x,
                                y: cy,
                            });
                        }
                    }
                }
            });
        }
        else {
            window.requestAnimationFrame(() => {
                this.primaryTagRect.attr({
                    height: this.height,
                    width: this.width,
                    x: this.x,
                    y: this.y,
                });
                // Remove primary tag
                this.primaryTagText.node.innerHTML = "";
                this.primaryTagTextBG.attr({
                    height: 0,
                    width: 0,
                });
                // Clear secondary tags
                this.secondaryTags.forEach((tag) => {
                    tag.remove();
                });
                this.secondaryTags = [];
            });
        }
    }
    /**
     * Inits style maps.
     */
    initStyleMaps(tags) {
        if (tags !== null) {
            if (tags.primary !== null) {
                this.styleMap = [
                    {
                        rule: `.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: #fff;`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${tags.primary.colorAccent};`,
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
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                        style: `fill:rgba(255,255,255,0.5);`,
                    },
                ];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorNoColor};
                                stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: #fff;`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${tags.primary.colorShadow};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .primaryTagTextStyle`,
                        style: `opacity:0.25;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                        style: `opacity:0.25;`,
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
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                        style: `fill:rgba(255,255,255,0.5);`,
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
        this.redraw(true);
    }
    /**
     * Internal function to create tag labels
     * @param paper - The `Snap.Paper` object to draw on.
     * @param tags - The `TagsDescriptor` object defining tags.
     */
    buildOn(paper, tags) {
        this.primaryTagNode = paper.g();
        this.primaryTagRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.primaryTagRect.addClass("primaryTagRectStyle");
        this.primaryTagText = paper.text(this.x, this.y, "");
        this.primaryTagText.addClass("primaryTagTextStyle");
        this.textBox = this.primaryTagText.getBBox();
        // bound to region???
        this.primaryTagTextBG = paper.rect(this.x, this.y, 0, 0);
        this.primaryTagTextBG.addClass("primaryTagTextBGStyle");
        this.primaryTagNode.add(this.primaryTagRect);
        this.primaryTagNode.add(this.primaryTagTextBG);
        this.primaryTagNode.add(this.primaryTagText);
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondatyTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
exports.TagsElement = TagsElement;
//# sourceMappingURL=TagsElement.js.map