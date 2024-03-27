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
          />} />
          <Route path='/PaymentMethodScreen' element={<PaymentMethodScreen
            language={language}
            setLanguage={changeLanguage}
          />} />
          <Route path='/ChargingSessionScreen' element={<ChargingSessionScreen
            language={language}
            setLanguage={changeLanguage}
          />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
