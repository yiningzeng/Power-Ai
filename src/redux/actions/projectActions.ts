import { Action, Dispatch } from "redux";
import ProjectService from "../../services/projectService";
import TrainService from "../../services/trainService";
import { ActionTypes } from "./actionTypes";
import { AssetService } from "../../services/assetService";
import { ExportProviderFactory } from "../../providers/export/exportProviderFactory";
import {
    AppError,
    ErrorCode,
    IApplicationState,
    IAsset,
    IAssetMetadata, IAssetsAndTags,
    IProject, ITag,
} from "../../models/applicationState";
import { createAction, createPayloadAction, IPayloadAction } from "./actionCreators";
import {
    ExportAssetState,
    IExportResults, IStartTestResults,
    IStartTrainResults,
    ITrainConfigResults,
} from "../../providers/export/exportProvider";
import { appInfo } from "../../common/appInfo";
import { strings } from "../../common/strings";
import { IExportFormat } from "vott-react";
import { IPowerAiExportProviderOptions } from "../../providers/export/powerAi";
import {TrainProviderFactory} from "../../providers/trainSettings/trainProviderFactory";
import { decryptProviderOptions } from "../../common/utils";
import {constants} from "../../common/constants";
import _ from "lodash";
import TestService from "../../services/testService";

/**
 * Actions to be performed in relation to projects
 */
export default interface IProjectActions {
    createFolder(baseFolder: string, createFolder: string): Promise<void>;
    deleteFolder(baseFolder: string, deleteFolder: string): Promise<void>;
    loadProject(project: IProject): Promise<IProject>;
    saveProject(project: IProject): Promise<IProject>;
    deleteProject(project: IProject): Promise<void>;
    closeProject(): void;
    exportProject(project: IProject): Promise<void> | Promise<IExportResults>;
    importTaggedAssets(project: IProject, folder: string): Promise<IProject>;
    transferProject(project: IProject): Promise<void>;
    exportTrainConfig(project: IProject): Promise<void> | Promise<ITrainConfigResults>;
    trainAddQueueProject(project: IProject, source: IStartTrainResults): Promise<IStartTrainResults>;
    trainAddSql(project: IProject, source: IStartTrainResults): Promise<IStartTrainResults>;
    trainPackageProject(project: IProject): Promise<IStartTrainResults>;
    trainUploadProject(project: IProject, source: IStartTrainResults): Promise<IStartTrainResults>;
    testImage(project: IProject): Promise<IStartTestResults>;
    getNextColor(tags: ITag[]): string;
    loadAssets(project: IProject): Promise<IAsset[]>;
    loadAssetsWithFolder(project: IProject, folder: string): Promise<IAsset[]>;
    loadAssetsWithFolderAndTags(project: IProject, folder: string): Promise<IAssetsAndTags>;
    loadAssetMetadata(project: IProject, asset: IAsset): Promise<IAssetMetadata>;
    getAssetsByYiNingZengAssets(project: IProject): Promise<{ [index: string]: IAsset }>;
    getAssetsByYiNingZengColorTags(project: IProject): Promise<ITag[]>;
    saveAssetMetadata(project: IProject, assetMetadata: IAssetMetadata): Promise<IAssetMetadata>;
    deleteAsset(project: IProject, selectAsset: IAsset): Promise<IProject>;
    deleteAssetBatch(assetService: AssetService, selectAsset: IAsset): Promise<void>;
    updateProjectTag(project: IProject, oldTagName: string, newTagName: string): Promise<IAssetMetadata[]>;
    deleteProjectTag(project: IProject, tagName): Promise<IAssetMetadata[]>;
    test(): void;
}

/**
 * 用于首页的项目库的文件夹创建
 * @param baseFolder
 * @param createFolder
 */
export function createFolder(baseFolder: string, createFolder: string)
    : (dispatch: Dispatch, getState: () => IApplicationState) => Promise<void> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        const projectService = new ProjectService();
        await projectService.createFolder(baseFolder, createFolder);
    };
}

/**
 * 用于首页的项目库的文件夹删除
 * @param baseFolder
 * @param createFolder
 */
export function deleteFolder(baseFolder: string, deleteFolder: string)
    : (dispatch: Dispatch, getState: () => IApplicationState) => Promise<void> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        const projectService = new ProjectService();
        await projectService.deleteFolder(baseFolder, deleteFolder);
    };
}

