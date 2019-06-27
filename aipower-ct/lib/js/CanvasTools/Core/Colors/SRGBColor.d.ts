import { HSLColor } from "./HSLColor";
import { XYZColor } from "./XYZColor";
import { LABColor } from "./LABColor";
import { RGBColor } from "./RGBColor";
/**
 * Represents the sRGB color space.
 */
export declare class SRGBColor {
    /**
     * Parses the hex-string representation of the RGB color.
     * @param hex - Color string in the format "#RGB" (#RGBA) or "#RRGGBB" (#RRGGBBAA).
     * @remarks Alpha value (if present) is ignored.
     */
    static ParseHex(hex: string): SRGBColor;
    /**
     * The red-component of the color.
     */
    readonly r: number;
    /**
     * The green-component of the color.
     */
    readonly g: number;
    /**
     * The blue-component of the color.
     */
    readonly b: number;
    /**
     * Array of color components as [r, g, b].
     */
    private values;
    /**
     * Creates new RGBColor
     * @param r - Red component in the range [0, 1].
     * @param g - Green component in the range [0, 1].
     * @param b - Blue component in the range [0, 1].
     */
    constructor(r: number, g: number, b: number);
    /**
     * Checks if the color values are in the range [0, 1].
     */
    isValidColor(): boolean;
    /**
     * Truncates the color values to the range [0, 1].
     */
    truncate(): SRGBColor;
    /**
     * Return a copy of color values in array format as [r, g, b].
     */
    toArray(): number[];
    /**
     * Composes the CSS color string using the rgb() or rgba() format.
     * @param alpha - The alpha value for rgba() format.
     */
    toCSSString(alpha?: number): string;
    /**
     * Composes the CSS color string using the "#RRGGBB" or "#RRGGBBAA" format.
     * @param alpha - The alpha value for the #RRGGBBAA format.
     */
    toHex(alpha?: number): string;
    /**
     * Trasforms color to the HSL format.
     */
    toHSL(): HSLColor;
    /**
     * Trasforms color to the XYZ format.
     */
    toXYZ(): XYZColor;
    /**
     * Convert sRGB-color values into linear RGB format
     */
    toRGB(): RGBColor;
    /**
     * Trasforms color to the CIE LAB format.
     */
    toLAB(): LABColor;
    /**
     * Internal helper function to map color values into [0, 255] range.
     */
    private to255;
    /**
     * Internal helper function to map color values into hex-format "FF".
     */
    private toFF;
}
