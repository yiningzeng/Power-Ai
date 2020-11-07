import React, { KeyboardEvent, RefObject } from "react";
import ReactDOM from "react-dom";
import Align from "rc-align";
import { randomIntInRange } from "../../../../common/utils";
import { IRegion, ISort } from "../../../../models/applicationState";
import { ColorPicker } from "../colorPicker";
import "./sortInput.scss";
import "../condensedList/condensedList.scss";
import SortInputItem, { ISortInputItemProps, ISortClickProps } from "./sortInputItem";
import SortInputToolbar from "./sortInputToolbar";
import { toast } from "react-toastify";
import { strings } from "../../../../common/strings";
import DraggableDialog from "../draggableDialog/draggableDialog";
// tslint:disable-next-line:no-var-requires
const tagColors = require("../../common/tagColors.json");

export interface ISortInputProps {
    /** Current list of tags */
    sorts: ISort[];
    /** Function called on tags change */
    onChange: (sorts: ISort[]) => void;
    /** Currently selected regions in canvas */
    selectedRegions?: IRegion[];
    /** Sorts that are currently locked for editing experience */
    lockedSorts?: string[];
    /** Updates to locked tags */
    onLockedSortsChange?: (locked: string[]) => void;
    /** Place holder for input text box */
    placeHolder?: string;
    /** Function to call on clicking individual tag */
    onSortClick?: (sort: ISort) => void;
    onSortSearched: (sorts: ISort[], searchQuery: string) => void;
    /** Function to call on clicking individual tag while holding CTRL key */
    onCtrlSortClick?: (sort: ISort) => void;
    /** Function to call when tag is renamed */
    onSortRenamed?: (sortName: string, newSortName: string) => void;
    /** Function to call when tag is deleted */
    onSortDeleted?: (sortName: string) => void;
    /** Always show tag input box */
    showSortInputBox?: boolean;
    /** Always show tag search box */
    showSearchBox?: boolean;
}

export interface ISortInputState {
    sorts: ISort[];
    clickedColor: boolean;
    showColorPicker: boolean;
    addSorts: boolean;
    searchSorts: boolean;
    searchQuery: string;
    selectedSort: ISort;
    editingSort: ISort;
    portalElement: Element;
    editingSortNode: Element;
}

function defaultDOMNode(): Element {
    return document.createElement("div");
}

export class SortInput extends React.Component<ISortInputProps, ISortInputState> {

    public state: ISortInputState = {
        sorts: this.props.sorts || [],
        clickedColor: false,
        showColorPicker: false,
        addSorts: this.props.showSortInputBox,
        searchSorts: this.props.showSearchBox,
        searchQuery: "",
        selectedSort: null,
        editingSort: null,
        editingSortNode: null,
        portalElement: defaultDOMNode(),
    };
    private loadingDialog: React.RefObject<DraggableDialog> = React.createRef();
    private sortItemRefs: Map<string, RefObject<SortInputItem>> = new Map<string, RefObject<SortInputItem>>();
    private portalDiv = document.createElement("div");

    public render() {
        return (
            <div className="tag-input condensed-list">
                <h6 className="condensed-list-header tag-input-header bg-darker-2 p-2">
                    <span className="condensed-list-title tag-input-title">分类-标签列表</span>
                    <SortInputToolbar
                        selectedSort={this.state.selectedSort}
                        onAddSorts={() => this.setState({ addSorts: !this.state.addSorts })}
                        onSearchSorts={() => this.setState({
                            searchSorts: !this.state.searchSorts,
                            searchQuery: "",
                        })}
                        onEditSort={this.onEditSort}
                        onLockSort={this.onLockSort}
                        onDelete={this.deleteSort}
                        onReorder={this.onReOrder}
                    />
                </h6>
                <div className="condensed-list-body">
                    {
                        this.state.searchSorts &&
                        <div className="tag-input-text-input-row search-input">
                            <input
                                type="text"
                                onKeyDown={this.onSearchKeyDown}
                                onChange={(e) => this.setState({ searchQuery: e.target.value }, () => {
                                    if (this.state.searchQuery === "") {
                                        this.doSearch();
                                    }
                                })}
                                placeholder="过滤标签"
                                autoFocus={true}
                            />
                            {/*<button className="tag-row-icon fas fa-search" onClick={this.doSearch} >查询</button>*/}
                        </div>
                    }
                    {this.getColorPickerPortal()}
                    <div className="tag-input-items">
                        {this.renderSortItems()}
                    </div>
                    {
                        this.state.addSorts &&
                        <div className="tag-input-text-input-row new-tag-input">
                            <input
                                className="tag-input-box"
                                type="text"
                                onKeyDown={this.onAddSortKeyDown}
                                placeholder="新增标签名"
                                autoFocus={true}
                            />
                            <i className="tag-input-row-icon fas fa-tag" />
                        </div>
                    }
                </div>
                <DraggableDialog
                    ref={this.loadingDialog}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    onDone={() => {
                        this.loadingDialog.current.close();
                    }}
                    onCancel={() => this.loadingDialog.current.close()}
                />
            </div>
        );
    }

