import { RegionData } from "../Core/RegionData";
import { RegionComponent } from "../Region/Component/RegionComponent";
/**
 * Defines callbacks for region manipulation events.
 * @remarks Used to sync the internal state with the `AreaSelector`.
 */
export declare type RegionManipulationFunction = (UIElement?: RegionComponent) => void;
/**
 * Defines supported events types for regions.
 */
export declare enum ChangeEventType {
    MOVEEND = 0,
    MOVING = 1,
    MOVEBEGIN = 2,
    SELECTIONTOGGLE = 3
}
/**
 * Defines callbacks for regions state change events.
 */
export declare type RegionChangeFunction = (region: RegionComponent, regionData: RegionData, eventType?: ChangeEventType, multiSelection?: boolean) => void;
/**
 * Defines a collection of events to be passed to the `Region` constructor.
 */
export interface IRegionCallbacks {
    /**
     * The callback to be called when some manipulation with the region began.
     */
    onManipulationBegin: RegionManipulationFunction;
    /**
     * The callback to be called when some manipulation with the region ended.
     */
    onManipulationEnd: RegionManipulationFunction;
    /**
     * The callback to be called when region state changes.
     */
    onChange: RegionChangeFunction;
}
