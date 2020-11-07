import MD5 from "md5.js";
import _ from "lodash";
import * as shortid from "shortid";
import Guard from "../common/guard";
import {
    AssetState,
    AssetType,
    IAsset,
    IAssetMetadata,
    IAssetsAndTags,
    IProject,
    IRegion,
    ITag,
    ITFRecordMetadata,
    RegionType,
} from "../models/applicationState";
import {AssetProviderFactory, IAssetProvider} from "../providers/storage/assetProviderFactory";
import {IStorageProvider, StorageProviderFactory} from "../providers/storage/storageProviderFactory";
import {constants} from "../common/constants";
import HtmlFileReader from "../common/htmlFileReader";
import {TFRecordsReader} from "../providers/export/tensorFlowRecords/tensorFlowReader";
import {FeatureType} from "../providers/export/tensorFlowRecords/tensorFlowBuilder";
import {appInfo} from "../common/appInfo";
import {encodeFileURI, randomIntInRange} from "../common/utils";
import {LocalFileSystemProxy} from "../providers/storage/localFileSystemProxy";
// tslint:disable-next-line:no-var-requires
const tagColors = require("../react/components/common/tagColors.json");
/**
 * @name - Asset Service
 * @description - Functions for dealing with project assets
 */
export class AssetService {
    /**
     * Create IAsset from filePath
     * @param filePath - filepath of asset
     * @param fileName - name of asset
     */
    public static createAssetFromFilePath(filePath: string, fileName?: string): IAsset {
        Guard.empty(filePath);

        const normalizedPath = filePath.toLowerCase();
        // If the path is not already prefixed with a protocol
        // then assume it comes from the local file system
        if (!normalizedPath.startsWith("http://") &&
            !normalizedPath.startsWith("https://") &&
            !normalizedPath.startsWith("file:")) {
            // First replace \ character with / the do the standard url encoding then encode unsupported characters
            filePath = encodeFileURI(filePath, true);
        }

        const md5Hash = new MD5().update(filePath).digest("hex");
        const pathParts = filePath.split(/[\\\/]/);
        // Example filename: video.mp4#t=5
        // fileNameParts[0] = "video"
        // fileNameParts[1] = "mp4"
        // fileNameParts[2] = "t=5"
        fileName = fileName || pathParts[pathParts.length - 1];
        const fileNameParts = fileName.substring(0, fileName.lastIndexOf("."));
        const extensionParts = fileName.substr(fileName.lastIndexOf(".") + 1);
        const assetType = this.getAssetType(extensionParts);
        return {
            // id: md5Hash,
            id: decodeURI(fileNameParts),
            format: extensionParts,
            state: AssetState.NotVisited,
            type: assetType,
            name: fileName,
            path: filePath,
            size: null,
        };
    }

    /**
     * Get Asset Type from format (file extension)
     * @param format - File extension of asset
     */
    public static getAssetType(format: string): AssetType {
        switch (format.toLowerCase()) {
            case "gif":
            case "jpg":
            case "jpeg":
            case "tif":
            case "tiff":
            case "png":
            case "bmp":
                return AssetType.Image;
            case "mp4":
            case "mov":
            case "avi":
            case "m4v":
            case "mpg":
            case "wmv":
                return AssetType.Video;
            case "tfrecord":
                return AssetType.TFRecord;
            default:
                return AssetType.Unknown;
        }
    }

    private assetProviderInstance: IAssetProvider;
    private storageProviderInstance: IStorageProvider;

    constructor(private project: IProject) {
        Guard.null(project);
    }

    /**
     * Get Asset Provider from project's source connction
     */
    protected get assetProvider(): IAssetProvider {
        if (!this.assetProviderInstance) {
            this.assetProviderInstance = AssetProviderFactory.create(
                this.project.sourceConnection.providerType,
                this.project.sourceConnection.providerOptions,
            );

            return this.assetProviderInstance;
        }
    }

    /**
     * Get Storage Provider from project's target connection
     */
    protected get storageProvider(): IStorageProvider {
        if (!this.storageProviderInstance) {
            this.storageProviderInstance = StorageProviderFactory.create(
                this.project.targetConnection.providerType,
                this.project.targetConnection.providerOptions,
            );
        }
        return this.storageProviderInstance;
    }

