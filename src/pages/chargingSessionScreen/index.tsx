import React, { useEffect, useState } from 'react'
import './style.css'
import { stopChargingSession, chargingSessionStatus, startChargingSession, getChargingSummary } from '../../api/api';
import Language from '../language';
import FadeLoader from "react-spinners/FadeLoader";
import Lottie from 'lottie-react';
import batteryCharging from '../../assets/batteryCharging.json';

export default function ChargingSessionScreen(props: any) {
    const [chargingPower, setChargingPower] = useState<number | undefined>(0.00);
    const [chargingTime, setChargingTime] = useState<string>('0:00:00');
    const [chargingCost, setChargingCost] = useState<number | undefined>(0.0000);
    const timeDisplay = document.getElementById('time') as HTMLDivElement;
    const [stopChargingButtonText, setStopChargingButtonText] = useState<string>('Stop Charging');
    const [isChargingStopped, setIsChargingStopped] = useState<boolean>(false);
    const [isChargingStarted, setIsChargingStarted] = useState<boolean>(false);
    const [language, setLanguage] = useState<string | undefined>(props.language);
    const [isChargingStopButtonClicked, setIsChargingStopButtonClicked] = useState<boolean>(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
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
        if(isChargingStopped){
            setIsChargingStopButtonClicked(false);
        }
    }, [isChargingStopped])

    // useEffect(() => {
    //         let seconds = 0;
    //         const timer = setInterval(() => {
    //             seconds++;
    //             setTimer(seconds);
    //         }, 1000);
            
    //         return () => {
    //             clearInterval(timer);
    //         };
    // }, []);

    // useEffect(() => {
    //         formatTime(timer);
        
    // }, [timer])

    useEffect(() => {
        setTransactionId(localStorage.getItem("transactionId"));
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    useEffect(() => {
        setTimeout(() => {

            if(isChargingStopped){

                const fetchData = async () => {
                    let chargingSummary = await getChargingSummary(transactionId);
                    setChargingSessionSummary(chargingSummary);
                    setTimeout(() => {
                        let consumed_power = Number(chargingSummary.power_consumed);
                        let finalAmount = Number(chargingSummary.final_amount);
    
                        setChargingPower(Number(consumed_power.toFixed(2))); // Convert the string value to a number
                        setChargingCost((Number(finalAmount.toFixed(2))));
                    }, 1000);
                    localStorage.removeItem("transactionId");
                    localStorage.removeItem("sessionId");
                };
                fetchData();
            }
        }, 2000)
    }, [isChargingStopped])

    const formatTime = (seconds: number) => {
        console.log("elapsed time --- ", seconds);

        if (seconds < 0) {
            throw new Error('Input must be a non-negative number of seconds.');
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        setChargingTime(`${hours}:${minutes}:${remainingSeconds}`);
    }

    const startCharging = async () => {
        try {
            const sessionId = sessionStorage.getItem("sessionId");
            let transactionId = localStorage.getItem("transactionId");
            setTransactionId(transactionId);
            let res: any;
            try {
                await startChargingSession(transactionId).then((result: any) => {
                    res = result;
                    console.log("Start transaction --- ", res);
                    document.cookie = `myCookie=${sessionId}; expires=Wed, 31 Dec 2025 23:59:59 GMT; path=/ChargingSessionScreen`

                    setTimeout(() => {
                        getChargingSessionStatus(transactionId!);
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
        let transactionId = localStorage.getItem("transactionId");
        try {
            const response = await stopChargingSession(transactionId);
            console.log("stop charging response --- ", response);
            if (response.message == 'Charging session stopped successfully') {
                setIsChargingStopped(true);
                setStopChargingButtonText('Charging Stoped');
            }
            // else{
            //     setIsChargingStopButtonClicked(false);
            // }
        } catch (error: any) {
            console.error(error);
            setIsChargingStopButtonClicked(false);
        }
    }

    const calculateChargingPrice = (amount: number) => {
        let euros = amount / 100;
        setChargingCost(Number(euros.toFixed(4)))
    }

    const getChargingSessionStatus = async (transactionID: string) => {
        let response;
        await chargingSessionStatus(transactionID).then(
            (res: any) => {
                console.log("reading meter values --- ", res);
                if(res.charge_point_status == "Preparing"){
                    startCharging();
                }else{
                    response = res;
                    setChargingPower(Number(res.meter_values));
                    setChargingCost(Number(res.amount));
                    if(res.time_elapsed) {
                        formatTime((res.time_elapsed).toFixed(0));
                    }
                    // calculateChargingPrice(((Number(res.meter_values.value.toFixed(2))) * Number(res.meter_values.unit_price.toFixed(2))));
                    // formatTime(2000);
                    if (res.charge_point_status == 'Charging') {
                        setStopChargingButtonText('Stop Charging');
                        setTimeout(() => {
                            getChargingSessionStatus(transactionID);
                        }, 2000)
                    } else {
                        setIsChargingStopped(true);
                        setStopChargingButtonText('Charging Stoped')
                    }
                }
                
            }
        )
    }

    useEffect(() => {
        if (!isChargingStarted || transactionId) {
            startCharging();
            // getChargingSessionStatus();
            setIsChargingStarted(true);
            
        }
    }, [isChargingStarted, transactionId])

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
            <div className="flex flex-row justify-between w-full pl-5 pr-5" >
                <div className="flex bg-white py-5 my-5 font-bold rounded-full w-36 justify-center text-xs" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
                    {props.chargerPower} KW
                </div>
                <div className="flex bg-white py-5 my-5 font-bold rounded-full w-36 justify-center text-xs" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
                    {props.chargerRate} €/kWh
                </div>
            </div>
            <div className="flex justify-center items-center h-1/6">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
            {/* <div className='flex flex-col justify-center items-center h-1/6 w-full'>
                <div className='flex justify-center items-center h-1/2'>

                </div>
                <div className='flex h-1/2 justify-center items-center text-center rounded-tl-30 rounded-tr-30 bg-iparkOrange400 w-5/6 shadow-md text-white font-bold text-xs md:text-md xl:text-xl'>
                    <p className="m-0">Charging Session</p>
                </div>
            </div> */}
            <div className='flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center pt-3 h-5/6 w-screen bg-white'>
                <div className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-black font-bold text-md md:text-md xl:text-xl" >
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex w-1/3 items-center justify-center text-center'>
                            <img src={require('../../assets/icons/orangeThemeConsumedPower.png')} alt="" />
                        </div>
                        <div className='flex w-2/3'>
                            <span>{(chargingPower)?.toFixed(2)} kWh</span>
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex w-1/3 items-center justify-center text-center'>
                            <img src={require('../../assets/icons/orangeThemeElapsedTime.png')} alt="" />
                        </div>
                        <div className='flex w-2/3'>
                            {chargingTime}s
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex w-1/3 items-center justify-center text-center'>
                            <img src={require('../../assets/icons/orangeThemeAmountSpent.png')} alt="" />
                        </div>
                        <div className='flex w-2/3'>
                            {(chargingCost)?.toFixed(2)}€
                        </div>
                    </div>

                </div>
                <div className="flex justify-center flex-col items-center w-5/6 pb-5">
                {
                            isChargingStopped == false ?
                                // <img src={require('../../assets/orangeThemeRedCar.png')} alt="" />
                                <Lottie className='flex w-full h-1/2' animationData={batteryCharging} />
                            : null
                         }
                        {isChargingStopButtonClicked ?
                        
                        <FadeLoader
                            color="#FF6D00"
                            loading={true}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        /> : 

                        // stopChargingButtonText
                        // 'flex bg-iparkOrange800 w-full text-center justify-center rounded-md text-white text-lg'
                            <button className={(isChargingStopped ? 'flex bg-iparkOrange200 w-full text-center justify-center rounded-md text-black text-md py-3' : 'flex bg-red-600 w-full text-center justify-center rounded-md text-white text-md py-3')} onClick={stopChargingSessionButtonClick}>
                                {stopChargingButtonText}
                            </button>
                 
                         }

                         

                </div>
                {
                    isChargingStopped == true ? 
                    <div className="flex justify-center flex-col items-center text-center w-5/6 text-gray-400 text-sm md:text-xl xl:text-sxl">
                    <input type="text" className='border border-gray-300 bg-gray-100 w-full rounded-md px-4 py-2 focus:outline-none focus:border-green-500 text-center' placeholder='Enter your email'/>
                    <button className='flex bg-iparkOrange800 w-full text-center justify-center py-3 mt-5 rounded-md text-white text-md'>Email receipt</button>
                </div> : null
                }
                
            </div>
        </div>
    )
}
