import { useState, useEffect } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { ENVIRONMENT_TYPE } from "env";
import { useToast } from "react-native-toast-notifications";

export type ApiReqType = "GET" | "POST" | "PUT" | "DELETE"

export function useApi<T, R>(endpoint: string, requestType: ApiReqType, body?: R) {
    const toast = useToast();
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const isProduction: boolean = ENVIRONMENT_TYPE == "PROD";
    const url = (isProduction ? "https://vitatrack.com/api/" : "http://localhost:3000") + endpoint;

    async function fetchData() {
        setIsLoading(true);

        try {
            if (requestType == "GET") {
                const response: AxiosResponse<T> = await axios.get(url, { withCredentials: true });
                setData(response.data);
            } else if (requestType == "POST" && body != undefined) {
                const response: AxiosResponse<T> = await axios.post(url, body, { withCredentials: true });
                setData(response.data);
            } else if (requestType == "POST") {
                toast.show("POST Request must contain body data!");
                setError("POST Request must contain body data!");
            } else if (requestType == "DELETE") {
                const response: AxiosResponse<T> = await axios.delete(url, { withCredentials: true });
                setData(response.data);
            } else if (requestType == "PUT" && body != undefined) {
                const response: AxiosResponse<T> = await axios.put(url, body);
                setData(response.data);
            } else if (requestType == "PUT") {
                toast.show("PUT Request must contain body data!");
                setError("PUT Request must contain body data!");
            }
        } catch (e) {
            setError(e);
        } 

        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return { data, isLoading, error };
}