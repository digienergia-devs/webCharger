import React, { useEffect, useState } from 'react'
import './style.css'
import { stopChargingSession, chargingSessionStatus, startChargingSession } from '../../api/api';
import Language from '../language';

export default function ChargingSessionScreen(props: any) {
    const [chargingPower, setChargingPower] = useState<number>(0.00);
    const [chargingTime, setChargingTime] = useState<string>('0:00:00');
    const [chargingCost, setChargingCost] = useState<number>(0.00);
    const timeDisplay = document.getElementById('time') as HTMLDivElement;
    const [stopChargingButtonText, setStopChargingButtonText] = useState<string>('Stop Charging');
    const [isChargingStopped, setIsChargingStopped] = useState<boolean>(false);
    const [isChargingStarted, setIsChargingStarted] = useState<boolean>(false);
    const [language, setLanguage] = useState<string | undefined>(props.language)

    useEffect(() => {
        setStopChargingButtonText(language == 'EN' ? 'Stop Charging' : 'Lopeta lataaminen')
    }, [])

    const formatTime = (seconds: number) => {
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
            await startChargingSession(sessionId);
            document.cookie = `myCookie=${sessionId}; expires=Wed, 31 Dec 2025 23:59:59 GMT; path=/ChargingSessionScreen`
        } catch (error: any) {

        }
    }

    const stopChargingSessionButtonClick = async () => {
        try {
            const sessionId = sessionStorage.getItem("sessionId");
            const response = await stopChargingSession(sessionId);
            if (response.message == 'Charging session stopped successfully') {
                setStopChargingButtonText(language == 'EN' ? 'Stopped' : 'Lopetettu');
                setIsChargingStopped(true);
            }
        } catch (error: any) {
            console.error(error);
        }
    }

    const calculateChargingPrice = (amount: number) => {
        let euros = amount / 100;
        setChargingCost(euros)
    }

    const getChargingSessionStatus = async () => {
        const sessionId = sessionStorage.getItem("sessionId");
        let response;
        await chargingSessionStatus(sessionId).then(
            (res: any) => {
                response = res;
                setChargingPower(Number((res.powerUsage.toFixed(2))));
                calculateChargingPrice(res.amountToCapture);
                formatTime(res.elapsedTime);
                if (res.isChargerConnected == true && res.isChargingCompleted == false) {
                    setTimeout(() => {
                        getChargingSessionStatus();
                    }, 2000)
                } else {
                    setIsChargingStopped(true);
                    setStopChargingButtonText(language == 'EN' ? 'Charging stoped' : 'Lataus loppui')
                }
            }
        )
    }

    useEffect(() => {
        if (!isChargingStarted) {
            startCharging();
            setIsChargingStarted(true);
            getChargingSessionStatus()
        }
    }, [isChargingStarted])

    const switchLanguage = () => {
        switch (language) {
            case 'EN':
                switch (stopChargingButtonText) {
                    case 'Stop Charging':
                        setStopChargingButtonText('Lopeta lataaminen')
                        break;

                    case 'Stopped':
                        setStopChargingButtonText('Lopetettu')
                        break;

                    case 'Charging stoped':
                        setStopChargingButtonText('Lataus loppui')
                        break;

                    default:
                        break;
                }
                break;
            case 'FI':
                switch (stopChargingButtonText) {
                    case 'Lopeta lataaminen':
                        setStopChargingButtonText('Stop Charging')
                        break;
                    case 'Lopetettu':
                        setStopChargingButtonText('Stopped')
                        break;
                    case 'Lataus loppui':
                        setStopChargingButtonText('Charging stoped')
                        break;
                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    const setLangua = (e: any) => {
        props.setLanguage(e)
        setLanguage(e);

        switchLanguage();
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-green-600">
            <div className="flex justify-center items-center h-2/´6">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
            <div className='flex flex-col justify-center items-center h-1/6 w-full'>
                <div className='flex justify-center items-center h-1/2'>

                </div>
                <div className='flex h-1/2 justify-center items-center text-center rounded-tl-30 rounded-tr-30 bg-green-500 w-5/6 shadow-md text-white font-bold text-md md:text-xl xl:text-2xl'>
                    <p className="m-0">Charging Session</p>
                </div>
            </div>
            <div className='flex flex-col justify-center rounded-tl-30 rounded-tr-30 items-center h-4/6 w-screen bg-white'>
                <div className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-gray-400 text-sm md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex w-1/3 items-center justify-center text-center'>
                            <img src={require('../../assets/icons/Group10.png')} alt="" />
                        </div>
                        <div className='flex w-2/3'>
                            <span>{chargingPower} kWh</span>
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex w-1/3 items-center justify-center text-center'>
                            <img src={require('../../assets/icons/Filled.png')} alt="" />
                        </div>
                        <div className='flex w-2/3'>
                            {chargingTime}s
                        </div>
                    </div>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex w-1/3 items-center justify-center text-center'>
                            <img src={require('../../assets/icons/Group2498.png')} alt="" />
                        </div>
                        <div className='flex w-2/3'>
                            {chargingCost}€
                        </div>
                    </div>

                </div>
                <div className="flex p-5 justify-center flex-col items-center w-5/6" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    <button className='flex bg-green-500 w-full text-center justify-center rounded-md text-white text-lg' onClick={stopChargingSessionButtonClick}>{stopChargingButtonText}</button>
                    <img src={require('../../assets/icons/carAtChargingPole.png')} alt="" />

                </div>
                <div className="flex p-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 text-center rounded-br-30 bg-gray-100 w-5/6 shadow-md text-gray-400 text-sm md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    <input type="text" className='border border-gray-300 bg-gray-100 w-full rounded-md px-4 py-2 focus:outline-none focus:border-green-500' />
                    <button className='flex bg-green-500 w-full text-center justify-center mt-5 rounded-md text-white text-lg'>Email receipt</button>
                </div>
            </div>
        </div>



        // <div className='main-container-chargingsession-screen'>
        //     <Language
        //         setLan={setLangua}
        //         language={props.language} />
        //     <div className='company-branding-chargingsession-screen'>
        //         <img src={require('../../assets/icons/icon.png')} alt="" />
        //         <p>plugkaro</p>
        //     </div>
        //     <div className='body-container-chargingsession-screen'>
        //         <div className='body-header-chargingsession-screen'>
        //             {language == 'EN' ? 'Charging Session' : 'Lataussessio'}
        //         </div>
        //         {/* <div className='charger-meter-chargingsession-screen'>
        //             <img src={require('../../assets/icons/speedometer.png')} alt="" />
        //         </div> */}
        //         <div className='charging-power-container-chargingsession-screen'>
        //             <div className='charging-power-header-chargingsession-screen'>
        //                 {/* Charging */}
        //                 <img src={require('../../assets/icons/charging.png')} alt="" />
        //             </div>
        //             <div className='charging-power-value-chargingsessio-screen'>
        //                 {chargingPower / 100000} kWh
        //             </div>
        //             <div className='chargingtime-price-container-chargingsession-screen'>
        //                 <div className='chargingtime-main-container-chargingsession-screen'>
        //                     <div className='chargingtime-header-chargingsession-screen'>
        //                         {/* Time */}
        //                         <img src={require('../../assets/icons/clock.png')} alt="" />
        //                     </div>
        //                     <div id='time' className='chargingtime-value-chargingsession-screen'>
        //                         {/* 01:32:34 */}
        //                         {chargingTime}s
        //                     </div>
        //                 </div>
        //                 <div className='chargingprice-main-container-chargingsesion-screen'>
        //                     <div className='chargingprice-header-chargingsession-screen'>
        //                         {/* Price */}
        //                         <img src={require('../../assets/icons/price.png')} alt="" />
        //                     </div>
        //                     <div className='chargingprice-value-chargingsession-screen'>
        //                         {chargingCost}€
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className='stopbutton-container-chargingsession-screen'>
        //                 <button onClick={stopChargingSessionButtonClick}>
        //                     {stopChargingButtonText}
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        //     <div className='footer-chargingsession-screen'>
        //         <img src={require('../../assets/icons/charging-station.png')} alt="" />
        //     </div>
        // </div>
    )
}