    /**
     * Get assets from provider
     */
    public async getAssets(): Promise<IAsset[]> {
        return await this.assetProvider.getAssets();
    }

    /**
     * Get assets from provider
     */
    public async getAssetsWithFolder(folder): Promise<IAsset[]> {
        if (!this.assetProviderInstance) {
            this.assetProviderInstance = AssetProviderFactory.create(
                "localFileSystemProxy",
                {
                    folderPath: folder,
                },
            );
        }
        const assets = await this.assetProviderInstance.getAssets();
        const updates = await assets.mapAsync(async (asset) => {
            const assetMetadata = await this.getAssetMetadata(asset);
            if (assetMetadata.asset) {
                return {
                    ...asset,
                    size: assetMetadata.asset.size,
                    state: assetMetadata.asset.state,
                    tags: assetMetadata.asset.tags,
                };
            } else {
                return asset;
            }
        });
        return updates;
    }

    public getNextColor = (tags) => {
        if (tags.length > 0) {
            const lastColor = tags[tags.length - 1].color;
            const lastIndex = tagColors.findIndex((color) => color === lastColor);
            let newIndex;
            if (lastIndex > -1) {
                newIndex = (lastIndex + 1) % tagColors.length;
            } else {
                newIndex = randomIntInRange(0, tagColors.length - 1);
            }
            return tagColors[newIndex];
        } else {
            return tagColors[0];
        }
    }

    public async getAssetsWithFolderMain(folder): Promise<IAssetsAndTags> {
        if (!this.storageProviderInstance) {
            this.storageProviderInstance = StorageProviderFactory.create(
                "localFileSystemProxy",
                {
                    folderPath: folder,
                },
            );
        }
        if (!this.assetProviderInstance) {
            this.assetProviderInstance = AssetProviderFactory.create(
                "localFileSystemProxy",
                {
                    folderPath: folder,
                },
            );
        }
        let res: IAssetsAndTags;
        let taggs = [];
        const finalTags: ITag[] = [];
        const exitsColor = await this.getColors();
        const assets = await this.assetProviderInstance.getAssets();
        console.log(`获取到的颜色 ${JSON.stringify(finalTags)}`);
        const updates = await assets.mapAsync(async (asset) => {
            const assetMetadata = await this.getAssetMetadata(asset);
            const comVersionRes = this.compareVersion(assetMetadata.version, appInfo.version);
            if (comVersionRes === 0) {
                console.log(assetMetadata.asset.name + "版本一致");
            } else if (comVersionRes > 0) {
                console.log(assetMetadata.asset.name + "更新的版本");
            } else if (comVersionRes < 0) {
                console.log(assetMetadata.asset.name + "老版本的数据");
                this.upgradeAssetMetadata(assetMetadata);
            }
            if (assetMetadata.asset) {
                if (assetMetadata.asset.tags) {
                    if (assetMetadata.asset.tags.indexOf(",") > 0) {
                        taggs = taggs.concat(assetMetadata.asset.tags.split(","));
                    } else {
                        taggs.push(assetMetadata.asset.tags);
                    }
                }
                const newAsset = {
                    ...asset,
                    path: `file:${folder}/${asset.name}`,
                    size: assetMetadata.asset.size,
                    state: assetMetadata.asset.state,
                    tags: assetMetadata.asset.tags,
                };
                this.save({
                    ...assetMetadata,
                    asset: newAsset,
                });
                return newAsset;
            } else {
                const newAsset = {
                    ...asset,
                    path: `file:${folder}/${asset.name}`,
                };
                this.save({
                    ...assetMetadata,
                    asset: newAsset,
                });
                return newAsset;
            }
        });
        const finalAssets = updates.sort((a1, a2) => a1.state > a2.state ? -1 : 1);
        taggs = [...new Set(taggs)].sort(); // 去重然后排序 用于标签搜索
        taggs.map((val) => {
            const index = exitsColor.findIndex((item) => item.name === val);
            if (index === -1) {
                const newTag: ITag = {
                    name: val,
                    color: this.getNextColor(exitsColor),
                };
                finalTags.push(newTag);
            } else {
                finalTags.push(exitsColor[index]);
            }
        });
        res = {
            assets: finalAssets,
            tags: finalTags,
        };
        return res;
    }

