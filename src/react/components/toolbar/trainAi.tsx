import { ToolbarItem } from "./toolbarItem";
import { toast } from "react-toastify";
import {IpcRendererProxy} from "../../../common/ipcRendererProxy";
import {toggleDevToolsAction} from "../../../redux/actions/applicationActions";
import {Dispatch} from "redux";

/**
 * @name - Export Project
 * @description - Toolbar item to export current project
 */
export class TrainAi extends ToolbarItem {
    protected onItemClick = async () => {
        const infoId = toast.info(`开始导出 ${this.props.project.name} ...`);
        const results = await this.props.actions.exportProject(this.props.project);

        toast.dismiss(infoId);

        if (!results || (results && results.errors.length === 0)) {
            toast.success(`导出成功!`);
        } else if (results && results.errors.length > 0) {
            toast.warn(`成功导出部分 ${results.completed.length}/${results.count} 资源`);
        }

        toast.info(`开始配置训练...`);

        IpcRendererProxy.send("TrainingSystem:startTraining", [this.props.project])
            .then(() => {
                toast.success(`配置成功`);
            });
        // IpcRendererProxy.send("START_TRAINING", [path])
        //     .then(() => {
        //         toast.info(path, { autoClose: false });
        //     });
    }
}
