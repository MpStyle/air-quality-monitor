import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { DateTimeUtils } from "../../book/DateTimeUtils";
import { Pages } from "../../book/Pages";
import { AppError } from "../../entity/AppError";
import { AppBarOneRow } from "../common/AppBarOneRow";
import "./AppConsole.scss";

export const AppConsole: FunctionComponent<ConsoleProps> = (props) => {
    const e = !!props.appErrors && !!props.appErrors.length;

    return <div className="app-console">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={Pages.DASHBOARD_URL} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                Console
            </Typography>
        </AppBarOneRow>
        <main>
            <Paper elevation={2} className="app-console-container">
                <Typography variant="h6">Errors</Typography>
                {!e && <div>No errors</div>}
                {e && <ul>
                    {props.appErrors.map(err => <li>
                        <strong>Error code</strong>: {err.code} <br />
                        <strong>Error description</strong>: {err.description} <br />
                        <strong>Date time</strong>: {DateTimeUtils.epochToFormatedDate(err.dateTime, "YYYY-MM-DD HH:mm:ss")}
                    </li>)}
                </ul>}
            </Paper>
        </main>
    </div>;
};

export interface ConsoleProps {
    appErrors: AppError[];
}