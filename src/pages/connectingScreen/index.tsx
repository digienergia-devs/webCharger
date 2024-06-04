import React, { useState, useEffect } from "react";
import "./style.css";
import { startChargerConnection } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Language from "../language";
import { useLocation } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

export default function ConnectingScreen(props: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let navigate = useNavigate();
  const [chargerID, setChargerID] =
    useState<any>(
      undefined
    );
  const [sessionID, setSessionID] = useState<any>(null);
  const [language, setLanguage] = useState<string>(props.language);
  useEffect(() => {
    setChargerID(queryParams.get("chargerId"));
  }, []);

  useEffect(() => {
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
        const response = await startChargerConnection("CP_1");
        console.log("response --- ", response);
        if (response.session_id && !sessionID) {
          setSessionID(response.sessionID);
          sessionStorage.setItem("sessionId", response.sessionID);
          navigate("/PaymentMethodScreen");
          console.log("session ID available --- ")
        } else {
          setTimeout(() => {
            initiateChargerConnection();
          }, 5000);
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
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-green-600">

      <div className="flex justify-center items-center h-2/´6">
        <img src={require("../../assets/icons/Final3.png")} alt="" />
      </div>
      <div className="flex flex-col justify-center items-center h-1/6 w-full">
        <div className="flex justify-center items-center h-1/2"></div>
        <div className="flex h-1/2 justify-center items-center text-center rounded-tl-30 rounded-tr-30 bg-green-500 w-5/6 shadow-md text-white font-bold text-md md:text-xl xl:text-2xl">
          <p className="m-0">Insert Cable</p>
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-tl-30 rounded-tr-30 items-center h-4/6 w-screen bg-white">
        <FadeLoader
          color="#38A169"
          loading={true}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <div
          className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-gray-400 text-sm md:text-xl xl:text-2xl"
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
            src={require("../../assets/icons/carAtChargingPole.png")}
            alt=""
          />
        </div>
        <div
          className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 text-center rounded-br-30 bg-gray-100 w-5/6 shadow-md text-gray-400 text-sm md:text-xl xl:text-2xl"
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
