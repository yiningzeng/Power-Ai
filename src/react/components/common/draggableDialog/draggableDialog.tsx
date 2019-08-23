import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import LinearProgress from "@material-ui/core/LinearProgress";

export interface IDraggableDialogProps {
    title?: string;
    content?: string;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    fullWidth?: boolean;
}

export interface IDraggableDialogState {
   open: boolean;
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
            <div>
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
                        {this.props.title === undefined ? "请耐心等待" : this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        <LinearProgress />
                        <DialogContentText style={{marginTop: "20px"}}>
                            {this.props.content === undefined ? "正在处理" : this.props.content}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    public open = () => {
        this.setState({open: true});
    }

    public close = () => {
        this.setState({open: false});
    }
}
