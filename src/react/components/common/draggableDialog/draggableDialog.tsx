import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import Draggable from "powerai-react-draggable-v2";
import LinearProgress, {LinearProgressProps} from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import {IpcRendererProxy} from "../../../../common/ipcRendererProxy";
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

export interface IDraggableDialogProps {
    title?: string;
    content?: string;
    showProgress?: boolean;
    interval?: number;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    fullWidth?: boolean;
    onDone?: () => void;
    onCancel?: () => void;
}

export interface IDraggableDialogState {
    open: boolean;
    done: boolean;
    change: boolean;
    nowValue?: number;
    allNum?: number;
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

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default class DraggableDialog extends React.Component<IDraggableDialogProps, IDraggableDialogState> {
    private timer;
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
                        {this.state.change ?
                            this.state.title === undefined ? "处理完成" : this.state.title :
                            this.props.title === undefined ? "请耐心等待" : this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        {
                            this.props.showProgress ?
                                <LinearProgressWithLabel value={this.state.nowValue * 100 / this.state.allNum} /> :
                                this.state.done ? undefined : <LinearProgress />
                        }
                        <DialogContentText style={{marginTop: "20px"}}>
                            {this.state.change ?
                                this.state.content === undefined ? "已经处理完成，确定返回上一页" : this.state.content :
                                this.props.content === undefined ?
                                    "正在处理" : this.props.showProgress ?
                                    this.state.nowValue === this.state.allNum ? `已处理完成${this.state.allNum}个素材，正在跳转标注中心...` :
                                    this.props.content + `(${this.state.nowValue}/${this.state.allNum})` :
                                    this.props.content}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {this.state.done ? <Button onClick={(e) => this.props.onDone()} color="primary" >
                            确定
                        </Button> : undefined}
                        {this.state.showCancel ? <Button onClick={(e) => this.props.onCancel()} color="primary" >
                            取消
                        </Button> : undefined}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    public open = async (path?: string) => {
        if (this.props.showProgress) {
            this.setState({
                open: true,
                change: false,
                done: false,
                content: "正在计算素材数量...",
                nowValue: 0,
                allNum: 100,
            }, async () => {
                const cal = await IpcRendererProxy.send(`TrainingSystem:CalProgress`, [path]);
                if (cal === "success") {
                    const allNum = await IpcRendererProxy.send(`TrainingSystem:GetProgress`, ["allNum.txt"]);
                    this.doProgress();
                    this.setState({...this.state, allNum: Number(allNum)});
                }
            });
        } else {
            this.setState({open: true, done: false, change: false});
        }
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
        if (this.props.showProgress) {
            this.clearProgress();
        }
    }

    private doProgress() {
        this.timer = setInterval(async () => {
            const pro = await IpcRendererProxy.send(`TrainingSystem:GetProgress`, ["now.txt"]);
            this.setState({...this.state, open: true, done: false, change: false, nowValue: Number(pro)}, () => {
                if (this.state.allNum === this.state.nowValue) {
                    this.clearProgress();
                }
            });
        }, this.props.interval === undefined ? 150 : this.props.interval);
    }
    private clearProgress() {
        clearInterval(this.timer);
    }
}
