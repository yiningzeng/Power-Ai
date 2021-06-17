import _ from "lodash";
import React, { SyntheticEvent } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { bindActionCreators } from "redux";
import { strings, interpolate } from "../../../../common/strings";
import IProjectActions, * as projectActions from "../../../../redux/actions/projectActions";
import IApplicationActions, * as applicationActions from "../../../../redux/actions/applicationActions";
import { CloudFilePicker } from "../../common/cloudFilePicker/cloudFilePicker";
import { ModalRemoteHostAdd } from "../../common/modalRemoteHostAdd/modalRemoteHostAdd";
import { ModalHomePageAddProject } from "../../common/modalHomePageAddProject/modalHomePageAddProject";
import { ModalSearchPcb } from "../../common/modalSearchPcb/modalSearchPcb";
import CondensedList from "../../common/condensedList/condensedList";
import Confirm from "../../common/confirm/confirm";
import FilePicker from "../../common/filePicker/filePicker";
import "./homePage.scss";
import RecentProjectItem from "./recentProjectItem";
import { constants } from "../../../../common/constants";
import {
    IApplicationState,
    IConnection,
    IProject,
    IFileInfo,
    ErrorCode,
    AppError,
    IAppError,
    IAppSettings,
    IAsset,
    IProviderOptions,
    IExportFormat,
    IExportProviderOptions,
    ISecureString,
    DefaultActiveLearningSettings,
    DefaultExportOptions,
    DefaultTrainOptions,
    ModelPathType,
    ITag,
    IProjectItem, ExportPath, IRemoteHostItem,
} from "../../../../models/applicationState";
import ImportService from "../../../../services/importService";
import { IAssetMetadata } from "../../../../models/applicationState";
import { toast } from "react-toastify";
import moment from "moment";
import MessageBox from "../../common/messageBox/messageBox";
import { isElectron, PlatformType } from "../../../../common/hostProcess";
import {ILocalFileSystemProxyOptions, LocalFileSystemProxy} from "../../../../providers/storage/localFileSystemProxy";
import * as connectionActions from "../../../../redux/actions/connectionActions";
import trainService from "../../../../services/trainService";
import {normalizeSlashes, randomIntInRange} from "../../../../common/utils";
import shortid from "shortid";
import {ExportAssetState} from "../../../../providers/export/exportProvider";
import {appInfo} from "../../../../common/appInfo";
import DraggableDialog from "../../common/draggableDialog/draggableDialog";
import RemoteHostItem from "./remoteHostItem";
import SourceItem from "../../common/condensedList/sourceItem";
import {TagInput} from "../../common/tagInput/tagInput";
import ProjectItem from "./projectItem";
import {CloudFileCopyPicker} from "../../common/cloudFileCopyPicker/cloudFileCopyPicker";
import {IpcRendererProxy} from "../../../../common/ipcRendererProxy";
import path from "path";
import axios from "axios";
import delay from "delay";
// tslint:disable-next-line:no-var-requires
const tagColors = require("../../common/tagColors.json");
export interface IHomePageProps extends RouteComponentProps, React.Props<HomePage> {
    recentProjects: IProject[];
    connections: IConnection[];
    actions: IProjectActions;
    applicationActions: IApplicationActions;
    appSettings: IAppSettings;
    project: IProject;
}

export interface IHomePageState {
    cloudPickerOpen: boolean;
    remoteHostList: IRemoteHostItem[]; // 首页远程主机列表
    projectList: IProjectItem[]; // 首页项目列表
}

function mapStateToProps(state: IApplicationState) {
    return {
        recentProjects: state.recentProjects,
        connections: state.connections,
        appSettings: state.appSettings,
        project: state.currentProject,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projectActions, dispatch),
        applicationActions: bindActionCreators(applicationActions, dispatch),
    };
}
@connect(mapStateToProps, mapDispatchToProps)
export default class HomePage extends React.Component<IHomePageProps, IHomePageState> {
    public state: IHomePageState = {
        cloudPickerOpen: false,
        remoteHostList: [],
        projectList: [],
    };