    /**
     * 用于升级老版本数据使用
     * @param metadata - Asset for which to retrieve metadata
     */
    public async upgradeAssetMetadata(metadata: IAssetMetadata): Promise<boolean> {
        Guard.null(metadata);
        if (this.compareVersion(metadata.version, "4.1.4") < 0) {
            metadata.version = appInfo.version;
            this.save(metadata);
        }
        return true;
    }

    /**
     * 删除素材
     * @param selectAsset
     */
    public async deleteAsset(selectAsset: IAsset): Promise<IAsset[]> {
        const path = decodeURI(selectAsset.path.replace("file:", ""));
        // await this.localFileSystem.deleteDirectory(path); //根据路径删除
        console.log(`删除素材deleteAsset->删除中文:${JSON.stringify(selectAsset)}`);
        await new LocalFileSystemProxy().deleteFileOnlyPath(path);
        await this.storageProvider.deleteFile(decodeURI(selectAsset.name)); // 根据文件名删除，可能存在多文件夹有问题
        await this.storageProvider.deleteFile(
            decodeURI(selectAsset.name.substring(0, selectAsset.name.lastIndexOf(".")))
            + constants.assetMetadataFileExtension); // 根据文件名删除，可能存在多文件夹有问题
        return _
            .values(this.project.assets)
            .filter((asset) => asset.id !== selectAsset.id)
            .sort((a, b) => a.timestamp - b.timestamp);
    }

    /**
     * 删除素材
     * @param selectAsset
     */
    public async onlyDeleteAsset(selectAsset: IAsset): Promise<boolean> {
        const path = decodeURI(selectAsset.path.replace("file:", ""));
        await new LocalFileSystemProxy().deleteFileOnlyPath(path);
        await this.storageProvider.deleteFile(decodeURI(selectAsset.name)); // 根据文件名删除，可能存在多文件夹有问题
        await this.storageProvider.deleteFile(
            decodeURI(selectAsset.name.substring(0, selectAsset.name.lastIndexOf(".")))
            + constants.assetMetadataFileExtension); // 根据文件名删除，可能存在多文件夹有问题
        return true;
    }
    /**
     * Get a list of child assets associated with the current asset
     * @param rootAsset The parent asset to search
     */
    public getChildAssets(rootAsset: IAsset): IAsset[] {
        Guard.null(rootAsset);

        if (rootAsset.type !== AssetType.Video) {
            return [];
        }

        return _
            .values(this.project.assets)
            .filter((asset) => asset.parent && asset.parent.id === rootAsset.id)
            .sort((a, b) => a.timestamp - b.timestamp);
    }

    /**
     * Save metadata for asset
     * @param metadata - Metadata for asset
     */
    public async save(metadata: IAssetMetadata): Promise<IAssetMetadata> {
        Guard.null(metadata);
        // console.log(`assetsService-test: ${JSON.stringify(metadata)}`);
        const fileName = `${metadata.asset.id}${constants.assetMetadataFileExtension}`;

        // Only save asset metadata if asset is in a tagged state
        // Otherwise primary asset information is already persisted in the project file.
        if (metadata.asset.state === AssetState.Tagged ||
            metadata.asset.state === AssetState.OkTagged ||
            metadata.asset.state === AssetState.Visited) {
            await this.storageProvider.writeText(fileName, JSON.stringify(metadata, null, 4));
        } else {
            // If the asset is no longer tagged, then it doesn't contain any regions
            // and the file is not required.
            try {
                await this.storageProvider.deleteFile(fileName);
            } catch (err) {
                // The file may not exist - that's OK
            }
        }
        return metadata;
    }

    /**
     * Get metadata for asset
     * @param asset - Asset for which to retrieve metadata
     */
    public async getAssetMetadata(asset: IAsset): Promise<IAssetMetadata> {
        Guard.null(asset);

        const fileName = `${asset.id}${constants.assetMetadataFileExtension}`;
        // console.log(`assets_map: ${fileName}:`);
        try {
            const json = await this.storageProvider.readText(fileName);
            return JSON.parse(json) as IAssetMetadata;
        } catch (err) {
            if (asset.type === AssetType.TFRecord) {
                return {
                    asset: { ...asset },
                    regions: await this.getRegionsFromTFRecord(asset),
                    version: appInfo.version,
                };
            } else {
                return {
                    asset: { ...asset },
                    regions: [],
                    version: appInfo.version,
                };
            }
        }
    }

