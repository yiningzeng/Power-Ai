import { RegionDataType } from "../Core/RegionData";
import { IPoint2D } from "./IPoint2D";
import { IRect } from "./IRect";
/**
 * Represents the state of a region
 */
export interface IRegionData extends IPoint2D, IRect {
    /**
     * The `x`-coordinate of the region.
     */
    x: number;
    /**
     * The `y`-coordinate of the region.
     */
    y: number;
    /**
     * The `width` of the region.
     */
    width: number;
    /**
     * The `height` of the region.
     */
    height: number;
    /**
     * The array of region points.
     */
    points: IPoint2D[];
    /**
     * The type of the region.
     */
    type: RegionDataType;
}
