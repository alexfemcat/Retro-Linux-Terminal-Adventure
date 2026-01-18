import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '../types';

export const useToasts = () => {
    const [toasts, setToasts] = useState<Notification[]>([]);

    const addToast = useCallback((message: string, type: NotificationType = 'INFO', duration: number = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Notification = {
            id,
            message,
            type,
            timestamp: Date.now(),
            duration,
        };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
    };
};
