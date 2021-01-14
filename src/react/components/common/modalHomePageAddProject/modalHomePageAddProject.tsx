import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader,
    Input, Label, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import { IConnection, StorageType } from "../../../../models/applicationState";
import DraggableDialog from "../draggableDialog/draggableDialog";
import {toast} from "react-toastify";
/**
 * Properties for Cloud File Picker
 * @member connections - Array of connections to choose from
 * @member onSubmit - Function to call with contents of selected file
 * @member onCancel - Optional function to call on modal closed
 * @member fileExtension - Filter on files with extension
 */
export interface ICloudFilePickerProps {
    onSubmit: (projectName: string, imageSize: [number, number]) => void;
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
    projectName: string;
    imageSize: [number, number];
}

/**
 * @name - Cloud File Picker
 * @description - Modal to choose and read file from cloud connections
 */
export class ModalHomePageAddProject extends React.Component<ICloudFilePickerProps, ICloudFilePickerState> {

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

    public render() {
        const closeBtn = <button className="close" onClick={this.close}>&times;</button>;

        return(
            <Modal isOpen={this.state.isOpen} centered={true}>
                <ModalHeader toggle={this.close} close={closeBtn}>
                    {this.state.modalHeader}
                </ModalHeader>
                <ModalBody>
                    <div>
                        <Label for="projectName">项目名</Label>
                        <Input id="projectName" placeholder="请输入项目名" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                projectName: v.target.value,
                            });
                        }}/>
                        <Label for="projectName">网络图像宽度(px)-必须是32的整数倍</Label>
                        <Input id="projectName" placeholder="请输入网络图像宽度" min={32} type="number" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                imageSize: [Number(v.target.value), this.state.imageSize[1]],
                            });
                        }}/>
                        <Label for="projectName">网络图像高度度(px)-必须是32的整数倍</Label>
                        <Input id="projectName" placeholder="请输入网络图像高度度" min={32} type="number" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                imageSize: [this.state.imageSize[0], Number(v.target.value)],
                            });
                        }}/>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn btn-success mr-1"
                        onClick={this.ok}>
                        新增
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
        return {
            isOpen: false,
            modalHeader: "新增项目",
            projectName: "",
            imageSize: [512, 512],
        };
    }

    private async ok() {
        if (Number(this.state.imageSize[0]) % 32 !== 0 || Number(this.state.imageSize[1])  % 32 !== 0 ) {
            toast.error("网络图像宽高必须是32的整数倍");
            return;
        }
        this.props.onSubmit(this.state.projectName, this.state.imageSize);
    }

    private back() {
        this.setState({
            ...this.getInitialState(),
            isOpen: true,
        });
    }
}
