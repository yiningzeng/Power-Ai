/**
 * Filter function Interface. Transformas provided canvas element into a new `Promise`
 * that returns some new canvas element.
 */
export declare type FilterFunction = (canvas: HTMLCanvasElement) => Promise<HTMLCanvasElement>;
/**
 * Invertion filter.
 * @param canvas - Source HTMLCanvas element.
 */
export declare function InvertFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
/**
 * Grayscale filter.
 * @param canvas - Source HTMLCanvas element.
 */
export declare function GrayscaleFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
/**
 * Experimental blur difference filter.
 * @param factor - Bluring factor (in pixels).
 */
export declare function BlurDiffFilter(factor: number): FilterFunction;
/**
 * Brightness filter.
 * @param brightness - The brightness value in the range [0, 255] to be added to pixels.
 */
export declare function BrightnessFilter(brightness: number): FilterFunction;
/**
 * Contrast filter.
 * @param contrast - The contrast factor in the range [-255, 255] to be applied to pixels.
 */
export declare function ContrastFilter(contrast: number): FilterFunction;
/**
 * Saturation filter
 * @param saturation - The saturation factor in the range [0, 255] to be applied to pixels.
 */
export declare function SaturationFilter(saturation: number): FilterFunction;
/**
 * The `FilterPipeline` class used to create a pipeline of canvas data transformations
 * before displaying it to the user.
 */
export declare class FilterPipeline {
    /**
     * Array of filters.
     */
    private pipeline;
    /**
     * Creates new instance of the `FilterPipeline`.
     */
    constructor();
    /**
     * Add new filter function to pipeline.
     * @param filter - A new filter function.
     */
    addFilter(filter: FilterFunction): void;
    /**
     * Clear all the filters in pipeline.
     */
    clearFilters(): void;
    /**
     * Apply filters pipeline to provided source canvas.
     * @param canvas - The source HTML Canvas element.
     * @returns A new `Promise` resolved when all filters are applyed.
     */
    applyToCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
}
