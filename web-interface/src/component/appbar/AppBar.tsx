import React from 'react';
import "./AppBar.scss";

export const AppBar: React.FC<AppBarProps> = (props: AppBarProps) => {
    return <div className="appbar card-4">
        <div className="item">Info</div>
        <div className="item">Settings</div>
    </div>;
};

export interface AppBarProps { }