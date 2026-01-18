import React, { useState } from 'react';
import { PlayerState, Mission, WorldEvent, Email } from '../types';
import { blackmailTemplates, leakNewsTemplates } from '../data/gameData';
import { MARKET_CATALOG } from '../data/marketData';
import { buyItem } from '../services/MarketSystem';
import { writeSave } from '../services/PersistenceService';
import { COMMAND_REGISTRY } from '../services/CommandRegistry';
import { MAN_PAGES } from '../data/manPages';

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
    const [marketTab, setMarketTab] = useState<'software' | 'hardware' | 'consumables' | 'security'>('software');
    const [selectedCommandInfo, setSelectedCommandInfo] = useState<string | null>(null);
    const isTutorial = playerState.activeMissionId === 'tutorial';

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
                            label="Onion Blackmail Service"
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

                                <div className="flex gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-purple-700 uppercase font-bold">Risk Level</span>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-3 h-1.5 ${i < mission.difficulty ? 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]' : 'bg-purple-900/30'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-purple-700 uppercase font-bold">Objective Type</span>
                                        <span className={`text-[10px] font-mono mt-1 uppercase tracking-tighter ${mission.targetNetworkConfig.winConditionType ? 'text-purple-300' : 'text-red-500 animate-pulse'}`}>
                                            {mission.targetNetworkConfig.winConditionType ? mission.targetNetworkConfig.winConditionType.replace(/_/g, ' ') : '[ERR: MISSING_OBJ_DATA]'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-green-500 font-mono font-bold">{mission.reward}c</span>
                                    <button
                                        onClick={() => {
                                            onMissionAccept(mission);
                                            onClose();
                                        }}
                                        disabled={isTutorial}
                                        className={`${isTutorial ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'} px-4 py-1 text-sm font-bold uppercase tracking-widest`}
                                    >
                                        {isTutorial ? 'Unavailable' : 'Accept Contract'}
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
                    <div className="bg-gray-900/40 border border-gray-800 p-6 flex-grow overflow-y-auto relative">
                        <div className="mb-6 border-b border-gray-800 pb-4">
                            <div className="text-sm text-gray-500">From: <span className="text-blue-400">{currentEmail.sender}</span></div>
                            <div className="text-sm text-gray-500">Subject: <span className="text-white font-bold">{currentEmail.subject}</span></div>
                            <div className="text-sm text-gray-500">Date: {currentEmail.timestamp}</div>
                        </div>

                        {currentEmail.isEncrypted && !currentEmail.isDecrypted ? (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-blue-900/50 bg-blue-900/5">
                                <div className="text-4xl mb-4">🔒</div>
                                <div className="text-blue-400 font-bold mb-2 uppercase tracking-widest">Encrypted Message</div>
                                <div className="text-xs text-blue-700 mb-6">Requires PGP-TOOL to decipher</div>
                                <button
                                    onClick={() => {
                                        if (playerState.installedSoftware.includes('pgp-tool')) {
                                            // Start decryption process
                                            const newEmails = playerState.emails.map(e =>
                                                e.id === currentEmail.id ? { ...e, isDecrypted: true } : e
                                            );
                                            onPlayerStateChange({ ...playerState, emails: newEmails });

                                            // Trigger notification
                                            import('../services/NotificationService').then(({ notificationService }) => {
                                                notificationService.success(`Deciphering complete: ${currentEmail.subject}`);
                                            });
                                        } else {
                                            alert("PGP-Crypt not found. Purchase it from Macro-Electronics.");
                                        }
                                    }}
                                    disabled={isTutorial}
                                    className={`px-8 py-2 font-bold uppercase tracking-widest transition-all ${isTutorial ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : playerState.installedSoftware.includes('pgp-tool') ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {isTutorial ? 'Unavailable' : 'Decipher Message'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {currentEmail.body}
                            </div>
                        )}
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
                                    disabled={isTutorial}
                                    className={`${isTutorial ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'} px-6 py-2 font-bold uppercase`}
                                >
                                    {isTutorial ? 'Unavailable' : 'Accept Direct Offer'}
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
                                        disabled={isTutorial}
                                        onClick={() => {
                                            if (isTutorial) return;
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
                                        className={`bg-purple-900/20 border border-purple-500 p-4 transition-all flex justify-between items-center group ${isTutorial ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 hover:text-white'}`}
                                    >
                                        <span className="font-bold uppercase tracking-tighter">{item.name}</span>
                                        <span className={`text-xs font-mono ${isTutorial ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{isTutorial ? '[ UNAVAILABLE ]' : '[ UPLOAD & EXTORT ]'}</span>
                                    </button>
                                ))
                        )}
                    </div>
                </div>
            );
        }

        if (url === 'web://macro-electronics') {
            return (
                <div className={`h-full flex flex-col bg-[#0f172a] text-blue-400 font-mono ${selectedCommandInfo ? 'pointer-events-none' : ''}`}>
                    {/* Fancy Header */}
                    <div className="p-6 border-b-2 border-blue-400/30 flex justify-between items-center bg-[#1e293b] relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-400/10 animate-pulse pointer-events-none"></div>
                        <div>
                            <h2 className="text-3xl font-black text-blue-400 tracking-tighter uppercase italic flex items-center gap-3">
                                <span className="text-blue-600">{'>>'}</span> Macro-Electronics <span className="text-xs bg-blue-900/50 px-2 py-1 rounded text-blue-500 border border-blue-500/30">v4.0.8-STABLE</span>
                            </h2>
                            <div className="text-[10px] text-blue-800 uppercase tracking-[0.3em] mt-1">Premium Hardware & Software Solutions</div>
                        </div>
                        <div className="text-right flex flex-col items-end justify-center">
                            <div className="text-yellow-500 font-black text-2xl tracking-tighter bg-yellow-900/10 px-4 py-1 border-2 border-yellow-600/50 shadow-[0_0_15px_rgba(202,138,4,0.2)] leading-none flex items-center h-12">
                                {playerState.credits.toLocaleString()} <span className="text-sm opacity-70 ml-2">CR</span>
                            </div>
                            <div className="text-[10px] text-yellow-700 uppercase mt-1 font-bold tracking-widest">Verified Account Balance</div>
                        </div>
                    </div>

                    <div className="flex flex-grow overflow-hidden">
                        {/* Sidebar Tabs - Fancy Style */}
                        <div className="w-56 border-r-2 border-blue-400/20 bg-[#0f172a] flex flex-col">
                            {(['software', 'hardware', 'security', 'consumables'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => !isTutorial && setMarketTab(tab)}
                                    disabled={isTutorial}
                                    className={`p-6 text-left text-sm font-black uppercase tracking-[0.2em] transition-all border-b border-blue-400/10 relative group ${marketTab === tab ? 'bg-blue-400/20 text-blue-200' : isTutorial ? 'text-gray-600 cursor-not-allowed' : 'text-blue-700 hover:bg-blue-400/10 hover:text-blue-400'}`}
                                >
                                    {marketTab === tab && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div>}
                                    <span className="flex items-center gap-3">
                                        <span className={`text-xl ${marketTab === tab ? 'opacity-100' : 'opacity-30'}`}>
                                            {tab === 'software' && '⧉'}
                                            {tab === 'hardware' && '⬢'}
                                            {tab === 'security' && '🛡️'}
                                            {tab === 'consumables' && '⌬'}
                                        </span>
                                        {tab}
                                    </span>
                                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-transform ${marketTab === tab ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>▶</div>
                                </button>
                            ))}

                            <div className="mt-auto p-6 border-t border-blue-500/10">
                                <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded">
                                    <div className="text-[9px] text-blue-700 uppercase font-bold mb-2">System Integrity</div>
                                    <div className="w-full h-1 bg-blue-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-full animate-pulse"></div>
                                    </div>
                                    <div className="text-[8px] text-blue-900 mt-2 font-mono">SECURE_LINK: ACTIVE</div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800/10 to-transparent">
                            {marketTab === 'software' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                                        <div className="text-xs text-blue-500 font-black uppercase tracking-[0.4em] whitespace-nowrap">Software Repository</div>
                                        <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {MARKET_CATALOG.filter(i => ['utility', 'sniffing', 'exploit'].includes(i.category)).map(item => (
                                            <div key={item.id} className="bg-[#1e293b]/40 border border-blue-400/20 p-5 flex justify-between items-center hover:border-blue-300/50 transition-all group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-blue-300/5 group-hover:bg-blue-300/10 transition-colors pointer-events-none"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <div className="text-white font-black text-lg group-hover:text-blue-300 transition-colors uppercase tracking-tighter">{item.name}</div>
                                                        <div className={`text-[9px] px-2 py-0.5 rounded border font-bold ${item.category === 'exploit' ? 'border-red-500/50 text-red-400 bg-red-900/20' : item.category === 'sniffing' ? 'border-cyan-500/50 text-cyan-400 bg-cyan-900/20' : 'border-blue-500/50 text-blue-400 bg-blue-900/20'}`}>
                                                            {item.category.toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-blue-300/70 max-w-md italic mb-3">"{item.description}"</div>
                                                    <div className="flex gap-4">
                                                        {'cpuReq' in item && item.cpuReq && (
                                                            <div className="text-[10px] font-bold">
                                                                <span className="text-blue-700">CPU_LOAD:</span> <span className="text-blue-400">{item.cpuReq}%</span>
                                                            </div>
                                                        )}
                                                        {'ramReq' in item && item.ramReq && (
                                                            <div className="text-[10px] font-bold">
                                                                <span className="text-blue-700">MEM_REQ:</span> <span className="text-blue-400">{item.ramReq}MB</span>
                                                            </div>
                                                        )}
                                                        {'storageSize' in item && item.storageSize && (
                                                            <div className="text-[10px] font-bold">
                                                                <span className="text-blue-700">DISK_USE:</span> <span className="text-blue-400">{item.storageSize}MB</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => setSelectedCommandInfo(item.id)}
                                                        className="relative z-10 px-4 py-1 font-black text-[10px] uppercase tracking-[0.1em] transition-all border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-black"
                                                    >
                                                        [ DOCUMENTATION ]
                                                    </button>
                                                    <button
                                                        onClick={() => handlePurchase(item.id)}
                                                        disabled={playerState.credits < item.cost || playerState.installedSoftware.includes(item.id) || isTutorial}
                                                        className={`relative z-10 px-6 py-3 font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${playerState.installedSoftware.includes(item.id) ? 'border-blue-800/30 text-blue-800 cursor-not-allowed' : isTutorial ? 'border-gray-600 text-gray-600 cursor-not-allowed' : 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black shadow-[0_0_15px_rgba(96,165,250,0.3)]'}`}
                                                    >
                                                        {playerState.installedSoftware.includes(item.id) ? 'INSTALLED' : isTutorial ? 'LOCKED' : `${item.cost}c`}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {marketTab === 'hardware' && (
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                                        <div className="text-xs text-blue-500 font-black uppercase tracking-[0.4em] whitespace-nowrap">Hardware Evolution</div>
                                        <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                                    </div>

                                    {(['cpu', 'ram', 'storage', 'cooling', 'network'] as const).map(hwKey => {
                                        const current = playerState.hardware[hwKey];
                                        const nextUpgrade = MARKET_CATALOG.find(i =>
                                            i.category === 'hardware' &&
                                            (i as any).hardwareKey === hwKey &&
                                            (i as any).stats?.level === current.level + 1
                                        ) as any;

                                        return (
                                            <div key={hwKey} className="relative">
                                                {/* Category Label */}
                                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500/20"></div>

                                                <div className="grid grid-cols-1 gap-2">
                                                    {/* Current Spec - Fancy Card */}
                                                    <div className="bg-black border border-blue-500/10 p-4 flex justify-between items-center opacity-80">
                                                        <div>
                                                            <div className="text-[9px] text-blue-800 uppercase font-black tracking-widest mb-1">Current {hwKey} configuration</div>
                                                            <div className="text-white font-black uppercase tracking-tighter">
                                                                {MARKET_CATALOG.find(i => i.id === current.id)?.name || current.id.replace(/_/g, ' ')}
                                                            </div>
                                                            <div className="text-[10px] text-blue-500 font-mono mt-1">
                                                                {hwKey === 'cpu' && 'clockSpeed' in current && (
                                                                    <span>{current.clockSpeed >= 1 ? `${current.clockSpeed}GHz` : `${Math.round(current.clockSpeed * 1000)}MHz`} | {current.cores} Core(s)</span>
                                                                )}
                                                                {hwKey === 'ram' && 'capacity' in current && (
                                                                    <span>{current.capacity >= 1 ? `${current.capacity}GB` : `${Math.round(current.capacity * 1024)}MB`}</span>
                                                                )}
                                                                {hwKey === 'storage' && 'capacity' in current && (
                                                                    <span>{current.capacity >= 1 ? `${current.capacity}GB` : `${Math.round(current.capacity * 1024)}MB`}</span>
                                                                )}
                                                                {hwKey === 'cooling' && 'heatDissipation' in current && (
                                                                    <span>x{current.heatDissipation.toFixed(1)} Dissipation</span>
                                                                )}
                                                                {hwKey === 'network' && 'bandwidth' in current && (
                                                                    <span>{current.bandwidth >= 1 ? `${current.bandwidth}MB/s` : `${Math.round(current.bandwidth * 1000)}KB/s`}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] text-blue-700 font-bold uppercase">Status: Operational</div>
                                                            <div className="text-xs text-blue-500 font-mono">LVL_0{current.level}</div>
                                                        </div>
                                                    </div>

                                                    {/* Transition Arrow */}
                                                    <div className="flex justify-center -my-2 relative z-10">
                                                        <div className="bg-black px-4 text-blue-500 animate-bounce">▼</div>
                                                    </div>

                                                    {/* Next Upgrade - Fancy Card */}
                                                    <div className={`bg-blue-900/5 border-2 p-6 flex justify-between items-center transition-all ${nextUpgrade ? 'border-blue-500/40 hover:border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'border-yellow-600/20 opacity-50'}`}>
                                                        <div className="flex-grow">
                                                            {nextUpgrade ? (
                                                                <>
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <div className="text-white font-black text-xl uppercase tracking-tighter">{nextUpgrade.name}</div>
                                                                        <div className="text-[10px] bg-blue-500 text-black px-2 py-0.5 font-black rounded uppercase">Next Gen</div>
                                                                    </div>
                                                                    <div className="text-sm text-blue-700 italic max-w-xl">"{nextUpgrade.description}"</div>

                                                                    {/* Spec Comparison */}
                                                                    <div className="mt-4 flex gap-6">
                                                                        {hwKey === 'cpu' && 'clockSpeed' in current && nextUpgrade.stats && (
                                                                            <div className="text-[10px] font-bold flex flex-col">
                                                                                <span className="text-blue-900 uppercase">Clock Speed</span>
                                                                                <span className="text-blue-400">
                                                                                    {current.clockSpeed >= 1 ? `${current.clockSpeed}GHz` : `${Math.round(current.clockSpeed * 1000)}MHz`}
                                                                                    <span className="text-blue-600 mx-1">▶</span>
                                                                                    <span className={nextUpgrade.stats.clockSpeed > current.clockSpeed ? 'text-yellow-400' : 'text-red-500'}>
                                                                                        {nextUpgrade.stats.clockSpeed >= 1 ? `${nextUpgrade.stats.clockSpeed}GHz` : `${Math.round(nextUpgrade.stats.clockSpeed * 1000)}MHz`}
                                                                                        {nextUpgrade.stats.clockSpeed < current.clockSpeed && ' [DOWNGRADE]'}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {hwKey === 'ram' && 'capacity' in current && nextUpgrade.stats && (
                                                                            <div className="text-[10px] font-bold flex flex-col">
                                                                                <span className="text-blue-900 uppercase">Capacity</span>
                                                                                <span className="text-blue-400">
                                                                                    {current.capacity >= 1 ? `${current.capacity}GB` : `${Math.round(current.capacity * 1024)}MB`}
                                                                                    <span className="text-blue-600 mx-1">▶</span>
                                                                                    <span className={nextUpgrade.stats.capacity > current.capacity ? 'text-yellow-400' : 'text-red-500'}>
                                                                                        {nextUpgrade.stats.capacity >= 1 ? `${nextUpgrade.stats.capacity}GB` : `${Math.round(nextUpgrade.stats.capacity * 1024)}MB`}
                                                                                        {nextUpgrade.stats.capacity < current.capacity && ' [DOWNGRADE]'}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {hwKey === 'storage' && 'capacity' in current && nextUpgrade.stats && (
                                                                            <div className="text-[10px] font-bold flex flex-col">
                                                                                <span className="text-blue-900 uppercase">Storage</span>
                                                                                <span className="text-blue-400">
                                                                                    {current.capacity >= 1 ? `${current.capacity}GB` : `${Math.round(current.capacity * 1024)}MB`}
                                                                                    <span className="text-blue-600 mx-1">▶</span>
                                                                                    <span className={nextUpgrade.stats.capacity > current.capacity ? 'text-yellow-400' : 'text-red-500'}>
                                                                                        {nextUpgrade.stats.capacity >= 1 ? `${nextUpgrade.stats.capacity}GB` : `${Math.round(nextUpgrade.stats.capacity * 1024)}MB`}
                                                                                        {nextUpgrade.stats.capacity < current.capacity && ' [DOWNGRADE]'}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {hwKey === 'cooling' && 'heatDissipation' in current && nextUpgrade.stats && (
                                                                            <div className="text-[10px] font-bold flex flex-col">
                                                                                <span className="text-blue-900 uppercase">Dissipation</span>
                                                                                <span className="text-blue-400">x{current.heatDissipation.toFixed(1)} <span className="text-blue-600 mx-1">▶</span> x{nextUpgrade.stats.heatDissipation.toFixed(1)}</span>
                                                                            </div>
                                                                        )}
                                                                        {hwKey === 'network' && 'bandwidth' in current && nextUpgrade.stats && (
                                                                            <div className="text-[10px] font-bold flex flex-col">
                                                                                <span className="text-blue-900 uppercase">Bandwidth</span>
                                                                                <span className="text-blue-400">
                                                                                    {current.bandwidth >= 1 ? `${current.bandwidth}MB/s` : `${Math.round(current.bandwidth * 1000)}KB/s`}
                                                                                    <span className="text-blue-600 mx-1">▶</span>
                                                                                    <span className={nextUpgrade.stats.bandwidth > current.bandwidth ? 'text-yellow-400' : 'text-red-500'}>
                                                                                        {nextUpgrade.stats.bandwidth >= 1 ? `${nextUpgrade.stats.bandwidth}MB/s` : `${Math.round(nextUpgrade.stats.bandwidth * 1000)}KB/s`}
                                                                                        {nextUpgrade.stats.bandwidth < current.bandwidth && ' [DOWNGRADE]'}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-center py-4">
                                                                    <div className="text-yellow-500 font-black text-xl uppercase tracking-[0.3em]">Maximum Level Reached</div>
                                                                    <div className="text-[10px] text-yellow-800 uppercase mt-1">No further upgrades available for this component</div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {nextUpgrade && (
                                                            <button
                                                                onClick={() => handlePurchase(nextUpgrade.id)}
                                                                disabled={playerState.credits < nextUpgrade.cost || isTutorial}
                                                                className={`px-8 py-4 font-black text-sm uppercase tracking-[0.2em] transition-all border-2 ${playerState.credits < nextUpgrade.cost ? 'border-red-900/30 text-red-900 cursor-not-allowed' : isTutorial ? 'border-gray-600 text-gray-600 cursor-not-allowed' : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}
                                                            >
                                                                {playerState.credits < nextUpgrade.cost ? 'INSUFFICIENT_CR' : isTutorial ? 'LOCKED' : `UPGRADE: ${nextUpgrade.cost}c`}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {marketTab === 'security' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                                        <div className="text-xs text-blue-500 font-black uppercase tracking-[0.4em] whitespace-nowrap">Security & Encryption</div>
                                        <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {MARKET_CATALOG.filter(i => i.category === 'security').map(item => (
                                            <div key={item.id} className="bg-blue-950/20 border border-blue-500/20 p-5 flex justify-between items-center hover:border-blue-400/50 transition-all group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/5 transition-colors pointer-events-none"></div>
                                                <div className="relative z-10">
                                                    <div className="text-white font-black text-lg group-hover:text-blue-300 transition-colors uppercase tracking-tighter mb-1">{item.name}</div>
                                                    <div className="text-xs text-blue-300/70 max-w-md italic">"{item.description}"</div>
                                                </div>
                                                <button
                                                    onClick={() => handlePurchase(item.id)}
                                                    disabled={playerState.credits < item.cost || playerState.installedSoftware.includes(item.id) || isTutorial}
                                                    className={`relative z-10 px-6 py-3 font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${playerState.installedSoftware.includes(item.id) ? 'border-blue-800/30 text-blue-800 cursor-not-allowed' : isTutorial ? 'border-gray-600 text-gray-600 cursor-not-allowed' : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black shadow-[0_0_15px_rgba(59,130,246,0.2)]'}`}
                                                >
                                                    {playerState.installedSoftware.includes(item.id) ? 'INSTALLED' : isTutorial ? 'LOCKED' : `${item.cost}c`}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {marketTab === 'consumables' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                                        <div className="text-xs text-blue-500 font-black uppercase tracking-[0.4em] whitespace-nowrap">Disposable Field Assets</div>
                                        <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {MARKET_CATALOG.filter(i => i.category === 'consumable').map(item => (
                                            <div key={item.id} className="bg-blue-950/20 border border-blue-500/20 p-5 flex justify-between items-center hover:border-blue-400/50 transition-all group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/5 transition-colors pointer-events-none"></div>
                                                <div className="relative z-10">
                                                    <div className="text-white font-black text-lg group-hover:text-blue-300 transition-colors uppercase tracking-tighter mb-1">{item.name}</div>
                                                    <div className="text-xs text-blue-300/70 max-w-md italic">"{item.description}"</div>
                                                </div>
                                                <button
                                                    onClick={() => handlePurchase(item.id)}
                                                    disabled={playerState.credits < item.cost || isTutorial}
                                                    className={`relative z-10 px-6 py-3 font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${playerState.credits < item.cost ? 'border-red-900/30 text-red-900 cursor-not-allowed' : isTutorial ? 'border-gray-600 text-gray-600 cursor-not-allowed' : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black shadow-[0_0_15px_rgba(59,130,246,0.2)]'}`}
                                                >
                                                    {isTutorial ? 'LOCKED' : `${item.cost}c`}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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
                            className={`bg-transparent border-none outline-none w-full text-sm ${isTutorial ? 'text-gray-500 cursor-not-allowed' : 'text-green-500'}`}
                            onKeyDown={(e) => e.key === 'Enter' && !isTutorial && navigate(url)}
                            disabled={isTutorial}
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

                    {/* Command Info Modal */}
                    {selectedCommandInfo && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-12 animate-[fadeIn_0.2s_ease-out]">
                            <div className="w-full max-w-2xl max-h-[90%] bg-black border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col">
                                <div className="bg-blue-900/30 p-4 border-b-2 border-blue-500 flex justify-between items-center shrink-0">
                                    <h3 className="text-xl font-black text-blue-400 uppercase tracking-tighter italic">
                                        Command Documentation: {selectedCommandInfo}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedCommandInfo(null)}
                                        className="text-blue-500 hover:text-white text-2xl font-bold"
                                    >
                                        [X]
                                    </button>
                                </div>
                                <div className="p-8 overflow-y-auto custom-scrollbar">
                                    {(() => {
                                        const cmdId = selectedCommandInfo.startsWith('ransom_t') ? 'ransomware' : selectedCommandInfo;
                                        const cmd = COMMAND_REGISTRY[cmdId];
                                        const marketItem = MARKET_CATALOG.find(i => i.id === selectedCommandInfo) as any;
                                        const manPage = MAN_PAGES[cmdId];

                                        if (!cmd) return <div className="text-red-500">Documentation not found for this binary.</div>;

                                        const currentRAM = playerState.hardware.ram.capacity * 1024; // GB to MB
                                        const currentStorage = playerState.hardware.storage.capacity * 1024; // GB to MB

                                        return (
                                            <div className="space-y-6">
                                                <div>
                                                    <div className="text-blue-900 text-[10px] font-black uppercase tracking-widest mb-1">Description</div>
                                                    <div className="text-blue-100 text-lg leading-relaxed italic">"{cmd.description}"</div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-8">
                                                    <div>
                                                        <div className="text-blue-900 text-[10px] font-black uppercase tracking-widest mb-1">Usage Syntax</div>
                                                        <div className="bg-blue-900/10 border border-blue-500/30 p-3 font-mono text-blue-400">
                                                            {cmd.usage}
                                                        </div>
                                                    </div>
                                                    {manPage && manPage.examples.length > 0 && (
                                                        <div className="col-span-2">
                                                            <div className="text-blue-900 text-[10px] font-black uppercase tracking-widest mb-1">Usage Examples</div>
                                                            <div className="bg-blue-900/10 border border-blue-500/30 p-3 font-mono text-cyan-400 space-y-1">
                                                                {manPage.examples.map((ex, i) => (
                                                                    <div key={i}>{ex}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-blue-900 text-[10px] font-black uppercase tracking-widest mb-1">Binary Type</div>
                                                        <div className="text-blue-400 font-bold uppercase">
                                                            {cmd.isDefaultCommand ? 'System Core' : 'External Utility'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {marketItem && (
                                                    <div className="border-t border-blue-900/50 pt-6">
                                                        <div className="text-blue-900 text-[10px] font-black uppercase tracking-widest mb-4">Hardware Compatibility Analysis</div>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center bg-blue-900/5 p-2 border border-blue-900/20">
                                                                <div className="text-xs text-blue-400 uppercase font-bold">CPU Load Requirement</div>
                                                                <div className="text-right">
                                                                    <div className="text-[10px] text-blue-800 uppercase">Required: {marketItem.cpuReq}% | Current: {playerState.hardware.cpu.cores} Core(s)</div>
                                                                    <div className={`text-xs font-mono ${marketItem.cpuReq <= 100 ? 'text-green-500' : 'text-red-500'}`}>
                                                                        {marketItem.cpuReq <= 100 ? '[ COMPATIBLE ]' : '[ OVERLOAD RISK ]'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-blue-900/5 p-2 border border-blue-900/20">
                                                                <div className="text-xs text-blue-400 uppercase font-bold">Memory Footprint</div>
                                                                <div className="text-right">
                                                                    <div className="text-[10px] text-blue-800 uppercase">Required: {marketItem.ramReq}MB | Current: {currentRAM}MB</div>
                                                                    <div className={`text-xs font-mono ${currentRAM >= marketItem.ramReq ? 'text-green-500' : 'text-red-500'}`}>
                                                                        {currentRAM >= marketItem.ramReq ? '[ SUFFICIENT ]' : '[ INSUFFICIENT ]'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-blue-900/5 p-2 border border-blue-900/20">
                                                                <div className="text-xs text-blue-400 uppercase font-bold">Storage Allocation</div>
                                                                <div className="text-right">
                                                                    <div className="text-[10px] text-blue-800 uppercase">Required: {marketItem.storageSize}MB | Current: {currentStorage}MB</div>
                                                                    <div className={`text-xs font-mono ${currentStorage >= marketItem.storageSize ? 'text-green-500' : 'text-red-500'}`}>
                                                                        {currentStorage >= marketItem.storageSize ? '[ AVAILABLE ]' : '[ NO SPACE ]'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="border-t border-blue-900/50 pt-6">
                                                    <div className="text-blue-900 text-[10px] font-black uppercase tracking-widest mb-4">Technical Specifications</div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="bg-blue-900/5 p-3 border border-blue-900/20">
                                                            <div className="text-[9px] text-blue-800 uppercase mb-1">Execution</div>
                                                            <div className="text-xs text-blue-300">{cmd.isLocalOnly ? 'Local Only' : cmd.isRemoteOnly ? 'Remote Only' : 'Universal'}</div>
                                                        </div>
                                                        <div className="bg-blue-900/5 p-3 border border-blue-900/20">
                                                            <div className="text-[9px] text-blue-800 uppercase mb-1">Privilege</div>
                                                            <div className="text-xs text-blue-300">User Level</div>
                                                        </div>
                                                        <div className="bg-blue-900/5 p-3 border border-blue-900/20">
                                                            <div className="text-[9px] text-blue-800 uppercase mb-1">Registry ID</div>
                                                            <div className="text-xs text-blue-300">{cmd.id}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 italic text-xs text-blue-700 leading-relaxed">
                                                    NOTICE: This documentation is provided by Macro-Electronics. Unauthorized distribution of binary specifications is a violation of the Digital Sovereignty Act of 2024.
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="bg-black p-4 border-t border-blue-900/50 flex justify-end">
                                    <button
                                        onClick={() => setSelectedCommandInfo(null)}
                                        className="px-8 py-2 bg-blue-600 text-white font-black uppercase text-xs hover:bg-blue-500 transition-colors"
                                    >
                                        Close Documentation
                                    </button>
                                </div>
                            </div>
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
