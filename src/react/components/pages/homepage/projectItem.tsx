import React from "react";

export default function ProjectItem({ item, onClick, onDelete, onOpenDir }) {
    return (
        <li className="recent-project-item">
            <a onClick={onClick}>
                <i className="fas fa-project-diagram"></i>
                <span className="px-2">{item.name}</span>
                <div className="float-right" style={{display: "flex"}}>
                    <div onClick={onOpenDir}><i className="fas fa-folder-open"></i></div>
                    <div style={{marginLeft: 10}} onClick={onDelete}><i className="fas fa-trash"></i></div>
                </div>
            </a>
        </li>
    );
}
