import { XYZColor } from "./XYZColor";
import { LABColor } from "./LABColor";
import { SRGBColor } from "./SRGBColor";
/**
 * Represents the RGB color space.
 */
export declare class RGBColor {
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
     * Return a copy of color values in array format as [r, g, b].
     */
    toArray(): number[];
    /**
     * Trasforms color to the XYZ format.
     */
    toXYZ(): XYZColor;
    /**
     * Trasforms color to the sRGB values.
     */
    toSRGB(): SRGBColor;
    /**
     * Trasforms color to the CIE LAB format.
     */
    toLAB(): LABColor;
}
