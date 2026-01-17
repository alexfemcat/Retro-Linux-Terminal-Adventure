import React, { useState } from 'react';
import { PlayerState, Mission, WorldEvent, Email } from '../types';
import { blackmailTemplates, leakNewsTemplates } from '../data/gameData';
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

export const Browser: React.FC<BrowserProps & { isMissionActive: boolean }> = ({
    playerState,
    onMissionAccept,
    onClose,
    worldEvents,
    onPlayerStateChange,
    onRefreshMissions,
    isMissionActive,
    initialUrl = 'home://new-tab'
}) => {
    const [url, setUrl] = useState(initialUrl);
    const [history, setHistory] = useState<string[]>([initialUrl]);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [marketTab, setMarketTab] = useState<'software' | 'hardware' | 'consumables'>('software');

    const navigate = (newUrl: string, isBack: boolean = false) => {
        if (newUrl === url) return;
        setIsPageLoading(true);
        setTimeout(() => {
            setUrl(newUrl);
            if (!isBack) {
                setHistory(prev => [...prev, newUrl]);
            }
            setIsPageLoading(false);
        }, 400);
    };

    const goBack = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop(); // Remove current
            const prevUrl = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            navigate(prevUrl, true);
        }
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
                        <BrowserIcon
                            icon="🤫"
                            label="Tor Blackmail Service"
                            sublabel="Anonymous Extortion"
                            onClick={() => navigate('tor://blackmail-service')}
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
                                        onClick={() => {
                                            onMissionAccept(mission);
                                            onClose();
                                        }}
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
            const currentEmail = playerState.emails.find(e => e.id === emailId);
            if (!currentEmail) return <div className="p-6 text-red-500">Email not found.</div>;

            return (
                <div className="p-6 h-full flex flex-col">
                    <button onClick={() => navigate('mail://homebase')} className="text-blue-400 mb-4 hover:underline">← Back to Inbox</button>
                    <div className="bg-gray-900/40 border border-gray-800 p-6 flex-grow overflow-y-auto">
                        <div className="mb-6 border-b border-gray-800 pb-4">
                            <div className="text-sm text-gray-500">From: <span className="text-blue-400">{currentEmail.sender}</span></div>
                            <div className="text-sm text-gray-500">Subject: <span className="text-white font-bold">{currentEmail.subject}</span></div>
                            <div className="text-sm text-gray-500">Date: {currentEmail.timestamp}</div>
                        </div>
                        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {currentEmail.body}
                        </div>
                        {currentEmail.missionId && (
                            <div className="mt-8 p-4 border border-green-900 bg-green-900/10">
                                <p className="text-sm text-green-400 mb-2">This email contains a direct contract offer.</p>
                                <button
                                    onClick={() => {
                                        const mission = playerState.availableMissions.find(m => m.id === currentEmail.missionId);
                                        if (mission) {
                                            onMissionAccept(mission);
                                            onClose();
                                        }
                                    }}
                                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 font-bold uppercase"
                                >
                                    Accept Direct Offer
                                </button>
                            </div>
                        )}
                        {currentEmail.type === 'ransom' && currentEmail.ransomData && (
                            <div className="mt-8 p-4 border border-purple-900 bg-purple-900/10">
                                <h4 className="text-purple-400 font-bold mb-2 uppercase tracking-widest">Ransom Management</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-xs text-gray-500">
                                        Target: <span className="text-white">{currentEmail.ransomData.file.name}</span><br />
                                        Current Status: <span className="text-yellow-500 uppercase">{currentEmail.ransomData.status}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-green-500 font-mono">{currentEmail.ransomData.payout}c</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    {currentEmail.ransomData.status === 'refused' && (
                                        <button
                                            onClick={() => {
                                                const roll = Math.random() * 100;
                                                const success = roll > 50;
                                                const updatedEmails: Email[] = playerState.emails.map(e => {
                                                    if (e.id === currentEmail.id) {
                                                        return {
                                                            ...e,
                                                            ransomData: {
                                                                ...e.ransomData!,
                                                                status: (success ? 'paid' : 'threatened') as any
                                                            },
                                                            body: e.body + `\n\n[SYSTEM: You have threatened the victim.]\n\n${success ? `[VICTIM]: OKAY! OKAY! I'll pay! Just please don't leak it! Authorized ${Math.floor(currentEmail.ransomData!.payout * 1.5)}c.` : `[VICTIM]: I don't negotiate with terrorists. Do your worst.`}`
                                                        };
                                                    }
                                                    return e;
                                                });
                                                onPlayerStateChange({
                                                    ...playerState,
                                                    emails: updatedEmails,
                                                    credits: playerState.credits + (success ? Math.floor(currentEmail.ransomData!.payout * 1.5) : 0),
                                                    reputation: playerState.reputation + (success ? 150 : 50)
                                                });
                                            }}
                                            className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-1 text-xs font-bold uppercase"
                                        >
                                            Threaten Victim
                                        </button>
                                    )}
                                    {currentEmail.ransomData.status === 'threatened' && (
                                        <button
                                            onClick={() => {
                                                const file = currentEmail.ransomData!.file;
                                                const category = file.name.includes('tax') ? 'financial' : file.name.includes('nudes') || file.name.includes('diary') ? 'personal' : 'sensitive';
                                                const templates = leakNewsTemplates[category as keyof typeof leakNewsTemplates] || leakNewsTemplates.sensitive;
                                                const headline = templates[Math.floor(Math.random() * templates.length)].replace('[Company]', currentEmail.sender);

                                                const updatedEmails: Email[] = playerState.emails.map(e => {
                                                    if (e.id === currentEmail.id) {
                                                        return {
                                                            ...e,
                                                            ransomData: {
                                                                ...e.ransomData!,
                                                                status: 'leaked' as any
                                                            },
                                                            body: e.body + `\n\n[SYSTEM: DATA LEAKED TO DARK WEB]`
                                                        };
                                                    }
                                                    return e;
                                                });

                                                const repGain = 100 + Math.floor(Math.random() * 200);
                                                onPlayerStateChange({
                                                    ...playerState,
                                                    emails: updatedEmails,
                                                    reputation: playerState.reputation + repGain,
                                                    inventory: playerState.inventory.filter(i => i.name !== file.name)
                                                });
                                                alert(`[BREAKING NEWS] ${headline}\n\nReputation increased by ${repGain}.`);
                                            }}
                                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 text-xs font-bold uppercase"
                                        >
                                            Leak Data
                                        </button>
                                    )}
                                </div>
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
                        {playerState.emails.filter(e => e.sender === 'GNN-Alert').map((email, idx) => (
                            <div key={`archived-${idx}`} className="border-l-4 border-gray-600 pl-4 py-2 opacity-80">
                                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Archived Report - {email.timestamp}</div>
                                <h3 className="text-lg text-gray-300 font-bold mb-1">{email.subject.replace('BREAKING: ', '')}</h3>
                                <p className="text-gray-500 text-sm">{email.body}</p>
                            </div>
                        ))}
                        {worldEvents.length === 0 && playerState.emails.filter(e => e.sender === 'GNN-Alert').length === 0 && (
                            <div className="text-gray-600 italic text-center py-10 border border-dashed border-gray-800">
                                No active breaking news events.
                            </div>
                        )}
                        <div className="opacity-50 border-t border-gray-800 pt-4">
                            <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase">System Status</h4>
                            <p className="text-xs text-gray-600 italic">All systems nominal. Monitoring global network traffic...</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (url === 'tor://blackmail-service') {
            return (
                <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-6">🤫</div>
                    <h2 className="text-3xl font-bold text-purple-400 mb-4 uppercase tracking-widest">Tor Blackmail Service</h2>
                    <p className="text-gray-400 max-w-lg mb-8 italic">
                        "Information is the only currency that never devalues."<br />
                        Upload stolen sensitive data here to begin anonymous extortion proceedings.
                    </p>

                    <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                        {playerState.inventory.filter(i => i.name.includes('SECRET') || i.name.includes('leak') || i.name.includes('private') || i.name.includes('tax') || i.name.includes('unethical')).length === 0 ? (
                            <div className="border-2 border-dashed border-purple-900/50 p-12 text-purple-900 font-bold uppercase">
                                No sensitive data found in inventory
                            </div>
                        ) : (
                            playerState.inventory
                                .filter(i => i.name.includes('SECRET') || i.name.includes('leak') || i.name.includes('private') || i.name.includes('tax') || i.name.includes('unethical'))
                                .map(item => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            const payout = Math.floor(5000 + Math.random() * 10000);
                                            const roll = Math.random() * 100;
                                            let updatedState = { ...playerState };
                                            let alertMsg = "";

                                            const extortionCategory = item.name.includes('tax') ? 'financial' : item.name.includes('nudes') || item.name.includes('diary') ? 'personal' : 'sensitive';

                                            if (roll < 10) {
                                                // Critical Failure: Hitman / Kernel Panic
                                                alertMsg = "[CRITICAL ERROR] Victim traced your upload. Counter-hack initiated. SYSTEM CRASH IMMINENT.";
                                                updatedState.systemHeat = 100;
                                            } else if (roll < 30) {
                                                // Failure: Trace Spike
                                                alertMsg = "[WARNING] Victim contacted authorities. Trace speed increased!";
                                                // Note: We can't easily trigger trace spike here without gameState access,
                                                // but we can simulate a "fine" or reputation loss
                                                updatedState.reputation = Math.max(0, playerState.reputation - 100);
                                                updatedState.credits = Math.max(0, playerState.credits - 500);
                                            } else {
                                                // Success
                                                const template = blackmailTemplates.find(t => t.category === extortionCategory) || blackmailTemplates[2];

                                                const blackmailEmail = {
                                                    id: `blackmail_${Date.now()}`,
                                                    sender: 'ANONYMOUS_VICTIM',
                                                    subject: template.subject,
                                                    body: `${template.body.replace('{payout}', payout.toString())}\n\n[SYSTEM: Victim has authorized extortion payment]`,
                                                    timestamp: new Date().toISOString().split('T')[0],
                                                    status: 'unread' as const,
                                                    type: 'ransom' as const
                                                };
                                                updatedState.credits += payout;
                                                updatedState.reputation += 150;
                                                updatedState.emails = [blackmailEmail, ...playerState.emails];
                                                alertMsg = `[SUCCESS] Data uploaded. Victim contacted. Payout of ${payout}c received.`;
                                            }

                                            updatedState.inventory = playerState.inventory.filter(i => i.name !== item.name);
                                            onPlayerStateChange(updatedState);
                                            alert(alertMsg);

                                            // Trigger News Event for Extortion
                                            if (roll >= 30) {
                                                // We can't easily trigger NewsTicker from here without a callback, 
                                                // but the email system will handle the notification.
                                            }
                                        }}
                                        className="bg-purple-900/20 border border-purple-500 p-4 hover:bg-purple-500 hover:text-white transition-all flex justify-between items-center group"
                                    >
                                        <span className="font-bold uppercase tracking-tighter">{item.name}</span>
                                        <span className="text-xs opacity-0 group-hover:opacity-100 font-mono">[ UPLOAD & EXTORT ]</span>
                                    </button>
                                ))
                        )}
                    </div>
                </div>
            );
        }

        if (url === 'web://macro-electronics') {
            return (
                <div className="h-full flex flex-col bg-[#0a0a0a]">
                    {/* Header */}
                    <div className="p-4 border-b border-green-900/50 flex justify-between items-center bg-black">
                        <h2 className="text-xl font-bold text-green-500 tracking-tighter uppercase">Macro-Electronics v4.0</h2>
                        <div className="text-yellow-500 font-mono font-bold bg-yellow-900/20 px-3 py-1 border border-yellow-900/50">
                            {playerState.credits.toLocaleString()} CR
                        </div>
                    </div>

                    <div className="flex flex-grow overflow-hidden">
                        {/* Sidebar Tabs */}
                        <div className="w-48 border-r border-green-900/30 bg-black flex flex-col">
                            {(['software', 'hardware', 'consumables'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setMarketTab(tab)}
                                    className={`p-4 text-left text-xs font-bold uppercase tracking-widest transition-all border-b border-green-900/10 ${marketTab === tab ? 'bg-green-900/20 text-green-400 border-r-2 border-r-green-500' : 'text-gray-600 hover:bg-white/5 hover:text-gray-400'}`}
                                >
                                    {tab === 'software' && '📂 '}
                                    {tab === 'hardware' && '🔌 '}
                                    {tab === 'consumables' && '🔋 '}
                                    {tab}
                                </button>
                            ))}
                            <div className="mt-auto p-4 opacity-20 grayscale pointer-events-none">
                                <div className="text-[8px] text-green-500 uppercase mb-1">Authorized Dealer</div>
                                <div className="text-[10px] text-white font-bold">MACRO_CORP</div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                            {marketTab === 'software' && (
                                <div className="space-y-4">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-1">Available Software Suites</div>
                                    {MARKET_CATALOG.filter(i => ['utility', 'sniffing', 'exploit'].includes(i.category)).map(item => (
                                        <div key={item.id} className="bg-gray-900/20 border border-gray-800 p-4 flex justify-between items-center hover:border-green-900/50 transition-colors group">
                                            <div>
                                                <div className="text-white font-bold group-hover:text-green-400 transition-colors">{item.name}</div>
                                                <div className="text-xs text-gray-500 max-w-md mt-1">{item.description}</div>
                                                <div className="text-[9px] text-green-900 mt-2 uppercase font-mono">
                                                    {'cpuReq' in item && item.cpuReq && `CPU_LOAD: ${item.cpuReq}% | `}
                                                    {'ramReq' in item && item.ramReq && `MEM_REQ: ${item.ramReq}MB | `}
                                                    {'storageSize' in item && item.storageSize && `DISK_USE: ${item.storageSize}MB`}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handlePurchase(item.id)}
                                                disabled={playerState.credits < item.cost || playerState.installedSoftware.includes(item.id)}
                                                className={`px-4 py-2 font-bold text-xs uppercase tracking-widest transition-all border ${playerState.installedSoftware.includes(item.id) ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed' : 'bg-green-900/10 border-green-500/50 text-green-500 hover:bg-green-500 hover:text-black'}`}
                                            >
                                                {playerState.installedSoftware.includes(item.id) ? 'INSTALLED' : `${item.cost}c`}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {marketTab === 'hardware' && (
                                <div className="space-y-8">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-1">System Component Upgrades</div>
                                    {(['cpu', 'ram', 'storage', 'cooling', 'network'] as const).map(hwKey => {
                                        const current = playerState.hardware[hwKey];
                                        const nextUpgrade = MARKET_CATALOG.find(i =>
                                            i.category === 'hardware' &&
                                            (i as any).hardwareKey === hwKey &&
                                            (i as any).stats?.level === current.level + 1
                                        );

                                        return (
                                            <div key={hwKey} className="border border-gray-800 bg-gray-900/10 overflow-hidden">
                                                {/* Current Spec Header */}
                                                <div className="bg-black p-2 px-4 flex justify-between items-center border-b border-gray-800">
                                                    <span className="text-[10px] text-gray-500 uppercase font-bold">{hwKey} status</span>
                                                    <span className="text-[10px] text-green-700 font-mono">LEVEL {current.level} INSTALLED</span>
                                                </div>

                                                <div className="p-4 flex justify-between items-center">
                                                    <div className="flex-grow">
                                                        <div className="flex items-center gap-4 mb-2">
                                                            <div className="text-white font-bold opacity-50 line-through text-sm">{current.id.replace('_', ' ').toUpperCase()}</div>
                                                            <div className="text-green-500 text-xl">▶</div>
                                                            {nextUpgrade ? (
                                                                <div className="text-white font-bold text-lg">{nextUpgrade.name}</div>
                                                            ) : (
                                                                <div className="text-yellow-500 font-bold text-lg uppercase tracking-widest">Maximum Level Reached</div>
                                                            )}
                                                        </div>
                                                        {nextUpgrade && (
                                                            <div className="text-xs text-gray-500 max-w-md italic">"{nextUpgrade.description}"</div>
                                                        )}
                                                    </div>

                                                    {nextUpgrade && (
                                                        <button
                                                            onClick={() => handlePurchase(nextUpgrade.id)}
                                                            disabled={playerState.credits < nextUpgrade.cost}
                                                            className="px-6 py-3 bg-green-900/10 border border-green-500 text-green-500 font-bold text-sm uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                                        >
                                                            UPGRADE: {nextUpgrade.cost}c
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {marketTab === 'consumables' && (
                                <div className="space-y-4">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-800 pb-1">Disposable Field Tools</div>
                                    {MARKET_CATALOG.filter(i => i.category === 'consumable').map(item => (
                                        <div key={item.id} className="bg-gray-900/20 border border-gray-800 p-4 flex justify-between items-center hover:border-green-900/50 transition-colors group">
                                            <div>
                                                <div className="text-white font-bold group-hover:text-green-400 transition-colors">{item.name}</div>
                                                <div className="text-xs text-gray-500 max-w-md mt-1">{item.description}</div>
                                            </div>
                                            <button
                                                onClick={() => handlePurchase(item.id)}
                                                disabled={playerState.credits < item.cost}
                                                className="px-4 py-2 bg-green-900/10 border border-green-500/50 text-green-500 font-bold text-xs uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all"
                                            >
                                                {item.cost}c
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return <div className="p-6 text-gray-500">404 - Page Not Found</div>;
    };

    if (isMissionActive) {
        onClose();
        return null;
    }

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
                    <div className="flex gap-2 ml-2">
                        <button
                            onClick={goBack}
                            disabled={history.length <= 1}
                            className={`text-xl ${history.length > 1 ? 'text-gray-300 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                            title="Back"
                        >
                            ⬅️
                        </button>
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
