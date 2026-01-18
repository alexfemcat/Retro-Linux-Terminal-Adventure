import { CommandDefinition } from '../types';

export const DEV_COMMAND_REGISTRY: Record<string, CommandDefinition> = {
    'devhelp': { id: 'devhelp', description: 'Lists developer sandbox utilities.', usage: 'devhelp', isAlwaysAvailable: false, isLocalOnly: false },
    'dev-guide': { id: 'dev-guide', description: 'Reference guides for animations, triggers, and missions.', usage: 'dev-guide <animations|triggers|commands|missions>', isAlwaysAvailable: false, isLocalOnly: false },
    'spawn': { id: 'spawn', description: 'Inject state (software, hardware, item, credits).', usage: 'spawn <software|hardware|item|credits> [args]', isAlwaysAvailable: false, isLocalOnly: false },
    'debug-anim': { id: 'debug-anim', description: 'Trigger system animations (bios, panic, glitch).', usage: 'debug-anim <bios|panic|glitch> [--level 1-10]', isAlwaysAvailable: false, isLocalOnly: false },
    'dev-set-load': { id: 'dev-set-load', description: 'Manually set CPU/RAM load for testing.', usage: 'dev-set-load --cpu [0-100] --ram [0-100]', isAlwaysAvailable: false, isLocalOnly: false },
    'dev-mission': { id: 'dev-mission', description: 'Instantly generate and deploy a mission.', usage: 'dev-mission [tier 1-6]', isAlwaysAvailable: false, isLocalOnly: false },
    'dev-reveal': { id: 'dev-reveal', description: 'Reveal all hidden nodes in the current network.', usage: 'dev-reveal', isAlwaysAvailable: false, isLocalOnly: false },
    'dev-reset': { id: 'dev-reset', description: 'Wipe dev sandbox back to defaults.', usage: 'dev-reset', isAlwaysAvailable: false, isLocalOnly: false },
    'logout': { id: 'logout', description: 'Exit developer sandbox and return to user session.', usage: 'logout', isAlwaysAvailable: false, isLocalOnly: false },
};
