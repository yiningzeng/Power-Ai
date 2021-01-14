import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader,
    Input, Label, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import { strings } from "../../../../common/strings";
import {ExportPath, IConnection, IProjectItem, IRemoteHostItem, StorageType} from "../../../../models/applicationState";
import { StorageProviderFactory } from "../../../../providers/storage/storageProviderFactory";
import CondensedList, { ListItem } from "../condensedList/condensedList";
import {normalizeSlashes} from "../../../../common/utils";
import {toast} from "react-toastify";
import DraggableDialog from "../draggableDialog/draggableDialog";
import pTimeout from "p-timeout";
import delay from "delay";
import {IpcRendererProxy} from "../../../../common/ipcRendererProxy";
import {LocalFileSystemProxy} from "../../../../providers/storage/localFileSystemProxy";
import {SelectionMode} from "powerai-ct/lib/js/CanvasTools/Interface/ISelectorSettings";
import {ICanvasProps, ICanvasState} from "../../pages/editorPage/canvas";
import {constants} from "../../../../common/constants";
import _ from "lodash";
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
    onSubmit: (belongToProject: IProjectItem) => void;
    onCancel?: () => void;
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
    belongToProject: IProjectItem;
    projectList: IProjectItem[]; // 首页项目列表
}

/**
 * @name - Cloud File Picker
 * @description - Modal to choose and read file from cloud connections
 */
export class ModelBelongPorject extends React.Component<ICloudFilePickerProps, ICloudFilePickerState> {
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
                            {/* tslint:disable-next-line:max-line-length */}
                            {this.state.projectList && this.state.projectList.length > 0 && this.state.projectList.map((item) =>
                                <option value={JSON.stringify(item)}>{item.name}</option>)}
                        </Input>
                        <Label for="dataType">素材类型</Label>
                        {/* tslint:disable-next-line:max-line-length */}
                        <Input type="select" name="selectProjectExportPath" id="selectProjectExportPath" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                belongToProject: {
                                    ...this.state.belongToProject,
                                    exportPath: v.target.value,
                                },
                            });
                        }}>
                            <option value={ExportPath.CollectData}>训练集</option>
                            <option value={ExportPath.TestData}>测试集</option>
                        </Input>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn btn-success mr-1"
                        onClick={this.ok}>
                        确定
                    </Button>
                    <Button
                        onClick={this.close}>
                        取消
                    </Button>
                </ModalFooter>
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
        IpcRendererProxy.send(`TrainingSystem:JsonRead`, [constants.projectFileName]).then((txt) => {
            const projects = _.values(JSON.parse(txt.toString()));
            this.setState({
                ...this.state,
                projectList: projects,
                belongToProject: projects !== undefined && projects.length > 0 ?
                    projects[0] : undefined,
            });
        });
        return {
            ...this.state,
            isOpen: false,
            modalHeader: this.props.modalHeader,
        };
    }

    private async ok() {
        this.props.onSubmit(this.state.belongToProject);
    }

    private back() {
        this.setState({
            ...this.getInitialState(),
            isOpen: true,
        });
    }
}
