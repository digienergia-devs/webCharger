import React, { useEffect, useState } from 'react'
import './style.css'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CardForm from '../paymentHander/cardForm';
import FadeLoader from "react-spinners/FadeLoader";
import Language from '../language';
import { useTranslation } from 'react-i18next';

const stripePromise = loadStripe('pk_test_51MtxkaKRzm9Te7g8OTUxqutdzDY9XqQMydztUG1XXtGqzo2olj16lx2NkRwXQjsOxvdbnLKMio1yRBYGQjQ61Zqw00xaJPcjkH');
const clientSecret = 'pi_3PNzgVKRzm9Te7g8087PFtUW_secret_sNOPS4hHZqH9TPCFfQi5fS1Ju'

export default function PaymentMethodScreen(props: any) {
    const [loading, setLoading] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>(props.language)
    const [selectedAmount, setSelectedAmount] = useState<number>(3000);
    const [t, i18n] = useTranslation('global');

    useEffect(() => {
        sessionStorage.getItem('language') && props.handleChangeLanguage(sessionStorage.getItem('language') as string);
      }, [])

      useEffect(() => {
        sessionStorage.setItem('language', language);
      }, [language]);

    const selectAmountHandler = (amount: number) => {
        setSelectedAmount(amount);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        const newUrl = props.connectorIDFromChargePointEndpoint;
        window.history.replaceState(null, '', newUrl);
      }, []);
    const setLangua = (e: any) => {
        props.handleChangeLanguage(e)
        setLanguage(e);
    }

    // const SelectAmountComponent = () => {
    //     return (
    //         <div className="flex flex-row justify-around w-full pb-4">
    //             <button onClick={() => selectAmountHandler(3000)} className="flex bg-iparkOrange800 w-full text-center justify-center py-3 mt-5 rounded-md text-white text-md">{t("paymentMethodScreen.proceedWithMoney")}</button>
    //         </div>
    //     )
    // }


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
            </div>
            <div className="flex justify-center items-center h-1/6">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
            <div className='flex flex-col justify-start rounded-tl-30 rounded-tr-30 items-center h-5/6 w-screen bg-white pt-5'>
                <div>
                    <span className='flex text-iparkOrange800 font-bold text-md'>
                        {t("paymentMethodScreen.paymentAuthorization")}
                    </span>
                </div>
                <div className="flex flex-col pb-5 justify-center items-center text-center w-5/6 text-gray-400 text-xs md:text-md xl:text-xl">
                    <div>
                        <img src={require('../../assets/orangeThemePaymentImage.png')} alt="" />
                    </div>
                    
                </div>
                <div className="flex justify-center items-center w-5/6 text-gray-400 text-xs md:text-md xl:text-xl">
                    <>
                        {/* {(selectedAmount > 0) ? */}
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
                                        setTransactionId={props.setTransactionId}
                                        connectorIDFromChargePointEndpoint={props.connectorIDFromChargePointEndpoint}
                                        setLanguage={setLangua}
                                    />
                                </Elements>
                            </div>
                            {/* :
                            <SelectAmountComponent />
                        } */}
                    </>

                </div>
            </div>
        </div>
    )
}