    public componentDidMount() {
        document.body.appendChild(this.portalDiv);
        this.setState({
            portalElement: ReactDOM.findDOMNode(this.portalDiv) as Element,
        });
    }

    public componentWillUnmount() {
        document.body.removeChild(this.portalDiv);
    }

    public componentDidUpdate(prevProps: ISortInputProps) {
        if (prevProps.sorts !== this.props.sorts) {
            this.setState({
                sorts: this.props.sorts,
            });
        }

        if (prevProps.selectedRegions !== this.props.selectedRegions && this.props.selectedRegions.length > 0) {
            this.setState({
                selectedSort: null,
            });
        }
    }

    private getSortNode = (tag: ISort): Element => {
        if (!tag) {
            return defaultDOMNode();
        }

        const itemRef = this.sortItemRefs.get(tag.name);
        return (itemRef ? ReactDOM.findDOMNode(itemRef.current) : defaultDOMNode()) as Element;
    }

    private onEditSort = (tag: ISort) => {
        if (!tag) {
            return;
        }
        const { editingSort } = this.state;
        const newEditingSort = (editingSort && editingSort.name === tag.name) ? null : tag;
        this.setState({
            editingSort: newEditingSort,
        });
        if (this.state.clickedColor) {
            this.setState({
                showColorPicker: !this.state.showColorPicker,
            });
        }
    }

    private onLockSort = (tag: ISort) => {
        // alert(JSON.stringify(tag));
        if (!tag) {
            return;
        }
        let lockedSorts = [...this.props.lockedSorts];
        if (lockedSorts.find((t) => t === tag.name)) {
            lockedSorts = lockedSorts.filter((t) => t !== tag.name);
        } else {
            lockedSorts.push(tag.name);
        }
        this.props.onLockedSortsChange(lockedSorts);
    }

    private onReOrder = (tag: ISort, displacement: number) => {
        if (!tag) {
            return;
        }
        const sorts = [...this.state.sorts];
        const currentIndex = sorts.indexOf(tag);
        const newIndex = currentIndex + displacement;
        if (newIndex < 0 || newIndex >= sorts.length) {
            return;
        }
        sorts.splice(currentIndex, 1);
        sorts.splice(newIndex, 0, tag);
        this.setState({
            sorts,
        }, () => this.props.onChange(sorts));
    }

    private handleColorChange = (color: string) => {
        const sort = this.state.editingSort;
        const sorts = this.state.sorts.map((t) => {
            return (t.name === sort.name) ? { name: t.name, color } : t;
        });
        this.setState({
            sorts,
            editingSort: null,
            showColorPicker: false,
        }, () => this.props.onChange(sorts));
    }

    private updateSort = (tag: ISort, newSort: ISort) => {
        if (tag === newSort) {
            return;
        }
        if (!newSort.name.length) {
            toast.warn(strings.tags.warnings.emptyName);
            return;
        }
        const nameChange = tag.name !== newSort.name;
        if (nameChange && this.state.sorts.some((t) => t.name === newSort.name)) {
            this.props.onSortRenamed(tag.name, newSort.name);
            return;
        }
        if (nameChange && this.props.onSortRenamed) {
            this.props.onSortRenamed(tag.name, newSort.name);
            return;
        }
        const sorts = this.state.sorts.map((t) => {
            return (t.name === tag.name) ? newSort : t;
        });
        this.setState({
            sorts,
            editingSort: null,
            selectedSort: newSort,
        }, () => {
            this.props.onChange(sorts);
        });
    }

