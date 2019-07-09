import { Color } from "./Color";
/**
 * Palette settings.
 */
export interface IPaletteSettings {
    lightness: number;
    lightnessVariation: number;
    minGrayness: number;
    maxGrayness: number;
    granularity: number;
    abRange: number;
}
/**
 * The `Palette` class to generate a palette with specified settings
 * and extract a subset as color swatches.
 */
export declare class Palette {
    private gamutCluster;
    private generateClusterPromise;
    private settings;
    /** Creates a new palette with provided settings */
    constructor(settings: IPaletteSettings);
    /**
     * Returns a promise with Gamut points resolved when all points are calculated.
     */
    gamut(): Promise<Color[]>;
    /**
     * Generates a random set of swatches within the palette's gamut.
     * @param colorsCount - The number of colors to be generated.
     */
    swatches(colorsCount: number): Promise<Color[]>;
    /**
     * Expands provided set of swatches within the palette's gamut.
     * @param swatches - The original set of swatches.
     * @param colorsCount - The number of new colors to be generated.
     */
    more(swatches: Color[], colorsCount: number): Promise<Color[]>;
    /**
     * Iteratively generates new swatches within the palette's gamut.
     */
    swatchIterator(): AsyncIterableIterator<Color>;
    /**
     * Finds the next color to expand the swatches set within the palette's gamut.
     * Returns the point with maximum distance to all the colors in swatches.
     * @param swatches - The original set of swatches.
     * @param cluster - The cluster to look with-in.
     */
    private findNextColor;
    /**
     * Wraps the `generateGamutCluster` method into a Promise.
     */
    private generateGamutClusterAsync;
    /**
     * Generates a gamut cluster of paired colors in CIELAB (LAB) and RGB,
     * filtered by color points valid in RGB space and grayness constrains
     * (withing the range of [`minGrainess`, `maxGrayness`]).
     *
     * This method augments the `generatePointsCluster` method with lightness settings,
     * putting lightness equal to a random value within the range
     * [`lightness` - `lightnessVariation`/2, `lightness` + `lightnessVariation`/2].
     */
    private generateGamutCluster;
    /**
     * Calculate distance from color point to a zero-point (`a = b = 0`).
     * @param p - Origin point.
     */
    private distanceToGray;
    /**
     * Generate a grid of color points in AB-subspace, centered at `a = b = 0` and
     * the grid size [-`abRage`, +`abRange`] in each dimension.
     * @param granularity - Number of grid steps in each dimension.
     */
    private generatePointsCluster;
}
