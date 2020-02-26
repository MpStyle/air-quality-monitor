import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Colors } from './book/Colors';
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
            <CssBaseline />
            <Routing />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