    private getColorPickerPortal = () => {
        return (
            <div>
                {
                    ReactDOM.createPortal(
                        <Align align={this.getAlignConfig()} target={this.getTarget}>
                            <div className="tag-input-color-picker">
                                {
                                    this.state.showColorPicker &&
                                    <ColorPicker
                                        color={this.state.editingSort && this.state.editingSort.color}
                                        colors={tagColors}
                                        onEditColor={this.handleColorChange}
                                        show={this.state.showColorPicker}
                                    />
                                }
                            </div>
                        </Align>
                        , this.state.portalElement)
                }
            </div>
        );
    }

    private getAlignConfig = () => {
        const coords = this.getEditingSortCoords();
        const isNearBottom = coords && coords.top > (window.innerHeight / 2);
        const alignCorner = isNearBottom ? "b" : "t";
        const verticalOffset = isNearBottom ? 6 : -6;
        return {
            // Align top right of source node (color picker) with top left of target node (tag row)
            points: [`${alignCorner}r`, `${alignCorner}l`],
            // Offset source node by 10px in x and 20px in y
            offset: [0, verticalOffset],
            // Offset targetNode by 30% of target node width in x and 40% of target node height
            // targetOffset: ["30%", "40%"],
            // Auto adjust position when source node is overflowed
            // overflow: {adjustX: true, adjustY: true}
        };
    }

    private getEditingSortCoords = () => {
        const node = this.state.editingSortNode;
        return (node) ? node.getBoundingClientRect() : null;
    }

    private getTarget = () => {
        return this.state.editingSortNode || document;
    }

    private doSearch = () => {
        this.loadingDialog.current.open();
        this.loadingDialog.current.change("正在搜索标签...", "请耐心等待");
        let sorts = this.state.sorts;
        const query = this.state.searchQuery;
        if (query.length) {
            sorts = sorts.filter((p) => p.name.toLowerCase().startsWith(query.toLowerCase()));
        }
        this.props.onSortSearched(sorts, query);
        this.loadingDialog.current.close();
        // return tags;
    }

    private renderSortItems = () => {
        let props = this.createSortItemProps();
        const query = this.state.searchQuery;
        this.sortItemRefs.clear();

        if (query.length) {
            props = props.filter((prop) => prop.tag.name.toLowerCase().startsWith(query.toLowerCase()));
        }
        // console.log("taginput");
        // console.log("taginput" + JSON.stringify(props));
        return props.map((prop) => {
            return  <SortInputItem
                key={prop.tag.name}
                ref={(item) => this.setSortItemRef(item, prop.tag)}
                {...prop}
            />;
        });
    }

    private setSortItemRef = (item, tag) => {
        this.sortItemRefs.set(tag.name, item);
        return item;
    }

    private createSortItemProps = (): ISortInputItemProps[] => {
        const sorts = this.state.sorts;
        const selectedRegionSortSet = this.getSelectedRegionSortSet();

        return sorts.map((tag) => (
            {
                tag,
                index: sorts.findIndex((t) => t.name === tag.name),
                isLocked: this.props.lockedSorts && this.props.lockedSorts.findIndex((t) => t === tag.name) > -1,
                isBeingEdited: this.state.editingSort && this.state.editingSort.name === tag.name,
                isSelected: this.state.selectedSort && this.state.selectedSort.name === tag.name,
                appliedToSelectedRegions: selectedRegionSortSet.has(tag.name),
                onClick: this.handleClick,
                onChange: this.updateSort,
            } as ISortInputItemProps
        ));
    }

    private getSelectedRegionSortSet = (): Set<string> => {
        const result = new Set<string>();
        if (this.props.selectedRegions) {
            for (const region of this.props.selectedRegions) {
                for (const tag of region.tags) {
                    result.add(tag);
                }
            }
        }
        return result;
    }

