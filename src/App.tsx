import React, { useEffect, useState } from 'react'
import './App.css';
import SplashScreen from './pages/splashScreen';
import ConnectingScreen from './pages/connectingScreen';
import PaymentMethodScreen from './pages/paymentMethodScreen';
import ChargingSessionScreen from './pages/chargingSessionScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpScreen from './pages/otpPage';
import AskOtpPage from './pages/askOtpPage';

function App() {

  const [chargerPower, setChargerPower] = useState<string>('25');
  const [chargerRate, setChargerRate] = useState<string>('0.25');
  const [idleRate, setIdleRate] = useState<string>('0.02');

  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('EN');

  const [chargerID, setChargerID] = useState<string>();
  const [connectorID, setConnectorID] = useState<string>()

  const [transactionId, setTransactionId] = useState<string>();
  const [otp, setOtp] = useState<string>();

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
            idleRate={idleRate}
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
          />} />
          <Route path='/OtpScreen' element={<OtpScreen
            otp={otp}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            setOtp={setOtp}
           />}/>
           <Route path='/AskOtpPage' element={<AskOtpPage
            transactionId={transactionId}
            chargerPower={chargerPower}
            setChargerPower={setChargerPower}
            chargerRate={chargerRate}
            setChargerRate={setChargerRate}
            idleRate={idleRate}
            setOtp={setOtp}
            />}/>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
