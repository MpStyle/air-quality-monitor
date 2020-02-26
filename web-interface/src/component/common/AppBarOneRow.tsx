import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import * as React from 'react';
import { FunctionComponent } from 'react';

export const AppBarOneRow: FunctionComponent<{}> = (props) => {
    const theme = useTheme();
    const useStyles = makeStyles({
        appBarOneRow: {
            color: theme.palette.primary.contrastText,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
        },
    });
    const classes = useStyles();

    return <AppBar position="fixed" className={classes.appBarOneRow}>
        <Toolbar>
            {props.children}
        </Toolbar>
    </AppBar>;
};