    private onAltClick = (tag: ISort, clickedColor: boolean) => {
        const { editingSort } = this.state;
        const newEditingSort = editingSort && editingSort.name === tag.name ? null : tag;

        this.setState({
            editingSort: newEditingSort,
            editingSortNode: this.getSortNode(newEditingSort),
            clickedColor,
            showColorPicker: !this.state.showColorPicker && clickedColor,
        });
    }

    private handleClick = (tag: ISort, props: ISortClickProps) => {
        // Lock tags
        if (props.ctrlKey && this.props.onCtrlSortClick) {
            this.props.onCtrlSortClick(tag);
            this.setState({ clickedColor: props.clickedColor });
        } else if (props.altKey) { // Edit tag
            this.onAltClick(tag, props.clickedColor);
        } else { // Select tag
            const { editingSort, selectedSort } = this.state;
            const inEditMode = editingSort && tag.name === editingSort.name;
            const alreadySelected = selectedSort && selectedSort.name === tag.name;
            const newEditingSort = inEditMode ? null : editingSort;

            this.setState({
                editingSort: newEditingSort,
                editingSortNode: this.getSortNode(newEditingSort),
                selectedSort: (alreadySelected && !inEditMode) ? tag : tag,
                clickedColor: props.clickedColor,
                showColorPicker: false,
            });

            // Only fire click event if a region is selected
            // if (this.props.selectedRegions &&
            //     this.props.selectedRegions.length > 0 &&
            //     this.props.onSortClick &&
            //     !inEditMode) {
            //     this.props.onSortClick(tag);
            // }
        }
        // alert(`啦啦${JSON.stringify(this.state.searchSorts)}`);
    }

    private deleteSort = (tag: ISort) => {
        if (!tag) {
            return;
        }
        if (this.props.onSortDeleted) {
            this.props.onSortDeleted(tag.name);
            return;
        }

        const index = this.state.sorts.indexOf(tag);
        const sorts = this.state.sorts.filter((t) => t.name !== tag.name);

        this.setState({
            sorts,
            selectedSort: this.getNewSelectedSort(sorts, index),
        }, () => this.props.onChange(sorts));

        if (this.props.lockedSorts.find((l) => l === tag.name)) {
            this.props.onLockedSortsChange(
                this.props.lockedSorts.filter((lockedSort) => lockedSort !== tag.name),
            );
        }
    }

    private getNewSelectedSort = (tags: ISort[], previouIndex: number): ISort => {
        return (tags.length) ? tags[Math.min(tags.length - 1, previouIndex)] : null;
    }

    private onSearchKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            this.setState({
                searchSorts: false,
            });
        } else if (event.key === "Enter") {
            this.doSearch();
        }
    }

    private onAddSortKeyDown = (event) => {
        if (event.key === "Enter") {
            // validate and add
            const newSort: ISort = {
                name: event.target.value,
                color: this.getNextColor(),
            };
            if (newSort.name.length && !this.state.sorts.find((t) => t.name === newSort.name)) {
                this.addSort(newSort);
                event.target.value = "";
            } else if (!newSort.name.length) {
                toast.warn(strings.tags.warnings.emptyName);
            } else {
                toast.warn(strings.tags.warnings.existingName);
            }
        }
        if (event.key === "Escape") {
            this.setState({
                addSorts: false,
            });
        }
    }

    private getNextColor = () => {
        const sorts = this.state.sorts;
        if (sorts.length > 0) {
            const lastColor = sorts[sorts.length - 1].color;
            const lastIndex = tagColors.findIndex((color) => color === lastColor);
            let newIndex;
            if (lastIndex > -1) {
                newIndex = (lastIndex + 1) % tagColors.length;
            } else {
                newIndex = randomIntInRange(0, tagColors.length - 1);
            }
            return tagColors[newIndex];
        } else {
            return tagColors[0];
        }
    }

    private addSort = (sort: ISort) => {
        if (!this.state.sorts.find((t) => t.name === sort.name)) {
            const sorts = [...this.state.sorts, sort];
            this.setState({
                sorts,
            }, () => this.props.onChange(sorts));
        }
    }
}
