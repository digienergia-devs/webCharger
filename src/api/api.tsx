import axios from "axios";

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

export async function authorizePayment(sessionId: any, requestBody: any) {
    const endpoint = `payment/authorize_payment?session_id=${sessionId}`;
    const payload = requestBody;

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