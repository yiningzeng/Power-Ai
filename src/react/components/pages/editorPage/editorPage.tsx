///<reference path="../../../../models/applicationState.ts"/>
import _ from "lodash";
import React, {RefObject} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router-dom";
import SplitPane from "react-split-pane";
import {bindActionCreators} from "redux";
import {SelectionMode} from "vott-ct/lib/js/CanvasTools/Interface/ISelectorSettings";
import HtmlFileReader from "../../../../common/htmlFileReader";
import {strings} from "../../../../common/strings";
import {
    AppError,
    AssetState,
    AssetType,
    EditorMode,
    ErrorCode,
    IAdditionalPageSettings,
    IApplicationState,
    IAppSettings,
    IAsset,
    IAssetMetadata, IConnection,
    IProject, IProviderOptions,
    IRegion, ISecureString,
    ISize,
    ITag,
    IZoomMode,
} from "../../../../models/applicationState";
import {IToolbarItemRegistration, ToolbarItemFactory} from "../../../../providers/toolbar/toolbarItemFactory";
import IApplicationActions, * as applicationActions from "../../../../redux/actions/applicationActions";
import IProjectActions, * as projectActions from "../../../../redux/actions/projectActions";
import {ToolbarItemName} from "../../../../registerToolbar";
import {AssetService} from "../../../../services/assetService";
import {AssetPreview} from "../../common/assetPreview/assetPreview";
import {KeyboardBinding} from "../../common/keyboardBinding/keyboardBinding";
import {KeyEventType} from "../../common/keyboardManager/keyboardManager";
import {TagInput} from "../../common/tagInput/tagInput";
import {ToolbarItem} from "../../toolbar/toolbarItem";
import Canvas from "./canvas";
import CanvasHelpers from "./canvasHelpers";
import "./editorPage.scss";
import EditorSideBar from "./editorSideBar";
import {EditorToolbar} from "./editorToolbar";
import Alert from "../../common/alert/alert";
import Confirm from "../../common/confirm/confirm";
import {ActiveLearningService} from "../../../../services/activeLearningService";
import {toast} from "react-toastify";
import CondensedList from "../../common/condensedList/condensedList";
import SourceItem from "../../common/condensedList/sourceItem";
import {Rnd} from "react-rnd";
import Zoom from "../../common/zoom/zoom";

import {ILocalFileSystemProxyOptions, LocalFileSystemProxy} from "../../../../providers/storage/localFileSystemProxy";
import {async} from "q";
import * as connectionActions from "../../../../redux/actions/connectionActions";
// import "antd/lib/tree/style/css";

let projectId;

const emptyZoomMode: IZoomMode = {
    disableDrag: true,
    x: 0,
    y: 0,
    miniWidth: 800,
    width: 1000, // "auto",
    height: 1000, // "auto",
};
/**
 * Properties for Editor Page
 * @member project - Project being edited
 * @member recentProjects - Array of projects recently viewed/edited
 * @member actions - Project actions
 * @member applicationActions - Application setting actions
 */
export interface IEditorPageProps extends RouteComponentProps, React.Props<EditorPage> {
    project: IProject;
    recentProjects: IProject[];
    appSettings: IAppSettings;
    actions: IProjectActions;
    applicationActions: IApplicationActions;
}

/**
 * State for Editor Page
 */
export interface IEditorPageState {
    treeList: IProviderOptions[] | ISecureString[];
    /** Array of assets in project */
    assets: IAsset[];
    /** The editor mode to set for canvas tools */
    editorMode: EditorMode;
    /** The selection mode to set for canvas tools */
    selectionMode: SelectionMode;
    /** The selected asset for the primary editing experience */
    selectedAsset?: IAssetMetadata;
    /** Currently selected region on current asset */
    selectedRegions?: IRegion[];
    /** The child assets used for nest asset typs */
    childAssets?: IAsset[];
    /** Additional settings for asset previews */
    additionalSettings?: IAdditionalPageSettings;
    /** Most recently selected tag */
    selectedTag: string;
    /** Tags locked for region labeling */
    lockedTags: string[];
    /** Size of the asset thumbnails to display in the side bar */
    thumbnailSize: ISize;
    /**
     * Whether or not the editor is in a valid state
     * State is invalid when a region has not been tagged
     */
    isValid: boolean;
    /** Whether the show invalid region warning alert should display */
    showInvalidRegionWarning: boolean;
    zoomMode: IZoomMode;
}

function mapStateToProps(state: IApplicationState) {
    return {
        recentProjects: state.recentProjects,
        project: state.currentProject,
        appSettings: state.appSettings,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projectActions, dispatch),
        applicationActions: bindActionCreators(applicationActions, dispatch),
    };
}

