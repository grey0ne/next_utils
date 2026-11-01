import { getCookie } from "./helpers";
import { useMemo, useSyncExternalStore } from "react";

export enum UserState {
    LOADING = 'loading',
    AUTHENTICATED = 'authenticated',
    UNAUTHENTICATED = 'unauthenticated',
}

function subscribe() {
    return () => {};
}

export function useUserDataFromCookie() : { userData: any, userState: UserState } {
    const userDataCookie = useSyncExternalStore(subscribe, () => getCookie('user_data'), () => null);
    return useMemo(() => {
        if (userDataCookie === null) {
            return { userData: null, userState: UserState.LOADING };
        }
        if (!userDataCookie) {
            return { userData: null, userState: UserState.UNAUTHENTICATED };
        }
        try {
            return { userData: JSON.parse(window.atob(userDataCookie)), userState: UserState.AUTHENTICATED };
        } catch {
            return { userData: null, userState: UserState.AUTHENTICATED };
        }
    }, [userDataCookie]);
}