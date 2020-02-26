import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from "react-i18next";
import { Provider } from 'react-redux';
import { Colors } from './book/Colors';
import i18n from './book/i18n';
import { Routing } from './component/routing/Routings';
import './index.scss';
import { appStore } from './store/AppStore';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: Colors.PRIMARY,
            contrastText: Colors.CONTRAST_TEXT
        },
        secondary: {
            main: Colors.SECONDARY
        },
        text: {
            primary: Colors.COLOR_TEXT_PRIMARY,
            secondary: Colors.COLOR_TEXT_SECONDARY
        }
    }
});

ReactDOM.render(
    <Provider store={appStore}>
        <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
                <CssBaseline />
                <Routing />
            </I18nextProvider>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
