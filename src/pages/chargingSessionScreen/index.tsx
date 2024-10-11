import React, { useEffect, useState } from 'react'
import './style.css'
import { stopChargingSession, chargingSessionStatus, startChargingSession, getChargingSummary, sendEmailInvoice } from '../../api/api';
import FadeLoader from "react-spinners/FadeLoader";
import Lottie from 'lottie-react';
import batteryCharging from '../../assets/batteryCharging.json';
import { useTranslation } from 'react-i18next';
import { format } from 'path';
import Timer from './Timer';

export default function ChargingSessionScreen(props: any) {
    const [t, i18n] = useTranslation('global');
    const [chargingPower, setChargingPower] = useState<number>(0.00);
    const [chargingTime, setChargingTime] = useState<string>('0:00:00');
    const [chargingCost, setChargingCost] = useState<number>(0.0000);
    const timeDisplay = document.getElementById('time') as HTMLDivElement;
    const [stopChargingButtonText, setStopChargingButtonText] = useState<string>(t("chargingSessionScreen.stopCharging"));
    const [isChargingStopped, setIsChargingStopped] = useState<boolean>(false);
    const [isChargingStarted, setIsChargingStarted] = useState<boolean>(false);
    const [language, setLanguage] = useState<string | undefined>(props.language);
    const [isChargingStopButtonClicked, setIsChargingStopButtonClicked] = useState<boolean>(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [transactionRef, setTransactionRef] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [invoiceEmailState, setInvoiceEmailState] = useState<string>('');
    const [meterStartTime, setMeterStartTime] = useState<string>('');
    const [isChargingSessionStoppedByUser, setIsChargingSessionStoppedByUser] = useState<boolean>(false);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const [initialMeterValue, setInitialMeterValue] = useState<number>(0);


    useEffect(() => {
        if(isNaN(chargingPower)){
            setChargingPower((0.00));
        }
    }, [chargingPower])

    useEffect(() => {
        if(isNaN(chargingCost)){
            setChargingCost(Number(0.00));
        }
    }, [chargingCost])

    useEffect(() => {
        if(isChargingStarted == false && isChargingStopped == false){
            setShowSpinner(true);
        } else if (isChargingStarted == true && isChargingStopped == false && initialMeterValue > 0){
            setShowSpinner(false);
        } else if(isChargingStopped == true && initialMeterValue > 0){
            setShowSpinner(false);
        }
    }, [isChargingStopped, isChargingStarted, initialMeterValue])
    
    const [chargingSessionSummary, setChargingSessionSummary] = useState<{
        power_consumed: any,
        final_amount: any,
        status: any
    }>({
        power_consumed: null,
        final_amount: null,
        status: null
    });

    const [timer, setTimer] = useState<number>(0);

    useEffect(() => {

        if(chargingTime == '0:00:00'){
            setStopChargingButtonText(t("chargingSessionScreen.preparing")); 
        }else {
            setStopChargingButtonText(t("chargingSessionScreen.stopCharging"));
        }

        //setIsChargingStarted(true); // when charging session starts, timer start to run.

        }, [chargingTime])
        
    useEffect(() => {
        if(isChargingStopped){
            setIsChargingStopButtonClicked(false);
        }
    }, [isChargingStopped])

    useEffect(() => {
        setTransactionId(props.transactionId);
        window.scrollTo(0, 0);
        const newUrl = props.connectorIDFromChargePointEndpoint;
        window.history.replaceState(null, '', newUrl);
      }, []);

    useEffect(() => {
        setTimeout(() => {

            if(isChargingStopped){
                const fetchData = async () => {
                    let chargingSummary = await getChargingSummary(transactionId);
                    setChargingSessionSummary(chargingSummary);
                    setTimeout(() => {
                        let transactionRef = chargingSummary.transaction_ref;   // check this again with argon
                        setTransactionRef(transactionRef);
                        let consumed_power = (Number(chargingSummary.power_consumed))/1000;
                        let finalAmount = (Number((chargingSummary.final_amount)/100)).toFixed(2);
                        setChargingPower(Number(consumed_power.toFixed(2)));
                        setChargingCost(Number(finalAmount));
                    }, 1000);
                    localStorage.removeItem("transactionId");
                    localStorage.removeItem("sessionId");
                };
                fetchData();
            }
        }, 2000)
        
    }, [isChargingStopped])
    const [chargerStopTimer, setChargerStopTimer] = useState<number>(0);

    const formatTime = (seconds: number) => {
        if (seconds < 0 || seconds == 0 || isNaN(seconds)) {
            setChargingTime(`0:00:00`)
            // throw new Error('Input must be a non-negative number of seconds.');
        }else {
            if(!isChargingStopped){
                setChargerStopTimer(seconds);
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const remainingSeconds = seconds % 60;
                if(minutes < 10){
                    setChargingTime(`${hours}:0${minutes}:${remainingSeconds}`);
                    if(remainingSeconds < 10){
                        setChargingTime(`${hours}:0${minutes}:0${remainingSeconds}`);
                    }
                }else if(remainingSeconds < 10){
                setChargingTime(`${hours}:${minutes}:0${remainingSeconds}`);

                }else{
                    setChargingTime(`${hours}:${minutes}:${remainingSeconds}`);
                }
            }else {
                const hours = Math.floor(chargerStopTimer / 3600);
                const minutes = Math.floor((chargerStopTimer % 3600) / 60);
                const remainingSeconds = chargerStopTimer % 60;
                if(minutes < 10){
                    setChargingTime(`${hours}:0${minutes}:${remainingSeconds}`);
                    if(remainingSeconds < 10){
                        setChargingTime(`${hours}:0${minutes}:0${remainingSeconds}`);
                    }
                }else if(remainingSeconds < 10){
                setChargingTime(`${hours}:${minutes}:0${remainingSeconds}`);

                }else{
                    setChargingTime(`${hours}:${minutes}:${remainingSeconds}`);
                }
            }
        }
        
        
    }

    const startCharging = async () => {
        try {
            const sessionId = sessionStorage.getItem("sessionId");
            setTransactionId(props.transactionId);
            let res: any;
            let startTime =  Date.now();
            try {
                await startChargingSession(props.transactionId, startTime.toString()).then((result: any) => {

                    res = result;
                    if(result.status == "charging" || result.status == "Charging"){
                        setIsChargingStarted(true);
                        setTimeout(() => {
                            // runTimer();
                            
                        }, 1000)
                        document.cookie = `myCookie=${sessionId}; expires=Wed, 31 Dec 2025 23:59:59 GMT; path=/ChargingSessionScreen`
                    } else if(result.status == "Available"){
                        setTimeout(() => {
                            startCharging();
                        }, 30000);
                    }

                    setTimeout(() => {
                        if(!isChargingSessionStoppedByUser){
                            if(!isChargingStopped){
                                getChargingSessionStatus(props.transactionId!);
                            }
                        }   
                    }, 2000);
                })
            } catch (error) {
                console.error(error);
            }

            
        } catch (error: any) {

        }
    
    }

    const stopChargingSessionButtonClick = async () => {
        setIsChargingStopButtonClicked(true);
        try {
            const response = await stopChargingSession(props.transactionId);
            if(response){
                if (response.status == 'success') {
                    setIsChargingSessionStoppedByUser(true);
                        setChargingCost(Number(response.final_payment)/100);
                        setChargingPower((Number(response.power_consumed))/1000);
                        // Set the timer later ...
                        setIsChargingStopped(true);
                        setStopChargingButtonText(t("chargingSessionScreen.chargingStoped"));  
                } else {
                    setTimeout(() => {
                        stopChargingSessionButtonClick();
                    }, 30000);
                }
            }
            
        } catch (error: any) {
            console.error(error);
            setIsChargingStopButtonClicked(false);
        }
    }

    const runTimer = () => {

        if(meterStartTime !== ''){
            let myTimer = new Date(meterStartTime).toISOString();

            let current_time = new Date().toISOString();
            let startTime = new Date(myTimer).getTime();
            let currentTime = new Date(current_time).getTime();
            let elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
            formatTime(Math.floor(initialMeterValue)); // reduce three hours from UTC time. Only for pilot project
        }
 
    }

    const startTimer = () => {
        const interval = setInterval(() => {
            if(isChargingStopped == true){
                return;
            }
            runTimer();
        }, 1000);
        return () => clearInterval(interval);
    }



    const [finalMeterValue, setFinalMeterValue] = useState<number>(0);

    useEffect(() => {
        // startTimer();
    }, [meterStartTime]);

    // useEffect(() => {
    //     runTimer();
    // }, [initialMeterValue])

    // useEffect(() => {
    //     setChargingPower((initialMeterValue)/1000);
    // }, [finalMeterValue])

    const getChargingSessionStatus = async (transactionID: string) => {
        let response;
        if(!isChargingSessionStoppedByUser){
            if(!isChargingStopped){

                await chargingSessionStatus(transactionID).then(
                    (res: any) => {
                        setMeterStartTime(new Date(res.meter_start_time).toLocaleString());
                        if(res.charge_point_status == "preparing"){
                            startCharging();
                        }else{
                            response = res;
                            // if(res.meter_values.length == 1){
                            //     setChargingCost(Number(res.amount)/100)
                            //     setInitialMeterValue(Number(res.meter_values[0].value));
                            //     setChargingPower(0);
                            // } 
    
                            // if(res.meter_values.length > 1){
                            //     setChargingCost(Number(res.amount)/100)
                            //     let objectLength = res.meter_values.length;
                            //     setInitialMeterValue(Number(res.meter_values[0].value));
                            //     setFinalMeterValue(Number(res.meter_values[objectLength - 1].value));
                            // }  
                            if(!isChargingStopButtonClicked){
                                if(res.charge_point_status == 'charging'){
                                    setChargingCost(Number(res.amount)/100);
                                    let currentTime = Date.now();
                                    let startTime = res.meter_start_time
                                    setInitialMeterValue(Number(currentTime - startTime));
                                    setChargingPower(Number(res.meter_values.value)/1000)
                                }
                            }

                            if (res.charge_point_status == 'charging') { // to Argon, once charging session is stoped, this state need to be change to 'finished' in API response. But it is not happening now. Argon need to fix this.
                                setStopChargingButtonText(t("chargingSessionScreen.stopCharging"));
                                setTimeout(() => {
                                    getChargingSessionStatus(transactionID);
                                }, 60000)
                            } else {
                                setIsChargingStopped(true);
                                // setStopChargingButtonText(t("chargingSessionScreen.chargingStoped"));
                            }
                        }
                        
                    }
                )
            }
            
        }
    }

    const requestEmailInvoice = async () => {

        let requestBody = {
            "transaction_id": transactionId?.toString(),
            "email": userEmail
          }
        await sendEmailInvoice(requestBody).then((res: any) => {
            res.status == 200 ? setInvoiceEmailState('sent') : setInvoiceEmailState('failed');
        })
    }

    useEffect(() => {
        if (!isChargingStarted || transactionId) {
            startCharging();
            
        }
    }, [isChargingStarted, transactionId])

        return (
            <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
                <div className='flex flex-row-reverse w-full pr-5 mt-5'>
                <select
                    value={props.language}
                    onChange={(e) => props.handleChangeLanguage(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md text-xs focus:outline-none"
                >
                    <option value="fi">FI</option>
                    <option value="en">EN</option>
                    {/* <option value="sw">SW</option> */}
                </select>
                </div>
                <div className="flex flex-row justify-between w-full pl-5 pr-5">
                    <div className="flex flex-col bg-white py-5 my-5 font-bold rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 w-full " style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
                        
                        <div className='flex flex-row justify-between text-xs pl-10 pr-10'>
                            <div>
                                {props.chargerPower} KW
                                <br />
                                <div className='flex text-gray-400 font-light'>
                                {t("generalDetails.power")}
                                </div>
                            </div>
                            <div>
                                {props.chargerRate} €/kWh
                                <br />
                                <div className='flex text-gray-400 font-light'>
                                {t("generalDetails.unitPrice")}
                                </div>
                            </div>
                            <div>
                                {props.idleRate} €/min
                                <br />
                                <div className='flex text-gray-400 font-light'>
                                {t("generalDetails.idleFee")}
                                </div>
                            </div>
                        </div>
                        <div className='flex text-xs pl-10 pr-10 text-gray-400 font-light pt-5'>
                            {t("generalDetails.otp")} {props.otp}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center h-2/6">
                    <img src={require('../../assets/icons/Final3.png')} alt="" />
                </div>
                
                <div className='flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center pt-3 h-4/6 w-screen bg-white'>
                    <div className={isChargingStopped ? "flex py-5 pt-5 my-5 mt-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-black font-bold text-md md:text-md xl:text-xl" : "flex py-5 -mb-20 pt-5 my-5 mt-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-black font-bold text-md md:text-md xl:text-xl"} >
                        
                    {/* {(chargingTime == '0:00:00' ) ?  */}
                    {(showSpinner == true ) ? 
                        <FadeLoader
                        color="#FF6D00"
                        loading={true}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        />
                        : 
                        <>
                        {
                            !isChargingStopped && 
                            
                            <div className='flex justify-center items-center w-full text-xs text-gray-400 text-center p-3'>
                            Charging session has been started!
                            Timer will update in every three minutes.
                        </div>
                        }
                        
                        
                        <div className='flex justify-center items-center w-full'>
                            <div className='flex w-1/3 items-center justify-center text-center'>
                                <img src={require('../../assets/icons/orangeThemeElapsedTime.png')} alt="" />
                            </div>
                            <div className='flex w-2/3 ml-10'>
                                {initialMeterValue > 0 ? <Timer startTime={initialMeterValue}
                                isChargingStopped={isChargingStopped}
                            /> : <></>}
                            </div>
                        </div>
                        <div className='flex justify-center items-center w-full'>
                            <div className='flex w-1/3 items-center justify-center text-center'>
                                <img src={require('../../assets/icons/orangeThemeConsumedPower.png')} alt="" />
                            </div>
                            <div className='flex w-2/3 ml-10'>
                                <span>{(chargingPower)?.toFixed(2)} kWh</span>
                            </div>
                        </div>
                        
                        <div className='flex justify-center items-center w-full'>
                            <div className='flex w-1/3 items-center justify-center text-center'>
                                <img src={require('../../assets/icons/orangeThemeAmountSpent.png')} alt="" />
                            </div>
                            <div className='flex w-2/3 ml-10'>
                                {(chargingCost)?.toFixed(2)}€
                            </div>
                        </div></>
                        }
                        
                        

                    </div>
                        {
                            isChargingStopped == false ?
                            <div className='flex h-1/3 w-full justify-center'>
                                    <Lottie animationData={batteryCharging} />
                            </div>
                            : null
                        }
                    
                    {(showSpinner == false) ? 
                        <div className="flex justify-center flex-col items-center w-5/6 pb-5">
                        
                        {isChargingStopButtonClicked ?
                        
                            <FadeLoader
                                color="#FF6D00"
                                loading={true}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            /> : 
                            (
                                isChargingStopped == false ?
                                <>
                                <button className={(isChargingStopped ? 
                                'flex bg-iparkOrange200 w-full text-center justify-center rounded-md text-black text-md py-3' 
                                : 
                                    'flex bg-red-600 w-full text-center justify-center rounded-md text-white text-md py-3'
                                )} onClick={stopChargingSessionButtonClick}>
                                    {stopChargingButtonText}
                                </button> 
                                <br/>

                                {
                                    invoiceEmailState == 'sent' ?
                                    <span className='flex pt-5 text-justify'>{t("chargingSessionScreen.receiptRequested")}</span>
                                    :
                                    null
                                }

                                    <>
                                        <input type="text" className='border border-gray-300 bg-gray-100 w-full rounded-md px-4 py-2 focus:outline-none focus:border-green-500 text-center text-black' placeholder={t("chargingSessionScreen.enterYourEmail")} onBlur={(e: any) => setUserEmail(e.target.value)}/>
                                        <button className={'flex bg-iparkOrange800 w-full text-center justify-center py-3 mt-5 rounded-md text-black text-md'} onClick={requestEmailInvoice}>{t("chargingSessionScreen.requestEmailReceipt")}</button>
                                    </>
                                </>
                                : 
                                <>
                                </>
                            )
                
                        }
                        </div>
                    :
                    <></>
                    }            
                </div>
            </div>
        )
    }
