import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HomeContainer } from './component/home/HomeContainer';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { appStore } from './store/AppStore';

ReactDOM.render(<Provider store={appStore}><HomeContainer /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
