import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Pages } from '../../book/Pages';
import { NotFoundPage } from '../404/PageNotFound';
import { ChartsContainer } from '../charts/ChartsContainer';
import { RequiredAuthenticationRoute } from '../common/IsLogged';
import { AppConsoleContainer } from '../console/AppConsoleContainer';
import { Credits } from '../credits/Credits';
import { DashboardContainer } from '../dashboard/DashboardContainer';
import { DeviceListContainer } from '../devicelist/DeviceListContainer';
import { LoginContainer } from '../login/LoginContainer';
import { AppSettingsContainer } from '../settings/AppSettingsContainer';

export const Routing: FunctionComponent = () => {
    return <HashRouter>
        <Switch>
            <Route exact path="/" component={LoginContainer} />
            <Route exact path={Pages.LOGIN_URL} component={LoginContainer} />
            <Route exact path={Pages.CREDITS_URL} component={Credits} />
            <Route exact path={Pages.APP_SETTINGS_URL} component={AppSettingsContainer} />

            <RequiredAuthenticationRoute exact path={Pages.DASHBOARD_URL} component={DashboardContainer} />
            <RequiredAuthenticationRoute exact path={Pages.DEVICE_LIST_URL} component={DeviceListContainer} />
            <RequiredAuthenticationRoute path={`${Pages.CHARTS_URL}/:readingType`} component={ChartsContainer} />
            <RequiredAuthenticationRoute path={`${Pages.CHARTS_URL}/:readingType/:deviceId`} component={ChartsContainer} />
            <RequiredAuthenticationRoute exact path={`${Pages.APP_CONSOLE_URL}`} component={AppConsoleContainer} />

            <Route component={NotFoundPage} />
        </Switch>
    </HashRouter>;
};