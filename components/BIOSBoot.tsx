import React, { useState, useEffect } from 'react';
import { HardwareSpecs } from '../types';

interface BIOSBootProps {
    hardware: HardwareSpecs;
    onComplete: () => void;
}

const BIOSBoot: React.FC<BIOSBootProps> = ({ hardware, onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const bootLines = [
        "RETRO-BIOS v2.0.4 - RELEASE 1998",
        "COPYRIGHT (C) 1998 RETRO-VISION CORP.",
        "--------------------------------------",
        `CPU: ${hardware.cpu.id.toUpperCase()} @ ${hardware.cpu.clockSpeed.toFixed(1)}GHz ... OK`,
        `CORES: ${hardware.cpu.cores} LOGICAL PROCESSORS FOUND`,
        `MEMORY: ${hardware.ram.capacity * 1024} KB ... CHECKING`,
        `MEMORY: OK`,
        `STORAGE: ${hardware.storage.id.toUpperCase()} [${hardware.storage.capacity}GB] ... ONLINE`,
        "VFS: MOUNTING /dev/sda1 ON / ... OK",
        `NETWORK: ${hardware.network.id.toUpperCase()} ... INITIALIZING`,
        "DHCP: REQUESTING IP ... 192.168.1.100 OBTAINED",
        "COOLING: SYSTEM TEMPERATURE 32°C ... STABLE",
        "--------------------------------------",
        "INITIATING SYSTEM HANDSHAKE...",
        "AUTHENTICATING FIRMWARE...",
        "WELCOME BACK, OPERATIVE.",
    ];

    useEffect(() => {
        if (currentIndex < bootLines.length) {
            // Speed up the first few lines, slow down for "checking" parts
            const currentLine = bootLines[currentIndex];
            let delay = 150;

            if (currentLine.includes('CHECKING') || currentLine.includes('INITIALIZING')) {
                delay = 600;
            } else if (currentLine.includes('WELCOME')) {
                delay = 800;
            } else {
                delay = 100 + Math.random() * 200;
            }

            const timer = setTimeout(() => {
                setLines(prev => [...prev, currentLine]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                onComplete();
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black p-12 font-mono text-green-500 overflow-hidden relative selection:bg-green-500 selection:text-black">
            <div className="z-10 space-y-1 min-w-[300px] md:min-w-[450px]">
                {lines.map((line, i) => {
                    const isCyan = line.includes('WELCOME');
                    const isYellow = line.includes('HANDSHAKE') || line.includes('AUTHENTICATING');
                    const isHeader = i < 2;

                    return (
                        <div
                            key={i}
                            className={`
                                ${isCyan ? 'text-cyan-400 font-bold' : ''} 
                                ${isYellow ? 'text-amber-500' : ''}
                                ${isHeader ? 'opacity-70 text-xs' : 'text-sm md:text-base'}
                                animate-[typing_0.2s_steps(20)_forwards]
                                overflow-hidden whitespace-nowrap
                            `}
                        >
                            {line}
                        </div>
                    );
                })}
                {currentIndex < bootLines.length && (
                    <div className="w-2 h-4 md:h-5 bg-green-500 animate-pulse inline-block align-middle ml-1"></div>
                )}
            </div>

            {/* Retro CRT Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none animate-scanline z-20"></div>
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-30"></div>
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%)]"></div>
        </div>
    );
};

export default BIOSBoot;
