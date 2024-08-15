import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateOtp } from '../../api/api';
import { useTranslation } from 'react-i18next';

export default function AskOtpPage(props: any){
    let navigate = useNavigate();
    const [userProvidedOtp, setUserProvidedOtp] = useState<string>(''); 

    const [isInvalidOtp, setIsInvalidOtp] = useState<boolean>(false);

    const [t, i18n] = useTranslation('global');

    useEffect(() => {
        console.log("user provided otp --- ", userProvidedOtp);
    }, [userProvidedOtp])


    // useEffect(() => {

    //     let temp = 1;
    //     const test = async () => {
    //         const response = await validateOtp(props.transactionId, temp.toString()).then((response: any) => {
    //             console.log("response --- ", response);
    //             if(response.status === 'Valid'){
    //                 navigate('/ChargingSessionScreen');
    //             }else{
    //                temp = temp + 1;
    //                test(); 
    //             }
    //         })
    //     }

    //     test();
        
    // }, [])

    const restoreSession = async () => {
        props.setOtp(userProvidedOtp);
        setIsInvalidOtp(false);
        if((props.transactionId !== null) && (userProvidedOtp !== '')){
            const response = await validateOtp(props.transactionId, userProvidedOtp).then((response: any) => {
                console.log("response --- ", response);
                if(response.status === 'Valid'){
                    navigate('/ChargingSessionScreen');
                }else{
                    setIsInvalidOtp(true);
                }
            })

        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    useEffect(() => {
        console.log('transactionId in ask otp page --- ', props.transactionId)
    }, [])

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
                    Unit price
                    </div>
                    </div>
                    <div>
                    {props.idleRate} €/min
                    <br />
                    <div className='flex text-gray-400 font-light'>
                    Idle fee
                    </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center h-1/6">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
            
            <div className='flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center h-5/6 w-screen bg-white py-5'>
                <input type='text' className="flex p-5 m-5 justify-center flex-col text-center items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-black font-bold text-3xl md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} onBlur={(e: any) => setUserProvidedOtp(e.target.value)} />
                {
                    isInvalidOtp ?
                    <div className='flex flex-col'>
                        <span className="flex flex-row items-center justify-center text-red-500 font-bold">
                            Invalid OTP
                        </span>
                    </div> : null
                }
                
                <div className="flex flex-col pt-5">
                    
                    <span className="flex flex-row items-center justify-center">
                        Please provide OTP to restore session.
                    </span>
                    
                </div>
            

                <div className="flex justify-center flex-col items-centertext-center w-5/6 text-gray-400 text-md md:text-xl xl:text-2xl">
                    <button className='flex bg-iparkOrange800 w-full text-center justify-center py-3 mt-5 rounded-md text-white text-md' onClick={restoreSession}>Proceed to charging screen</button>
                </div>
            </div>
        </div>
    )
}