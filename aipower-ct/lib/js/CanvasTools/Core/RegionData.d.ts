import { IMovable } from "../Interface/IMovable";
import { IRegionData } from "../Interface/IRegionData";
import { IResizable } from "../Interface/IResizable";
import { IRect } from "../Interface/IRect";
import { Point2D } from "./Point2D";
import { Rect } from "./Rect";
import { IPoint2D } from "../Interface/IPoint2D";
/**
 * Defines supported region types.
 */
export declare enum RegionDataType {
    Point = "point",
    Rect = "rect",
    Polyline = "polyline",
    Polygon = "polygon"
}
/**
 * Represents region meta-data, including position, size, points and type
 */
export declare class RegionData implements IRegionData, IMovable, IResizable {
    /**
     * Creates a new `RegionData` object with `point`-type at provided `x`, `y` coordinates
     * @param x - `x`-coordinate
     * @param y - `y`-coordinate
     * @returns A new `RegionData` object
     */
    static BuildPointRegionData(x: number, y: number): RegionData;
    /**
     * Creates a new `RegionData` object with `rect`-type at provided `x`, `y`
     * coordinates and of provided `width` and `height`
     * @param x - `x`-coordinate
     * @param y - `y`-coordinate
     * @param width - `width` of the rect
     * @param height - `height` of the rect
     * @returns A new `RegionData` object
     */
    static BuildRectRegionData(x: number, y: number, width: number, height: number): RegionData;
    /**
     * Creates a new `RegionData` object based on extracting specific properties from any provided object
     * @param data - An `IRegionData` object with `x`, `y`, `width`, `height`, `points` and `type` properties
     * @returns A new `RegionData` object
     */
    static BuildFromJson(data: IRegionData): RegionData;
    /**
     * Gets the `x`-coordinate of the region
     */
    /**
    * Sets the `x`-coordinate of the region. *Region points position will be recalculated*
    */
    x: number;
    /**
     * Gets the `y`-coordinate of the region
     */
    /**
    * Sets the `y`-coordinate of the region. *Region points position will be recalculated*
    */
    y: number;
    /**
     * Gets the `width` of the region
     */
    /**
    * Sets the `width` of the region. *Region points position will be recalculated*
    */
    width: number;
    /**
     * Gets the `height` of the region
     */
    /**
    * Sets the `height` of the region. *Region points position will be recalculated*
    */
    height: number;
    /**
     * Returns the area of the region. *Point has area = 1.0, for other types it is `width * height`*
     */
    readonly area: number;
    /**
     * Gets the bounding box size of the region
     */
    /**
    * Sets the bounding box size of the region. *Region will be resized automatically*
    */
    boundRect: Rect;
    /**
     * Gets the array of region points.
     */
    /**
    * Sets the array of region points. *Region will be resized and repositioned automatically*
    */
    points: Point2D[];
    /**
     * Gets the type of the region
     */
    readonly type: RegionDataType;
    protected corner: Point2D;
    protected regionRect: Rect;
    protected regionPoints: Point2D[];
    protected regionType: RegionDataType;
    /**
     * Creates a new `RegionData` object
     * @param x - `x`-coordinate of the region
     * @param y - `y`-coordinate of the region
     * @param width - `width` of the region
     * @param height - `height` of the region
     * @param points - Collection of internal region points
     * @param type - `type` of the region from enum `RegionDataType`
     */
    constructor(x: number, y: number, width: number, height: number, points?: Point2D[], type?: RegionDataType);
    /**
     * Moves the region to the position of an `IPoint2D` object
     * @param point - `IPoint2D` object to use as position source
     */
    move(point: IPoint2D): void;
    /**
     * Moves the region to specified coordinates
     * @param x - New `x`-coordinate
     * @param y - New `y`-coordinate
     */
    move(x: number, y: number): void;
    /**
     * Resizes regions to specified dimensions
     * @param width - New `width` of the region
     * @param height - New `height` of the region
     */
    resize(width: number, height: number): void;
    /**
     * Changes the `point` at specified `index`
     * @param point - New `point` value
     * @param index - `index` of the point in internal collection
     */
    setPoint(point: IPoint2D, index: number): void;
    /**
     * Updates the collection of internal points
     * @param points - `IPoint2D[]` collection for the region to serve as the source for the
     * internal *copy* in the `points` collection
     */
    setPoints(points: IPoint2D[]): void;
    /**
     * Inits this region properties from another `IRegionData` object
     * @param regionData - An `IRegionData` object to serve as the source for the property values
     */
    initFrom(regionData: IRegionData): void;
    /**
     * Returns a new `RegionData` object with all coordinates and dimensions bounded to specified box
     * @param rect - The `IRect` box, which `width` and `height` will be used for bounding
     * @returns A new `RegionData` object
     */
    boundToRect(rect: IRect): RegionData;
    /**
     * Scale region coordinates, points and size by `xfactor` and `yfactor`
     * @param xfactor - Horizontal scaling factor
     * @param yfactor - Vertical scaling factor
     */
    scale(xfactor: number, yfactor: number): void;
    /**
     * Scale region coordinates, points and size by `factor`
     * @param factor - Horizontal & vertical scaling factor
     */
    scale(factor: number): void;
    /**
     * Creates a copy of this region data
     * @returns A new `RegionData` object with copied properties
     */
    copy(): RegionData;
    /**
     * Returns a string representation of the region in the format
     * `"{x, y} x [width, height]: {{x1, y1}, ..., {xn, yn}}"`.
     * @returns A string representation of the rect
     */
    toString(): string;
    /**
     * Returns a JSON representation of the region
     * @returns An `IRegionData` object with properties only.
     */
    toJSON(): IRegionData;
}
