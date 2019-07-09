"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XYZColor_1 = require("./XYZColor");
const SRGBColor_1 = require("./SRGBColor");
/**
 * Represents the RGB color space.
 */
class RGBColor {
    /**
     * The red-component of the color.
     */
    get r() {
        return this.values[0];
    }
    /**
     * The green-component of the color.
     */
    get g() {
        return this.values[1];
    }
    /**
     * The blue-component of the color.
     */
    get b() {
        return this.values[2];
    }
    /**
     * Creates new RGBColor
     * @param r - Red component in the range [0, 1].
     * @param g - Green component in the range [0, 1].
     * @param b - Blue component in the range [0, 1].
     */
    constructor(r, g, b) {
        this.values = [r, g, b];
    }
    /**
     * Return a copy of color values in array format as [r, g, b].
     */
    toArray() {
        // copy
        return this.values.map((v) => v);
    }
    /**
     * Trasforms color to the XYZ format.
     */
    toXYZ() {
        const [r, g, b] = this.values;
        const x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
        const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
        return new XYZColor_1.XYZColor(x, y, z);
    }
    /**
     * Trasforms color to the sRGB values.
     */
    toSRGB() {
        const values = this.values.map((v) => {
            if (v < 0.0031308) {
                return 12.92 * v;
            }
            else {
                return 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
            }
        });
        return new SRGBColor_1.SRGBColor(values[0], values[1], values[2]);
    }
    /**
     * Trasforms color to the CIE LAB format.
     */
    toLAB() {
        return this.toXYZ().toLAB();
    }
}
exports.RGBColor = RGBColor;
//# sourceMappingURL=RGBColor.js.map