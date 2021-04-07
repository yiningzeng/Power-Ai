import Guard from "../../common/guard";
import {
    IProject, IExportFormat, IAssetMetadata, IAsset,
    AssetState, AssetType, IExportProviderOptions,
} from "../../models/applicationState";
import { IStorageProvider, StorageProviderFactory } from "../storage/storageProviderFactory";
import { IAssetProvider, AssetProviderFactory } from "../storage/assetProviderFactory";
import _ from "lodash";
import { AssetService } from "../../services/assetService";
import {normalizeSlashes} from "../../common/utils";
import path from "path";
import axios from "axios";
import moment from "moment";

/**
 * @name - TF Pascal VOC Records Export Asset State
 * @description - Defines the asset type export option
 * @member All - Specifies that all assets will be exported
 * @member Visited - Specifies that visited (including tagged) assets will be exported
 * @member Tagged - Specifies that only tagged assets will be exported
 */
export enum ExportAssetState {
    All = "all",
    Visited = "visited",
    Tagged = "tagged",
}

export interface IExportAssetResult {
    asset: IAssetMetadata;
    success: boolean;
    error?: string;
}

export interface IExportResults {
    completed: IExportAssetResult[];
    errors: IExportAssetResult[];
    count: number;
}

export interface ITrainConfigResults {
    success: boolean;
}

/**
 * 训练函数返回结果
 */
export interface IStartTrainResults {
    success: boolean;
    msg: string;
    tarPath?: string;
    tarBaseName?: string;
    tarName?: string;
    sourcePath?: string;
    assetsBasePath?: string;
}

/**
 * 测试接口返回
 */
export interface IStartTestResults {
    success: boolean;
    msg: string;
    list?: [];
}
/**
 * @name - IExportProvider
 * @description - Defines the required interface for all VoTT export providers
 */
export interface IExportProvider {
    /**
     * Gets or set the project to be exported
     */
    project: IProject;

    /**
     * Exports the configured project for specified export configuration
     */
    export(): Promise<void> | Promise<IExportResults>;
    save?(exportFormat: IExportFormat): Promise<any>;
}

/**
 * Base class implementation for all VoTT export providers
 * Provides quick access to the configured projects asset & storage providers
 */
export abstract class ExportProvider
    <TOptions extends IExportProviderOptions = IExportProviderOptions> implements IExportProvider {
    private storageProviderInstance: IStorageProvider;
    private assetProviderInstance: IAssetProvider;
    private assetService: AssetService;

    constructor(public project: IProject, protected options?: TOptions) {
        Guard.null(project);
        this.assetService = new AssetService(this.project);
    }

    public abstract export(): Promise<void> | Promise<IExportResults>;

    public async saveProjectInfoToMariaDb(): Promise<string> {
        await this.project.tags.mapAsync(async (v) => {
            axios.post("http://localhost:8080/v1/qt_labels/", {
                CreateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                LabelName: v.name,
                ProjectId: {
                    Id: this.project.exportFormat.belongToProject.Id,
                    ProjectName: this.project.exportFormat.belongToProject.ProjectName,
                },
                Remarks: v.color,
            }).then((response) => {
                // alert(JSON.stringify(response));
                // if (response.data["Code"] === 200 ) {
                // } else {
                // }
            }).catch((error) => {
                // handle error
                console.log(error);
            }).then(() => {
                // always executed
            });
        });
        return "aa";
    }
    /**
     * Gets the assets that are configured to be exported based on the configured asset state
     */
    public async getAssetsForExport(): Promise<IAssetMetadata[]> {
        let predicate: (asset: IAsset) => boolean = null;

        const getProjectAssets = () => Promise.resolve(_.values(this.project.assets));
        const getAllAssets = async () => {
            const projectAssets = await getProjectAssets();

            return _(projectAssets)
                .concat((await this.assetProvider.getAssets()))
                .uniqBy((asset) => asset.id)
                .value();
        };

        let getAssetsFunc: () => Promise<IAsset[]> = getProjectAssets;

        switch (this.options.assetState) {
            case ExportAssetState.Visited:
                predicate = (asset) => asset.state === AssetState.Visited || asset.state === AssetState.Tagged;
                break;
            case ExportAssetState.Tagged:
                predicate = (asset) => asset.state === AssetState.Tagged;
                break;
            case ExportAssetState.All:
            default:
                getAssetsFunc = getAllAssets;
                predicate = () => true;
                break;
        }

        return (await getAssetsFunc())
            .filter((asset) => asset.type !== AssetType.Video)
            .filter(predicate)
            .mapAsync(async (asset) => await this.assetService.getAssetMetadata(asset));
    }

    protected get getSaveAsDateFolder(): boolean {
        // 保存为单独的文件夹？新建然后把导出的素材保存在这
        return (this.project.exportFormat.exportPath && this.project.exportFormat.belongToProject) ? true : false;
    }
    /**
     * Gets the storage provider for the current project
     */
    protected get storageProvider(): IStorageProvider {
        if (this.storageProviderInstance) {
            return this.storageProviderInstance;
        }
        // 这里主要判断是不是远程的标注！如果是的话就保存在本地的项目目录下
        if (this.project.exportFormat.exportPath && this.project.exportFormat.belongToProject) {
            const folder = path.join(this.project.exportFormat.belongToProject.AssetsPath,
                this.project.exportFormat.exportPath);
            const options = {
                    ...this.project.targetConnection.providerOptions,
                    folderPath: normalizeSlashes(folder),
                    providerOptions: {
                        folderPath: normalizeSlashes(folder),
                    },
                    providerOptionsOthers: [{
                        folderPath: normalizeSlashes(folder),
                    }],
                };
            this.storageProviderInstance = StorageProviderFactory.create(
                this.project.targetConnection.providerType,
                options,
            );
        } else { // 不是远程的项目
            this.storageProviderInstance = StorageProviderFactory.create(
                this.project.targetConnection.providerType,
                this.project.targetConnection.providerOptions,
            );
        }
        return this.storageProviderInstance;
    }

    /**
     * Gets the asset provider for the current project
     */
    protected get assetProvider(): IAssetProvider {
        if (this.assetProviderInstance) {
            return this.assetProviderInstance;
        }

        this.assetProviderInstance = AssetProviderFactory.create(
            this.project.sourceConnection.providerType,
            this.project.sourceConnection.providerOptions,
        );

        return this.assetProviderInstance;
    }
}