export function test(): (dispatch: Dispatch) => void {
    return (dispatch: Dispatch): void => {
        const trainService = new TrainService();
        trainService.test();
        // dispatch({ type: ActionTypes.CLOSE_PROJECT_SUCCESS });
    };
}

/**
 * Dispatches Load Project action and resolves with IProject
 * @param project - Project to load
 */
export function loadProject(project: IProject):
    (dispatch: Dispatch, getState: () => IApplicationState) => Promise<IProject> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        const appState = getState();
        const projectService = new ProjectService();
        // Lookup security token used to decrypt project settings
        let projectToken = appState.appSettings.securityTokens
            .find((securityToken) => securityToken.name === project.securityToken);
        if (project.version !== "2.0.0") {
            projectToken = {
                name: "Power-Ai",
                key: "OwMCjlh96SCjvzp2U6esmUG4qk5acDejsm41zmkkVpk=",
            };
        }
        if (!projectToken) {
            throw new AppError(ErrorCode.SecurityTokenNotFound, "Security Token Not Found");
        }

        // console.log(`删除素材后reload: ${JSON.stringify(project)}`);
        const loadedProject = await projectService.load(project, projectToken);
        // console.log(`删除素材后reload 2222222222: ${JSON.stringify(loadedProject)}`);
        dispatch(loadProjectAction(loadedProject));
        return loadedProject;
    };
}

/**
 * Dispatches Save Project action and resolves with IProject
 * @param project - Project to save
 */
export function saveProject(project: IProject)
    : (dispatch: Dispatch, getState: () => IApplicationState) => Promise<IProject> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        const appState = getState();
        const projectService = new ProjectService();
        console.log(`malesaveProject: ${JSON.stringify(project)}`);
        if (projectService.isDuplicate(project, appState.recentProjects)) {
            throw new AppError(ErrorCode.ProjectDuplicateName, `Project with name '${project.name}
                already exists with the same target connection '${project.targetConnection.name}'`);
        }

        let projectToken = appState.appSettings.securityTokens
            .find((securityToken) => securityToken.name === project.securityToken);
        if (project.version !== "2.0.0") {
            projectToken = {
                name: "Power-Ai",
                key: "OwMCjlh96SCjvzp2U6esmUG4qk5acDejsm41zmkkVpk=",
            };
        }
        if (!projectToken) {
            throw new AppError(ErrorCode.SecurityTokenNotFound, "Security Token Not Found");
        }

        const savedProject = await projectService.save(project, projectToken);
        dispatch(saveProjectAction(savedProject));
        console.log(`malesaveProject: ${JSON.stringify(savedProject)}`);

        // Reload project after save actions
        await loadProject(savedProject)(dispatch, getState);

        return savedProject;
    };
}

/**
 * Dispatches Delete Project action and resolves with project
 * @param project - Project to delete
 */
export function deleteProject(project: IProject)
    : (dispatch: Dispatch, getState: () => IApplicationState) => Promise<void> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        const appState = getState();
        const projectService = new ProjectService();

        // Lookup security token used to decrypt project settings
        let projectToken = appState.appSettings.securityTokens
            .find((securityToken) => securityToken.name === project.securityToken);
        if (project.version !== "2.0.0") {
            projectToken = {
                name: "Power-Ai",
                key: "OwMCjlh96SCjvzp2U6esmUG4qk5acDejsm41zmkkVpk=",
            };
        }
        if (!projectToken) {
            throw new AppError(ErrorCode.SecurityTokenNotFound, "Security Token Not Found");
        }

        const decryptedProject = await projectService.load(project, projectToken);

        await projectService.delete(decryptedProject);
        dispatch(deleteProjectAction(decryptedProject));
    };
}

/**
 * Dispatches Close Project action
 */
export function closeProject(): (dispatch: Dispatch) => void {
    return (dispatch: Dispatch): void => {
        dispatch({ type: ActionTypes.CLOSE_PROJECT_SUCCESS });
    };
}

/**
 * Gets assets from project, dispatches load assets action and returns assets
 * @param project - Project from which to load assets
 */
export function loadAssets(project: IProject): (dispatch: Dispatch) => Promise<IAsset[]> {
    return async (dispatch: Dispatch) => {
        const assetService = new AssetService(project);
        const assets = await assetService.getAssets();
        dispatch(loadProjectAssetsAction(assets));

        return assets;
    };
}

/**
 * Gets assets from project, dispatches load assets action and returns assets
 * @param project - Project from which to load assets
 */
