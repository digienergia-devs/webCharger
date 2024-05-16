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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const selectAmountHandler = (amount: number) => {
    setSelectedAmount(amount);
  }

  useEffect(() => {
    if(selectedAmount > 0 ){
      createPaymentMethod();
    }
  }, [selectedAmount])

  const createPaymentMethod = () => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: selectedAmount,
           
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
    } else {
      setTimeout(() => {
        createPaymentMethod();
      }, 2000)
    }
  }

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: selectedAmount,
           
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
  }, [stripe, selectedAmount]);



  const handleSubmit = async (event: any) => {
    props.setLoading(true);
    setPayButtonClicked(true)
    setIsLoading(true);
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

    // if (paymentMethod && paymentMethod.type === "card") {
    //   // Handle card payment
    //   console.log("payment method card --- ", paymentMethod)
    // } else if (paymentMethod && paymentMethod.type === "apple_pay") {
    //   // Handle Apple Pay payment
    //   console.log("payment method apple pay --- ", paymentMethod)
    // } else {
    //   console.error("Unsupported payment method");
    //   console.log("Unsupported payment method")
    // }

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

  const SelectAmountComponent = () => {
    return (
      <div className="flex flex-row justify-around  pb-4">
        <div className={selectedAmount == 1000 ? 'flex bg-green-500 rounded-md border border-green-500 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-green-500 p-2'} onClick={() => selectAmountHandler(1000)}>€10</div>
        <div className={selectedAmount == 2000 ? 'flex bg-green-500 rounded-md border border-green-500 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-green-500 p-2'} onClick={() => selectAmountHandler(2000)}>€20</div>
        <div className={selectedAmount == 4000 ? 'flex bg-green-500 rounded-md border border-green-500 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-green-500 p-2'} onClick={() => selectAmountHandler(4000)}>€40</div>
        <div className={selectedAmount == 6000 ? 'flex bg-green-500 rounded-md border border-green-500 p-2 text-white' : 'flex bg-gray-100 rounded-md border border-green-500 p-2'} onClick={() => selectAmountHandler(6000)}>€60</div>
      </div>
    )
  }

  const PaymentMethodsComponent = () => {
    return (
      <>
      <div className="flex flex-col">
        <div className="flex w-full justify-center mb-5">
        <div className="flex bg-gray-100 rounded-md border border-green-500 p-2" onClick={() => selectAmountHandler(0)}> €{selectedAmount/100} </div>
        </div>
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
                loading={isLoading}
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
  

  return (
    <div className="flex flex-row">
      
        <div style={{ width: "70vw" }}>
          {(selectedAmount == 0) 
          ?
          <SelectAmountComponent />            
          :
          <PaymentMethodsComponent />
        }
        </div>
      
    </div>
  );
}
