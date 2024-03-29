import React, { KeyboardEvent, RefObject } from "react";
import ReactDOM from "react-dom";
import Align from "rc-align";
import { randomIntInRange } from "../../../../common/utils";
import { IRegion, ITag } from "../../../../models/applicationState";
import { ColorPicker } from "../colorPicker";
import "./tagInput.scss";
import "../condensedList/condensedList.scss";
import TagInputItem, { ITagInputItemProps, ITagClickProps } from "./tagInputItem";
import TagInputToolbar from "./tagInputToolbar";
import { toast } from "react-toastify";
import { strings } from "../../../../common/strings";
import DraggableDialog from "../draggableDialog/draggableDialog";
// tslint:disable-next-line:no-var-requires
const tagColors = require("../../common/tagColors.json");

export interface ITagInputProps {
    /** Current list of tags */
    tags: ITag[];
    /** Function called on tags change */
    onChange: (tags: ITag[]) => void;
    /** Currently selected regions in canvas */
    selectedRegions?: IRegion[];
    /** Tags that are currently locked for editing experience */
    lockedTags?: string[];
    /** Updates to locked tags */
    onLockedTagsChange?: (locked: string[]) => void;
    /** Place holder for input text box */
    placeHolder?: string;
    /** Function to call on clicking individual tag */
    onTagClick?: (tag: ITag) => void;
    onTagSearched: (tags: ITag[], searchQuery: string) => void;
    /** Function to call on clicking individual tag while holding CTRL key */
    onCtrlTagClick?: (tag: ITag) => void;
    /** Function to call when tag is renamed */
    onTagRenamed?: (tagName: string, newTagName: string) => void;
    /** Function to call when tag is deleted */
    onTagDeleted?: (tagName: string) => void;
    /** Always show tag input box */
    showTagInputBox?: boolean;
    /** Always show tag search box */
    showSearchBox?: boolean;
}

export interface ITagInputState {
    tags: ITag[];
    clickedColor: boolean;
    showColorPicker: boolean;
    addTags: boolean;
    searchTags: boolean;
    searchQuery: string;
    selectedTag: ITag;
    editingTag: ITag;
    portalElement: Element;
    editingTagNode: Element;
}

function defaultDOMNode(): Element {
    return document.createElement("div");
}

export class TagInput extends React.Component<ITagInputProps, ITagInputState> {

    public state: ITagInputState = {
        tags: this.props.tags || [],
        clickedColor: false,
        showColorPicker: false,
        addTags: this.props.showTagInputBox,
        searchTags: this.props.showSearchBox,
        searchQuery: "",
        selectedTag: null,
        editingTag: null,
        editingTagNode: null,
        portalElement: defaultDOMNode(),
    };
    private loadingDialog: React.RefObject<DraggableDialog> = React.createRef();
    private tagItemRefs: Map<string, RefObject<TagInputItem>> = new Map<string, RefObject<TagInputItem>>();
    private portalDiv = document.createElement("div");

