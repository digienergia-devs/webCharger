import React, { useEffect, useState } from 'react'
import './App.css';
import SplashScreen from './pages/splashScreen';
import ConnectingScreen from './pages/connectingScreen';
import PaymentMethodScreen from './pages/paymentMethodScreen';
import ChargingSessionScreen from './pages/chargingSessionScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpScreen from './pages/otpPage';
import AskOtpPage from './pages/askOtpPage';
import OccupiedPage from './pages/occupiedPage';
import { useTranslation } from 'react-i18next';


function App() {

  const [chargerPower, setChargerPower] = useState<string>('');
  const [chargerRate, setChargerRate] = useState<string>('');
  const [idleRate, setIdleRate] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('fi');

  const [chargerID, setChargerID] = useState<string>();
  const [connectorIDFromUrl, setConnectorIDFromUrl] = useState<string>()

  const [connectorIDFromChargePointEndpoint, setConnectorIDFromChargePointEndpoint] = useState<string>()

  const [transactionId, setTransactionId] = useState<string>();
  const [otp, setOtp] = useState<string>();
  
  const [t, i18n] = useTranslation("global");

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang)
  }

  const changeLanguage = (e: any) => {
    setLanguage(e);
  }

  return (
    <div className='root-container'>
      <Router>
        <Routes>
          <Route path='/' element={<SplashScreen
          />} />
          <Route path='/:number' element={<ConnectingScreen
            language={language}
            setLanguage={changeLanguage}
            setConnectorID={setConnectorIDFromUrl}
            setChargerID={setChargerID}
            setTransactionId={setTransactionId}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            setIdleRate={setIdleRate}
            setConnectorIDFromChargePointEndpoint={setConnectorIDFromChargePointEndpoint}
            idleRate={idleRate}
            handleChangeLanguage={handleChangeLanguage}
          />} />
          <Route path='/PaymentMethodScreen' element={<PaymentMethodScreen
            language={language}
            setLanguage={changeLanguage}
            chargerID={chargerID}
            connectorID={connectorIDFromUrl}
            setOtp={setOtp}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            handleChangeLanguage={handleChangeLanguage}
            idleRate={idleRate}
            setTransactionId={setTransactionId}
            connectorIDFromChargePointEndpoint={connectorIDFromChargePointEndpoint}
          />} />
          <Route path='/ChargingSessionScreen' element={<ChargingSessionScreen
          transactionId={transactionId}
            language={language}
            setLanguage={changeLanguage}
            chargerID={chargerID}
            connectorID={connectorIDFromUrl}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            idleRate={idleRate}
            otp={otp}
            handleChangeLanguage={handleChangeLanguage}
            connectorIDFromChargePointEndpoint={connectorIDFromChargePointEndpoint}
          />} />
          <Route path='/OtpScreen' element={<OtpScreen
          language={language}
            otp={otp}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            setOtp={setOtp}
            idleRate={idleRate}
            handleChangeLanguage={handleChangeLanguage}
            connectorID={connectorIDFromUrl}
            connectorIDFromChargePointEndpoint={connectorIDFromChargePointEndpoint}
           />}/>
           <Route path='/AskOtpPage' element={<AskOtpPage
           language={language}
            transactionId={transactionId}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            idleRate={idleRate}
            setOtp={setOtp}
            handleChangeLanguage={handleChangeLanguage}
            connectorID={connectorIDFromUrl}
            chargerID={chargerID}
            connectorIDFromChargePointEndpoint={connectorIDFromChargePointEndpoint}
            />}/>
            <Route path='/OccupiedPage' element={<OccupiedPage
            language={language}
            transactionId={transactionId}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            idleRate={idleRate}
            setOtp={setOtp}
            handleChangeLanguage={handleChangeLanguage}
            connectorID={connectorIDFromUrl}
            chargerID={chargerID}
            connectorIDFromChargePointEndpoint={connectorIDFromChargePointEndpoint}
            />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
