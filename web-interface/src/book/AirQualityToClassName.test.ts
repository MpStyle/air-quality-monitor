import { AirQuality } from "../entity/AirStatus";
import { airQualityToClassName } from "./AirQualityToClassName";

test('AirQualityToClassName', () => {
    expect(airQualityToClassName(AirQuality.Excellent)).toEqual("excellent");
    expect(airQualityToClassName(AirQuality.Good)).toEqual("good");
    expect(airQualityToClassName(AirQuality.NotGood)).toEqual("not-good");
    expect(airQualityToClassName(AirQuality.VeryBad)).toEqual("very-bad");
});