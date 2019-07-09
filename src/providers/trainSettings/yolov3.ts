import _ from "lodash";
import { TrainProvider } from "./trainProvider";
import { IProject, IAssetMetadata, ITag, IExportProviderOptions } from "../../models/applicationState";
import Guard from "../../common/guard";
import HtmlFileReader from "../../common/htmlFileReader";
// import { itemTemplate, annotationTemplate, objectTemplate } from "./pascalVOC/pascalVOCTemplates";
import { interpolate } from "../../common/strings";
import os from "os";
import {IYoloV3} from "../../models/trainConfig";
import {constants} from "../../common/constants";
import {yolov3Template} from "./templates/yolov3Templates";

interface IObjectInfo {
    name: string;
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}

interface IImageInfo {
    width: number;
    height: number;
    objects: IObjectInfo[];
}

const trainSettings: IYoloV3 = {
    yolov3net: {
        batch: 64,
        subdivisions: 16,
        width: 608,
        height: 608,
        channels: 3,
        momentum: 0.9,
        decay: 0.0005,
        angle: 0,
        saturation: 1.5,
        exposure: 1.5,
        hue: .1,
        learning_rate: 0.001,
        burn_in: 1000,
        max_batches: 500200,
        policy: "steps",
        steps: "400000,450000",
        scales: ".1,.1",
    },
};

/**
 * Export options for Pascal VOC Export Provider
 */
export interface IYoloV3ProviderOptions extends IExportProviderOptions {
    /** The test / train split ratio for exporting data */
    testTrainSplit?: number;
    /** Whether or not to include unassigned tags in exported data */
    exportUnassigned?: boolean;
}

/**
 * @name - PascalVOC Export Provider
 * @description - Exports a project into a Pascal VOC
 */
export class Yolov3Provider extends TrainProvider<IYoloV3ProviderOptions> {
    private imagesInfo = new Map<string, IImageInfo>();

    constructor(project: IProject, options: IYoloV3ProviderOptions) {
        super(project, options);
        Guard.null(options);
    }

    /**
     * Export project to PascalVOC
     */
    public async export(): Promise<void> {
        const fileName = `train-config/yolov3.cfg`;
        await this.storageProvider.writeText(fileName, interpolate(yolov3Template, trainSettings.yolov3net));
    }

    // private async exportPBTXT(exportFolderName: string, project: IProject) {
    //     if (project.tags && project.tags.length > 0) {
    //         // Save pascal_label_map.pbtxt
    //         const pbtxtFileName = `${exportFolderName}/pascal_label_map.pbtxt`;
    //
    //         let id = 1;
    //         const items = project.tags.map((element) => {
    //             const params = {
    //                 id: (id++).toString(),
    //                 tag: element.name,
    //             };
    //
    //             return interpolate(itemTemplate, params);
    //         });
    //
    //         await this.storageProvider.writeText(pbtxtFileName, items.join(""));
    //     }
    // }
}
