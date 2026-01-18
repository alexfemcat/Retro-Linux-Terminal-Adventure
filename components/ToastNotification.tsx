import React from 'react';
import { Notification } from '../types';

interface ToastProps {
    notification: Notification;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
    const getTypeStyles = () => {
        switch (notification.type) {
            case 'CRITICAL':
                return 'border-red-500 text-red-500 bg-red-950/30';
            case 'WARNING':
                return 'border-yellow-500 text-yellow-500 bg-yellow-950/30';
            case 'SUCCESS':
                return 'border-green-500 text-green-500 bg-green-950/30';
            case 'INFO':
            default:
                return 'border-cyan-500 text-cyan-500 bg-cyan-950/30';
        }
    };

    return (
        <div
            className={`mb-2 p-3 border-l-4 shadow-lg animate-slide-in-right font-mono text-sm relative overflow-hidden ${getTypeStyles()}`}
            style={{ minWidth: '250px', maxWidth: '350px' }}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                    <div className="font-bold text-xs mb-1 opacity-70">
                        [{notification.type}] {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                    <div>{notification.message}</div>
                </div>
                <button
                    onClick={() => onClose(notification.id)}
                    className="hover:opacity-100 opacity-50 transition-opacity"
                >
                    [X]
                </button>
            </div>
            {/* Scanline effect overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-scanlines"></div>
        </div>
    );
};

interface ToastContainerProps {
    toasts: Notification[];
    removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map((toast) => (
                    <Toast key={toast.id} notification={toast} onClose={removeToast} />
                ))}
            </div>
        </div>
    );
};
