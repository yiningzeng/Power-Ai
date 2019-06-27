"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SRGBColor_1 = require("./SRGBColor");
/**
 * Represents the HSL color space.
 */
class HSLColor {
    /**
     * The hue value of the color.
     */
    get h() {
        return this.values[0];
    }
    /**
     * The saturation value of the color.
     */
    get s() {
        return this.values[1];
    }
    /**
     * The lightness value of the color.
     */
    get l() {
        return this.values[2];
    }
    /**
     * Creates new HSLColor
     * @param h - Hue component in the range [0, 1].
     * @param s - Saturation component in the range [0, 1].
     * @param l - Lightness component in the range [0, 1].
     */
    constructor(h, s, l) {
        this.values = [h, s, l];
    }
    /**
     * Return a copy of color values in array format as [h, s, l].
     */
    toArray() {
        // copy
        return this.values.map((v) => v);
    }
    /**
     * Return an array of color values mapped to the ranges used in CSS:
     * hue - [0, 360]
     * saturation - [0, 100] %
     * lightness - [0, 100] %
     */
    toCSSValues() {
        return [this.h * 360, this.s * 100, this.l * 100];
    }
    /**
     * Composes the CSS color string using the hsl() or hsla() format.
     * @param alpha - The alpha value for hsla() format.
     */
    toCSSString(alpha) {
        const [h, s, l] = this.toCSSValues();
        if (alpha !== undefined) {
            // cast to [0, 1]
            alpha = Math.min(1, Math.max(0, alpha));
            return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
        }
        else {
            return `hsl(${h}, ${s}%, ${l}%)`;
        }
    }
    /**
     * Trasforms color to the RGB format.
     */
    toSRGB() {
        /* https://www.w3.org/TR/css-color-3/
        HOW TO RETURN hsl.to.rgb(h, s, l):
            SELECT:
                l<=0.5: PUT l*(s+1) IN m2
                ELSE: PUT l+s-l*s IN m2
            PUT l*2-m2 IN m1
            PUT hue.to.rgb(m1, m2, h+1/3) IN r
            PUT hue.to.rgb(m1, m2, h    ) IN g
            PUT hue.to.rgb(m1, m2, h-1/3) IN b
            RETURN (r, g, b)
        */
        let m1;
        let m2;
        const [h, s, l] = this.values;
        if (l <= 0.5) {
            m2 = l * (s + 1);
        }
        else {
            m2 = l + s - l * s;
        }
        m1 = l * 2 - m2;
        const r = this.hue2rgb(m1, m2, h + 1 / 3);
        const g = this.hue2rgb(m1, m2, h);
        const b = this.hue2rgb(m1, m2, h - 1 / 3);
        return new SRGBColor_1.SRGBColor(r, g, b);
    }
    /**
     * Internal helper function for the `toRGB` method.
     */
    hue2rgb(m1, m2, h) {
        /* https://www.w3.org/TR/css-color-3/
        HOW TO RETURN hue.to.rgb(m1, m2, h):
            IF h<0: PUT h+1 IN h
            IF h>1: PUT h-1 IN h
            IF h*6<1: RETURN m1+(m2-m1)*h*6
            IF h*2<1: RETURN m2
            IF h*3<2: RETURN m1+(m2-m1)*(2/3-h)*6
            RETURN m1
       */
        if (h < 0) {
            h = h + 1;
        }
        if (h > 1) {
            h = h - 1;
        }
        if (h * 6 < 1) {
            return m1 + (m2 - m1) * h * 6;
        }
        else if (h * 2 < 1) {
            return m2;
        }
        else if (h * 3 < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        }
        else {
            return m1;
        }
    }
}
exports.HSLColor = HSLColor;
//# sourceMappingURL=HSLColor.js.map