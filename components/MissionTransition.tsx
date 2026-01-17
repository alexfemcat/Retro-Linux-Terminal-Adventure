import React, { useEffect, useState } from 'react';

interface MissionTransitionProps {
    type: 'entering' | 'aborting';
    missionData?: {
        title: string;
        difficulty: number;
        reward: number;
        description: string;
    };
    onComplete: () => void;
}

export const MissionTransition: React.FC<MissionTransitionProps> = ({ type, missionData, onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const hasStarted = React.useRef(false);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        const sequence = type === 'entering' ? [
            ">>> INITIATING SECURE LINK...",
            ">>> BYPASSING FIREWALLS...",
            ">>> HANDSHAKE ESTABLISHED.",
            `>>> MISSION: ${missionData?.title || 'UNKNOWN'}`,
            `>>> TARGET SECTOR: ${missionData?.description.split(' ')[0] || 'CLASSIFIED'}`,
            `>>> DIFFICULTY: ${'★'.repeat(missionData?.difficulty || 1)}`,
            `>>> REWARD: ${missionData?.reward || 0} CR`,
            ">>> LOADING VIRTUAL FILE SYSTEM...",
            ">>> ACCESS GRANTED. GOOD LUCK, OPERATIVE."
        ] : [
            ">>> SIGNAL LOST.",
            ">>> TERMINATING CONNECTION...",
            ">>> WIPING TEMPORARY LOGS...",
            ">>> RETURNING TO HOMEBASE.",
            ">>> SESSION SECURED."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < sequence.length) {
                setLines(prev => [...prev, sequence[i]]);
                i++;
                setProgress((i / sequence.length) * 100);
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 1000);
            }
        }, 300);

        return () => clearInterval(interval);
    }, [type, missionData, onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-vt323 text-[#33ff00] p-10 overflow-hidden">
            <div className="w-full max-w-2xl border-2 border-[#33ff00]/30 p-8 relative bg-black shadow-[0_0_50px_rgba(51,255,0,0.1)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#33ff00]/20">
                    <div
                        className="h-full bg-[#33ff00] shadow-[0_0_10px_#33ff00]"
                        style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
                    />
                </div>

                <div className="mb-6 flex justify-between items-center opacity-50 text-sm tracking-widest uppercase">
                    <span>System Status: {type === 'entering' ? 'Connecting' : 'Disconnecting'}</span>
                    <span>Buffer: 0xFA32{Math.floor(progress)}</span>
                </div>

                <div className="space-y-2 text-xl md:text-2xl min-h-[300px]">
                    {lines.map((line, i) => (
                        <div key={i} className="flex gap-4">
                            <span className="opacity-30">[{i.toString().padStart(2, '0')}]</span>
                            <span className={i === lines.length - 1 ? "animate-pulse" : ""}>{line}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center text-sm opacity-30 animate-pulse uppercase tracking-[0.5em]">
                    {type === 'entering' ? 'Infiltrating...' : 'Exfiltrating...'}
                </div>
            </div>

            {/* CRT Scanline Overlay Effect */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[101] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
};
