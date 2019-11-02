import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Credits } from './component/credits/Credits';
import { HomeContainer } from './component/home/HomeContainer';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { appStore } from './store/AppStore';

ReactDOM.render(
    <Provider store={appStore}>
        <HashRouter>
            <Route path="/credits" component={Credits} />
            <Route exact path="/" component={HomeContainer} />
        </HashRouter>
    </Provider>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