    private timer;
    private localFileSystem: LocalFileSystemProxy;
    private filePicker: React.RefObject<FilePicker> = React.createRef();
    private deleteConfirm: React.RefObject<Confirm> = React.createRef();
    private deleteRemoteHostConfirm: React.RefObject<Confirm> = React.createRef();
    private deleteProjectListConfirm: React.RefObject<Confirm> = React.createRef();
    private cloudFilePickerModal: React.RefObject<CloudFilePicker> = React.createRef();
    private copyRemoteAssetsModal: React.RefObject<CloudFileCopyPicker> = React.createRef();
    private inputCodeTagAssetsModal: React.RefObject<ModalSearchPcb> = React.createRef();
    private ModalRemoteHostAdd: React.RefObject<ModalRemoteHostAdd> = React.createRef();
    private modalHomePageAddProject: React.RefObject<ModalHomePageAddProject> = React.createRef();
    private importConfirm: React.RefObject<Confirm> = React.createRef();
    private draggableDialog: React.RefObject<DraggableDialog> = React.createRef();
    private draggableDialogNormal: React.RefObject<DraggableDialog> = React.createRef();
    constructor(props, context) {
        super(props, context);
        this.checkServer();
        this.localFileSystem = new LocalFileSystemProxy();
        // 试用版本使用这个
        // if (this.props.appSettings.zengyining === undefined || this.props.appSettings.zengyining === null) {
        //     toast.warn("您当前处于试用权限，有些功能会受限制", { autoClose: false });
        // } else {
        //     const newAppSettings = {
        //         ...this.props.appSettings,
        //         zengyining: undefined,
        //     };
        //     this.props.applicationActions.saveAppSettings(newAppSettings);
        //     toast.warn("您当前处于试用权限，有些功能会受限制", {autoClose: false});
        // }
        // if (this.props.appSettings.deadline === undefined || this.props.appSettings.deadline === null) {
        //     const newAppSettings = {
        //         ...this.props.appSettings,
        //         deadline: moment().add(90, "days").format("YYYY-MM-DD"),
        //     };
        //     this.props.applicationActions.saveAppSettings(newAppSettings);
        // }
        // 试用版本使用这个
        // 正式版使用这个
        if (this.props.appSettings.zengyining === undefined || this.props.appSettings.zengyining === null) {
            const newAppSettings = {
                ...this.props.appSettings,
                zengyining: true,
            };
            this.props.applicationActions.saveAppSettings(newAppSettings);
        }
        this.loadRemoteHostList();
        this.loadProjectList();
        // 正式版使用这个
    }

    // 加载远程主机
    public loadRemoteHostList() {
        IpcRendererProxy.send(`TrainingSystem:JsonRead`, [constants.remoteHostFileName]).then((txt) => {
            this.setState({
                ...this.state,
                remoteHostList: _.values(JSON.parse(txt.toString())),
            }, () => {
                console.log(JSON.stringify(this.state.remoteHostList));
            });
        });
    }

    // 加载项目
    public loadProjectList() {
        axios.get("http://localhost:8080/v1/qt_projects/?limit=1000")
            .then((response) => {
                if (response.data["Code"] === 200 ) {
                    console.log("来获取项目了");
                    this.setState({
                        ...this.state,
                        projectList: response.data["Data"],
                    }, () => {
                        console.log(JSON.stringify(this.state.projectList));
                    });
                    clearInterval(this.timer);
                }
            }).catch((error) => {
            // handle error
            console.log(error);
        }).then(() => {
            // always executed
        });
    }

