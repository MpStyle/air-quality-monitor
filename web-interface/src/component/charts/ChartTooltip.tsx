import React from "react";
import { useTranslation } from "react-i18next";
import { TooltipProps } from "recharts";
import { Granularity } from "../../entity/Granularity";

export const ChartTooltip = (props: ChartTooltipProps & TooltipProps) => {
    const { t } = useTranslation();

    if (props.active && !!props.payload) {
        let label = '';
        switch (props.payload[0].payload.granularity) {
            case Granularity.daily:
                label = t("hour");
                break;
            case Granularity.monthly:
                label = t('day');
                break;
            case Granularity.yearly:
                label = t('month');
                break;
        }

        return <div className="chart-tooltip">
            <div className="label"><strong>{props.readingsType}</strong>: {props.payload[0].payload.formattedAverage}{props.readingUnitMeter}</div>
            <div><strong>{t("readingDate")}</strong>: {props.payload[0].payload.datetime}</div>
            <div><strong>{t("readingsPer")} {label}</strong>: {props.payload[0].payload.counter}</div>
        </div>;
    }

    return null;
};

export interface ChartTooltipProps {
    readingsType: string;
    readingUnitMeter: string;
}