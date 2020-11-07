import React, { SyntheticEvent } from "react";
import { strings } from "../../../../common/strings";
import { ISort } from "../../../../models/applicationState";
import "./sortInput.scss";

/** Properties for Sort input toolbar */
export interface ISortInputToolbarProps {
    /** Currently selected Sort */
    selectedSort: ISort;
    /** Function to call when add Sorts button is clicked */
    onAddSorts: () => void;
    /** Function to call when search Sorts button is clicked */
    onSearchSorts: () => void;
    /** Function to call when lock Sorts button is clicked */
    onLockSort: (Sort: ISort) => void;
    /** Function to call when edit Sort button is clicked */
    onEditSort: (Sort: ISort) => void;
    /** Function to call when delete button is clicked */
    onDelete: (Sort: ISort) => void;
    /** Function to call when one of the re-order buttons is clicked */
    onReorder: (Sort: ISort, displacement: number) => void;
}

interface ISortInputToolbarItemProps {
    displayName: string;
    className: string;
    icon: string;
    handler: () => void;
    accelerators?: string[];
}

export default class SortInputToolbar extends React.Component<ISortInputToolbarProps> {
    public render() {
        return (
            <div className="Sort-input-toolbar">
                {
                    this.getToolbarItems().map((itemConfig) =>
                        <a title={itemConfig.displayName} key={itemConfig.displayName} className={`Sort-input-toolbar-item ${itemConfig.className}`}
                            onClick={(e) => this.onToolbarItemClick(e, itemConfig)}>
                            <i className={`Sort-input-toolbar-icon fas ${itemConfig.icon}`} />
                        </a>,
                    )
                }
            </div>
        );
    }

    private onToolbarItemClick = (e: SyntheticEvent, itemConfig: ISortInputToolbarItemProps): void => {
        e.stopPropagation();
        itemConfig.handler();
    }

    private getToolbarItems = (): ISortInputToolbarItemProps[] => {
        return [
            {
                displayName: strings.tags.toolbar.add,
                className: "plus",
                icon: "fa-plus-circle",
                handler: this.handleAdd,
            },
            {
                displayName: strings.tags.toolbar.search,
                className: "search",
                icon: "fa-search",
                handler: this.handleSearch,
            },
            // {
            //     displayName: strings.Sorts.toolbar.lock,
            //     className: "lock",
            //     icon: "fa-lock",
            //     handler: this.handleLock,
            // },
            {
                displayName: strings.tags.toolbar.edit,
                className: "edit",
                icon: "fa-edit",
                handler: this.handleEdit,
            },
            {
                displayName: strings.tags.toolbar.moveUp,
                className: "up",
                icon: "fa-arrow-circle-up",
                handler: this.handleArrowUp,
            },
            {
                displayName: strings.tags.toolbar.moveDown,
                className: "down",
                icon: "fa-arrow-circle-down",
                handler: this.handleArrowDown,
            },
            {
                displayName: strings.tags.toolbar.delete,
                className: "delete",
                icon: "fa-trash",
                handler: this.handleDelete,
            },
        ];
    }

    private handleAdd = () => {
        this.props.onAddSorts();
    }

    private handleSearch = () => {
        this.props.onSearchSorts();
    }

    private handleLock = () => {
        this.props.onLockSort(this.props.selectedSort);
    }

    private handleEdit = () => {
        this.props.onEditSort(this.props.selectedSort);
    }

    private handleArrowUp = () => {
        this.props.onReorder(this.props.selectedSort, -1);
    }

    private handleArrowDown = () => {
        this.props.onReorder(this.props.selectedSort, 1);
    }

    private handleDelete = () => {
        this.props.onDelete(this.props.selectedSort);
    }
}
