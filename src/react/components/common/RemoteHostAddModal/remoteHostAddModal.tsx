import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader,
    Input, Label, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import { IConnection, StorageType } from "../../../../models/applicationState";
import DraggableDialog from "../draggableDialog/draggableDialog";
/**
 * Properties for Cloud File Picker
 * @member connections - Array of connections to choose from
 * @member onSubmit - Function to call with contents of selected file
 * @member onCancel - Optional function to call on modal closed
 * @member fileExtension - Filter on files with extension
 */
export interface ICloudFilePickerProps {
    onSubmit: (platform: string, hostName: string, hostIp: string) => void;
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
    platform: string;
    hostIp: string;
    hostName: string;
}

/**
 * @name - Cloud File Picker
 * @description - Modal to choose and read file from cloud connections
 */
export class RemoteHostAddModal extends React.Component<ICloudFilePickerProps, ICloudFilePickerState> {

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
                        <Label for="exampleSelect">目标平台</Label>
                        <Input type="select" name="select" id="exampleSelect" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                platform: v.target.value,
                            });
                        }}>
                            <option>Windows</option>
                        </Input>
                        <Label for="hostName">主机名</Label>
                        <Input id="hostName" placeholder="仅做备注显示" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                hostName: v.target.value,
                            });
                        }}/>
                        <Label for="hostIp">主机IP</Label>
                        <Input id="hostIp" placeholder="输入主机的IP" onChange={(v) => {
                            this.setState({
                                ...this.state,
                                hostIp: v.target.value,
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
            modalHeader: "新增主机",
            platform: "Windows",
            hostIp: "",
            hostName: "",
        };
    }

    private async ok() {
        this.props.onSubmit(this.state.platform, this.state.hostName, this.state.hostIp);
    }

    private back() {
        this.setState({
            ...this.getInitialState(),
            isOpen: true,
        });
    }
}
