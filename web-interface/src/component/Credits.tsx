import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import React, { FunctionComponent } from 'react';

export const Credits: FunctionComponent<{}> = () => {
    return <div>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    Credits
                </Typography>
            </Toolbar>
        </AppBar>
    </div>;
};