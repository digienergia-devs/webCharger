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
export default function  CardForm(props: any) {
  let navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<any>();
  const [payButtonClicked, setPayButtonClicked] = useState<boolean>(false);
  const [language, setLanguage] = useState<string | undefined>(props.language)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false); // use to set the state when the payment is success on stripe.


  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: 1000,
           
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
          }).then((res) => {
            // Handle response
          }).catch((error) => {
            // Handle error
          });
        } catch (error) {
          // Handle error
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

    console.log("payment method --- ", paymentMethod)

    if (paymentMethod && paymentMethod.type === "card") {
      // Handle card payment
      console.log("payment method card --- ", paymentMethod)
    } else if (paymentMethod && paymentMethod.type === "apple_pay") {
      // Handle Apple Pay payment
      console.log("payment method apple pay --- ", paymentMethod)
    } else {
      console.error("Unsupported payment method");
      console.log("Unsupported payment method")
    }

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
            if(res.paymentId){
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
      
        <div>
          <div className="flex">
            {/* <div className="flex justify-center items-center">
              <img src={require('../../assets/icons/card.png')} alt="" />
            </div> */}
            <div className="applePay">
            {paymentRequest ? <>
              <PaymentRequestButtonElement options={{paymentRequest}}/> </>
            : <>
            </>
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
                loading={payButtonClicked}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
            :
            <button className="flex bg-green-500 w-full text-center justify-center rounded-md text-white text-lg mt-5" onClick={handleSubmit}>
              Pay
            </button>
          }
        </div>
      
    </div>
  );
}
