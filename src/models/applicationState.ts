import { ExportAssetState } from "../providers/export/exportProvider";
import {IYoloV3, IDetectron, IYoloV3Net, NetModelType} from "./trainConfig";
import { IAssetPreviewSettings } from "../react/components/common/assetPreview/assetPreview";

/**
 * @name - Model Path Type
 * @description - Defines the mechanism to load the TF.js model for Active Learning
 * @member Coco - Specifies the default/generic pre-trained Coco-SSD model
 * @member File - Specifies to load a custom model from filesystem
 * @member Url - Specifies to load a custom model from a web server
 */
export enum ModelPathType {
    Coco = "coco",
    File = "file",
    Url = "url",
}

export const DefaultActiveLearningSettings: IActiveLearningSettings = {
    modelPath: "",
    modelUrl: "",
    autoDetect: false,
    predictTag: false,
    modelPathType: ModelPathType.Coco,
};

export const DefaultYolov3Net: IYoloV3Net = {
    batch: 64,
    subdivisions: 32,
    width: 608,
    height: 608,
    channels: 3,
    momentum: 1,
    decay: 0.0005,
    angle: 360,
    saturation: 1.5,
    exposure: 1.5,
    hue: 0.1,
    learning_rate: 0.00025,
    burn_in: 4000,
    max_batches: 100000,
    policy: "steps",
    steps: "80000,90000",
    scales: ".1,.1",
};

export const DefaultYoloV3: IYoloV3 = {
    gpu_numb: 4,
    yolov3net: DefaultYolov3Net,
};

export const DefaultFastrcnn: IDetectron = {
    detectron: {
        netModelType: NetModelType.FasterRcnn,
        layerNumbEnum: "50",
        gpuNumb: 1,
        fpn: true,
        augument: true,
        multiScale: true,
        useFlipped: false,
    },
};

export const DefaultTrainOptions: ITrainFormat = {
    ip: "localhost",
    providerType: "yolov3", // 这里需要改掉
    providerOptions: DefaultYoloV3,
};

export const DefaultExportOptions: IExportFormat = {
    providerType: "powerAi",
    belongToProject: null,
    exportPath: null,
    providerOptions: {
        assetState: ExportAssetState.All,
        testTrainSplit: 100,
        exportUnassigned: false,
    },
};

/**
 * @name - Application State
 * @description - Defines the root level application state
 * @member appSettings - Application wide settings
 * @member connections - Global list of connections available to application
 * @member recentProjects - List of recently used projects
 * @member currentProject - The active project being edited
 * @member appError - error in the app if any
 */
export interface IApplicationState {
    appSettings: IAppSettings;
    connections: IConnection[];
    recentProjects: IProject[];
    currentProject: IProject;
    appError?: IAppError;
}

/**
 * @name - Application Error
 * @description - Defines error detail
 * @member title - title of the error to display
 * @member message - message of the error to display
 * @member errorCode - error category
 */
export interface IAppError {
    errorCode: ErrorCode;
    message: any;
    title?: string;
}

/**
 * Enum of supported error codes
 */
export enum ErrorCode {
    // Note that the value of the enum is in camelCase while
    // the enum key is in Pascal casing
    Unknown = "unknown",
    GenericRenderError = "genericRenderError",
    CanvasError = "canvasError",
    V1ImportError = "v1ImportError",
    ProjectUploadError = "projectUploadError",
    ProjectDeleteError = "projectDeleteError",
    ProjectInvalidJson = "projectInvalidJson",
    ProjectInvalidSecurityToken = "projectInvalidSecurityToken",
    ProjectDuplicateName = "projectDuplicateName",
    SecurityTokenNotFound = "securityTokenNotFound",
    ExportFormatNotFound = "exportFormatNotFound",
    TrainFormatNotFound = "trainFormatNotFound",
    PasteRegionTooBig = "pasteRegionTooBig",
    OverloadedKeyBinding = "overloadedKeyBinding",
    ActiveLearningPredictionError = "activeLearningPredictionError",
}

/**
 * Base application error
 */
export class AppError extends Error implements IAppError {
    public errorCode: ErrorCode;
    public message: string;
    public title?: string;

