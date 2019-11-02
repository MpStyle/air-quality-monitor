import React from 'react';
import { Link } from 'react-router-dom';
import back from '../../images/left-arrow.svg';
import '../../sass/Card.scss';
import '../../sass/Header.scss';
import '../../sass/Typography.scss';
import './Credits.scss';

export const Credits: React.FC = () => {
    return <div className={`credits`}>
        <header className="md-header md-header-fixed credits-header">
            <div className="md-icon">
                <Link to="/">
                    <img src={back} alt="Return to home" />
                </Link>
            </div>
            <div className="md-title md-typography-h6">
                Credits
            </div>
        </header>
        <main className="md-main credits-main card">
            <ul>
                <li>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/hirschwolf" title="hirschwolf">hirschwolf</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/chanut" title="Chanut">Chanut</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li>Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
                <li><a href="https://it.reactjs.org/">React</a></li>
                <li><a href="https://redux.js.org/">Redux</a></li>
                <li><a href="https://github.com/kelektiv/node-uuid">uuid</a></li>
                <li><a href="https://github.com/typicode/json-server">JSON Server</a></li>
                <li><a href="https://palantir.github.io/tslint/">TSLint</a></li>
                <li><a href="https://sass-lang.com/">Sass</a></li>
                <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
                <li><a href="https://reacttraining.com/react-router/web/guides/quick-start">React Router</a></li>
            </ul>
        </main>
    </div>;
};