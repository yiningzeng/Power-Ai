import { Toolbar as CTToolbar } from "./CanvasTools/Toolbar/Toolbar";
import { RegionsManager } from "./CanvasTools/Region/RegionsManager";
import { PointRegion } from "./CanvasTools/Region/Point/PointRegion";
import { RectRegion } from "./CanvasTools/Region/Rect/RectRegion";
import { AreaSelector } from "./CanvasTools/Selection/AreaSelector";
import { SelectionMode } from "./CanvasTools/Interface/ISelectorSettings";
import { InvertFilter, GrayscaleFilter, BlurDiffFilter, ContrastFilter, BrightnessFilter, SaturationFilter } from "./CanvasTools/CanvasTools.Filter";
import { Rect } from "./CanvasTools/Core/Rect";
import { Point2D } from "./CanvasTools/Core/Point2D";
import { RegionData } from "./CanvasTools/Core/RegionData";
import { Tag } from "./CanvasTools/Core/Tag";
import { TagsDescriptor } from "./CanvasTools/Core/TagsDescriptor";
import { Editor as CTEditor } from "./CanvasTools/CanvasTools.Editor";
import { RGBColor } from "./CanvasTools/Core/Colors/RGBColor";
import { LABColor } from "./CanvasTools/Core/Colors/LABColor";
import { XYZColor } from "./CanvasTools/Core/Colors/XYZColor";
import { HSLColor } from "./CanvasTools/Core/Colors/HSLColor";
import { Palette } from "./CanvasTools/Core/Colors/Palette";
import { Color } from "./CanvasTools/Core/Colors/Color";
import "snapsvg-cjs";
export declare class CanvasTools {
    /**
     * Core internal classes.
     */
    static Core: {
        Rect: typeof Rect;
        Point2D: typeof Point2D;
        RegionData: typeof RegionData;
        TagsDescriptor: typeof TagsDescriptor;
        Tag: typeof Tag;
        Colors: {
            RGBColor: typeof RGBColor;
            LABColor: typeof LABColor;
            XYZColor: typeof XYZColor;
            HSLColor: typeof HSLColor;
            Palette: typeof Palette;
            Color: typeof Color;
        };
    };
    /**
     * Classes for new region selection (creation).
     */
    static Selection: {
        AreaSelector: typeof AreaSelector;
        SelectionMode: typeof SelectionMode;
    };
    /**
     * Classes for regions management.
     */
    static Region: {
        RegionsManager: typeof RegionsManager;
        PointRegion: typeof PointRegion;
        RectRegion: typeof RectRegion;
    };
    /**
     * Classes and functions to apply filters to the source image.
     */
    static Filters: {
        InvertFilter: typeof InvertFilter;
        GrayscaleFilter: typeof GrayscaleFilter;
        BlurDiffFilter: typeof BlurDiffFilter;
        ContrastFilter: typeof ContrastFilter;
        BrightnessFilter: typeof BrightnessFilter;
        SaturationFilter: typeof SaturationFilter;
    };
    /**
     * The Editor component.
     */
    static Editor: typeof CTEditor;
    /**
     * The Toolbar component.
     */
    static Toolbar: typeof CTToolbar;
}
import "./../css/canvastools.css";
