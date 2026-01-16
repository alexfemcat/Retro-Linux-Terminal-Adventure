import type { Directory, Scenario, GameState, Process, File, NetworkNode, NetworkPort, WinCondition } from '../types';
import { scenarios, petNames, cities, colors, years, processNames, envVarKeys, envVarValues } from '../data/gameData';

class PuzzleGenerator {
    private getRandom<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
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

    private populateUserHome(userHome: Directory) {
        const standardDirs: Record<string, Record<string, string>> = {
            "Documents": { "notes.txt": "Remember to call Mom." },
            "Downloads": { "installer_v2.deb": "[BINARY]" },
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
    }

    private generateNode(scenario: Scenario, type: 'workstation' | 'server' | 'database', id: string, hostname: string, ip: string): NetworkNode {
        const systemState = this.generateSystemState(scenario.theme);

        // VFS Generation
        const root: Directory = {
            type: 'directory', name: '', children: {
                home: {
                    type: 'directory', name: 'home', children: {
                        user: { type: 'directory', name: 'user', children: {} }
                    }
                }
            }
        };

        const userHome = (root.children.home as Directory).children.user as Directory;
        this.populateUserHome(userHome);

        // Add System Dirs
        root.children['etc'] = {
            type: 'directory', name: 'etc', children: {
                'hosts': { type: 'file', name: 'hosts', content: '127.0.0.1 localhost' },
                'passwd': { type: 'file', name: 'passwd', content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash' }
            }, permissions: 'root'
        };

        root.children['var'] = { type: 'directory', name: 'var', children: { 'log': { type: 'directory', name: 'log', children: {} } } };
        root.children['bin'] = { type: 'directory', name: 'bin', children: { 'ls': { type: 'file', name: 'ls', content: '[BINARY]' } } };

        // Social Puzzle for Root Access
        const puzzle = this.generateSocialPuzzle();
        systemState.envVars["PWD_HINT"] = puzzle.hint; // Easy way to find hint for now

        // Scatter puzzle clues in home
        puzzle.components.forEach(comp => {
            if (Math.random() > 0.5) {
                userHome.children[comp.file] = { type: 'file', name: comp.file, content: comp.content };
            }
        });

        // Theme Colors
        const themeColors = ['text-green-400', 'text-amber-400', 'text-cyan-400', 'text-red-400', 'text-blue-400'];
        const themeColor = this.getRandom(themeColors);

        return {
            id,
            hostname,
            ip,
            osVersion: `Linux 5.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 100)}-generic`,
            themeColor,
            vfs: root,
            processes: systemState.processes,
            envVars: systemState.envVars,
            ports: this.generatePorts(type),
            isDiscovered: false,
            rootPassword: puzzle.password,
            currentUser: 'user'
        };
    }

    public generateNetwork(): GameState {
        const scenario = this.getRandom(scenarios);
        const nodes: NetworkNode[] = [];

        // 1. Localhost (Player Start)
        const localNode = this.generateNode(scenario, 'workstation', 'local', 'localhost', '192.168.1.5');
        localNode.isDiscovered = true;
        localNode.themeColor = 'text-green-400'; // Classic for local
        nodes.push(localNode);

        // 2. Generate Remote Nodes
        const numRemotes = 3;
        for (let i = 0; i < numRemotes; i++) {
            const ip = `192.168.1.${10 + i}`;
            const hostname = `server-${100 + i}`;
            const type = i === numRemotes - 1 ? 'database' : 'server';
            const node = this.generateNode(scenario, type, `remote-${i}`, hostname, ip);
            nodes.push(node);
        }

        // 3. Link Nodes (Breadcrumbs)
        // Add IPs to /etc/hosts of localhost
        const localHosts = localNode.vfs.children.etc as Directory;
        let hostsContent = (localHosts.children['hosts'] as File).content;
        nodes.forEach(n => {
            if (n.id !== 'local') {
                hostsContent += `\n${n.ip} ${n.hostname}`;
            }
        });
        (localHosts.children['hosts'] as File).content = hostsContent;

        // 4. Define Win Condition
        // Simple win: Get root on the last node (database)
        const targetNode = nodes[nodes.length - 1];
        const winCondition: WinCondition = { type: 'root_access', nodeId: targetNode.id };

        const welcomeMessage = scenario.welcomeMessage('MISSION BRIEFING');

        // Add Mission Briefing to Localhost
        const userHome = (localNode.vfs.children.home as Directory).children.user as Directory;
        userHome.children['MISSION.txt'] = {
            type: 'file',
            name: 'MISSION.txt',
            content: `MISSION BRIEFING\n\nObjective: Gain ROOT ACCESS on ${targetNode.hostname} (${targetNode.ip}).\n\n1. Scan the network.\n2. Infiltrate servers.\n3. Find the target.\n\nGood luck.`
        };

        return {
            nodes,
            activeNodeIndex: 0,
            winCondition,
            scenario: { ...scenario, welcomeMessage },
            bootTime: Date.now()
        };
    }

    // Legacy method shim if needed, or just remove. App uses generateNewGame, so we redirect.
    public generateNewGame(): GameState {
        return this.generateNetwork();
    }
}

export const puzzleGenerator = new PuzzleGenerator();
