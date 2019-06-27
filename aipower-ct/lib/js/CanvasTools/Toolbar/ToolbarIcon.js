"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ToolbarItemType;
(function (ToolbarItemType) {
    ToolbarItemType[ToolbarItemType["SELECTOR"] = 0] = "SELECTOR";
    ToolbarItemType[ToolbarItemType["SWITCH"] = 1] = "SWITCH";
    ToolbarItemType[ToolbarItemType["SEPARATOR"] = 2] = "SEPARATOR";
    ToolbarItemType[ToolbarItemType["TRIGGER"] = 3] = "TRIGGER";
})(ToolbarItemType = exports.ToolbarItemType || (exports.ToolbarItemType = {}));
class ToolbarIcon {
    constructor(paper, icon) {
        this.isSelected = false;
        this.paper = paper;
        if (icon !== undefined && icon !== null) {
            this.description = icon;
            if (icon.width !== undefined) {
                this.width = icon.width;
            }
            else {
                this.width = ToolbarIcon.IconWidth;
            }
            if (icon.height !== undefined) {
                this.height = icon.height;
            }
            else {
                this.height = ToolbarIcon.IconHeight;
            }
        }
        else {
            this.description = null;
            this.width = ToolbarIcon.IconWidth;
            this.height = ToolbarIcon.IconHeight;
        }
    }
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
    }
    select() {
        this.node.addClass("selected");
        this.isSelected = true;
    }
    unselect() {
        this.node.removeClass("selected");
        this.isSelected = false;
    }
    toggleSelection() {
        if (this.isSelected) {
            this.unselect();
        }
        else {
            this.select();
        }
    }
}
ToolbarIcon.IconWidth = 48;
ToolbarIcon.IconHeight = 48;
exports.ToolbarIcon = ToolbarIcon;
//# sourceMappingURL=ToolbarIcon.js.map