import { ToolbarItemFactory } from "./providers/toolbar/toolbarItemFactory";
import { ExportProject } from "./react/components/toolbar/exportProject";
import { SaveProject } from "./react/components/toolbar/saveProject";
import { ToolbarItemType } from "./react/components/toolbar/toolbarItem";
import { strings } from "./common/strings";
import {TrainAi} from "./react/components/toolbar/trainAi";

export enum ToolbarItemName {
    SelectCanvas = "selectCanvas",
    DrawRectangle = "drawRectangle",
    DrawPolygon = "drawPolygon",
    CopyRectangle = "copyRectangle",
    CopyRegions = "copyRegions",
    CutRegions = "cutRegions",
    PasteRegions = "pasteRegions",
    HideAllRegions = "hideAllRegions",
    ShowAllRegions = "showAllRegions",
    RemoveAllRegions = "removeAllRegions",
    ZoomInAsset = "zoomInAsset",
    ZoomOutAsset = "zoomOutAsset",
    ZoomNormolAsset = "zoomNormolAsset",
    PreviousAsset = "navigatePreviousAsset",
    NextAsset = "navigateNextAsset",
    SaveProject = "saveProject",
    ExportProject = "exportProject",
    ActiveLearning = "activeLearning",
    TrainAi = "trainAi",
}

export enum ToolbarItemGroup {
    Canvas = "canvas",
    Regions = "regions",
    Navigation = "navigation",
    Project = "project",
    Zoom = "Zoom",
    Ai = "ai",
}

/**
 * Registers items for toolbar
 */
export default function registerToolbar() {
    ToolbarItemFactory.register({
        name: ToolbarItemName.SelectCanvas,
        tooltip: strings.editorPage.toolbar.select,
        icon: "fas fa-hand-rock",
        group: ToolbarItemGroup.Canvas,
        type: ToolbarItemType.State,
        accelerators: ["V", "v"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.DrawRectangle,
        tooltip: strings.editorPage.toolbar.drawRectangle,
        icon: "fa-vector-square",
        group: ToolbarItemGroup.Canvas,
        type: ToolbarItemType.State,
        accelerators: ["R", "r"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.DrawPolygon,
        tooltip: strings.editorPage.toolbar.drawPolygon,
        icon: "fa-draw-polygon",
        group: ToolbarItemGroup.Canvas,
        type: ToolbarItemType.State,
        accelerators: ["P", "p"],
    });

    // ToolbarItemFactory.register({
    //     name: ToolbarItemName.CopyRectangle,
    //     tooltip: strings.editorPage.toolbar.copyRectangle,
    //     icon: "far fa-clone",
    //     group: ToolbarItemGroup.Canvas,
    //     type: ToolbarItemType.State,
    //     accelerators: ["CmdOrCtrl+W", "CmdOrCtrl+w"],
    // });

    ToolbarItemFactory.register({
        name: ToolbarItemName.CopyRegions,
        tooltip: strings.editorPage.toolbar.copy,
        icon: "fa-copy",
        group: ToolbarItemGroup.Regions,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+C", "CmdOrCtrl+c"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.CutRegions,
        tooltip: strings.editorPage.toolbar.cut,
        icon: "fa-cut",
        group: ToolbarItemGroup.Regions,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+X", "CmdOrCtrl+x"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.PasteRegions,
        tooltip: strings.editorPage.toolbar.paste,
        icon: "fa-paste",
        group: ToolbarItemGroup.Regions,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+V", "CmdOrCtrl+v"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.ShowAllRegions,
        tooltip: strings.editorPage.toolbar.removeAllRegions,
        icon: "fa-eye",
        group: ToolbarItemGroup.Regions,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+Q", "CmdOrCtrl+q"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.HideAllRegions,
        tooltip: strings.editorPage.toolbar.removeAllRegions,
        icon: "fa-eye-slash",
        group: ToolbarItemGroup.Regions,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+W", "CmdOrCtrl+w"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.RemoveAllRegions,
        tooltip: strings.editorPage.toolbar.removeAllRegions,
        icon: "fa-ban",
        group: ToolbarItemGroup.Regions,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+Delete", "CmdOrCtrl+Backspace"],
    });

    // ToolbarItemFactory.register({
    //     name: ToolbarItemName.ActiveLearning,
    //     tooltip: strings.editorPage.toolbar.activeLearning,
    //     icon: "fas fa-graduation-cap",
    //     group: ToolbarItemGroup.Canvas,
    //     type: ToolbarItemType.Action,
    //     accelerators: ["CmdOrCtrl+D", "CmdOrCtrl+d"],
    // });

    ToolbarItemFactory.register({
        name: ToolbarItemName.ZoomOutAsset,
        tooltip: "缩小",
        icon: "fas fa-search-minus",
        group: ToolbarItemGroup.Zoom,
        type: ToolbarItemType.Action,
        accelerators: ["O", "o"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.ZoomInAsset,
        tooltip: "放大",
        icon: "fas fa-search-plus",
        group: ToolbarItemGroup.Zoom,
        type: ToolbarItemType.Action,
        accelerators: ["I", "i"],
    });

    // 缩放回归正常
    ToolbarItemFactory.register({
        name: ToolbarItemName.ZoomNormolAsset,
        tooltip: "正常",
        icon: "fa-expand",
        group: ToolbarItemGroup.Zoom,
        type: ToolbarItemType.Action,
        accelerators: ["U", "u"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.PreviousAsset,
        tooltip: strings.editorPage.toolbar.previousAsset,
        icon: "fas fa-arrow-circle-up",
        group: ToolbarItemGroup.Navigation,
        type: ToolbarItemType.Action,
        accelerators: ["ArrowUp", "W", "w"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.NextAsset,
        tooltip: strings.editorPage.toolbar.nextAsset,
        icon: "fas fa-arrow-circle-down",
        group: ToolbarItemGroup.Navigation,
        type: ToolbarItemType.Action,
        accelerators: ["ArrowDown", "S", "s"],
    });

    ToolbarItemFactory.register({
        name: ToolbarItemName.SaveProject,
        tooltip: strings.editorPage.toolbar.saveProject,
        icon: "fa-save",
        group: ToolbarItemGroup.Project,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+S", "CmdOrCtrl+s"],
    }, SaveProject);

    ToolbarItemFactory.register({
        name: ToolbarItemName.ExportProject,
        tooltip: strings.editorPage.toolbar.exportProject,
        icon: "fa-external-link-square-alt",
        group: ToolbarItemGroup.Project,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+E", "CmdOrCtrl+e"],
    }, ExportProject);

    ToolbarItemFactory.register({
        name: ToolbarItemName.TrainAi,
        tooltip: strings.editorPage.toolbar.trainAi,
        icon: "fa fa-train",
        // icon: "fas fa-caret-square-right",
        group: ToolbarItemGroup.Ai,
        type: ToolbarItemType.Action,
        accelerators: ["CmdOrCtrl+T", "CmdOrCtrl+t"],
    }, TrainAi);
}