    constructor(errorCode: ErrorCode, message: string, title: string = null) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
        this.title = title;
    }
}

/**
 * @name - Provider Options
 * @description - Property map of key values used within a export / asset / storage provider
 */
export interface IProviderOptions {
    [key: string]: any;
}

/**
 * @name - Application settings
 * @description - Defines the root level configuration options for the application
 * @member devToolsEnabled - Whether dev tools are current open and enabled
 * @member securityTokens - Token used to encrypt sensitive project settings
 */
export interface IAppSettings {
    titleBarSelectedKeys?: string;
    devToolsEnabled: boolean;
    securityTokens: ISecurityToken[];
    thumbnailSize?: ISize;
    deadline: string;
    zengyining?: boolean;
}

/**
 * 远程主机单台信息类
 */
export interface IRemoteHostItem {
    ip: string;
    name: string;
    platform: string;
}

/**
 * 项目库的单个项目类
 */
export interface IProjectItem {
    name: string;
    baseFolder: string;
    projectFolder: string;
    exportPath?: string;
    imageSize?: [number, number];
}

/**
 * @name - Project
 * @description - Defines the structure of a VoTT project
 * @member id - Unique identifier
 * @member name - User defined name
 * @member securityToken - The Base64 encoded token used to encrypt sensitive project data
 * @member description - User defined description
 * @member tags - User defined list of tags
 * @member sourceConnection - Full source connection details
 * @member targetConnection - Full target connection details
 * @member exportFormat - Full export format definition
 * @member assets - Map of assets within a project
 * @member autoSave - Whether or not the project will automatically save updates to the underlying target
 */
export interface IProject {
    id: string;
    name: string;
    version: string;
    securityToken: string;
    description?: string;
    tags: ITag[];
    sourceConnection: IConnection;
    sourceListConnection: string[];
    targetConnection: IConnection;
    exportFormat: IExportFormat;
    trainFormat: ITrainFormat;
    videoSettings: IProjectVideoSettings;
    activeLearningSettings: IActiveLearningSettings;
    autoSave: boolean;
    assets?: { [index: string]: IAsset };
    lastVisitedAssetId?: string;
}

// region detectron2
export interface ITagDetectron2 {
    id: number;
    name: string;
    isthing: number;
    color: [number, number, number];
}
export interface ICocoCategories {
    things_num: number;
    not_things_num: number;
    categories: ITagDetectron2[];
}
/**
 * 最新的detectron2训练参数
 */
export interface IDetectron2 {
    detectron2Image: string;
    use_gpus: number;
    detectron2: {
        _BASE_: string; // 前端没有设置需要手动
        MODEL: {
            WEIGHTS: string; // 前端没有设置需要手动
            MASK_ON: boolean; // 前端没有设置需要手动
            ROI_HEADS: { NUM_CLASSES: string }; // 前端没有设置需要手动
            RESNETS: { DEPTH: number };
            PIXEL_STD: string;
        };

        SOLVER: {
            MAX_ITER: number;
            STEPS: string; // 前端没有设置需要手动
            IMS_PER_BATCH: string; // 前端没有设置需要手动
        };

        INPUT: {
            MIN_SIZE_TRAIN: string;
            MAX_SIZE_TRAIN: string;
            CROP: {
                ENABLED: string;
                TYPE: string;
                SIZE: string;
            }
        };

        DATALOADER: {
            NUM_WORKERS: string;
            ASPECT_RATIO_GROUPING: string;
            SAMPLER_TRAIN: string;
            REPEAT_THRESHOLD: string;
        };

        DATASETS: {
            TRAIN: string; // 前端没有设置需要手动
            TEST: string; // 前端没有设置需要手动
        };

        OUTPUT_DIR: string; // 前端没有设置需要手动
    };
}
// endregion
/**
 * @name - FileInfo
 * @description - Defines the file information and content for V1 projects
 * @member content - The content of a file (JSON string)
 * @member file - The File object point to the V1 project file
 */
export interface IFileInfo {
    content: string | ArrayBuffer;
    file: File;
}

/**
 * @name - Tag
 * @description - Defines the structure of a VoTT tag
 * @member name - User defined name
 * @member color - User editable color associated to tag
 */
export interface ITag {
    name: string;
    color: string;
}

