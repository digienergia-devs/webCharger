import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { authorizePayment } from "../../api/api";
import { loadStripe } from "@stripe/stripe-js";
import "./cardForm.css";
import { useNavigate } from 'react-router-dom';
import FadeLoader from "react-spinners/FadeLoader";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe("pk_test_01QZ55AeQfGutsrsRjjkToqz");
export default function CardForm(props: any) {
  let navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<any>();
  const [payButtonClicked, setPayButtonClicked] = useState<boolean>(false);
  const [language, setLanguage] = useState<string | undefined>(props.language)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false); // use to set the state when the payment is success on stripe.
  const [authAmount, setAuthAmount] = useState<any>(props.selectedAmount);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [t, i18n] = useTranslation('global');

  const [paymentOption, setPaymentOption] = useState<string>('applePay');

  useEffect(() => {
    setAuthAmount(props.selectedAmount)
  }, [props.selectedAmount])

  useEffect(() => {
    if (stripe) {
      foo();
    }
  }, [stripe]);

  const foo = () => {
    if (!stripe) {
      return;
    }
    const pr = stripe.paymentRequest({
      country: "FI",
      currency: "eur",
      total: {
        label: "Total",
        amount: props.selectedAmount, // The amount in cents
      },
      // requestPayerName: true,
      // requestPayerEmail: true,

    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      try {
        const sessionId = localStorage.getItem("sessionId");
        const paymentMethodId = ev.paymentMethod.id;
        const requestBody = {
          amount: props.selectedAmount,
          payment_method: paymentMethodId
        }
        const responseData = await authorizePayment(
          props.chargerID,
          props.connectorID,
          requestBody
        ).then((res) => {
          localStorage.setItem("transactionId", res.transaction_id);
          if (res.transaction_id) {
            ev.complete("success");
            props.setLoading(false);
            // navigate('/ChargingSessionScreen')
            props.setOtp(res.otp)
            navigate('/OtpScreen')
          }
        });
        // navigate('/ChargingSessionScreen')
      } catch (error) {
        console.error("Payment authorization failed:", error);
      }
    });
    // if(!paymentRequest){
    //   setPaymentOption('card');
    // }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  const handleSubmit = async (event: any) => {
    foo();
    props.setLoading(true);
    setPayButtonClicked(true)
    setTimeout(() => { }, 2000);
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      try {
        let sessionId = localStorage.getItem("sessionId");
        let paymentMethodId = paymentMethod.id;

        const requestBody = {
          amount: props.selectedAmount,
          payment_method: paymentMethodId
        }
        const responseData = await authorizePayment(
          props.chargerID,
          props.connectorID,
          requestBody
        ).then((res: any) => {
          localStorage.setItem("transactionId", res.transaction_id);
          if (res.transaction_id) {
            props.setLoading(false);
            // navigate('/ChargingSessionScreen')
            props.setOtp(res.otp)
            navigate('/OtpScreen')
          }

        })
      } catch (error) {
        console.error("Payment authorization failed:", error);

      }
    }

  };

  const changePaymentMethod = () => {
    if (paymentOption === 'card') {
      setPaymentOption('applePay');
    } else {
      setPaymentOption('card');
    }
  }

  if(loading){
    return (
      <div className="flex justify-center items-center w-full">
        <FadeLoader
          color="#FF6D00"
          // loading={isLoading}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
  }else {
    return (
      <>
        {
          paymentOption === 'card' ? <>
          <>
            <CardElement className={payButtonClicked ? 'card-element' : 'card-element'} />
          </>
            {payButtonClicked ?
              <div className="flex justify-center items-center w-full">
                <FadeLoader
                  color="#FF6D00"
                  // loading={isLoading}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
              :
              <button className="flex bg-iparkOrange800 w-full text-center justify-center rounded-md text-white text-lg mt-5 py-2" onClick={handleSubmit}>
                {t("cardFormScreen.pay")}
              </button>
            }
           </>
           :
           <>
           <div className="flex flex-col">
            < div className="flex w-full justify-center">
            </div>
          <div className="applePay">
            {paymentRequest ? <>
              <PaymentRequestButtonElement options={{ paymentRequest }} /> </>    
              : 
              <>
                <span className="flex flex-row items-center justify-center text-center font-bold text-red-600" > {t("cardFormScreen.applePayGooglePayNotAvailable")}</span>
                <span className="flex flex-row items-center justify-center text-center font-bold text-red-600" > {t("cardFormScreen.pleaseSelectAnotherPaymentOption")}</span>
              </>
            }
          </div>
        </div>
           </>
        }
        <div className="flex flex-col pt-5">
          {payButtonClicked ? 
          null 
          : 
          <div className="flex flex-row items-center justify-center bg-gray-200 p-2 rounded-md" onClick={changePaymentMethod}>
            <img src={require('../../assets/icons/orangeThemeDebitCardIcon.png')} alt="" />
            <span className="flex pl-5 text-black">{t("cardFormScreen.payWithSomethingElse")}</span>
          </div>
          }
        
          <br />
          <span className="flex flex-row items-center justify-center text-center text-black">
            {t("cardFormScreen.paymetnMethodSelectedBasedOnDevice")}
          </span>
        </div>
        </>
    )
  }

  

}
