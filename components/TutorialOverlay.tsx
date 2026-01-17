import React, { useEffect, useState } from 'react';

interface TutorialOverlayProps {
    message: string;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ message }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsTyping(true);
        const speed = 20; // ms per char

        const interval = setInterval(() => {
            setDisplayedText(prev => {
                if (prev.length < message.length) {
                    return prev + message.charAt(prev.length);
                }
                setIsTyping(false);
                clearInterval(interval);
                return prev;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [message]);

    return (
        <div className="absolute bottom-12 right-12 max-w-md z-50 pointer-events-none">
            <div className={`
                bg-black/90 border-2 border-cyan-500 rounded-lg p-4 
                shadow-[0_0_20px_rgba(6,182,212,0.3)] 
                backdrop-blur-sm transition-all duration-300
                ${isTyping ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)]' : 'border-cyan-900'}
            `}>
                <div className="flex items-center gap-2 mb-2 border-b border-cyan-900/50 pb-1">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-cyan-400 animate-ping' : 'bg-cyan-600'}`} />
                    <span className="text-xs font-bold text-cyan-500 tracking-widest uppercase">The Architect</span>
                </div>
                <div className="font-mono text-sm text-cyan-100 whitespace-pre-wrap leading-relaxed">
                    {displayedText}
                    <span className="animate-pulse text-cyan-500">_</span>
                </div>
            </div>
        </div>
    );
};
