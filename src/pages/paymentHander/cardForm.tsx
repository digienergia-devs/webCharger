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

const stripePromise = loadStripe("pk_test_01QZ55AeQfGutsrsRjjkToqz");
export default function CardForm(props: any) {
  let navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<any>();
  const [payButtonClicked, setPayButtonClicked] = useState<boolean>(false);
  const [language, setLanguage] = useState<string | undefined>(props.language)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false); // use to set the state when the payment is success on stripe.
  const [authAmount, setAuthAmount] = useState<any>(props.selectedAmount)

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

    console.log("payment request can make request --- ", pr.canMakePayment());

    pr.canMakePayment().then((result) => {
      console.log("result --- ", result);
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
        });
        ev.complete("success");
        navigate('/ChargingSessionScreen')
      } catch (error) {
        console.error("Payment authorization failed:", error);
      }
    });
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
        console.log("paymentMethodId --- ", paymentMethod);
        console.log("sessionId --- ", sessionId);

        const requestBody = {
          amount: props.selectedAmount,
          payment_method: paymentMethodId
        }
        const responseData = await authorizePayment(
          props.chargerID,
          props.connectorID,
          requestBody
        ).then((res: any) => {
          console.log("res from card form --- ", res);
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
    console.log("change payment method clicked ---");
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex w-full justify-center">

        </div>
        <div className="applePay">
          {paymentRequest ? <>
            <PaymentRequestButtonElement options={{ paymentRequest }} /> </>
            : null
          }
        </div>
      </div>

      <br />

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
        <button className="flex bg-iparkOrange800 w-full text-center justify-center rounded-md text-white text-lg mt-5" onClick={handleSubmit}>
          Pay
        </button>
      }
      <div className="flex flex-col pt-5">
        <span className="flex flex-row items-center justify-center">
          Payment method is selected based on your device.
        </span>
        <br />
        <div className="flex flex-row items-center justify-center" onClick={changePaymentMethod}>
          <img src={require('../../assets/icons/orangeThemeDebitCardIcon.png')} alt="" />
          <span className="flex pl-5">Pay with something else</span>
        </div>
      </div>
      </>
  )

}
