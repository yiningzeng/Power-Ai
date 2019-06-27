import { Rect } from "../../Core/Rect";
import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IHideable } from "../../Interface/IHideadble";
import { IResizable } from "../../Interface/IResizable";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";
import { Element } from "../Component/Element";
import { IPoint2D } from "../../Interface/IPoint2D";
import { CrossElement } from "../Component/CrossElement";
/**
 * The abstract class to define region selectors.
 */
export declare abstract class Selector extends Element {
    /**
     * The reference to callbacks collection.
     */
    callbacks: ISelectorCallbacks;
    /**
     * The flag to define if selector is enabled or disabled.
     */
    protected isEnabled: boolean;
    /**
     * The reference to hosting SVG element.
     */
    protected parentNode: SVGSVGElement;
    /**
     * Creates new selector.
     * @param parent - The parent (host) SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box for selector.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks);
    /**
     * Enables and shows this selector.
     */
    enable(): void;
    /**
     * Disables and hides this selector.
     */
    disable(): void;
    /**
     * Helper function to subscribe collection of elements to specified listeners.
     * @param listeners - The collection of `IEventDescriptor` objects.
     */
    protected subscribeToEvents(listeners: IEventDescriptor[]): void;
    /**
     * Helper function to wrap listener with the enablement flag.
     * @param f - The function to wrap.
     * @param bypass - The `bypass` flag to define whether event should be captured.
     */
    protected enablify(f: (args: PointerEvent | KeyboardEvent) => void, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
    /**
     * Shows all the elements in specified array.
     * @param elements - The array of elements to show.
     */
    protected showAll(elements: Array<IHideable | Snap.Element>): void;
    /**
     * Hides all the elements in specified array.
     * @param elements - The array of elements to hide.
     */
    protected hideAll(elements: Array<IHideable | Snap.Element>): void;
    /**
     * Resizes all the elements to the `boundRect` of this element.
     * @param elemenets - The array of elements to resize.
     */
    protected resizeAll(elements: IResizable[]): void;
    /**
     * Helper function to move the cross element to specified position.
     * @param cross - The cross element to move.
     * @param pointTo - The new position of the cross element.
     * @param square - The flag that movement should be related to reference point of a square
     */
    protected moveCross(cross: CrossElement, pointTo: IPoint2D, square?: boolean, ref?: IPoint2D): void;
    /**
     * Helper function to move a point element to specified position
     * @param point - The point element to move.
     * @param pointTo - The new position of the point.
     */
    protected movePoint(point: Snap.Element, pointTo: IPoint2D): void;
    /**
     * Helper function to move a line element to specified begin and end positions
     * @param line - The line element to move.
     * @param pointFrom - The begin point.
     * @param pointTo - The end point.
     */
    protected moveLine(line: Snap.Element, pointFrom: IPoint2D, pointTo: IPoint2D): void;
}
