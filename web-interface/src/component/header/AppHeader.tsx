import React from 'react';
import './AppHeader.scss';

export const AppHeader: React.FunctionComponent<AppHeaderProps> = (props) => {
    return <header className={`md-header md-header-fixed app-header ${props.className}`}>
        {props.children}
    </header>;
};

export interface AppHeaderProps {
    className: string | null;
}