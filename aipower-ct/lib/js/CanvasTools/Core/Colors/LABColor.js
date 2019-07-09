"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XYZColor_1 = require("./XYZColor");
/**
 * Represents the CIE LAB color space.
 */
class LABColor {
    /**
     * The lightness value of the color.
     */
    get l() {
        return this.values[0];
    }
    /**
     * The a-component of the color (green to red).
     */
    get a() {
        return this.values[1];
    }
    /**
     * The b-component of the color (blue to yellow).
     */
    get b() {
        return this.values[2];
    }
    /**
     * Creates new CIE LAB color.
     * @param l - Lightness component in the range [0, 1].
     * @param a - A-component in the range [0, 1].
     * @param b - B-component in the range [0, 1].
     */
    constructor(l, a, b) {
        this.values = [l, a, b];
    }
    /**
     * Computes color difference using the CIE94 formula as defined here:
     * https://en.wikipedia.org/wiki/Color_difference.
     * @remarks It is better to use the CIE DE2000 formula, but it requires significantly more computations.
     * E.g., check this reveiw: http://www.color.org/events/colorimetry/Melgosa_CIEDE2000_Workshop-July4.pdf.
     * @param color - A color to compare.
     * @returns The distance between this and provided colors.
     */
    distanceTo(color) {
        const deltaL = this.values[0] - color.values[0];
        const deltaA = this.values[1] - color.values[1];
        const deltaB = this.values[2] - color.values[2];
        const c1 = Math.sqrt(this.values[1] * this.values[1] + this.values[2] * this.values[2]);
        const c2 = Math.sqrt(color.values[1] * color.values[1] + color.values[2] * color.values[2]);
        const deltaC = c1 - c2;
        let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
        deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
        const sc = 1.0 + 0.045 * c1;
        const sh = 1.0 + 0.015 * c1;
        const deltaLKlsl = deltaL / (1.0);
        const deltaCkcsc = deltaC / (sc);
        const deltaHkhsh = deltaH / (sh);
        const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
    }
    distanceTo_00(color) {
        const [L1, a1, b1] = this.values;
        const [L2, a2, b2] = color.values;
        const kL = 1.0;
        const kC = 1.0;
        const kH = 1.0;
        const K1 = 0.045;
        const K2 = 0.015;
        const deg2rad = Math.PI / 180.0;
        const rad2deg = 180.0 / Math.PI;
        const deltaL = L2 - L1;
        const midL = (L1 + L2) / 2;
        const C1 = Math.sqrt(a1 * a1 + b1 * b1);
        const C2 = Math.sqrt(a2 * a2 + b2 * b2);
        const midC = (C1 + C2) / 2;
        const midC7 = midC ** 7;
        const midC7Root = Math.sqrt(midC7 / (midC7 + 25 ** 7));
        const a1t = a1 + 0.5 * a1 * (1 - midC7Root);
        const a2t = a2 + 0.5 * a2 * (1 - midC7Root);
        const C1t = Math.sqrt(a1t * a1t + b1 * b1);
        const C2t = Math.sqrt(a2t * a2t + b2 * b2);
        const midCt = (C1t + C2t) / 2;
        const deltaCt = C2t - C1t;
        const h1 = (b1 === 0 && a1t === 0) ? 0 : (Math.atan2(b1, a1t) * rad2deg) % 360;
        const h2 = (b2 === 0 && a2t === 0) ? 0 : (Math.atan2(b2, a2t) * rad2deg) % 360;
        let deltah = h2 - h1;
        const absDeltah = Math.abs(deltah);
        if (h2 <= h1 && absDeltah > 180) {
            deltah += 360;
        }
        if (h2 > h1 && absDeltah > 180) {
            deltah -= 360;
        }
        const deltaH = 2 * Math.sqrt(C1t * C2t) * Math.sin(0.5 * deltah * deg2rad);
        let H = (h1 + h2) / 2;
        if (absDeltah > 180 && h1 + h2 < 360) {
            H += 180;
        }
        if (absDeltah > 180 && h1 + h2 >= 360) {
            H -= 180;
        }
        const T = 1 - 0.17 * Math.cos((H - 30) * deg2rad)
            + 0.24 * Math.cos((2 * H) * deg2rad)
            + 0.32 * Math.cos((3 * H + 6) * deg2rad)
            - 0.20 * Math.cos((4 * H - 63) * deg2rad);
        const SL = 1 + (K2 * (midL - 50)) / (Math.sqrt(20 + (midL - 50) * (midL - 50)));
        const SC = 1 + K1 * midCt;
        const SH = 1 + K2 * midCt * T;
        const RT = -2 * midC7Root * Math.sin((60 * Math.exp(-((H - 275) / 25) * ((H - 275) / 25))) * deg2rad);
        const diff = Math.sqrt((deltaL / (kL * SL)) ** 2
            + (deltaCt / (kC * SC)) ** 2
            + (deltaH / (kH * SH)) ** 2
            + RT * (deltaCt / (kC * SC)) * (deltaH / (kH * SH)));
        return diff;
    }
    /**
     * Computes the distance to a=b=0 in the AB-subspace.
     */
    distanceToGray() {
        return Math.sqrt(this.a * this.a + this.b * this.b);
    }
    /**
     * Return a copy of color values in array format as [l, a, b].
     */
    toArray() {
        // copy
        return this.values.map((v) => v);
    }
    /**
     * Trasforms color to the XYZ format.
     */
    toXYZ() {
        let y = (this.l * 100 + 16) / 116;
        let x = this.a / 5 + y;
        let z = y - this.b / 2;
        [x, y, z] = [x, y, z].map((v) => {
            const v3 = v * v * v;
            return (v3 > 0.008856451) ? v3 : (v - 16 / 116) / 7.787037;
        });
        return new XYZColor_1.XYZColor(x * XYZColor_1.XYZColor.D65.x, y * XYZColor_1.XYZColor.D65.y, z * XYZColor_1.XYZColor.D65.z);
    }
    /**
     * Trasforms color to the RGB format.
     */
    toRGB() {
        return this.toXYZ().toRGB();
    }
    /**
     * Trasforms color to the sRGB format.
     */
    toSRGB() {
        return this.toXYZ().toRGB().toSRGB();
    }
}
exports.LABColor = LABColor;
//# sourceMappingURL=LABColor.js.map