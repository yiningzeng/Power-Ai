import { IToolbarIcon } from "../Interface/IToolbarIcon";
export declare type IconCallback = (action: string) => void;
export declare enum ToolbarItemType {
    SELECTOR = 0,
    SWITCH = 1,
    SEPARATOR = 2,
    TRIGGER = 3
}
export declare abstract class ToolbarIcon {
    static IconWidth: number;
    static IconHeight: number;
    width: number;
    height: number;
    description: IToolbarIcon;
    node: Snap.Element;
    protected paper: Snap.Paper;
    protected x: number;
    protected y: number;
    protected isSelected: boolean;
    constructor(paper: Snap.Paper, icon?: IToolbarIcon);
    move(x: number, y: number): void;
    resize(width: number, height: number): void;
    select(): void;
    unselect(): void;
    protected toggleSelection(): void;
}
