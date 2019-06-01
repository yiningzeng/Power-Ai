import { ExportProvider } from "./exportProvider";
import {IProject, IExportProviderOptions, IActiveLearningSettings} from "../../models/applicationState";
import { IFasterRcnnCondig } from "../../models/trainConfig";
import Guard from "../../common/guard";
import { constants } from "../../common/constants";
import HtmlFileReader from "../../common/htmlFileReader";
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
 * @name - Vott Json Export Provider
 * @description - Exports a project into a single JSON file that include all configured assets
 */
export class CocoExportProvider extends ExportProvider {
    constructor(project: IProject, options: IExportProviderOptions) {
        super(project, options);
        Guard.null(options);
    }
    /**
     * Export project to Coco format
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
        // await this.storageProvider.writeText(`coco-json-export/train-config.yaml`,
        //     YAML.stringify(trainSettings));
        const results = await this.getAssetsForExport();
        await results.forEachAsync(async (assetMetadata) => {
            return new Promise<void>(async (resolve) => {
                const blob = await HtmlFileReader.getAssetBlob(assetMetadata.asset);
                const assetFilePath = `coco-json-export/${assetMetadata.asset.name}`;
                await this.storageProvider.deleteContainer(assetFilePath);
                const fileReader = new FileReader();
                fileReader.onload = async () => {
                    const buffer = Buffer.from(fileReader.result as ArrayBuffer);
                    await this.storageProvider.writeBinary(assetFilePath, buffer);
                    resolve();
                };
                fileReader.readAsArrayBuffer(blob);
            });
        });

        // const exportObject: any = { ...this.project };
        // exportObject.assets = _.keyBy(results, (assetMetadata) => assetMetadata.asset.id);

        const fileName = `coco-json-export/${this.project.name.replace(" ", "-")}${constants.exportCoCoFileExtension}`;
        await this.storageProvider.writeText(fileName, JSON.stringify(results, null, 4));
    }
}
