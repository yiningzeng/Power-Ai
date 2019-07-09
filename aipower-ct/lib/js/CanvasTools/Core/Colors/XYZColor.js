"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RGBColor_1 = require("./RGBColor");
const LABColor_1 = require("./LABColor");
/**
 * Represents the CIE XYZ color space.
 */
class XYZColor {
    /**
     * Creates new XYZ color.
     * @param x - x-component in the range [0, 1].
     * @param y - y-component in the range [0, 1].
     * @param z - z-component in the range [0, 1].
     */
    constructor(x, y, z) {
        this.values = [x, y, z];
    }
    /**
     * The x-component of the color.
     */
    get x() {
        return this.values[0];
    }
    /**
     * The y-component of the color.
     */
    get y() {
        return this.values[1];
    }
    /**
     * The z-component of the color.
     */
    get z() {
        return this.values[2];
    }
    /**
     * Return a copy of color values in array format as [x, y, z].
     */
    toArray() {
        // copy
        return this.values.map((v) => v);
    }
    /**
     * Trasforms color to the RGB format.
     */
    toRGB() {
        const [x, y, z] = this.values;
        const r = +3.2406255 * x - 1.5372080 * y - 0.4986286 * z;
        const g = -0.9689307 * x + 1.8757561 * y + 0.0415175 * z;
        const b = +0.0557101 * x - 0.2040211 * y + 1.0569959 * z;
        return new RGBColor_1.RGBColor(r, g, b);
    }
    /**
     * Trasforms color to the sRGB format.
     */
    toSRGB() {
        return this.toRGB().toSRGB();
    }
    /**
     * Trasforms color to the CIE LAB format.
     */
    toLAB() {
        const x = this.x / XYZColor.D65.x;
        const y = this.y / XYZColor.D65.y;
        const z = this.z / XYZColor.D65.z;
        const xyz = [x, y, z].map((v) => {
            if (v > 0.008856451) {
                return v ** (1 / 3);
            }
            else {
                return 7.787037 * v + 16 / 116;
            }
        });
        return new LABColor_1.LABColor((116 * xyz[1] - 16) / 100, 5 * (xyz[0] - xyz[1]), 2 * (xyz[1] - xyz[2]));
    }
}
/**
 * The D65 white point vector.
 */
XYZColor.D65 = new XYZColor(0.95047, 1.000, 1.08883);
/**
 * The D50 white point vector.
 */
XYZColor.D50 = new XYZColor(0.966797, 1.000, 0.825188);
exports.XYZColor = XYZColor;
//# sourceMappingURL=XYZColor.js.map