    /**
     * Get metadata for asset
     * @param asset - Asset for which to retrieve metadata
     */
    public async getColors(): Promise<ITag[]> {
        try {
            const json = await this.storageProvider.readText(constants.colorFileExtension);
            return JSON.parse(json) as ITag[];
        } catch (err) {
            const taggs: ITag[] = [];
            return taggs;
        }
    }

    /**
     * 比对素材json版本和当前版本
     * @param version 素材的版本
     * return 0：版本一致 -1：老版本 1：更新的版本
     */
    public compareVersion(assetsVersion: string, compareVersion: string): number {
        Guard.null(assetsVersion);
        if (assetsVersion === compareVersion) { return 0; }
        if (compareVersion.indexOf("-") > 0) {
            compareVersion = compareVersion.substring(0, compareVersion.indexOf("-"));
        }
        if (assetsVersion.indexOf("-") > 0) {
            assetsVersion = assetsVersion.substring(0, assetsVersion.indexOf("-"));
        }
        const versions = assetsVersion.split(".");
        const currentVersions = compareVersion.split(".");
        console.log("版本 素材版本" + JSON.stringify(versions));
        console.log(`版本 比较的版本 ${compareVersion} ${JSON.stringify(currentVersions)}`);
        if (Number(versions[0]) > Number(currentVersions[0])) {
            return 1;
        } else if (Number(versions[0]) === Number(currentVersions[0]) &&
            Number(versions[1]) > Number(currentVersions[1])) {
            return 1;
        } else if (Number(versions[0]) === Number(currentVersions[0]) &&
            Number(versions[1]) === Number(currentVersions[1]) &&
            Number(versions[2]) > Number(currentVersions[2])) {
            return 1;
        } else { return -1; }
    }

    /**
     * Delete a tag from asset metadata files
     * @param tagName Name of tag to delete
     */
    public async deleteTag(tagName: string): Promise<void> {
        await this.onlyDeleteTagAssets(tagName);
    }

    /**
     * Rename a tag within asset metadata files
     * @param tagName Name of tag to rename
     */
    public async renameTag(tagName: string, newTagName: string): Promise<IAssetMetadata[]> {
        const transformer = (tags) => tags.map((t) => (t === tagName) ? newTagName : t);
        return await this.getUpdatedAssets(tagName, transformer, newTagName);
    }

    /**
     * Update tags within asset metadata files
     * @param tagName Name of tag to update within project
     * @param transformer Function that accepts array of tags from a region and returns a modified array of tags
     */
    private async onlyDeleteTagAssets(tagName: string)
        : Promise<void> {
        // Loop over assets and update if necessary
        const updates = await _.values(this.project.assets).mapAsync(async (asset) => {
            const assetMetadata = await this.getAssetMetadata(asset);
            await this.deltetTagInAssetMetadata(assetMetadata, tagName);
        });
    }

    /**
     * Update tags within asset metadata files
     * @param tagName Name of tag to update within project
     * @param transformer Function that accepts array of tags from a region and returns a modified array of tags
     */
    private async getUpdatedAssets(tagName: string, transformer: (tags: string[]) => string[], newTagname?: string)
        : Promise<IAssetMetadata[]> {
        // Loop over assets and update if necessary
        const updates = await _.values(this.project.assets).mapAsync(async (asset) => {
            const assetMetadata = await this.getAssetMetadata(asset);
            const isUpdated = this.updateTagInAssetMetadata(assetMetadata, tagName, transformer, newTagname);

            return isUpdated ? assetMetadata : null;
        });

        return updates.filter((assetMetadata) => !!assetMetadata);
    }

