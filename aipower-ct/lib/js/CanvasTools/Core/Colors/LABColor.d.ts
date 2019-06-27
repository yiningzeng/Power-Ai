import { RGBColor } from "./RGBColor";
import { SRGBColor } from "./SRGBColor";
import { XYZColor } from "./XYZColor";
/**
 * The AB-subspace for the LAB color space.
 */
export interface ILabColorPoint {
    a: number;
    b: number;
}
/**
 * Represents the CIE LAB color space.
 */
export declare class LABColor implements ILabColorPoint {
    /**
     * The lightness value of the color.
     */
    readonly l: number;
    /**
     * The a-component of the color (green to red).
     */
    readonly a: number;
    /**
     * The b-component of the color (blue to yellow).
     */
    readonly b: number;
    /**
     * Array of color components as [l, a, b].
     */
    private values;
    /**
     * Creates new CIE LAB color.
     * @param l - Lightness component in the range [0, 1].
     * @param a - A-component in the range [0, 1].
     * @param b - B-component in the range [0, 1].
     */
    constructor(l: number, a: number, b: number);
    /**
     * Computes color difference using the CIE94 formula as defined here:
     * https://en.wikipedia.org/wiki/Color_difference.
     * @remarks It is better to use the CIE DE2000 formula, but it requires significantly more computations.
     * E.g., check this reveiw: http://www.color.org/events/colorimetry/Melgosa_CIEDE2000_Workshop-July4.pdf.
     * @param color - A color to compare.
     * @returns The distance between this and provided colors.
     */
    distanceTo(color: LABColor): number;
    distanceTo_00(color: LABColor): number;
    /**
     * Computes the distance to a=b=0 in the AB-subspace.
     */
    distanceToGray(): number;
    /**
     * Return a copy of color values in array format as [l, a, b].
     */
    toArray(): number[];
    /**
     * Trasforms color to the XYZ format.
     */
    toXYZ(): XYZColor;
    /**
     * Trasforms color to the RGB format.
     */
    toRGB(): RGBColor;
    /**
     * Trasforms color to the sRGB format.
     */
    toSRGB(): SRGBColor;
}
