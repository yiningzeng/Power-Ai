import { ITag } from "../Interface/ITag";
import { Color } from "../Core/Colors/Color";
/**
 * Represents meta-data for a tag
 * @remarks
 * 1. To represent the color Tag class uses only the hue component
 * and generates a number of color variations based on that value.
 * 2. The `Tag` object is *immutable*, all public properties are readonly.
 */
export declare class Tag implements ITag {
    /**
     * Creates a new tag based on extracting specific properties from any provided object
     * @param data - An `ITag` object with `name`, `colorHue` and `id` properties
     * @returns A new `Tag` object
     */
    static BuildFromJSON(data: ITag): Tag;
    /**
     * Extracts the hue component from a provided CSS color string
     * @param color - A CSS-color in "#RRGGBB" or "#RGB" format
     * @returns A hue value for provided color
     * @deprecated Use the Color class instead.
     */
    static getHueFromColor(color: string): number;
    private tagName;
    private tagID;
    /**
     * The hue-value of the tag's color. *Readonly*
     */
    readonly colorHue: number;
    /**
     * The tag's color in hex format. *Readonly*
     */
    readonly color: string;
    /**
     * The `name` of the tag. *Readonly*
     */
    readonly name: string;
    /**
     * The `id` of the tag. *Readonly*
     */
    readonly id: string;
    private tagColorPure;
    private tagColorAccent;
    private tagColorHighlight;
    private tagColorShadow;
    private tagColorNoColor;
    private tagColorDark;
    private colorObj;
    /**
     * Returns the pure color variation of the tag's color
     * @returns String hsl(H, 100%, 50%)
     */
    readonly colorPure: string;
    /**
     * Returns the accent color variation of the tag's color.
     * Accent = almost pure, alpha = 0.8.
     * @returns Hex string for the color
     */
    readonly colorAccent: string;
    /**
     * Returns the highlight color variation of the tag's color.
     * Highlight = grayed pure, alpha = 0.4
     * @returns Hex string for the color
     */
    readonly colorHighlight: string;
    /**
     * Returns the shadow color variation of the tag's color
     * Shadow = grayed pure, alpha = 0.2
     * @returns Hex string for the color
     */
    readonly colorShadow: string;
    /**
     * Returns the dark color variation of the tag's color.
     * Dark = pure with decreased lightness and grayed.
     * @returns Hex string for the color
     */
    readonly colorDark: string;
    /**
     * Returns the fully transparent color variation of the tag's color
     * @returns Hex string for the color
     */
    readonly colorNoColor: string;
    /**
     * Creates a new `Tag` object with specified `name`, `colorHue` and `id`
     * @param name - `name` of the new tag
     * @param colorHue - `colorHue` of the new tag
     * @param id - `id` of the new tag (optional, by default is "")
     * @deprecated Use the `Color` class instead.
     */
    constructor(name: string, colorHue: number, id?: string);
    /**
     * Creates a new `Tag` object with specified `name`, hue value of `cssColor` and `id`
     * @param name - `name` of the new tag
     * @param cssColor - CSS color (e.g. #FF03A3) for the new tag, *only hue value of the color will be used*
     * @param id - `id` of the new tag (optional, by default is "")
     */
    constructor(name: string, cssColor: string, id?: string);
    /**
     * Creates a new `Tag` object with specified `name`, hue value of `cssColor` and `id`
     * @param name - `name` of the new tag
     * @param color - The `Color` object.
     * @param id - `id` of the new tag (optional, by default is "")
     */
    constructor(name: string, color: Color, id?: string);
    /**
     * Creates a copy of this tag
     * @returns A new `Tag` object with copied properties
     */
    copy(): Tag;
    /**
     * Returns a JSON representation of the tag
     * @returns An `ITag` object with `name`, `colorHue` and `id` properties
     */
    toJSON(): ITag;
}
