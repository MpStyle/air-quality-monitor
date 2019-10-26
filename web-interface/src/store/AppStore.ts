import { createStore, Store } from "redux";
import { AppState } from "../entity/AppState";
import { appReducer } from "../reducer/AppReducer";
import { initialAppState } from "./InitialAppState";

export const appStore: Store<AppState> = createStore(
    appReducer,
    initialAppState as any,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);