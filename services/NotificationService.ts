import { NotificationType } from '../types';

type ToastCallback = (message: string, type: NotificationType, duration?: number) => void;

class NotificationService {
    private static instance: NotificationService;
    private addToastCallback: ToastCallback | null = null;

    private constructor() { }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    registerToastCallback(callback: ToastCallback) {
        this.addToastCallback = callback;
    }

    notify(message: string, type: NotificationType = 'INFO', duration: number = 5000) {
        if (this.addToastCallback) {
            this.addToastCallback(message, type, duration);
        } else {
            console.warn('NotificationService: No toast callback registered');
        }
    }

    info(message: string, duration?: number) {
        this.notify(message, 'INFO', duration);
    }

    success(message: string, duration?: number) {
        this.notify(message, 'SUCCESS', duration);
    }

    warning(message: string, duration?: number) {
        this.notify(message, 'WARNING', duration);
    }

    critical(message: string, duration?: number) {
        this.notify(message, 'CRITICAL', duration);
    }
}

export const notificationService = NotificationService.getInstance();
