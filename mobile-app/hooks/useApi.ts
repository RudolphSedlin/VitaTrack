import { useState, useEffect } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { ENVIRONMENT_TYPE } from "env";

export function useApi<T, R>(endpoint: string, body?: R, options?: AxiosRequestConfig) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const isProduction: boolean = ENVIRONMENT_TYPE == "PROD";
    const url = (isProduction ? "https://vitatrack.com/api/" : "http://localhost:3000") + endpoint;

    async function fetchData() {
        setIsLoading(true);

        try {
            const response: AxiosResponse<T> = await axios(url, options);
            setData(response.data);
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