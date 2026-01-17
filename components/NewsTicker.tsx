import React, { useState, useEffect } from 'react';
import { worldEvents } from '../data/gameData';

interface NewsTickerProps {
    onEvent: (event: any) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ onEvent }) => {
    const [currentEvent, setCurrentEvent] = useState<any | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const event = worldEvents[Math.floor(Math.random() * worldEvents.length)];
            setCurrentEvent(event);
            onEvent(event);
        }, 60000); // Every minute

        return () => clearInterval(interval);
    }, [onEvent]);

    if (!currentEvent) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 w-full bg-red-900 text-white p-2 text-center text-lg font-bold">
            <p>BREAKING NEWS: {currentEvent.title} - {currentEvent.description}</p>
        </div>
    );
};
