import type { Directory, Scenario, GameState, Process, File, NetworkNode, NetworkPort, WinCondition, PlayerState, MissionConfig, Vulnerability, VulnerabilityType } from '../types';
import { scenarios, petNames, cities, colors, years, processNames, envVarKeys, envVarValues, usernames, hostnames, fakeIPs, fakePasswords, fakeTokens, trashFiles } from '../data/gameData';

class PuzzleGenerator {
    private getRandom<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private getRandomSubset<T>(arr: T[], count: number): T[] {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, arr.length));
    }

    private getFileSize(name: string, content: string): number {
        const ext = name.split('.').pop()?.toLowerCase();

        // 1. Databases / High Value Loot (.db, .sql, .vault)
        if (ext === 'db' || ext === 'sql' || ext === 'vault' || name.includes('database') || name.includes('SECRET')) {
            return 500 * 1024 + Math.random() * 7500 * 1024; // 500MB - 8GB in KB
        }

        // 2. Media / Video / Images
        if (ext === 'mp4' || ext === 'mov' || ext === 'avi' || ext === 'jpg' || ext === 'png' || ext === 'bmp') {
            return 5 * 1024 + Math.random() * 4000 * 1024; // 5MB - 4GB in KB
        }

        // 3. Binaries / Executables
        if (ext === 'exe' || ext === 'bin' || ext === 'deb' || ext === 'sh' || content.includes('[BINARY]')) {
            return 20 * 1024 + Math.random() * 1000 * 1024; // 20MB - 1GB in KB
        }

        // 4. Logs
        if (ext === 'log' || name.includes('history')) {
            return Math.max(1, Math.round(content.length / 1024)) + (1024 + Math.random() * 9 * 1024); // 1MB - 10MB in KB + content length
        }

        // 5. Documents / Text / Clues
        return Math.max(1, Math.round(content.length / 1024)); // Proportional to content length, min 1KB
    }

    private calculateDirectorySize(directory: Directory): number {
        let totalSize = 0;
        for (const childName in directory.children) {
            const child = directory.children[childName];
            if (child.type === 'file') {
                totalSize += child.size;
            } else if (child.type === 'directory') {
                child.size = this.calculateDirectorySize(child);
                totalSize += child.size;
            }
        }
        return totalSize;
    }

    private generateSystemState(scenarioTheme: string): { bootTime: number, processes: Process[], envVars: Record<string, string> } {
        // 1. Boot Time (random time in the last 24 hours)
        const bootTime = Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000);

        // 2. Processes
        const processes: Process[] = [];
        let pidCounter = 100;

        // Add generic processes
        processNames['generic'].forEach(name => {
            processes.push({
                pid: pidCounter++,
                name: name,
                user: name === 'init' || name === 'systemd' ? 'root' : 'system',
                cpu: Math.random() * 0.5,
                mem: Math.random() * 2.0,
                start: new Date(bootTime + Math.random() * 10000).toLocaleTimeString(),
                command: `/bin/${name}`
            });
        });

        // Add thematic processes
        const themeProcs = processNames[scenarioTheme] || processNames['Corporate Espionage']; // Fallback
        themeProcs.forEach(name => {
            processes.push({
                pid: pidCounter++,
                name: name,
                user: 'root', // Thematic processes usually run as root or specialized user
                cpu: Math.random() * 5.0,
                mem: Math.random() * 10.0,
                start: new Date(bootTime + Math.random() * 3600000).toLocaleTimeString(),
                command: `/usr/bin/${name} --daemon`
            });
        });

        // 3. Environment Variables
        const envVars: Record<string, string> = {};
        // Add standard vars
        envVars['USER'] = 'user';
        envVars['TERM'] = 'xterm-256color';
        envVars['PATH'] = '/usr/local/bin:/usr/bin:/bin';
        envVars['PWD'] = '/home/user';

        // Add ~5 random flavor vars
        for (let i = 0; i < 5; i++) {
            const key = this.getRandom(envVarKeys);
            const val = this.getRandom(envVarValues);
            envVars[key] = val;
        }

        return { bootTime, processes, envVars };
    }

    private generatePorts(nodeType: 'workstation' | 'server' | 'database'): NetworkPort[] {
        const ports: NetworkPort[] = [];
        const sshPort: NetworkPort = { port: 22, service: 'ssh', version: 'OpenSSH 8.9p1', isOpen: true };

        switch (nodeType) {
            case 'workstation':
                if (Math.random() > 0.3) ports.push(sshPort); // Workstations might not have SSH
                break;
            case 'server':
                ports.push(sshPort);
                ports.push({ port: 80, service: 'http', version: 'Apache/2.4.52', isOpen: true });
                if (Math.random() > 0.5) ports.push({ port: 443, service: 'https', version: 'Apache/2.4.52', isOpen: true });
                break;
            case 'database':
                ports.push(sshPort);
                ports.push({ port: 5432, service: 'postgresql', version: 'PostgreSQL 14.2', isOpen: true });
                break;
        }
        return ports;
    }

    private generateVulnerabilities(difficulty: number): Vulnerability[] {
        const vulnerabilities: Vulnerability[] = [];
        const types: VulnerabilityType[] = ['ssh', 'service', 'db', 'kernel'];
        const numVulns = 1 + Math.floor(Math.random() * Math.min(3, difficulty));

        for (let i = 0; i < numVulns; i++) {
            const type = this.getRandom(types);
            const level = Math.min(5, Math.max(1, Math.floor(difficulty + (Math.random() * 2 - 1)))) as 1 | 2 | 3 | 4 | 5;

            let entryPoint = '';
            let hint = '';

            switch (type) {
                case 'ssh':
                    entryPoint = 'port 22';
                    hint = Math.random() > 0.5 ? 'Weak SSH key exchange protocol' : 'SSH-2.0-OpenSSH_7.4 Old Version';
                    break;
                case 'service':
                    entryPoint = Math.random() > 0.5 ? 'port 80' : 'port 8080';
                    hint = 'Apache/2.4.41 (Ubuntu) mod_ssl/2.4.41';
                    break;
                case 'db':
                    entryPoint = 'port 5432';
                    hint = 'PostgreSQL 9.6 - Blind SQL Injection possible';
                    break;
                case 'kernel':
                    entryPoint = 'local-system';
                    hint = 'Linux Kernel 4.15 - CVE-2021-33909 (Dirty Pipe)';
                    break;
            }

            vulnerabilities.push({
                type,
                level,
                entryPoint,
                hint,
                isExploited: false
            });
        }

        return vulnerabilities;
    }

    private generateSocialPuzzle(): { password: string, hint: string, components: { type: string, value: string, file: string, content: string }[] } {
        // Updated schemes to match the actual file content generated below
        const schemes = [
            { types: ['pet', 'year'], template: "the name of the pet in the photo followed by the year I was born" },
            { types: ['city', 'color'], template: "the destination of my trip followed by the color of the dress in my diary" },
            { types: ['color', 'pet'], template: "the color of the dress in my diary followed by the name of the pet in the photo" },
            { types: ['year', 'city'], template: "the year I was born followed by the destination of my trip" },
        ];

        const scheme = this.getRandom(schemes);
        const components = scheme.types.map(type => {
            let value = "";
            let file = "";
            let content = "";
            if (type === 'pet') {
                value = this.getRandom(petNames);
                file = "pet_photo.jpg.meta";
                content = `Metadata: Photo of ${value} playing in the park.`;
            } else if (type === 'city') {
                value = this.getRandom(cities);
                file = "travel_ticket.pdf";
                content = `Flight Confirmation:\nDestination: ${value}\nStatus: Confirmed`;
            } else if (type === 'year') {
                value = this.getRandom(years);
                file = "birth_certificate.txt";
                content = `Certified Copy\nDate of Birth: January 15, ${value}`;
            } else if (type === 'color') {
                value = this.getRandom(colors);
                file = "diary_entry.txt";
                content = `Dear Diary,\nToday I bought a new ${value} dress. It looks amazing!`;
            }
            return { type, value, file, content };
        });

        return {
            password: components.map(c => c.value).join(''),
            hint: scheme.template,
            components
        };
    }

    private generateHoneypots(node: NetworkNode): void {
        // Create /var/log if it doesn't exist
        if (!node.vfs.children['var']) {
            node.vfs.children['var'] = { type: 'directory', name: 'var', children: {}, size: 0 };
        }
        const varDir = node.vfs.children['var'] as Directory;
        if (!varDir.children['log']) {
            varDir.children['log'] = { type: 'directory', name: 'log', children: {}, size: 0 };
        }
        const logDir = varDir.children['log'] as Directory;

        // Create /tmp if it doesn't exist
        if (!node.vfs.children['tmp']) {
            node.vfs.children['tmp'] = { type: 'directory', name: 'tmp', children: {}, size: 0 };
        }
        const tmpDir = node.vfs.children['tmp'] as Directory;

        // Generate fake auth log with 200-300 fake entries
        const fakeAuthEntries: string[] = [];
        const numFakeAuths = 200 + Math.floor(Math.random() * 100);
        for (let i = 0; i < numFakeAuths; i++) {
            const fakeIP = this.getRandom(fakeIPs);
            const fakeUser = this.getRandom(usernames);
            const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
            fakeAuthEntries.push(`${timestamp} sshd[${1000 + i}]: Failed password for ${fakeUser} from ${fakeIP} port ${20000 + i}`);
        }
        logDir.children['auth.log'] = {
            type: 'file',
            name: 'auth.log',
            content: fakeAuthEntries.join('\n'),
            size: this.getFileSize('auth.log', fakeAuthEntries.join('\n'))
        };

        // Generate fake password dump with 200-300 entries
        const numFakePasswords = 200 + Math.floor(Math.random() * 100);
        const fakePasswordList = this.getRandomSubset(fakePasswords, numFakePasswords);
        tmpDir.children['password_dump.txt'] = {
            type: 'file',
            name: 'password_dump.txt',
            content: `# Password dump from unknown source\n# WARNING: These may be compromised\n\n` + fakePasswordList.join('\n'),
            size: this.getFileSize('password_dump.txt', fakePasswordList.join('\n'))
        };

        // Generate fake IP list
        tmpDir.children['ip_scan_results.txt'] = {
            type: 'file',
            name: 'ip_scan_results.txt',
            content: `# Network scan results\n# Discovered hosts:\n\n` + this.getRandomSubset(fakeIPs, 50).join('\n'),
            size: this.getFileSize('ip_scan_results.txt', this.getRandomSubset(fakeIPs, 50).join('\n'))
        };

        // Generate fake tokens
        tmpDir.children['leaked_tokens.txt'] = {
            type: 'file',
            name: 'leaked_tokens.txt',
            content: `# Leaked authentication tokens\n\n` + fakeTokens.join('\n'),
            size: this.getFileSize('leaked_tokens.txt', fakeTokens.join('\n'))
        };
    }

    private generateAuthLog(node: NetworkNode, realClues: { ip?: string, username?: string }): void {
        // Create /var/log if it doesn't exist
        if (!node.vfs.children['var']) {
            node.vfs.children['var'] = { type: 'directory', name: 'var', children: {}, size: 0 };
        }
        const varDir = node.vfs.children['var'] as Directory;
        if (!varDir.children['log']) {
            varDir.children['log'] = { type: 'directory', name: 'log', children: {}, size: 0 };
        }
        const logDir = varDir.children['log'] as Directory;

        const authEntries: string[] = [];
        const numEntries = 50 + Math.floor(Math.random() * 50);

        for (let i = 0; i < numEntries; i++) {
            const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
            const user = Math.random() > 0.7 ? this.getRandom(usernames) : 'user';
            const ip = Math.random() > 0.7 ? this.getRandom(fakeIPs) : '192.168.1.1';
            const success = Math.random() > 0.3;

            if (success) {
                authEntries.push(`${timestamp} sshd[${5000 + i}]: Accepted password for ${user} from ${ip} port ${30000 + i}`);
            } else {
                authEntries.push(`${timestamp} sshd[${5000 + i}]: Failed password for ${user} from ${ip} port ${30000 + i}`);
            }
        }

        // Insert real clue at random position
        if (realClues.ip || realClues.username) {
            const insertPos = Math.floor(Math.random() * authEntries.length);
            const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
            const clueIP = realClues.ip || '192.168.1.1';
            const clueUser = realClues.username || 'user';
            authEntries.splice(insertPos, 0, `${timestamp} sshd[9999]: Accepted password for ${clueUser} from ${clueIP} port 22`);
        }

        logDir.children['auth.log'] = {
            type: 'file',
            name: 'auth.log',
            content: authEntries.join('\n'),
            size: this.getFileSize('auth.log', authEntries.join('\n'))
        };
    }

    private generateBashHistory(userDir: Directory, clues: string[]): void {
        const historyCommands = [
            'ls -la',
            'cd Documents',
            'cat notes.txt',
            'pwd',
            'whoami',
            'ps aux',
            'top',
            'df -h',
            'free -m',
            'uname -a',
            'date',
            'history',
            'clear',
            'exit'
        ];

        const history: string[] = [];
        const numCommands = 30 + Math.floor(Math.random() * 20);

        for (let i = 0; i < numCommands; i++) {
            if (i % 10 === 5 && clues.length > 0) {
                // Insert a clue command
                history.push(clues.shift()!);
            } else {
                history.push(this.getRandom(historyCommands));
            }
        }

        userDir.children['.bash_history'] = {
            type: 'file',
            name: '.bash_history',
            content: history.join('\n'),
            size: this.getFileSize('.bash_history', history.join('\n'))
        };
    }

    private populateUserHome(userHome: Directory, username: string) {
        const standardDirs: Record<string, Record<string, string>> = {
            "Documents": {
                "notes.txt": `${username}'s personal notes.\nRemember to update the quarterly report.`,
                "project_ideas.md": "# Project Ideas\n- Automate backup system\n- Improve network security"
            },
            "Downloads": {
                "installer_v2.deb": "[BINARY]",
                "readme.txt": "Downloaded files go here."
            },
            "Music": { "playlist_chill.m3u": "#EXTM3U\nlofi_beat.mp3" },
            "Pictures": { "profile_pic.png": "[IMAGE DATA]" }
        };

        // Add random trash files to standard dirs for variety
        Object.entries(standardDirs).forEach(([dirName, files]) => {
            if (!userHome.children[dirName]) {
                userHome.children[dirName] = { type: 'directory', name: dirName, children: {}, size: 0 };
            }
            const dir = userHome.children[dirName] as Directory;

            // Add fixed files
            Object.entries(files).forEach(([fName, fContent]) => {
                dir.children[fName] = {
                    type: 'file',
                    name: fName,
                    content: fContent,
                    size: this.getFileSize(fName, fContent)
                };
            });

            // Add 1-3 random trash files
            const numTrash = 1 + Math.floor(Math.random() * 3);
            const trashKeys = Object.keys(trashFiles);
            for (let i = 0; i < numTrash; i++) {
                const trashName = this.getRandom(trashKeys);
                if (!dir.children[trashName]) {
                    const content = trashFiles[trashName];
                    dir.children[trashName] = {
                        type: 'file',
                        name: trashName,
                        content: content,
                        size: this.getFileSize(trashName, content)
                    };
                }
            }
        });

        // Add .bashrc
        userHome.children['.bashrc'] = {
            type: 'file',
            name: '.bashrc',
            content: '# Terminal Aliases\nalias ll="ls -l"\n',
            size: this.getFileSize('.bashrc', '# Terminal Aliases\nalias ll="ls -l"\n')
        };

        // Add .ssh directory
        userHome.children['.ssh'] = {
            type: 'directory',
            name: '.ssh',
            children: {
                'config': {
                    type: 'file',
                    name: 'config',
                    content: '# SSH client configuration\nHost *\n  StrictHostKeyChecking no',
                    size: this.getFileSize('config', '# SSH client configuration\nHost *\n  StrictHostKeyChecking no')
                }
            },
            size: 0
        };
    }

    private placeClues(node: NetworkNode, puzzle: { hint: string, components: { file: string, content: string }[] }): void {
        const home = ((node.vfs.children['home'] as Directory).children['user'] as Directory);

        // Create Documents/network_intel if needed
        if (!home.children['Documents']) {
            home.children['Documents'] = { type: 'directory', name: 'Documents', children: {}, size: 0 };
        }
        const docs = home.children['Documents'] as Directory;

        if (!docs.children['network_intel']) {
            docs.children['network_intel'] = { type: 'directory', name: 'network_intel', children: {}, size: 0 };
        }
        const intelDir = docs.children['network_intel'] as Directory;

        // Place component files
        puzzle.components.forEach(clue => {
            intelDir.children[clue.file] = {
                type: 'file',
                name: clue.file,
                content: clue.content,
                size: this.getFileSize(clue.file, clue.content)
            };
        });

        // Place Hint File
        const hintFile = "PASSWORD_HINT.txt";
        intelDir.children[hintFile] = {
            type: 'file',
            name: hintFile,
            content: `[RECOVERED FRAGMENT]\n\nTo access the next node, I used the following memory aid:\n\n"${puzzle.hint}"\n\nThe components of this key should be scattered in this folder.`,
            size: this.getFileSize(hintFile, `[RECOVERED FRAGMENT]\n\nTo access the next node, I used the following memory aid:\n\n"${puzzle.hint}"\n\nThe components of this key should be scattered in this folder.`)
        };
    }

    private generateNode(scenario: Scenario, type: 'workstation' | 'server' | 'database', id: string, hostname: string, ip: string): { node: NetworkNode, puzzle: { password: string, hint: string, components: any[] }, users: string[] } {
        const systemState = this.generateSystemState(scenario.theme);

        // VFS Generation
        const root: Directory = {
            type: 'directory', name: '', children: {
                home: {
                    type: 'directory', name: 'home', children: {}, size: 0
                }
            },
            size: 0
        };

        const homeDir = root.children.home as Directory;

        // Generate 2-5 users per node
        const numUsers = 2 + Math.floor(Math.random() * 4);
        const selectedUsers = this.getRandomSubset(usernames, numUsers);

        selectedUsers.forEach(username => {
            const userHome: Directory = { type: 'directory', name: username, children: {}, size: 0 };
            this.populateUserHome(userHome, username);
            homeDir.children[username] = userHome;
        });

        // Ensure 'user' exists
        if (!homeDir.children['user']) {
            const userHome: Directory = { type: 'directory', name: 'user', children: {}, size: 0 };
            this.populateUserHome(userHome, 'user');
            homeDir.children['user'] = userHome;
        }

        // Add System Dirs
        root.children['etc'] = {
            type: 'directory', name: 'etc', children: {
                'hosts': { type: 'file', name: 'hosts', content: '127.0.0.1 localhost', size: this.getFileSize('hosts', '127.0.0.1 localhost') },
                'passwd': { type: 'file', name: 'passwd', content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash', size: this.getFileSize('passwd', 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash') }
            }, permissions: 'root',
            size: 0
        };

        root.children['var'] = { type: 'directory', name: 'var', children: { 'log': { type: 'directory', name: 'log', children: {}, size: 0 } }, size: 0 };
        root.children['tmp'] = { type: 'directory', name: 'tmp', children: {}, size: 0 };
        root.children['bin'] = { type: 'directory', name: 'bin', children: { 'ls': { type: 'file', name: 'ls', content: '[BINARY]', size: this.getFileSize('ls', '[BINARY]') } }, size: 0 };

        // Social Puzzle for Root Access
        const puzzle = this.generateSocialPuzzle();
        systemState.envVars["PWD_HINT"] = puzzle.hint;

        // NOTE: We no longer scatter clues inside the node. They are returned to be placed on previous nodes.

        const node: NetworkNode = {
            id,
            hostname,
            ip,
            osVersion: `Linux 5.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 100)}-generic`,
            themeColor: 'text-green-400', // Will be set by generateNetwork
            vfs: root,
            processes: systemState.processes,
            envVars: systemState.envVars,
            ports: this.generatePorts(type),
            vulnerabilities: this.generateVulnerabilities(scenario.theme === 'Homebase' ? 1 : 2), // Basic difficulty
            isDiscovered: false,
            rootPassword: puzzle.password,
            currentUser: 'user'
        };

        // Generate honeypots
        this.generateHoneypots(node);

        node.vfs.size = this.calculateDirectorySize(node.vfs);

        return { node, puzzle, users: selectedUsers };
    }

    public generateNetwork(config?: MissionConfig): GameState {
        const scenario = config && config.scenarioIndex !== undefined ? scenarios[config.scenarioIndex] : this.getRandom(scenarios);
        const nodes: NetworkNode[] = [];
        const nodeData: { puzzle: any, users: string[] }[] = [];

        // Generate 3-5 nodes
        const numNodes = config?.numNodes || (3 + Math.floor(Math.random() * 3));

        // Theme colors for nodes (localhost is always green)
        const themeColors = ['text-green-400', 'text-amber-400', 'text-cyan-400', 'text-red-400', 'text-blue-400', 'text-purple-400', 'text-pink-400'];

        // 1. Localhost (Player Start) - always green
        const localGen = this.generateNode(scenario, 'workstation', 'local', 'localhost', '192.168.1.100');
        localGen.node.isDiscovered = true;
        localGen.node.themeColor = themeColors[0]; // Always green for localhost
        localGen.node.currentUser = 'user';
        nodes.push(localGen.node);
        nodeData.push({ puzzle: localGen.puzzle, users: localGen.users });

        // Place Localhost clues on Localhost (needed for sudo)
        this.placeClues(localGen.node, localGen.puzzle);

        // 2. Generate Remote Nodes with unique hostnames and IPs
        const usedHostnames = new Set<string>(['localhost']);
        const usedIPs = new Set<string>(['192.168.1.100']);

        for (let i = 0; i < numNodes - 1; i++) {
            // Get unique hostname
            let hostname = this.getRandom(hostnames);
            while (usedHostnames.has(hostname)) {
                hostname = this.getRandom(hostnames);
            }
            usedHostnames.add(hostname);

            // Get unique IP
            let ip = `10.0.4.${10 + Math.floor(Math.random() * 200)}`;
            while (usedIPs.has(ip)) {
                ip = `10.0.4.${10 + Math.floor(Math.random() * 200)}`;
            }
            usedIPs.add(ip);

            const type = i === numNodes - 2 ? 'database' : 'server';
            const gen = this.generateNode(scenario, type, `remote-${i}`, hostname, ip);

            // Assign unique theme color (cycle through colors if more nodes than colors)
            gen.node.themeColor = themeColors[(i + 1) % themeColors.length];

            nodes.push(gen.node);
            nodeData.push({ puzzle: gen.puzzle, users: gen.users });
        }

        // 3. Link Nodes and Place Clues Backwards
        // We iterate through nodes 0 to N-2
        for (let i = 0; i < nodes.length - 1; i++) {
            const currentNode = nodes[i];
            const nextNode = nodes[i + 1];
            const nextData = nodeData[i + 1];

            // A. Place Next Node's Password Clues on Current Node
            this.placeClues(currentNode, nextData.puzzle);

            // B. Pick a specific user from the Next Node to hack
            const targetUser = this.getRandom(nextData.users) || 'user';

            // C. Generate Auth Logs on Current Node pointing to Next Node
            this.generateAuthLog(currentNode, { ip: nextNode.ip, username: targetUser });

            // D. Generate Bash History on Current Node
            const userHome = ((currentNode.vfs.children.home as Directory).children['user'] as Directory);
            const clues: string[] = [
                `ssh ${targetUser}@${nextNode.ip}`,
                `# Connecting to ${nextNode.hostname} as ${targetUser}`
            ];
            this.generateBashHistory(userHome, clues);
        }

        // For the last node, we still need bash history, but no next node clues
        const lastNode = nodes[nodes.length - 1];
        const lastUserHome = ((lastNode.vfs.children.home as Directory).children['user'] as Directory);
        this.generateBashHistory(lastUserHome, []); // No specific clues for "next"

        // 4. Add IPs to /etc/hosts of localhost (unchanged)
        const localHosts = (nodes[0].vfs.children.etc as Directory).children['hosts'] as File;
        let hostsContent = localHosts.content;
        nodes.forEach(n => {
            if (n.id !== 'local') {
                hostsContent += `\n${n.ip} ${n.hostname}`;
            }
        });
        localHosts.content = hostsContent;

        // 4. Define Win Condition
        // Win: Get root on the last node
        const targetNode = nodes[nodes.length - 1];
        const targetFileName = config?.targetFileName || 'SECRET.dat';

        // Randomly choose win condition if not specified
        let winCondition: WinCondition;

        // Determine Win Type
        let type = config?.winConditionType;
        if (!type) {
            if (config?.targetFileName) {
                type = 'file_found';
            } else {
                const roll = Math.random();
                if (roll > 0.6) type = 'root_access';
                else if (roll > 0.3) type = 'process_killed';
                else type = 'file_modified';
            }
        }

        if (type === 'file_found') {
            winCondition = { type: 'file_found', nodeId: targetNode.id, path: ['home', 'user', 'Documents', targetFileName] };
        } else if (type === 'root_access') {
            winCondition = { type: 'root_access', nodeId: targetNode.id };
        } else if (type === 'process_killed') {
            const proc = this.getRandom(targetNode.processes) || { name: 'systemd' };
            winCondition = { type: 'process_killed', nodeId: targetNode.id, processName: proc.name };
        } else {
            winCondition = {
                type: 'file_modified',
                nodeId: targetNode.id,
                path: ['var', 'www', 'html', 'index.html'],
                targetContent: 'HACKED BY RETRO-TERM'
            };

            // Ensure the path exists for defacement
            if (!targetNode.vfs.children['var']) targetNode.vfs.children['var'] = { type: 'directory', name: 'var', children: {}, size: 0 };
            const v = targetNode.vfs.children['var'] as Directory;
            if (!v.children['www']) v.children['www'] = { type: 'directory', name: 'www', children: {}, size: 0 };
            const w = v.children['www'] as Directory;
            if (!w.children['html']) w.children['html'] = { type: 'directory', name: 'html', children: {}, size: 0 };
            const h = w.children['html'] as Directory;
            h.children['index.html'] = { type: 'file', name: 'index.html', content: 'Welcome to our secure website.', size: this.getFileSize('index.html', 'Welcome to our secure website.') };
        }

        // Place the target file if it's a file found mission
        if (winCondition.type === 'file_found') {
            const home = ((targetNode.vfs.children['home'] as Directory).children['user'] as Directory);
            if (!home.children['Documents']) {
                home.children['Documents'] = { type: 'directory', name: 'Documents', children: {}, size: 0 };
            }
            const docs = home.children['Documents'] as Directory;
            docs.children[targetFileName] = {
                type: 'file',
                name: targetFileName,
                content: `[CLASSIFIED DATA]\nThis file contains high-value information.\n${scenario.theme} mission target.`,
                size: this.getFileSize(targetFileName, `[CLASSIFIED DATA]\nThis file contains high-value information.\n${scenario.theme} mission target.`)
            };
        }

        const welcomeMessage = scenario.welcomeMessage(targetFileName);

        // Add Mission Briefing to Localhost
        const userHome = ((nodes[0].vfs.children.home as Directory).children['user'] as Directory);
        let objectiveText = "";
        switch (winCondition.type) {
            case 'file_found': objectiveText = `Download '${targetFileName}' from ${targetNode.hostname} (${targetNode.ip}).`; break;
            case 'root_access': objectiveText = `Gain ROOT ACCESS on ${targetNode.hostname} (${targetNode.ip}).`; break;
            case 'process_killed': objectiveText = `Terminate the process '${winCondition.processName}' on ${targetNode.hostname}.`; break;
            case 'file_modified': objectiveText = `Deface the server ${targetNode.hostname} by modifying /var/www/html/index.html.`; break;
        }

        // Tier 1 guidance vs Higher Tier ambiguity
        const difficulty = config?.difficultyMultiplier || 1;
        let briefingContent = "";

        if (difficulty === 1) {
            briefingContent = `MISSION BRIEFING\n\nObjective: ${objectiveText}\n\nINTEL:\nInitial reconnaissance data has been uploaded to your terminal.\nLocation: ~/Documents/network_intel/\n\nINSTRUCTIONS:\n1. Review the intel for credentials.\n2. Connect to the first remote node via SSH.\n3. Pivot through the network to reach the target.\n\nGood luck, operative.`;
        } else {
            briefingContent = `MISSION BRIEFING\n\nObjective: ${objectiveText}\n\nINTEL:\nStandard recon package uploaded. Check your documents.\n\nWARNING:\nTarget security is elevated (Tier ${difficulty}).\nExpect hidden trails, advanced encryption, and active countermeasures.\n\nGood luck, operative.`;
        }

        userHome.children['MISSION.txt'] = {
            type: 'file',
            name: 'MISSION.txt',
            content: briefingContent,
            size: this.getFileSize('MISSION.txt', briefingContent)
        };

        return {
            nodes,
            activeNodeIndex: 0,
            winCondition,
            scenario: { ...scenario, welcomeMessage },
            bootTime: Date.now(),
            traceProgress: 0,
            isTraceActive: false
        };
    }

    public generateHomebase(playerState: PlayerState): GameState {
        const homeNode: NetworkNode = {
            id: 'localhost',
            hostname: 'homebase',
            ip: '127.0.0.1',
            osVersion: 'RetroOS 2.0-stable',
            themeColor: 'text-green-400',
            vfs: {
                type: 'directory',
                name: '',
                children: {
                    home: {
                        type: 'directory',
                        name: 'home',
                        children: {
                            user: {
                                type: 'directory',
                                name: 'user',
                                children: {
                                    bin: { type: 'directory', name: 'bin', children: {}, size: 0 },
                                    jobs: { type: 'directory', name: 'jobs', children: {}, size: 0 },
                                    market: { type: 'directory', name: 'market', children: {}, size: 0 },
                                    loot: { type: 'directory', name: 'loot', children: {}, size: 0 }
                                },
                                size: 0
                            }
                        },
                        size: 0
                    }
                },
                size: 0
            },
            processes: [],
            envVars: {
                USER: 'user',
                HOME: '/home/user',
                PATH: '/home/user/bin:/usr/bin:/bin',
                SHELL: '/bin/bash'
            },
            ports: [],
            vulnerabilities: [],
            isDiscovered: true,
            currentUser: 'user'
        };

        // Fill ~/bin based on installed software
        const userHome = ((homeNode.vfs.children.home as Directory).children.user as Directory);
        const binDir = userHome.children.bin as Directory;
        const software = playerState.installedSoftware || ['ls', 'cd', 'help', 'market', 'exit'];
        software.forEach((soft: string) => {
            binDir.children[soft] = { type: 'file', name: soft, content: '[BINARY]', size: this.getFileSize(soft, '[BINARY]') };
        });

        // Populate ~/loot from player inventory
        const lootDir = userHome.children.loot as Directory;
        if (playerState.inventory) {
            playerState.inventory.forEach(node => {
                lootDir.children[node.name] = node;
            });
        }

        // Add some dummy jobs for now (Phase 3 will generate these properly)
        const jobsDir = userHome.children.jobs as Directory;
        jobsDir.children['readme.txt'] = {
            type: 'file',
            name: 'readme.txt',
            content: 'Check here for available contracts.\nUse "jobs" command to list active offers.',
            size: this.getFileSize('readme.txt', 'Check here for available contracts.\nUse "jobs" command to list active offers.')
        };

        homeNode.vfs.size = this.calculateDirectorySize(homeNode.vfs);

        return {
            nodes: [homeNode],
            activeNodeIndex: 0,
            winCondition: { type: 'root_access', nodeId: 'none' }, // No win condition in homebase
            scenario: {
                theme: 'Homebase',
                welcomeMessage: 'WELCOME TO RETRO-TERM v2.0\nType "help" for a list of commands.',
                clueTemplate: () => '',
                starterClueTemplate: () => '',
                clueFileNameOptions: [],
                distractionFiles: {},
                distractionDirs: []
            },
            bootTime: Date.now(),
            traceProgress: 0,
            isTraceActive: false
        };
    }

    public generateNewGame(): GameState {
        return this.generateNetwork();
    }
}

export const puzzleGenerator = new PuzzleGenerator();