/**
 * @enum LOCAL - Local storage type
 * @enum CLOUD - Cloud storage type
 * @enum OTHER - Any other storage type
 */
export enum StorageType {
    Local = "local",
    Cloud = "cloud",
    Other = "other",
}

/**
 * @name - Connection
 * @description - Defines a reusable data source definition for projects
 * @member id - Unique identifier for connection
 * @member name - User defined name
 * @member description - User defined short description
 * @member providerType - The underlying storage type (Local File System, Azure Blob Storage, etc)
 * @member providerOptions - Provider specific options used to connect to the data source
 */
export interface IConnection {
    id: string;
    name: string;
    description?: string;
    providerType: string;
    providerOptions: IProviderOptions | ISecureString;
    providerOptionsOthers?: IProviderOptions[] | ISecureString[]; // 这里新增其他文件夹
}

/**
 * @name - Export Provider Options
 * @description - options defining the type of asset to export
 * @member assetState - export asset with the following state
 */
export interface IExportProviderOptions extends IProviderOptions {
    assetState: ExportAssetState;
}

/**
 * @name - Export Format
 * @description - Defines the settings for how project data is exported into commonly used format
 * @member id - Unique identifier for export format
 * @member name - Name of export format
 * @member providerType - The export format type (TF Records, YOLO, CSV, etc)
 * @member providerOptions - The provider specific option required to export data
 */
export interface IExportFormat {
    providerType: string;
    belongToProject: IProjectItem; // 用于标识属于哪个项目，后面导出的时候要导出到项目文件夹
    exportPath: string; // 导出存放的基本路径 MissData:pcb板号查询的图片标记保存的地址 CollectData: 打开远程的图片标记的保存的目录 AtuoTrainData:远程复制保存的目录
    providerOptions: IExportProviderOptions | ISecureString;
}

export enum ExportPath {
    TestData = "TestData",
    MissData = "MissData",
    CollectData = "CollectData",
    AtuoTrainData = "AtuoTrainData",
}

/**
 * @name - Video Tagging Settings for the project
 * @description - Defines the video settings within a VoTT project
 * @member frameExtractionRate - Extraction rate for a video (number of frames per second of video)
 */
export interface IProjectVideoSettings {
    frameExtractionRate: number;
}

/**
 * Properties for additional project settings
 * @member activeLearningSettings - Active Learning settings
 */
export interface IAdditionalPageSettings extends IAssetPreviewSettings {
    activeLearningSettings: IActiveLearningSettings;
}

/**
 * @name - Active Learning Settings for the project
 * @description - Defines the active learning settings within a VoTT project
 * @member modelPathType - Model loading type ["coco", "file", "url"]
 * @member modelPath - Local filesystem path to the TF.js model
 * @member modelUrl - Web url to the TF.js model
 * @member autoDetect - Flag for automatically call the model while opening a new asset
 * @member predictTag - Flag to predict also the tag name other than the rectangle coordinates only
 */
export interface IActiveLearningSettings {
    modelPathType: ModelPathType;
    modelPath?: string;
    modelUrl?: string;
    autoDetect: boolean;
    predictTag: boolean;
}

export interface ITrainFormat {
    ip: string;
    providerType: string;
    tarBaseName?: string;
    providerOptions: IYoloV3 | IDetectron | IDetectron2;
}

/**
 * @name - Asset Video Settings
 * @description - Defines the settings for video assets
 * @member shouldAutoPlayVideo - true if the video should auto play when loaded, false otherwise
 * @member posterSource - Source location of the image to display when the video is not playing,
 * null for default (first frame of video)
 */
export interface IAssetVideoSettings {
    shouldAutoPlayVideo: boolean;
    posterSource: string;
    shouldShowPlayControls: boolean;
}

export interface IAssetsAndTags {
    assets: IAsset[];
    tags: ITag[];
}

/**
 * @name - Asset
 * @description - Defines an asset within a VoTT project
 * @member id - Unique identifier for asset
 * @member type - Type of asset (Image, Video, etc)
 * @member name - Generated name for asset
 * @member path - Relative path to asset within the underlying data source
 * @member size - Size / dimensions of asset
 * @member format - The asset format (jpg, png, mp4, etc)
 * @member tagType - 用于在导出power-ai格式的数据时，区分标签文件夹所设的 用于判断当前的素材，已经标记的标签的多样性
 */
