"use client";
import { useEffect } from "react";


declare global {
    interface Window {
        TelegramLoginWidget: any;
        onTelegramAuth: (user: any) => void;
    }
}

type TelegramLoginProps = {
    botUsername: string;
    onSuccess: (user: any) => void;
}

export function TelegramLogin({ botUsername, onSuccess }: TelegramLoginProps) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", botUsername);
        script.setAttribute("data-size", "large");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write"); // "write" = requests send messages permission
        document.getElementById("telegram-login")?.appendChild(script);

        window.onTelegramAuth = (user: any) => {
            console.log("Telegram auth success:", user);
            fetch("/api/auth/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            }).then((res) => res.json()).then((data) => {
                console.log("Login success:", data);
                onSuccess(data);
            }).catch((err) => console.error("Login failed", err));
        };
    }, []);

    return <div id="telegram-login"></div>;
}
