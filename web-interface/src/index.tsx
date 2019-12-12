import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { updateSecretKeyActionBuilder } from './action/UpdateSecretKeyAction';
import { authentication } from './book/Authentication';
import { CREDITS_URL, DASHBOARD_URL, LOGIN_URL } from './book/Pages';
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
                    resetSecretKey={() => { appStore.dispatch(updateSecretKeyActionBuilder(null)); }}
                    loginPageUrl={LOGIN_URL}
                    sourceUrl={DASHBOARD_URL}
                    authentication={authentication}>
                    <DashboardContainer />
                </IsLogged>
            </Route>
            <Route exact path="/" component={LoginContainer} />
            <Route path={LOGIN_URL} component={LoginContainer} />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);
