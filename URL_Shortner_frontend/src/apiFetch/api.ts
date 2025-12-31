import axios, {type AxiosInstance, type AxiosResponse} from "axios";

const origin = window.location.origin;

const API: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});



export async function createShortUrl(URL: string): Promise<string> {
    const res:AxiosResponse = await API.post("/shorten", {
        url:URL,
    });

    return `${origin}/${res.data.short_code}`;
}

export async function getShortUrl(code: string): Promise<string> {
    const res:AxiosResponse = await API.get(`/shorten/${code}`);

    return res.data.url;
}

export async function updateOriginaltUrl(code: string, newUrl: string): Promise<string> {
    const res:AxiosResponse = await API.put(`/shorten/${code}`,{
        url:newUrl,
    });

    return res.status.toString();
}

export async function deleteShortUrl(code: string): Promise<string> {
    const res:AxiosResponse = await API.delete(`/shorten/${code}`);

    return res.status.toString();
}

export async function getShortUrlStats(code: string): Promise<number> {
    const res:AxiosResponse = await API.get(`/shorten/${code}/stats`);

    return res.data.accessCount;
}