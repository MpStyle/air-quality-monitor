import { connect } from "react-redux";
import { AppState } from "../../entity/AppState";
import { AppConsole, ConsoleProps } from "./AppConsole";

export const AppConsoleContainer = connect(
    (state: AppState): ConsoleProps => {
        return { appErrors: state.appErrors };
    }
)(AppConsole);