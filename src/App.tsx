import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Router } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import Sidebar from "./react/components/shell/sidebar";
import MainContentRouter from "./react/components/shell/mainContentRouter";
import {
    IAppError,
    IApplicationState,
    IProject,
    ErrorCode,
    IRemoteHostItem,
    IProjectItem
} from "./models/applicationState";
import "./App.scss";
import "react-toastify/dist/ReactToastify.css";
import IAppErrorActions, * as appErrorActions from "./redux/actions/appErrorActions";
import { bindActionCreators } from "redux";
import { ErrorHandler } from "./react/components/common/errorHandler/errorHandler";
import { KeyboardManager } from "./react/components/common/keyboardManager/keyboardManager";
import { TitleBar } from "./react/components/shell/titleBar";
import { StatusBar } from "./react/components/shell/statusBar";
import { StatusBarMetrics } from "./react/components/shell/statusBarMetrics";
import { HelpMenu } from "./react/components/shell/helpMenu";
import history from "./history";
import axios from "axios";
import {IHomePageState} from "./react/components/pages/homepage/homePage";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";
import {IpcRendererProxy} from "./common/ipcRendererProxy";
import Confirm from "./react/components/common/confirm/confirm";
import {strings} from "./common/strings";
import DraggableDialog from "./react/components/common/draggableDialog/draggableDialog";

interface IAppProps {
    currentProject?: IProject;
    appError?: IAppError;
    actions?: IAppErrorActions;
}

interface IAppState {
    showUpdate: boolean;
}

function mapStateToProps(state: IApplicationState) {
    return {
        currentProject: state.currentProject,
        appError: state.appError,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(appErrorActions, dispatch),
    };
}

/**
 * @name - App
 * @description - Root level component for VoTT Application
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component<IAppProps, IAppState> {
    public state: IAppState = {
        showUpdate: false,
    };
    private timer;
    private updateDoneTimer;
    private updateConfirm: React.RefObject<Confirm> = React.createRef();
    private draggableDialog: React.RefObject<DraggableDialog> = React.createRef();
    constructor(props, context) {
        super(props, context);
        this.checkUpdate();
        this.timer = setInterval(async () => this.checkUpdate(), 1800000); // 这里的这个检查更新由于需要显示那个啥提醒控件，会造成页面刷新
    }

    public componentDidCatch(error: Error) {
        this.props.actions.showError({
            errorCode: ErrorCode.GenericRenderError,
            title: error.name,
            message: error.message,
        });
    }

    public render() {
        const platform = global && global.process ? global.process.platform : "web";
        return (
            <Fragment>
                <DraggableDialog
                    title={"正在更新..."}
                    ref={this.draggableDialog}
                    content={"后台正在更新中，更新过程中软件可能会重启，请耐心等待..."}
                    showProgress={false}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    onDone={() => {
                        this.draggableDialog.current.close();
                    }}
                    onCancel={() => this.draggableDialog.current.close()}
                />
                <Confirm title={"确定要更新么"}
                         ref={this.updateConfirm as any}
                         message={"更新过程中可能软件会重启"}
                         confirmButtonColor="success"
                         onConfirm={() => {
                             this.draggableDialog.current.open();
                             axios.put("http://localhost:8080/v1/tools/update")
                                 .then((response) => {
                                     if (response.data["Code"] === 200 ) {
                                         this.updateDoneTimer = setInterval(async () => this.updateDone(), 5000);
                                         // tslint:disable-next-line:max-line-length
                                         this.draggableDialog.current.change("正在更新...", "后台正在更新中，更新过程中软件可能会重启，请耐心等待...", false, true);
                                     } else {
                                         // tslint:disable-next-line:max-line-length
                                         this.draggableDialog.current.change("更新失败", response.data["Msg"], true, false);
                                     }
                                     this.setState({
                                         showUpdate: false,
                                     });
                                 }).catch((error) => {
                                 // handle error
                                 console.log(error);
                             }).then(() => {
                                 // always executed
                             });
                         }}/>
                <Snackbar
                    key={"更新"}
                    style={{marginBottom: 10}}
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    open={this.state.showUpdate}
                    onClose={this.closeUpdate}
                    message="发现新版本，是否更新"
                    action={
                        <React.Fragment>
                            <Button color="secondary" size="small" onClick={() => this.updateConfirm.current.open()}>
                                更新
                            </Button>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.closeUpdate}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
                <ErrorHandler
                    error={this.props.appError}
                    onError={this.props.actions.showError}
                    onClearError={this.props.actions.clearError} />
                {/* Don't render app contents during a render error */}
                {(!this.props.appError || this.props.appError.errorCode !== ErrorCode.GenericRenderError) &&
                    <KeyboardManager>
                        <Router history={history}>
                            <div className={`app-shell platform-${platform}`}>
                                <TitleBar icon="fas fa-tags"
                                          title={this.props.currentProject ? this.props.currentProject.name : ""}
                                          projectId={this.props.currentProject ? this.props.currentProject.id : ""}>
                                    <div className="app-help-menu-icon"><HelpMenu/></div>
                                </TitleBar>
                                <div className="app-main">
                                    {/*<Sidebar project={this.props.currentProject} />*/}
                                    <MainContentRouter />
                                </div>
                                <StatusBar>
                                    <StatusBarMetrics project={this.props.currentProject} />
                                </StatusBar>
                                <ToastContainer className="vott-toast-container" />
                            </div>
                        </Router >
                    </KeyboardManager>
                }
            </Fragment>
        );
    }

    private closeUpdate = (event: React.SyntheticEvent | MouseEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        this.setState({
            showUpdate: false,
        });
    }

    private checkUpdate = () => {
        axios.get("http://localhost:8080/v1/tools/update")
            .then((response) => {
                let showUpdate = false;
                if (response.data["Code"] === 200 ) {
                    showUpdate = true;
                }
                this.setState({
                    showUpdate,
                });
            }).catch((error) => {
            // handle error
            console.log(error);
        }).then(() => {
            // always executed
        });
    }

    private updateDone = () => {
        axios.get("http://localhost:8080/v1/tools/update")
            .then((response) => {
                if (response.data["Code"] !== 200 ) {
                    // 不存在更新
                    this.draggableDialog.current.change("更新完成", "已经完成了所有的更新", true, false);
                    clearInterval(this.updateDoneTimer);
                }
            }).catch((error) => {
            // handle error
            console.log(error);
        }).then(() => {
            // always executed
        });
    }
}
