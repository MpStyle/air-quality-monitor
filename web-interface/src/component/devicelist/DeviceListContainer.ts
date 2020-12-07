import { connect } from "react-redux";
import { Dispatch } from "redux";
import { deleteDeviceErrorActionBuilder, deleteDeviceStartActionBuilder, deleteDeviceSuccessActionBuilder } from "../../action/DeleteDeviceAction";
import { fetchDevicesErrorActionBuilder, fetchDevicesStartActionBuilder, fetchDevicesSuccessActionBuilder } from "../../action/FetchDevicesAction";
import { updateCurrentDeviceActionBuilder } from "../../action/UpdateCurrentDeviceAction";
import { userDeviceDelete } from "../../book/UserDeviceDelete";
import { userDevicesList } from "../../book/UserDevicesList";
import { userRenewAccessToken, UserRenewAccessTokenResponse } from "../../book/UserRenewAccessToken";
import { AppState } from "../../entity/AppState";
import { Device } from "../../entity/Device";
import { LoadingState } from "../../entity/LoadingState";
import { LoginToken } from "../../entity/LoginToken";
import { ServiceResponse } from "../../entity/ServiceResponse";
import { DevicesListProps, DeviceList } from "./DeviceList";

export const DeviceListContainer = connect(
    (appState: AppState): DevicesListProps => {
        return {
            token: appState.loginTokenStatus.loginToken as LoginToken,
            devices: appState.devicesData.devices,
            isLoading: appState.devicesData.deletingState === LoadingState.loading || appState.devicesData.loadingState === LoadingState.loading,
            decimalSeparator: appState.settings.decimalSeparator,
            meterUnit: appState.settings.meterUnit,
            currentDevice: appState.currentDevice
        } as DevicesListProps;
    },
    (dispatch: Dispatch): DevicesListProps => {
        return {
            fetchDevices: (token: LoginToken) => {
                dispatch(fetchDevicesStartActionBuilder());

                const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = token.expiredAt <= Date.now() ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiredAt: token.expiredAt } });

                renewToken.then(response => {
                    if (response.error) {
                        console.log("Error renew token: ", response.error);
                        dispatch(fetchDevicesErrorActionBuilder(response.error));
                        return;
                    }

                    if (!response.payload) {
                        console.log("Error renew token: ", "invalid payload");
                        return;
                    }

                    userDevicesList(response.payload.accessToken)
                        .then(response => {
                            if (response.error) {
                                console.log(response.error);
                                dispatch(fetchDevicesErrorActionBuilder(response.error));
                                return;
                            }

                            dispatch(fetchDevicesSuccessActionBuilder(response.payload?.devices || []));
                        })
                        .catch((error) => {
                            console.error(`Error while fetch devices: ${error}`);

                            dispatch(fetchDevicesErrorActionBuilder(error));
                        });
                });
            },
            onCurrentDeviceChange: (device: Device) => {
                dispatch(updateCurrentDeviceActionBuilder(device));
            },
            onDeleteClick: (token: LoginToken, deviceId: string) => {
                dispatch(deleteDeviceStartActionBuilder());

                const renewToken: Promise<ServiceResponse<UserRenewAccessTokenResponse>> = token.expiredAt <= Date.now() ? userRenewAccessToken(token.refreshToken) : Promise.resolve({ payload: { accessToken: token.accessToken, expiredAt: token.expiredAt } });

                renewToken.then(response => {
                    if (response.error) {
                        console.log("Error renew token: ", response.error);
                        dispatch(fetchDevicesErrorActionBuilder(response.error));
                        return;
                    }

                    if (!response.payload) {
                        console.log("Error renew token: ", "invalid payload");
                        return;
                    }

                    const accessToken = response.payload.accessToken;

                    userDeviceDelete(accessToken, deviceId)
                        .then(response => {
                            if (response.error) {
                                console.log(response.error);
                                dispatch(deleteDeviceErrorActionBuilder(response.error));
                                return;
                            }

                            userDevicesList(accessToken)
                                .then(response => {
                                    if (response.error) {
                                        console.log(response.error);
                                        dispatch(fetchDevicesErrorActionBuilder(response.error));
                                        return;
                                    }

                                    dispatch(fetchDevicesSuccessActionBuilder(response.payload?.devices || []));

                                    dispatch(deleteDeviceSuccessActionBuilder());
                                })
                                .catch((error) => {
                                    console.error(`Error while fetch devices: ${error}`);

                                    dispatch(fetchDevicesErrorActionBuilder(error));
                                });
                        })
                        .catch((error) => {
                            console.error(`Error while fetch devices: ${error}`);

                            dispatch(deleteDeviceErrorActionBuilder(error));
                        });
                });
            }
        } as DevicesListProps;
    }
)(DeviceList);