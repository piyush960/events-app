import axios from "axios"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const processAuth = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/process-auth`, {
      method: "GET",
      withCredentials: true,
      validateStatus: (status) => {
        return status === 302;
      }
    });
    return response.data.authUrl;
  } catch (error) {
    console.error(error)
  }
}

export const exchangeTokens = async (oauthCode) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/oauth2callback?oauthCode=${oauthCode}`, {
      method: "GET",
      withCredentials: true,
      validateStatus: (status) => {
        return status === 302;
      }
    })
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const logoutUser = async (token) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/logout?token=${token}`, {
      method: "GET",
      withCredentials: true,
    })
  } catch (error) {
    console.error(error);
  }
}

export const get_events = async (tokens) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/events?tokens=${tokens}`, {
      method: "GET",
      withCredentials: true,
    })
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}

export const add_event = async (data) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/events`, data, {
      method: "POST", 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error(error);
  }
}

export const update_event = async (data) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/api/events`, data, {
      method: "PUT", 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error(error);
  }
}

export const delete_event = async (eventId, tokens) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/api/events?eventId=${eventId}&tokens=${tokens}`, {
      method: "DELETE", 
      withCredentials: true,
    })
  } catch (error) {
    console.error(error);
  }
}
