import { useState, useEffect } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { useToast } from "react-native-toast-notifications";

export type ApiReqType = "GET" | "POST" | "PUT" | "DELETE"

export function useApi<T, R>(endpoint: string, requestType: ApiReqType, body?: R): [T | null, boolean, unknown, () => Promise<void>] {
    const toast = useToast();
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const ENVIRONMENT_TYPE: string = "PROD";
    const isProduction: boolean = ENVIRONMENT_TYPE == "PROD";
    const isRyans: boolean = ENVIRONMENT_TYPE == "RYAN";
    const url = (isRyans ? "http://192.168.1.240:3000" : (isProduction ? "http://ec2-18-234-48-168.compute-1.amazonaws.com:80" : "http://192.168.1.21:3000")) + endpoint;

    async function fetchData() {
        setIsLoading(true);
        let response: AxiosResponse<T> | undefined = undefined;

        try {
            if (requestType == "GET") {
                response = await axios.get(url, { withCredentials: true });
                setData(response!.data);
            } else if (requestType == "POST" && body != undefined) {
                response = await axios.post(url, body, { withCredentials: true });
                setData(response!.data);
            } else if (requestType == "POST") {
                toast.show("POST Request must contain body data!");
                setError("POST Request must contain body data!");
            } else if (requestType == "DELETE") {
                response = await axios.delete(url, { withCredentials: true });
                setData(response!.data);
            } else if (requestType == "PUT" && body != undefined) {
                console.log("useApi:", body);
                response = await axios.put(url, body, { withCredentials: true });
                console.log("userApi response = ", response);
                setData(response!.data);
            } else if (requestType == "PUT") {
                toast.show("PUT Request must contain body data!");
                setError("PUT Request must contain body data!");
            }
        } catch (e) {
            console.log(e);
            console.log("userApi response = ", response);
            setError(e);
        } 

        setIsLoading(false);
    }

    return [data, isLoading, error, fetchData];
}
