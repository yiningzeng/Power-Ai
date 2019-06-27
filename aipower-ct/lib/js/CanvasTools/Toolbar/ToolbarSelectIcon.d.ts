import { IToolbarIcon } from "../Interface/IToolbarIcon";
import { IconCallback, ToolbarIcon } from "./ToolbarIcon";
export declare class ToolbarSelectIcon extends ToolbarIcon {
    onAction: IconCallback;
    private iconBackgrounRect;
    private iconImage;
    private iconImageSVG;
    constructor(paper: Snap.Paper, icon: IToolbarIcon, onAction: IconCallback);
    activate(): void;
    move(x: number, y: number): void;
    resize(width: number, height: number): void;
    private buildIconUI;
}
