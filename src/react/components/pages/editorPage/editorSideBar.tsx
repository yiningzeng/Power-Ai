import React, {MouseEvent} from "react";
import { AutoSizer, List } from "react-virtualized";
import { IAsset, AssetState, ISize } from "../../../../models/applicationState";
import { AssetPreview } from "../../common/assetPreview/assetPreview";
import { strings } from "../../../../common/strings";
import {KeyboardBinding} from "../../common/keyboardBinding/keyboardBinding";
import {KeyEventType} from "../../common/keyboardManager/keyboardManager";
import {TagEditMode} from "../../common/tagInput/tagInputItem";

/**
 * Properties for Editor Side Bar
 * @member assets - Array of assets to be previewed
 * @member onAssetSelected - Function to call when asset from side bar is selected
 * @member selectedAsset - Asset initially selected
 * @member thumbnailSize - The size of the asset thumbnails
 */
export interface IEditorSideBarProps {
    assets: IAsset[];
    onAssetSelected: (asset: IAsset, multipleSelect?: boolean, startIndex?: number, endIndex?: number) => void;
    onBeforeAssetSelected?: () => boolean;
    selectedAsset?: IAsset;
    thumbnailSize?: ISize;
}

/**
 * State for Editor Side Bar
 * @member selectedAsset - Asset selected from side bar
 */
export interface IEditorSideBarState {
    scrollToIndex: number;
    multipleSelect: boolean;
    originalIndex: number;
}

/**
 * @name - Editor Side Bar
 * @description - Side bar for editor page
 */
export default class EditorSideBar extends React.Component<IEditorSideBarProps, IEditorSideBarState> {
    public state: IEditorSideBarState = {
        scrollToIndex: this.props.selectedAsset
            ? this.props.assets.findIndex((asset) => asset.id === this.props.selectedAsset.id)
            : 0,
        originalIndex: 0,
        multipleSelect: false,
    };

    private listRef: React.RefObject<List> = React.createRef();

    public render() {
        return (
            <div className="editor-page-sidebar-nav">
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={this.listRef}
                            className="asset-list"
                            height={height}
                            width={width}
                            rowCount={this.props.assets.length}
                            rowHeight={width / (4 / 3) + 16}
                            rowRenderer={this.rowRenderer}
                            overscanRowCount={2}
                            scrollToIndex={this.state.scrollToIndex}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

    public componentDidUpdate(prevProps: IEditorSideBarProps) {
        if (prevProps.thumbnailSize !== this.props.thumbnailSize) {
            this.listRef.current.recomputeRowHeights();
        }

        if (!prevProps.selectedAsset && !this.props.selectedAsset) {
            return;
        }

        if ((!prevProps.selectedAsset && this.props.selectedAsset) ||
            prevProps.selectedAsset.id !== this.props.selectedAsset.id) {
            this.selectAsset(this.props.selectedAsset);
        }
    }

    public removeStatus = () => {
        this.setState({
            ...this.state,
            multipleSelect: false,
        });
    }

    private onItemClick = (e: MouseEvent, asset: IAsset) => {
        // e.stopPropagation();

        const shiftKey = e.shiftKey || e.metaKey;
        let originalIndex = 0;
        let multipleSelect = false;
        if (shiftKey) {
            originalIndex = this.props.assets.findIndex((asset) => asset.id === this.props.selectedAsset.id);
            multipleSelect = true;
        }
        this.setState({
            ...this.state,
            multipleSelect,
            originalIndex,
        }, () => {
            console.log(`sidebar: this.state: ${JSON.stringify(this.state)}`);
            console.log(`sidebar: originalIndex: ${originalIndex}`);
            console.log(`sidebar: multipleSelect: ${multipleSelect}`);
            this.onAssetClicked(asset);
        });
    }

    private getRowHeight = (width: number) => {
        return width / (4 / 3) + 16;
    }

    private selectAsset = (selectedAsset: IAsset): void => {
        const scrollToIndex = this.props.assets.findIndex((asset) => asset.id === selectedAsset.id);
        this.setState({
            scrollToIndex,
        }, () => {
            this.listRef.current.forceUpdateGrid();
            const startIndex = this.state.originalIndex < this.state.scrollToIndex ?
                this.state.originalIndex : this.state.scrollToIndex;
            const endIndex = this.state.originalIndex < this.state.scrollToIndex ?
                this.state.scrollToIndex : this.state.originalIndex;
            console.log(`sidebar: this.state: ${JSON.stringify(this.state)}`);
            this.props.onAssetSelected(selectedAsset, this.state.multipleSelect, startIndex, endIndex);
        });
    }

    private onAssetClicked = (asset: IAsset): void => {
        if (this.props.onBeforeAssetSelected) {
            if (!this.props.onBeforeAssetSelected()) {
                return;
            }
        }
        this.selectAsset(asset);
    }

    private rowRenderer = ({ key, index, style }): JSX.Element => {
        const asset = this.props.assets[index];
        const selectedAsset = this.props.selectedAsset;
        // console.log("EditorSideBar chinese: " + decodeURI(asset.name));
        // console.log("EditorSideBar asset: " + JSON.stringify(this.props.assets));
        return (
            <div key={key} style={style}
                className={this.getAssetCssClassNames(asset, selectedAsset, index)}
                onClick={(e) => {
                    this.onItemClick(e, asset);
                }}
            >
                <div className="asset-item-image">
                    {this.renderSortBadges(asset)}
                    {this.renderBadges(asset)}
                    <AssetPreview asset={asset} />
                </div>
                <div className="asset-item-metadata">
                    <span className="asset-filename" title={decodeURI(asset.name)}>{decodeURI(asset.name)}</span>
                    {asset.size &&
                        <span className="asset-filename2">
                            {asset.size.width} x {asset.size.height}
                        </span>
                    }
                </div>
            </div>
        );
    }

    private renderSortBadges = (asset: IAsset): JSX.Element => {
        if (asset.sorts) {
                return (
                    <span title={strings.editorPage.tagged}
                          className="badge badge-sorted">
                        {"已分类"}
                    </span>
                );
        } else {
            return null;
        }
    }

    private renderBadges = (asset: IAsset): JSX.Element => {
        switch (asset.state) {
            case AssetState.Tagged:
                return (
                    <span title={strings.editorPage.tagged}
                          className="badge badge-tagged">
                        <i className="fas fa-tags"></i>
                    </span>
                );
            case AssetState.Visited:
                return (
                    <span title={strings.editorPage.visited}
                          className="badge badge-visited">
                        <i className="fas fa-eye"></i>
                    </span>
                );
            case AssetState.OkTagged:
                return (
                    <span title={strings.editorPage.tagged}
                          className="badge badge-ok-tagged">
                        <i className="fas fa-check"></i>
                    </span>
                );
            default:
                return null;
        }
    }

    private getAssetCssClassNames = (asset: IAsset, selectedAsset: IAsset = null, index: number): string => {
        const cssClasses = ["asset-item"];
        if (selectedAsset && selectedAsset.id === asset.id) {
            cssClasses.push("selected");
        }
        if (this.state.multipleSelect) {
            const startIndex = this.state.originalIndex < this.state.scrollToIndex ?
                this.state.originalIndex : this.state.scrollToIndex;
            const endIndex = this.state.originalIndex < this.state.scrollToIndex ?
                this.state.scrollToIndex : this.state.originalIndex;
            if (startIndex <= index && index <= endIndex) {
                cssClasses.push("selected-list");
            }
        }

        return cssClasses.join(" ");
    }
}
