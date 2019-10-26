import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { airQualityDataPoller } from './book/AirQualityDataPoller';
import { getDevice } from './book/GetDevices';
import { HomeContainer } from './component/home/HomeContainer';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { appStore } from './store/AppStore';

ReactDOM.render(<Provider store={appStore}><HomeContainer /></Provider>, document.getElementById('root'));
airQualityDataPoller(appStore);
getDevice(appStore.dispatch);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
