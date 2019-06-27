"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const LABColor_1 = require("./LABColor");
const Color_1 = require("./Color");
/**
 * The `Palette` class to generate a palette with specified settings
 * and extract a subset as color swatches.
 */
class Palette {
    /** Creates a new palette with provided settings */
    constructor(settings) {
        this.settings = {
            lightness: (settings.lightness === undefined) ?
                0.65 : Math.max(0, Math.min(1, settings.lightness)),
            lightnessVariation: (settings.lightnessVariation === undefined) ?
                0 : Math.max(0, Math.min(1, settings.lightnessVariation)),
            minGrayness: (settings.minGrayness === undefined) ?
                0 : Math.max(0, Math.min(1, settings.minGrayness)),
            maxGrayness: (settings.maxGrayness === undefined) ?
                2 : Math.max(0, Math.min(2, settings.maxGrayness)),
            granularity: (settings.granularity === undefined) ?
                50 : Math.max(10, settings.granularity),
            abRange: (settings.abRange === undefined) ?
                1.3 : Math.max(0, Math.min(2, settings.abRange)),
        };
        this.generateClusterPromise = this.generateGamutClusterAsync();
    }
    /**
     * Returns a promise with Gamut points resolved when all points are calculated.
     */
    async gamut() {
        if (this.gamutCluster !== undefined && this.gamutCluster !== null) {
            return new Promise((resolve) => resolve(this.gamutCluster));
        }
        else {
            return this.generateClusterPromise.then((cluster) => {
                this.gamutCluster = cluster;
                return cluster;
            });
        }
    }
    /**
     * Generates a random set of swatches within the palette's gamut.
     * @param colorsCount - The number of colors to be generated.
     */
    async swatches(colorsCount) {
        return this.gamut().then((cluster) => {
            const swatches = new Array();
            const first = Math.round(Math.random() * cluster.length);
            swatches.push(cluster[first]);
            for (let i = 0; i < colorsCount - 1; i++) {
                swatches.push(this.findNextColor(swatches, cluster));
            }
            return swatches;
        });
    }
    /**
     * Expands provided set of swatches within the palette's gamut.
     * @param swatches - The original set of swatches.
     * @param colorsCount - The number of new colors to be generated.
     */
    async more(swatches, colorsCount) {
        if (swatches.length > 0) {
            return this.gamut().then((cluster) => {
                const newSwatches = new Array();
                const allSwatches = swatches.map((sw) => sw);
                for (let i = 0; i < colorsCount; i++) {
                    const swatch = this.findNextColor(allSwatches, cluster);
                    allSwatches.push(swatch);
                    newSwatches.push(swatch);
                }
                return newSwatches;
            });
        }
        else {
            return this.swatches(colorsCount);
        }
    }
    /**
     * Iteratively generates new swatches within the palette's gamut.
     */
    swatchIterator() {
        return __asyncGenerator(this, arguments, function* swatchIterator_1() {
            const gamut = yield __await(this.gamut());
            const firstIndex = Math.round(Math.random() * gamut.length);
            const firstColor = gamut[firstIndex];
            yield yield __await(firstColor);
            const swatches = [firstColor];
            let lastColor = firstColor;
            let distance = 1.0;
            while ((distance) > 0) {
                const nextColor = this.findNextColor(swatches, gamut);
                swatches.push(nextColor);
                distance = nextColor.LAB.distanceTo_00(lastColor.LAB);
                lastColor = nextColor;
                if (distance > 0) {
                    yield yield __await(nextColor);
                }
            }
        });
    }
    /**
     * Finds the next color to expand the swatches set within the palette's gamut.
     * Returns the point with maximum distance to all the colors in swatches.
     * @param swatches - The original set of swatches.
     * @param cluster - The cluster to look with-in.
     */
    findNextColor(swatches, cluster) {
        let candidate = cluster[0];
        let maxDistanceSQ = 0;
        cluster.forEach((colorPoint) => {
            const distances = swatches.map((swatchPoint) => {
                return colorPoint.LAB.distanceTo_00(swatchPoint.LAB);
            });
            const minDistanceSQ = Math.min(...distances);
            if (minDistanceSQ > maxDistanceSQ) {
                candidate = colorPoint;
                maxDistanceSQ = minDistanceSQ;
            }
        });
        return candidate;
    }
    /**
     * Wraps the `generateGamutCluster` method into a Promise.
     */
    generateGamutClusterAsync() {
        const promise = new Promise((resolve) => {
            this.gamutCluster = this.generateGamutCluster();
            resolve(this.gamutCluster);
        });
        return promise;
    }
    /**
     * Generates a gamut cluster of paired colors in CIELAB (LAB) and RGB,
     * filtered by color points valid in RGB space and grayness constrains
     * (withing the range of [`minGrainess`, `maxGrayness`]).
     *
     * This method augments the `generatePointsCluster` method with lightness settings,
     * putting lightness equal to a random value within the range
     * [`lightness` - `lightnessVariation`/2, `lightness` + `lightnessVariation`/2].
     */
    generateGamutCluster() {
        let cluster = this.generatePointsCluster(this.settings.granularity);
        cluster = cluster.filter((p) => {
            const d = this.distanceToGray(p);
            return d >= this.settings.minGrayness && d <= this.settings.maxGrayness;
        });
        const colorSpace = new Array();
        cluster.forEach((p) => {
            let lightness = this.settings.lightness;
            if (this.settings.lightnessVariation > 0) {
                lightness += this.settings.lightnessVariation * (Math.random() - 0.5);
                lightness = Math.max(0, Math.min(1, lightness));
            }
            const labcolor = new LABColor_1.LABColor(lightness, p.a, p.b);
            const color = new Color_1.Color(labcolor);
            if (color.sRGB.isValidColor()) {
                colorSpace.push(color);
            }
        });
        return colorSpace;
    }
    /**
     * Calculate distance from color point to a zero-point (`a = b = 0`).
     * @param p - Origin point.
     */
    distanceToGray(p) {
        return Math.sqrt(p.a * p.a + p.b * p.b);
    }
    /**
     * Generate a grid of color points in AB-subspace, centered at `a = b = 0` and
     * the grid size [-`abRage`, +`abRange`] in each dimension.
     * @param granularity - Number of grid steps in each dimension.
     */
    generatePointsCluster(granularity) {
        granularity = Math.round(granularity);
        const cluster = new Array(granularity * granularity);
        const range = this.settings.abRange;
        for (let i = 0; i < granularity; i++) {
            for (let j = 0; j < granularity; j++) {
                cluster[i * granularity + j] = {
                    a: range * 2 * i / (granularity - 1) - range,
                    b: range * 2 * j / (granularity - 1) - range,
                };
            }
        }
        return cluster;
    }
}
exports.Palette = Palette;
//# sourceMappingURL=Palette.js.map