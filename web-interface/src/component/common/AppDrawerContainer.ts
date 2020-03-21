import { connect } from "react-redux";
import { Dispatch } from "redux";
import { fetchLoginTokenSuccessActionBuilder } from "../../action/FetchLoginTokenAction";
import { localStorageManager } from "../../book/LocalStorageManager";
import { sessionStorageManager } from "../../book/SessionStorageManager";
import { userRevokeRefreshToken } from "../../book/UserRevokeRefreshToken";
import { AppState } from "../../entity/AppState";
import { AppDrawer, AppDrawerProps } from "./AppDrawer";

export const AppDrawerContainer = connect(
    (appState: AppState, props: AppDrawerContainerProps): AppDrawerProps => {
        return {
            currentDevice: appState.currentDevice,
            isOpen: props.isOpen,
            average: appState.airStatusAverage,
            toggleDrawer: props.toggleDrawer,
            refreshToken: appState.loginTokenStatus.loginToken?.refreshToken,
            username: appState.loginTokenStatus.loginToken?.username
        } as AppDrawerProps;
    },
    (dispatch: Dispatch): AppDrawerProps => {
        return {
            onLogoutClick: (refreshToken: string) => {
                const finallyOps = () => {
                    localStorageManager.removeAll();
                    sessionStorageManager.removeAll();

                    window.location.href = "/";
                };

                userRevokeRefreshToken(refreshToken as string)
                    .then(response => {
                        if (response.error) {
                            console.error(response.error);
                            return;
                        }

                        dispatch(fetchLoginTokenSuccessActionBuilder(null));
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(() => {
                        finallyOps();
                    });
            },
        } as AppDrawerProps;
    }
)(AppDrawer);

export interface AppDrawerContainerProps {
    isOpen: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}