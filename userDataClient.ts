import { getCookie } from "./helpers";
import { useEffect, useState } from "react";

export enum UserState {
    LOADING = 'loading',
    AUTHENTICATED = 'authenticated',
    UNAUTHENTICATED = 'unauthenticated',
}

export function useUserDataFromCookie() : { userData: any, userState: UserState } {
    const [userData, setUserData] = useState<any>(null);
    const [userState, setUserState] = useState<UserState>(UserState.LOADING);
    useEffect(() => {
        const userData = getCookie('user_data');
        try {
            const decodedUserData = window.atob(userData);
            setUserData(userData ? JSON.parse(decodedUserData) : null);
        } catch (error) {
            setUserData(null);
        }
        if (userData) {
            setUserState(UserState.AUTHENTICATED);
        } else {
            setUserState(UserState.UNAUTHENTICATED);
        }
    }, []);
    return { userData, userState };
}