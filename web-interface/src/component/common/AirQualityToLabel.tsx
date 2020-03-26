import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { AirQuality } from "../../entity/AirStatus";

export const AirQualityToLabel: FunctionComponent<AirQualityToLabelProps> = props => {
    const { t } = useTranslation();

    switch (props.airQuality) {
        case AirQuality.Excellent: return <React.Fragment>{t("excellent")}</React.Fragment>;
        case AirQuality.Good: return <React.Fragment>{t("good")}</React.Fragment>;
        case AirQuality.NotGood: return <React.Fragment>{t("notGood")}</React.Fragment>;
        case AirQuality.VeryBad: return <React.Fragment>{t("veryBad")}</React.Fragment>;
        default: return <React.Fragment>...</React.Fragment>;
    }
};

export interface AirQualityToLabelProps {
    airQuality: AirQuality;
}