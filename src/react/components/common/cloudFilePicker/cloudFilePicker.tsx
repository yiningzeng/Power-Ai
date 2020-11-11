import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader,
    Input, Label, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import { strings } from "../../../../common/strings";
import {IConnection, IProjectItem, IRemoteHostItem, StorageType} from "../../../../models/applicationState";
import { StorageProviderFactory } from "../../../../providers/storage/storageProviderFactory";
import CondensedList, { ListItem } from "../condensedList/condensedList";
import {normalizeSlashes} from "../../../../common/utils";
import {toast} from "react-toastify";
import DraggableDialog from "../draggableDialog/draggableDialog";
import pTimeout from "p-timeout";
import delay from "delay";
import {IpcRendererProxy} from "../../../../common/ipcRendererProxy";
import {LocalFileSystemProxy} from "../../../../providers/storage/localFileSystemProxy";
// const delay = require('delay');
// const pTimeout = require('p-timeout');
/**
 * Properties for Cloud File Picker
 * @member connections - Array of connections to choose from
 * @member onSubmit - Function to call with contents of selected file
 * @member onCancel - Optional function to call on modal closed
 * @member fileExtension - Filter on files with extension
 */
export interface ICloudFilePickerProps {
    modalHeader: string;
    connections: IConnection[];
    onSubmit: (success: boolean, content: string, belongToProject: IProjectItem, copyList?: string[]) => void;
    remoteHostList?: IRemoteHostItem[];
    projectList?: IProjectItem[];
    onCancel?: () => void;
    fileExtension?: string;
    copy?: boolean;
}

/**
 * State for Cloud File Picker
 * @member isOpen - Cloud File Picker is open
 * @member modalHeader - Header for Picker modal
 * @member condensedList - List of rendered objects for picking
 * @member selectedConnection - Connection selected in picker
 * @member selectedFile - File selected in picker
 * @member okDisabled - Ok button is disabled
 * @member backDisabled - Back button is disabled
 */
export interface ICloudFilePickerState {
    isOpen: boolean;
    modalHeader: string;
    platform: string;
    ip: string;
    cloudPath: string;
    username: string;
    password: string;
    belongToProject: IProjectItem;

    copyList?: string[];
}

/**
 * @name - Cloud File Picker
 * @description - Modal to choose and read file from cloud connections
 */
export class CloudFilePicker extends React.Component<ICloudFilePickerProps, ICloudFilePickerState> {
    private localFileSystem: LocalFileSystemProxy;
    private draggableDialog: React.RefObject<DraggableDialog> = React.createRef();
    constructor(props) {
        super(props);
        this.localFileSystem = new LocalFileSystemProxy();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

        this.getInitialState = this.getInitialState.bind(this);
        this.ok = this.ok.bind(this);
        this.back = this.back.bind(this);

        this.state = this.getInitialState();
    }

