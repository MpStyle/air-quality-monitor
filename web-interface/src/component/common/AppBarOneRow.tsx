import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import * as React from 'react';
import { FunctionComponent } from 'react';
import "./AppBarOneRow.scss";

export const AppBarOneRow: FunctionComponent<{}> = (props) => {
    return <AppBar position="static" className="app-bar-one-row">
        <Toolbar>
            {props.children}
        </Toolbar>
    </AppBar>;
};