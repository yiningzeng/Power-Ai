// region 界面参数
export interface IYoloV3 {
    yolov3net: IYoloV3Net;
}

export interface IDetectron {
    detectron: {
        netModelType: NetModelType,
        layerNumbEnum: string;
        gpuNumb: number;
        augument: boolean;
        multiScale: boolean;
        useFlipped: boolean;
    };
}
// endregion

// region yolov3
export interface IYoloV3Net {
    batch: number;
    subdivisions: number;
    width: number;
    height: number;
    channels: number;
    momentum: number;
    decay: number;
    angle: number;
    saturation: number;
    exposure: number;
    hue: number;
    learning_rate: number; // 0.001;
    burn_in: number; // 1000;
    max_batches: number; // 500200;
    policy: string; // steps;
    steps: string; // 400000,450000;
    scales: string; // .1,.1;
}
// endregion yolov3

// region detectron
export enum NetModelType {
    MaskRcnn = "maskRcnn",
    RetinaNet = "retinaNet",
    FasterRcnn = "fasterRcnn",
    YoloV3 = "yoloV3",
}

// fasterRcnn 配置文件的接口
export interface IFasterRcnnCondig {
    MODEL: IMODEL;
    NUM_GPUS: number;
    SOLVER: ISOLVER;
    FPN: IFPN;
    FAST_RCNN: IFASTRCNN;
    TRAIN: ITRAIN;
    TEST: ITEST;
    OUTPUT_DIR: string;
}

export interface IMODEL {
    TYPE: string;
    CONV_BODY: string;
    NUM_CLASSES: number;
    FASTER_RCNN: true;
}

export interface ISOLVER {
    WEIGHT_DECAY: number;
    LR_POLICY: string;
    BASE_LR: number;
    GAMMA: number;
    MAX_ITER: number;
    STEPS: [number, number, number];
}

export interface IFPN {
    FPN_ON: true;
    MULTILEVEL_ROIS: true;
    MULTILEVEL_RPN: true;
}

export interface IFASTRCNN {
    ROI_BOX_HEAD: string;
    ROI_XFORM_METHOD: string;
    ROI_XFORM_RESOLUTION: number;
    ROI_XFORM_SAMPLING_RATIO: number;
}

export interface ITRAIN {
    WEIGHTS: string;
    DATASETS: string;
    SCALES: string;
    MAX_SIZE: number;
    BATCH_SIZE_PER_IM: number;
    RPN_PRE_NMS_TOP_N: number;
    AUGUMENT: boolean; // 数据增强
    MULTI_SCALE: boolean; // 多尺度
    USE_FLIPPED: boolean; // 图像旋转
}

export interface ITEST {
    DATASETS: string;
    SCALE: number;
    MAX_SIZE: number;
    NMS: number;
    RPN_PRE_NMS_TOP_N: number;
    RPN_POST_NMS_TOP_N: number;
}
// endregion detectron
