import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {SWRConfig} from "swr";

async function fetcher(...args: [RequestInfo, RequestInit | undefined]) {
    try {
        const response = await fetch(...args);
        // if the server replies, there's always some data in json
        // if there's a network error, it will throw at the previous line
        const data = await response.json();

        if (response.ok)
            return data;

        const error = new Error(response.statusText) as Error & { response: Response, data: any };
        error.response = response;
        error.data = data;
        throw error;
    }
    catch (error: any) {
        if (!error.data)
            error.data = {message: error.message};
        throw error;
    }
}

function App({Component, pageProps}: AppProps) {
    return (
        <SWRConfig
            value={{
                fetcher,
                onError: console.error
            }}>
            <Component {...pageProps} />
        </SWRConfig>
    );
}

export default App;
