import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Paper from '@material-ui/core/Paper/Paper';
import React, { FunctionComponent, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Pages } from '../../book/Pages';
import { NotFoundPage } from '../404/PageNotFound';
import { ChartsContainer } from '../charts/ChartsContainer';
import { IsLogged } from '../common/IsLogged';
import { AppConsoleContainer } from '../console/AppConsoleContainer';
import { Credits } from '../credits/Credits';
import { DashboardContainer } from '../dashboard/DashboardContainer';
import { DeviceListContainer } from '../devicelist/DeviceListContainer';
import { LoginContainer } from '../login/LoginContainer';
import { AppSettingsContainer } from '../settings/AppSettingsContainer';
import "./Routing.scss";

export const Routing: FunctionComponent<{}> = () => {
    const Loading: FunctionComponent<{}> = () => (<Paper elevation={2} className="loading">
        <CircularProgress />
    </Paper>);

    return <Suspense fallback={Loading}>
        <HashRouter>
            <Switch>
                <Route exact path="/" component={LoginContainer} />
                <Route exact path={Pages.LOGIN_URL} component={LoginContainer} />
                <Route exact path={Pages.CREDITS_URL} component={Credits} />
                <Route exact path={Pages.APP_SETTINGS_URL} component={AppSettingsContainer} />

                <Route exact path={Pages.DASHBOARD_URL}>
                    <IsLogged
                        loginPageUrl={Pages.LOGIN_URL}
                        sourceUrl={Pages.DASHBOARD_URL}>
                        <DashboardContainer />
                    </IsLogged>
                </Route>

                <Route exact path={Pages.DEVICE_LIST_URL}>
                    <IsLogged
                        loginPageUrl={Pages.LOGIN_URL}
                        sourceUrl={Pages.DEVICE_LIST_URL}>
                        <DeviceListContainer />
                    </IsLogged>
                </Route>

                <Route path={`${Pages.CHARTS_URL}/:readingType`}>
                    <IsLogged
                        loginPageUrl={Pages.LOGIN_URL}
                        sourceUrl={Pages.CHARTS_URL}>
                        <ChartsContainer />
                    </IsLogged>
                </Route>

                <Route exact path={`${Pages.APP_CONSOLE_URL}`}>
                    <IsLogged
                        loginPageUrl={Pages.LOGIN_URL}
                        sourceUrl={Pages.APP_CONSOLE_URL}>
                        <AppConsoleContainer />
                    </IsLogged>
                </Route>

                <Route component={NotFoundPage} />
            </Switch>
        </HashRouter>
    </Suspense>;
};