/**
 * @name - Editor Page
 * @description - Page for adding/editing/removing tags to assets
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class EditorPage extends React.Component<IEditorPageProps, IEditorPageState> {

    public state: IEditorPageState = {
        treeList: [],
        selectedTag: null,
        lockedTags: [],
        selectionMode: SelectionMode.RECT,
        assets: [],
        childAssets: [],
        editorMode: EditorMode.Rectangle,
        additionalSettings: {
            videoSettings: (this.props.project) ? this.props.project.videoSettings : null,
            activeLearningSettings: (this.props.project) ? this.props.project.activeLearningSettings : null,
        },
        thumbnailSize: this.props.appSettings.thumbnailSize || { width: 350, height: 90 },
        isValid: true,
        showInvalidRegionWarning: false,
        zoomMode: emptyZoomMode,
    };
    private localFileSystem: LocalFileSystemProxy;

    private activeLearningService: ActiveLearningService = null;
    private loadingProjectAssets: boolean = false;
    private toolbarItems: IToolbarItemRegistration[] = ToolbarItemFactory.getToolbarItems();
    private canvas: RefObject<Canvas> = React.createRef();
    private renameTagConfirm: React.RefObject<Confirm> = React.createRef();
    private deleteTagConfirm: React.RefObject<Confirm> = React.createRef();
    private deleteSourceProviderConfirm: React.RefObject<Confirm> = React.createRef();
    private deleteConfirm: React.RefObject<Confirm> = React.createRef();

    constructor(props, context) {
        super(props, context);
        this.localFileSystem = new LocalFileSystemProxy();
    }

    public async componentDidMount() {
        projectId = this.props.match.params["projectId"];
        if (this.props.project) {
            await this.loadProjectAssets();
        } else if (projectId) {
            const project = this.props.recentProjects.find((project) => project.id === projectId);
            await this.props.actions.loadProject(project);
        }
        this.setState({
            treeList: this.props.project.sourceConnection.providerOptionsOthers,
        });
        console.log("editorPage: project" + JSON.stringify(this.props.project));
        this.activeLearningService = new ActiveLearningService(this.props.project.activeLearningSettings);
    }

    public async componentDidUpdate(prevProps: Readonly<IEditorPageProps>) {
        if (this.props.project && this.state.assets.length === 0) {
            await this.loadProjectAssets();
        }
        console.log("editorPage: componentDidUpdate this.props.project: " + JSON.stringify(this.props.project));
        // Navigating directly to the page via URL (ie, http://vott/projects/a1b2c3dEf/edit) sets the default state
        // before props has been set, this updates the project and additional settings to be valid once props are
        // retrieved.
        console.log("editorPage: componentDidUpdate prevProps: " + JSON.stringify(prevProps));
        if (this.props.project && !prevProps.project) {
            this.setState({
                treeList: this.props.project.sourceConnection.providerOptionsOthers,
                additionalSettings: {
                    videoSettings: (this.props.project) ? this.props.project.videoSettings : null,
                    activeLearningSettings: (this.props.project) ? this.props.project.activeLearningSettings : null,
                },
            });
        }
        console.log("editorPage: componentDidUpdate this.state" + JSON.stringify(this.state));
        if (this.props.project && prevProps.project && this.props.project.tags !== prevProps.project.tags) {
            this.updateRootAssets();
        }
    }

    public render() {
        // console.log(document.getElementById("ct-zone").offsetWidth);
        // if (this.state.zoomMode.width === "auto") {
        //     this.setState({
        //         zoomMode: {
        //             ...this.state.zoomMode,
        //             width: Number(document.getElementById("ct-zone")),
        //             height: Number(document.getElementById("ct-zone").style.height),
        //         },
        //     });
        // }
        const { project } = this.props;
        const { treeList, assets, selectedAsset } = this.state;
        const rootAssets = assets.filter((asset) => !asset.parent);
        console.log("editorPage: render project ", project);
        console.log("editorPage: render assets ", assets);
        console.log("editorPage: render selectedAsset ", selectedAsset);
        if (!project) {
            return (<div>Loading...</div>);
        }
        const folderPath = project.sourceConnection.providerOptions["folderPath"];
        console.log("editorPage: render folderPath ", folderPath);
        console.log("editorPage: render treeList ", treeList);
        return (
            <div className="editor-page">
                {[...Array(10).keys()].map((index) => {
                    return (<KeyboardBinding
                        displayName={strings.editorPage.tags.hotKey.apply}
                        key={index}
                        keyEventType={KeyEventType.KeyDown}
                        accelerators={[`${index}`]}
                        icon={"fa-tag"}
                        handler={this.handleTagHotKey} />);
                })}
                {[...Array(10).keys()].map((index) => {
                    return (<KeyboardBinding
                        displayName={strings.editorPage.tags.hotKey.lock}
                        key={index}
                        keyEventType={KeyEventType.KeyDown}
                        accelerators={[`CmdOrCtrl+${index}`]}
                        icon={"fa-lock"}
                        handler={this.handleCtrlTagHotKey} />);
                })}
                <SplitPane split="vertical"
                    defaultSize={this.state.thumbnailSize.width}
                    minSize={300}
                    maxSize={400}
                    paneStyle={{ display: "flex" }}
                    onChange={this.onSideBarResize}
                    onDragFinished={this.onSideBarResizeComplete}>
                    <div className="editor-page-sidebar bg-lighter-1">
                        <div className="editor-page-sidebar-tree bg-lighter-1">
                            <CondensedList
                                title="素材文件夹"
                                Component={SourceItem}
                                items={this.state.treeList}
                                onAddClick={async () => {
                                    console.log("新增文件夹");
                                    const filePath = await this.localFileSystem.selectContainer();
                                    if (filePath === undefined) { return; }
                                    const provider: ILocalFileSystemProxyOptions = {
                                        folderPath: filePath,
                                    };
                                    const newSource: IConnection = {
                                        id: new Date().getTime().toString(),
                                        name: new Date().getTime().toString(),
                                        providerType: "localFileSystemProxy",
                                        providerOptions: provider,
                                    };
                                    connectionActions.saveConnection(newSource);

                                    const newProject: IProject = {
                                        ...project,
                                        sourceConnection: {
                                            ...project.sourceConnection,
                                            providerOptionsOthers: [
                                                ...project.sourceConnection.providerOptionsOthers,
                                                provider,
                                            ],
                                        },
                                    };
                                    await this.props.applicationActions.ensureSecurityToken(newProject);
                                    await this.props.actions.saveProject(newProject);
                                    this.setState({
                                        treeList: newProject.sourceConnection.providerOptionsOthers,
                                    });
                                }}
                                onClick={ async (item) => {
                                    // if ( item === "已处理") {
                                    //     this.setState({
                                    //         assets: [],
                                    //     });
                                    //     this.loadProjectAssets();
                                    // } else { this.loadProjectAssetsWithFolder(item.toString()); }
                                    const newProject: IProject = {
                                        ...project,
                                        sourceConnection: {
                                            ...project.sourceConnection,
                                            providerOptions: item,
                                        },
                                    };
                                    await this.props.applicationActions.ensureSecurityToken(newProject);
                                    await this.props.actions.saveProject(newProject);
                                    this.loadingProjectAssets = false;
                                    this.setState({
                                        assets: [],
                                    });
                                    this.loadProjectAssets();
                                }}
                                onDelete={async (item) => {
                                   this.deleteSourceProviderConfirm.current.open(project, item);
                                    // let aa: string[];
                                    // aa = project.sourceListConnection;
                                    // aa.splice(aa.indexOf(item), 1);
                                    // project.sourceListConnection = aa;
                                    // await this.props.applicationActions.ensureSecurityToken(project);
                                    // await this.props.actions.saveProject(project);
                                }}
                                showToolbar={true}/>
                        </div>
                        <EditorSideBar
                            assets={rootAssets}
                            selectedAsset={selectedAsset ? selectedAsset.asset : null}
                            onBeforeAssetSelected={this.onBeforeAssetSelected}
                            onAssetSelected={this.selectAsset}
                            thumbnailSize={this.state.thumbnailSize}
                        />
                    </div>
                    <div className="editor-page-content" onClick={this.onPageClick}>
                        <div className="editor-page-content-main">
                            <div className="editor-page-content-main-header">
                                <EditorToolbar project={this.props.project}
                                    items={this.toolbarItems}
                                    actions={this.props.actions}
                                    onToolbarItemSelected={this.onToolbarItemSelected} />
                            </div>
                            <div className="editor-page-content-main-body">
                                {selectedAsset &&
                                <Rnd
                                    ref="editorDom"
                                    disableDragging={this.state.zoomMode.disableDrag}
                                    size={{ width: this.state.zoomMode.width,  height: this.state.zoomMode.height }}
                                    position={{ x: this.state.zoomMode.x, y: this.state.zoomMode.y }}
                                    onDragStop={(e, d) => {
                                        this.setState({
                                            zoomMode: {
                                                ...this.state.zoomMode,
                                                x: d.x,
                                                y: d.y,
                                            },
                                        });
                                    }}
                                    onResize={(e, direction, ref, delta, position) => {
                                        this.setState({
                                            zoomMode: {
                                                ...this.state.zoomMode,
                                                ...position,
                                                width: ref.offsetWidth,
                                                height: ref.offsetHeight,
                                            },
                                        });
                                    }}
                                    onWheel={ (e) => Zoom(e, (deltaY) => {
                                        const w = document.getElementById("ct-zone").offsetWidth;
                                        if ((w - deltaY) < this.state.zoomMode.miniWidth) { return; }
                                        this.setState({
                                            zoomMode: {
                                                ...this.state.zoomMode,
                                                width: ( w - deltaY),
                                            },
                                        });
                                        console.log("fuck" + deltaY + "       " + this.state.zoomMode.width);
                                    })}
                                >
                                    <Canvas
                                        ref={this.canvas}
                                        selectedAsset={this.state.selectedAsset}
                                        onAssetMetadataChanged={this.onAssetMetadataChanged}
                                        onCanvasRendered={this.onCanvasRendered}
                                        onSelectedRegionsChanged={this.onSelectedRegionsChanged}
                                        editorMode={this.state.editorMode}
                                        selectionMode={this.state.selectionMode}
                                        project={this.props.project}
                                        lockedTags={this.state.lockedTags}>
                                        <AssetPreview
                                            additionalSettings={this.state.additionalSettings}
                                            autoPlay={true}
                                            controlsEnabled={this.state.isValid}
                                            onBeforeAssetChanged={this.onBeforeAssetSelected}
                                            onChildAssetSelected={this.onChildAssetSelected}
                                            asset={this.state.selectedAsset.asset}
                                            childAssets={this.state.childAssets} />
                                    </Canvas>
                                </Rnd>
                                }
                            </div>
                        </div>
                        <div className="editor-page-right-sidebar">
                            <TagInput
                                tags={this.props.project.tags}
                                lockedTags={this.state.lockedTags}
                                selectedRegions={this.state.selectedRegions}
                                onChange={this.onTagsChanged}
                                onLockedTagsChange={this.onLockedTagsChanged}
                                onTagClick={this.onTagClicked}
                                onCtrlTagClick={this.onCtrlTagClicked}
                                onTagRenamed={this.confirmTagRenamed}
                                onTagDeleted={this.confirmTagDeleted}
                            />
                        </div>
                        <Confirm title={strings.editorPage.tags.rename.title}
                            ref={this.renameTagConfirm}
                            message={strings.editorPage.tags.rename.confirmation}
                            confirmButtonColor="danger"
                            onConfirm={this.onTagRenamed} />
                        <Confirm title={strings.editorPage.tags.delete.title}
                            ref={this.deleteTagConfirm}
                            message={strings.editorPage.tags.delete.confirmation}
                            confirmButtonColor="danger"
                            onConfirm={this.onTagDeleted} />
                        <Confirm title={strings.projectSettings.sourceConnection.removeProvider.title}
                                 ref={this.deleteSourceProviderConfirm}
                                 message={strings.projectSettings.sourceConnection.removeProvider.confirmation}
                                 confirmButtonColor="danger"
                                 onConfirm={this.onSourceProviderDeleted} />
                        <Confirm title={strings.editorPage.canvas.deleteAsset.title}
                                 ref={this.deleteConfirm as any}
                                 message={strings.editorPage.canvas.deleteAsset.confirmation}
                                 confirmButtonColor="danger"
                                 onConfirm={this.onAssetDeleted}/>
                    </div>
                </SplitPane>
                <Alert show={this.state.showInvalidRegionWarning}
                    title={strings.editorPage.messages.enforceTaggedRegions.title}
                    // tslint:disable-next-line:max-line-length
                    message={strings.editorPage.messages.enforceTaggedRegions.description}
                    closeButtonColor="info"
                    onClose={() => this.setState({ showInvalidRegionWarning: false })} />
            </div>
        );
    }

    private onPageClick = () => {
        this.setState({
            selectedRegions: [],
        });
    }

    private onSourceProviderDeleted = async (project: IProject, item: IProviderOptions|ISecureString):
        Promise<void> => {
        const newProject: IProject = {
            ...project,
            sourceConnection: {
                ...project.sourceConnection,
                providerOptionsOthers:
                    project.sourceConnection.providerOptionsOthers.filter(
                        (i) => i !== item,
                    ),
            },
        };
        await this.props.applicationActions.ensureSecurityToken(newProject);
        await this.props.actions.saveProject(newProject);
        this.setState({
            treeList: this.state.treeList.filter((i) => i !== item),
        });
    }

    /**
     * Remove asset and projects and saves files
     * @param tagName Name of tag to be deleted
     */
    private onAssetDeleted = async (): Promise<void> => {
        const { selectedAsset } = this.state;
        // await this.localFileSystem.deleteDirectory(decodeURI(selectedAsset.asset.path.replace("file:", "")));
        // this.props.project.assets[selectedAsset.asset.id].
        this.canvas.current.removeAllRegions();
        await this.props.actions.deleteAsset(this.props.project, selectedAsset.asset);
        toast.success(`成功删除`);
        this.loadingProjectAssets = false;
        this.setState({
            assets: [],
        });
        this.loadProjectAssets();
        // this.updateRootAssets();
    }

    /**
     * Called when the asset side bar is resized
     * @param newWidth The new sidebar width
     */
    private onSideBarResize = (newWidth: number) => {
        this.setState({
            thumbnailSize: {
                width: newWidth,
                height: newWidth / (4 / 3),
            },
        }, () => this.canvas.current.forceResize());
    }

    /**
     * Called when the asset sidebar has been completed
     */
    private onSideBarResizeComplete = () => {
        const appSettings = {
            ...this.props.appSettings,
            thumbnailSize: this.state.thumbnailSize,
        };

        this.props.applicationActions.saveAppSettings(appSettings);
    }

    /**
     * Called when a tag from footer is clicked
     * @param tag Tag clicked
     */
    private onTagClicked = (tag: ITag): void => {
        console.log("editorPage: onTagClicked: " + JSON.stringify(tag));
        if (tag.name === "OK") {
            this.canvas.current.removeAllRegions();
            this.setState({
                selectedAsset: {
                    ...this.state.selectedAsset,
                    asset: {
                        ...this.state.selectedAsset.asset,
                        state: AssetState.OkTagged,
                    },
                },
            });
            // toast.success("图片ok,删除所有的框");
            // asdsds
            console.log("editorPage: onTagClicked: his.state.selectedAsset: OK " + JSON.stringify(this.state.selectedAsset));
            return;
        } else {
            this.setState({
                selectedTag: tag.name,
                lockedTags: [],
                selectedAsset: {
                    ...this.state.selectedAsset,
                    asset: {
                        ...this.state.selectedAsset.asset,
                        state: AssetState.Tagged,
                    },
                },
            }, () => this.canvas.current.applyTag(tag.name));
            console.log("editorPage: onTagClicked: his.state.selectedAsset: Tagged " + JSON.stringify(this.state.selectedAsset));
        }
    }

    /**
     * Open confirm dialog for tag renaming
     */
    private confirmTagRenamed = (tagName: string, newTagName: string): void => {
        this.renameTagConfirm.current.open(tagName, newTagName);
    }

    /**
     * Renames tag in assets and project, and saves files
     * @param tagName Name of tag to be renamed
     * @param newTagName New name of tag
     */
    private onTagRenamed = async (tagName: string, newTagName: string): Promise<void> => {
        const assetUpdates = await this.props.actions.updateProjectTag(this.props.project, tagName, newTagName);
        const selectedAsset = assetUpdates.find((am) => am.asset.id === this.state.selectedAsset.asset.id);

        if (selectedAsset) {
            if (selectedAsset) {
                this.setState({ selectedAsset });
            }
        }
    }

    /**
     * Open Confirm dialog for tag deletion
     */
    private confirmTagDeleted = (tagName: string): void => {
        this.deleteTagConfirm.current.open(tagName);
    }

    /**
     * Removes tag from assets and projects and saves files
     * @param tagName Name of tag to be deleted
     */
    private onTagDeleted = async (tagName: string): Promise<void> => {
        const assetUpdates = await this.props.actions.deleteProjectTag(this.props.project, tagName);
        const selectedAsset = assetUpdates.find((am) => am.asset.id === this.state.selectedAsset.asset.id);

        if (selectedAsset) {
            this.setState({ selectedAsset });
        }
    }

    private onCtrlTagClicked = (tag: ITag): void => {
        const locked = this.state.lockedTags;
        this.setState({
            selectedTag: tag.name,
            lockedTags: CanvasHelpers.toggleTag(locked, tag.name),
        }, () => this.canvas.current.applyTag(tag.name));
    }

    private getTagFromKeyboardEvent = (event: KeyboardEvent): ITag => {
        let key = parseInt(event.key, 10);
        if (isNaN(key)) {
            try {
                key = parseInt(event.key.split("+")[1], 10);
            } catch (e) {
                return;
            }
        }
        let index: number;
        const tags = this.props.project.tags;
        if (key === 0 && tags.length >= 10) {
            index = 9;
        } else if (key < 10) {
            index = key - 1;
        }
        if (index < tags.length) {
            return tags[index];
        }
        return null;
    }

    /**
     * Listens for {number key} and calls `onTagClicked` with tag corresponding to that number
     * @param event KeyDown event
     */
    private handleTagHotKey = (event: KeyboardEvent): void => {
        const tag = this.getTagFromKeyboardEvent(event);
        if (tag) {
            this.onTagClicked(tag);
        }
    }

    private handleCtrlTagHotKey = (event: KeyboardEvent): void => {
        const tag = this.getTagFromKeyboardEvent(event);
        if (tag) {
            this.onCtrlTagClicked(tag);
        }
    }

    /**
     * Raised when a child asset is selected on the Asset Preview
     * ex) When a video is paused/seeked to on a video
     */
    private onChildAssetSelected = async (childAsset: IAsset) => {
        if (this.state.selectedAsset && this.state.selectedAsset.asset.id !== childAsset.id) {
            await this.selectAsset(childAsset);
        }
    }

    /**
     * Returns a value indicating whether the current asset is taggable
     */
    private isTaggableAssetType = (asset: IAsset): boolean => {
        return asset.type !== AssetType.Unknown && asset.type !== AssetType.Video;
    }

    /**
     * Raised when the selected asset has been changed.
     * This can either be a parent or child asset
     */
    private onAssetMetadataChanged = async (assetMetadata: IAssetMetadata): Promise<void> => {
        // If the asset contains any regions without tags, don't proceed.
        const regionsWithoutTags = assetMetadata.regions.filter((region) => region.tags.length === 0);

        if (regionsWithoutTags.length > 0) {
            this.setState({ isValid: false });
            return;
        }

        const initialState = assetMetadata.asset.state;

        // The root asset can either be the actual asset being edited (ex: VideoFrame) or the top level / root
        // asset selected from the side bar (image/video).
        const rootAsset = { ...(assetMetadata.asset.parent || assetMetadata.asset) };
        console.log("assetMetadata: " + JSON.stringify(assetMetadata));
        if (this.isTaggableAssetType(assetMetadata.asset)) {
            if (assetMetadata.asset.state === AssetState.OkTagged) {
                assetMetadata.asset.state = AssetState.OkTagged;
            } else {
                assetMetadata.asset.state = assetMetadata.regions.length > 0 ? AssetState.Tagged : AssetState.Visited;
            }
            console.log("assetMetadata " + JSON.stringify(assetMetadata));
        } else if (assetMetadata.asset.state === AssetState.NotVisited) {
            assetMetadata.asset.state = AssetState.Visited;
        }

        // Update root asset if not already in the "Tagged" state
        // This is primarily used in the case where a Video Frame is being edited.
        // We want to ensure that in this case the root video asset state is accurately
        // updated to match that state of the asset.
        if (rootAsset.id === assetMetadata.asset.id) {
            rootAsset.state = assetMetadata.asset.state;
        } else {
            const rootAssetMetadata = await this.props.actions.loadAssetMetadata(this.props.project, rootAsset);

            if (rootAssetMetadata.asset.state !== AssetState.Tagged) {
                rootAssetMetadata.asset.state = assetMetadata.asset.state;
                await this.props.actions.saveAssetMetadata(this.props.project, rootAssetMetadata);
            }

            rootAsset.state = rootAssetMetadata.asset.state;
        }

        // Only update asset metadata if state changes or is different
        if (initialState !== assetMetadata.asset.state || this.state.selectedAsset !== assetMetadata) {
            await this.props.actions.saveAssetMetadata(this.props.project, assetMetadata);
        }

        await this.props.actions.saveProject(this.props.project);

        const assetService = new AssetService(this.props.project);
        const childAssets = assetService.getChildAssets(rootAsset);

        // Find and update the root asset in the internal state
        // This forces the root assets that are displayed in the sidebar to
        // accurately show their correct state (not-visited, visited or tagged)
        const assets = [...this.state.assets];
        const assetIndex = assets.findIndex((asset) => asset.id === rootAsset.id);
        if (assetIndex > -1) {
            assets[assetIndex] = {
                ...rootAsset,
            };
        }

        this.setState({ childAssets, assets, isValid: true });
    }

    /**
     * Raised when the asset binary has been painted onto the canvas tools rendering canvas
     */
    private onCanvasRendered = async (canvas: HTMLCanvasElement) => {
        // When active learning auto-detect is enabled
        // run predictions when asset changes
        if (this.props.project.activeLearningSettings.autoDetect && !this.state.selectedAsset.asset.predicted) {
            await this.predictRegions(canvas);
        }
    }

    private onSelectedRegionsChanged = (selectedRegions: IRegion[]) => {
        this.setState({ selectedRegions });
    }

    private onTagsChanged = async (tags) => {
        const project = {
            ...this.props.project,
            tags,
        };

        await this.props.actions.saveProject(project);
    }

    private onLockedTagsChanged = (lockedTags: string[]) => {
        this.setState({ lockedTags });
    }

    private onToolbarItemSelected = async (toolbarItem: ToolbarItem): Promise<void> => {
        let w;
        let zoomDelta;
        switch (toolbarItem.props.name) {
            case ToolbarItemName.DrawRectangle:
                this.setState({
                    selectionMode: SelectionMode.RECT,
                    editorMode: EditorMode.Rectangle,
                    zoomMode: {
                        ...this.state.zoomMode,
                        disableDrag: true,
                    },
                });
                break;
            case ToolbarItemName.DrawPolygon:
                this.setState({
                    selectionMode: SelectionMode.POLYGON,
                    editorMode: EditorMode.Polygon,
                    zoomMode: {
                        ...this.state.zoomMode,
                        disableDrag: true,
                    },
                });
                break;
            case ToolbarItemName.CopyRectangle:
                this.setState({
                    selectionMode: SelectionMode.COPYRECT,
                    editorMode: EditorMode.CopyRect,
                });
                break;
            case ToolbarItemName.ShowAllRegions:
                break;
            case ToolbarItemName.HideAllRegions:
                break;
            case ToolbarItemName.SelectCanvas:
                this.setState({
                    selectionMode: SelectionMode.NONE,
                    editorMode: EditorMode.Select,
                    zoomMode: {
                        ...this.state.zoomMode,
                        disableDrag: false,
                    },
                });
                break;
            case ToolbarItemName.ZoomOutAsset: // 缩小
                w = document.getElementById("ct-zone").offsetWidth;
                zoomDelta = w - 100;
                if ( zoomDelta < this.state.zoomMode.miniWidth) { return; }
                this.setState({
                    zoomMode: {
                        ...this.state.zoomMode,
                        width: zoomDelta,
                    },
                });
                break;
            case ToolbarItemName.ZoomInAsset: // 放大
                w = document.getElementById("ct-zone").offsetWidth;
                zoomDelta = w + 100;
                if ( zoomDelta < this.state.zoomMode.miniWidth) { return; }
                this.setState({
                    zoomMode: {
                        ...this.state.zoomMode,
                        width: zoomDelta,
                    },
                });
                break;
            case ToolbarItemName.ZoomNormolAsset: // 正常
                this.setState({
                    ...this.state,
                    zoomMode: {
                        ...emptyZoomMode,
                        disableDrag: this.state.zoomMode.disableDrag,
                    },
                });
                break;
            case ToolbarItemName.PreviousAsset:
                await this.goToRootAsset(-1);
                break;
            case ToolbarItemName.NextAsset:
                await this.goToRootAsset(1);
                break;
            case ToolbarItemName.DeleteAsset:
                this.deleteConfirm.current.open();
                break;
            case ToolbarItemName.CopyRegions:
                this.canvas.current.copyRegions();
                break;
            case ToolbarItemName.CutRegions:
                this.canvas.current.cutRegions();
                break;
            case ToolbarItemName.PasteRegions:
                this.canvas.current.pasteRegions();
                break;
            case ToolbarItemName.RemoveAllRegions:
                this.canvas.current.confirmRemoveAllRegions();
                break;
            case ToolbarItemName.ActiveLearning:
                await this.predictRegions();
                break;
            case ToolbarItemName.ExportProject:
                // toast.error("开始到处");
                this.props.history.push(`/projects/${projectId}/export`);
                break;
            case ToolbarItemName.TrainAi:
                // toast.error("开始到处");
                this.props.history.push(`/projects/${projectId}/train`);
                break;
        }
    }

    private predictRegions = async (canvas?: HTMLCanvasElement) => {
        canvas = canvas || document.querySelector("canvas");
        if (!canvas) {
            return;
        }

        // Load the configured ML model
        if (!this.activeLearningService.isModelLoaded()) {
            let toastId: number = null;
            try {
                toastId = toast.info(strings.activeLearning.messages.loadingModel, { autoClose: false });
                await this.activeLearningService.ensureModelLoaded();
            } catch (e) {
                toast.error(strings.activeLearning.messages.errorLoadModel);
                return;
            } finally {
                toast.dismiss(toastId);
            }
        }

        // Predict and add regions to current asset
        try {
            const updatedAssetMetadata = await this.activeLearningService
                .predictRegions(canvas, this.state.selectedAsset);

            await this.onAssetMetadataChanged(updatedAssetMetadata);
            this.setState({ selectedAsset: updatedAssetMetadata });
        } catch (e) {
            throw new AppError(ErrorCode.ActiveLearningPredictionError, "Error predicting regions");
        }
    }

    /**
     * Navigates to the previous / next root asset on the sidebar
     * @param direction Number specifying asset navigation
     */
    private goToRootAsset = async (direction: number) => {
        this.setState({
            ...this.state,
            zoomMode: {
                ...emptyZoomMode,
                disableDrag: this.state.zoomMode.disableDrag,
            },
        });
        const selectedRootAsset = this.state.selectedAsset.asset.parent || this.state.selectedAsset.asset;
        const currentIndex = this.state.assets
            .findIndex((asset) => asset.id === selectedRootAsset.id);

        if (direction > 0) {
            await this.selectAsset(this.state.assets[Math.min(this.state.assets.length - 1, currentIndex + 1)]);
        } else {
            await this.selectAsset(this.state.assets[Math.max(0, currentIndex - 1)]);
        }
    }

    private onBeforeAssetSelected = (): boolean => {
        if (!this.state.isValid) {
            this.setState({ showInvalidRegionWarning: true });
        }

        return this.state.isValid;
    }

    private selectAsset = async (asset: IAsset): Promise<void> => {
        // Nothing to do if we are already on the same asset.
        if (this.state.selectedAsset && this.state.selectedAsset.asset.id === asset.id) {
            return;
        }

        if (!this.state.isValid) {
            this.setState({ showInvalidRegionWarning: true });
            return;
        }

        const assetMetadata = await this.props.actions.loadAssetMetadata(this.props.project, asset);

        try {
            if (!assetMetadata.asset.size) {
                const assetProps = await HtmlFileReader.readAssetAttributes(asset);
                assetMetadata.asset.size = { width: assetProps.width, height: assetProps.height };
            }
        } catch (err) {
            console.warn("Error computing asset size");
        }

        this.setState({
            selectedAsset: assetMetadata,
        }, async () => {
            await this.onAssetMetadataChanged(assetMetadata);
        });
    }

    private loadProjectAssets = async (): Promise<void> => {
        if (this.loadingProjectAssets || this.state.assets.length > 0) {
            return;
        }

        this.loadingProjectAssets = true;

        // Get all root project assets
        const rootProjectAssets = _.values(this.props.project.assets)
            .filter((asset) => !asset.parent);

        // Get all root assets from source asset provider
        const sourceAssets = await this.props.actions.loadAssets(this.props.project);
        // Merge and uniquify
        const rootAssets = _(rootProjectAssets)
            .concat(sourceAssets)
            .uniqBy((asset) => asset.id)
            .value();

        const lastVisited = rootAssets.find((asset) => asset.id === this.props.project.lastVisitedAssetId);

        this.setState({
            assets: rootAssets,
        }, async () => {
            if (rootAssets.length > 0) {
                await this.selectAsset(lastVisited ? lastVisited : rootAssets[0]);
            }
            this.loadingProjectAssets = false;
        });
    }

    private loadProjectAssetsWithFolder = async (folder): Promise<void> => {
        if (this.loadingProjectAssets) {
            return;
        }
        console.log("editorPage: loadProjectAssetsWithFolder: " + folder);

        this.loadingProjectAssets = true;

        // Get all root project assets
        const rootProjectAssets = _.values(this.props.project.assets)
            .filter((asset) => !asset.parent);
        console.log("editorPage: loadProjectAssetsWithFolder: rootProjectAssets", rootProjectAssets);
        // Get all root assets from source asset provider
        const sourceAssets = await this.props.actions.loadAssetsWithFolder(this.props.project, folder);
        console.log("editorPage: loadProjectAssetsWithFolder: sourceAssets", sourceAssets);
        // Merge and uniquify
        const rootAssets = sourceAssets;
        _(rootProjectAssets)
            .concat(sourceAssets)
            .uniqBy((asset) => asset.id)
            .value();
        console.log("editorPage: loadProjectAssetsWithFolder: rootAssets", rootAssets);
        const lastVisited = rootAssets.find((asset) => asset.id === this.props.project.lastVisitedAssetId);

        this.setState({
            assets: rootAssets,
        }, async () => {
            if (rootAssets.length > 0) {
                await this.selectAsset(lastVisited ? lastVisited : rootAssets[0]);
            }
            this.loadingProjectAssets = false;
        });
    }

    /**
     * Updates the root asset list from the project assets
     */
    private updateRootAssets = () => {
        const updatedAssets = [...this.state.assets];
        updatedAssets.forEach((asset) => {
            const projectAsset = this.props.project.assets[asset.id];
            if (projectAsset) {
                asset.state = projectAsset.state;
            }
        });

        this.setState({ assets: updatedAssets });
    }
}
