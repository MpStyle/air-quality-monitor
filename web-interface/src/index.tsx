import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Colors } from './book/Colors';
import { APP_CONSOLE_URL, APP_SETTINGS_URL, CHARTS_URL, CREDITS_URL, DASHBOARD_URL, DEVICE_LIST_URL, LOGIN_URL } from './book/Pages';
import { NotFoundPage } from './component/404/PageNotFound';
import { ChartsContainer } from './component/charts/ChartsContainer';
import { IsLogged } from './component/common/IsLogged';
import { AppConsoleContainer } from './component/console/AppConsoleContainer';
import { Credits } from './component/credits/Credits';
import { DashboardContainer } from './component/dashboard/DashboardContainer';
import { DeviceListContainer } from './component/devicelist/DeviceListContainer';
import { LoginContainer } from './component/login/LoginContainer';
import { AppSettingsContainer } from './component/settings/AppSettingsContainer';
import './index.scss';
import { appStore } from './store/AppStore';

const theme = createMuiTheme({
    palette: {
        primary: { main: Colors.PRIMARY, contrastText: Colors.CONTRAST_TEXT },
        secondary: { main: Colors.SECONDARY },
    }
});

ReactDOM.render(
    <Provider store={appStore}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>
                <Switch>
                    <Route exact path={CREDITS_URL} component={Credits} />
                    <Route exact path={DASHBOARD_URL}>
                        <IsLogged
                            loginPageUrl={LOGIN_URL}
                            sourceUrl={DASHBOARD_URL}>
                            <DashboardContainer />
                        </IsLogged>
                    </Route>
                    <Route exact path={DEVICE_LIST_URL}>
                        <IsLogged
                            loginPageUrl={LOGIN_URL}
                            sourceUrl={DEVICE_LIST_URL}>
                            <DeviceListContainer />
                        </IsLogged>
                    </Route>
                    <Route exact path="/" component={LoginContainer} />
                    <Route path={LOGIN_URL} component={LoginContainer} />
                    <Route path={APP_SETTINGS_URL} component={AppSettingsContainer} />
                    <Route path={`${CHARTS_URL}/:readingType`} component={ChartsContainer} />
                    <Route path={`${APP_CONSOLE_URL}`} component={AppConsoleContainer} />
                    <Route component={NotFoundPage} />
                </Switch>
            </HashRouter>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
