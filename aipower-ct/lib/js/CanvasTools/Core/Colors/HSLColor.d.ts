import { SRGBColor } from "./SRGBColor";
/**
 * Represents the HSL color space.
 */
export declare class HSLColor {
    /**
     * The hue value of the color.
     */
    readonly h: number;
    /**
     * The saturation value of the color.
     */
    readonly s: number;
    /**
     * The lightness value of the color.
     */
    readonly l: number;
    /**
     * Array of color components as [h, s, l].
     */
    private values;
    /**
     * Creates new HSLColor
     * @param h - Hue component in the range [0, 1].
     * @param s - Saturation component in the range [0, 1].
     * @param l - Lightness component in the range [0, 1].
     */
    constructor(h: number, s: number, l: number);
    /**
     * Return a copy of color values in array format as [h, s, l].
     */
    toArray(): number[];
    /**
     * Return an array of color values mapped to the ranges used in CSS:
     * hue - [0, 360]
     * saturation - [0, 100] %
     * lightness - [0, 100] %
     */
    toCSSValues(): number[];
    /**
     * Composes the CSS color string using the hsl() or hsla() format.
     * @param alpha - The alpha value for hsla() format.
     */
    toCSSString(alpha?: number): string;
    /**
     * Trasforms color to the RGB format.
     */
    toSRGB(): SRGBColor;
    /**
     * Internal helper function for the `toRGB` method.
     */
    private hue2rgb;
}
