export interface IFasterRcnn {
    MODEL: IMODEL;
    NUM_GPUS: number;
    SOLVER: ISOLVER;
    FPN: IFPN;
    FAST_RCNN: IFASTRCNN;
    TRAIN: ITRAIN;
    TEST: ITEST;
    OUTPUT_DIR: string;
    Data_Enhancement: boolean; // 数据增强
    Multi_Scale: boolean; // 多尺度
    Use_Flipped: boolean; // 图像旋转
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
}

export interface ITEST {
    DATASETS: string;
    SCALE: number;
    MAX_SIZE: number;
    NMS: number;
    RPN_PRE_NMS_TOP_N: number;
    RPN_POST_NMS_TOP_N: number;
}
