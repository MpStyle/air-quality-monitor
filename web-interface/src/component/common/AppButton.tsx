import { makeStyles, useTheme, Button, ButtonProps } from "@material-ui/core";
import React, { FunctionComponent } from "react";

export const AppButton: FunctionComponent<ButtonProps> = (props) => {
    const theme = useTheme();
    const useStyles = makeStyles({
        appButton: {
            color: theme.palette.primary.contrastText,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
        },
    });
    const classes = useStyles();

    return <Button {...props} className={classes.appButton}>{props.children}</Button>;
};