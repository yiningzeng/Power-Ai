"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = require("./Point2D");
const Rect_1 = require("./Rect");
/**
 * Defines supported region types.
 */
var RegionDataType;
(function (RegionDataType) {
    RegionDataType["Point"] = "point";
    RegionDataType["Rect"] = "rect";
    RegionDataType["Polyline"] = "polyline";
    RegionDataType["Polygon"] = "polygon";
})(RegionDataType = exports.RegionDataType || (exports.RegionDataType = {}));
/**
 * Represents region meta-data, including position, size, points and type
 */
class RegionData {
    /**
     * Creates a new `RegionData` object with `point`-type at provided `x`, `y` coordinates
     * @param x - `x`-coordinate
     * @param y - `y`-coordinate
     * @returns A new `RegionData` object
     */
    static BuildPointRegionData(x, y) {
        return new RegionData(x, y, 0, 0, [new Point2D_1.Point2D(x, y)], RegionDataType.Point);
    }
    /**
     * Creates a new `RegionData` object with `rect`-type at provided `x`, `y`
     * coordinates and of provided `width` and `height`
     * @param x - `x`-coordinate
     * @param y - `y`-coordinate
     * @param width - `width` of the rect
     * @param height - `height` of the rect
     * @returns A new `RegionData` object
     */
    static BuildRectRegionData(x, y, width, height) {
        return new RegionData(x, y, width, height, [new Point2D_1.Point2D(x, y), new Point2D_1.Point2D(x + width, y),
            new Point2D_1.Point2D(x + width, y + height), new Point2D_1.Point2D(x, y + height)], RegionDataType.Rect);
    }
    /**
     * Creates a new `RegionData` object based on extracting specific properties from any provided object
     * @param data - An `IRegionData` object with `x`, `y`, `width`, `height`, `points` and `type` properties
     * @returns A new `RegionData` object
     */
    static BuildFromJson(data) {
        return new RegionData(data.x, data.y, data.width, data.height, data.points.map((p) => new Point2D_1.Point2D(p.x, p.y)), data.type);
    }
    /**
     * Gets the `x`-coordinate of the region
     */
    get x() {
        return this.corner.x;
    }
    /**
     * Sets the `x`-coordinate of the region. *Region points position will be recalculated*
     */
    set x(x) {
        this.move(x, this.y);
    }
    /**
     * Gets the `y`-coordinate of the region
     */
    get y() {
        return this.corner.y;
    }
    /**
     * Sets the `y`-coordinate of the region. *Region points position will be recalculated*
     */
    set y(y) {
        this.move(this.x, y);
    }
    /**
     * Gets the `width` of the region
     */
    get width() {
        return this.regionRect.width;
    }
    /**
     * Sets the `width` of the region. *Region points position will be recalculated*
     */
    set width(width) {
        this.resize(width, this.height);
    }
    /**
     * Gets the `height` of the region
     */
    get height() {
        return this.regionRect.height;
    }
    /**
     * Sets the `height` of the region. *Region points position will be recalculated*
     */
    set height(height) {
        this.resize(this.width, height);
    }
    /**
     * Returns the area of the region. *Point has area = 1.0, for other types it is `width * height`*
     */
    get area() {
        let area;
        if (this.regionType === RegionDataType.Point) {
            area = 1.0;
        }
        else {
            area = this.regionRect.width * this.regionRect.height;
        }
        return area;
    }
    /**
     * Gets the bounding box size of the region
     */
    get boundRect() {
        return this.regionRect.copy();
    }
    /**
     * Sets the bounding box size of the region. *Region will be resized automatically*
     */
    set boundRect(rect) {
        this.resize(rect.width, rect.height);
    }
    /**
     * Gets the array of region points.
     */
    get points() {
        return this.regionPoints.map((p) => p.copy());
    }
    /**
     * Sets the array of region points. *Region will be resized and repositioned automatically*
     */
    set points(points) {
        this.setPoints(points);
    }
    /**
     * Gets the type of the region
     */
    get type() {
        return this.regionType;
    }
    /**
     * Creates a new `RegionData` object
     * @param x - `x`-coordinate of the region
     * @param y - `y`-coordinate of the region
     * @param width - `width` of the region
     * @param height - `height` of the region
     * @param points - Collection of internal region points
     * @param type - `type` of the region from enum `RegionDataType`
     */
    constructor(x, y, width, height, points, type) {
        this.corner = new Point2D_1.Point2D(x, y);
        this.regionRect = new Rect_1.Rect(width, height);
        this.regionPoints = (points !== undefined && points !== null) ? points : new Array();
        this.regionType = (type !== undefined) ? type : RegionDataType.Point;
    }
    move(arg1, arg2) {
        const oldx = this.x;
        const oldy = this.y;
        this.corner.move(arg1, arg2);
        const dx = this.x - oldx;
        const dy = this.y - oldy;
        this.regionPoints.forEach((p) => {
            p.shift(dx, dy);
        });
    }
    /**
     * Resizes regions to specified dimensions
     * @param width - New `width` of the region
     * @param height - New `height` of the region
     */
    resize(width, height) {
        const sx = width / this.width;
        const sy = height / this.height;
        this.regionRect.resize(width, height);
        this.regionPoints.forEach((p) => {
            const px = (p.x - this.x) * sx + this.x;
            const py = (p.y - this.y) * sy + this.y;
            p.move(px, py);
        });
    }
    /**
     * Changes the `point` at specified `index`
     * @param point - New `point` value
     * @param index - `index` of the point in internal collection
     */
    setPoint(point, index) {
        if (index >= 0 && index < this.regionPoints.length) {
            this.regionPoints[index] = new Point2D_1.Point2D(point);
        }
        // Update region position and size
        let xmin = Number.MAX_VALUE;
        let xmax = 0;
        let ymin = Number.MAX_VALUE;
        let ymax = 0;
        this.regionPoints.forEach((point) => {
            if (point.x > xmax) {
                xmax = point.x;
            }
            if (point.x < xmin) {
                xmin = point.x;
            }
            if (point.y > ymax) {
                ymax = point.y;
            }
            if (point.y < ymin) {
                ymin = point.y;
            }
        });
        this.corner.move(xmin, ymin);
        this.regionRect.resize(xmax - xmin, ymax - ymin);
    }
    /**
     * Updates the collection of internal points
     * @param points - `IPoint2D[]` collection for the region to serve as the source for the
     * internal *copy* in the `points` collection
     */
    setPoints(points) {
        let xmin = Number.MAX_VALUE;
        let xmax = 0;
        let ymin = Number.MAX_VALUE;
        let ymax = 0;
        // Update region position and size
        points.forEach((point) => {
            if (point.x > xmax) {
                xmax = point.x;
            }
            if (point.x < xmin) {
                xmin = point.x;
            }
            if (point.y > ymax) {
                ymax = point.y;
            }
            if (point.y < ymin) {
                ymin = point.y;
            }
        });
        this.regionPoints = points.map((p) => new Point2D_1.Point2D(p));
        this.corner.move(xmin, ymin);
        this.regionRect.resize(xmax - xmin, ymax - ymin);
    }
    /**
     * Inits this region properties from another `IRegionData` object
     * @param regionData - An `IRegionData` object to serve as the source for the property values
     */
    initFrom(regionData) {
        this.corner = new Point2D_1.Point2D(regionData.x, regionData.y);
        this.regionRect = new Rect_1.Rect(regionData.width, regionData.height);
        this.regionPoints = regionData.points.map((p) => new Point2D_1.Point2D(p.x, p.y));
    }
    /**
     * Returns a new `RegionData` object with all coordinates and dimensions bounded to specified box
     * @param rect - The `IRect` box, which `width` and `height` will be used for bounding
     * @returns A new `RegionData` object
     */
    boundToRect(rect) {
        const brCorner = (new Point2D_1.Point2D(this.x + this.width, this.y + this.height)).boundToRect(rect);
        const tlCorner = this.corner.boundToRect(rect);
        const width = brCorner.x - tlCorner.x;
        const height = brCorner.y - tlCorner.y;
        return new RegionData(tlCorner.x, tlCorner.y, width, height, this.regionPoints.map((p) => p.boundToRect(rect)), this.regionType);
    }
    scale(f1, f2) {
        const xf = f1;
        const yf = (f2 !== undefined) ? f2 : f1;
        this.corner = new Point2D_1.Point2D(this.x * xf, this.y * yf);
        this.regionRect = new Rect_1.Rect(this.width * xf, this.height * yf);
        this.regionPoints = this.regionPoints.map((p) => new Point2D_1.Point2D(p.x * xf, p.y * yf));
    }
    /**
     * Creates a copy of this region data
     * @returns A new `RegionData` object with copied properties
     */
    copy() {
        return new RegionData(this.x, this.y, this.width, this.height, this.regionPoints.map((p) => p.copy()), this.regionType);
    }
    /**
     * Returns a string representation of the region in the format
     * `"{x, y} x [width, height]: {{x1, y1}, ..., {xn, yn}}"`.
     * @returns A string representation of the rect
     */
    toString() {
        return `${this.corner.toString()} x ${this.boundRect.toString()}: {${this.regionPoints.toString()}}`;
    }
    /**
     * Returns a JSON representation of the region
     * @returns An `IRegionData` object with properties only.
     */
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            points: this.regionPoints.map((point) => {
                return { x: point.x, y: point.y };
            }),
            type: this.regionType,
        };
    }
}
exports.RegionData = RegionData;
//# sourceMappingURL=RegionData.js.map