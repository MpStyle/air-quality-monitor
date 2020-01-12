import { Action } from 'redux';

export const UpdateIconVisualizationTypeActionName = 'UpdateIconVisualizationTypeAction';

export interface UpdateIconVisualizationTypeAction extends Action {
    visualizationType: string;
}

export const updateIconVisualizationTypeActionBuilder = (visualizationType: string): UpdateIconVisualizationTypeAction => {
    return {
        type: UpdateIconVisualizationTypeActionName,
        visualizationType
    };
};