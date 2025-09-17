import { cookies } from 'next/headers'

export async function getUserDataFromCookie(): Promise<any | null> {
    const cookieStore = await cookies();
    const userData = cookieStore.get('user_data');
    try {
        if (userData?.value) {
            const decodedData = Buffer.from(userData?.value, 'base64');
            return JSON.parse(decodedData.toString('utf-8'));
        }
        return null;
    } catch (error) {
        return null;
    }
}