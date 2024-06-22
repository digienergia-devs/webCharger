import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateOtp } from '../../api/api';

export default function AskOtpPage(props: any){
    let navigate = useNavigate();
    const [userProvidedOtp, setUserProvidedOtp] = useState<string>(''); 

    useEffect(() => {
        console.log("user provided otp --- ", userProvidedOtp);
    }, [userProvidedOtp])

    const restoreSession = async () => {
        if((props.transactionId !== null) && (userProvidedOtp !== '')){
            const response = await validateOtp(props.transactionId, userProvidedOtp).then((response: any) => {
                console.log("response --- ", response);
                if(response.status === 'Valid'){
                    navigate('/ChargingSessionScreen');
                }else{
                    alert('Invalid OTP');
                }
            })

        }
    }

    useEffect(() => {
        console.log('transactionId in ask otp page --- ', props.transactionId)
    }, [])

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
            <div className="flex flex-row justify-between w-full pl-5 pr-5 " >
                <div className="flex bg-white py-5 my-5 font-bold rounded-full w-36 justify-center" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
                    25 KW
                </div>
                <div className="flex bg-white py-5 my-5 font-bold rounded-full w-36 justify-center" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 1)' }}>
                    0.25 Euro/kWh
                </div>
            </div>
            <div className="flex justify-center items-center h-2/´6">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
            <div className='flex flex-col justify-center items-center h-1/6 w-full'>
                <div className='flex justify-center items-center h-1/2'>

                </div>
                <div className='flex h-1/2 justify-center items-center text-center rounded-tl-30 rounded-tr-30 bg-iparkOrange400 w-5/6 shadow-md text-white font-bold text-md md:text-xl xl:text-2xl'>
                    <p className="m-0">Your OTP to restore session</p>
                </div>
            </div>
            <div className='flex flex-col justify-center rounded-tl-30 rounded-tr-30 items-center h-4/6 w-screen bg-white'>
                <input type='text' className="flex text-center p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-gray-400 text-sm md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} onBlur={(e: any) => setUserProvidedOtp(e.target.value)} />
                    


                <div className="flex flex-col pt-5">
                    <span className="flex flex-row items-center justify-center">
                        Please provide OTP to restore session.
                    </span>
                    
                </div>

                <div className="flex p-5 justify-center flex-col items-centertext-center w-5/6 text-gray-400 text-sm md:text-xl xl:text-2xl">
                    <button className='flex bg-iparkOrange800 w-full text-center justify-center mt-5 rounded-md text-white text-lg' onClick={restoreSession}>Proceed to charging screen</button>
                </div>
            </div>
        </div>
    )
}