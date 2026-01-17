import React from 'react';
import type { PlayerState } from '../types';
import { PerformanceStats } from '../hooks/usePerformance';

interface TaskManagerProps {
    playerState: PlayerState;
    performance: PerformanceStats;
    activeProcesses: { id: string; name: string; ram: number }[];
    onKill: (id: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
    playerState,
    performance,
    activeProcesses,
    onKill
}) => {
    const { storageUsed, storageCapacity } = performance;

    return (
        <div className="w-full h-full bg-black/90 border-2 border-cyan-500/30 rounded-lg font-mono text-[11px] text-cyan-400 select-none backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-3 bg-cyan-500/10 border-b border-cyan-500/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="font-bold tracking-tighter uppercase text-white">System Monitor v2.1</span>
                </div>
            </div>

            <div className="p-4 space-y-6 flex-grow overflow-y-auto custom-scrollbar">
                {/* Gauges */}
                <div className="grid grid-cols-1 gap-4">
                    {/* CPU */}
                    <div>
                        <div className="flex justify-between text-[10px] mb-1">
                            <span>CPU_LOAD</span>
                            <span className={performance.cpuLoad > 80 ? 'text-red-500' : 'text-cyan-400'}>{performance.cpuLoad.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 border border-cyan-900/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${performance.cpuLoad > 80 ? 'bg-red-500' : 'bg-cyan-500'}`}
                                style={{ width: `${performance.cpuLoad}%` }}
                            />
                        </div>
                    </div>

                    {/* RAM */}
                    <div>
                        <div className="flex justify-between text-[10px] mb-1">
                            <span>MEM_USAGE</span>
                            <span className={performance.isThrashing ? 'text-red-500 animate-pulse' : 'text-cyan-400'}>{performance.ramUsed.toFixed(1)} / {performance.ramCapacity} GB</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 border border-cyan-900/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${performance.isThrashing ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(100, (performance.ramUsed / performance.ramCapacity) * 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* DISK */}
                    <div>
                        <div className="flex justify-between text-[10px] mb-1">
                            <span>STORAGE</span>
                            <span className={storageUsed / storageCapacity > 0.9 ? 'text-red-500' : 'text-cyan-400'}>{(storageUsed / 1024).toFixed(2)} / {(storageCapacity / 1024).toFixed(2)} GB</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 border border-cyan-900/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${storageUsed / storageCapacity > 0.9 ? 'bg-red-500' : 'bg-amber-500'}`}
                                style={{ width: `${Math.min(100, (storageUsed / storageCapacity) * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Process List */}
                <div className="border-t border-cyan-900/30 pt-4">
                    <h4 className="text-gray-500 uppercase text-[9px] mb-2">Active Processes</h4>
                    {activeProcesses.length === 0 ? (
                        <div className="text-gray-700 italic text-center py-2">IDLE</div>
                    ) : (
                        <div className="space-y-1">
                            <div className="grid grid-cols-[1fr_60px_40px] text-[8px] text-gray-600 border-b border-gray-900 pb-1 mb-1">
                                <span>PROCESS_NAME</span>
                                <span>MEMORY</span>
                                <span>ACTION</span>
                            </div>
                            {activeProcesses.map((p) => (
                                <div key={p.id} className="grid grid-cols-[1fr_60px_40px] items-center text-[10px] group">
                                    <span className="text-white truncate">{p.name}</span>
                                    <span className="text-blue-400">{p.ram.toFixed(2)}G</span>
                                    <button
                                        onClick={() => onKill(p.id)}
                                        className="bg-red-900/20 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white rounded px-1 transition-all"
                                    >
                                        KILL
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-2 bg-black border-t border-cyan-500/30 text-center text-[8px] text-gray-600 uppercase">
                Hardware Health: {playerState.systemHeat < 90 ? 'Nominal' : 'Critical'}
            </div>
        </div>
    );
};
