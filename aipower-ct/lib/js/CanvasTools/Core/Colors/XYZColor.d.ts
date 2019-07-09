import { RGBColor } from "./RGBColor";
import { SRGBColor } from "./SRGBColor";
import { LABColor } from "./LABColor";
/**
 * Represents the CIE XYZ color space.
 */
export declare class XYZColor {
    /**
     * The D65 white point vector.
     */
    static D65: XYZColor;
    /**
     * The D50 white point vector.
     */
    static D50: XYZColor;
    /**
     * The x-component of the color.
     */
    readonly x: number;
    /**
     * The y-component of the color.
     */
    readonly y: number;
    /**
     * The z-component of the color.
     */
    readonly z: number;
    /**
     * Array of color components as [x, y, z].
     */
    private values;
    /**
     * Creates new XYZ color.
     * @param x - x-component in the range [0, 1].
     * @param y - y-component in the range [0, 1].
     * @param z - z-component in the range [0, 1].
     */
    constructor(x: number, y: number, z: number);
    /**
     * Return a copy of color values in array format as [x, y, z].
     */
    toArray(): number[];
    /**
     * Trasforms color to the RGB format.
     */
    toRGB(): RGBColor;
    /**
     * Trasforms color to the sRGB format.
     */
    toSRGB(): SRGBColor;
    /**
     * Trasforms color to the CIE LAB format.
     */
    toLAB(): LABColor;
}
