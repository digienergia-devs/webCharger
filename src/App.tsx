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
          <Route path='/ConnectingScreen' element={<ConnectingScreen
            language={language}
            setLanguage={changeLanguage}
            setConnectorID={setConnectorID}
            setChargerID={setChargerID}
            setTransactionId={setTransactionId}
          />} />
          <Route path='/PaymentMethodScreen' element={<PaymentMethodScreen
            language={language}
            setLanguage={changeLanguage}
            chargerID={chargerID}
            connectorID={connectorID}
            setOtp={setOtp}
          />} />
          <Route path='/ChargingSessionScreen' element={<ChargingSessionScreen
            language={language}
            setLanguage={changeLanguage}
            chargerID={chargerID}
            connectorID={connectorID}
          />} />
          <Route path='/OtpScreen' element={<OtpScreen
            otp={otp}
           />}/>
           <Route path='/AskOtpPage' element={<AskOtpPage
            transactionId={transactionId}
            />}/>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