export interface IAsset {
    id: string;
    type: AssetType;
    state: AssetState;
    name: string;
    path: string;
    size: ISize;
    format?: string;
    timestamp?: number;
    parent?: IAsset;
    predicted?: boolean;
    tagType?: string;
    tags?: string;
}

/**
 * @name - Asset Metadata
 * @description - Format to store asset metadata for each asset within a project
 * @member asset - References an asset within the project
 * @member regions - The list of regions drawn on the asset
 */
export interface IAssetMetadata {
    asset: IAsset;
    regions: IRegion[];
    version: string;
}

/**
 * @name - Size
 * @description - Defines the size and/or diminsion for an asset
 * @member width - The actual width of an asset
 * @member height - The actual height of an asset
 */
export interface ISize {
    width: number;
    height: number;
}

/**
 * 图像编辑界面缩放接口参数
 */
export interface IZoomMode {
    disableDrag: boolean;
    x: number;
    y: number;
    miniWidth: number;
    miniHeight: number;
    width: number | string;
    height: number | string;
    zoomCenterX: number;
    zoomCenterY: number;
}

/**
 * @name - Region
 * @description - Defines a region within an asset
 * @member id - Unique identifier for this region
 * @member type - Defines the type of region
 * @member tags - Defines a list of tags applied to a region
 * @member points - Defines a list of points that define a region
 */
export interface IRegion {
    id: string;
    type: RegionType;
    tags: string[];
    confirmTags?: string[]; // 版本新增的数据
    points?: IPoint[];
    boundingBox?: IBoundingBox;
}

/**
 * @name - Bounding Box
 * @description - Defines the tag usage within a bounding box region
 * @member left - Defines the left x boundary for the start of the bounding box
 * @member top - Defines the top y boundary for the start of the boudning box
 * @member width - Defines the width of the bounding box
 * @member height - Defines the height of the bounding box
 */
export interface IBoundingBox {
    left: number;
    top: number;
    width: number;
    height: number;
}

/**
 * @name - Point
 * @description - Defines a point / coordinate within a region
 * @member x - The x value relative to the asset
 * @member y - The y value relative to the asset
 */
export interface IPoint {
    x: number;
    y: number;
}

/**
 * @name - Asset Type
 * @description - Defines the type of asset within a project
 * @member Image - Specifies an asset as an image
 * @member Video - Specifies an asset as a video
 */
export enum AssetType {
    Unknown = 0,
    Image = 1,
    Video = 2,
    VideoFrame = 3,
    TFRecord = 4,
}

/**
 * @name - Asset State
 * @description - Defines the state of the asset with regard to the tagging process
 * @member NotVisited - Specifies as asset that has not yet been visited or tagged
 * @member Visited - Specifies an asset has been visited, but not yet tagged
 * @member Tagged - Specifies an asset has been visited and tagged
 */
export enum AssetState {
    NotVisited = 0,
    Visited = 1,
    Tagged = 2,
    OkTagged = 3,
}

/**
 * @name - Region Type
 * @description - Defines the region type within the asset metadata
 * @member Square - Specifies a region as a square
 * @member Rectangle - Specifies a region as a rectangle
 * @member Polygon - Specifies a region as a multi-point polygon
 */
export enum RegionType {
    Polyline = "POLYLINE",
    Point = "POINT",
    Rectangle = "RECTANGLE",
    Polygon = "POLYGON",
    Pencil = "PENCIL",
    Square = "SQUARE",
}

export enum EditorMode {
    Rectangle = "RECT",
    Polygon = "POLYGON",
    Pencil = "PENCIL",
    Polyline = "POLYLINE",
    Point = "POINT",
    Select = "SELECT",
    CopyRect = "COPYRECT",
    None = "NONE",
}

export interface ISecureString {
    encrypted: string;
}

export interface ISecurityToken {
    name: string;
    key: string;
}

export interface ITFRecordMetadata {
    width: number;
    height: number;
    xminArray: number[];
    yminArray: number[];
    xmaxArray: number[];
    ymaxArray: number[];
    textArray: string[];
}
