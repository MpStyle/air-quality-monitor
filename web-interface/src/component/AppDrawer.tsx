import Drawer from "@material-ui/core/Drawer/Drawer";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import React, { FunctionComponent } from "react";

export const AppDrawer: FunctionComponent<AppDrawerProps> = (props) => {
    return <Drawer open={props.isOpen} onClose={props.toggleDrawer(false)}>
        <div
            role="presentation"
            onClick={props.toggleDrawer(false)}
            onKeyDown={props.toggleDrawer(false)}
        >
            <List>
                <ListItem button>
                    <ListItemText primary="ciao" />
                </ListItem>
            </List>
        </div>
    </Drawer>;
};

export interface AppDrawerProps {
    isOpen: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}