"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HSLColor_1 = require("./HSLColor");
const RGBColor_1 = require("./RGBColor");
/**
 * Represents the sRGB color space.
 */
class SRGBColor {
    /**
     * Parses the hex-string representation of the RGB color.
     * @param hex - Color string in the format "#RGB" (#RGBA) or "#RRGGBB" (#RRGGBBAA).
     * @remarks Alpha value (if present) is ignored.
     */
    static ParseHex(hex) {
        const isValidColor = /#([a-f0-9]{3,4}){1,2}\b/i.test(hex);
        if (!isValidColor) {
            throw new Error(`Invalid CSS RGB color: ${hex}`);
        }
        let r;
        let g;
        let b;
        if (hex.length === 7 || hex.length === 9) {
            r = parseInt(hex.substring(1, 3), 16) / 255;
            g = parseInt(hex.substring(3, 5), 16) / 255;
            b = parseInt(hex.substring(5, 7), 16) / 255;
        }
        else if (hex.length === 4 || hex.length === 5) {
            r = parseInt(hex.charAt(1), 16) / 16;
            g = parseInt(hex.charAt(2), 16) / 16;
            b = parseInt(hex.charAt(3), 16) / 16;
        }
        return new SRGBColor(r, g, b);
    }
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
     * Checks if the color values are in the range [0, 1].
     */
    isValidColor() {
        return (this.r >= 0) && (this.r <= 1) &&
            (this.g >= 0) && (this.g <= 1) &&
            (this.b >= 0) && (this.b <= 1);
    }
    /**
     * Truncates the color values to the range [0, 1].
     */
    truncate() {
        return new SRGBColor(Math.min(1, Math.max(0, this.r)), Math.min(1, Math.max(0, this.g)), Math.min(1, Math.max(0, this.b)));
    }
    /**
     * Return a copy of color values in array format as [r, g, b].
     */
    toArray() {
        // copy
        return this.values.map((v) => v);
    }
    /**
     * Composes the CSS color string using the rgb() or rgba() format.
     * @param alpha - The alpha value for rgba() format.
     */
    toCSSString(alpha) {
        const [r, g, b] = this.to255();
        if (alpha !== undefined) {
            // cast to [0, 1]
            alpha = Math.min(1, Math.max(0, alpha));
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        else {
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
    /**
     * Composes the CSS color string using the "#RRGGBB" or "#RRGGBBAA" format.
     * @param alpha - The alpha value for the #RRGGBBAA format.
     */
    toHex(alpha) {
        const [r, g, b] = this.toFF();
        if (alpha !== undefined) {
            // cast to [0, 1]
            alpha = Math.min(1, Math.max(0, alpha));
            const alphaFF = Math.round(alpha * 255).toString(16);
            return `#${r}${g}${b}${alphaFF}`;
        }
        else {
            return `#${r}${g}${b}`;
        }
    }
    /**
     * Trasforms color to the HSL format.
     */
    toHSL() {
        const [r, g, b] = this.values;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;
        let s;
        const l = (max + min) / 2;
        if (max === min) {
            h = 0;
            s = 0;
        }
        else {
            const d = max - min;
            s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return new HSLColor_1.HSLColor(h, s, l);
    }
    /**
     * Trasforms color to the XYZ format.
     */
    toXYZ() {
        return this.toRGB().toXYZ();
    }
    /**
     * Convert sRGB-color values into linear RGB format
     */
    toRGB() {
        const [r, g, b] = this.values.map((v) => {
            if (v < 0.04045) {
                return v / 12.92;
            }
            else {
                return ((v + 0.055) / 1.055) ** 2.4;
            }
        });
        return new RGBColor_1.RGBColor(r, g, b);
    }
    /**
     * Trasforms color to the CIE LAB format.
     */
    toLAB() {
        return this.toRGB().toXYZ().toLAB();
    }
    /**
     * Internal helper function to map color values into [0, 255] range.
     */
    to255() {
        const rgb = this.truncate();
        return rgb.values.map((v) => Math.round(255 * v));
    }
    /**
     * Internal helper function to map color values into hex-format "FF".
     */
    toFF() {
        const rgb = this.truncate();
        return rgb.values.map((v) => Math.round(255 * v).toString(16).padStart(2, "0"));
    }
}
exports.SRGBColor = SRGBColor;
//# sourceMappingURL=SRGBColor.js.map