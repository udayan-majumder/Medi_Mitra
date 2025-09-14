import axios from "axios";

export const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials:true
})

export const modelapi = axios.create({
    baseURL:process.env.NEXT_PUBLIC_MODEL_URL,
})