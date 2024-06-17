import React, { useEffect, useState } from 'react'
import './App.css';
import SplashScreen from './pages/splashScreen';
import ConnectingScreen from './pages/connectingScreen';
import PaymentMethodScreen from './pages/paymentMethodScreen';
import ChargingSessionScreen from './pages/chargingSessionScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('EN');

  const [chargerID, setChargerID] = useState<string>();
  const [connectorID, setConnectorID] = useState<string>()

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
          />} />
          <Route path='/PaymentMethodScreen' element={<PaymentMethodScreen
            language={language}
            setLanguage={changeLanguage}
            chargerID={chargerID}
            connectorID={connectorID}
          />} />
          <Route path='/ChargingSessionScreen' element={<ChargingSessionScreen
            language={language}
            setLanguage={changeLanguage}
            chargerID={chargerID}
            connectorID={connectorID}
          />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
