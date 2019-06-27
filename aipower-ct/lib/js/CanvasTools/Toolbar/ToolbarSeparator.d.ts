import { ToolbarIcon } from "./ToolbarIcon";
export declare class ToolbarSeparator extends ToolbarIcon {
    private iconSeparator;
    constructor(paper: Snap.Paper, width: number);
    move(x: number, y: number): void;
    resize(width: number, height: number): void;
    private buildIconUI;
}
