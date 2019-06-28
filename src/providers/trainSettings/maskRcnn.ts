import _ from "lodash";
import { TrainProvider } from "./trainProvider";
import { IProject, IAssetMetadata, ITag, IExportProviderOptions } from "../../models/applicationState";
import Guard from "../../common/guard";
import { IFasterRcnnCondig } from "../../models/trainConfig";
import YAML from "json2yaml";

const trainSettings: IFasterRcnnCondig  = {
    MODEL: {
        TYPE: "generalized_rcnn",
        CONV_BODY: "FPN.add_fpn_ResNet50_conv5_body",
        NUM_CLASSES: 3,
        FASTER_RCNN: true,
    },
    NUM_GPUS: 2,
    SOLVER: {
        WEIGHT_DECAY: 0.0001,
        LR_POLICY: "steps_with_decay",
        BASE_LR: 0.0025,
        GAMMA: 0.1,
        MAX_ITER: 60000,
        STEPS: [0, 30000, 40000],
    },
    FPN: {
        FPN_ON: true,
        MULTILEVEL_ROIS: true,
        MULTILEVEL_RPN: true,
    },
    FAST_RCNN: {
        ROI_BOX_HEAD: "fast_rcnn_heads.add_roi_2mlp_head",
        ROI_XFORM_METHOD: "RoIAlign",
        ROI_XFORM_RESOLUTION: 7,
        ROI_XFORM_SAMPLING_RATIO: 2,
    },
    TRAIN: {
        WEIGHTS: "/Detectron/models/R-50.pkl",
        DATASETS: "('coco_2014_train',)",
        SCALES: "(500,)",
        MAX_SIZE: 833,
        BATCH_SIZE_PER_IM: 256,
        RPN_PRE_NMS_TOP_N: 2000,
        AUGUMENT: true, // 数据增强
        MULTI_SCALE: true, // 多尺度
        USE_FLIPPED: false,
    },
    TEST: {
        DATASETS: "('coco_2014_minival',)",
        SCALE: 500,
        MAX_SIZE: 833,
        NMS: 0.5,
        RPN_PRE_NMS_TOP_N: 1000,
        RPN_POST_NMS_TOP_N: 1000,
    },
    OUTPUT_DIR: ".",
};

/**
 * Export options for Pascal VOC Export Provider
 */
export interface IFasterRcnnProviderOptions extends IExportProviderOptions {
    /** The test / train split ratio for exporting data */
    testTrainSplit?: number;
    /** Whether or not to include unassigned tags in exported data */
    exportUnassigned?: boolean;
}

/**
 * @name - PascalVOC Export Provider
 * @description - Exports a project into a Pascal VOC
 */
export class MaskRcnnProvider extends TrainProvider<IFasterRcnnProviderOptions> {

    constructor(project: IProject, options: IFasterRcnnProviderOptions) {
        super(project, options);
        Guard.null(options);
    }

    /**
     * Export project to PascalVOC
     */
    public async export(): Promise<void> {
        // trainSettings.MODEL.NUM_CLASSES = this.project.tags.length + 1;
        // trainSettings.TRAIN.AUGUMENT = this.project.trainSettings.augument;
        // trainSettings.TRAIN.MULTI_SCALE = this.project.trainSettings.multiScale;
        // trainSettings.TRAIN.USE_FLIPPED = this.project.trainSettings.useFlipped;
        // trainSettings.NUM_GPUS = this.project.trainSettings.gpuNumb;
        // switch (this.project.trainSettings.layerNumbEnum) {
        //     case "50":
        //         trainSettings.TRAIN.WEIGHTS = "/Detectron/models/R-50.pkl";
        //         break;
        //     case "101":
        //         trainSettings.TRAIN.WEIGHTS = "/Detectron/models/R-101.pkl";
        //         break;
        // }
        // switch (this.project.trainSettings.gpuNumb) {
        //     case 1:
        //         trainSettings.SOLVER.BASE_LR = 0.0025;
        //         trainSettings.SOLVER.MAX_ITER = 60000;
        //         trainSettings.SOLVER.STEPS = [0, 30000, 40000];
        //         break;
        //     case 2:
        //         trainSettings.SOLVER.BASE_LR = 0.005;
        //         trainSettings.SOLVER.MAX_ITER = 30000;
        //         trainSettings.SOLVER.STEPS = [0, 15000, 20000];
        //         break;
        //     case 4:
        //         trainSettings.SOLVER.BASE_LR = 0.01;
        //         trainSettings.SOLVER.MAX_ITER = 15000;
        //         trainSettings.SOLVER.STEPS = [0, 7500, 10000];
        //         break;
        //     case 8:
        //         trainSettings.SOLVER.BASE_LR = 0.02;
        //         trainSettings.SOLVER.MAX_ITER = 7500;
        //         trainSettings.SOLVER.STEPS = [0, 3750, 5000];
        //         break;
        // }
        await this.storageProvider.writeText(`coco-json-export/train-config.yaml`,
            YAML.stringify(trainSettings));
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
