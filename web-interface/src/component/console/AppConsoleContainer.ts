import { connect } from "react-redux";
import { AppState } from "../../entity/AppState";
import { AppConsole, ConsoleProps } from "./AppConsole";

export const AppConsoleContainer = connect(
    (appState: AppState): ConsoleProps => {
        return {
            appErrors: appState.appErrors,
            dateFormat: appState.settings.dateFormat
        };
    }
)(AppConsole);