"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ToolbarIcon_1 = require("./ToolbarIcon");
/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */
class ToolbarSeparator extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, width) {
        super(paper, null);
        this.buildIconUI();
        this.resize(width, 1);
    }
    move(x, y) {
        super.move(x, y);
        this.iconSeparator.attr({
            x1: x,
            x2: x + this.width,
            y1: y,
            y2: y,
        });
    }
    resize(width, height) {
        super.resize(width, 1);
        this.iconSeparator.attr({
            width: this.width,
        });
    }
    buildIconUI() {
        this.node = this.paper.g();
        this.node.addClass("iconStyle");
        this.node.addClass("separator");
        this.iconSeparator = this.paper.line(0, 0, this.width, 0);
        this.node.add(this.iconSeparator);
    }
}
exports.ToolbarSeparator = ToolbarSeparator;
//# sourceMappingURL=ToolbarSeparator.js.map