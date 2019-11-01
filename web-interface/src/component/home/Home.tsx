import React, { useEffect } from 'react';
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import { airQualityToClassName } from '../../book/AirQualityToClassName';
import { averageAirStatus } from '../../book/AverageAirStatus';
import { AirStatus } from '../../entity/AirStatus';
import { Device } from '../../entity/Device';
import { MeterUnit } from '../../entity/MeterUnit';
import co2 from '../../images/co2.svg';
import humidity from '../../images/humidity.svg';
import noise from '../../images/noise.svg';
import pressure from '../../images/pressure.svg';
import temperature from '../../images/temperature.svg';
import tvoc from '../../images/tvoc.svg';
import { DataRow } from '../datarow/DataRow';
import { Header } from '../header/Header';
import { AirQualityData } from './../../entity/AirQualityData';
import './Home.scss';

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => props.loadDevices(), []);

  return (
    <div className={`home ${airQualityToClassName(averageAirStatus(props.airStatus))}`}>
      <Header
        airStatus={props.airStatus}
        currentDeviceId={props.currentDeviceId}
        devices={props.devices}
        suggestions={props.suggestions}
        onCurrentDeviceIdChange={props.onCurrentDeviceIdChange}
      />
      <main className="main home-main">
        <DataRow
          title="Temperature"
          icon={temperature}
          value={props.airQualityData.temperature}
          meter={props.meterUnit.temperature}
          quality={props.airStatus.temperature} />

        <DataRow
          title="Humidity"
          icon={humidity}
          value={props.airQualityData.humidity}
          meter={props.meterUnit.humidity}
          quality={props.airStatus.humidity} />

        <DataRow
          title="CO2"
          icon={co2}
          value={props.airQualityData.co2}
          meter={props.meterUnit.co2}
          quality={props.airStatus.co2} />

        <DataRow
          title="Noise"
          icon={noise}
          value={props.airQualityData.noise}
          meter={props.meterUnit.noise}
          quality={props.airStatus.noise} />

        <DataRow
          title="Pressure"
          icon={pressure}
          value={props.airQualityData.pressure}
          meter={props.meterUnit.pressure}
          quality={props.airStatus.pressure} />

        <DataRow
          title="TVOC"
          icon={tvoc}
          value={props.airQualityData.tvoc}
          meter={props.meterUnit.tvoc}
          quality={props.airStatus.tvoc} />

      </main>
      {/* <footer>
        <AppBar />
      </footer> */}
    </div>
  );
};

export default Home;

export interface HomeProps {
  airQualityData: AirQualityData;
  airStatus: AirStatus;
  meterUnit: MeterUnit;
  devices: Device[];
  currentDeviceId: string | null;
  onCurrentDeviceIdChange: (deviceId: string) => void;
  loadDevices: () => void;
  suggestions: string[];
}