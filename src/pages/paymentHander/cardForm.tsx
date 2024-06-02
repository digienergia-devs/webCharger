import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentRequestButtonElement,
  PaymentElement
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
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: props.selectedAmount, // The amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,

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
          const sessionId = sessionStorage.getItem("sessionId");
          const paymentMethodId = ev.paymentMethod.id;

          const responseData = await authorizePayment({
            paymentMethodId,
            sessionId,
            authAmount
          }).then((res) => {
          });
          ev.complete("success");
          navigate('/ChargingSessionScreen')
        } catch (error) {
          console.error("Payment authorization failed:", error);
        }
      });
    }
  }, [stripe]);



  const handleSubmit = async (event: any) => {
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
        const sessionId = sessionStorage.getItem("sessionId");
        let paymentMethodId = paymentMethod.id;
        const responseData = await authorizePayment({
          paymentMethodId,
          sessionId,
          authAmount

        }).then((res: any) => {
          if (res.paymentId) {
            props.setLoading(false);
            navigate('/ChargingSessionScreen')
          }

        })
      } catch (error) {
        console.error("Payment authorization failed:", error);

      }
    }


  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex w-full justify-center mb-5">

        </div>
        <div className="applePay">
          {paymentRequest ? <>
            <PaymentRequestButtonElement options={{ paymentRequest }} /> 
            <br />
            <PaymentElement options={{ layout: "tabs" }}/>
            </>
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
            color="#38A169"
            // loading={isLoading}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        :
        <button className="flex bg-green-500 w-full text-center justify-center rounded-md text-white text-lg mt-5" onClick={handleSubmit}>
          Pay
        </button>
      }</>
  )

}
