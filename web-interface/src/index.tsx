import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { APP_SETTINGS_URL, CREDITS_URL, DASHBOARD_URL, LOGIN_URL } from './book/Pages';
import { AppSettingsContainer } from './component/AppSettingsContainer';
import { Credits } from './component/Credits';
import { DashboardContainer } from './component/DashboardContainer';
import { IsLogged } from './component/IsLogged';
import { LoginContainer } from './component/LoginContainer';
import './index.scss';
import { appStore } from './store/AppStore';

ReactDOM.render(
    <Provider store={appStore}>
        <CssBaseline />
        <HashRouter>
            <Route exact path={CREDITS_URL} component={Credits} />
            <Route exact path={DASHBOARD_URL}>
                <IsLogged
                    loginPageUrl={LOGIN_URL}
                    sourceUrl={DASHBOARD_URL}>
                    <DashboardContainer />
                </IsLogged>
            </Route>
            <Route exact path="/" component={LoginContainer} />
            <Route path={LOGIN_URL} component={LoginContainer} />
            <Route path={APP_SETTINGS_URL} component={AppSettingsContainer} />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);
