import Script from "next/script";

type CountersProps = {
    gtag_id?: string,
    ym_id?: string,
}

export function Counters({ gtag_id, ym_id }: CountersProps) {
    if (process.env.NODE_ENV !== 'production') {
        return null;
    }
    let ymMetricCounter;
    let googleAnalyticsCounter;
    let googleAnalyticsScript;


    if (ym_id) {
        ymMetricCounter = (
            <Script id="yandex_metrica">
                {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym("${ym_id}", "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true
                });`}
            </Script>
        );
    }
    if (gtag_id) {
        const gtag_url = `https://www.googletagmanager.com/gtag/js?id=${gtag_id}`;
        googleAnalyticsScript = <Script src={gtag_url}/>;
        googleAnalyticsCounter = (
            <Script id="google_analytics">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gtag_id}');
                `}
            </Script>
        );
    }
    return (
        <>
            { ymMetricCounter }
            { googleAnalyticsScript }
            { googleAnalyticsCounter }
        </>
    )
}