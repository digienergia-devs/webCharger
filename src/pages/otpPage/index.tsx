import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OtpScreen(props: any){
    let navigate = useNavigate();

    const proceedToChargingSessionScreen = () => {
        navigate('/ChargingSessionScreen')
    }

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
            <div className="flex flex-row justify-between w-full pl-5 pr-5 " >
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
                    <p className="m-0">Your OTP to restore session</p>
                </div>
            </div> */}
            <div className='flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center h-5/6 w-screen bg-white py-5'>
                <div className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-black font-bold text-3xl md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    {props.otp}
                </div>
                <div className="flex flex-col pt-5">
                    <span className="flex flex-row items-center justify-center">
                        Please keep this OTP safe. 
                    </span>
                    <span className="flex flex-row items-center justify-center">
                        You will need it to restore your charging session.
                    </span>
                </div>

                <div className="flex justify-center flex-col items-centertext-center w-5/6 text-gray-400 text-md md:text-xl xl:text-2xl">
                    <button className='flex bg-iparkOrange800 w-full text-center justify-center py-3 mt-5 rounded-md text-white text-md' onClick={proceedToChargingSessionScreen}>Proceed to charging screen</button>
                </div>
            </div>
        </div>
    )
}