export function loadAssetsWithFolder(project: IProject, folder: string):
    (dispatch: Dispatch) => Promise<IAsset[]> {
    return async (dispatch: Dispatch) => {
        const assetService = new AssetService(project);
        const assets = await assetService.getAssetsWithFolder(folder);
        dispatch(loadProjectAssetsAction(assets));
        return assets;
    };
}

/**
 * Gets assets from project, dispatches load assets action and returns assets
 * @param project - Project from which to load assets
 */
export function loadAssetsWithFolderAndTags(project: IProject, folder: string):
    (dispatch: Dispatch) => Promise<IAssetsAndTags> {
    return async (dispatch: Dispatch) => {
        const assetService = new AssetService(project);
        const rest = await assetService.getAssetsWithFolderMain(folder);
        dispatch(loadProjectAssetsAction(rest.assets));
        return rest;
    };
}

export function getAssetsByYiNingZengAssets(project: IProject): (dispatch: Dispatch) => Promise<{ [index: string]: IAsset }> {
    return async (dispatch: Dispatch) => {
        const assetService = new AssetService(project);
        return await assetService.getYiNingZengAssets();
    };
}

export function getAssetsByYiNingZengColorTags(project: IProject): (dispatch: Dispatch) => Promise<ITag[]> {
    return async (dispatch: Dispatch) => {
        const assetService = new AssetService(project);
        return await assetService.getYiNingZengColorTags();
    };
}

/**
 * Load metadata from asset within project
 * @param project - Project from which to load asset metadata
 * @param asset - Asset from which to load metadata
 */
export function loadAssetMetadata(project: IProject, asset: IAsset): (dispatch: Dispatch) => Promise<IAssetMetadata> {
    return async (dispatch: Dispatch) => {
        const assetService = new AssetService(project);
        let assetMetadata = await assetService.getAssetMetadata(asset);
        assetMetadata = {
            ...assetMetadata,
            asset: {
                ...assetMetadata.asset,
                path: asset.path,
            },
        };
        // console.log(`loadAssetMetadata: ${JSON.stringify(assetMetadata)}`);
        dispatch(loadAssetMetadataAction(assetMetadata));

        return { ...assetMetadata };
    };
}

/**
 * Save metadata from asset within project
 * @param project - Project from which to save asset metadata
 * @param assetMetadata - Metadata for asset within project
 */
export function saveAssetMetadata(
    project: IProject,
    assetMetadata: IAssetMetadata): (dispatch: Dispatch) => Promise<IAssetMetadata> {
    const newAssetMetadata = { ...assetMetadata, version: appInfo.version };

    return async (dispatch: Dispatch) => {
        const assetService = new AssetService(project);
        const savedMetadata = await assetService.save(newAssetMetadata);
        dispatch(saveAssetMetadataAction(savedMetadata));

        return { ...savedMetadata };
    };
}

/**
 * Dispatches Delete Project action and resolves with project
 * @param project - Project to delete
 * @param selectAsset
 */
export function deleteAsset(project: IProject, selectAsset: IAsset)
    : (dispatch: Dispatch, getState: () => IApplicationState) => Promise<IProject> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        const assetService = new AssetService(project);
        // alert("删除素材: assetService" + JSON.stringify(assetService));
        const currentProject = getState().currentProject;
        console.log(`删除素材deleteAsset： ${JSON.stringify(currentProject)}`);
        const updatedProject = {
            ...project,
            assets: _.keyBy(await assetService.deleteAsset(selectAsset), (asset) => asset.id),
            // lastVisitedAssetId: null,
        };
        console.log(`删除素材deleteAsset->updatedProject： ${JSON.stringify(updatedProject)}`);
        // this.props.actions.saveProject()
        await saveProject(updatedProject)(dispatch, getState);
        // dispatch(deleteProjectAssetAction(updatedProject));

        dispatch(saveProjectAction(updatedProject));
        // Reload project after save actions
        await loadProject(updatedProject)(dispatch, getState);
        return updatedProject;
    };
}

/**
 * Dispatches Delete Project action and resolves with project
 * @param project - Project to delete
 * @param selectAsset
 */
export function deleteAssetBatch(assetService: AssetService, selectAsset: IAsset)
    : (dispatch: Dispatch, getState: () => IApplicationState) => Promise<void> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        assetService.onlyDeleteAsset(selectAsset);
    };
}