    public render() {
        return (
            <div className="app-homepage">
                {
                    global && global.process && global.process.platform === PlatformType.Linux &&
                    <div className="app-homepage-remoteHost bg-lighter-1">
                        <CondensedList
                            title={strings.homePage.remoteHost.title}
                            Component={RemoteHostItem}
                            items={this.state.remoteHostList}
                            // onClick={(item) => toast.info(`主机名: ${item.name} 主机IP: ${item.ip}`)}
                            onAddClick={() => this.ModalRemoteHostAdd.current.open()}
                            onDelete={(item) => this.deleteRemoteHostConfirm.current.open(item)}
                            showToolbar={true}
                            home={true}/>
                        <CondensedList
                            title={strings.homePage.projectList}
                            Component={ProjectItem}
                            items={this.state.projectList}
                            onAddClick={() => this.modalHomePageAddProject.current.open()}
                            onOpenDir={async (item) => {
                                // tslint:disable-next-line:max-line-length
                                const res = await IpcRendererProxy.send(`TrainingSystem:FileExist`, [item.AssetsPath]);
                                if (res) {
                                    // tslint:disable-next-line:max-line-length
                                    await IpcRendererProxy.send(`TrainingSystem:OpenProjectDir`, [item.AssetsPath + "/" + item.exportPath]);
                                } else {
                                    toast.error(`项目目录${item.AssetsPath}不存在，请手动删除该项目`);
                                }
                            }}
                            onDelete={(item) => this.deleteProjectListConfirm.current.open(item)}
                            showToolbar={true}
                            home={true}/>
                        <ModalRemoteHostAdd
                            ref={this.ModalRemoteHostAdd}
                            onSubmit={async (platform, name, ip) => {
                                const hostList: IRemoteHostItem = {
                                    name,
                                    ip,
                                    platform,
                                };
                                // tslint:disable-next-line:max-line-length
                                const res = await IpcRendererProxy.send(`TrainingSystem:RemoteHostEdit`, [hostList, false]);
                                if (res) {
                                    this.loadRemoteHostList();
                                    this.ModalRemoteHostAdd.current.close();
                                    toast.success("新增主机成功");
                                } else {
                                    toast.error("新增主机失败");
                                }
                            }}
                        />
                        <ModalHomePageAddProject
                            ref={this.modalHomePageAddProject}
                            onSubmit={async (projectName, imageSize) => {

                                // region 项目保存到本地路径库里
                                const projectItem: IProjectItem = {
                                    ProjectName: projectName,
                                    AssetsPath: "/qtingvisionfolder/Projects/" + projectName,
                                    exportPath: ExportPath.CollectData,
                                    ImageWidth: imageSize[0],
                                    ImageHeight: imageSize[1],
                                    CreateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                                };
                                axios.post("http://localhost:8080/v1/qt_projects/", {...projectItem})
                                    .then(async (response) => {
                                        if (response.data["Code"] === 200 ) {
                                            this.loadProjectList();
                                            // region 新建项目的其他文件
                                            // tslint:disable-next-line:max-line-length
                                            await this.props.actions.createFolder("/qtingvisionfolder/Projects",
                                                projectName);
                                            // 这里创建文件夹要合并，否则会出错, 加了await就正常了
                                            // tslint:disable-next-line:max-line-length
                                            await this.props.actions.createFolder(projectItem.AssetsPath, "CollectData");
                                            // tslint:disable-next-line:max-line-length
                                            await this.props.actions.createFolder(projectItem.AssetsPath, "MissData");
                                            // tslint:disable-next-line:max-line-length
                                            await this.props.actions.createFolder(projectItem.AssetsPath, "TestData");
                                            await this.props.actions.createFolder(projectItem.AssetsPath, "AtuoTrainData");
                                            await this.props.actions.createFolder(projectItem.AssetsPath, "model_release");
                                            await this.props.actions.createFolder(projectItem.AssetsPath, "training_data");
                                            this.modalHomePageAddProject.current.close();
                                            toast.success("项目新建成功");
                                            // endregion
                                        } else {
                                            // tslint:disable-next-line:max-line-length
                                            const msg = String(response.data["Msg"]).includes("Error 1062") ? "项目名已存在" : String(response.data["Msg"]);
                                            toast.error(msg);
                                        }
                                    }).catch((error) => {
                                    // handle error
                                    console.log(error);
                                }).then(() => {
                                    // always executed
                                });
                            }}
                        />
                    </div>
                }
                <div className="app-homepage-main">
                    <ul>
                        {/*<li>*/}
                        {/*    <a href="#" onClick={this.createNewProject} className="p-5 new-project">*/}
                        {/*        <i className="fas fa-plus-circle fa-9x"></i>*/}
                        {/*        <h6 style={{marginTop: "10px"}}>{strings.homePage.newProject}</h6>*/}
                        {/*    </a>*/}
                        {/*</li>*/}
                        {/*{isElectron() &&*/}
                        {/*<li>*/}
                        {/*    <a href="#" className="p-5 file-upload"*/}
                        {/*       onClick={() => this.filePicker.current.upload()}>*/}
                        {/*        <i className="fas fa-folder-open fa-9x"></i>*/}
                        {/*        <h6 style={{marginTop: "10px"}}>{strings.homePage.openLocalProject.title}</h6>*/}
                        {/*    </a>*/}
                        {/*    <FilePicker ref={this.filePicker}*/}
                        {/*                onChange={this.onProjectFileUpload}*/}
                        {/*                onError={this.onProjectFileUploadError}/>*/}
                        {/*</li>*/}
                        {/*}*/}
                        {/*{isElectron() &&*/}
                        {/*<li>*/}
                        {/*    <a href="#" className="p-5 file-upload"*/}
                        {/*       onClick={() => this.filePicker.current.upload()}>*/}
                        {/*        <i className="fas fa-file-import fa-9x"></i>*/}
                        {/*        <h6 style={{marginTop: "10px", marginLeft: "10px"}}>*/}
                        {/*            ！！！！！！！！！！！！</h6>*/}
                        {/*    </a>*/}
                        {/*    <FilePicker ref={this.filePicker}*/}
                        {/*                onChange={this.onProjectFileUpload}*/}
                        {/*                onError={this.onProjectFileUploadError}/>*/}
                        {/*</li>*/}
                        {/*}*/}

                        {
                            global && global.process && global.process.platform === PlatformType.Linux &&
                            <li>
                                <a href="#" className="app-homepage-main-a-group1 p-5 cloud-open-project"
                                   onClick={() => this.handleOpenCloudProjectClick(this.cloudFilePickerModal.current)}>
                                    <i className="fas fa-cloud fa-9x"></i>
                                    <h6 style={{marginTop: "10px"}}>{strings.homePage.openCloudProject.title}</h6>
                                </a>
                                <CloudFilePicker
                                    ref={this.cloudFilePickerModal}
                                    modalHeader={strings.homePage.openCloudProject.title}
                                    connections={this.props.connections}
                                    remoteHostList={this.state.remoteHostList}
                                    projectList={this.state.projectList}
                                    onSubmit={(success, content, belongToProject) => {
                                        if (success) {
                                            this.loadProject(content, belongToProject, ExportPath.CollectData);
                                        }
                                    }}
                                    fileExtension={constants.projectFileExtension}
                                />
                            </li>
                        }
                        {
                            isElectron() &&
                            <li>
                                <a href="#" className="app-homepage-main-a-group2 p-5 file-upload"
                                   onClick={this.onOpenDirectory}>
                                    <i className="fas fa-folder-open fa-9x"></i>
                                    <h6 style={{marginTop: "10px"}}>{strings.homePage.openLocalProject.title}</h6>
                                </a>
                            </li>
                        }
                        {/*<li>*/}
                        {/*    <a href="#"  className="app-homepage-main-a-group2 p-5 cloud-open-project"*/}
                        {/* tslint:disable-next-line:max-line-length */}
                        {/*       onClick={() => this.handleOpenCloudCopyProjectClick(this.copyRemoteAssetsModal.current)}>*/}
                        {/*        <i className="fas fa-copy fa-9x"></i>*/}
                        {/*        <h6 style={{marginTop: "10px"}}>{strings.homePage.copyRemoteAssets.title}</h6>*/}
                        {/*    </a>*/}
                        {/*    <CloudFileCopyPicker*/}
                        {/*        ref={this.copyRemoteAssetsModal}*/}
                        {/*        modalHeader={strings.homePage.copyRemoteAssets.title}*/}
                        {/*        connections={this.props.connections}*/}
                        {/*        remoteHostList={this.props.appSettings.remoteHostList}*/}
                        {/*        projectList={this.props.appSettings.projectList}*/}
                        {/*        onSubmit={(success, belongToProject, copyList) => {*/}
                        {/*            console.log(`结果: ${copyList}\n ${JSON.stringify(belongToProject)}`);*/}
                        {/*        }}*/}
                        {/*        fileExtension={constants.projectFileExtension}*/}
                        {/*        copy*/}
                        {/*    />*/}
                        {/*</li>*/}
                        {
                            global && global.process && global.process.platform === PlatformType.Linux &&
                            <li>
                                <a href="#" className="app-homepage-main-a-group1 p-5 cloud-open-project"
                                   onClick={() => this.inputCodeTagAssetsModal.current.open()}>
                                    <i className="fas fa-search fa-9x"></i>
                                    <h6 style={{marginTop: "10px"}}>{strings.homePage.inputCodeTagAssets.title}</h6>
                                </a>
                                <ModalSearchPcb
                                    ref={this.inputCodeTagAssetsModal}
                                    modalHeader={strings.homePage.inputCodeTagAssets.title}
                                    connections={this.props.connections}
                                    remoteHostList={this.state.remoteHostList}
                                    projectList={this.state.projectList}
                                    onSubmit={async (success, content, belongToProject) => {
                                        if (success) {
                                            await this.loadProject(content, belongToProject, ExportPath.MissData);
                                        }
                                    }}
                                    fileExtension={constants.projectFileExtension}
                                />
                            </li>
                        }
                    </ul>
                </div>
                {(this.props.recentProjects && this.props.recentProjects.length > 0) &&
                <div className="app-homepage-recent bg-lighter-1">
                    <CondensedList
                        title={strings.homePage.recentProjects}
                        Component={RecentProjectItem}
                        items={this.props.recentProjects}
                        onClick={async (project: IProject) => {
                            const pro = await this.props.actions.loadProject(project);
                            this.loadProject(pro.sourceConnection.providerOptionsOthers[0]["folderPath"],
                                pro.exportFormat.belongToProject,
                                ExportPath.CollectData);
                        }}
                        onDelete={(project) => this.deleteConfirm.current.open(project)} showToolbar={false}/>
                </div>
                }
                <Confirm title="谨慎操作！！！"
                         ref={this.deleteProjectListConfirm as any}
                         message={(item) =>
                             `如果正在标注该项目的远程素材，那么项目会被关闭！并且删除项目会删除该项目下的所有素材和已经训练好的模型文件！！！请谨慎操作！！！确定要删除项目[${item.ProjectName}]么?`}
                         confirmButtonColor="danger"
                         onConfirm={async (item) => {
                             axios.delete(`http://localhost:8080/v1/qt_projects/${item.Id}`).then(async (response) => {
                                 if (response.data["Code"] === 200 ) {
                                     await this.draggableDialogNormal.current.open();
                                     await IpcRendererProxy.send(`TrainingSystem:RootDeletePath`, [item.AssetsPath]);
                                     this.loadProjectList();
                                     this.deleteProjectListConfirm.current.close();
                                     toast.success("已成功删除");
                                     await this.draggableDialogNormal.current.close();
                                 }
                             }).catch((error) => {
                                 toast.error("删除失败");
                                 // handle error
                                 console.log(error);
                             }).then(() => {
                                 // always executed
                             });
                         }}/>
                <Confirm title="删除主机"
                         ref={this.deleteRemoteHostConfirm as any}
                         message={(item) =>
                             `确定要删除主机[${item.name}]么?`}
                         confirmButtonColor="danger"
                         onConfirm={async (item) => {
                             // tslint:disable-next-line:max-line-length
                             const res = await IpcRendererProxy.send(`TrainingSystem:RemoteHostEdit`, [item, true]);
                             if (res) {
                                 this.loadRemoteHostList();
                                 this.ModalRemoteHostAdd.current.close();
                                 toast.success("已成功删除");
                             } else {
                                 toast.error("删除主机失败");
                             }
                         }}/>
                <Confirm title="Delete Project"
                         ref={this.deleteConfirm as any}
                         message={(project: IProject) =>
                             `${strings.homePage.deleteProject.confirmation} ${project.name}?`}
                         confirmButtonColor="danger"
                         onConfirm={this.deleteProject}/>
                <Confirm title="Import Project"
                         ref={this.importConfirm as any}
                         message={(project: IFileInfo) =>
                             interpolate(strings.homePage.importProject.confirmation, {project})}
                         confirmButtonColor="danger"
                         onConfirm={this.convertProject}/>
                <DraggableDialog
                    title={"正在加载..."}
                    ref={this.draggableDialog}
                    content={"处理中"}
                    interval={200}
                    showProgress={true}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    onDone={() => {
                        this.draggableDialog.current.close();
                    }}
                    onCancel={() => this.draggableDialog.current.close()}
                />
                <DraggableDialog
                    title={"正在加载..."}
                    ref={this.draggableDialogNormal}
                    content={"正在加载请等待..."}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    onDone={() => {
                        this.draggableDialog.current.close();
                    }}
                    onCancel={() => this.draggableDialog.current.close()}
                />
            </div>
        );
    }

