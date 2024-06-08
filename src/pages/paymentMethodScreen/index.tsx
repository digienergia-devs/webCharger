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
        const sessionId = localStorage.getItem('sessionId');
        console.log("session id from local storage --- ", sessionId);
    }, []);


    const setLangua = (e: any) => {
        props.setLanguage(e)
        setLanguage(e);
    }

    const SelectAmountComponent = () => {
        return (
            <div className="flex flex-row justify-around w-full pb-4">
                <div className={selectedAmount == 1000 ? 'flex bg-green-500 rounded-md border border-green-500 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-green-500 p-2'} onClick={() => selectAmountHandler(200)}>€10</div>
                <div className={selectedAmount == 2000 ? 'flex bg-green-500 rounded-md border border-green-500 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-green-500 p-2'} onClick={() => selectAmountHandler(2000)}>€20</div>
                <div className={selectedAmount == 4000 ? 'flex bg-green-500 rounded-md border border-green-500 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-green-500 p-2'} onClick={() => selectAmountHandler(4000)}>€40</div>
                <div className={selectedAmount == 6000 ? 'flex bg-green-500 rounded-md border border-green-500 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-green-500 p-2'} onClick={() => selectAmountHandler(6000)}>€60</div>
            </div>
        )
    }


    return (
        // this is pay screen
        // <div className="flex flex-col justify-center items-center h-screen w-screen bg-green-600">
        //     <div className="flex justify-center items-center h-2/´6">
        //         <img src={require('../../assets/icons/Final3.png')} alt="" />
        //     </div>
        //     <div className='flex flex-col justify-center items-center h-1/6 w-full'>
        //         <div className='flex justify-center items-center h-1/2'>

        //         </div>
        //         <div className='flex h-1/2 justify-center items-center text-center rounded-tl-30 rounded-tr-30 bg-green-500 w-5/6 shadow-md text-white font-bold text-md md:text-xl xl:text-2xl'>
        //             <p className="m-0">Charger Details</p>
        //         </div>
        //     </div>
        //     <div className='flex flex-col justify-center rounded-tl-30 rounded-tr-30 items-center h-4/6 w-screen bg-white'>
        //         <div className="flex p-5 m-5 justify-center flex-col items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 rounded-br-30 bg-gray-100 w-5/6 shadow-md text-gray-400 text-sm md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
        //             <span>ABB Charger - Socket 2</span>
        //             <span>Power 22 kW</span>

        //         </div>
        //         <div className="flex p-5 m-5 justify-center flex-col items-center w-5/6 text-gray-400 text-sm md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
        //             <span>Price</span>
        //             <img src={require('../../assets/icons/Group2499.png')} alt="" />
        //             <span>0,45 euro/kWh</span>
        //             {/* <button className='flex bg-green-500 mt-10 w-full text-center'>Pay</button> */}
        //             <button className='flex justify-center items-center text-center mt-10 w-full bg-green-500 text-lg text-white rounded-md'>Pay</button>
        //             <span className='flex mt-5'>Payment method selected based on your device and history</span>
        //         </div>
        //         <div className="flex p-5 m-5 justify-center items-center rounded-tl-30 rounded-tr-30 rounded-bl-30 text-center rounded-br-30 w-5/6 shadow-md text-gray-400 text-sm md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
        //             <div>
        //                 <img src={require('../../assets/icons/card.png')} alt="" />
        //             </div>
        //             <div>
        //                 <span>
        //                     Pay with something else
        //                 </span>
        //             </div>
        //         </div>
        //     </div>
        // </div>


        <div className="flex flex-col justify-center items-center h-screen w-screen bg-green-600">




            <div className="flex justify-center items-center h-2/´6">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
            <div className='flex flex-col justify-center items-center h-1/6 w-full'>
                <div className='flex justify-center items-center h-1/2'>

                </div>
                <div className='flex flex-col h-full justify-center items-center text-center rounded-tl-30 rounded-tr-30 bg-green-500 w-5/6 shadow-md text-white font-bold text-md md:text-xl xl:text-2xl'>
                    <p className="m-0">Kempower charger | 22 kW</p>
                    <p className="m-0">Price: 0.45 Euro/kWh</p>
                </div>
            </div>
            <div className='flex flex-col justify-center rounded-tl-30 rounded-tr-30 items-center h-4/6 w-screen bg-white'>
                <div className="flex flex-col  p-5 m-5 justify-center items-center text-center w-5/6 text-gray-400 text-sm md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    <div>
                        <img src={require('../../assets/icons/cardDetails.png')} alt="" />
                    </div>
                    <div>
                        <span className='flex text-green-500 font-bold text-xl'>
                            Payment Authorization
                        </span>
                    </div>
                </div>
                <div className="flex p-5 m-5 justify-center items-center w-5/6 text-gray-400 text-sm md:text-xl xl:text-2xl" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    {/* <div>
                        <img src={require('../../assets/icons/card.png')} alt="" />
                    </div> */}
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






        // <div>
        //     {
        //         loading ?
        //             <div className='loading-container'>
        //                 <FadeLoader
        //                     color="#cacfd9"
        //                     loading={loading}
        //                     aria-label="Loading Spinner"
        //                     data-testid="loader"
        //                 />
        //             </div>
        //             :
        //             <div className='main-container-paymentmethod-screen'>
        //                 <Language setLan={setLangua}
        //                     language={props.language} />
        //                 <div className='company-branding-paymentmethod-screen'>
        //                     <img src={require('../../assets/icons/icon.png')} alt="" />
        //                     <p>plugkaro</p>
        //                 </div>
        //                 <div className='body-container-paymentmethod-screen'>
        //                     <div className='charger-information-paymentmethod-screen'>
        //                         {language == 'EN' ? 'Kempower charger' : 'Kempower-laturi'} | 22 kW
        //                     </div>
        //                     <div className='electricity-price-information-paymentmethod-screen'>
        //                         {language == 'EN' ? 'Price' : 'Hinta'} : 0.5 €/kWh
        //                     </div>
        //                     <div className='paymentmethod-header-paymentmethod-screen'>
        //                         {language == 'EN' ? 'Payment Authorization' : 'Maksunvaltuutus'}
        //                     </div>
        //                     <div className='paymentmethod-selections-paymentmethod-screen'>
        //                         <Elements stripe={stripePromise}>
        //                             <CardForm
        //                                 stripePromise={stripePromise}
        //                                 setIsPaymentMethodMethodAuthorized={props.setIsPaymentMethodMethodAuthorized}
        //                                 setLoading={setLoading}
        //                                 language={language}
        //                             />
        //                         </Elements>
        //                     </div>
        //                 </div>
        //                 <div className='footer-main-container-paymentmedthod-screen'>
        //                     <div className='footer-paymentmethod-screen'>
        //                         <img src={require('../../assets/icons/charging-station.png')} alt="" />
        //                     </div>
        //                 </div>
        //             </div>
        //     }
        // </div>
    )
}
