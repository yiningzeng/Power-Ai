import React from "react";

export default function RemoteHostItem({ item, onClick, onDelete }) {
    return (
        <li className="recent-project-item">
            <a onClick={onClick}>
                <i className="fas fa-laptop"></i>
                <span className="px-2">{`${item.name}(${item.platform}) - ${item.ip}`}</span>
                <div className="float-right delete-btn" onClick={onDelete}><i className="fas fa-trash"></i></div>
            </a>
        </li>
    );
}
