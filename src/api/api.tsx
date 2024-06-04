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
    const endpoint = `chargepoint/authorize_payment?session_id=${sessionId}`;
    const payload = requestBody;

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        console.error("Error:", error.response);
        throw error.response;
    }
}

export async function startChargingSession(sessionId: any) {
    const endpoint = "/api/start-charging-session";
    const payload = { sessionId: sessionId };

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        throw error.response;
    }
}

export async function stopChargingSession(sessionId: any) {
    const endpoint = "/api/stop-charging-session";
    const payload = { sessionId: sessionId };

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        throw error.response;
    }
}

export async function chargingSessionStatus(sessionId: any) {
    const endpoint = "/api/charging-session-status";
    const payload = { sessionId: sessionId };

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        throw error.response;
    }
}