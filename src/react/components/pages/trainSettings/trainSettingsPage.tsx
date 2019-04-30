import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators } from "redux";
import {
    IProject,
    IApplicationState,
    ITrainSettings,
} from "../../../../models/applicationState";
import IProjectActions, * as projectActions from "../../../../redux/actions/projectActions";
import { strings } from "../../../../common/strings";
import { TrainSettingsForm } from "./trainSettingsForm";
import { toast } from "react-toastify";

export interface ITrainSettingsPageProps extends RouteComponentProps, React.Props<TrainSettingsPage> {
    project: IProject;
    recentProjects: IProject[];
    actions: IProjectActions;
}

export interface ITrainSettingsPageState {
    settings: ITrainSettings;
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

@connect(mapStateToProps, mapDispatchToProps)
export default class TrainSettingsPage extends React.Component<ITrainSettingsPageProps, ITrainSettingsPageState> {
    public state: ITrainSettingsPageState = {
        settings: this.props.project ? this.props.project.trainSettings : null,
    };

    public async componentDidMount() {
        const projectId = this.props.match.params["projectId"];
        // If we are creating a new project check to see if there is a partial
        // project already created in local storage
        if (!this.props.project && projectId) {
            const projectToLoad = this.props.recentProjects.find((project) => project.id === projectId);
            if (projectToLoad) {
                await this.props.actions.loadProject(projectToLoad);
            }
        }
    }

    public componentDidUpdate(prevProps: Readonly<ITrainSettingsPageProps>) {
        if (prevProps.project !== this.props.project) {
            this.setState({ settings: this.props.project.trainSettings });
        }
    }

    public render() {
        return (
            <div className="project-settings-page">
                <div className="project-settings-page-settings m-3">
                    <h3>
                        <i className="fas fa-beer" />
                        <span className="px-2">
                            {strings.trainSettings.title}
                        </span>
                    </h3>
                    <div className="m-3">
                        <TrainSettingsForm
                            settings={this.state.settings}
                            onSubmit={this.onFormSubmit}
                            onCancel={this.onFormCancel} />
                    </div>
                </div>
            </div>
        );
    }

    private onFormSubmit = async (settings: ITrainSettings): Promise<void> => {
        const updatedProject: IProject = {
            ...this.props.project,
            trainSettings: settings,
        };

        await this.props.actions.saveProject(updatedProject);
        toast.success(strings.trainSettings.messages.saveSuccess);
        this.props.history.goBack();
    }

    private onFormCancel = (): void => {
        this.props.history.goBack();
    }
}
