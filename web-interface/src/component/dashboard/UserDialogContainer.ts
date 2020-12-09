import { connect } from "react-redux";
import { Dispatch } from "redux";
import { fetchLoginTokenSuccessActionBuilder } from "../../action/FetchLoginTokenAction";
import { sessionStorageManager } from "../../book/SessionStorageManager";
import { userRevokeRefreshToken } from "../../book/UserRevokeRefreshToken";
import { AppState } from "../../entity/AppState";
import { UserDialog, UserDialogProps } from "./UserDialog";

export const UserDialogContainer = connect(
    (appState: AppState, props: UserDialogContainerProps): UserDialogProps => {
        return {
            isOpen: props.isOpen,
            toggleDrawer: props.toggleDrawer,
            refreshToken: appState.loginTokenStatus.loginToken?.refreshToken,
            username: appState.loginTokenStatus.loginToken?.username
        } as UserDialogProps;
    },
    (dispatch: Dispatch): UserDialogProps => {
        return {
            onLogoutClick: (refreshToken: string) => {
                const finallyOps = () => {
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
        } as UserDialogProps;
    }
)(UserDialog);

export interface UserDialogContainerProps {
    isOpen: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}