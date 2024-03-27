import axios from "axios";

const API_BASE_URL = "/";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export async function startChargerConnection(chargerID: any) {
    const endpoint = "/api/start-charger-connection";
    const payload = chargerID;

    try {
        const response = await api.post(endpoint, payload);
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

export async function checkConnectionStatus(chargerID: any) {
    const endpoint = "/api/connection-status";
    const payload = { chargerID };

    try {
        const response = await api.post(endpoint, payload);
        return response.data;
    } catch (error: any) {
        console.error("Error:", error.response);
        throw error.response;
    }
}

export async function authorizePayment({ paymentMethodId, sessionId }: any) {
    const endpoint = "/api/payment-authorization";
    const payload = { paymentMethodToken: paymentMethodId, sessionId: sessionId };

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