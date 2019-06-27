import { RGBColor } from "./RGBColor";
import { SRGBColor } from "./SRGBColor";
import { XYZColor } from "./XYZColor";
import { LABColor } from "./LABColor";
import { HSLColor } from "./HSLColor";
/**
 * A wrapper `Color` class to represent various color formats
 * and manage conversions between them.
 * @remarks The current work on defining color management in web (including conversion algorithms)
 * can be tracked in this draft: https://drafts.csswg.org/css-color/
 */
export declare class Color {
    readonly sRGB: SRGBColor;
    readonly RGB: RGBColor;
    readonly XYZ: XYZColor;
    readonly LAB: LABColor;
    readonly HSL: HSLColor;
    private srgbColor;
    private rgbColor;
    private xyzColor;
    private labColor;
    private hslColor;
    constructor(srgb: SRGBColor);
    constructor(rgb: RGBColor);
    constructor(hsl: HSLColor);
    constructor(xyz: XYZColor);
    constructor(lab: LABColor);
    constructor(srgbCSSString: string);
    constructor(r: number, g: number, b: number);
}
