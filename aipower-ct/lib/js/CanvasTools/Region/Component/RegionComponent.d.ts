import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IFreezable } from "../../Interface/IFreezable";
import { IHideable } from "../../Interface/IHideadble";
import { IMovable } from "../../Interface/IMovable";
import { IResizable } from "../../Interface/IResizable";
import { IRegionCallbacks, ChangeEventType } from "../../Interface/IRegionCallbacks";
import { IPoint2D } from "../../Interface/IPoint2D";
/**
 * An abstract visial component to define a component of region presentation UI.
 */
export declare abstract class RegionComponent implements IHideable, IResizable, IMovable, IFreezable {
    /**
     * The `Snap.Element` object of the component to be used in DOM tree composition.
     */
    node: Snap.Element;
    /**
     * The `RegionData` object describing current region state.
     */
    regionData: RegionData;
    /**
     * Defines if the component is visible.
     */
    isVisible: boolean;
    /**
     * Defines if the component is in a frozen state.
     */
    isFrozen: boolean;
    /**
     * Defines if the component is selected.
     */
    isSelected: boolean;
    /**
     * Reference to the `Snap.Paper` object to draw on.
     */
    protected paper: Snap.Paper;
    /**
     * Reference to the size of parent host.
     */
    protected paperRect: Rect;
    /**
     * The `x`-coordinate of the component. Defined through the `regionaData`.
     */
    readonly x: number;
    /**
     * The `y`-coordinate of the component. Defined through the `regionaData`.
     */
    readonly y: number;
    /**
     * The `width` of the component. Defined through the `regionaData`.
     */
    readonly width: number;
    /**
     * The `height` of the component. Defined through the `regionaData`.
     */
    readonly height: number;
    /**
     * The `area` of the component. Defined through the `regionaData`.
     */
    readonly area: number;
    /**
     * The `boundRect` of the component. Defined through the `regionaData`.
     * @remarks Returns the `Rect` object of the same `width` and `height` as the component.
     */
    readonly boundRect: Rect;
    /**
     * Reference to external callbacks collection.
     */
    private callbacks;
    /**
     * Creates a new UI component (part of the region).
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, callbacks?: IRegionCallbacks);
    /**
     * Switches the component presentstion to the hidden state.
     */
    hide(): void;
    /**
     * Switches the component presentation to the visibile state.
     */
    show(): void;
    /**
     * Selects the component.
     */
    select(): void;
    /**
     * Unselecets the component.
     */
    unselect(): void;
    /**
     * Switches the component to the frozen state.
     */
    freeze(): void;
    /**
     * Switches the component to the unfrozen state.
     */
    unfreeze(): void;
    /**
     * Moves the component to specified location
     * @param point - The new component location.
     */
    move(point: IPoint2D): void;
    /**
     * Moves the component to specified `x` and `y` coordinates.
     * @param x - The new `x`-coordinate.
     * @param y - The new `y`-coordinate.
     */
    move(x: number, y: number): void;
    /**
     * Redraws the visual of the component. Should be redefined in child classes.
     */
    abstract redraw(): void;
    /**
     * Resizes the component to specified `width` and `height`.
     * @param width - The new `width` for the component.
     * @param height - The new `height` for the component.
     */
    resize(width: number, height: number): void;
    /**
     * Resizes the bounding box for the component.
     * @param width - The new `width` of the bounding box.
     * @param height - The new `height` of the bounding box.
     */
    resizePaper(width: number, height: number): void;
    /**
     * The wrapper around external `onChange` callback. Checks whether the callback is defined.
     * @param region - Reference to the component.
     * @param regionData - The `RegionData` object to be passed.
     * @param eventType - The event type.
     * @param multiSelection - The flag for multiple regions selection.
     */
    protected onChange(region: RegionComponent, regionData: RegionData, eventType?: ChangeEventType, multiSelection?: boolean): void;
    /**
     * The wrapper around external `onManipulationBegin` callback. Checks whether the callback is defined.
     * @param region - Reference to the component.
     */
    protected onManipulationBegin(region?: RegionComponent): void;
    /**
     * The wrapper around external `onManupulationEnd` callback. Checks whether the callback is defined.
     * @param region - Reference to the component.
     */
    protected onManipulationEnd(region?: RegionComponent): void;
    /**
     * Subscrubes the component elements according to provided event descriptors. Binds to the `this` object.
     * @param listeners - The collection of event descriptors.
     */
    protected subscribeToEvents(listeners: IEventDescriptor[]): void;
    /**
     * A helper function to make event listeners froozen if the component state is frozen.
     * @param f - Function to wrap.
     * @param bypass - A flag whether event should bypass.
     */
    protected makeFreezable(f: (args: PointerEvent | KeyboardEvent) => void, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
}
