import { LoadingState } from "./LoadingState";

export interface SuggestionsData {
    suggestions: string[];
    loadingState: LoadingState;
}