    /**
     * Update tag within asset metadata object
     * @param assetMetadata Asset metadata to update
     * @param tagName Name of tag being updated
     * @param transformer Function that accepts array of tags from a region and returns a modified array of tags
     * @returns Modified asset metadata object or null if object does not need to be modified
     */
    private async deltetTagInAssetMetadata(
        assetMetadata: IAssetMetadata,
        tagName: string): Promise<boolean> {
        let foundTag = false;
        let finalTags = [];
        for (const region of assetMetadata.regions) {
            if (region.tags.find((t) => t === tagName)) {
                foundTag = true;
                region.tags = region.tags.filter((t) => t !== tagName);
            }
            region.tags.map((val) => {
                finalTags.push(val);
            });
        }

        if (foundTag) {
            finalTags = [...new Set(finalTags)].sort(); // 去重然后排序 用于标签搜索
            assetMetadata.asset.tags = finalTags.toString();
            // console.log(`更改的标签: ${finalTags.toString()}`);
            assetMetadata.regions = assetMetadata.regions.filter((region) => region.tags.length > 0);
            assetMetadata.asset.state = (assetMetadata.regions.length) ? AssetState.Tagged : AssetState.Visited;
            await this.save(assetMetadata);
            return true;
        }

        return false;
    }

    /**
     * Update tag within asset metadata object
     * @param assetMetadata Asset metadata to update
     * @param tagName Name of tag being updated
     * @param transformer Function that accepts array of tags from a region and returns a modified array of tags
     * @returns Modified asset metadata object or null if object does not need to be modified
     */
    private updateTagInAssetMetadata(
        assetMetadata: IAssetMetadata,
        tagName: string,
        transformer: (tags: string[]) => string[], newTagname?: string): boolean {
        let foundTag = false;

        let finalTags = [];
        for (const region of assetMetadata.regions) {
            if (region.tags.find((t) => t === tagName)) {
                foundTag = true;
                region.tags = transformer(region.tags);
            }
            region.tags.map((val) => {
                finalTags.push(val);
            });
        }

        finalTags = [...new Set(finalTags)].sort(); // 去重然后排序 用于标签搜索
        if (foundTag) {
            assetMetadata.asset.tags = finalTags.toString();
            // console.log(`更改的标签: ${finalTags.toString()}`);
            assetMetadata.regions = assetMetadata.regions.filter((region) => region.tags.length > 0);
            assetMetadata.asset.state = (assetMetadata.regions.length) ? AssetState.Tagged : AssetState.Visited;
            return true;
        }

        return false;
    }

    private async getRegionsFromTFRecord(asset: IAsset): Promise<IRegion[]> {
        const objectArray = await this.getTFRecordMetadata(asset);
        const regions: IRegion[] = [];

        // Add Regions from TFRecord in Regions
        for (let index = 0; index < objectArray.textArray.length; index++) {
            regions.push({
                id: shortid.generate(),
                type: RegionType.Rectangle,
                tags: [objectArray.textArray[index]],
                boundingBox: {
                    left: objectArray.xminArray[index] * objectArray.width,
                    top: objectArray.yminArray[index] * objectArray.height,
                    width: (objectArray.xmaxArray[index] - objectArray.xminArray[index]) * objectArray.width,
                    height: (objectArray.ymaxArray[index] - objectArray.yminArray[index]) * objectArray.height,
                },
                points: [{
                    x: objectArray.xminArray[index] * objectArray.width,
                    y: objectArray.yminArray[index] * objectArray.height,
                },
                {
                    x: objectArray.xmaxArray[index] * objectArray.width,
                    y: objectArray.ymaxArray[index] * objectArray.height,
                }],
            });
        }

        return regions;
    }

    private async getTFRecordMetadata(asset: IAsset): Promise<ITFRecordMetadata> {
        const tfrecords = new Buffer(await HtmlFileReader.getAssetArray(asset));
        const reader = new TFRecordsReader(tfrecords);

        const width = reader.getFeature(0, "image/width", FeatureType.Int64) as number;
        const height = reader.getFeature(0, "image/height", FeatureType.Int64) as number;

        const xminArray = reader.getArrayFeature(0, "image/object/bbox/xmin", FeatureType.Float) as number[];
        const yminArray = reader.getArrayFeature(0, "image/object/bbox/ymin", FeatureType.Float) as number[];
        const xmaxArray = reader.getArrayFeature(0, "image/object/bbox/xmax", FeatureType.Float) as number[];
        const ymaxArray = reader.getArrayFeature(0, "image/object/bbox/ymax", FeatureType.Float) as number[];
        const textArray = reader.getArrayFeature(0, "image/object/class/text", FeatureType.String) as string[];

        return { width, height, xminArray, yminArray, xmaxArray, ymaxArray, textArray };
    }
}
