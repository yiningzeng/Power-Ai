import _ from "lodash";
import MD5 from "md5.js";
import shortid from "shortid";
import { StorageProviderFactory } from "../providers/storage/storageProviderFactory";
import {
    IProject, ISecurityToken, AppError,
    ErrorCode, DefaultActiveLearningSettings,
    DefaultExportOptions, DefaultFastrcnn, DefaultTrainOptions,
    DefaultYoloV3, DefaultYolov3Net, IConnection, IAsset, AssetState,
} from "../models/applicationState";
import Guard from "../common/guard";
import { constants } from "../common/constants";
import { ExportProviderFactory } from "../providers/export/exportProviderFactory";
import {decryptProject, encodeFileURI, encryptProject} from "../common/utils";
import packageJson from "../../package.json";
import { ExportAssetState } from "../providers/export/exportProvider";
import { IExportFormat } from "vott-react";
import {IDetectron, IYoloV3, IYoloV3Net, NetModelType} from "../models/trainConfig";
import {toast} from "react-toastify";
import {ILocalFileSystemProxyOptions} from "../providers/storage/localFileSystemProxy";
import {interpolate} from "../common/strings";
import path from "path";

/**
 * Functions required for a project service
 * @member save - Save a project
 * @member delete - Delete a project
 */
export interface IProjectService {
    load(project: IProject, securityToken: ISecurityToken): Promise<IProject>;
    save(project: IProject, securityToken: ISecurityToken): Promise<IProject>;
    transfer(project: IProject, securityToken: ISecurityToken): Promise<IProject>;
    delete(project: IProject): Promise<void>;
    isDuplicate(project: IProject, projectList: IProject[]): boolean;
}

/**
 * @name - Project Service
 * @description - Functions for dealing with projects
 */
export default class ProjectService implements IProjectService {

    /**
     * 用于首页的项目库的文件夹创建
     * @param baseFolder
     * @param createFolder
     */
    public async createFolder(baseFolder: string, createFolder: string): Promise<void> {
        const provider: ILocalFileSystemProxyOptions = {
            folderPath: baseFolder,
        };
        const newSource: IConnection = {
            id: new Date().getTime().toString(),
            name: new Date().getTime().toString(),
            providerType: "localFileSystemProxy",
            providerOptions: provider,
        };
        const storageProvider = StorageProviderFactory.createFromConnection(newSource);
        await storageProvider.createContainer(createFolder);
    }

    /**
     * 用于首页的项目库的文件夹删除
     * @param baseFolder
     * @param createFolder
     */
    public async deleteFolder(baseFolder: string, deleteFolder: string): Promise<void> {
        const provider: ILocalFileSystemProxyOptions = {
            folderPath: baseFolder,
        };
        const newSource: IConnection = {
            id: new Date().getTime().toString(),
            name: new Date().getTime().toString(),
            providerType: "localFileSystemProxy",
            providerOptions: provider,
        };
        const storageProvider = StorageProviderFactory.createFromConnection(newSource);
        await storageProvider.deleteContainer(deleteFolder);
    }

    /**
     * Loads a project
     * @param project The project JSON to load
     * @param securityToken The security token used to decrypt sensitive project settings
     */
    public load(project: IProject, securityToken: ISecurityToken): Promise<IProject> {
        Guard.null(project);
        try {
            const loadedProject = decryptProject(project, securityToken);

            // Ensure tags is always initialized to an array
            if (!loadedProject.tags) {
                loadedProject.tags = [];
            }

            // Initialize active learning settings if they don't exist
            if (!loadedProject.activeLearningSettings) {
                loadedProject.activeLearningSettings = DefaultActiveLearningSettings;
            }

            // Initialize export settings if they don't exist
            if (!loadedProject.exportFormat) {
                loadedProject.exportFormat = DefaultExportOptions;
            }

            // Initialize train settings if they don't exist
            if (!loadedProject.trainFormat) {
                loadedProject.trainFormat = DefaultTrainOptions;
            }

            return Promise.resolve({ ...loadedProject });
        } catch (e) {
            const error = new AppError(ErrorCode.ProjectInvalidSecurityToken, "Error decrypting project settings");
            return Promise.reject(error);
        }
    }

