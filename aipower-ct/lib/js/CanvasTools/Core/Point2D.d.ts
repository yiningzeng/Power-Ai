import { IBoundable } from "../Interface/IBoundable";
import { IMovable } from "../Interface/IMovable";
import { IPoint2D } from "../Interface/IPoint2D";
import { IRect } from "../Interface/IRect";
/**
 * Represents a 2d point object
 */
export declare class Point2D implements IMovable, IBoundable<Point2D> {
    /**
     * Creates a new point based on extracting specific properties from any provided object
     * @param data - An `IPoint` object with `x` and `y` numeric properties
     * @returns A new `Point2D` object
     */
    static BuildFromJSON(data: IPoint2D): Point2D;
    /**
     * `x`-coordinate of the point
     */
    x: number;
    /**
     * `y`-coordinate of the point
     */
    y: number;
    /**
     * Creates a new `Point2D` object from `x` and `y` coordinates
     * @param x - `x`-coordinate of the point
     * @param y - `y`-coordinate of the point
     */
    constructor(x: number, y: number);
    /**
     * Creates a new Point2D object from other `IPoint2D` object
     * @param p - an object implementing `IPoint2D`, which location will be copied
     */
    constructor(p: IPoint2D);
    /**
     * Moves point to the specified location
     * @param x - the new `x`-coordinate
     * @param y - a new `y`-coordinate
     */
    move(x: number, y: number): void;
    /**
     * Moves point to the location of specified object
     * @param point - an object implementing `IPoint2D`, which location will be used as reference
     */
    move(point: IPoint2D): void;
    /**
     * Shifts point location to specified delta
     * @param dx - Delta to be added to the `x`-coordinate
     * @param dy - Delta to be added to the `y`-coordinate
     */
    shift(dx: number, dy: number): void;
    /**
     * Returns a new point created from bounding this one to the `Rect` object rovided
     * @remarks This method bounds the point to the rect with coordinates `[0, 0] x [r.width, r.height]`.
     * @param r - A bounding box
     * @returns A new `Point2D` object, with coordinates bounded to the box
     */
    boundToRect(r: IRect): Point2D;
    /**
     * Calculates the square of the distance between two points
     * @param p - Second point
     * @returns The square of the distance
     */
    squareDistanceToPoint(p: Point2D): number;
    /**
     * Calculates the square of the distance from this point to a line segment
     * @param p1 - The first line segment point
     * @param p2 - The second line segment point
     * @returns The square of the distance
     */
    squareDistanceToLine(p1: Point2D, p2: Point2D): number;
    /**
     * Creates a copy of this point
     * @returns A new `Point2D` object with copied coordinates
     */
    copy(): Point2D;
    /**
     * Returns a string representation of the point in the format `"{x, y}"`.
     * @returns A string representation of the point
     */
    toString(): string;
    /**
     * Returns a JSON representation of the point
     * @returns An `IPoint` object with `x` and `y` numeric properties.
     */
    toJSON(): IPoint2D;
}
