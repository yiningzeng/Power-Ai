"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RegionComponent_1 = require("./Component/RegionComponent");
/**
 * The region menu element.
 */
class MenuElement extends RegionComponent_1.RegionComponent {
    /**
     * Creates the menu component.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        /**
         * Default menu item size.
         */
        this.menuItemSize = 20;
        /**
         * Default menu width.
         */
        this.mw = this.menuItemSize + 10;
        /**
         * Default menu height.
         */
        this.mh = this.menuItemSize + 10;
        /**
         * Threshold for positioning menu inside/outside
         */
        this.dh = 20;
        /**
         * Threshold for positioning menu left/right
         */
        this.dw = 5;
        this.buildUI();
    }
    /**
     * Add a new icon with action to menu.
     * @param action - Item action description.
     * @param icon - Item SVG-path string.
     * @param actor - The callback function.
     */
    addAction(action, icon, actor) {
        const item = this.menuGroup.g();
        const itemBack = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemBack.addClass("menuItemBack");
        const itemIcon = this.menuGroup.path(MenuElement.PathCollection.delete.path);
        itemIcon.transform(`scale(0.2) translate(26 26)`);
        itemIcon.addClass("menuIcon");
        itemIcon.addClass("menuIcon-" + icon);
        const itemRect = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemRect.addClass("menuItem");
        item.add(itemBack);
        item.add(itemIcon);
        item.add(itemRect);
        item.click((e) => {
            actor(this.region, action);
        });
        this.menuItemsGroup.add(item);
        this.menuItems.push(item);
    }
    /**
     * Attach the menu to specified region element.
     * @param region - The host region element.
     */
    attachTo(region) {
        this.region = region;
        this.regionData.initFrom(region.regionData);
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }
    move(arg1, arg2) {
        super.move(arg1, arg2);
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }
    /**
     * Move menu according to new region size.
     * @remarks This method moves the virtual shadow of the region and then rearranges menu position.
     * @param width - New region width.
     * @param height - New region height.
     */
    resize(width, height) {
        super.resize(width, height);
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }
    /**
     * Redraw menu element.
     */
    redraw() {
        // do nothing
    }
    /**
     * Visually hide menu element.
     */
    hide() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: "hidden",
            });
        });
    }
    /**
     * Visually show menu element.
     */
    show() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: "visible",
            });
        });
    }
    /**
     * Show menu element on the specified region.
     * @param region - The host region element.
     */
    showOnRegion(region) {
        this.attachTo(region);
        this.show();
    }
    /**
     * Creates the menu element UI.
     */
    buildUI() {
        const menuSVG = this.paper.svg(this.mx, this.my, this.mw, this.mh, this.mx, this.my, this.mw, this.mh);
        // Snap.Paper
        this.menuGroup = Snap(menuSVG).paper;
        this.menuGroup.addClass("menuLayer");
        this.rearrangeMenuPosition();
        this.menuRect = this.menuGroup.rect(0, 0, this.mw, this.mh, 5, 5);
        this.menuRect.addClass("menuRectStyle");
        this.menuItemsGroup = this.menuGroup.g();
        this.menuItemsGroup.addClass("menuItems");
        this.menuItems = new Array();
        this.menuGroup.add(this.menuRect);
        this.menuGroup.add(this.menuItemsGroup);
        this.menuGroup.mouseover((e) => {
            this.onManipulationBegin();
        });
        this.menuGroup.mouseout((e) => {
            this.onManipulationEnd();
        });
    }
    /**
     * Updates menu position.
     */
    rearrangeMenuPosition() {
        /* // position menu inside
        if (this.mh <= this.boundRect.height - this.dh) {
            this.my = this.y + this.boundRect.height / 2 - this.mh / 2;
            // position menu on the right side
            if (this.x + this.boundRect.width + this.mw / 2 + this.dw < this.paperRect.width) {
                this.mx = this.x + this.boundRect.width - this.mw / 2;
            } else if (this.x - this.mw / 2 - this.dw > 0) { // position menu on the left side
                this.mx = this.x - this.mw / 2;
            } else { // position menu on the right side INSIDE
                this.mx = this.x + this.boundRect.width - this.mw - this.dw;
            }
        } else { // position menu outside
            if (this.y + this.mh > this.paperRect.height) {
                this.my = this.paperRect.height - this.mh - this.dw;
            } else {
                this.my = this.y;
            }
            // position menu on the right side
            if (this.x + this.boundRect.width + this.mw + 2 * this.dw < this.paperRect.width) {
                this.mx = this.x + this.boundRect.width + this.dw;
            } else if (this.x - this.mw - 2 * this.dw > 0) { // position menu on the left side
                this.mx = this.x - this.mw - this.dw;
            } else { // position menu on the right side INSIDE
                this.mx = this.x + this.boundRect.width - this.mw - this.dw;
            }
        } */
        // position menu outside
        if (this.y + this.mh + this.dw > this.paperRect.height) {
            this.my = this.paperRect.height - this.mh - this.dw;
        }
        else {
            this.my = this.y + this.dw;
        }
        // position menu on the right side
        if (this.x + this.boundRect.width + this.mw + 2 * this.dw < this.paperRect.width) {
            this.mx = this.x + this.boundRect.width + this.dw;
        }
        else if (this.x - this.mw - 2 * this.dw > 0) { // position menu on the left side
            this.mx = this.x - this.mw - this.dw;
        }
        else { // position menu on the right side INSIDE
            this.mx = this.x + this.boundRect.width - this.mw - this.dw;
        }
    }
}
/**
 * The SVG path for x-button (close).
 */
MenuElement.PathCollection = {
    delete: {
        iconSize: 96,
        path: "M 83.4 21.1 L 74.9 12.6 L 48 39.5 L 21.1 12.6 L 12.6 21.1 L 39.5 48 L 12.6 74.9 " +
            "L 21.1 83.4 L 48 56.5 L 74.9 83.4 L 83.4 74.9 L 56.5 48 Z",
    },
};
exports.MenuElement = MenuElement;
//# sourceMappingURL=RegionMenu.js.map