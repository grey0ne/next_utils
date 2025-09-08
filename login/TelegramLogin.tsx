"use client";
import { useEffect } from "react";
import { TelegramLoginProps } from "./types";
import { untypedApiRequest } from "../apiClient";


declare global {
    interface Window {
        TelegramLoginWidget: any;
        onTelegramAuth: (user: any) => void;
    }
}

export function TelegramLogin({ botUsername, onSuccess }: TelegramLoginProps) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", botUsername);
        script.setAttribute("data-size", "large");
        script.setAttribute("data-auth-url", "/complete/telegram/");
        script.setAttribute("data-request-access", "write"); // "write" = requests send messages permission
        document.getElementById("telegram-login")?.appendChild(script);

        window.onTelegramAuth = (user: any) => {
            console.log("Telegram auth success:", user);
            const telegramData = {
                auth_date: user.auth_date,
                first_name: user.first_name,
                last_name: user.last_name,
                photo_url: user.photo_url,
                username: user.username,
                hash: user.hash,
                id: user.id
            }
            untypedApiRequest("/api/auth/telegram", "post", telegramData).then((data) => {
                console.log("Login success:", data);
                onSuccess?.(data);
            }).catch((err) => console.error("Login failed", err));
        };
    }, []);

    return <div id="telegram-login"></div>;
}
