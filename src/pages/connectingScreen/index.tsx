import React, { useState, useEffect } from "react";
import "./style.css";
import { startChargerConnection, chargingSessionStatus, getChargerDetails } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Language from "../language";
import { useLocation } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import Lottie from "lottie-react";
import connectCable from "../../assets/connectCable.json";
import { useTranslation } from "react-i18next";

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
  const [t, i18n] = useTranslation('global');
  
  useEffect(() => {
    let url = window.location.href;
    let alias: any = url.split("/").pop();
    getChargePointDetails(alias);
  }, []);

  const getChargePointDetails = async (chargerID: string | null) => {
    let response: any;
    try {
      response = await getChargerDetails(chargerID);

      setChargerID(response.charge_point_id);
      setConnectorID(response.connector_id);
      // props.setChargerPower('25');
      // props.setChargerRate('0.02');

      // get the charger power and charging rate from using the backend --- Inform to Argon
    } catch (error) {
      console.error(error);
    }
  }

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
          navigate('/ChargingSessionScreen')
        }
      } catch (error) {
        console.error(error); 
      }
  };

  useEffect(() => {
    if (chargerID?.length > 2) {
      startChargingConnection();
    }
  }, [chargerID]);

  const startChargingConnection = () => {
    if (sessionID !== null) {
      return;
    }
    // set loading spinner true
    setLoading(true);
    const initiateChargerConnection = async () => {
      try {
        const response = await startChargerConnection(chargerID, connectorID);
        props.setTransactionId(response.transaction_id);
        if(response.status == 'Charging' || response.status == 'Occupied'){ // in future this state can be 'Charging' and 'Occupied' both
          setHeaderInfo("Charger in use")
          navigate('/AskOtpPage')
        } else {
          setHeaderInfo("Insert Cable");
          if (response.status == 'Preparing' || response.status == 'Finishing') {
            // set loading spinner false
            setLoading(false);
            navigate("/PaymentMethodScreen");
          } else {
            setTimeout(() => {
              // set loading spinner false
              setLoading(false);
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

  if(loading){
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
        <div className="flex flex-row justify-between w-full pl-5 pr-5">
                <div className="flex bg-white py-5 my-5 font-bold rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 w-full justify-between text-xs pl-10 pr-10" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
                    <div>
                    {props.chargerPower} KW
                    <br />
                    <div className='flex text-gray-400 font-light'>
                    {/* Power */}
                    {t("generalDetails.power")}
                    </div>
                    </div>
                    <div>
                    {props.chargerRate} €/kWh
                    <br />
                    <div className='flex text-gray-400 font-light'>
                    {/* Unit price */}
                    {t("generalDetails.unitPrice")}
                    </div>
                    </div>
                    <div>
                    {props.idleRate} €/min
                    <br />
                    <div className='flex text-gray-400 font-light'>
                    {/* Idle fee */}
                    {t("generalDetails.idleFee")}
                    </div>
                    </div>
                </div>
            </div>

        <div className="flex justify-center items-center h-1/6">
          <img src={require("../../assets/icons/Final3.png")} alt="" />
        </div>
        <div className="flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center h-5/6 w-screen bg-white pt-5">
          <div className="flex w-full h-1/2 items-center justify-center flex-col">
              <FadeLoader
                color="#FF6D00"
                // loading={isLoading}
                aria-label="Loading Spinner"
                data-testid="loader"
                />
                <div className="text-center text-gray-500 mt-4 animate-pulse">
            {t("connectingScreen.connectionEstabllishMessage")}
          </div>
          </div>
          
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
        <div className="flex flex-row justify-between w-full pl-5 pr-5">
                <div className="flex bg-white py-5 my-5 font-bold rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 w-full justify-between text-xs pl-10 pr-10" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
                    <div>
                    {props.chargerPower} KW
                    <br />
                    <div className='flex text-gray-400 font-light'>
                    {/* Power */}
                    {t("generalDetails.power")}
                    </div>
                    </div>
                    <div>
                    {props.chargerRate} €/kWh
                    <br />
                    <div className='flex text-gray-400 font-light'>
                    {/* Unit price */}
                    {t("generalDetails.unitPrice")}
                    </div>
                    </div>
                    <div>
                    {props.idleRate} €/min
                    <br />
                    <div className='flex text-gray-400 font-light'>
                    {/* Idle fee */}
                    {t("generalDetails.idleFee")}
                    </div>
                    </div>
                </div>
            </div>
  
        <div className="flex justify-center items-center h-1/6">
          <img src={require("../../assets/icons/Final3.png")} alt="" />
        </div>
        <div className="flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center h-5/6 w-screen bg-white pt-5">
          <div
            className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-black text-sm md:text-ms xl:text-xl"
            
          >
            <span>1.{t("connectingScreen.connectCableToTheCar")}</span>
            <span>2.{t("connectingScreen.connectCableToTheSocket")}</span>
          </div>
          <div
            className="flex p-5 m-5 justify-center flex-col items-center w-5/6 -my-10"
            style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}
          >
            <Lottie className="flex h-1/2" animationData={connectCable} />
          </div>
          <div
            className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 text-center rounded-br-30 bg-gray-100 w-5/6 shadow-md text-black text-sm md:text-md xl:text-xl">
  
            <span>
              {t("connectingScreen.cableConnectionMessage")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  
}
