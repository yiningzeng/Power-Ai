"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = require("../Core/Rect");
const ToolbarIcon_1 = require("./ToolbarIcon");
const ToolbarSelectIcon_1 = require("./ToolbarSelectIcon");
const ToolbarSeparator_1 = require("./ToolbarSeparator");
const ToolbarSwitchIcon_1 = require("./ToolbarSwitchIcon");
const ToolbarTriggerIcon_1 = require("./ToolbarTriggerIcon");
class Toolbar {
    constructor(svgHost) {
        this.iconSpace = 8;
        this.areHotKeysEnabled = true;
        this.icons = new Array();
        this.buildUIElements(svgHost);
    }
    addSelector(icon, actor) {
        const newIcon = new ToolbarSelectIcon_1.ToolbarSelectIcon(this.paper, icon, (action) => {
            this.select(action);
            actor(action);
        });
        this.addIcon(newIcon);
    }
    addSwitch(icon, actor) {
        const newIcon = new ToolbarSwitchIcon_1.ToolbarSwitchIcon(this.paper, icon, (action) => {
            actor(action);
        });
        this.addIcon(newIcon);
    }
    addSeparator() {
        const newIcon = new ToolbarSeparator_1.ToolbarSeparator(this.paper, ToolbarIcon_1.ToolbarIcon.IconWidth);
        this.addIcon(newIcon);
    }
    addTrigger(icon, actor) {
        const newIcon = new ToolbarTriggerIcon_1.ToolbarTriggerIcon(this.paper, icon, (action) => {
            actor(action);
        });
        this.addIcon(newIcon);
    }
    select(action) {
        this.icons.forEach((icon) => {
            if (icon instanceof ToolbarSelectIcon_1.ToolbarSelectIcon) {
                if (icon.description.action !== action) {
                    icon.unselect();
                }
                else {
                    icon.select();
                }
            }
        });
    }
    setSwitch(action, on) {
        const switchIcon = this.findIconByAction(action);
        if (switchIcon !== undefined && switchIcon instanceof ToolbarSwitchIcon_1.ToolbarSwitchIcon) {
            (on) ? switchIcon.select() : switchIcon.unselect();
        }
    }
    enableHotkeys() {
        this.areHotKeysEnabled = true;
    }
    disableHotkeys() {
        this.areHotKeysEnabled = false;
    }
    buildUIElements(svgHost) {
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect_1.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
        const toolbarGroup = this.paper.g();
        toolbarGroup.addClass("toolbarLayer");
        this.recalculateToolbarSize();
        this.backgroundRect = this.paper.rect(0, 0, this.toolbarWidth, this.toolbarHeight);
        this.backgroundRect.addClass("toolbarBGStyle");
        toolbarGroup.add(this.backgroundRect);
        this.iconsLayer = this.paper.g();
        this.iconsLayer.addClass("iconsLayerStyle");
        toolbarGroup.add(this.iconsLayer);
        this.subscribeToKeyboardEvents();
    }
    recalculateToolbarSize(newIcon) {
        if (newIcon === undefined) {
            this.toolbarWidth = ToolbarIcon_1.ToolbarIcon.IconWidth + 2 * this.iconSpace;
            this.toolbarHeight = this.icons.length * (ToolbarIcon_1.ToolbarIcon.IconHeight + this.iconSpace) + this.iconSpace;
        }
        else {
            const width = newIcon.width + 2 * this.iconSpace;
            if (width > this.toolbarWidth) {
                this.toolbarWidth = width;
            }
            this.toolbarHeight = this.toolbarHeight + newIcon.height + this.iconSpace;
        }
    }
    updateToolbarSize() {
        this.backgroundRect.attr({
            height: this.toolbarHeight,
            width: this.toolbarWidth,
        });
    }
    addIcon(newIcon) {
        this.icons.push(newIcon);
        this.iconsLayer.add(newIcon.node);
        newIcon.move(this.iconSpace, this.toolbarHeight + this.iconSpace);
        this.recalculateToolbarSize(newIcon);
        this.updateToolbarSize();
    }
    findIconByKeycode(keycode) {
        return this.icons.find((icon) => {
            return icon.description !== null && icon.description.keycode === keycode;
        });
    }
    findIconByAction(action) {
        return this.icons.find((icon) => {
            return icon.description !== null && icon.description.action === action;
        });
    }
    subscribeToKeyboardEvents() {
        window.addEventListener("keyup", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (this.areHotKeysEnabled && !e.ctrlKey && !e.altKey) {
                    const icon = this.findIconByKeycode(e.code);
                    if (icon !== undefined) {
                        if (icon instanceof ToolbarSelectIcon_1.ToolbarSelectIcon || icon instanceof ToolbarSwitchIcon_1.ToolbarSwitchIcon
                            || icon instanceof ToolbarTriggerIcon_1.ToolbarTriggerIcon) {
                            icon.activate();
                        }
                    }
                }
            }
        });
    }
}
exports.Toolbar = Toolbar;
//# sourceMappingURL=Toolbar.js.map