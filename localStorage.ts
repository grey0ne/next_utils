import { useCallback, useMemo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    window.addEventListener('storage', listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', listener);
    };
}

export function useLocalStorage<T>(key: string): [T | null, (value: T) => void] {
    const stored = useSyncExternalStore(subscribe, () => localStorage.getItem(key), () => null);
    const value = useMemo(() => stored ? JSON.parse(stored) as T : null, [stored]);

    const externalSetValue = useCallback((value: T) => {
        localStorage.setItem(key, JSON.stringify(value));
        listeners.forEach(listener => listener());
    }, [key]);

    return [value, externalSetValue];
}
