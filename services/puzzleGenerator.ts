import type { Directory, Scenario, GameState, Process, File, NetworkNode, NetworkPort, WinCondition } from '../types';
import { scenarios, petNames, cities, colors, years, processNames, envVarKeys, envVarValues, usernames, hostnames, fakeIPs, fakePasswords, fakeTokens } from '../data/gameData';

class PuzzleGenerator {
    private getRandom<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private getRandomSubset<T>(arr: T[], count: number): T[] {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, arr.length));
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

    private generateSocialPuzzle(): { password: string, hint: string, components: { type: string, value: string, file: string, content: string }[] } {
        const schemes = [
            { types: ['pet', 'year'], template: "my first dog's name and the year I was born" },
            { types: ['city', 'color'], template: "my favorite city and the color of my first car" },
            { types: ['color', 'pet'], template: "the color of the sunset and my cat's name" },
            { types: ['year', 'city'], template: "the year of the great quake and the city it destroyed" },
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
            node.vfs.children['var'] = { type: 'directory', name: 'var', children: {} };
        }
        const varDir = node.vfs.children['var'] as Directory;
        if (!varDir.children['log']) {
            varDir.children['log'] = { type: 'directory', name: 'log', children: {} };
        }
        const logDir = varDir.children['log'] as Directory;

        // Create /tmp if it doesn't exist
        if (!node.vfs.children['tmp']) {
            node.vfs.children['tmp'] = { type: 'directory', name: 'tmp', children: {} };
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
        logDir.children['fake_auth.log'] = {
            type: 'file',
            name: 'fake_auth.log',
            content: fakeAuthEntries.join('\n')
        };

        // Generate fake password dump with 200-300 entries
        const numFakePasswords = 200 + Math.floor(Math.random() * 100);
        const fakePasswordList = this.getRandomSubset(fakePasswords, numFakePasswords);
        tmpDir.children['password_dump.txt'] = {
            type: 'file',
            name: 'password_dump.txt',
            content: `# Password dump from unknown source\n# WARNING: These may be compromised\n\n` + fakePasswordList.join('\n')
        };

        // Generate fake IP list
        tmpDir.children['ip_scan_results.txt'] = {
            type: 'file',
            name: 'ip_scan_results.txt',
            content: `# Network scan results\n# Discovered hosts:\n\n` + this.getRandomSubset(fakeIPs, 50).join('\n')
        };

        // Generate fake tokens
        tmpDir.children['leaked_tokens.txt'] = {
            type: 'file',
            name: 'leaked_tokens.txt',
            content: `# Leaked authentication tokens\n\n` + fakeTokens.join('\n')
        };
    }

    private generateAuthLog(node: NetworkNode, realClues: { ip?: string, username?: string }): void {
        // Create /var/log if it doesn't exist
        if (!node.vfs.children['var']) {
            node.vfs.children['var'] = { type: 'directory', name: 'var', children: {} };
        }
        const varDir = node.vfs.children['var'] as Directory;
        if (!varDir.children['log']) {
            varDir.children['log'] = { type: 'directory', name: 'log', children: {} };
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
            content: authEntries.join('\n')
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
            content: history.join('\n')
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

        Object.entries(standardDirs).forEach(([dirName, files]) => {
            if (!userHome.children[dirName]) {
                userHome.children[dirName] = { type: 'directory', name: dirName, children: {} };
            }
            const dir = userHome.children[dirName] as Directory;
            Object.entries(files).forEach(([fName, fContent]) => {
                dir.children[fName] = { type: 'file', name: fName, content: fContent };
            });
        });

        // Add .ssh directory
        userHome.children['.ssh'] = {
            type: 'directory',
            name: '.ssh',
            children: {
                'config': {
                    type: 'file',
                    name: 'config',
                    content: '# SSH client configuration\nHost *\n  StrictHostKeyChecking no'
                }
            }
        };
    }

    private generateNode(scenario: Scenario, type: 'workstation' | 'server' | 'database', id: string, hostname: string, ip: string): NetworkNode {
        const systemState = this.generateSystemState(scenario.theme);

        // VFS Generation
        const root: Directory = {
            type: 'directory', name: '', children: {
                home: {
                    type: 'directory', name: 'home', children: {}
                }
            }
        };

        const homeDir = root.children.home as Directory;

        // Generate 2-5 users per node
        const numUsers = 2 + Math.floor(Math.random() * 4);
        const selectedUsers = this.getRandomSubset(usernames, numUsers);

        selectedUsers.forEach(username => {
            const userHome: Directory = { type: 'directory', name: username, children: {} };
            this.populateUserHome(userHome, username);
            homeDir.children[username] = userHome;
        });

        // Ensure 'user' exists
        if (!homeDir.children['user']) {
            const userHome: Directory = { type: 'directory', name: 'user', children: {} };
            this.populateUserHome(userHome, 'user');
            homeDir.children['user'] = userHome;
        }

        // Add System Dirs
        root.children['etc'] = {
            type: 'directory', name: 'etc', children: {
                'hosts': { type: 'file', name: 'hosts', content: '127.0.0.1 localhost' },
                'passwd': { type: 'file', name: 'passwd', content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash' }
            }, permissions: 'root'
        };

        root.children['var'] = { type: 'directory', name: 'var', children: { 'log': { type: 'directory', name: 'log', children: {} } } };
        root.children['tmp'] = { type: 'directory', name: 'tmp', children: {} };
        root.children['bin'] = { type: 'directory', name: 'bin', children: { 'ls': { type: 'file', name: 'ls', content: '[BINARY]' } } };

        // Social Puzzle for Root Access
        const puzzle = this.generateSocialPuzzle();
        systemState.envVars["PWD_HINT"] = puzzle.hint;

        // Scatter puzzle clues in user home
        const userHome = homeDir.children['user'] as Directory;
        puzzle.components.forEach(comp => {
            if (Math.random() > 0.5) {
                userHome.children[comp.file] = { type: 'file', name: comp.file, content: comp.content };
            }
        });

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
            isDiscovered: false,
            rootPassword: puzzle.password,
            currentUser: 'user'
        };

        // Generate honeypots
        this.generateHoneypots(node);

        return node;
    }

    public generateNetwork(): GameState {
        const scenario = this.getRandom(scenarios);
        const nodes: NetworkNode[] = [];

        // Generate 3-5 nodes
        const numNodes = 3 + Math.floor(Math.random() * 3);

        // Theme colors for nodes (localhost is always green)
        const themeColors = ['text-green-400', 'text-amber-400', 'text-cyan-400', 'text-red-400', 'text-blue-400', 'text-purple-400', 'text-pink-400'];

        // 1. Localhost (Player Start) - always green
        const localNode = this.generateNode(scenario, 'workstation', 'local', 'localhost', '192.168.1.100');
        localNode.isDiscovered = true;
        localNode.themeColor = themeColors[0]; // Always green for localhost
        localNode.currentUser = 'user';
        nodes.push(localNode);

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
            let ip = `10.0.4.${10 + i}`;
            while (usedIPs.has(ip)) {
                ip = `10.0.4.${10 + Math.floor(Math.random() * 200)}`;
            }
            usedIPs.add(ip);

            const type = i === numNodes - 2 ? 'database' : 'server';
            const node = this.generateNode(scenario, type, `remote-${i}`, hostname, ip);

            // Assign unique theme color (cycle through colors if more nodes than colors)
            node.themeColor = themeColors[(i + 1) % themeColors.length];

            nodes.push(node);
        }

        // 3. Add discovery clues across network
        // Add IPs to /etc/hosts of localhost
        const localHosts = (localNode.vfs.children.etc as Directory).children['hosts'] as File;
        let hostsContent = localHosts.content;
        nodes.forEach(n => {
            if (n.id !== 'local') {
                hostsContent += `\n${n.ip} ${n.hostname}`;
            }
        });
        localHosts.content = hostsContent;

        // Generate auth logs with clues pointing to other nodes
        nodes.forEach((node, idx) => {
            if (idx < nodes.length - 1) {
                const nextNode = nodes[idx + 1];
                this.generateAuthLog(node, { ip: nextNode.ip, username: 'admin' });
            }
        });

        // Generate bash histories with ssh commands
        nodes.forEach((node, idx) => {
            const userHome = ((node.vfs.children.home as Directory).children['user'] as Directory);
            const clues: string[] = [];

            if (idx < nodes.length - 1) {
                const nextNode = nodes[idx + 1];
                clues.push(`ssh admin@${nextNode.ip}`);
                clues.push(`# Connected to ${nextNode.hostname}`);
            }

            this.generateBashHistory(userHome, clues);
        });

        // 4. Define Win Condition
        // Win: Get root on the last node
        const targetNode = nodes[nodes.length - 1];
        const winCondition: WinCondition = { type: 'root_access', nodeId: targetNode.id };

        const welcomeMessage = scenario.welcomeMessage('MISSION BRIEFING');

        // Add Mission Briefing to Localhost
        const userHome = ((localNode.vfs.children.home as Directory).children['user'] as Directory);
        userHome.children['MISSION.txt'] = {
            type: 'file',
            name: 'MISSION.txt',
            content: `MISSION BRIEFING\n\nObjective: Gain ROOT ACCESS on ${targetNode.hostname} (${targetNode.ip}).\n\n1. Investigate the network.\n2. Follow the clues across nodes.\n3. Infiltrate the target system.\n\nGood luck, operative.`
        };

        return {
            nodes,
            activeNodeIndex: 0,
            winCondition,
            scenario: { ...scenario, welcomeMessage },
            bootTime: Date.now()
        };
    }

    public generateNewGame(): GameState {
        return this.generateNetwork();
    }
}

export const puzzleGenerator = new PuzzleGenerator();