    public render() {
        const { remoteHostList, projectList } = this.props;
        const closeBtn = <button className="close" onClick={this.close}>&times;</button>;

        return(
            <Modal isOpen={this.state.isOpen} centered={true}>
                <ModalHeader toggle={this.close} close={closeBtn}>
                    {this.state.modalHeader}
                </ModalHeader>
                <ModalBody>
                    <div>
                        <Label for="exampleSelect">目标主机</Label>
                        <Input type="select" name="select" id="exampleSelect" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                ip: v.target.value,
                            });
                        }}>
                            {remoteHostList && remoteHostList.length > 0 && remoteHostList.map((item) =>
                                <option value={item.ip}>{`${item.name}(${item.platform}) - ${item.ip}`}</option>)}
                        </Input>
                        <Label for="path">主机共享的文件夹路径</Label>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>//</InputGroupText>
                            </InputGroupAddon>
                            <Input name="ip" id="ip" value={this.state.ip} readOnly/>
                            <InputGroupAddon addonType="append">
                                <InputGroupText>/</InputGroupText>
                            </InputGroupAddon>
                            <Input name="path" id="path" value={this.state.cloudPath} placeholder="共享的目录"
                                   onClick={() => {
                                console.log(`fucker: open ${JSON.stringify(this.state)}`);
                                this.draggableDialog.current.open();
                                if (this.state.ip === "" || this.state.ip === null) {
                                    this.draggableDialog.current.change("连接远程数据失败...",
                                        `远程地址: \\\\${this.state.ip}\\${this.state.cloudPath}`, true);
                                    return;
                                }
                                this.draggableDialog.current.change("正在连接远程数据...",
                                    `远程地址: \\\\${this.state.ip}\\${this.state.cloudPath}`, false, false);
                                const aa = new Promise(async (resolve, reject) => {
                                    await IpcRendererProxy.send(`TrainingSystem:CloseRemoteAssets`,
                                        [this.state.ip, this.state.cloudPath])
                                        .then(() => {
                                            console.log("关闭成功");
                                        })
                                        .catch(() => {
                                            console.log("关闭失败");
                                        });
                                    await IpcRendererProxy.send(`TrainingSystem:LoadRemoteAssets`,
                                        [this.state.ip,
                                            this.state.cloudPath,
                                            this.state.username,
                                            this.state.password])
                                        .then(async (v) => {
                                            toast.success("已经成功连接了远程数据");
                                            resolve("success"); // 成功
                                        })
                                        .catch(() => {
                                            this.draggableDialog.current.change("连接远程数据失败...",
                                                // tslint:disable-next-line:max-line-length
                                                `远程地址: \\\\${this.state.ip}\\${this.state.cloudPath.replace(new RegExp("/", "g"), "\\")}`, true);
                                            // this.props.onSubmit("连接失败");
                                            reject("fail");        // 失败
                                        });
                                }).catch(() => {
                                    this.draggableDialog.current.change("连接远程数据失败...",
                                        // tslint:disable-next-line:max-line-length
                                        `远程地址: \\\\${this.state.ip}\\${this.state.cloudPath.replace(new RegExp("/", "g"), "\\")}`, true);
                                });
                                pTimeout(aa, 10000, () => {
                                    this.draggableDialog.current.change("连接远程数据超时！",
                                        `连接超时，请检查配置信息是否正确\n远程地址: \\\\${this.state.ip}\\${this.state.cloudPath.replace(new RegExp("/", "g"), "\\")}`, true);
                                }).then(async (val) => {
                                    if (val === "success") {
                                        this.draggableDialog.current.close();
                                        // // tslint:disable-next-line:max-line-length
                                        const defaultPath = `/assets/Remote_Assets/${this.state.ip}-${this.state.cloudPath.replace(new RegExp("/", "g"), "-")}`;
                                        // tslint:disable-next-line:max-line-length
                                        const fileFolder = await this.localFileSystem.openRemoteContainer(defaultPath);
                                        // alert(JSON.stringify(this.props.project));
                                        if (!fileFolder) { return; }
                                        this.setState({
                                            ...this.state,
                                            cloudPath: (fileFolder[0] + "").replace(`/assets/Remote_Assets/${this.state.ip}-${this.state.cloudPath}`, `${this.state.cloudPath}`),
                                        });
                                        // this.close();
                                        // tslint:disable-next-line:max-line-length
                                    }
                                    // 执行结束了,这里做善后工作
                                    // toast.success("执行结束了" + val);
                                });
                            }} onChange={(v) => {
                                this.setState({
                                    ...this.state,
                                    cloudPath: v.target.value,
                                });
                            }}/>
                        </InputGroup>
                        {/*<Input name="path" id="path" onChange={(v) => toast.info(v.target.value)}/>*/}
                        <Label for="username">登录用户名</Label>
                        <Input id="username" defaultValue="Everyone" placeholder="默认是Everyone" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                username: v.target.value,
                            });
                        }}/>
                        <Label for="password">登录密码</Label>
                        <Input name="password" id="password" placeholder="默认密码是空" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                password: v.target.value,
                            });
                        }}/>
                        <Label for="selectProject">所属项目</Label>
                        <Input type="select" name="selectProject" id="selectProject" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                belongToProject: JSON.parse(v.target.value),
                            });
                        }}>
                            {projectList && projectList.length > 0 && projectList.map((item) =>
                                <option value={JSON.stringify(item)}>{item.name}</option>)}
                        </Input>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn btn-success mr-1"
                        onClick={this.ok}>
                        {this.props.copy ? "开始复制" : "连接数据"}
                    </Button>
                    <Button
                        onClick={this.close}>
                        取消
                    </Button>
                </ModalFooter>
                <DraggableDialog
                    title={"正在连接远程数据..."}
                    ref={this.draggableDialog}
                    content={"请耐心等待"}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    onDone={() => {
                        this.draggableDialog.current.close();
                    }}
                    onCancel={() => this.draggableDialog.current.close()}
                />
            </Modal>
        );
    }

    /**
     * Open Cloud File Picker
     */
    public open(): void {
        this.setState({isOpen: true});
    }

    /**
     * Close Cloud File Picker
     */
    public close(): void {
        this.setState(this.getInitialState(),
            () => {
                if (this.props.onCancel) {
                    this.props.onCancel();
                }
            },
        );
    }

    private getInitialState(): ICloudFilePickerState {
        return {
            isOpen: false,
            modalHeader: this.props.modalHeader,
            platform: "Windows",
            ip: this.props.remoteHostList !== undefined && this.props.remoteHostList.length > 0 ?
                this.props.remoteHostList[0].ip : "",
            cloudPath: "Power-Ftp",
            username: "Everyone",
            password: "",
            belongToProject: this.props.projectList !== undefined && this.props.projectList.length > 0 ?
                this.props.projectList[0] : undefined,
        };
    }

    private async ok() {
        this.draggableDialog.current.open();
        // this.props.onSubmit(true, "测试返回", this.state.belongToProject, this.state.copyList);
        if (this.state.ip === "" || this.state.ip === null) {
            this.draggableDialog.current.change("连接远程数据失败...",
                `远程地址: \\\\${this.state.ip}\\${this.state.cloudPath}`, true);
            return;
        }
        this.draggableDialog.current.change("正在连接远程数据...",
            `远程地址: \\\\${this.state.ip}\\${this.state.cloudPath}`, false, false);
        const aa = new Promise(async (resolve, reject) => {
            await IpcRendererProxy.send(`TrainingSystem:CloseRemoteAssets`, [this.state.ip, this.state.cloudPath])
                .then(() => {
                    console.log("关闭成功");
                })
                .catch(() => {
                    console.log("关闭失败");
                });
            await IpcRendererProxy.send(`TrainingSystem:LoadRemoteAssets`,
                [this.state.ip, this.state.cloudPath, this.state.username, this.state.password])
                .then((v) => {
                    toast.success("已经成功连接了远程数据");
                    this.props.onSubmit(true, v.toString(), this.state.belongToProject, this.state.copyList);
                    resolve("success"); // 成功
                    this.draggableDialog.current.close();
                    this.close();
                })
                .catch(() => {
                    this.draggableDialog.current.change("连接远程数据失败...",
                        // tslint:disable-next-line:max-line-length
                        `远程地址: \\\\${this.state.ip}\\${this.state.cloudPath.replace(new RegExp("/", "g"), "\\")}`, true);
                    // this.props.onSubmit("连接失败");
                    this.props.onSubmit(false, "连接失败", this.state.belongToProject);
                    reject("fail");        // 失败
                });
        }).catch(() => {
            this.draggableDialog.current.change("连接远程数据失败...",
                // tslint:disable-next-line:max-line-length
                `远程地址: \\\\${this.state.ip}\\${this.state.cloudPath.replace(new RegExp("/", "g"), "\\")}`, true);
            this.props.onSubmit(false, "连接失败", this.state.belongToProject);
        });
        pTimeout(aa, 10000, () => {
            this.draggableDialog.current.change("连接远程数据超时！",
                `连接超时，请检查配置信息是否正确\n远程地址: \\\\${this.state.ip}\\${this.state.cloudPath.replace(new RegExp("/", "g"), "\\")}`, true);
        }).then(() => {
            // 执行结束了,这里做善后工作
            // toast.success("执行结束了");
        });
    }

    private back() {
        this.setState({
            ...this.getInitialState(),
            isOpen: true,
        });
    }
}
