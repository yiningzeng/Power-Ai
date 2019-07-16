import _ from "lodash";
import shortid from "shortid";
import { StorageProviderFactory } from "../providers/storage/storageProviderFactory";
import {
    IProject, ISecurityToken, AppError,
    ErrorCode, ModelPathType, IActiveLearningSettings, ITrainFormat, IProviderOptions,
} from "../models/applicationState";
import Guard from "../common/guard";
import { constants } from "../common/constants";
import { ExportProviderFactory } from "../providers/export/exportProviderFactory";
import { decryptProject, encryptProject } from "../common/utils";
import packageJson from "../../package.json";
import { ExportAssetState } from "../providers/export/exportProvider";
import { IExportFormat } from "vott-react";
import {IDetectron, NetModelType} from "../models/trainConfig";
import {toast} from "react-toastify";

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

const defaultActiveLearningSettings: IActiveLearningSettings = {
    autoDetect: false,
    predictTag: true,
    modelPathType: ModelPathType.Coco,
};

const defaultFastrcnn: IDetectron = {
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

const defaultTrainOptions: ITrainFormat = {
    providerType: "fasterRcnn",
    providerOptions: defaultFastrcnn,
};

const defaultExportOptions: IExportFormat = {
    providerType: "coco",
    providerOptions: {
        assetState: ExportAssetState.All,
        includeImages: true,
    },
};

/**
 * @name - Project Service
 * @description - Functions for dealing with projects
 */
export default class ProjectService implements IProjectService {
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
                loadedProject.activeLearningSettings = defaultActiveLearningSettings;
            }

            // Initialize export settings if they don't exist
            if (!loadedProject.exportFormat) {
                loadedProject.exportFormat = defaultExportOptions;
            }

            // Initialize train settings if they don't exist
            if (!loadedProject.trainFormat) {
                loadedProject.trainFormat = defaultTrainOptions;
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
        if (!project.id) {
            project.id = shortid.generate();
        }

        // Ensure tags is always initialized to an array
        if (!project.tags) {
            project.tags = [];
        }

        // Initialize active learning settings if they don't exist
        if (!project.activeLearningSettings) {
            project.activeLearningSettings = defaultActiveLearningSettings;
        }

        // Initialize export settings if they don't exist
        if (!project.exportFormat) {
            project.exportFormat = defaultExportOptions;
        }

        // Initialize train settings if they don't exist
        if (!project.trainFormat) {
            project.trainFormat = defaultTrainOptions;
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
        await storageProvider.writeText(
            `${project.name}${constants.projectFileExtension}`,
            JSON.stringify(project, null, "\t"),
        );

        return project;
    }

    public async transfer(project: IProject, securityToken: ISecurityToken): Promise<IProject> {
        Guard.null(project);
        if (!project.id) {
            project.id = shortid.generate();
        }

        // Ensure tags is always initialized to an array
        if (!project.tags) {
            project.tags = [];
        }

        // Initialize active learning settings if they don't exist
        if (!project.activeLearningSettings) {
            project.activeLearningSettings = defaultActiveLearningSettings;
        }

        // Initialize export settings if they don't exist
        if (!project.exportFormat) {
            project.exportFormat = defaultExportOptions;
        }

        // Initialize train settings if they don't exist
        if (!project.trainFormat) {
            project.trainFormat = defaultTrainOptions;
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
        project = {
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
            `${project.name}-transfer${constants.projectFileExtension}`,
            JSON.stringify(project, null, "\t"),
        );

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