/**
 * Updates a project and all asset references from oldTagName to newTagName
 * @param project The project to update tags
 * @param oldTagName The old tag name
 * @param newTagName The new tag name
 */
export function updateProjectTag(project: IProject, oldTagName: string, newTagName: string)
    : (dispatch: Dispatch, getState: () => IApplicationState) => Promise<IAssetMetadata[]> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        // Find tags to rename
        const assetService = new AssetService(project);
        const assetUpdates = await assetService.renameTag(oldTagName, newTagName);
        // Save updated assets
        await assetUpdates.forEachAsync(async (assetMetadata) => {
            await saveAssetMetadata(project, assetMetadata)(dispatch);
        });
        const currentProject = getState().currentProject;
        console.log(`fff-update tags: 2`);
        let updatedProject;
        // region 更新新的标签颜色和老的一致
        const oldTag = currentProject.tags.filter((t) => t.name === oldTagName)[0];
        updatedProject = {
            ...currentProject,
            tags: currentProject.tags.filter((t) => t.name !== oldTagName && t.name !== newTagName)
                .concat({name: newTagName, color: oldTag.color}),
        };
        // region
        // if (currentProject.tags.filter((t) => t.name === newTagName).length > 0) { // 查找是否有相同的tag
        //     console.log(`updateProjectTag 相同`);
        //     updatedProject = {
        //         ...currentProject,
        //         tags: currentProject.tags.filter((t) => t.name !== oldTagName),
        //     };
        // } else { // 不存在相同的tag
        //     console.log(`updateProjectTag 不相同`);
        //     updatedProject = {
        //         ...currentProject,
        //         tags: currentProject.tags.map((t) => (t.name === oldTagName) ? { ...t, name: newTagName } : t),
        //     };
        // }
        // Save updated project tags
        await saveProject(updatedProject)(dispatch, getState);
        dispatch(updateProjectTagAction(updatedProject));

        return assetUpdates;
    };
}

/**
 * Updates a project and all asset references from oldTagName to newTagName
 * @param project The project to delete tags
 * @param tagName The tag to delete
 */
export function deleteProjectTag(project: IProject, tagName)
    : (dispatch: Dispatch, getState: () => IApplicationState) => Promise<IAssetMetadata[]> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        // Find tags to rename
        const assetService = new AssetService(project);
        await assetService.deleteTag(tagName);

        // Save updated assets
        // await assetUpdates.forEachAsync(async (assetMetadata) => {
        //     await saveAssetMetadata(project, assetMetadata)(dispatch);
        // });

        // const currentProject = getState().currentProject;
        // const updatedProject = {
        //     ...currentProject,
        //     tags: project.tags.filter((t) => t.name !== tagName),
        // };
        //
        // // Save updated project tags
        // await saveProject(updatedProject)(dispatch, getState);
        // dispatch(deleteProjectTagAction(updatedProject));
        return null;
    };
}

/**
 * Initialize export provider, get export data and dispatch export project action
 * @param project - Project to export
 */
export function exportProject(project: IProject): (dispatch: Dispatch) => Promise<void> | Promise<IExportResults> {
    return async (dispatch: Dispatch) => {
        if (!project.exportFormat) {
            throw new AppError(ErrorCode.ExportFormatNotFound, strings.errors.exportFormatNotFound.message);
        }
        console.log(`ExportProviderFactory exportProject: ${JSON.stringify(project)}`);
        if (project.exportFormat && project.exportFormat.providerType) {
            const exportProvider = ExportProviderFactory.create(
                project.exportFormat.providerType,
                project,
                project.exportFormat.providerOptions);

            const results = await exportProvider.export();
            dispatch(exportProjectAction(project));

            return results as IExportResults;
        }
    };
}

export function importTaggedAssets(project: IProject, folder: string):
    (dispatch: Dispatch, getState: () => IApplicationState) => Promise<IProject> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        const appState = getState();
        const projectService = new ProjectService();
        if (projectService.isDuplicate(project, appState.recentProjects)) {
            throw new AppError(ErrorCode.ProjectDuplicateName, `Project with name '${project.name}
                already exists with the same target connection '${project.targetConnection.name}'`);
        }
        let projectToken = appState.appSettings.securityTokens
            .find((securityToken) => securityToken.name === project.securityToken);
        if (project.version !== "2.0.0") {
            projectToken = {
                name: "Power-Ai",
                key: "OwMCjlh96SCjvzp2U6esmUG4qk5acDejsm41zmkkVpk=",
            };
        }
        if (!projectToken) {
            throw new AppError(ErrorCode.SecurityTokenNotFound, "Security Token Not Found");
        }
        const updatedProject = await projectService.importTaggedAssets(project, folder);
        if (updatedProject !== null) {
            await saveProject(updatedProject)(dispatch, getState);
            dispatch(saveProjectAction(updatedProject));
            // Reload project after save actions
            await loadProject(updatedProject)(dispatch, getState);
        }
        return updatedProject;
    };
}

