import React, { SyntheticEvent } from "react";
import { strings } from "../../../../common/strings";
/** Properties for tag input toolbar */
export interface IFolderSideBarToolbarProps {
    /** Function to call when add tags button is clicked */
    onAddFolder: () => void;
}

interface IFolderSideBarToolbarItemProps {
    displayName: string;
    className: string;
    icon: string;
    handler: () => void;
    accelerators?: string[];
}

export default class FolderSideBarToolbar extends React.Component<IFolderSideBarToolbarProps> {
    public render() {
        return (
            <div className="condensed-list-header-add">
                {
                    this.getToolbarItems().map((itemConfig) =>
                        <div key={itemConfig.displayName} className={`tag-input-toolbar-item ${itemConfig.className}`}
                            onClick={(e) => this.onToolbarItemClick(e, itemConfig)}>
                            <i className={`tag-input-toolbar-icon fas ${itemConfig.icon}`} />
                        </div>,
                    )
                }
            </div>
        );
    }

    private onToolbarItemClick = (e: SyntheticEvent, itemConfig: IFolderSideBarToolbarItemProps): void => {
        e.stopPropagation();
        itemConfig.handler();
    }

    private getToolbarItems = (): IFolderSideBarToolbarItemProps[] => {
        return [
            {
                displayName: strings.tags.toolbar.add,
                className: "plus",
                icon: "fa-plus-circle",
                handler: this.handleAdd,
            },
        ];
    }

    private handleAdd = () => {
        this.props.onAddFolder();
    }
}
