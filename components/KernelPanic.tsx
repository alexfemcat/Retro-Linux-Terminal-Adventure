import React, { useEffect, useState, useRef } from 'react';

interface KernelPanicProps {
    onReboot: () => void;
}

export const KernelPanic: React.FC<KernelPanicProps> = ({ onReboot }) => {
    const [lines, setLines] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const generateHex = () => {
        return Array(8).fill(0).map(() =>
            Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase()
        ).join(' ');
    };

    useEffect(() => {
        const initialLines = [
            "KERNEL PANIC - NOT SYNCING: FATAL EXCEPTION 0x0000001E",
            "CPU: 0 PID: 0 Comm: swapper Not tainted 4.4.0-31-generic #50-Ubuntu",
            "Hardware name: RETRO-TERM-2000 (v2.1)",
            "task: ffffffff81e13500 ti: ffffffff81e00000 task.ti: ffffffff81e00000",
            "RIP: 0010:[<ffffffff810634f6>]  [<ffffffff810634f6>] native_safe_halt+0x6/0x10",
            "RSP: 0018:ffffffff81e03e90  EFLAGS: 00000246",
            "RAX: 0000000000000000 RBX: 0000000000000000 RCX: 0000000000000000",
            "RDX: 0000000000000000 RSI: 0000000000000000 RDI: 0000000000000000",
            "RBP: ffffffff81e03e90 R08: 0000000000000000 R09: 0000000000000000",
            "R10: 0000000000000000 R11: 0000000000000000 R12: 0000000000000000",
            "Call Trace:",
            " [<ffffffff810d7a0c>] default_idle+0x1c/0xd0",
            " [<ffffffff810d80bf>] arch_cpu_idle+0xf/0x20",
            " [<ffffffff8108d48a>] default_idle_call+0x2a/0x40",
            " [<ffffffff8108d7e7>] cpu_startup_entry+0x2f7/0x350",
            " [<ffffffff81f4a667>] rest_init+0x77/0x80",
            " [<ffffffff81f50f78>] start_kernel+0x448/0x455",
            " [<ffffffff81f50120>] ? early_idt_handler_array+0x120/0x120",
            " [<ffffffff81f5032d>] x86_64_start_reservations+0x2a/0x2c",
            " [<ffffffff81f5046e>] x86_64_start_kernel+0x13d/0x14c",
            "",
            "Code: 00 00 00 00 00 55 48 89 e5 fb f4 5d c3 0f 1f 84 00 00 00 00 00 55 48 89 e5 f4 5d c3 66 0f 1f 44 00 00 55 48 89 e5 fb f4 5d c3 <90> 90 90 90 90 90 90 90 90 90 90 90 90 90 90 90",
            "CR2: 0000000000000000"
        ];
        setLines(initialLines);

        // Fast scroll effect
        const interval = setInterval(() => {
            setLines(prev => {
                const newLine = `[${Math.random().toFixed(6)}] ${generateHex()} ${generateHex()} ${generateHex()}`;
                if (prev.length > 30) return [...prev.slice(1), newLine];
                return [...prev, newLine];
            });
        }, 50);

        // Reboot timer
        const timer = setTimeout(onReboot, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [onReboot]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="w-full h-full bg-blue-900 text-white p-8 font-mono overflow-hidden flex flex-col cursor-none">
            <div className="text-sm mb-4">
                <span className="bg-white text-blue-900 px-2 font-bold">Linux</span> Kernel Panic
            </div>
            <div ref={scrollRef} className="flex-grow overflow-hidden font-bold text-xs md:text-sm leading-tight opacity-90">
                {lines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">{line}</div>
                ))}
            </div>
            <div className="mt-4 animate-pulse bg-white/10 p-2 text-center text-yellow-300 font-bold">
                SYSTEM HALTED. REBOOTING IN 5 SECONDS...
            </div>
        </div>
    );
};