export function transferProject(project: IProject):
    (dispatch: Dispatch, getState: () => IApplicationState) => Promise<void> {
    return async (dispatch: Dispatch, getState: () => IApplicationState) => {
        const appState = getState();
        const projectService = new ProjectService();
        if (projectService.isDuplicate(project, appState.recentProjects)) {
            throw new AppError(ErrorCode.ProjectDuplicateName, `Project with name '${project.name}
                already exists with the same target connection '${project.targetConnection.name}'`);
        }

        let projectToken = appState.appSettings.securityTokens
            .find((securityToken) => securityToken.name === project.securityToken);
        if (project.version !== "2.0.0") {
            projectToken = {
                name: "Power-Ai",
                key: "OwMCjlh96SCjvzp2U6esmUG4qk5acDejsm41zmkkVpk=",
            };
        }
        if (!projectToken) {
            throw new AppError(ErrorCode.SecurityTokenNotFound, "Security Token Not Found");
        }
        await projectService.transfer(project, projectToken);
    };
}

/**
 * Initialize export provider, get export data and dispatch export project action
 * @param project - Project to export
 */
export function exportTrainConfig(project: IProject):
    (dispatch: Dispatch) => Promise<void> | Promise<ITrainConfigResults> {
    return async (dispatch: Dispatch) => {
        if (!project.trainFormat) {
            throw new AppError(ErrorCode.TrainFormatNotFound, strings.errors.trainFormatNotFound.message);
        }

        if (project.trainFormat && project.trainFormat.providerType) {
            const trainProvider = TrainProviderFactory.create(
                project.trainFormat.providerType,
                project,
                project.trainFormat.providerOptions);

            const results = await trainProvider.export();
            dispatch(exportTrainConfigAction(project));

            return results as ITrainConfigResults;
        }
    };
}

export function trainPackageProject(project: IProject):
    (dispatch: Dispatch) => Promise<void> | Promise<ITrainConfigResults> {
    return async (dispatch: Dispatch) => {
        const trainService = new TrainService();
        return await trainService.trainPackageProject(project);
    };
}

export function trainUploadProject(project: IProject, source: IStartTrainResults):
    (dispatch: Dispatch) => Promise<ITrainConfigResults> {
    return async (dispatch: Dispatch) => {
        const trainService = new TrainService();
        return await trainService.trainUploadProject(project, source);
    };
}

export function trainAddQueueProject(project: IProject, source: IStartTrainResults):
    (dispatch: Dispatch) => Promise<ITrainConfigResults> {
    return async (dispatch: Dispatch) => {
        const trainService = new TrainService();
        return await trainService.trainAddQueueProject(project, source);
    };
}

export function getNextColor(tags: []):
    (dispatch: Dispatch) => string {
    return (dispatch: Dispatch) => {
        const assetService = new AssetService(null);
        return assetService.getNextColor(tags);
    };
}

export function testImage(project: IProject):
    (dispatch: Dispatch) => Promise<IStartTestResults> {
    return async (dispatch: Dispatch) => {
        const testService = new TestService();
        return await testService.testGetModel(project);
    };
}
export function trainAddSql(project: IProject, source: IStartTrainResults):
    (dispatch: Dispatch) => Promise<ITrainConfigResults> {
    return async (dispatch: Dispatch) => {
        const trainService = new TrainService();
        return await trainService.trainAddSql(project, source);
    };
}
/**
 * Load project action type
 */
export interface ILoadProjectAction extends IPayloadAction<string, IProject> {
    type: ActionTypes.LOAD_PROJECT_SUCCESS;
}

/**
 * Close project action type
 */
export interface ICloseProjectAction extends Action<string> {
    type: ActionTypes.CLOSE_PROJECT_SUCCESS;
}

/**
 * Save project action type
 */
export interface ISaveProjectAction extends IPayloadAction<string, IProject> {
    type: ActionTypes.SAVE_PROJECT_SUCCESS;
}

