'use client'
import { useUserDataFromCookie, UserState } from "@/next_utils/userDataClient";
import { Typography } from "@mui/material";

export function UserElement() {
    const { userData, userState } = useUserDataFromCookie();
    if (userState !== UserState.AUTHENTICATED) {
        return null;
    }
    return (
        <Typography variant="body1">
            {userData.username}
        </Typography>
    )
}