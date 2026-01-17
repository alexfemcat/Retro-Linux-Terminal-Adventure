import React from 'react';
import { PlayerState } from '../types';

interface SettingsProps {
    playerState: PlayerState;
    onPlayerStateChange: (newState: PlayerState) => void;
    onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ playerState, onPlayerStateChange, onClose }) => {
    const settings = playerState.settings || {};

    const handleToggle = (key: string, value: boolean) => {
        onPlayerStateChange({
            ...playerState,
            settings: { ...settings, [key]: value },
        });
    };

    const handleNumericChange = (key: string, value: number) => {
        onPlayerStateChange({
            ...playerState,
            settings: { ...settings, [key]: value },
        });
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center font-vt323 text-[#33ff00]">
            <div className="w-[960px] h-[720px] flex flex-col items-center justify-center text-2xl md:text-3xl text-center space-y-4 crt-screen p-8 bg-black rounded-[20px] border-4 border-[#33ff00]/30 shadow-[0_0_30px_#33ff0055]">
                <h1 className="text-[#33ff00] text-6xl mb-2 tracking-[0.2em] font-bold drop-shadow-[0_0_10px_rgba(51,255,0,0.5)]">SETTINGS</h1>

                <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">CRT Effects</h2>
                        <label className="flex items-center">
                            <input type="checkbox" checked={settings.scanlines} onChange={e => handleToggle('scanlines', e.target.checked)} />
                            <span className="ml-2">Scanlines</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" checked={settings.flicker} onChange={e => handleToggle('flicker', e.target.checked)} />
                            <span className="ml-2">Flicker</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" checked={settings.chromaticAberration} onChange={e => handleToggle('chromaticAberration', e.target.checked)} />
                            <span className="ml-2">Chromatic Aberration</span>
                        </label>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Accessibility</h2>
                        <label className="flex items-center">
                            <span className="mr-2">Font Size:</span>
                            <input type="range" min="12" max="24" value={settings.fontSize || 16} onChange={e => handleNumericChange('fontSize', parseInt(e.target.value))} />
                            <span className="ml-2">{settings.fontSize || 16}px</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" checked={settings.disableJitter} onChange={e => handleToggle('disableJitter', e.target.checked)} />
                            <span className="ml-2">Disable Jitter</span>
                        </label>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 px-6 py-2 border-2 border-[#33ff00] hover:bg-[#33ff00] hover:text-black transition-colors duration-300 text-xl font-bold uppercase tracking-wider"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
