import React, { useEffect, useState } from 'react'
import './style.css'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CardForm from '../paymentHander/cardForm';
import FadeLoader from "react-spinners/FadeLoader";
import Language from '../language';

const stripePromise = loadStripe('pk_test_51MtxkaKRzm9Te7g8OTUxqutdzDY9XqQMydztUG1XXtGqzo2olj16lx2NkRwXQjsOxvdbnLKMio1yRBYGQjQ61Zqw00xaJPcjkH');
const clientSecret = 'pi_3PNzgVKRzm9Te7g8087PFtUW_secret_sNOPS4hHZqH9TPCFfQi5fS1Ju'

export default function PaymentMethodScreen(props: any) {
    const [loading, setLoading] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>(props.language)
    const [selectedAmount, setSelectedAmount] = useState<number>(0);

    const selectAmountHandler = (amount: number) => {
        setSelectedAmount(amount);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    // useEffect(() => {
    //     const sessionId = localStorage.getItem('sessionId');
    //     console.log("session id from local storage --- ", sessionId);
    // }, []);


    const setLangua = (e: any) => {
        props.setLanguage(e)
        setLanguage(e);
    }

    const SelectAmountComponent = () => {
        return (
            <div className="flex flex-row justify-around w-full pb-4">
                <div className={selectedAmount == 1000 ? 'flex bg-iparkOrange800 rounded-md border border-iparkOrange800 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-iparkOrange800 p-2'} onClick={() => selectAmountHandler(102)}>€1.02</div>
                <div className={selectedAmount == 2000 ? 'flex bg-iparkOrange800 rounded-md border border-iparkOrange800 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-iparkOrange800 p-2'} onClick={() => selectAmountHandler(2000)}>€20</div>
                <div className={selectedAmount == 4000 ? 'flex bg-iparkOrange800 rounded-md border border-iparkOrange800 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-iparkOrange800 p-2'} onClick={() => selectAmountHandler(4000)}>€40</div>
                <div className={selectedAmount == 6000 ? 'flex bg-iparkOrange800 rounded-md border border-iparkOrange800 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-iparkOrange800 p-2'} onClick={() => selectAmountHandler(6000)}>€60</div>
            </div>
        )
    }


    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-iparkOrange800">
            <div className="flex flex-row justify-between w-full pl-5 pr-5">
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
                <div className='flex flex-col h-full justify-center items-center text-center rounded-tl-30 rounded-tr-30 bg-iparkOrange400 w-5/6 shadow-md text-white font-bold text-xs md:text-md xl:text-xl'>
                    <p className="m-0">Kempower charger | {props.chargerPower} kW</p>
                    <p className="m-0">Price: {props.chargerRate} Euro/kWh</p>
                </div>
            </div> */}
            <div className='flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center h-5/6 w-screen bg-white pt-5'>
                <div>
                    <span className='flex text-iparkOrange800 font-bold text-md'>
                        Payment Authorization
                    </span>
                </div>
                <div className="flex flex-col pb-5 justify-center items-center text-center w-5/6 text-gray-400 text-xs md:text-md xl:text-xl">
                    <div>
                        <img src={require('../../assets/orangeThemePaymentImage.png')} alt="" />
                    </div>
                    
                </div>
                <div className="flex justify-center items-center w-5/6 text-gray-400 text-xs md:text-md xl:text-xl">
                    <>
                        {(selectedAmount > 0) ?
                            <div>
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <CardForm
                                        stripePromise={stripePromise}
                                        setIsPaymentMethodMethodAuthorized={props.setIsPaymentMethodMethodAuthorized}
                                        setLoading={setLoading}
                                        language={language}
                                        selectedAmount={selectedAmount}
                                        chargerID={props.chargerID}
                                        connectorID={props.connectorID}
                                        setOtp={props.setOtp}
                                    />
                                </Elements>
                            </div>
                            :
                            <SelectAmountComponent />
                        }
                    </>

                </div>
            </div>
        </div>
    )
}