    private afterDeadLine = () => {
        if (this.props.appSettings.zengyining) {
            return false;
        }

        if (moment(moment().format("YYYY-MM-DD")).isAfter(this.props.appSettings.deadline)) {
            toast.warn("程序到期了，为了不影响您的正常使用，请联系轻蜓视觉", { autoClose: false });
            return true;
        } else {
            return false;
        }
    }

    private createNewProject = (e: SyntheticEvent) => {
        if (this.afterDeadLine()) {return; }
        this.props.actions.closeProject();
        this.props.history.push("/projects/create");

        e.preventDefault();
    }

    private handleOpenCloudProjectClick = (modal: CloudFilePicker) => {
        const platform = global && global.process ? global.process.platform : "web";
        if (platform !== PlatformType.Linux) {
            toast.error("远程标注暂时不支持非linux系统");
            return;
        }
        modal.open();
    }

    private handleOpenCloudCopyProjectClick = (modal: CloudFileCopyPicker) => {
        const platform = global && global.process ? global.process.platform : "web";
        if (platform !== PlatformType.Linux) {
            toast.error("远程标注暂时不支持非linux系统");
            return;
        }
        modal.open();
    }
    private checkServer = async () => {
        let res = await IpcRendererProxy.send(`TrainingSystem:CheckServer`, [1122]);
        if (res) {
            IpcRendererProxy.send(`TrainingSystem:StartServer`, ["StartComponent.sh"]);
            toast.warn("已执行开启插件");
        } else {
            // toast.success("辅助插件已开启");
        }
        res = await IpcRendererProxy.send(`TrainingSystem:CheckServer`, [8080]);
        if (res) {
            IpcRendererProxy.send(`TrainingSystem:StartServer`, ["StartServer.sh"]);
            this.timer = setInterval(async () => this.loadProjectList(), 1500); // 这里的这个检查更新由于需要显示那个啥提醒控件，会造成页面刷新
            toast.warn("已开启训练中心服务");
        } else {
            // toast.success("训练中心服务正常");
        }
    }
    private loadProject = async (fileFolder: string, belongToProject?: IProjectItem, exportPath?: string) => {
        const platform = global && global.process ? global.process.platform : "web";
        if (platform === PlatformType.Linux) {
            await this.draggableDialog.current.open(fileFolder);
            // 先判断文件夹是否存在
            const res = await IpcRendererProxy.send(`TrainingSystem:FileExist`, [fileFolder]);
            if (!res) {
                this.draggableDialog.current.change("出错了", "文件夹不存在", true);
                return;
            }
            const idd = normalizeSlashes(fileFolder).lastIndexOf("/");
            // const randId = shortid.generate();
            const folderName = normalizeSlashes(fileFolder).substring(idd + 1);
            const connection: IConnection = {
                id: folderName,
                name: folderName,
                providerType: "localFileSystemProxy",
                providerOptions: {
                    folderPath: normalizeSlashes(fileFolder),
                },
                providerOptionsOthers: [{
                    folderPath: normalizeSlashes(fileFolder),
                }],
            };
            let projectJson: IProject = {
                id: folderName,
                name: folderName,
                version: "3.0.0",
                activeLearningSettings: DefaultActiveLearningSettings,
                autoSave: true,
                exportFormat: {
                    ...DefaultExportOptions,
                    // belongToProject,
                    // exportPath,
                },
                securityToken: folderName,
                sourceConnection: connection,
                sourceListConnection: [],
                tags: [],
                targetConnection: connection,
                trainFormat: DefaultTrainOptions,
                videoSettings: {frameExtractionRate: 15},
                assets: {},
            };
            const yiningzengAssets = fileFolder + "/.yiningzeng.assets";
            await axios.post("http://localhost:1122/v1/monkeySun/", {
                Path: fileFolder,
                Sort: false,
                ThreadNum: 100,
            }).then(async (response) => {
                if (response.data["Code"] === 200 ) {
                    toast.success("处理完成");
                    // endregion
                } else {
                    // tslint:disable-next-line:max-line-length
                    toast.error("打开文件夹失败");
                }
            }).catch((error) => {
                // handle error
                console.log(error);
            }).then(() => {
                // always executed
            });
            const llll = await IpcRendererProxy.send(`TrainingSystem:FileExist`, [yiningzengAssets]);
            if (llll) {
                const yiNingZengAssets = await this.props.actions.getAssetsByYiNingZengAssets(projectJson);
                const yiNingZengTags = await this.props.actions.getAssetsByYiNingZengColorTags(projectJson);
                console.log(yiningzengAssets);
                console.log(yiNingZengTags);
                projectJson = {
                    ...projectJson,
                    assets: yiNingZengAssets,
                    tags: yiNingZengTags,
                };
                await this.props.actions.saveProject(projectJson);
                connectionActions.saveConnection(connection);
                this.draggableDialog.current.close();
                await this.loadSelectedProject(projectJson);
            }
        } else {
            await this.draggableDialogNormal.current.open();
            const idd = normalizeSlashes(fileFolder).lastIndexOf("/");
            // const randId = shortid.generate();
            const folderName = normalizeSlashes(fileFolder).substring(idd + 1);
            const connection: IConnection = {
                id: folderName,
                name: folderName,
                providerType: "localFileSystemProxy",
                providerOptions: {
                    folderPath: normalizeSlashes(fileFolder),
                },
                providerOptionsOthers: [{
                    folderPath: normalizeSlashes(fileFolder),
                }],
            };
            let projectJson: IProject = {
                id: folderName,
                name: folderName,
                version: "3.0.0",
                activeLearningSettings: DefaultActiveLearningSettings,
                autoSave: true,
                exportFormat: DefaultExportOptions,
                securityToken: folderName,
                sourceConnection: connection,
                sourceListConnection: [],
                tags: [],
                targetConnection: connection,
                trainFormat: DefaultTrainOptions,
                videoSettings: { frameExtractionRate: 15 },
                assets: {},
            };
            const dataTemp = await this.props.actions.loadAssetsWithFolderAndTags(projectJson, fileFolder);
            const rootProjectAssets = _.values(projectJson.assets)
                .filter((asset) => !asset.parent);
            const rootAssets = _(rootProjectAssets)
                .concat(dataTemp.assets)
                .uniqBy((asset) => asset.id)
                .value();
            projectJson = {
                ...projectJson,
                assets: _.keyBy(rootAssets, (asset) => asset.id),
                tags: dataTemp.tags,
            };
            connectionActions.saveConnection(connection);
            this.draggableDialogNormal.current.close();
            await this.loadSelectedProject(projectJson);
        }
    }

