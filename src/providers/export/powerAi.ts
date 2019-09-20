import _ from "lodash";
import { ExportProvider } from "./exportProvider";
import {IProject, IExportProviderOptions, IAssetMetadata, IAsset} from "../../models/applicationState";
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
        await results.forEachAsync(async (assetMetadata) => {
            return new Promise<void>(async (resolve) => {
                try {
                    const tempAssetMetadata: IAssetMetadata = {
                        ...assetMetadata,
                        asset: {
                            ...assetMetadata.asset,
                            path: "file:${path}/" + assetMetadata.asset.name,
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
                    if (assetMetadata.asset.state === 2) {
                        const tagAsset = JSON.parse(await this.storageProvider.readText(`${assetMetadata.asset.id}${constants.assetMetadataFileExtension}`));
                        const changeTagAsset = {
                            ...tagAsset,
                            asset: {
                                ...tagAsset["asset"],
                                path: "file:${path}/" + tagAsset["asset"]["name"],
                            },
                        };
                        console.log(`fufufufuf: ${JSON.stringify(changeTagAsset)}`);
                        await this.storageProvider.writeText(`${exportFolderName}/${assetMetadata.asset.id}${constants.assetMetadataFileExtension}`,
                            JSON.stringify(changeTagAsset, null, 4));
                    }
                    const fileReader = new FileReader();
                    fileReader.onload = async () => {
                        const buffer = Buffer.from(fileReader.result as ArrayBuffer);
                        await this.storageProvider.writeBinary(decodeURI(assetFilePath), buffer);
                        console.log(`fuck:2   ${assetMetadata.asset.id}`);
                        resolve();
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
