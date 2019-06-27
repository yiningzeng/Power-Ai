import { IRect } from "./IRect";
/**
 * Enum to define current selectio mode
 */
export declare enum SelectionMode {
    NONE = 0,
    POINT = 1,
    RECT = 2,
    COPYRECT = 3,
    POLYLINE = 4,
    POLYGON = 5
}
/**
 * Defines options to setup an selector in `AreaSelector`.
 */
export interface ISelectorSettings {
    mode: SelectionMode;
    template?: IRect;
}
