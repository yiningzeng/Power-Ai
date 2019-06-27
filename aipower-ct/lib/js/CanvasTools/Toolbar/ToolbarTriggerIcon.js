"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ToolbarIcon_1 = require("./ToolbarIcon");
class ToolbarTriggerIcon extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, icon, onAction) {
        super(paper, icon);
        this.onAction = onAction;
        this.buildIconUI();
    }
    activate() {
        this.onAction(this.description.action);
    }
    move(x, y) {
        super.move(x, y);
        this.iconBackgrounRect.attr({ x, y });
        if (this.iconImageSVG !== undefined) {
            this.iconImageSVG.attr({ x, y });
        }
    }
    resize(width, height) {
        super.resize(width, height);
        this.iconBackgrounRect.attr({
            height: this.height,
            width: this.width,
        });
        this.iconImageSVG.attr({
            height: this.height,
            width: this.width,
        });
    }
    buildIconUI() {
        this.node = this.paper.g();
        this.node.addClass("iconStyle");
        this.node.addClass("selector");
        this.iconBackgrounRect = this.paper.rect(0, 0, this.width, this.height);
        this.iconBackgrounRect.addClass("iconBGRectStyle");
        this.iconImage = this.paper.g();
        if (this.description.iconUrl !== undefined) {
            Snap.load(this.description.iconUrl, (fragment) => {
                this.iconImage.append(fragment);
                this.iconImageSVG = this.iconImage.children().find((element) => {
                    return (element.type === "svg");
                });
                if (this.iconImageSVG !== undefined) {
                    this.iconImageSVG.attr({
                        height: this.height,
                        width: this.width,
                    });
                    this.move(this.x, this.y);
                }
            });
        }
        this.iconImage.addClass("iconImageStyle");
        const title = Snap.parse(`<title>${this.description.tooltip}</title>`);
        this.node.add(this.iconBackgrounRect);
        this.node.add(this.iconImage);
        this.node.append(title);
        this.node.click((e) => {
            this.activate();
        });
    }
}
exports.ToolbarTriggerIcon = ToolbarTriggerIcon;
//# sourceMappingURL=ToolbarTriggerIcon.js.map