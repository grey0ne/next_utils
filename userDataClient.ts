import { getCookie } from "./helpers";
import { useEffect, useState } from "react";

export function useUserDataFromCookie() {
    const [userData, setUserData] = useState<any>(null);
    useEffect(() => {
        const userData = getCookie('user_data');
        try {
            const decodedUserData = window.atob(userData);
            setUserData(userData ? JSON.parse(decodedUserData) : null);
        } catch (error) {
            setUserData(null);
        }
    }, []);
    return userData;
}