/**
 * Delete project action type
 */
export interface IDeleteProjectAction extends IPayloadAction<string, IProject> {
    type: ActionTypes.DELETE_PROJECT_SUCCESS;
}

/**
 * Load project assets action type
 */
export interface ILoadProjectAssetsAction extends IPayloadAction<string, IAsset[]> {
    type: ActionTypes.LOAD_PROJECT_ASSETS_SUCCESS;
}

/**
 * Load asset metadata action type
 */
export interface ILoadAssetMetadataAction extends IPayloadAction<string, IAssetMetadata> {
    type: ActionTypes.LOAD_ASSET_METADATA_SUCCESS;
}

/**
 * Save asset metadata action type
 */
export interface ISaveAssetMetadataAction extends IPayloadAction<string, IAssetMetadata> {
    type: ActionTypes.SAVE_ASSET_METADATA_SUCCESS;
}

/**
 * Export project action type
 */
export interface IExportProjectAction extends IPayloadAction<string, IProject> {
    type: ActionTypes.EXPORT_PROJECT_SUCCESS;
}
/**
 * Export project action type
 */
export interface IExportTrainConfigAction extends IPayloadAction<string, IProject> {
    type: ActionTypes.EXPORT_TRAIN_CONFIG_SUCCESS;
}
/**
 * Update Project Tag action type
 */
export interface IUpdateProjectTagAction extends IPayloadAction<string, IProject> {
    type: ActionTypes.UPDATE_PROJECT_TAG_SUCCESS;
}

/**
 * Delete project tag action type
 */
export interface IDeleteProjectTagAction extends IPayloadAction<string, IProject> {
    type: ActionTypes.DELETE_PROJECT_TAG_SUCCESS;
}

export interface IDeleteProjectAssetAction extends IPayloadAction<string, IProject> {
    type: ActionTypes.DELETE_PROJECT_ASSET_SUCCESS;
}

/**
 * Instance of Load Project action
 */
export const loadProjectAction = createPayloadAction<ILoadProjectAction>(ActionTypes.LOAD_PROJECT_SUCCESS);
/**
 * Instance of Close Project action
 */
export const closeProjectAction = createAction<ICloseProjectAction>(ActionTypes.CLOSE_PROJECT_SUCCESS);
/**
 * Instance of Save Project action
 */
export const saveProjectAction = createPayloadAction<ISaveProjectAction>(ActionTypes.SAVE_PROJECT_SUCCESS);
/**
 * Instance of Delete Project action
 */
export const deleteProjectAction = createPayloadAction<IDeleteProjectAction>(ActionTypes.DELETE_PROJECT_SUCCESS);
/**
 * Instance of Load Project Assets action
 */
export const loadProjectAssetsAction =
    createPayloadAction<ILoadProjectAssetsAction>(ActionTypes.LOAD_PROJECT_ASSETS_SUCCESS);
/**
 * Instance of Load Asset Metadata action
 */
export const loadAssetMetadataAction =
    createPayloadAction<ILoadAssetMetadataAction>(ActionTypes.LOAD_ASSET_METADATA_SUCCESS);
/**
 * Instance of Save Asset Metadata action
 */
export const saveAssetMetadataAction =
    createPayloadAction<ISaveAssetMetadataAction>(ActionTypes.SAVE_ASSET_METADATA_SUCCESS);
/**
 * Instance of Export Project action
 */
export const exportProjectAction =
    createPayloadAction<IExportProjectAction>(ActionTypes.EXPORT_PROJECT_SUCCESS);
/**
 * Instance of Export Project action
 */
export const exportTrainConfigAction =
    createPayloadAction<IExportTrainConfigAction>(ActionTypes.EXPORT_TRAIN_CONFIG_SUCCESS);
/**
 * Instance of Update project tag action
 */
export const updateProjectTagAction =
    createPayloadAction<IUpdateProjectTagAction>(ActionTypes.UPDATE_PROJECT_TAG_SUCCESS);
/**
 * Instance of Delete project tag action
 */
export const deleteProjectTagAction =
    createPayloadAction<IDeleteProjectTagAction>(ActionTypes.DELETE_PROJECT_TAG_SUCCESS);

export const deleteProjectAssetAction =
    createPayloadAction<IDeleteProjectAssetAction>(ActionTypes.DELETE_PROJECT_ASSET_SUCCESS);
