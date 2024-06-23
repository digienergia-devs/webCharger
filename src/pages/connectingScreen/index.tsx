import React, { useState, useEffect } from "react";
import "./style.css";
import { startChargerConnection, chargingSessionStatus } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Language from "../language";
import { useLocation } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

export default function ConnectingScreen(props: any) {
  const [headerInfo, setHeaderInfo] = useState<string>("Insert Cable");
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let navigate = useNavigate();
  const [chargerID, setChargerID] = useState<any>(undefined);
  const [connectorID, setConnectorID] = useState<any>(undefined);
  const [sessionID, setSessionID] = useState<any>(null);
  const [language, setLanguage] = useState<string>(props.language);
  const [transactionId, setTransactionId] = useState<any>(null);
  
  useEffect(() => {
    setChargerID(queryParams.get("chargerId"));
    setConnectorID(queryParams.get("connectorId"));
    // if(localStorage.getItem("sessionId") !== null){
    //   let sessionId = localStorage.getItem("sessionId");
    //   console.log("session id found from local storage --- ", sessionId); 
    // }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    props.setChargerID(chargerID);
  }, [chargerID]);

  useEffect(() => {
    props.setConnectorID(connectorID);
  }, [connectorID]);

  const fetchData = async (transactionId: string) => {
      setTransactionId(transactionId);
      console.log("transaction id found from local storage --- ", transactionId); 
      try {
        let metervalues = await chargingSessionStatus(transactionId);
        
        if(metervalues.charge_point_status == 'Charging' || metervalues.charge_point_status == 'Finishing'){
          console.log("metervalues.charge_point_status --- ", metervalues.charge_point_status);
          navigate('/ChargingSessionScreen')
        }
      } catch (error) {
        console.error(error); 
      }
  };

    


  useEffect(() => {
    // check the chargign status on the endpoint 'chargepoint/chargerid/connectorid

    /*

    ### there will be no transaction id in location storage in future...

    let transactionId = localStorage.getItem("transactionId");
    if(transactionId !== null){
      fetchData(transactionId);
    }
    
    */
    if (chargerID?.length > 2) {
      startChargingConnection();
    }
  }, [chargerID]);

  const startChargingConnection = () => {
    if (sessionID !== null) {
      return;
    }

    const initiateChargerConnection = async () => {

      try {
        const response = await startChargerConnection(chargerID, connectorID);
        props.setTransactionId(response.transaction_id);
        console.log("response to get transaction id --- ", response);
        if(response.status == 'Charging' || response.status == 'Occupied'){ // in future this state can be 'Charging' and 'Occupied' both
          setHeaderInfo("Charger in use")
          // navigate to ask otp page
          navigate('/AskOtpPage')
        } else {
          setHeaderInfo("Insert Cable");
          if (response.status == 'Available' || response.status == 'Preparing' || response.status == 'Finishing') {
            navigate("/PaymentMethodScreen");
          } else {
            setTimeout(() => {
              initiateChargerConnection();
            }, 5000);
          }
        }
        
      } catch (error) {
        console.error(error);
      }
    };

    initiateChargerConnection();
  };

  const setLangua = (e: any) => {
    props.setLanguage(e);
    setLanguage(e);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
      <div className="flex flex-row justify-between w-full pl-5 pr-5">
        <div className="flex bg-white py-5 my-5 font-bold rounded-full w-36 justify-center text-xs" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
            25 KW
        </div>
        <div className="flex bg-white py-5 my-5 font-bold rounded-full w-36 justify-center text-xs" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
            0.25 Euro/kWh
        </div>
      </div>

      <div className="flex justify-center items-center h-1/6">
        <img src={require("../../assets/icons/Final3.png")} alt="" />
      </div>
      <div className="flex flex-col justify-center items-center h-1/6 w-full">
        <div className="flex justify-center items-center h-1/2"></div>
        <div className="flex h-1/2 justify-center items-center text-center rounded-tl-30 rounded-tr-30 bg-iparkOrange400 w-5/6 shadow-md text-white font-bold text-xs md:text-md xl:text-xl">
          <p className={headerInfo == 'Charger in use' ? "m-0 text-red-500" : "m-0"}>{headerInfo}</p>
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-tl-30 rounded-tr-30 items-center h-4/6 w-screen bg-white">
        <FadeLoader
          color="#FF6D00"
          loading={true}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <div
          className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-gray-400 text-xs md:text-md xl:text-xl"
          style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}
        >
          <span>1.Connect cable to the car</span>
          <span>2.Connect cable to the socket</span>
        </div>
        <div
          className="flex p-5 m-5 justify-center flex-col items-center w-5/6"
          style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}
        >
          <img
            src={require("../../assets/orangeThemeRedCar.png")}
            alt=""
          />
        </div>
        <div
          className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 text-center rounded-br-30 bg-gray-100 w-5/6 shadow-md text-gray-400 text-xs md:text-md xl:text-xl"
          style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}
        >

          <span>
            We will process automatically once charger cable is connected
          </span>
        </div>
      </div>
    </div>
    // <div className='main-container-connecting-screen'>
    //     <Language
    //         setLan={setLangua}
    //         language={language} />
    //     <div className='company-branding-connecting-screen'>
    //         <img src={require('../../assets/icons/icon.png')} alt="" />
    //         <p>plugKaro</p>
    //     </div>

    //     {chargerID !== undefined && chargerID !== null
    //         ?
    //         <div className='loading-container'>
    //             <FadeLoader
    //                 color="#cacfd9"
    //                 loading={loading}
    //                 aria-label="Loading Spinner"
    //                 data-testid="loader"
    //             />
    //         </div>
    //         :
    //         <div</div> id='reader'></div>
    //     }

    //     <div className='body-container-connecting-screen'>
    //         <div className='information-header-connecting-screen'>
    //             {language == 'EN' ? 'Insert cable' : 'Aseta kaapeli'}
    //         </div>
    //         <div className='information-body-connecting-screen'>
    //             {language == 'EN' ? '01. Connect cable to the car' : ' 01. Liitä kaapeli autoon'}
    //         </div>
    //         <div className='information-body-connecting-screen'>
    //             {language == 'EN' ? '02. Connect cable to the socket' : '02. Liitä kaapeli pistorasiaan'}
    //         </div>
    //         <div className='general-information-connecting-screen'>
    //             {language == 'EN' ? 'We will proceed automatically once charger cable is connected' : 'Jatkamme automaattisesti, kun latauskaapeli on liitetty'}
    //         </div>
    //     </div>
    //     <div className='footer-connecting-screen'>
    //         <img src={require('../../assets/icons/charging-station.png')} alt="" />
    //     </div>
    // </div>
    // <div className='main-container-connecting-screen'>
    //     <Language
    //         setLan={setLangua}
    //         language={language} />
    //     <div className='company-branding-connecting-screen'>
    //         <img src={require('../../assets/icons/icon.png')} alt="" />
    //         <p>plugKaro</p>
    //     </div>

    //     {chargerID !== undefined && chargerID !== null
    //         ?
    //         <div className='loading-container'>
    //             <FadeLoader
    //                 color="#cacfd9"
    //                 loading={loading}
    //                 aria-label="Loading Spinner"
    //                 data-testid="loader"
    //             />
    //         </div>
    //         :
    //         <div id='reader'></div>
    //     }

    //     <div className='body-container-connecting-screen'>
    //         <div className='information-header-connecting-screen'>
    //             {language == 'EN' ? 'Insert cable' : 'Aseta kaapeli'}
    //         </div>
    //         <div className='information-body-connecting-screen'>
    //             {language == 'EN' ? '01. Connect cable to the car' : ' 01. Liitä kaapeli autoon'}
    //         </div>
    //         <div className='information-body-connecting-screen'>
    //             {language == 'EN' ? '02. Connect cable to the socket' : '02. Liitä kaapeli pistorasiaan'}
    //         </div>
    //         <div className='general-information-connecting-screen'>
    //             {language == 'EN' ? 'We will proceed automatically once charger cable is connected' : 'Jatkamme automaattisesti, kun latauskaapeli on liitetty'}
    //         </div>
    //     </div>
    //     <div className='footer-connecting-screen'>
    //         <img src={require('../../assets/icons/charging-station.png')} alt="" />
    //     </div>
    // </div>
  );
}
