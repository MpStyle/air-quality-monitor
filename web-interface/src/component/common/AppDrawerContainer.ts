import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateTokenActionBuilder } from "../../action/UpdateTokenAction";
import { averageAirStatus } from "../../book/AverageAirStatus";
import { localStorageManager } from "../../book/LocalStorageManager";
import { sessionStorageManager } from "../../book/SessionStorageManager";
import { userRevokeRefreshToken } from "../../book/UserRevokeRefreshToken";
import { AppState } from "../../entity/AppState";
import { AppDrawer, AppDrawerProps } from "./AppDrawer";

export const AppDrawerContainer = connect(
    (appState: AppState, props: AppDrawerContainerProps) => {
        return {
            currentDevice: appState.currentDevice,
            isOpen: props.isOpen,
            average: averageAirStatus(appState.airStatus),
            refreshToken: appState.token?.refreshToken,
            toggleDrawer: props.toggleDrawer,
            username: appState.token?.username,
        };
    },
    (dispatch: Dispatch) => {
        return {
            dispatchUpdateToken: () => {
                dispatch(updateTokenActionBuilder(null));
            }
        };
    },
    (stateToProps, dispatchToProps) => {
        return {
            currentDevice: stateToProps.currentDevice,
            isOpen: stateToProps.isOpen,
            average: stateToProps.average,
            refreshToken: stateToProps.refreshToken,
            toggleDrawer: stateToProps.toggleDrawer,
            username: stateToProps.username,
            onLogoutClick: () => {
                const finallyOps = () => {
                    localStorageManager.removeAll();
                    sessionStorageManager.removeAll();

                    window.location.reload();
                };

                userRevokeRefreshToken(stateToProps.refreshToken as string)
                    .then(response => {
                        if (response.error) {
                            console.error(response.error);
                            finallyOps();
                            return;
                        }

                        dispatchToProps.dispatchUpdateToken();
                        finallyOps();
                    })
                    .catch(err => {
                        console.error(err);
                        finallyOps();
                    });
            }
        } as AppDrawerProps;
    }
)(AppDrawer);

export interface AppDrawerContainerProps {
    isOpen: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}