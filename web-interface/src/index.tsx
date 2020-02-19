import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Colors } from './book/Colors';
import { Pages } from './book/Pages';
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
                    <Route exact path={Pages.CREDITS_URL} component={Credits} />
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
                    <Route exact path="/" component={LoginContainer} />
                    <Route path={Pages.LOGIN_URL} component={LoginContainer} />
                    <Route path={Pages.APP_SETTINGS_URL} component={AppSettingsContainer} />
                    <Route path={`${Pages.CHARTS_URL}/:readingType`} component={ChartsContainer} />
                    <Route path={`${Pages.APP_CONSOLE_URL}`} component={AppConsoleContainer} />
                    <Route component={NotFoundPage} />
                </Switch>
            </HashRouter>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
