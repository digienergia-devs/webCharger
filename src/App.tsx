import React, { useEffect, useState } from 'react'
import './App.css';
import SplashScreen from './pages/splashScreen';
import ConnectingScreen from './pages/connectingScreen';
import PaymentMethodScreen from './pages/paymentMethodScreen';
import ChargingSessionScreen from './pages/chargingSessionScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpScreen from './pages/otpPage';
import AskOtpPage from './pages/askOtpPage';
import { useTranslation } from 'react-i18next';


function App() {

  const [chargerPower, setChargerPower] = useState<string>('');
  const [chargerRate, setChargerRate] = useState<string>('');
  const [idleRate, setIdleRate] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');

  const [chargerID, setChargerID] = useState<string>();
  const [connectorID, setConnectorID] = useState<string>()

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
            setConnectorID={setConnectorID}
            setChargerID={setChargerID}
            setTransactionId={setTransactionId}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            setIdleRate={setIdleRate}
            
            idleRate={idleRate}
            handleChangeLanguage={handleChangeLanguage}
          />} />
          <Route path='/PaymentMethodScreen' element={<PaymentMethodScreen
            language={language}
            setLanguage={changeLanguage}
            chargerID={chargerID}
            connectorID={connectorID}
            setOtp={setOtp}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            handleChangeLanguage={handleChangeLanguage}
            idleRate={idleRate}
          />} />
          <Route path='/ChargingSessionScreen' element={<ChargingSessionScreen
            language={language}
            setLanguage={changeLanguage}
            chargerID={chargerID}
            connectorID={connectorID}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            idleRate={idleRate}
            otp={otp}
            handleChangeLanguage={handleChangeLanguage}
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
            />}/>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
