"use client";
import { useEffect } from "react";
import Script from "next/script";
import { YandexLoginProps } from "./types";


export function YandexLogin({ 
    onSuccess, 
    domain,
    clientId,
}: YandexLoginProps) {

    // Yandex JS flow is not working with python social core. Need Further investigation to fix it
    const redirectUri = `${domain}/complete/yandex-oauth2/`
    function initButton() {
        if (!(window as any).YaAuthSuggest) {
            // Script is not loaded yet
            return
        }
        (window as any).YaAuthSuggest.init(
            {
                client_id: clientId,
                response_type: 'code',
                redirect_uri: redirectUri,
            },
            domain, 
            {
                view: 'button',
                parentId: 'yandex_button_container',
                buttonView: 'main',
                buttonTheme: 'light',
                buttonSize: 'xl',
                buttonBorderRadius: 4
            }
        ).then((result: any) => result.handler())
        .then(onSuccess)
    }

    useEffect(() => {
        // This is needed for subsequent mounting of the component, when script is loaded
        const element = document.getElementById('yandex_button_container');
        if (element && element.childNodes.length === 0) {
            initButton()
        }
    }, [])

    return (
        <>
            <Script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-latest.js" onLoad={() => {
                initButton()
            }}/>
            <div id="yandex_button_container" style={{ width: '100%', height: '50px' }} />
        </>
    );
}
