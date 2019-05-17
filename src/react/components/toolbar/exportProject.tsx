import { ToolbarItem } from "./toolbarItem";
import { toast } from "react-toastify";

/**
 * @name - Export Project
 * @description - Toolbar item to export current project
 */
export class ExportProject extends ToolbarItem {
    protected onItemClick = async () => {
        const infoId = toast.info(`Started export for ${this.props.project.name}...`, { autoClose: false });
        const results = await this.props.actions.exportProject(this.props.project);
        // const results2 = await this.props.actions.exportTrainConfig(this.props.project);
        // console.log("ExportProject:" + JSON.stringify(results2));
        toast.dismiss(infoId);

        if (!results || (results && results.errors.length === 0)) {
            toast.success(`Export completed successfully!`);
        } else if (results && results.errors.length > 0) {
            toast.warn(`Successfully exported ${results.completed.length}/${results.count} assets`);
        }
    }
}