    private  onOpenDirectory = async () => {
        // this.filePicker.current.upload()
        const fileFolder = await this.localFileSystem.importTaggedContainer("/qtingvisionfolder/Projects/");
        // alert(JSON.stringify(this.props.project));
        if (!fileFolder) { return; }
        this.loadProject(fileFolder[0]);
    }

    private onProjectFileUpload = async (e, project) => {
        if (this.afterDeadLine()) {return; }
        let projectJson: IProject;
        try {
            projectJson = JSON.parse(project.content);
            alert(JSON.stringify(project));
        } catch (error) {
            throw new AppError(ErrorCode.ProjectInvalidJson, "Error parsing JSON");
        }
        // need a better check to tell if its v1
        if (projectJson.name === null || projectJson.name === undefined) {
            try {
                await this.importConfirm.current.open(project);
            } catch (e) {
                throw new Error(e.message);
            }
        } else {
            // if (projectJson.name.includes("-Transfer")) {
            //
            // }
            // 新增connect
            const connection: IConnection = projectJson.targetConnection;
            const provider: ILocalFileSystemProxyOptions = {
                folderPath: JSON.parse(JSON.stringify(connection.providerOptions))["folderPath"],
            };
            const newSource: IConnection = {
                id: connection.id,
                name: connection.id,
                providerType: "localFileSystemProxy",
                providerOptions: provider,
            };
            // projectJson = {
            //     ...projectJson,
            //     version: "yining",
            // };
            connectionActions.saveConnection(newSource);
            await this.loadSelectedProject(projectJson);
        }
    }

