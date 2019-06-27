"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RGBColor_1 = require("./RGBColor");
const SRGBColor_1 = require("./SRGBColor");
const XYZColor_1 = require("./XYZColor");
const LABColor_1 = require("./LABColor");
const HSLColor_1 = require("./HSLColor");
/**
 * A wrapper `Color` class to represent various color formats
 * and manage conversions between them.
 * @remarks The current work on defining color management in web (including conversion algorithms)
 * can be tracked in this draft: https://drafts.csswg.org/css-color/
 */
class Color {
    get sRGB() {
        return this.srgbColor;
    }
    get RGB() {
        if (this.rgbColor === undefined) {
            this.rgbColor = this.srgbColor.toRGB();
        }
        return this.rgbColor;
    }
    get XYZ() {
        if (this.xyzColor === undefined) {
            this.xyzColor = this.RGB.toXYZ();
        }
        return this.xyzColor;
    }
    get LAB() {
        if (this.labColor === undefined) {
            this.labColor = this.XYZ.toLAB();
        }
        return this.labColor;
    }
    get HSL() {
        if (this.hslColor === undefined) {
            this.hslColor = this.srgbColor.toHSL();
        }
        return this.hslColor;
    }
    constructor(...args) {
        if (args.length === 1) {
            const c = args[0];
            if (c instanceof SRGBColor_1.SRGBColor) {
                this.srgbColor = c;
            }
            else if (c instanceof RGBColor_1.RGBColor) {
                this.rgbColor = c;
                this.srgbColor = c.toSRGB();
            }
            else if (c instanceof HSLColor_1.HSLColor) {
                this.hslColor = c;
                this.srgbColor = c.toSRGB();
            }
            else if (c instanceof XYZColor_1.XYZColor) {
                this.xyzColor = c;
                this.rgbColor = c.toRGB();
                this.srgbColor = this.rgbColor.toSRGB();
            }
            else if (c instanceof LABColor_1.LABColor) {
                this.labColor = c;
                this.xyzColor = c.toXYZ();
                this.rgbColor = this.xyzColor.toRGB();
                this.srgbColor = this.rgbColor.toSRGB();
            }
            else if (typeof c === "string") {
                this.srgbColor = SRGBColor_1.SRGBColor.ParseHex(c);
            }
            else {
                throw new Error("Wrong arg type. Expected one of the '***Color' types.");
            }
        }
        else if (args.length === 3) {
            if (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number") {
                this.srgbColor = new SRGBColor_1.SRGBColor(args[0], args[1], args[2]);
            }
            else {
                throw new Error("Wrong arg type. Expected 3 args of the 'number' type.");
            }
        }
        else {
            throw new Error("Wrong args for Color constructor.");
        }
    }
}
exports.Color = Color;
//# sourceMappingURL=Color.js.map