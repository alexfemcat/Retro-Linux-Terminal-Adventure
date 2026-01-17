import { PlayerState, Directory, VFSNode } from '../types';
import { MARKET_CATALOG } from '../data/marketData';

function getFileSize(name: string, content: string): number {
    const ext = name.split('.').pop()?.toLowerCase();

    // Binaries / Executables
    if (ext === 'exe' || ext === 'bin' || ext === 'deb' || ext === 'sh' || content.includes('[BINARY]')) {
        const software = MARKET_CATALOG.find(i => i.id === name);
        if (software && 'storageSize' in software) {
            return software.storageSize * 1024; // MB to KB
        }
        return 20 * 1024 + Math.random() * 1000 * 1024; // 20MB - 1GB in KB
    }

    // Default for other file types
    return Math.max(1, Math.round(content.length / 1024)); // Proportional to content length, min 1KB
}


export function syncBinDirectory(playerState: PlayerState, vfs: VFSNode): VFSNode {
    if (vfs.type !== 'directory' || !vfs.children.home) {
        return vfs;
    }

    const homeDir = vfs.children.home as Directory;
    if (!homeDir.children.user) {
        return vfs;
    }

    const userHome = homeDir.children.user as Directory;
    if (!userHome.children.bin) {
        userHome.children.bin = { type: 'directory', name: 'bin', children: {}, size: 0 };
    }

    const binDir = userHome.children.bin as Directory;

    // Clear existing binaries to handle uninstalls (if that becomes a feature)
    binDir.children = {};

    const softwareToInstall = playerState.installedSoftware || [];

    // Add default commands that should always be present
    const defaultCommands = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'clear', 'exit', 'inv', 'rm', 'kill', 'echo', 'alias', 'sh', 'theme', 'settings', 'market', 'jobs'];
    const allSoftware = [...new Set([...defaultCommands, ...softwareToInstall])];


    allSoftware.forEach((soft: string) => {
        binDir.children[soft] = {
            type: 'file',
            name: soft,
            content: '[EXECUTABLE BINARY]',
            size: getFileSize(soft, '[EXECUTABLE BINARY]')
        };
    });

    return vfs;
}
