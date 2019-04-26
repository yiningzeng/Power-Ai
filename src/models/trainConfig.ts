
export interface IFasterRcnn {
    MODEL: {
            TYPE: "generalized_rcnn",
            CONV_BODY: "FPN.add_fpn_ResNet50_conv5_body",
            NUM_CLASSES: number,
            FASTER_RCNN: true };
    NUM_GPUS: number;
    SOLVER: {
            WEIGHT_DECAY: 0.0001
            LR_POLICY: "steps_with_decay",
            BASE_LR: 0.0025,
            GAMMA: 0.1,
            MAX_ITER: 60000,
            STEPS: [0, 30000, 40000] };
    FPN: {
            FPN_ON: true,
            MULTILEVEL_ROIS: true,
            MULTILEVEL_RPN: true };
    FAST_RCNN: {
            ROI_BOX_HEAD: "fast_rcnn_heads.add_roi_2mlp_head",
            ROI_XFORM_METHOD: "RoIAlign",
            ROI_XFORM_RESOLUTION: 7,
            ROI_XFORM_SAMPLING_RATIO: 2 };
    TRAIN: {
            WEIGHTS: "/Detectron/models/R-50.pkl",
            DATASETS: "('coco_2014_train',)",
            SCALES: "(500,)",
            MAX_SIZE: 833,
            BATCH_SIZE_PER_IM: 256,
            RPN_PRE_NMS_TOP_N: 2000 };
    TEST: {
            DATASETS: "('coco_2014_minival',)",
            SCALE: 500,
            MAX_SIZE: 833,
            NMS: 0.5,
            RPN_PRE_NMS_TOP_N: 1000,
            RPN_POST_NMS_TOP_N: 1000 };
    OUTPUT_DIR: ".";
}
