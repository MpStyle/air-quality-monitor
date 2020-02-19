import IconButton from "@material-ui/core/IconButton/IconButton";
import MUILink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from "@material-ui/core/Typography/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import React, { FunctionComponent } from 'react';
import { Link } from "react-router-dom";
import { Pages } from "../../book/Pages";
import { AppBarOneRow } from '../common/AppBarOneRow';
import "./Credits.scss";

export const Credits: FunctionComponent<CreditsProps> = (_props) => {
    return <div className="credits">
        <AppBarOneRow>
            <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={Pages.DASHBOARD_URL} className="back-button">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">
                Credits
            </Typography>
        </AppBarOneRow>
        <main>
            <Paper elevation={2} className="links-container">
                <Typography variant="h6">Icons</Typography>
                <ul>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/hirschwolf" title="hirschwolf">hirschwolf</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/chanut" title="Chanut">Chanut</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/becris" title="Becris">Becris</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                    <li>Icons made by <MUILink href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</MUILink> from <MUILink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</MUILink></li>
                </ul>

                <Typography variant="h6">Packages</Typography>
                <ul>
                    <li><MUILink href="https://it.reactjs.org/">React</MUILink></li>
                    <li><MUILink href="https://redux.js.org/">Redux</MUILink></li>
                    <li><MUILink href="https://github.com/kelektiv/node-uuid">uuid</MUILink></li>
                    <li><MUILink href="https://palantir.github.io/tslint/">TSLint</MUILink></li>
                    <li><MUILink href="https://sass-lang.com/">Sass</MUILink></li>
                    <li><MUILink href="https://www.typescriptlang.org/">Typescript</MUILink></li>
                    <li><MUILink href="https://reacttraining.com/react-router/web/guides/quick-start">React Router</MUILink></li>
                </ul>
            </Paper>
        </main>
    </div>;
};

export interface CreditsProps {
}