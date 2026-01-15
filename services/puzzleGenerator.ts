import type { Directory, Scenario, GameState, GameObjective, Process, File, EncryptionRequirement } from '../types';
import { scenarios, petNames, cities, colors, years, trashFiles, thematicMap, processNames, envVarKeys, envVarValues } from '../data/gameData';

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
                command: `/bin/${name}`,
                theme: 'system'
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
                command: `/usr/bin/${name} --daemon`,
                theme: scenarioTheme
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

    private applyEncryption(file: File, systemState: { bootTime: number, processes: Process[], envVars: Record<string, string> }) {
        file.isEncrypted = true;
        const requirements: EncryptionRequirement[] = [];

        // 20% chance of being a "Boss" file (needs 2 requirements)
        const isBoss = Math.random() < 0.2;
        const count = isBoss ? 2 : 1;

        for (let i = 0; i < count; i++) {
            const typeProb = Math.random();
            const type = typeProb < 0.4 ? 'pid' : (typeProb < 0.7 ? 'env' : 'time');
            let req: EncryptionRequirement;

            if (type === 'pid') {
                const targetProc = this.getRandom(systemState.processes);
                let targetVal: number = targetProc.pid;
                let trans: EncryptionRequirement['transformation'] = undefined;

                if (Math.random() < 0.6) { // 60% chance of offset for more puzzle depth
                    const offset = this.getRandom([-128, -64, 32, 64, 128, 256]);
                    targetVal += offset;
                    trans = { type: 'offset', value: offset };
                }

                req = {
                    type: 'pid',
                    targetValue: targetVal,
                    hint: trans ? `ERR: MEM_ADDR_OFFSET_REQUIRED (+${trans.value}) [${targetProc.name}]` : `LOCKED_BY_PROC: ${targetProc.name}`,
                    transformation: trans
                };
            } else if (type === 'time') {
                const dateStr = new Date(systemState.bootTime).toLocaleDateString();
                req = {
                    type: 'time',
                    targetValue: dateStr,
                    hint: `SYSLOG_ERR: SYSTEM_BOOT_DATE_VERIFICATION_REQUIRED`
                };
            } else {
                const keys = Object.keys(systemState.envVars);
                const key = this.getRandom(keys);
                let targetVal: string = systemState.envVars[key];
                let trans: EncryptionRequirement['transformation'] = undefined;

                if (Math.random() < 0.5 && targetVal.length > 4) {
                    const length = 4;
                    targetVal = targetVal.substring(0, length);
                    trans = { type: 'slice', value: [0, length] };
                }

                req = {
                    type: 'env',
                    targetValue: targetVal,
                    hint: trans ? `LOCKED_VIA_ENV_PARTIAL: ${key} [B_4]` : `LOCKED_VIA_ENV_VAR: ${key}`,
                    transformation: trans
                };
            }
            requirements.push(req);
        }

        file.encryption = {
            requirements,
            isBoss
        };
    }

    private generatePassword(): { password: string, hint: string, components: { type: string, value: string, file: string, content: string }[] } {
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
                // Randomize casing for slightly more difficulty? No, keep it simple for now or match array.
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

    private generateVFS(scenario: Scenario): Directory {
        const root: Directory = {
            type: 'directory', name: '', children: {
                home: {
                    type: 'directory', name: 'home', children: {
                        user: { type: 'directory', name: 'user', children: {} }
                    }
                }
            }
        };

        // Procedurally generate a deeper directory structure starting from user home
        const userHome = (root.children.home as Directory).children.user as Directory;
        const allDirs: { node: Directory, path: string[] }[] = [
            { node: userHome, path: ['home', 'user'] }
        ];

        // Max depth is now 4 to 6 for guaranteed mystery
        const maxDepth = Math.floor(Math.random() * 3) + 4;
        const dirsPerLevel = 2;

        const addDirs = (currentDir: Directory, currentPath: string[], currentDepth: number, pool: string[]) => {
            if (currentDepth >= maxDepth) return;

            for (let i = 0; i < dirsPerLevel; i++) {
                // Higher chance (80%) to add at least one directory at the first level to avoid empty suitableDirs
                const chance = currentDepth === 2 ? 0.2 : 0.4;
                if (Math.random() > chance) {
                    const baseName = this.getRandom(pool);
                    const dirName = `${baseName}_${Math.floor(Math.random() * 100)}`;
                    if (!currentDir.children[dirName]) {
                        const newDir: Directory = { type: 'directory', name: dirName, children: {} };
                        currentDir.children[dirName] = newDir;
                        const newPath = [...currentPath, dirName];

                        allDirs.push({ node: newDir, path: newPath });
                        addDirs(newDir, newPath, currentDepth + 1, pool);
                    }
                }
            }
        };

        addDirs(userHome, ['home', 'user'], 2, scenario.distractionDirs);

        // Define system-wide decoys with realistic contents
        const systemDecors: Record<string, { dirs: string[], files: Record<string, string>, pool?: string[], permissions?: 'root' }> = {
            "etc": {
                dirs: ["apt", "ssh", "ssl", "network"],
                pool: ["config", "services", "security", "defaults"],
                files: {
                    "passwd": "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash",
                    "hosts": "127.0.0.1 localhost\n192.168.1.1 gateway",
                    "fstab": "/dev/sda1 / ext4 defaults 0 1",
                    "motd": "Welcome to the Retro-Term Mainframe.\nUnauthorized access is strictly prohibited.",
                    "resolve.conf": "nameserver 8.8.8.8\nnameserver 8.8.4.4"
                },
                permissions: 'root'
            },
            "bin": {
                dirs: [],
                files: {
                    "ls": "[BINARY DATA]",
                    "cat": "[BINARY DATA]",
                    "grep": "[BINARY DATA]",
                    "sh": "[BINARY DATA]",
                    "bash": "[BINARY DATA]",
                    "python3": "[BINARY DATA]",
                    "overdrive": "[BINARY DECRYPTION TOOL]\nUsage: overdrive <file> --use-pid <PID> | --use-time <VAL> | --use-env <VAR>"
                }
            },
            "var": {
                dirs: ["log", "mail", "spool", "www"],
                pool: ["backups", "archive", "internal", "web_data"],
                files: {
                    "syslog": "Jan 15 10:24:01 kernel: [    0.000000] Linux version 5.15.0-generic",
                    "auth.log": "Jan 15 11:15:22 sshd[124]: Accepted password for user from 10.0.0.5",
                },
                permissions: 'root'
            },
            "tmp": {
                dirs: [".ICE-unix", ".test", "session_cache"],
                pool: ["temporary", "build_cache", "temp_logs"],
                files: {
                    "sess_02931": "expiry=3600;uid=1000",
                    "build.log": "Build started at 09:00:00... OK."
                }
            },
            "opt": {
                dirs: ["google", "microsoft", "local_apps"],
                pool: ["enterprise", "dist", "v1.0.4", "legacy"],
                files: {
                    "README.txt": "Site-specific applications go here."
                }
            },
            "sys": {
                dirs: ["class", "dev", "fs", "kernel", "module"],
                files: {
                    "uevent": "MAJOR=1\nMINOR=3\nDEVNAME=null",
                },
                permissions: 'root'
            },
            "root": {
                dirs: [],
                files: {
                    ".bash_history": "rm -rf /\nshutdown now"
                },
                permissions: 'root'
            }
        };

        // Populate the root with these system decors
        Object.entries(systemDecors).forEach(([dirName, content]) => {
            const dir: Directory = {
                type: 'directory',
                name: dirName,
                children: {},
                permissions: (content as any).permissions as 'root' | 'user' | undefined
            };
            root.children[dirName] = dir;

            // Add sub-directories
            content.dirs.forEach(subDir => {
                const sub: Directory = { type: 'directory', name: subDir, children: {} };
                dir.children[subDir] = sub;
                allDirs.push({ node: sub, path: [dirName, subDir] });
            });

            // Add files
            Object.entries(content.files).forEach(([fName, fContent]) => {
                dir.children[fName] = { type: 'file', name: fName, content: fContent };
            });

            // Add procedural subdirs to system folders
            if ((content as any).pool) {
                addDirs(dir, [dirName], 1, (content as any).pool);
            }
        });

        // Hidden config files in user home
        userHome.children['.bashrc'] = { type: 'file', name: '.bashrc', content: "alias ll='ls -la'\nexport PATH=$PATH:/usr/local/bin" };
        userHome.children['.profile'] = { type: 'file', name: '.profile', content: "# ~/.profile\n# This file is executed by the command interpreter for login shells." };

        // Scatter distraction and trash files more naturally
        allDirs.forEach(dirInfo => {
            // Pick a few scenario-specific files
            Object.entries(scenario.distractionFiles).forEach(([fileName, content]) => {
                if (Math.random() > 0.7) {
                    dirInfo.node.children[fileName] = { type: 'file', name: fileName, content };
                }
            });

            // If a directory is still empty (except for subdirs), maybe add some trash
            if (Object.keys(dirInfo.node.children).length === 0 || Math.random() > 0.8) {
                const trashName = this.getRandom(Object.keys(trashFiles));
                dirInfo.node.children[trashName] = {
                    type: 'file',
                    name: trashName,
                    content: trashFiles[trashName]
                };
            }
        });

        return root;
    }

    private extractHintFromPath(path: string[]): string {
        if (path.length === 2 && path[0] === 'home' && path[1] === 'user') {
            return "the current directory";
        }
        // If it's deep in home/user, just give the folder name
        if (path[0] === 'home' && path[1] === 'user') {
            return `'${path[path.length - 1]}'`;
        }
        // If it's in a system directory, give the absolute-style path for a real challenge
        return `'/${path.join('/')}'`;
    }

    public generateNewGame(): GameState {
        const scenario = this.getRandom(scenarios);
        const systemState = this.generateSystemState(scenario.theme);
        const vfs = this.generateVFS(scenario);

        // Re-calculate all possible directories for objective and clue placement
        const availableDirs: { node: Directory, path: string[] }[] = [];
        const findDirs = (node: Directory, path: string[]) => {
            availableDirs.push({ node, path });
            Object.values(node.children).forEach(child => {
                if (child.type === 'directory') findDirs(child as Directory, [...path, child.name]);
            });
        };
        findDirs(vfs, []);

        // Filter valid directories: objective can be ANYWHERE except exactly root
        const validObjectiveDirs = availableDirs.filter(d => d.path.length > 0);

        // Preference for DEEP directories for the objective
        const deeperObjectiveDirs = validObjectiveDirs.filter(d => d.path.length >= 3);
        const targetDirInfo = this.getRandom(deeperObjectiveDirs.length > 0 ? deeperObjectiveDirs : validObjectiveDirs);

        // 1. PLACE OBJECTIVE FILE
        const objectiveFileName = this.getRandom(scenario.objectiveFileNameOptions);
        const isRootProtected = Math.random() < 0.3; // 30% chance of root protection

        const objectiveFile: File = {
            type: 'file',
            name: objectiveFileName,
            content: scenario.objectiveFileContent,
            permissions: isRootProtected ? 'root' : undefined,
            isEncrypted: Math.random() < 0.4 // Increases chance of encryption for overdrive fun
        };

        if (objectiveFile.isEncrypted) {
            this.applyEncryption(objectiveFile, systemState);
        }

        targetDirInfo.node.children[objectiveFileName] = objectiveFile;


        const objective: GameObjective = {
            filePath: targetDirInfo.path,
            fileName: objectiveFileName,
        };

        // 2. DISCOVERY CLUE (Points to Objective)
        // Discovery Area should be DIFFERENT from objective dir and home
        const discoveryDirs = availableDirs.filter(d =>
            d.path.join('/') !== targetDirInfo.path.join('/') &&
            d.path.join('/') !== 'home/user' &&
            d.path.length > 0
        );
        const discoveryDirInfo = this.getRandom(discoveryDirs);

        // Anti-Softlock: Ensure the entire path to the discovery clue is user-accessible
        let currentPathDir = vfs;
        discoveryDirInfo.path.forEach(segment => {
            currentPathDir = currentPathDir.children[segment] as Directory;
            if (currentPathDir.permissions === 'root') {
                delete currentPathDir.permissions;
            }
        });

        // Use vague/thematic hints for the objective location
        const thematicHint = this.generateVagueHint(objective.filePath);
        const discoveryClueContent = scenario.clueTemplate(thematicHint);

        // Discovery clue might be a hidden file
        const isDiscoveryHidden = Math.random() < 0.4;
        const discoveryClueName = (isDiscoveryHidden ? '.' : '') + this.getRandom(scenario.clueFileNameOptions);

        discoveryDirInfo.node.children[discoveryClueName] = {
            type: 'file',
            name: discoveryClueName,
            content: discoveryClueContent,
            permissions: undefined // Must be user-readable to avoid softlock
        };

        // 3. STARTER CLUE (Points to Discovery Area)
        const starterAreaHint = this.extractHintFromPath(discoveryDirInfo.path);
        const starterArchetypes: GameState['starterArchetype'][] = ['note', 'alias', 'mail', 'history', 'motd', 'crash', 'cron', 'ssh'];
        const archetype = this.getRandom(starterArchetypes);

        let starterClueName = "note_from_admin.txt";
        let starterClueContent = scenario.starterClueTemplate(starterAreaHint);

        const userHome = (vfs.children.home as Directory).children.user as Directory;
        const etc = vfs.children.etc as Directory;
        const varDir = vfs.children.var as Directory;
        const tmp = vfs.children.tmp as Directory;

        switch (archetype) {
            case 'note':
                starterClueName = this.getRandom(["urgent_transmission.txt", "README.txt", "overdue_task.md", "note_from_admin.txt"]);
                userHome.children[starterClueName] = { type: 'file', name: starterClueName, content: starterClueContent };
                break;
            case 'alias':
                starterClueName = ".bashrc";
                const aliasName = this.getRandom(["go_secret", "jump_start", "connect_hub", "access_vault"]);
                const currentBashrc = (userHome.children['.bashrc'] as any)?.content || "";
                const aliasContent = currentBashrc + `\nalias ${aliasName}='cd /${discoveryDirInfo.path.join('/')}' # ${starterAreaHint}`;
                userHome.children['.bashrc'] = { type: 'file', name: '.bashrc', content: aliasContent };
                starterClueContent = `Check your shell aliases in .bashrc. The previous user left a shortcut there: ${aliasName}`;
                break;
            case 'mail':
                starterClueName = "/var/mail/user";
                const mailDir = varDir.children.mail as Directory;
                mailDir.children['user'] = {
                    type: 'file',
                    name: 'user',
                    content: `From: system@retro-term\nSubject: File relocation notice\n\nAll sensitive fragments for ${scenario.theme} have been moved to: /${discoveryDirInfo.path.join('/')}\n\nPlease update your links.`
                };
                starterClueContent = "You have new mail in /var/mail/user.";
                break;
            case 'history':
                starterClueName = ".bash_history";
                const historyContent = `ls\ncd /${discoveryDirInfo.path.join('/')}\nls -a\ncat .hidden_lead\nexit`;
                userHome.children['.bash_history'] = { type: 'file', name: '.bash_history', content: historyContent };
                starterClueContent = "Check your .bash_history. It shows where the previous admin was working.";
                break;
            case 'motd':
                starterClueName = "/etc/motd";
                etc.children['motd'] = {
                    type: 'file',
                    name: 'motd',
                    content: `Welcome to the Retro-Term Mainframe.\n\nNOTICE: Access to the ${starterAreaHint} sector is restricted to Level 2 clearance.\nLast login: ${this.getRandom(cities)} / VPN`
                };
                starterClueContent = "The system MOTD in /etc/motd contains a department notice.";
                break;
            case 'crash':
                starterClueName = "/tmp/process_crash.log";
                tmp.children['process_crash.log'] = {
                    type: 'file',
                    name: 'process_crash.log',
                    content: `ERROR: Segmentation fault at 0x00FFCAFE\nProcess: worker_daemon\nWorking Directory: /${discoveryDirInfo.path.join('/')}\nStack trace dumped to /var/log/faults.dmp`
                };
                starterClueContent = "A process crashed recently. Check /tmp/process_crash.log for the working directory.";
                break;
            case 'cron':
                starterClueName = "/etc/cron.daily/backup";
                if (!etc.children['cron.daily']) etc.children['cron.daily'] = { type: 'directory', name: 'cron.daily', children: {} };
                const cronDaily = etc.children['cron.daily'] as Directory;
                cronDaily.children['backup'] = {
                    type: 'file',
                    name: 'backup',
                    content: `#!/bin/bash\n# Scheduled backup for ${scenario.theme}\ntar -czf /backup/vault.tar.gz /${discoveryDirInfo.path.join('/')}`
                };
                starterClueContent = "Check the scheduled tasks in /etc/cron.daily/backup.";
                break;
            case 'ssh':
                starterClueName = ".ssh/config";
                if (!userHome.children['.ssh']) userHome.children['.ssh'] = { type: 'directory', name: '.ssh', children: {} };
                const sshDir = userHome.children['.ssh'] as Directory;
                sshDir.children['config'] = {
                    type: 'file',
                    name: 'config',
                    content: `Host internal_hub\n  HostName 127.0.0.1\n  IdentityFile /${discoveryDirInfo.path.join('/')}/id_rsa`
                };
                starterClueContent = "The .ssh/config file mentions an internal hub path.";
                break;
        }

        // 4. PASSWORD & LOGIN HELP
        const { password, hint: passwordHint, components } = this.generatePassword();

        // Scatter password components
        availableDirs.forEach(dirInfo => {
            if (components.length > 0 && Math.random() < 0.2) {
                const component = components.pop();
                if (component) {
                    dirInfo.node.children[component.file] = {
                        type: 'file',
                        name: component.file,
                        content: component.content
                    };
                }
            }
        });

        // Dynamic Password Hint Delivery
        const pwdDeliveryTypes = ['note', 'encrypted', 'grep', 'split'];
        const deliveryType = this.getRandom(pwdDeliveryTypes) as 'note' | 'encrypted' | 'grep' | 'split';
        let pwdHintLocation = { path: ['home', 'user'], name: '' };

        switch (deliveryType) {
            case 'note':
                const noteName = this.getRandom(["password_hint.txt", "reminder.msg", "login_help.md"]);
                pwdHintLocation.name = noteName;
                userHome.children[noteName] = {
                    type: 'file',
                    name: noteName,
                    content: `Hint: My password is ${passwordHint}.`
                };
                break;
            case 'encrypted':
                const cryptHintName = "password_hint.crypt";
                pwdHintLocation.name = cryptHintName;
                const hintFile: File = {
                    type: 'file',
                    name: cryptHintName,
                    content: `Hint: My password is ${passwordHint}.`,
                    isEncrypted: true
                };
                this.applyEncryption(hintFile, systemState); // Apply overdrive lock
                userHome.children[cryptHintName] = hintFile;
                break;
            case 'grep':
                const logName = "system.log";
                pwdHintLocation.name = logName;
                const logLines = Array.from({ length: 50 }, () => `Jan 15 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:01 retro-term systemd[1]: Running task...`);
                logLines[Math.floor(Math.random() * 50)] = `Jan 15 12:00:00 retro-term security_admin: REMINDER: Password hint is "${passwordHint}"`;
                userHome.children[logName] = {
                    type: 'file',
                    name: logName,
                    content: logLines.join('\n')
                };
                break;
            case 'split':
                pwdHintLocation = { path: ['var', 'log'], name: 'auth.log / syslog' };
                const part1 = passwordHint.substring(0, Math.floor(passwordHint.length / 2));
                const part2 = passwordHint.substring(Math.floor(passwordHint.length / 2));

                // Anti-Softlock: Ensure var/log is accessible
                const varNode = vfs.children.var as Directory;
                if (varNode.permissions === 'root') delete varNode.permissions;
                const logNode = varNode.children.log as Directory;
                if (logNode.permissions === 'root') delete logNode.permissions;

                const authLogDir = logNode;
                if (authLogDir) {
                    authLogDir.children['auth.log'] = { type: 'file', name: 'auth.log', content: `NOTICE: Password fragment alpha: ${part1}` };
                    authLogDir.children['syslog'] = { type: 'file', name: 'syslog', content: `DEBUG: Password fragment omega: ${part2}` };
                }
                userHome.children['security_status.txt'] = {
                    type: 'file',
                    name: 'security_status.txt',
                    content: "Security audit required. Password hint fragments have been split between /var/log/auth.log and /var/log/syslog."
                };
                break;
        }

        const finalScenario = {
            ...scenario,
            welcomeMessage: scenario.welcomeMessage(objectiveFileName)
        };

        return {
            vfs,
            objective,
            scenario: finalScenario as any,
            clueFile: {
                name: starterClueName,
                content: starterClueContent
            },
            discoveryClue: {
                path: discoveryDirInfo.path,
                name: discoveryClueName
            },
            starterArchetype: archetype,
            pwdDeliveryType: deliveryType,
            pwdHintLocation: pwdHintLocation,
            currentUser: 'user',
            rootPassword: password,
            ...systemState
        };
    }

    private generateVagueHint(path: string[]): string {
        const lastDir = path[path.length - 1];

        // If path contains one of the thematic keywords, use it
        for (const part of [...path].reverse()) {
            const basePart = part.split('_')[0]; // Handle names like finance_42
            if (thematicMap[basePart]) {
                return thematicMap[basePart];
            }
        }

        // Fallback to relative description
        if (path[0] === 'home' && path[1] === 'user') {
            return `the '${lastDir}' folder near your home`;
        }

        return `the sector identified as '/${path.join('/')}'`;
    }
}

export const puzzleGenerator = new PuzzleGenerator();
