"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a rect object
 */
class Rect {
    /**
     * Creates a new rect based on extracting specific properties from any provided object
     * @param data - An `IRect` object with `width` and `height` numeric properties
     * @returns A new `Rect` object
     */
    static BuildFromJSON(data) {
        return new Rect(data.width, data.height);
    }
    /**
     * Creates a new `Rect` object with specified `width` and `height`
     * @param width - `width` of the new rect
     * @param height - `height` of the new rect
     */
    constructor(width, height) {
        this.width = 0;
        this.height = 0;
        this.resize(width, height);
    }
    /**
     * Resizes this rect to specified `width` and `height`
     * @param width - a new `width` for the rect
     * @param height - a new `height` for the rect
     */
    resize(width, height) {
        if (width >= 0 && height >= 0) {
            this.width = width;
            this.height = height;
        }
    }
    /**
     * Creates a copy of this rect
     * @returns A new `Rect` object with copied dimensions
     */
    copy() {
        return new Rect(this.width, this.height);
    }
    /**
     * Returns a string representation of the rect in the format `"[width, height]"`.
     * @returns A string representation of the rect
     */
    toString() {
        return `[${this.width.toString()}, ${this.height.toString()}]`;
    }
    /**
     * Returns a JSON representation of the rect
     * @returns An `IRect` object with `width` and `height` numeric properties.
     */
    toJSON() {
        return {
            width: this.width,
            height: this.height,
        };
    }
}
exports.Rect = Rect;
//# sourceMappingURL=Rect.js.map