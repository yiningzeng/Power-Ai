import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import Draggable from "powerai-react-draggable-v2";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import ProjectMetrics from "../../pages/projectSettings/projectMetrics";
import {IProject} from "../../../../models/applicationState";

export interface IDraggableDialogProps {
    title?: string;
    content?: string;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    fullWidth?: boolean;
    onDone?: () => void;
    onCancel?: () => void;
    project: IProject;
}

export interface IDraggableDialogState {
    open: boolean;
    done: boolean;
    change: boolean;
    title?: string;
    content?: string;
    showCancel?: boolean;
}

function PaperComponent(props: PaperProps) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
    </Draggable>
);
}

export default class DraggableDialog extends React.Component<IDraggableDialogProps, IDraggableDialogState> {

    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
            done: false,
            change: false,
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        // this.messageBox = React.createRef<MessageBox>();
        //
        // this.open = this.open.bind(this);
        // this.close = this.close.bind(this);
        // this.onConfirmClick = this.onConfirmClick.bind(this);
        // this.onCancelClick = this.onCancelClick.bind(this);
    }
    public render() {
        return (
            <div style={{backgroundColor: "#243567"}}>
                <Dialog
                    fullWidth={this.props.fullWidth}
                    disableBackdropClick={this.props.disableBackdropClick}
                    disableEscapeKeyDown={this.props.disableEscapeKeyDown}
                    open={this.state.open}
                    onClose={this.close}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                       数据分析
                    </DialogTitle>
                    <DialogContent>
                        {this.props.project &&
                        <div className="project-settings-page-metrics bg-lighter-1">
                            <ProjectMetrics project={this.props.project} />
                        </div>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e) => this.props.onCancel()} color="primary" >
                            关 闭
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    public open = () => {
        this.setState({open: true, done: false, change: false});
    }

    public change = (title, content, done = false, showCancel= false, change= true) => {
        this.setState({
            change,
            showCancel,
            done,
            title,
            content,
        });
    }

    public close = () => {
        this.setState({open: false});
    }
}
