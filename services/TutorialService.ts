import { GameState, NetworkNode, PlayerState, Directory } from '../types';

export interface TutorialStep {
    id: string;
    message: string;
    expectedCommand?: string; // Regex or specific command
    check: (command: string, args: string[], gameState: GameState, playerState: PlayerState) => boolean;
    onComplete?: (gameState: GameState, playerState: PlayerState) => Partial<GameState | PlayerState> | void;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        message: "INITIATING TRAINING SIMULATION...\n\n[THE ARCHITECT]: Welcome, Initiate. I am The Architect. I will guide you through your basic training.\nWe must first assess your situational awareness.\n\nThe 'ls' command (List) reveals the contents of your current location. Use it now to scan your surroundings.\n\nType 'ls' and press Enter.",
        check: (cmd) => cmd === 'ls'
    },
    {
        id: 'man_page',
        message: "[THE ARCHITECT]: Good. Knowledge is power. The 'man' command (Manual) provides detailed documentation for any system utility.\nIf you are ever confused about a tool, 'man' is your best friend.\n\nLearn more about the 'ls' command by typing 'man ls'.",
        check: (cmd, args) => cmd === 'man' && args[0] === 'ls'
    },
    {
        id: 'read_file',
        message: "[THE ARCHITECT]: Good. I detect a text file 'welcome.txt'.\nThe 'cat' command (Concatenate) reads and displays file contents.\n\nRead the file by typing 'cat welcome.txt'.",
        check: (cmd, args) => cmd === 'cat' && args[0] === 'welcome.txt'
    },
    {
        id: 'change_dir',
        message: "[THE ARCHITECT]: Excellent. The file system is a tree of directories. We need to move deeper.\nUse the 'cd' command (Change Directory) to enter the 'bin' folder.\n\nType 'cd bin'.",
        check: (cmd, args) => cmd === 'cd' && args[0] === 'bin'
    },
    {
        id: 'nano_editor',
        message: "[THE ARCHITECT]: Sometimes you need to record information or create scripts. The 'nano' command opens a text editor.\n\nCreate a new file named 'notes.txt' by typing 'nano notes.txt'. Inside, type anything, then press Ctrl+O to save and Ctrl+X to exit.",
        check: (cmd, args) => {
            return cmd === 'nano' && args[0] === 'notes.txt';
        }
    },
    {
        id: 'go_back',
        message: "[THE ARCHITECT]: You are now in the binary folder. To move 'up' one level back to your home, use the parent directory shortcut '..'.\n\nReturn home by typing 'cd ..'.",
        check: (cmd, args) => cmd === 'cd' && args[0] === '..'
    },
    {
        id: 'scan_network',
        message: "[THE ARCHITECT]: Basic navigation confirmed. Phase 2: Network Reconnaissance.\nWe have detected a target device on the local training subnet.\nTo find open doors, we use 'nmap-lite' (Network Mapper Lite).\n\nScan the IP '192.168.1.55'. Type 'nmap-lite 192.168.1.55'. Wait for the command to compelete.",
        check: (cmd, args) => cmd === 'nmap-lite' && args[0] === '192.168.1.55'
    },
    {
        id: 'ssh_connect',
        message: "[THE ARCHITECT]: Analysis: Port 22 is open. This indicates an SSH (Secure Shell) service, allowing remote control.\nConnect to the target using the standard user protocol.\n\nType 'ssh user@192.168.1.55'. The password is 'training' ",
        check: () => false, // This step is completed programmatically in Terminal.tsx on successful login
        onComplete: (_gameState, _playerState) => {
            // This step completes upon successful login, which is handled in Terminal.tsx
        }
    },
    {
        id: 'infiltrate_docs',
        message: "[THE ARCHITECT]: Access Granted. You are now inside the remote system.\nOur objective is the training data. It is likely in the Documents folder.\n\nNavigate there: Type 'cd Documents'.",
        check: (cmd, args, gameState) => {
            return cmd === 'cd' && args[0].startsWith('Documents') && gameState.nodes[gameState.activeNodeIndex].id === 'tutorial-target';
        }
    },
    {
        id: 'download_file',
        message: "[THE ARCHITECT]: Target located: 'TRAINING_DATA.dat'. We need to extract this to your local machine.\nThe 'download' command transfers files securely.\n\nType 'download TRAINING_DATA.dat'.",
        check: (cmd, args) => (cmd === 'download' || cmd === 'scp') && args[0] === 'TRAINING_DATA.dat'
    },
    {
        id: 'disconnect',
        message: "[THE ARCHITECT]: Wait for the download to complete. Lets disconnect before anyone finds out what we were up to.\nDisconnect and return to your own terminal.\n\nType 'exit'.",
        check: (cmd) => cmd === 'exit'
    },
    {
        id: 'check_inv',
        message: "[THE ARCHITECT]: Welcome back. In a regular mission you would now sell the data you extracted.\nThe 'inv' command inspects your local storage capacity and loot.\n\nType 'inv'.",
        check: (cmd, args) => cmd === 'inv' || (cmd === 'ls' && args && args[0] === 'loot')
    },
    {
        id: 'check_market',
        message: "[THE ARCHITECT]: Successful operations yield Credits. You use these to upgrade your rig or buy software tools.\nOpen the exchange.\n\nType 'browser' to see different kinds of services available to you.",
        check: (cmd) => cmd === 'browser'
    },
    {
        id: 'complete_tutorial',
        message: "[THE ARCHITECT]: Training Module Complete. You have proven yourself capable.\n\nUse 'help' to access the full command database.\nUse the 'browser' to find work on the Dark Web and start your career.\n\nExit the browser by clicking the red close button on the top left, then type 'exit' to close the simulation.",
        check: (cmd) => cmd === 'exit'
    }
];

