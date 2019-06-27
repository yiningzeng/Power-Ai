"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tag_1 = require("./Tag");
/**
 * Represents a composition of region tags
 */
class TagsDescriptor {
    /**
     * Creates a new `TagDescriptor` object based on extracting specific properties from any provided object
     * @remarks The `TagDescriptor` object is *immutable*. All public properties return copies of objects.
     * @param data - An `ITagDescriptor` object with the `primary` and `secondary`
     * properties implementing `ITag` and `ITag[]` interfaces
     * @returns A new `TagDescriptor` object
     */
    static BuildFromJSON(data) {
        let p = null;
        if (data.primary !== null && data.primary !== undefined) {
            p = Tag_1.Tag.BuildFromJSON(data.primary);
        }
        const s = (data.secondary === undefined) ? [] : data.secondary.map((tag) => Tag_1.Tag.BuildFromJSON(tag));
        return new TagsDescriptor(p, s);
    }
    /**
     * Returns an array of all tags (no order guaranteed). *Readonly*
     */
    get all() {
        return this.allTags.map((tag) => tag.copy());
    }
    /**
     * Returns the primary tag. *Readonly*
     */
    get primary() {
        if (this.primaryTag !== null) {
            return this.primaryTag.copy();
        }
        else {
            return null;
        }
    }
    /**
     * Returns an array of all secondary tags (no order guaranteed). *Readonly*
     */
    get secondary() {
        if (this.primaryTag !== null) {
            return this.all.filter((tag) => {
                return (tag.name !== this.primary.name);
            });
        }
        else {
            return this.all;
        }
    }
    /**
     * Creates a new `TagDescriptor` object with specified tags
     * @param primaryTag - Primary `Tag` for the descriptor
     * @param secondaryTags - An array of secondary tags (optional)
     */
    constructor(arg1, arg2 = []) {
        // empty TagsDescriptor
        if (arg1 === undefined) {
            this.primaryTag = null;
            this.allTags = [];
        }
        else if (arg1 instanceof Tag_1.Tag) {
            // arg1 = primaryTag, arg2 = secondaryTag
            if (arg2 instanceof Array) {
                this.allTags = new Array(arg1, ...arg2);
            }
            else {
                this.allTags = [arg1];
            }
            this.primaryTag = arg1;
        }
        else if (arg1 instanceof Array) {
            // arg1 = tags, ignore arg2
            this.allTags = arg1.map((tag) => tag.copy());
            if (arg1.length > 0) {
                this.primaryTag = arg1[0];
            }
            else {
                this.primaryTag = null;
            }
        }
        else if (arg1 === null) {
            // arg1 = null | undefined, ignore
            if (arg2 instanceof Array) {
                this.allTags = arg2.map((tag) => tag.copy());
            }
            else {
                this.allTags = [];
            }
            this.primaryTag = null;
        }
    }
    /**
     * Returns a string with a comma separated list of tags with primary tag first (if present)
     */
    toString() {
        let str = "";
        if (this.primaryTag !== null) {
            str += this.primaryTag.name;
            this.secondary.forEach((tag) => {
                str += ", " + tag.name;
            });
        }
        else {
            this.secondary.forEach((tag) => {
                str += ", " + tag.name;
            });
            str = str.substring(2, str.length);
        }
        return str;
    }
    /**
     * Returns an `ITagsDescriptor` object with `primary` and `secondary` properties
     */
    toJSON() {
        if (this.primaryTag !== null) {
            return {
                primary: this.primaryTag.toJSON(),
                secondary: this.secondary.map((tag) => tag.toJSON()),
            };
        }
        else {
            return {
                primary: null,
                secondary: this.secondary.map((tag) => tag.toJSON()),
            };
        }
    }
}
exports.TagsDescriptor = TagsDescriptor;
//# sourceMappingURL=TagsDescriptor.js.map