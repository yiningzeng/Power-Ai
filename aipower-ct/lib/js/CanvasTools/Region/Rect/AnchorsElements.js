"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("../../Core/Point2D");
const IRegionCallbacks_1 = require("../../Interface/IRegionCallbacks");
const AnchorsComponent_1 = require("../Component/AnchorsComponent");
/**
 * `AnchorsComponent` for the `RectRegion` class.
 * @todo Current implementations of bones reuses existing aprroach with anchor index
 * by using negative indexes and manually correcting them to actual indexes.
 * It seems like it should be refactored some how.
 */
class AnchorsElement extends AnchorsComponent_1.AnchorsComponent {
    /**
     * Creates a new `AnchorsElement` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
    }
    /**
     * Redraws the visual on the component.
     */
    redraw() {
        super.redraw();
        const [x, y, width, height] = [this.regionData.x, this.regionData.y,
            this.regionData.width, this.regionData.height];
        const [tBone, rBone, bBone, lBone] = this.anchorBones;
        window.requestAnimationFrame(() => {
            tBone.attr({ x, y: y - this.boneThickness / 2, width, height: this.boneThickness });
            rBone.attr({ x: x + width - this.boneThickness / 2, y, width: this.boneThickness, height });
            bBone.attr({ x, y: y + height - this.boneThickness / 2, width, height: this.boneThickness });
            lBone.attr({ x: x - this.boneThickness / 2, y, width: this.boneThickness, height });
        });
    }
    /**
     * Creates a collection on anchors.
     */
    buildAnchors() {
        this.buildBoneAnchors();
        this.buildPointAnchors();
    }
    /**
     * Creates collection of anchor points.
     */
    buildPointAnchors() {
        this.anchorPointStyles = ["TL", "TR", "BR", "BL"];
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y, this.anchorPointStyles[index]);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);
            this.subscribeAnchorToEvents(anchor, index);
        });
    }
    /**
     * Creates collection of anchor bones.
     */
    buildBoneAnchors() {
        this.anchorBoneStyles = ["T", "R", "B", "L"];
        this.anchorBones = [];
        this.boneThickness = AnchorsComponent_1.AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS;
        const [x, y, w, h] = [this.regionData.x, this.regionData.y, this.regionData.width, this.regionData.height];
        const tBone = this.createAnchorBone(this.paper, x, y, w, 0, "T", this.boneThickness);
        const rBone = this.createAnchorBone(this.paper, x + w, y, 0, h, "R", this.boneThickness);
        const bBone = this.createAnchorBone(this.paper, x, y + h, w, 0, "B", this.boneThickness);
        const lBone = this.createAnchorBone(this.paper, x, y, 0, h, "L", this.boneThickness);
        const bones = [tBone, rBone, bBone, lBone];
        this.anchorBones.push(...bones);
        bones.forEach((bone, index) => {
            this.anchorsNode.add(bone);
            // Using already existing infrastructure for indexes
            this.subscribeAnchorBoneToEvents(bone, -(index + 1));
        });
    }
    /**
     * Helper function to create a new anchor bone.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param x - The `x`-coordinate of the acnhor bone.
     * @param y - The `y`-coordinate of the anchor bone.
     * @param width - The `width` of the anchor bone.
     * @param height - The `height` of the anchor bone.
     * @param style - Additional css style class to be applied.
     * @param thickness - The `thickness` of the bone (activation area).
     */
    createAnchorBone(paper, x, y, width, height, style, thickness = AnchorsComponent_1.AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS) {
        let bone;
        if (width === 0) {
            bone = paper.rect(x - thickness / 2, y, thickness, height);
        }
        else if (height === 0) {
            bone = paper.rect(x, y - thickness / 2, width, thickness);
        }
        else {
            throw Error("Rect bones that are neither vertical or horizontal are not supported.");
            return null;
        }
        bone.addClass("anchorBoneStyle");
        if (style !== undefined && style !== "") {
            bone.addClass(style);
        }
        return bone;
    }
    /**
     * Updates the `regionData` based on the new ghost anchor location. Should be redefined in child classes.
     * @param p - The new ghost anchor location.
     */
    updateRegion(p) {
        let x1 = p.x;
        let y1 = p.y;
        let x2;
        let y2;
        let flipX = false;
        let flipY = false;
        let activeAnchor = this.getActiveAnchor();
        switch (activeAnchor) {
            case "TL": {
                x2 = this.x + this.width;
                y2 = this.y + this.height;
                flipX = x2 < x1;
                flipY = y2 < y1;
                break;
            }
            case "TR": {
                x2 = this.x;
                y2 = this.y + this.height;
                flipX = x1 < x2;
                flipY = y2 < y1;
                break;
            }
            case "BL": {
                y2 = this.y;
                x2 = this.x + this.width;
                flipX = x2 < x1;
                flipY = y1 < y2;
                break;
            }
            case "BR": {
                x2 = this.x;
                y2 = this.y;
                flipX = x1 < x2;
                flipY = y1 < y2;
                break;
            }
            case "T": {
                x1 = this.x;
                x2 = this.x + this.width;
                y2 = this.y + this.height;
                flipY = y1 > y2;
                break;
            }
            case "R": {
                x2 = this.x;
                y1 = this.y;
                y2 = this.y + this.height;
                flipX = x2 > x1;
                break;
            }
            case "B": {
                x1 = this.x;
                x2 = this.x + this.width;
                y2 = this.y;
                flipY = y1 < y2;
                break;
            }
            case "L": {
                x2 = this.x + this.width;
                y1 = this.y;
                y2 = this.y + this.height;
                flipX = x1 > x2;
                break;
            }
        }
        let newAA = "";
        if (activeAnchor !== "" && activeAnchor.length === 2) {
            newAA += (activeAnchor[0] === "T") ? (flipY ? "B" : "T") : (flipY ? "T" : "B");
            newAA += (activeAnchor[1] === "L") ? (flipX ? "R" : "L") : (flipX ? "L" : "R");
        }
        if (activeAnchor !== "" && activeAnchor.length === 1) {
            if (flipX) {
                newAA = (activeAnchor === "R") ? "L" : "R";
            }
            else if (flipY) {
                newAA = (activeAnchor === "T") ? "B" : "T";
            }
            else {
                newAA = activeAnchor;
            }
        }
        if (activeAnchor !== newAA) {
            this.ghostAnchor.removeClass(activeAnchor);
            if (newAA.length === 2) {
                this.activeAnchorIndex = this.anchorPointStyles.indexOf(newAA);
            }
            else {
                this.activeAnchorIndex = -(this.anchorBoneStyles.indexOf(newAA) + 1);
            }
            activeAnchor = newAA;
            this.ghostAnchor.addClass(newAA);
        }
        const p1 = new Point2D_1.Point2D(Math.min(x1, x2), Math.min(y1, y2)).boundToRect(this.paperRect);
        const p2 = new Point2D_1.Point2D(Math.max(x1, x2), Math.max(y1, y2)).boundToRect(this.paperRect);
        const rd = this.regionData.copy();
        rd.setPoints([p1, new Point2D_1.Point2D(p2.x, p1.y), p2, new Point2D_1.Point2D(p1.x, p2.y)]);
        this.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVING);
    }
    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerEnter(e) {
        this.ghostAnchor.addClass(this.getActiveAnchor());
        super.onGhostPointerEnter(e);
    }
    /**
     * Callback for the pointerleave event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    onGhostPointerLeave(e) {
        this.ghostAnchor.removeClass(this.getActiveAnchor());
        super.onGhostPointerLeave(e);
    }
    /**
     * Helper function to subscribe anchor to activation event.
     * @param bone - The anchor bone for wire up.
     * @param index - The index of the anchor used to define which one is active.
     */
    subscribeAnchorBoneToEvents(bone, index) {
        bone.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                // Set drag origin point to current anchor
                this.dragOrigin = new Point2D_1.Point2D(e.offsetX, e.offsetY);
                this.activeAnchorIndex = index;
                // Move ghost anchor to current anchor position
                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: this.dragOrigin.x,
                        cy: this.dragOrigin.y,
                        display: "block",
                    });
                });
                this.onManipulationBegin();
            }
        });
    }
    /**
     * Internal helper function to get active anchor.
     */
    getActiveAnchor() {
        if (this.activeAnchorIndex >= 0) {
            // anchor point is activeted
            return this.anchorPointStyles[this.activeAnchorIndex];
        }
        else {
            // anchor bone is activeted, indexes are negative starting -1
            return this.anchorBoneStyles[-this.activeAnchorIndex - 1];
        }
    }
}
exports.AnchorsElement = AnchorsElement;
//# sourceMappingURL=AnchorsElements.js.map