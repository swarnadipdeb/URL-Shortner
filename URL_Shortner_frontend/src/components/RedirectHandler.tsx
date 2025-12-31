import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {getShortUrl} from "@/apiFetch/api.ts";

export default function RedirectHandler() {
    const { code } = useParams();

    useEffect(() => {
        if (!code || code === "404") return;

        const resolve = async () => {
            try {
                const data  = await getShortUrl(code);

                if (data) {
                    window.location.replace(data);
                } else {
                    window.location.replace("/404");
                }
            } catch {
                window.location.replace("/404");
            }
        };

        resolve();
    }, [code]);

     return null;// no UI shown
}