    public render() {
        return (
            <div className="tag-input condensed-list">
                <h6 className="condensed-list-header tag-input-header bg-darker-2 p-2">
                    <span className="condensed-list-title tag-input-title">标签列表</span>
                    <TagInputToolbar
                        selectedTag={this.state.selectedTag}
                        onAddTags={() => this.setState({ addTags: !this.state.addTags })}
                        onSearchTags={() => this.setState({
                            searchTags: !this.state.searchTags,
                            searchQuery: "",
                        })}
                        onEditTag={this.onEditTag}
                        onLockTag={this.onLockTag}
                        onDelete={this.deleteTag}
                        onReorder={this.onReOrder}
                    />
                </h6>
                <div className="condensed-list-body">
                    {
                        this.state.searchTags &&
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
                        {this.renderTagItems()}
                    </div>
                    {
                        this.state.addTags &&
                        <div className="tag-input-text-input-row new-tag-input">
                            <input
                                className="tag-input-box"
                                type="text"
                                onKeyDown={this.onAddTagKeyDown}
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

    public componentDidUpdate(prevProps: ITagInputProps) {
        if (prevProps.tags !== this.props.tags) {
            this.setState({
                tags: this.props.tags,
            });
        }

        if (prevProps.selectedRegions !== this.props.selectedRegions && this.props.selectedRegions.length > 0) {
            this.setState({
                selectedTag: null,
            });
        }
    }

    private getTagNode = (tag: ITag): Element => {
        if (!tag) {
            return defaultDOMNode();
        }

        const itemRef = this.tagItemRefs.get(tag.name);
        return (itemRef ? ReactDOM.findDOMNode(itemRef.current) : defaultDOMNode()) as Element;
    }

    private onEditTag = (tag: ITag) => {
        if (!tag) {
            return;
        }
        const { editingTag } = this.state;
        const newEditingTag = (editingTag && editingTag.name === tag.name) ? null : tag;
        this.setState({
            editingTag: newEditingTag,
        });
        if (this.state.clickedColor) {
            this.setState({
                showColorPicker: !this.state.showColorPicker,
            });
        }
    }

    private onLockTag = (tag: ITag) => {
        // alert(JSON.stringify(tag));
        if (!tag) {
            return;
        }
        let lockedTags = [...this.props.lockedTags];
        if (lockedTags.find((t) => t === tag.name)) {
            lockedTags = lockedTags.filter((t) => t !== tag.name);
        } else {
            lockedTags.push(tag.name);
        }
        this.props.onLockedTagsChange(lockedTags);
    }

    private onReOrder = (tag: ITag, displacement: number) => {
        if (!tag) {
            return;
        }
        const tags = [...this.state.tags];
        const currentIndex = tags.indexOf(tag);
        const newIndex = currentIndex + displacement;
        if (newIndex < 0 || newIndex >= tags.length) {
            return;
        }
        tags.splice(currentIndex, 1);
        tags.splice(newIndex, 0, tag);
        this.setState({
            tags,
        }, () => this.props.onChange(tags));
    }

    private handleColorChange = (color: string) => {
        const tag = this.state.editingTag;
        const tags = this.state.tags.map((t) => {
            return (t.name === tag.name) ? { name: t.name, color } : t;
        });
        this.setState({
            tags,
            editingTag: null,
            showColorPicker: false,
        }, () => this.props.onChange(tags));
    }

    private updateTag = (tag: ITag, newTag: ITag) => {
        if (tag === newTag) {
            return;
        }
        if (!newTag.name.length) {
            toast.warn(strings.tags.warnings.emptyName);
            return;
        }
        const nameChange = tag.name !== newTag.name;
        if (nameChange && this.state.tags.some((t) => t.name === newTag.name)) {
            this.props.onTagRenamed(tag.name, newTag.name);
            return;
        }
        if (nameChange && this.props.onTagRenamed) {
            this.props.onTagRenamed(tag.name, newTag.name);
            return;
        }
        const tags = this.state.tags.map((t) => {
            return (t.name === tag.name) ? newTag : t;
        });
        this.setState({
            tags,
            editingTag: null,
            selectedTag: newTag,
        }, () => {
            this.props.onChange(tags);
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
                                        color={this.state.editingTag && this.state.editingTag.color}
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
        const coords = this.getEditingTagCoords();
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

    private getEditingTagCoords = () => {
        const node = this.state.editingTagNode;
        return (node) ? node.getBoundingClientRect() : null;
    }

    private getTarget = () => {
        return this.state.editingTagNode || document;
    }

    private doSearch = () => {
        this.loadingDialog.current.open();
        this.loadingDialog.current.change("正在搜索标签...", "请耐心等待");
        let tags = this.state.tags;
        const query = this.state.searchQuery;
        if (query.length) {
            tags = tags.filter((p) => p.name.toLowerCase().startsWith(query.toLowerCase()));
        }
        this.props.onTagSearched(tags, query);
        this.loadingDialog.current.close();
        // return tags;
    }

    private renderTagItems = () => {
        let props = this.createTagItemProps();
        const query = this.state.searchQuery;
        this.tagItemRefs.clear();

        if (query.length) {
            props = props.filter((prop) => prop.tag.name.toLowerCase().startsWith(query.toLowerCase()));
        }
        // console.log("taginput");
        // console.log("taginput" + JSON.stringify(props));
        return props.map((prop) => {
            return  <TagInputItem
                key={prop.tag.name}
                ref={(item) => this.setTagItemRef(item, prop.tag)}
                {...prop}
            />;
        });
    }

    private setTagItemRef = (item, tag) => {
        this.tagItemRefs.set(tag.name, item);
        return item;
    }

    private createTagItemProps = (): ITagInputItemProps[] => {
        const tags = this.state.tags;
        const selectedRegionTagSet = this.getSelectedRegionTagSet();

        return tags.map((tag) => (
            {
                tag,
                index: tags.findIndex((t) => t.name === tag.name),
                isLocked: this.props.lockedTags && this.props.lockedTags.findIndex((t) => t === tag.name) > -1,
                isBeingEdited: this.state.editingTag && this.state.editingTag.name === tag.name,
                isSelected: this.state.selectedTag && this.state.selectedTag.name === tag.name,
                appliedToSelectedRegions: selectedRegionTagSet.has(tag.name),
                onClick: this.handleClick,
                onChange: this.updateTag,
            } as ITagInputItemProps
        ));
    }

    private getSelectedRegionTagSet = (): Set<string> => {
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

    private onAltClick = (tag: ITag, clickedColor: boolean) => {
        const { editingTag } = this.state;
        const newEditingTag = editingTag && editingTag.name === tag.name ? null : tag;

        this.setState({
            editingTag: newEditingTag,
            editingTagNode: this.getTagNode(newEditingTag),
            clickedColor,
            showColorPicker: !this.state.showColorPicker && clickedColor,
        });
    }

    private handleClick = (tag: ITag, props: ITagClickProps) => {
        // Lock tags
        if (props.ctrlKey && this.props.onCtrlTagClick) {
            this.props.onCtrlTagClick(tag);
            this.setState({ clickedColor: props.clickedColor });
        } else if (props.altKey) { // Edit tag
            this.onAltClick(tag, props.clickedColor);
        } else { // Select tag
            const { editingTag, selectedTag } = this.state;
            const inEditMode = editingTag && tag.name === editingTag.name;
            const alreadySelected = selectedTag && selectedTag.name === tag.name;
            const newEditingTag = inEditMode ? null : editingTag;

            this.setState({
                editingTag: newEditingTag,
                editingTagNode: this.getTagNode(newEditingTag),
                selectedTag: (alreadySelected && !inEditMode) ? tag : tag,
                clickedColor: props.clickedColor,
                showColorPicker: false,
            });

            // Only fire click event if a region is selected
            // if (this.props.selectedRegions &&
            //     this.props.selectedRegions.length > 0 &&
            //     this.props.onTagClick &&
            //     !inEditMode) {
            //     this.props.onTagClick(tag);
            // }
        }
        // alert(`啦啦${JSON.stringify(this.state.searchTags)}`);
    }

    private deleteTag = (tag: ITag) => {
        if (!tag) {
            return;
        }
        if (this.props.onTagDeleted) {
            this.props.onTagDeleted(tag.name);
            return;
        }

        const index = this.state.tags.indexOf(tag);
        const tags = this.state.tags.filter((t) => t.name !== tag.name);

        this.setState({
            tags,
            selectedTag: this.getNewSelectedTag(tags, index),
        }, () => this.props.onChange(tags));

        if (this.props.lockedTags.find((l) => l === tag.name)) {
            this.props.onLockedTagsChange(
                this.props.lockedTags.filter((lockedTag) => lockedTag !== tag.name),
            );
        }
    }

    private getNewSelectedTag = (tags: ITag[], previouIndex: number): ITag => {
        return (tags.length) ? tags[Math.min(tags.length - 1, previouIndex)] : null;
    }

    private onSearchKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            this.setState({
                searchTags: false,
            });
        } else if (event.key === "Enter") {
            this.doSearch();
        }
    }

    private onAddTagKeyDown = (event) => {
        if (event.key === "Enter") {
            // validate and add
            const newTag: ITag = {
                name: event.target.value,
                color: this.getNextColor(),
            };
            if (newTag.name.length && !this.state.tags.find((t) => t.name === newTag.name)) {
                this.addTag(newTag);
                event.target.value = "";
            } else if (!newTag.name.length) {
                toast.warn(strings.tags.warnings.emptyName);
            } else {
                toast.warn(strings.tags.warnings.existingName);
            }
        }
        if (event.key === "Escape") {
            this.setState({
                addTags: false,
            });
        }
    }

    private getNextColor = () => {
        const tags = this.state.tags;
        if (tags.length > 0) {
            const lastColor = tags[tags.length - 1].color;
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

    private addTag = (tag: ITag) => {
        if (!this.state.tags.find((t) => t.name === tag.name)) {
            const tags = [...this.state.tags, tag];
            this.setState({
                tags,
            }, () => this.props.onChange(tags));
        }
    }
}
