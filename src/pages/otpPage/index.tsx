import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function OtpScreen(props: any){
    let navigate = useNavigate();

    const proceedToChargingSessionScreen = () => {
        navigate('/ChargingSessionScreen')
    }
    const [t, i18n] = useTranslation('global');

    useEffect(() => {
        window.scrollTo(0, 0);
        const newUrl = props.connectorID;
        window.history.replaceState(null, '', newUrl);
      }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
            <div className='flex flex-row-reverse w-full pr-5 pt-5'>
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
                        {t("generalDetails.otp")} :- {props.otp}
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center h-1/6">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
            <div className='flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center h-5/6 w-screen bg-white py-5'>
                <div className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-black font-bold text-3xl md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    {props.otp}
                </div>
                <div className="flex flex-col pt-5">
                    <span className="flex flex-row items-center justify-center">
                        {t("otpPage.keepOtpSafe")}
                    </span>
                    <span className="flex flex-row items-center justify-center">
                        {t("otpPage.youNeedOtpAgain")}
                    </span>
                </div>

                <div className="flex justify-center flex-col items-centertext-center w-5/6 text-gray-400 text-md md:text-xl xl:text-2xl">
                    <button className='flex bg-iparkOrange800 w-full text-center justify-center py-3 mt-5 rounded-md text-white text-md' onClick={proceedToChargingSessionScreen}>{t("otpPage.proceedToChargingScreen")}</button>
                </div>
            </div>
        </div>
    )
}