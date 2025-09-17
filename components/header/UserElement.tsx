'use client'
import { useUserDataFromCookie } from "@/next_utils/userDataClient";
import { Typography } from "@mui/material";

export function UserElement() {
    const userData = useUserDataFromCookie();
    if (!userData) {
        return null;
    }
    return (
        <Typography variant="body1">
            {userData.username}
        </Typography>
    )
}