    /**
     * Save a project
     * @param project - Project to save
     * @param securityToken - Security Token to encrypt
     */
    public async save(project: IProject, securityToken: ISecurityToken): Promise<IProject> {
        Guard.null(project);
//         const rows = 100; // height
//         const cols = 100; // width
//
// // empty Mat
//         const emptyMat = new cv.Mat(rows, cols, cv.CV_8UC3);
//         alert("白村");
        if (!project.id) {
            project.id = `powerAi-${shortid.generate()}`;
        }

        // Ensure tags is always initialized to an array
        if (!project.tags) {
            project.tags = [];
        }

        // Initialize active learning settings if they don't exist
        if (!project.activeLearningSettings) {
            project.activeLearningSettings = DefaultActiveLearningSettings;
        }

        // Initialize export settings if they don't exist
        if (!project.exportFormat) {
            project.exportFormat = DefaultExportOptions;
        }

        // Initialize train settings if they don't exist
        if (!project.trainFormat) {
            project.trainFormat = DefaultTrainOptions;
        }
        // if (project.version.includes("删除")) {
        //     console.log(`删除保存: ${JSON.stringify(project)}`);
        // }
        // project.version = packageJson.version;
        const storageProvider = StorageProviderFactory.createFromConnection(project.targetConnection);
        await this.saveExportSettings(project);
        project = encryptProject(project, securityToken);
        // if (project.version.includes("删除")) {
        //     console.log(`删除保存 final ${project.name}${constants.projectFileExtension}: ${JSON.stringify(project)}`);
        //     await storageProvider.writeText(
        //         `${project.name}-final-${constants.projectFileExtension}`,
        //         JSON.stringify(project, null, "\t"),
        //     );
        // }

        // 暂时去掉保存的零时项目文件
        // await storageProvider.writeText(
        //     `${project.name}${constants.projectFileExtension}`,
        //     JSON.stringify(project, null, "\t"),
        // );

        await storageProvider.writeText(
            constants.colorFileExtension,
            JSON.stringify(project.tags, null, "\t"),
        );
        return project;
    }

