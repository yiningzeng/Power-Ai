import _ from "lodash";
import { ExportProvider } from "./exportProvider";
import {IProject, IExportProviderOptions, IAssetMetadata, IAsset, AssetState} from "../../models/applicationState";
import Guard from "../../common/guard";
import { constants } from "../../common/constants";
import HtmlFileReader from "../../common/htmlFileReader";

/**
 * VoTT Json Export Provider options
 */
export interface IPowerAiExportProviderOptions extends IExportProviderOptions {
    /** Whether or not to include binary assets in target connection */
    includeImages: boolean;
}

/**
 * @name - Vott Json Export Provider
 * @description - Exports a project into a single JSON file that include all configured assets
 */
export class PowerAiExportProvider extends ExportProvider<IPowerAiExportProviderOptions> {
    constructor(project: IProject, options: IPowerAiExportProviderOptions) {
        super(project, options);
        Guard.null(options);
    }

    /**
     * Export project to VoTT JSON format
     */
    public async export(): Promise<void> {
        const results = await this.getAssetsForExport();
        const exportFolderName = `${this.project.name.replace(/\s/g, "-")}-power-ai-export`;
        await this.storageProvider.deleteContainer(exportFolderName);
        await this.storageProvider.createContainer(exportFolderName);
        const finalResults: IAsset[] = [];
        // console.log(`数据:${JSON.stringify(results)}`);
        // await this.storageProvider.writeText(`${exportFolderName}/数据.json`, JSON.stringify(results, null, 4));
        await results.forEachAsync(async (assetMetadata) => {
            return new Promise<void>(async (resolve) => {
                try {
                    const tempAssetMetadata: IAssetMetadata = {
                        ...assetMetadata,
                        asset: {
                            ...assetMetadata.asset,
                            path: "file:${path}" + assetMetadata.asset.name,
                        },
                    };
                    console.log(`filename: ${decodeURI(assetMetadata.asset.name)}`);
                    finalResults.push(tempAssetMetadata.asset);
                    const blob = await HtmlFileReader.getAssetTransferBlob(assetMetadata.asset);
                    if (blob == null) {
                        resolve();
                        return;
                    }
                    const assetFilePath = `${exportFolderName}/${assetMetadata.asset.name}`;
                    if (assetMetadata && assetMetadata.asset.state === AssetState.Tagged) {
                        // region 导出异常问题在这
                        // 已经找到问题所在 主要原因是个别图片对应的标文件不存在
                        console.log(`导出Power-ai ===========start=================`);
                        console.log(`导出Power-ai ${assetMetadata.asset.id}`);
                        console.log(`导出Power-ai assetMetadata: \n${JSON.stringify(assetMetadata)}`);
                        // const co = await this.storageProvider.readText(`${assetMetadata.asset.id}
                        // ${constants.assetMetadataFileExtension}`);
                        // console.log(`导出问题1${assetMetadata.asset.id}: ${content}`);
                        // const tagAsset = JSON.parse(content);
                        const changeTagAsset = {
                            ...assetMetadata,
                            asset: {
                                ...assetMetadata["asset"],
                                path: "file:${path}" + assetMetadata["asset"]["name"],
                            },
                        };
                        console.log(`导出Power-ai ${assetMetadata.asset.id}: ${JSON.stringify(changeTagAsset)}`);
                        await this.storageProvider.writeText(`${exportFolderName}/${assetMetadata.asset.id}${constants.assetMetadataFileExtension}`,
                            JSON.stringify(changeTagAsset, null, 4));
                        console.log(`导出Power-ai ${assetMetadata.asset.id}: 保存本地`);
                        console.log(`导出Power-ai ===========end=================`);
                        // endregion
                    }
                    const fileReader = new FileReader();
                    fileReader.onload = async () => {
                        try {
                            const buffer = Buffer.from(fileReader.result as ArrayBuffer);
                            await this.storageProvider.writeBinary(decodeURI(assetFilePath), buffer);
                            console.log(`fuck:2   ${assetMetadata.asset.id}`);
                            resolve();
                        } catch (e) {
                            console.error(e);
                        }
                    };
                    fileReader.readAsArrayBuffer(blob);
                } catch (e) {
                    await this.storageProvider.writeText(`${exportFolderName}/error-${decodeURI(assetMetadata.asset.name)}.log`, e);
                }
            });
        });
        try {
            const exportObject = {...this.project};
            exportObject.assets = _.keyBy(finalResults, (asset) => asset.id) as any;

            // We don't need these fields in the export JSON
            delete exportObject.sourceConnection;
            delete exportObject.targetConnection;
            delete exportObject.exportFormat;
            delete exportObject.trainFormat;
            delete exportObject.activeLearningSettings;
            delete exportObject.securityToken;
            delete exportObject.lastVisitedAssetId;
            delete exportObject.name;
            delete exportObject.id;

            const fileName = `${exportFolderName}/${constants.importFileExtension}`;
            await this.storageProvider.writeText(fileName, JSON.stringify(exportObject, null, 4));
        } catch (e) {
            await this.storageProvider.writeText(`${exportFolderName}/error.log`, e);
        }
    }
}
