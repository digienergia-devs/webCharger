import axios from "axios";
import { useState } from "react";

// const API_BASE_URL = "https://ipark.sytes.net/service1";
const API_BASE_URL = "https://digi-energia-csms.fly.dev/";

const api = axios.create({
    baseURL: API_BASE_URL,
});



export async function startChargerConnection(chargerID: string, connectorID: string) {
    console.log("chargerID --- ", chargerID);
    console.log("connectorID --- ", connectorID);
    const endpoint = `chargepoint/${chargerID}/${connectorID}`;

    /* { this should be in the request body
        "chargerID": "f9f16925-28b8-4ba5-99f2-d8080f0860f3-2",
        "userID": "4dc7736d-b6e9-4006-a3a6-51653cc6cd53"
    } */

    try {
        const response = await api.get(endpoint);
        if (response.status == 200) {
            return (response.data)
        } else {
            return ('error')
        }
    } catch (error: any) {
        console.error("Error:", error.response);
        throw error.response;
    }
}

export async function authorizePayment(chargerID: string, connectorID: string, requestBody: any) {
    const endpoint = `payment/authorize_payment?charge_point_id=${chargerID}&connector_id=${connectorID}`;
    const payload = requestBody;
    console.log("authorize body --- ", payload);

    try {
        const response = await api.post(endpoint, payload);
         return response.data;
    } catch (error: any) {
        console.error("Error:", error.response);
        throw error.response;
    }
}

export async function startChargingSession(transactionId: any) {
    const endpoint = `chargepoint/start_transaction?transaction_id=${transactionId}`;
    const payload = {  };

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        throw error.response;
    }
}

export async function stopChargingSession(transaction_id: any) {
    const endpoint = `chargepoint/stop_transaction?transaction_id=${transaction_id}`;
    const payload = { };

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        throw error.response;
    }
}

export async function chargingSessionStatus(transactionId: any) {
    const endpoint = `chargepoint/meter_values?transaction_id=${transactionId}`;
    const payload = { };

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        throw error.response;
    }
}

export async function getChargingSummary(transactionId: string | null){
    if(transactionId !== null){

        const endpoint = `payment/get_payment_summary?transaction_id=${transactionId}`;
        try {
            const response = await api.get(endpoint);
            return response.data;
        } catch (error: any) {
            throw error.response;
        }
    }
}

export async function validateOtp(transactionId: any, otp: string) {
    console.log("OTP --- ", otp);
    console.log("transaction id --- ", transactionId)
    const endpoint = `/authentication/validate_otp?transaction_id=${transactionId}&otp=${otp}`;
    const payload = { };

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        throw error.response;
    }
}

export async function sendEmailInvoice(requestOption: any){
    const endpoint = `/invoices/payment_receipt`;
    const payload = requestOption;

    try {
        const response = await api.post(endpoint, payload);
        return response;
    } catch (error: any) {
        throw error.response;
    }


}