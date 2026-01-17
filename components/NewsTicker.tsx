import React, { useState, useEffect } from 'react';
import { worldEvents } from '../data/gameData';
import { WorldEvent } from '../types';

interface NewsTickerProps {
    onEvent: (event: WorldEvent) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ onEvent }) => {
    const [currentEvent, setCurrentEvent] = useState<WorldEvent | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            // 20% chance to trigger a random world event every 5 minutes
            if (Math.random() > 0.8) {
                const event = worldEvents[Math.floor(Math.random() * worldEvents.length)];
                if (event.breaking) {
                    setCurrentEvent(event);
                    onEvent(event);
                    // Clear after 30 seconds
                    setTimeout(() => setCurrentEvent(null), 30000);
                }
            }
        }, 300000); // Every 5 minutes

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