    public async importTaggedAssets(project: IProject, folder: string): Promise<IProject> {
        Guard.null(project);

        // if (project.version.includes("删除")) {
        //     console.log(`删除保存: ${JSON.stringify(project)}`);
        // }
        // project.version = packageJson.version;
        try {
            const provider: ILocalFileSystemProxyOptions = {
                folderPath: folder,
            };
            const newSource: IConnection = {
                id: new Date().getTime().toString(),
                name: new Date().getTime().toString(),
                providerType: "localFileSystemProxy",
                providerOptions: provider,
            };
            const projectStorageProvider = StorageProviderFactory.createFromConnection(project.targetConnection);
            const importStorageProvider = StorageProviderFactory.createFromConnection(newSource);
            const params = {
                path: encodeURI(path.normalize(folder.replace(/\\/g, "/") + "/")),
            };
            let importFileList = await importStorageProvider.listFiles();
            importFileList = importFileList.filter((v) => v.includes(constants.importFileExtension));
            if (importFileList.length === 0) {
                return null;
            }
            const jsonImportProject: IProject = JSON.parse(interpolate(await importStorageProvider.readText(`${constants.importFileExtension}`), params));

            // 合并标签
            const newTags = _(project.tags)
                .concat(jsonImportProject.tags)
                .uniqBy((tag) => tag.name)
                .value();

            // 重新计算需要导入的图像素材的id,并存储在项目目录
            const tempAssets: IAsset[] = [];
            for (const one of _.values(jsonImportProject.assets)) {
                try {
                    if (one.state !== AssetState.NotVisited) {
                        const md5Hash = new MD5().update(one.path).digest("hex");
                        const fileName = one.name.substring(0, one.name.lastIndexOf("."));
                        const oneTemp: IAsset = {
                            ...one,
                            id: fileName,
                        };
                        tempAssets.push(oneTemp);
                        if (one.state === AssetState.Tagged) {
                            const itemJsonText = interpolate(
                                await importStorageProvider.readText(
                                    `${one.id}${constants.assetMetadataFileExtension}`), params);
                            const json = JSON.parse(itemJsonText);
                            json["asset"]["id"] = fileName;
                            await projectStorageProvider.writeText(`${fileName}${constants.assetMetadataFileExtension}`,
                                JSON.stringify(json, null, 4));
                            if (!one.tags) {
                                let tags = [];
                                json["regions"].forEach((val, idx, arry) => {
                                    tags = tags.concat(val.tags);
                                });
                                tags = [...new Set(tags)].sort(); // 去重然后排序 用于标签搜索
                                oneTemp.tags = tags.join(",");
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            // 合并素材
            const newAssets = _(_.values(project.assets))
                .concat(tempAssets)
                .uniqBy((asset) => asset.id)
                .value();

            // 转换成项目的素材目录
            const finalAssets = _.keyBy(newAssets, (asset) => asset.id);
            // const normalizedPath = filePath.toLowerCase();
            // const md5Hash = new MD5().update("file:/home/baymin/%E5%.png").digest("hex");
            // alert(md5Hash);

            // const aaaaa: IProviderOptions = {
            //     folderPath: folder,
            // };
            const newSourceConnectionProvider = _(project.sourceConnection.providerOptionsOthers)
                .concat([{folderPath: folder}])
                .uniqBy((provider) => provider.folderPath)
                .value();

            // const newAssets: IAsset[] = _.values(project.assets);
            // const addAssets = _.values(jsonImportProject.assets);
            // for (const ass of addAssets) {
            //     newAssets.push(ass);
            // }
            console.log(`导入素材->当前项目:${JSON.stringify(project)}`);
            console.log("导入素材->==========================================================");
            console.log(`导入素材->其他项目的素材文件:${JSON.stringify(jsonImportProject.assets)}`);
            console.log(`导入素材->当前项目的素材文件:${JSON.stringify(project.assets)}`);
            console.log("导入素材->==========================================================");
            console.log(`导入素材->其他项目的素材文件:${JSON.stringify(_.values(jsonImportProject.assets))}`);
            console.log(`导入素材->当前项目的素材文件:${JSON.stringify(_.values(project.assets))}`);
            console.log(`导入素材->合并后项目的素材文件:${JSON.stringify(newAssets)}`);
            // 那么这里只能是做遍历了 增加素材了 可以看 MockFactory.createTestAsset

            // await importStorageProvider.writeText("aaaaa.json",
            //     JSON.stringify(_.keyBy(newAssets, (asset) => asset.id), null, 4));
            // await importStorageProvider.writeText("aaaaa2.json",
            //     JSON.stringify(_.keyBy(tempAssets, (asset) => asset.id), null, 4));
            // await storageProvider.writeText("bibibibibibibibibibibi.json",
            //     JSON.stringify(_.values(jsonImportProject.assets), null, 4));
            const updateProject: IProject = {
                ...project,
                tags: newTags,
                assets: finalAssets,
                sourceConnection: {
                    ...project.sourceConnection,
                    providerOptionsOthers: newSourceConnectionProvider,
                },
                targetConnection: {
                    ...project.targetConnection,
                    providerOptionsOthers: newSourceConnectionProvider,
                },
            };
            // await importStorageProvider.writeText(constants.importFileTransferExtension,
            //     JSON.stringify(jsonImportProject, null, 4));
            // await projectStorageProvider.writeText(`${project.name}+${constants.projectFileExtension}`,
            //     JSON.stringify(updateProject, null, 4));
            return updateProject;
        } catch (e) {
            console.log(e);
            return project;
        }
    }

    public async transfer(project: IProject, securityToken: ISecurityToken): Promise<IProject> {
        Guard.null(project);
        if (!project.id) {
            project.id = `powerAi-${shortid.generate()}`;
        }

        // Ensure tags is always initialized to an array
        if (!project.tags) {
            project.tags = [];
        }

        // Initialize active learning settings if they don't exist
        if (!project.activeLearningSettings) {
            project.activeLearningSettings = DefaultActiveLearningSettings;
        }

        // Initialize export settings if they don't exist
        if (!project.exportFormat) {
            project.exportFormat = DefaultExportOptions;
        }

        // Initialize train settings if they don't exist
        if (!project.trainFormat) {
            project.trainFormat = DefaultTrainOptions;
        }
        // if (project.version.includes("删除")) {
        //     console.log(`删除保存: ${JSON.stringify(project)}`);
        // }
        // project.version = packageJson.version;
        const storageProvider = StorageProviderFactory.createFromConnection(project.targetConnection);
        project = decryptProject(project, securityToken);
        // let projectString = decodeURIComponent(JSON.stringify(project));
        // projectString = projectString.replace("\/media\/baymin\/c731be01-5353-4600-8df0-b766fc1f9b80\/new-work\/",
        //     "\/home\/baymin\/daily-work\/new-work\/")
        //     .replace("\/home\/baymin\/new-work\/",
        //         "\/home\/baymin\/daily-work\/new-work\/");
        // const aa = projectString.replace("c731be01-5353-4600-8df0-b766fc1f9b80",
        //     "kkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        // console.log(`韵升-》解密: ${JSON.stringify(project)}`);
        // let projectJson: IProject;
        // try {
        //     projectJson = JSON.parse(projectString);
        //     projectJson = {
        //         ...projectJson,
        //         name: projectJson.name + "-Transfer",
        //     };
        //
        // } catch (error) {
        //     throw new AppError(ErrorCode.ProjectInvalidJson, "Error parsing JSON");
        // }
        const transProject = {
            ...project,
            name: project.name + "-Transfer",
            // targetConnection: {
            //     ...project.targetConnection,
            //     providerOptions: {
            //         folderPath: "/home/baymin/daily-work/new-work/素材/yunsheng_date/6and4", // 这个就是所有项目文件保存的目录
            //     },
            //     providerOptionsOthers: [{
            //         folderPath: "/home/baymin/daily-work/new-work/素材/yunsheng_date/6and4",
            //     }],
            // },
        };

        // console.log(`韵升-》加密: ${JSON.stringify(encryptProject(projectJson, securityToken))}`);
        // const targetOptions = JSON.parse(JSON.stringify(project.targetConnection.providerOptions));
        // toast.error(targetOptions["folderPath"]);

        // toast.error(JSON.stringify(project.targetConnection.providerOptions));

        // if (project.version.includes("删除")) {
        //     console.log(`删除保存 final ${project.name}${constants.projectFileExtension}: ${JSON.stringify(project)}`);
        //     await storageProvider.writeText(
        //         `${project.name}-final-${constants.projectFileExtension}`,
        //         JSON.stringify(project, null, "\t"),
        //     );
        // }
        await storageProvider.writeText(
            `${transProject.name}-transfer${constants.projectFileExtension}`,
            JSON.stringify(transProject, null, "\t"),
        );
        toast.success(`导出转移的项目文件 ${transProject.name}-transfer${constants.projectFileExtension} 成功`);
        return project;
    }
    /**
     * Delete a project
     * @param project - Project to delete
     */
    public async delete(project: IProject): Promise<void> {
        Guard.null(project);

        const storageProvider = StorageProviderFactory.createFromConnection(project.targetConnection);

        // Delete all asset metadata files created for project
        const deleteFiles = _.values(project.assets)
            .map((asset) => storageProvider.deleteFile(`${asset.id}${constants.assetMetadataFileExtension}`));

        await Promise.all(deleteFiles);
        await storageProvider.deleteFile(`${project.name}${constants.projectFileExtension}`);
    }

    /**
     * Checks whether or not the project would cause a duplicate at the target connection
     * @param project The project to validate
     * @param projectList The list of known projects
     */
    public isDuplicate(project: IProject, projectList: IProject[]): boolean {
        const duplicateProjects = projectList.find((p) =>
            p.id !== project.id &&
            p.name === project.name &&
            JSON.stringify(p.targetConnection.providerOptions) ===
            JSON.stringify(project.targetConnection.providerOptions),
        );
        return (duplicateProjects !== undefined);
    }

    private async saveExportSettings(project: IProject): Promise<void> {
        if (!project.exportFormat || !project.exportFormat.providerType) {
            return Promise.resolve();
        }

        const exportProvider = ExportProviderFactory.createFromProject(project);

        if (!exportProvider.save) {
            return Promise.resolve();
        }

        project.exportFormat.providerOptions = await exportProvider.save(project.exportFormat);
    }
}
