import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import React, { FunctionComponent } from "react";
import { Pages } from "../../book/Pages";
import "./PageNotFound.scss";

export const NotFoundPage: FunctionComponent<{}> = () => {
    return <div className="not-found-page">
        <AppBar position="static" className="app-bar">
            <Toolbar>
                <Typography variant="h6">
                    Air quality monitor
                </Typography>
            </Toolbar>
        </AppBar>
        <Paper className="content">
            <Typography variant="h1" className="title">
                Page not found
            </Typography>

            <Button href={`#${Pages.DASHBOARD_URL}`} className="to-homepage" variant="contained">Go to home page</Button>
        </Paper>

    </div>;
};