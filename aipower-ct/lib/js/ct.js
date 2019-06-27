"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Toolbar_1 = require("./CanvasTools/Toolbar/Toolbar");
const RegionsManager_1 = require("./CanvasTools/Region/RegionsManager");
const PointRegion_1 = require("./CanvasTools/Region/Point/PointRegion");
const RectRegion_1 = require("./CanvasTools/Region/Rect/RectRegion");
const AreaSelector_1 = require("./CanvasTools/Selection/AreaSelector");
const ISelectorSettings_1 = require("./CanvasTools/Interface/ISelectorSettings");
const CanvasTools_Filter_1 = require("./CanvasTools/CanvasTools.Filter");
const Rect_1 = require("./CanvasTools/Core/Rect");
const Point2D_1 = require("./CanvasTools/Core/Point2D");
const RegionData_1 = require("./CanvasTools/Core/RegionData");
const Tag_1 = require("./CanvasTools/Core/Tag");
const TagsDescriptor_1 = require("./CanvasTools/Core/TagsDescriptor");
const CanvasTools_Editor_1 = require("./CanvasTools/CanvasTools.Editor");
const RGBColor_1 = require("./CanvasTools/Core/Colors/RGBColor");
const LABColor_1 = require("./CanvasTools/Core/Colors/LABColor");
const XYZColor_1 = require("./CanvasTools/Core/Colors/XYZColor");
const HSLColor_1 = require("./CanvasTools/Core/Colors/HSLColor");
const Palette_1 = require("./CanvasTools/Core/Colors/Palette");
const Color_1 = require("./CanvasTools/Core/Colors/Color");
require("snapsvg-cjs");
/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */
class CanvasTools {
}
/**
 * Core internal classes.
 */
CanvasTools.Core = {
    Rect: Rect_1.Rect,
    Point2D: Point2D_1.Point2D,
    RegionData: RegionData_1.RegionData,
    TagsDescriptor: TagsDescriptor_1.TagsDescriptor,
    Tag: Tag_1.Tag,
    Colors: {
        RGBColor: RGBColor_1.RGBColor,
        LABColor: LABColor_1.LABColor,
        XYZColor: XYZColor_1.XYZColor,
        HSLColor: HSLColor_1.HSLColor,
        Palette: Palette_1.Palette,
        Color: Color_1.Color,
    },
};
/**
 * Classes for new region selection (creation).
 */
CanvasTools.Selection = {
    AreaSelector: AreaSelector_1.AreaSelector,
    SelectionMode: ISelectorSettings_1.SelectionMode,
};
/**
 * Classes for regions management.
 */
CanvasTools.Region = {
    RegionsManager: RegionsManager_1.RegionsManager,
    PointRegion: PointRegion_1.PointRegion,
    RectRegion: RectRegion_1.RectRegion,
};
/**
 * Classes and functions to apply filters to the source image.
 */
CanvasTools.Filters = {
    InvertFilter: CanvasTools_Filter_1.InvertFilter,
    GrayscaleFilter: CanvasTools_Filter_1.GrayscaleFilter,
    BlurDiffFilter: CanvasTools_Filter_1.BlurDiffFilter,
    ContrastFilter: CanvasTools_Filter_1.ContrastFilter,
    BrightnessFilter: CanvasTools_Filter_1.BrightnessFilter,
    SaturationFilter: CanvasTools_Filter_1.SaturationFilter,
};
/**
 * The Editor component.
 */
CanvasTools.Editor = CanvasTools_Editor_1.Editor;
/**
 * The Toolbar component.
 */
CanvasTools.Toolbar = Toolbar_1.Toolbar;
exports.CanvasTools = CanvasTools;
/* CSS */
require("./../css/canvastools.css");
//# sourceMappingURL=ct.js.map