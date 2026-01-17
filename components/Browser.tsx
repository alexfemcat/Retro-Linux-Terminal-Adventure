import React, { useState } from 'react';
import { PlayerState, Mission, WorldEvent } from '../types';
import { MARKET_CATALOG } from '../data/marketData';
import { buyItem } from '../services/MarketSystem';
import { writeSave } from '../services/PersistenceService';

interface BrowserProps {
    playerState: PlayerState;
    onMissionAccept: (mission: Mission) => void;
    onClose: () => void;
    worldEvents: WorldEvent[];
    onPlayerStateChange: (newState: PlayerState) => void;
    onRefreshMissions: () => void;
    initialUrl?: string;
}

export const Browser: React.FC<BrowserProps> = ({
    playerState,
    onMissionAccept,
    onClose,
    worldEvents,
    onPlayerStateChange,
    onRefreshMissions,
    initialUrl = 'home://new-tab'
}) => {
    const [url, setUrl] = useState(initialUrl);
    const [isPageLoading, setIsPageLoading] = useState(false);

    const navigate = (newUrl: string) => {
        setIsPageLoading(true);
        setTimeout(() => {
            setUrl(newUrl);
            setIsPageLoading(false);
        }, 400);
    };

    const handlePurchase = (itemId: string) => {
        const result = buyItem(itemId, playerState);
        if (result.success && result.updatedPlayerState) {
            onPlayerStateChange(result.updatedPlayerState);
            const slotId = playerState.isDevMode ? 'dev_save_slot' : (localStorage.getItem('active-save-slot') || 'slot_1');
            writeSave(slotId, result.updatedPlayerState);
        } else {
            alert(`[ERROR] ${result.error}`);
        }
    };

    const renderContent = () => {
        if (url === 'home://new-tab') {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8">
                    <h1 className="text-4xl font-bold mb-12 text-green-500 tracking-tighter uppercase italic">Retro Browser v2.0</h1>
                    <div className="grid grid-cols-2 gap-8">
                        <BrowserIcon
                            icon="🧅"
                            label="Onion Forum"
                            sublabel="Public Contracts"
                            onClick={() => navigate('tor://onion-forum')}
                        />
                        <BrowserIcon
                            icon="✉️"
                            label="Homebase Mail"
                            sublabel={`${playerState.emails.filter(e => e.status === 'unread').length} Unread`}
                            onClick={() => navigate('mail://homebase')}
                        />
                        <BrowserIcon
                            icon="🛒"
                            label="Macro-Electronics"
                            sublabel="Software & Hardware"
                            onClick={() => navigate('web://macro-electronics')}
                        />
                        <BrowserIcon
                            icon="📰"
                            label="GNN News"
                            sublabel="Global News Network"
                            onClick={() => navigate('web://gnn-news')}
                        />
                    </div>
                </div>
            );
        }

        if (url === 'tor://onion-forum') {
            return (
                <div className="p-6 overflow-y-auto h-full">
                    <div className="flex justify-between items-center mb-4 border-b border-purple-900 pb-2">
                        <h2 className="text-2xl font-bold text-purple-400">/b/ - Anonymous Job Board</h2>
                        <button
                            onClick={onRefreshMissions}
                            className="text-xs bg-purple-900/30 border border-purple-500 px-2 py-1 hover:bg-purple-500 hover:text-white transition-all"
                        >
                            [REFRESH BOARD]
                        </button>
                    </div>
                    <div className="space-y-4">
                        {playerState.availableMissions.map((mission, idx) => (
                            <div key={mission.id} className="bg-purple-900/10 border border-purple-900/50 p-4 hover:border-purple-500 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-purple-300 font-bold">Anonymous ##{idx + 1024}</span>
                                    <span className="text-xs text-purple-700">2026-01-17 20:25</span>
                                </div>
                                <h3 className="text-lg text-white mb-2">{mission.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">{mission.description.split('\n')[0]}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-500 font-mono">{mission.reward}c</span>
                                    <button
                                        onClick={() => onMissionAccept(mission)}
                                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1 text-sm font-bold uppercase tracking-widest"
                                    >
                                        Accept Contract
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (url === 'mail://homebase') {
            return (
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400 border-b border-blue-900 pb-2">Homebase Mail</h2>
                    <div className="flex-grow overflow-y-auto">
                        {playerState.emails.length === 0 ? (
                            <div className="text-gray-600 italic text-center mt-20">No messages in inbox.</div>
                        ) : (
                            <div className="space-y-2">
                                {playerState.emails.map(email => (
                                    <div
                                        key={email.id}
                                        className={`p-3 border ${email.status === 'unread' ? 'bg-blue-900/20 border-blue-500' : 'bg-gray-900/20 border-gray-800'} cursor-pointer hover:bg-blue-900/10`}
                                        onClick={() => {
                                            const newEmails = playerState.emails.map(e =>
                                                e.id === email.id ? { ...e, status: 'read' as const } : e
                                            );
                                            onPlayerStateChange({ ...playerState, emails: newEmails });
                                            navigate(`mail://homebase/${email.id}`);
                                        }}
                                    >
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-blue-400 font-bold">{email.sender}</span>
                                            <span className="text-gray-600">{email.timestamp}</span>
                                        </div>
                                        <div className="text-white font-bold">{email.subject}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (url.startsWith('mail://homebase/')) {
            const emailId = url.split('/').pop();
            const email = playerState.emails.find(e => e.id === emailId);
            if (!email) return <div className="p-6 text-red-500">Email not found.</div>;

            return (
                <div className="p-6 h-full flex flex-col">
                    <button onClick={() => navigate('mail://homebase')} className="text-blue-400 mb-4 hover:underline">← Back to Inbox</button>
                    <div className="bg-gray-900/40 border border-gray-800 p-6 flex-grow overflow-y-auto">
                        <div className="mb-6 border-b border-gray-800 pb-4">
                            <div className="text-sm text-gray-500">From: <span className="text-blue-400">{email.sender}</span></div>
                            <div className="text-sm text-gray-500">Subject: <span className="text-white font-bold">{email.subject}</span></div>
                            <div className="text-sm text-gray-500">Date: {email.timestamp}</div>
                        </div>
                        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {email.body}
                        </div>
                        {email.missionId && (
                            <div className="mt-8 p-4 border border-green-900 bg-green-900/10">
                                <p className="text-sm text-green-400 mb-2">This email contains a direct contract offer.</p>
                                <button
                                    onClick={() => {
                                        const mission = playerState.availableMissions.find(m => m.id === email.missionId);
                                        if (mission) onMissionAccept(mission);
                                    }}
                                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 font-bold uppercase"
                                >
                                    Accept Direct Offer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (url === 'web://gnn-news') {
            return (
                <div className="p-6 overflow-y-auto h-full">
                    <h2 className="text-2xl font-bold mb-4 text-red-500 border-b border-red-900 pb-2">GNN - Global News Network</h2>
                    <div className="space-y-6">
                        {worldEvents.map((event, idx) => (
                            <div key={idx} className="border-l-4 border-red-600 pl-4 py-2">
                                <div className="text-xs text-red-900 font-bold uppercase mb-1">Breaking News</div>
                                <h3 className="text-xl text-white font-bold mb-2">{event.title}</h3>
                                <p className="text-gray-400 text-sm">{event.description}</p>
                            </div>
                        ))}
                        <div className="opacity-50 border-t border-gray-800 pt-4">
                            <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase">Archived Reports</h4>
                            <p className="text-xs text-gray-600 italic">No archived reports found for this session.</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (url.startsWith('web://macro-electronics')) {
            const category = url.split('/').pop() || 'macro-electronics';
            return (
                <div className="flex h-full overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-48 bg-gray-900/50 border-r border-gray-800 p-4 flex flex-col gap-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Categories</h3>
                        <button onClick={() => navigate('web://macro-electronics/hardware')} className={`text-left px-2 py-1 text-sm ${category === 'hardware' ? 'text-green-400 bg-green-900/20' : 'text-gray-400 hover:text-white'}`}>[ HARDWARE ]</button>
                        <button onClick={() => navigate('web://macro-electronics/software')} className={`text-left px-2 py-1 text-sm ${category === 'software' ? 'text-green-400 bg-green-900/20' : 'text-gray-400 hover:text-white'}`}>[ SOFTWARE ]</button>
                        <button onClick={() => navigate('web://macro-electronics/ransomware')} className={`text-left px-2 py-1 text-sm ${category === 'ransomware' ? 'text-green-400 bg-green-900/20' : 'text-gray-400 hover:text-white'}`}>[ RANSOMWARE ]</button>
                        <button onClick={() => navigate('web://macro-electronics/consumables')} className={`text-left px-2 py-1 text-sm ${category === 'consumables' ? 'text-green-400 bg-green-900/20' : 'text-gray-400 hover:text-white'}`}>[ CONSUMABLES ]</button>
                        <div className="mt-auto pt-4 border-t border-gray-800">
                            <div className="text-[10px] text-gray-600 uppercase">Your Balance</div>
                            <div className="text-lg font-bold text-yellow-500 font-mono">{playerState.credits.toLocaleString()}c</div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow p-6 overflow-y-auto bg-[#080808]">
                        {category === 'macro-electronics' && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="text-6xl mb-4">🛒</div>
                                <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase italic">Macro-Electronics</h2>
                                <p className="text-gray-500 max-w-md">Premium hardware and software solutions for the modern operative. Select a category to begin.</p>
                            </div>
                        )}

                        {category === 'hardware' && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2 uppercase italic tracking-widest">System Upgrades</h2>
                                <div className="grid grid-cols-1 gap-6">
                                    {['cpu', 'ram', 'storage', 'cooling', 'network'].map(key => {
                                        const current = playerState.hardware[key as keyof typeof playerState.hardware];
                                        const nextLevel = (current.level || 0) + 1;
                                        const upgrade = MARKET_CATALOG.find(i => i.category === 'hardware' && i.hardwareKey === key && (i as any).stats?.level === nextLevel);

                                        // Find the current item in the catalog to get its name/description
                                        const currentCatalogItem = MARKET_CATALOG.find(i => i.id === current.id);

                                        return (
                                            <div key={key} className="bg-gray-900/30 border border-gray-800 p-4 flex justify-between items-center">
                                                <div className="flex-grow">
                                                    <div className="text-xs text-gray-500 uppercase mb-1">{key}</div>
                                                    <div className="text-lg font-bold text-white uppercase">
                                                        {currentCatalogItem?.name || current.id.replace('_', ' ')}
                                                        <span className="text-green-500 text-sm ml-2">LVL {current.level}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1 italic mb-2">
                                                        {currentCatalogItem?.description}
                                                    </div>
                                                    <div className="text-[10px] text-cyan-600 font-mono uppercase">
                                                        Current Stats: {
                                                            key === 'cpu' ? `${(current as any).clockSpeed}GHz / ${(current as any).cores} Cores` :
                                                                key === 'ram' ? `${(current as any).capacity * 1000}MB Capacity` :
                                                                    key === 'storage' ? `${(current as any).capacity * 1000}MB Capacity` :
                                                                        key === 'cooling' ? `${(current as any).heatDissipation}x Dissipation` :
                                                                            key === 'network' ? `${(current as any).bandwidth}MBps Bandwidth` : ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex flex-col items-end gap-2">
                                                    {upgrade ? (
                                                        <>
                                                            <div className="text-[10px] text-yellow-600 uppercase text-right">
                                                                Next: {(upgrade as any).name}<br />
                                                                {
                                                                    key === 'cpu' ? `${(upgrade as any).stats.clockSpeed}GHz / ${(upgrade as any).stats.cores} Cores` :
                                                                        key === 'ram' ? `${(upgrade as any).stats.capacity * 1000}MB Capacity` :
                                                                            key === 'storage' ? `${(upgrade as any).stats.capacity * 1000}MB Capacity` :
                                                                                key === 'cooling' ? `${(upgrade as any).stats.heatDissipation}x Dissipation` :
                                                                                    key === 'network' ? `${(upgrade as any).stats.bandwidth}MBps Bandwidth` : ''
                                                                }
                                                            </div>
                                                            <button
                                                                onClick={() => handlePurchase(upgrade.id)}
                                                                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 font-bold uppercase flex flex-col items-center min-w-[120px]"
                                                            >
                                                                <span>Upgrade</span>
                                                                <span className="text-xs opacity-80">{upgrade.cost}c</span>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="text-gray-600 font-bold uppercase">Max Level</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {(category === 'software' || category === 'ransomware' || category === 'consumables') && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2 uppercase italic tracking-widest">{category}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {MARKET_CATALOG.filter(i => {
                                        if (category === 'software') return ['utility', 'exploit', 'sniffing'].includes(i.category) && !i.id.startsWith('ransom_');
                                        if (category === 'ransomware') return i.id.startsWith('ransom_');
                                        if (category === 'consumables') return i.category === 'consumable' && !i.id.startsWith('theme_');
                                        return false;
                                    }).map(item => {
                                        const isOwned = playerState.installedSoftware.includes(item.id);
                                        return (
                                            <div key={item.id} className={`bg-gray-900/30 border ${isOwned ? 'border-green-900/50' : 'border-gray-800'} p-4 flex flex-col`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-white font-bold uppercase tracking-tighter">{item.name}</span>
                                                    {(item as any).tier && <span className="text-[10px] bg-gray-800 px-1 text-gray-400">TIER {(item as any).tier}</span>}
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2 flex-grow italic">{item.description}</p>
                                                <div className="text-[10px] text-cyan-700 font-mono mb-4">
                                                    {(item as any).cpuReq !== undefined && `REQ: ${(item as any).cpuReq}% CPU / ${(item as any).ramReq}MB RAM / ${(item as any).storageSize}MB DISK`}
                                                </div>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="text-yellow-500 font-mono text-sm">{item.cost}c</span>
                                                    {isOwned ? (
                                                        <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Installed</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handlePurchase(item.id)}
                                                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-[10px] font-bold uppercase"
                                                        >
                                                            Purchase
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return <div className="p-6 text-gray-500">404 - Page Not Found</div>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="w-[1280px] h-[800px] bg-black flex flex-col font-mono border-4 border-gray-800 shadow-2xl overflow-hidden crt-screen pointer-events-auto relative">
                {/* Browser Header */}
                <div className="bg-gray-800 p-2 flex items-center gap-4 border-b border-gray-700">
                    <div className="flex gap-2">
                        <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400"></button>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-grow flex items-center bg-black border border-gray-600 px-3 py-1 rounded">
                        <span className="text-gray-600 mr-2">URL:</span>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-transparent border-none outline-none text-green-500 w-full text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && navigate(url)}
                        />
                        <button
                            onClick={() => {
                                if (url === 'tor://onion-forum') onRefreshMissions();
                                navigate(url);
                            }}
                            className="ml-2 text-gray-500 hover:text-green-500"
                            title="Refresh"
                        >
                            🔄
                        </button>
                    </div>
                    <button onClick={() => navigate('home://new-tab')} className="text-gray-400 hover:text-white text-xl">🏠</button>
                </div>

                {/* Browser Content */}
                <div className="flex-grow bg-[#050505] relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none scanlines opacity-10"></div>
                    {isPageLoading ? (
                        <div className="flex flex-col items-center justify-center h-full animate-pulse">
                            <div className="text-green-500 text-2xl mb-4 tracking-widest uppercase">Loading...</div>
                            <div className="w-48 h-1 bg-gray-800 overflow-hidden">
                                <div className="h-full bg-green-500 animate-[loading_1s_infinite]"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                            {renderContent()}
                        </div>
                    )}
                </div>

                {/* Browser Footer */}
                <div className="bg-gray-800 p-1 text-[10px] text-gray-500 flex justify-between px-4">
                    <span>RetroBrowser Engine v2.0.4-stable</span>
                    <span>Secure Connection: AES-256-GCM</span>
                </div>
            </div>
        </div>
    );
};

const BrowserIcon: React.FC<{ icon: string, label: string, sublabel: string, onClick: () => void }> = ({ icon, label, sublabel, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center p-6 bg-gray-900/20 border border-gray-800 hover:border-green-500 hover:bg-green-900/10 transition-all group w-48"
    >
        <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-white font-bold mb-1 uppercase tracking-tighter">{label}</span>
        <span className="text-[10px] text-gray-500 uppercase">{sublabel}</span>
    </button>
);
