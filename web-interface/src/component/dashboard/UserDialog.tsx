import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider/Divider';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Typography from "@material-ui/core/Typography/Typography";
import PersonIcon from '@material-ui/icons/Person';
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InfoIcon from '@material-ui/icons/Info';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { Pages } from '../../book/Pages';
import logo from '../../images/logo.svg';
import "./UserDialog.scss";

export const UserDialog: FunctionComponent<UserDialogProps> = props => {
    const { t } = useTranslation();

    return <Dialog
        open={props.isOpen}
        scroll={'paper'}
        onClose={props.toggleDrawer(false)}
        className="user-dialog">
        <DialogTitle id="scroll-dialog-title">
            <div className="app">
                <Typography variant="h6">
                    <div className="logo-container">
                        <img src={logo} alt={t("appName")} />
                    </div>
                    &nbsp;
                    {t("appName")}
                </Typography>
            </div>
        </DialogTitle>

        <DialogContent dividers={true} className="scroll-dialog-description">

            <div className="user">
                <Typography variant="h6">
                    <PersonIcon className="icon" fontSize="large" />
                    {props.username}
                </Typography>
            </div>

            <Divider />

            <List>
                <ListItem button className="list-item" component={Link} to={Pages.DEVICE_LIST_URL}>
                    <ListItemIcon>
                        <FormatListBulletedIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("deviceList")} />
                </ListItem>
                <ListItem button className="list-item" component={Link} to={Pages.CREDITS_URL}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("credits")} />
                </ListItem>
                <ListItem button className="list-item" component={Link} to={Pages.APP_CONSOLE_URL}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("console")} />
                </ListItem>
                <ListItem button className="list-item" onClick={() => props.onLogoutClick(props.refreshToken)}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("logout")} />
                </ListItem>
            </List>

        </DialogContent>
    </Dialog>;
};

export interface UserDialogProps {
    isOpen: boolean;
    username: string;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
    onLogoutClick: (refreshToken: string) => void;
    refreshToken: string;
}