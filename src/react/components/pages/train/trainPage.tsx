import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RouteComponentProps } from "react-router-dom";
import IProjectActions, * as projectActions from "../../../../redux/actions/projectActions";
import TrainForm from "./trainForm";
import {IProject, IApplicationState, IExportFormat, ITrainFormat} from "../../../../models/applicationState";
import { strings } from "../../../../common/strings";
import { ExportAssetState } from "../../../../providers/export/exportProvider";
import { toast } from "react-toastify";
import {IYoloV3} from "../../../../models/trainConfig";
import {IpcRendererProxy} from "../../../../common/ipcRendererProxy";

/**
 * Properties for Export Page
 * @member project - Project being edited
 * @member recentProjects - Array of projects recently viewed/edited
 * @member actions - Project actions
 */
export interface ITrainPageProps extends RouteComponentProps, React.Props<TrainPage> {
    project: IProject;
    recentProjects: IProject[];
    actions: IProjectActions;
}

function mapStateToProps(state: IApplicationState) {
    return {
        project: state.currentProject,
        recentProjects: state.recentProjects,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projectActions, dispatch),
    };
}

const trainSettingsYolov3: IYoloV3 = {
    yolov3net: {
        batch: 64,
        subdivisions: 16,
        width: 608,
        height: 608,
        channels: 3,
        momentum: 0.9,
        decay: 0.0005,
        angle: 0,
        saturation: 1.5,
        exposure: 1.5,
        hue: .1,
        learning_rate: 0.001,
        burn_in: 1000,
        max_batches: 500200,
        policy: "steps",
        steps: "400000,450000",
        scales: ".1,.1",
    },
};
/**
 * @name - Export Page
 * @description - Page for adding/editing/removing export configurations
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class TrainPage extends React.Component<ITrainPageProps> {
    private emptyTrainFormat: ITrainFormat = {
        providerType: "yolov3",
        providerOptions: trainSettingsYolov3,
    };

    constructor(props, context) {
        super(props, context);

        const projectId = this.props.match.params["projectId"];
        if (!this.props.project && projectId) {
            const project = this.props.recentProjects.find((project) => project.id === projectId);
            this.props.actions.loadProject(project);
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormCancel = this.onFormCancel.bind(this);
    }

    public render() {
        const trainFormat = this.props.project && this.props.project.trainFormat
            ? this.props.project.trainFormat
            : { ...this.emptyTrainFormat };

        return (
            <div className="m-3">
                <h3>
                    <i className="fas fa-sliders-h fa-1x"></i>
                    <span className="px-2">
                        {strings.export.settings}
                    </span>
                </h3>
                <div className="m-3">
                    <TrainForm
                        settings={trainFormat}
                        onSubmit={this.onFormSubmit}
                        onCancel={this.onFormCancel} />
                </div>
            </div>
        );
    }

    private onFormSubmit = async (trainFormat: ITrainFormat) => {
        const projectToUpdate: IProject = {
            ...this.props.project,
            trainFormat,
        };

        await this.props.actions.saveProject(projectToUpdate);
        toast.success(strings.export.messages.saveSuccess);

        // region 开始训练
        // const infoId = toast.info(`开始导出 ${this.props.project.name} ...`);
        // const results = await this.props.actions.exportProject(this.props.project);
        // const resultsTrainConfig = await this.props.actions.exportTrainConfig(this.props.project);
        // toast.dismiss(infoId);
        //
        // if (!resultsTrainConfig || (resultsTrainConfig && resultsTrainConfig.success)) {
        //     toast.success(`导出成功!`);
        // } else if (resultsTrainConfig && !resultsTrainConfig.success) {
        // }
        // if (!results || (results && results.errors.length === 0)) {
        //     toast.success(`导出成功!`);
        // } else if (results && results.errors.length > 0) {
        //     toast.warn(`成功导出部分 ${results.completed.length}/${results.count} 资源`);
        // }

        toast.info(`开始配置训练...`);

        IpcRendererProxy.send(`TrainingSystem:${this.props.project.trainFormat.providerType}`, [this.props.project])
            .then(() => {
                toast.success(`配置成功`);
            });
        // endregion

        this.props.history.goBack();
    }

    private onFormCancel() {
        this.props.history.goBack();
    }
}
