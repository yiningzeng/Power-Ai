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
    onSubmit: (success: boolean, content: string, belongToProject: IProjectItem) => void;
    remoteHostList?: IRemoteHostItem[];
    projectList: IProjectItem[];
    onCancel?: () => void;
    fileExtension?: string;
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
}

/**
 * @name - Cloud File Picker
 * @description - Modal to choose and read file from cloud connections
 */
export class ModalSearchPcb extends React.Component<ICloudFilePickerProps, ICloudFilePickerState> {

    private draggableDialog: React.RefObject<DraggableDialog> = React.createRef();
    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

        this.getInitialState = this.getInitialState.bind(this);
        this.ok = this.ok.bind(this);
        this.back = this.back.bind(this);

        this.state = this.getInitialState();
    }

    /**
     * 等待指定的时间
     * @param ms
     */
    public async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("");
            }, ms);
        });
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
                        <Label for="selectProject">所属项目</Label>
                        <Input type="select" name="selectProject" id="selectProject" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                belongToProject: JSON.parse(v.target.value),
                            });
                        }}>
                            {projectList && projectList.length > 0 && projectList.map((item) =>
                                <option value={JSON.stringify(item)}>{item.ProjectName}</option>)}
                        </Input>
                        <Label for="pcbCode">PCB编号</Label>
                        <Input id="pcbCode" placeholder="请输入需要查询的PCB编号" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                username: v.target.value,
                            });
                        }}/>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn btn-success mr-1"
                        onClick={this.ok}>
                        查询
                    </Button>
                    <Button
                        onClick={this.close}>
                        取消
                    </Button>
                </ModalFooter>
                <DraggableDialog
                    title={"正在查询所有远程主机的数据..."}
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
            cloudPath: "NG",
            username: "Everyone",
            password: "",
            belongToProject: this.props.projectList !== undefined && this.props.projectList.length > 0 ?
                this.props.projectList[0] : undefined,
        };
    }

    private async ok() {
        this.draggableDialog.current.open();
        await this.sleep(7000);
        this.draggableDialog.current.change("未查询到相关的数据...",
            // tslint:disable-next-line:max-line-length
            `未找到PCB编号相关的数据，请确认板号是否有误`, true);
        this.props.onSubmit(false, "查询失败", this.state.belongToProject);
    }

    private back() {
        this.setState({
            ...this.getInitialState(),
            isOpen: true,
        });
    }
}
