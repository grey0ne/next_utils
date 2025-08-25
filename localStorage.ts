import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string): [T | null, (value: T) => void] {
    const [value, setValue] = useState<T | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(key);
        setValue(stored ? JSON.parse(stored) as T : null);
    }, [key]);

    const externalSetValue = (value: T) => {
        setValue(value);
        localStorage.setItem(key, JSON.stringify(value));
    }

    return [value, externalSetValue];
}