export class TutorialService {
    public static generateTutorialState(_playerState: PlayerState): GameState {
        // Create a contained environment
        const localNode: NetworkNode = {
            id: 'local',
            hostname: 'training-terminal',
            ip: '127.0.0.1',
            osVersion: 'RetroOS 2.0 (Training Mode)',
            themeColor: 'text-green-400',
            vfs: {
                type: 'directory', name: '', size: 0, children: {
                    home: {
                        type: 'directory', name: 'home', size: 0, children: {
                            user: {
                                type: 'directory', name: 'user', size: 0, children: {
                                    'welcome.txt': { type: 'file', name: 'welcome.txt', content: "Welcome to the training program.\nFollow The Architect's instructions carefully.", size: 0.1 },
                                    bin: { type: 'directory', name: 'bin', size: 0, children: {} },
                                    loot: { type: 'directory', name: 'loot', size: 0, children: {} }
                                }
                            }
                        }
                    }
                }
            },
            processes: [],
            envVars: { USER: 'initiate', SHELL: '/bin/bash' },
            ports: [],
            vulnerabilities: [],
            isDiscovered: true,
            currentUser: 'user'
        };

        const targetNode: NetworkNode = {
            id: 'tutorial-target',
            hostname: 'dummy-target',
            ip: '192.168.1.55',
            osVersion: 'Training OS',
            themeColor: 'text-amber-400',
            vfs: {
                type: 'directory', name: '', size: 0, children: {
                    home: {
                        type: 'directory', name: 'home', size: 0, children: {
                            user: {
                                type: 'directory', name: 'user', size: 0, children: {
                                    Documents: {
                                        type: 'directory', name: 'Documents', size: 0, children: {
                                            'TRAINING_DATA.dat': { type: 'file', name: 'TRAINING_DATA.dat', content: '[SECRET TRAINING DATA]', size: 10 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            processes: [],
            envVars: {},
            ports: [{ port: 22, service: 'ssh', version: 'OpenSSH', isOpen: true }],
            vulnerabilities: [],
            isDiscovered: true, // Auto-discover for simplicity in recon phase? Or keep hidden until nmap? Let's say hidden but accessible.
            rootPassword: 'training',
            currentUser: 'user'
        };

        // Populate local bin with essential tools
        const userHome = ((localNode.vfs.children.home as Directory).children.user as Directory);
        const binDir = userHome.children.bin as Directory;
        ['ls', 'cd', 'cat', 'nmap-lite', 'ssh', 'download', 'exit', 'inv', 'market', 'help'].forEach(cmd => {
            binDir.children[cmd] = { type: 'file', name: cmd, content: '[BINARY]', size: 1 };
        });

        return {
            nodes: [localNode, targetNode],
            activeNodeIndex: 0,
            winCondition: { type: 'file_found', nodeId: 'tutorial-target', path: [] }, // Dummy win condition
            scenario: {
                theme: 'Training Simulation',
                welcomeMessage: 'TRAINING MODE ACTIVE',
                clueTemplate: () => '',
                starterClueTemplate: () => '',
                clueFileNameOptions: [],
                distractionFiles: {},
                distractionDirs: []
            },
            bootTime: Date.now(),
            currentDate: new Date().toISOString().split('T')[0],
            traceProgress: 0,
            isTraceActive: false,
            activeWorldEvents: []
        };
    }
}
