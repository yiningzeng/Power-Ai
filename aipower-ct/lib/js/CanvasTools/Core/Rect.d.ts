import { IRect } from "../Interface/IRect";
import { IResizable } from "../Interface/IResizable";
/**
 * Represents a rect object
 */
export declare class Rect implements IResizable {
    /**
     * Creates a new rect based on extracting specific properties from any provided object
     * @param data - An `IRect` object with `width` and `height` numeric properties
     * @returns A new `Rect` object
     */
    static BuildFromJSON(data: IRect): Rect;
    /**
     * `width` of the rect
     */
    width: number;
    /**
     * `height` of the rect
     */
    height: number;
    /**
     * Creates a new `Rect` object with specified `width` and `height`
     * @param width - `width` of the new rect
     * @param height - `height` of the new rect
     */
    constructor(width: number, height: number);
    /**
     * Resizes this rect to specified `width` and `height`
     * @param width - a new `width` for the rect
     * @param height - a new `height` for the rect
     */
    resize(width: number, height: number): void;
    /**
     * Creates a copy of this rect
     * @returns A new `Rect` object with copied dimensions
     */
    copy(): Rect;
    /**
     * Returns a string representation of the rect in the format `"[width, height]"`.
     * @returns A string representation of the rect
     */
    toString(): string;
    /**
     * Returns a JSON representation of the rect
     * @returns An `IRect` object with `width` and `height` numeric properties.
     */
    toJSON(): IRect;
}
