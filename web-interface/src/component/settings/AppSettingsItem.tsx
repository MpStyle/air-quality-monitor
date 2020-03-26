import Typography from "@material-ui/core/Typography/Typography";
import React, { FunctionComponent } from "react";
import "./AppSettingsItem.scss";

export const AppSettingsItem: FunctionComponent<AppSettingsItemProps> = props => {
    return <div className="settings">
        <div className="labels">
            <Typography variant="subtitle1">{props.title}</Typography>
            {props.subtitle && <Typography variant="subtitle2" className="secondary-label">{props.subtitle}</Typography>}
        </div>
        <div className="configuration">
            {props.children}
        </div>
    </div>;
};

export interface AppSettingsItemProps {
    title: string;
    subtitle?: string;
}