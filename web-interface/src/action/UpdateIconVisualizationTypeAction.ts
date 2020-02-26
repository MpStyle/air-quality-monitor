import { Action } from 'redux';
import { IconVisualizationType } from '../book/IconVisualizationType';

export const UpdateIconVisualizationTypeActionName = 'UpdateIconVisualizationTypeAction';

export interface UpdateIconVisualizationTypeAction extends Action {
    visualizationType: IconVisualizationType;
}

export const updateIconVisualizationTypeActionBuilder = (visualizationType: IconVisualizationType): UpdateIconVisualizationTypeAction => {
    return {
        type: UpdateIconVisualizationTypeActionName,
        visualizationType
    };
};