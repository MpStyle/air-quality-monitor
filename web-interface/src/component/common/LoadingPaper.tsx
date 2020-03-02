import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Paper from "@material-ui/core/Paper/Paper";
import { FunctionComponent } from "react";
import React from "react";
import "./LoadingPaper.scss";

export const LoadingPaper: FunctionComponent<LoadingPaperProps> = props => {
    return <Paper elevation={2} className="loading">
        <div className="message">{props.message}</div>
        <CircularProgress />
    </Paper>;
};

export interface LoadingPaperProps {
    message: string;
}