    private onProjectFileUploadError = (e, error: any) => {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(ErrorCode.ProjectUploadError, "Error uploading project file");
    }

    private loadSelectedProject = async (project: IProject) => {
        if (this.afterDeadLine()) {return; }
        await this.props.actions.loadProject(project);
        this.props.history.push(`/projects/${project.id}/edit`);
    }

    private deleteProject = async (project: IProject) => {
        if (this.afterDeadLine()) {return; }
        try {
            await this.props.actions.deleteProject(project);
            toast.info(interpolate(strings.homePage.messages.deleteSuccess, { project }));
        } catch (error) {
            throw new AppError(ErrorCode.ProjectDeleteError, "Error deleting project file");
        }
    }
    private convertProject = async (projectInfo: IFileInfo) => {
        if (this.afterDeadLine()) {return; }
        const importService = new ImportService();
        let generatedAssetMetadata: IAssetMetadata[];
        let project: IProject;

        try {
            project = await importService.convertProject(projectInfo);
        } catch (e) {
            throw new AppError(ErrorCode.V1ImportError, "Error converting v1 project file");
        }

        this.props.applicationActions.ensureSecurityToken(project);

        try {
            generatedAssetMetadata = await importService.generateAssets(projectInfo, project);
            await this.props.actions.saveProject(project);
            await this.props.actions.loadProject(project);
            await generatedAssetMetadata.mapAsync((assetMetadata) => {
                return this.props.actions.saveAssetMetadata(this.props.project, assetMetadata);
            });
        } catch (e) {
            throw new Error(`Error importing project information - ${e.message}`);
        }

        await this.props.actions.saveProject(this.props.project);
        await this.loadSelectedProject(this.props.project);
    }
}
