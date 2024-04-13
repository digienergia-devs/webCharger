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
  const [paymentRequest, setPaymentRequest] = useState<any>();
  const [payButtonClicked, setPayButtonClicked] = useState<boolean>(false);
  const [language, setLanguage] = useState<string | undefined>(props.language)

useEffect(() => {
  console.log("Payment request --- ", paymentRequest);
}, [paymentRequest]);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: 1000, // The amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,

      });

      pr.canMakePayment().then((result) => {
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
          }).then((res) => {
          });
          ev.complete("success");
        } catch (error) {
          console.error("Payment authorization failed:", error);
        }
      });
    }
  }, [stripe]);

  const elements = useElements();

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
        }).then((res: any) => {
          // if (res.sessionId == sessionId) {
            if(res.paymentId){
            /**
             * Handle the error if above authorized payment is failed
             */
            console.log("payment authorization success");
            props.setLoading(false);
            navigate('/ChargingSessionScreen')
          }

        })


      } catch (error) {
        console.error("Payment authorization failed:", error);

      }
    }

  };

  return (
    <div className="flex flex-row">
      {paymentRequest ? (
        <button className="flex flex-row w-full bg-blue-500">Dimansha 1</button>
        // <PaymentRequestButtonElement options={{ paymentRequest }} />
      ) : (
        <button className="flex flex-row w-full bg-blue-500">Dimansha 2</button>
        // <div>
        //   <div className="flex">
        //     <div className="flex justify-center items-center">
        //       <img src={require('../../assets/icons/card.png')} alt="" />
        //     </div>
        //     <CardElement className={payButtonClicked ? 'card-element' : 'card-element'} />
        //   </div>
        //   {payButtonClicked ?
        //     <div className="flex justify-center items-center w-full">
        //       <FadeLoader
        //         color="#38A169"
        //         loading={payButtonClicked}
        //         aria-label="Loading Spinner"
        //         data-testid="loader"
        //       />
        //     </div>
        //     :
        //     <button className="flex bg-green-500 w-full text-center justify-center rounded-md text-white text-lg mt-5" onClick={handleSubmit}>
        //       Pay
        //     </button>
        //   }
        // </div>
      )}
    </div>
  );
}
