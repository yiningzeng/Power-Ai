import { Tag } from "./Tag";
import { ITagsDescriptor } from "../Interface/ITagsDescriptor";
/**
 * Represents a composition of region tags
 */
export declare class TagsDescriptor {
    /**
     * Creates a new `TagDescriptor` object based on extracting specific properties from any provided object
     * @remarks The `TagDescriptor` object is *immutable*. All public properties return copies of objects.
     * @param data - An `ITagDescriptor` object with the `primary` and `secondary`
     * properties implementing `ITag` and `ITag[]` interfaces
     * @returns A new `TagDescriptor` object
     */
    static BuildFromJSON(data: ITagsDescriptor): TagsDescriptor;
    private allTags;
    private primaryTag;
    /**
     * Returns an array of all tags (no order guaranteed). *Readonly*
     */
    readonly all: Tag[];
    /**
     * Returns the primary tag. *Readonly*
     */
    readonly primary: Tag;
    /**
     * Returns an array of all secondary tags (no order guaranteed). *Readonly*
     */
    readonly secondary: Tag[];
    /**
     * Creates a new  empty`TagDescriptor` object
     */
    constructor();
    /**
     * Creates a new `TagDescriptor` object with specified tags
     * @param tags - A tags array with the `tags[0]` used as `primaryTag`
     */
    constructor(tags: Tag[]);
    constructor(primaryTag: Tag, secondaryTags: Tag[]);
    /**
     * Returns a string with a comma separated list of tags with primary tag first (if present)
     */
    toString(): string;
    /**
     * Returns an `ITagsDescriptor` object with `primary` and `secondary` properties
     */
    toJSON(): ITagsDescriptor;
}
