import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import withFirebaseAuth, { WrappedComponentProps } from 'react-with-firebase-auth';
import { getAuthenticationData } from "../../book/GetAuthenticationData";
import logo from '../../images/logo.svg';
import '../../sass/Button.scss';
import { AppHeader } from '../header/AppHeader';
import './Login.scss';

const Login: React.FC<LoginProps> = (props: LoginProps) => {
    const {
        user,
        signOut,
        signInWithGoogle,
    } = props;

    if (user) {
        return <div className="login">
            <AppHeader className="header-login">
                <div className="md-title md-typography-h6">
                    Air quality monitor
                </div>
            </AppHeader>
            <main className="main main-login">
                <div className="user-name">You are logged as {user.displayName}</div>
                <div className="user-avatar-container">
                    <img src={user.photoURL as string} alt={user.displayName as string} className="user-avatar" />
                </div>
                <div className="button-container">
                    <button onClick={() => props.history.push('/home')} className="md-button continue-button">Continue</button>
                </div>
                <div className="button-container">
                    <button onClick={signOut} className="md-button sign-out-button">Sign out</button>
                </div>
            </main>
        </div>;
    }

    return <div className="login">
        <AppHeader className="header-login">
            <div className="md-title md-typography-h6">
                Air quality monitor
            </div>
        </AppHeader>
        <main className="main main-login">
            <div className="logo-container">
                <img src={logo} alt="Air quality monitor" className="logo" />
            </div>
            <div className="sign-out-button-container">
                <button onClick={signInWithGoogle} className="md-button sign-out-button">Sign in with Google</button>
            </div>
        </main>
    </div>;
};

const authenticationData = getAuthenticationData();
export default withFirebaseAuth({
    providers: authenticationData.providers,
    firebaseAppAuth: authenticationData.firebaseAppAuth,
})(withRouter(Login) as any);

interface LoginProps extends WrappedComponentProps, RouteComponentProps {
}