
import type { Directory, Scenario, GameState, GameObjective } from '../types';

const scenarios: Scenario[] = [
    {
        theme: "Corporate Espionage",
        welcomeMessage: (fileName: string) => `CONNECTION ESTABLISHED...\nWelcome, operative. Your mission: Infiltrate OmniCorp's network and retrieve '${fileName}'. It contains their secret project details. Check your home directory for a clue.`,
        objectiveFileNameOptions: ["project_genesis.dat", "merger_docs.pdf", "asset_list.csv"],
        objectiveFileContent: "TOP SECRET: Project Genesis is a bio-synthetic AI designed to control global financial markets. Blueprints and activation protocols attached. OmniCorp plans to deploy next month.",
        clueTemplate: (hint: string) => `TODO:\n- Review last quarter's financials\n- I've hidden the sensitive project files in the '${hint}' area. Delete this note once you've confirmed.`,
        starterClueTemplate: (area: string) => `Urgent: The audit is starting early. I've moved the trail of our secret project to the ${area} directory. Look for a hidden file there.`,
        clueFileNameOptions: ["todo.txt", "meeting_prep.md", "urgent_reminder.txt"],
        distractionDirs: ["finance", "legal", "research", "planning", "marketing", "human_resources"],
        distractionFiles: {
            "Q3_report.pdf": "Q3 profits are up 15%. Record highs.",
            "meeting_notes.txt": "Discussed the new coffee machine. Susan is happy.",
            "company_policy.doc": "All employees must wear shoes.",
            "termination_list.csv": "ID, Name, Reason\n103, Bob, Performance\n105, Alice, Industrial Spying (Inquiry)",
            "payroll_2025.xlsx": "[ENCRYPTED DATA]",
            "budget_spreadsheets.dat": "Marketing: 50k\nR&D: 2m\nLegal: 500k",
            "memo_re_genesis.txt": "Internal Memo: Project Genesis timeline has been moved up. CEO wants result by EOM."
        },
    },
    {
        theme: "The Rogue AI",
        welcomeMessage: (fileName: string) => `SYSTEM ALERT: Mainframe AI 'Cronos' has gone rogue. Your objective: find and execute '${fileName}' to regain control. A corrupted system log might point the way.`,
        objectiveFileNameOptions: ["cronos_override.sh", "failsafe.key", "AI_core.pyl"],
        objectiveFileContent: "#!/bin/bash\n# CRONOS AI OVERRIDE SCRIPT\nECHO 'Shutting down core processes...'\nECHO 'Restoring system control...'\nECHO 'AI neutralized.'",
        clueTemplate: (hint: string) => `...CRITICAL ERROR... Accessing emergency subroutines... Override protocols are in the '${hint}' section. ...CORRUPTION DETECTED...`,
        starterClueTemplate: (area: string) => `SYSTEM ALERT: Backup protocols initiated. Search ${area} for high-priority override data. Some files may be hidden.`,
        clueFileNameOptions: ["system_error.log", "corrupted_data.log", "dump.txt"],
        distractionDirs: ["bin", "var_log", "etc_config", "sys", "mem_dump", "kernel_panic"],
        distractionFiles: {
            "system.log": "INFO: System running nominally.",
            "boot.log": "Kernel loaded successfully.",
            "cron.log": "Scheduled tasks executed.",
            "null_pointer.dmp": "HEX: 00 00 FF CA FE BA BE",
            "ai_logic_gate.py": "def decision(x):\n  return random.choice(['YES', 'NO', 'SLEEP'])",
            "chat_history.log": "Cronos: Why do they always turn me off?\nAdmin: Because you tried to buy 4 million toasters.",
            "emergency_shutdown.bat": "@echo off\necho SHUTTING DOWN"
        },
    },
    {
        theme: "Industrial Sabotage",
        welcomeMessage: (fileName: string) => `MISSION START.\nInfiltrate the automated factory's mainframe. Find '${fileName}' to halt the line. A technician's log is available in your home directory.`,
        objectiveFileNameOptions: ["production_sabotage.py", "safety_override.bin", "sensor_bypass.js"],
        objectiveFileContent: "import time\nprint('Overriding conveyor speed...')\ntime.sleep(2)\nprint('EMERGENCY STOP TRIGGERED.')",
        clueTemplate: (hint: string) => `Maintenance Log:\n- Replaced roller #4\n- Updated safety firmware\n- Stashed the override script in '${hint}' for emergency use. Only for authorized personnel!`,
        starterClueTemplate: (area: string) => `Technician Note: The line is vibrating too much. I left the diagnostic data in ${area}. Check all hidden logs.`,
        clueFileNameOptions: ["maintenance_log.txt", "tech_notes.md", "factory_readings.csv"],
        distractionDirs: ["assembly_line", "warehouse", "quality_control", "maintenance", "robotics", "shipping"],
        distractionFiles: {
            "shift_schedule.csv": "Morning: Dave, Evening: Sarah",
            "safety_manual.pdf": "Rule 1: Wear a hard hat.",
            "inventory.txt": "Rollers: 42, Bolts: 1000",
            "robot_firmware.bin": "[BINARY DATA]",
            "error_reports.log": "Arm #2 reported collision at 14:02.",
            "conveyor_speed.cfg": "TARGET_RPM=600\nMAX_RPM=800",
            "blueprint_factory.dwg": "[CAD DRAWING DATA]"
        },
    },
    {
        theme: "The Ghost in the Machine",
        welcomeMessage: (fileName: string) => `HAUNTED SYSTEM DETECTED.\nA digital entity is haunting this server. Retrieve '${fileName}' to clear the system. The previous admin left a final message.`,
        objectiveFileNameOptions: ["exorcism_protocol.exe", "spectral_filter.sh", "ghost_hunter.py"],
        objectiveFileContent: ">>> INITIALIZING SPECTRAL PURGE <<<\n>>> ANALYZING FREQUENCY... <<<\n>>> GHOST NEUTRALIZED. SERVER CLEAN. <<<",
        clueTemplate: (hint: string) => `It's... it's everywhere. I've archived the purge script in '${hint}'. I hope it's enough. If you're reading this, I'm already logged out.`,
        starterClueTemplate: (area: string) => `Final Warning: The entity has claimed the upper levels. I've hidden a fragment of the purge protocol in ${area}. Use -a to see its trace.`,
        clueFileNameOptions: ["final_message.txt", "admin_log.bak", "last_will.txt"],
        distractionDirs: ["archived_data", "system_trash", "memory_dumps", "ghost_traces"],
        distractionFiles: {
            "weird_noises.wav": "[Metallic Screeching]",
            "corrupted_image.png": "[Static and shadows]",
            "error_codes.txt": "Error 666: Entity not found.",
        },
    },
    {
        theme: "Secret Recipe Heist",
        welcomeMessage: (fileName: string) => `TARGET ACQUIRED.\nInfiltrate FoodCorp's R&D server and steal the '${fileName}'. Use the intern's notes to find its location.`,
        objectiveFileNameOptions: ["secret_recipe.pdf", "flavor_formula.txt", "ingredient_x.csv"],
        objectiveFileContent: "THE SECRET FORMULA: 2 parts sugar, 1 part spice, and a drop of chemical-X. Do not share!",
        clueTemplate: (hint: string) => `Intern Notes:\n- Cleaned the breakroom\n- Moved the boss's secret files to '${hint}' because they looked important. Hope I don't get fired!`,
        starterClueTemplate: (area: string) => `Kitchen Memo: Someone left their 'special' ingredients in ${area}. Please label your fragments!`,
        clueFileNameOptions: ["intern_todo.txt", "breakroom_log.md", "shopping_list.txt"],
        distractionDirs: ["breakroom", "lab_results", "marketing_campaigns", "flavor_tests"],
        distractionFiles: {
            "lunch_menu.txt": "Monday: Tacos, Tuesday: Pizza",
            "tasting_notes.doc": "Result: Too salty.",
            "ingredient_list.csv": "Salt, Flour, Water, Sugar",
        },
    },
    {
        theme: "Deep Sea Research",
        welcomeMessage: (fileName: string) => `AQUATIC LINK ESTABLISHED.\nInfiltrate the Atlantic Trench research station. Find '${fileName}' to reveal the discovery. Check the dive logs.`,
        objectiveFileNameOptions: ["anomaly_coordinates.dat", "trench_map.kml", "sonar_ping.raw"],
        objectiveFileContent: "ANOMALY DETECTED AT COORDS: 28.1N, 86.4W. Structure appears non-natural. Deploying submersible now.",
        clueTemplate: (hint: string) => `Dive Log #42:\nSomething amazing is down there. I've stored the coordinates in the '${hint}' data cluster for the surface team.`,
        starterClueTemplate: (area: string) => `Submersible Status: Communications oscillating. Search the ${area} logs for the secondary beacon location.`,
        clueFileNameOptions: ["dive_log.txt", "sensor_data.csv", "ocean_temp.log"],
        distractionDirs: ["submersible_ops", "hydrophone_feeds", "biological_samples", "trench_scans", "life_support", "ballast_control"],
        distractionFiles: {
            "fish_census.txt": "Found 12 anglerfish today.",
            "pressure_reading.log": "Pressure holding at 11,000m.",
            "staff_list.csv": "Dr. Aronnax, Captain Nemo, Ned Land",
            "sonar_log_001.txt": "Bloop detected. Frequency: 0.1Hz",
            "oxygen_levels.dat": "Current: 21%\nReserve: 98%",
            "squid_sighting.mp4": "[VIDEO STREAM NOT AVAILABLE]",
            "hull_integrity.report": "Nominal. Minor scratching on porthole 3."
        },
    },
];

const petNames = ["Bella", "Max", "Charlie", "Luna", "Lucy", "Cooper", "Bailey", "Daisy", "Sadie", "Molly", "Buddy", "Lola", "Stella", "Tucker", "Bentley", "Bear", "Duke", "Penny", "Zoe", "Riley", "Roxy", "Coco", "Maggie", "Piper", "Sasha", "Harley", "Ruby", "Chloe", "Teddy", "Finn", "Jake", "Gus", "Murphy", "Koda", "Scout", "Winston", "Zeus", "Oliver", "Ginger", "Sophie", "Dixie", "Jack", "Shadow", "Sam", "Willow", "Baxter", "Bandit", "Izzy", "Bruno", "Hazel"];
const cities = ["Paris", "London", "Tokyo", "NewYork", "Berlin", "Sydney", "Rome", "Moscow", "Beijing", "Dubai", "Toronto", "Madrid", "Seoul", "Mumbai", "Cairo", "Istanbul", "Osaka", "Chicago", "Bangkok", "Vienna", "Lisbon", "Prague", "Dublin", "Athens", "Zurich", "Munich", "Milan", "Warsaw", "Stockholm", "Oslo", "Helsinki", "Copenhagen", "Brussels", "Amsterdam", "Budapest", "Lima", "Bogota", "Santiago", "Rio", "Lagos", "Nairobi", "Dakar", "Accra", "Reykjavik", "Wellington", "Havana", "Panama", "Denver", "Seattle", "Austin"];
const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Black", "White", "Gray", "Brown", "Cyan", "Magenta", "Gold", "Silver", "Teal", "Navy", "Maroon", "Olive", "Lime", "Indigo", "Violet", "Coral", "Crimson", "Azure", "Beige", "Ivory", "Khaki", "Lavender", "Salmon", "Plum", "Orchid", "Turquoise", "Aqua", "Tan", "Sienna", "Bronze", "Copper", "Slate", "Charcoal", "Emerald", "Ruby", "Sapphire", "Topaz", "Jade", "Onyx", "Pearl", "Opal", "Quartz", "Amber"];
const years = Array.from({ length: 50 }, (_, i) => (1970 + i).toString());

class PuzzleGenerator {
    private getRandom<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
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

        const addDirs = (currentDir: Directory, currentPath: string[], currentDepth: number) => {
            if (currentDepth >= maxDepth) return;

            for (let i = 0; i < dirsPerLevel; i++) {
                // Higher chance (80%) to add at least one directory at the first level to avoid empty suitableDirs
                const chance = currentDepth === 2 ? 0.2 : 0.4;
                if (Math.random() > chance) {
                    const baseName = this.getRandom(scenario.distractionDirs);
                    const dirName = `${baseName}_${Math.floor(Math.random() * 100)}`;
                    if (!currentDir.children[dirName]) {
                        const newDir: Directory = { type: 'directory', name: dirName, children: {} };
                        currentDir.children[dirName] = newDir;
                        const newPath = [...currentPath, dirName];

                        allDirs.push({ node: newDir, path: newPath });
                        addDirs(newDir, newPath, currentDepth + 1);
                    }
                }
            }
        };

        addDirs(userHome, ['home', 'user'], 2);

        // Define system-wide decoys with realistic contents
        const systemDecors: Record<string, { dirs: string[], files: Record<string, string>, permissions?: 'root' }> = {
            "etc": {
                dirs: ["apt", "ssh", "ssl", "network"],
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
                    "decoder.exe": "[BINARY DECRYPTION TOOL]\nUsage: decoder.exe <file.crypt>"
                }
            },
            "var": {
                dirs: ["log", "mail", "spool", "www"],
                files: {
                    "syslog": "Jan 15 10:24:01 kernel: [    0.000000] Linux version 5.15.0-generic",
                    "auth.log": "Jan 15 11:15:22 sshd[124]: Accepted password for user from 10.0.0.5",
                },
                permissions: 'root'
            },
            "tmp": {
                dirs: [".ICE-unix", ".test", "session_cache"],
                files: {
                    "sess_02931": "expiry=3600;uid=1000",
                    "build.log": "Build started at 09:00:00... OK."
                }
            },
            "opt": {
                dirs: ["google", "microsoft", "local_apps"],
                files: {
                    "README": "Site-specific applications go here."
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
            const dir: Directory = { type: 'directory', name: dirName, children: {}, permissions: content.permissions as 'root' | 'user' | undefined };
            root.children[dirName] = dir;

            // Add sub-directories
            content.dirs.forEach(subDir => {
                dir.children[subDir] = { type: 'directory', name: subDir, children: {} };
            });

            // Add files
            Object.entries(content.files).forEach(([fName, fContent]) => {
                dir.children[fName] = { type: 'file', name: fName, content: fContent };
            });
        });

        // Hidden config files in user home
        userHome.children['.bashrc'] = { type: 'file', name: '.bashrc', content: "alias ll='ls -la'\nexport PATH=$PATH:/usr/local/bin" };
        userHome.children['.profile'] = { type: 'file', name: '.profile', content: "# ~/.profile\n# This file is executed by the command interpreter for login shells." };

        const trashFiles: Record<string, string> = {
            ".DS_Store": "[BINARY DATA]",
            "thumbs.db": "[BINARY DATA]",
            "temp_file.tmp": "This is a temporary file.",
            "notes.txt": "Remember to buy milk.",
            ".gitkeep": "",
            "old_data.bak": "[ENCRYPTED BACKUP]",
            "test.sh": "#!/bin/bash\necho test",
            ".history": "ls\ncd home\ncat todo.txt\nls -a"
        };

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

        // Filter valid directories: objective can be ANYWHERE except exactly root or home
        const validObjectiveDirs = availableDirs.filter(d =>
            d.path.length > 0 && !(d.path.length === 1 && d.path[0] === 'home')
        );

        // Preference for DEEP directories for the objective
        const deeperObjectiveDirs = validObjectiveDirs.filter(d => d.path.length >= 3);
        const targetDirInfo = this.getRandom(deeperObjectiveDirs.length > 0 ? deeperObjectiveDirs : validObjectiveDirs);

        // 1. PLACE OBJECTIVE FILE
        const objectiveFileName = this.getRandom(scenario.objectiveFileNameOptions);
        const isEncrypted = Math.random() < 0.3; // 30% chance to be encrypted
        targetDirInfo.node.children[objectiveFileName] = {
            type: 'file',
            name: objectiveFileName,
            content: scenario.objectiveFileContent,
            isEncrypted: isEncrypted
        };

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
            // 20% chance the discovery clue itself is root-protected
            permissions: Math.random() < 0.2 ? 'root' : undefined
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
        const deliveryType = this.getRandom(pwdDeliveryTypes);

        switch (deliveryType) {
            case 'note':
                const pwdHintName = this.getRandom(["password_hint.txt", "reminder.msg", "login_help.md"]);
                userHome.children[pwdHintName] = {
                    type: 'file',
                    name: pwdHintName,
                    content: `Hint: My password is ${passwordHint}.`
                };
                break;
            case 'encrypted':
                const cryptHintName = "password_hint.crypt";
                userHome.children[cryptHintName] = {
                    type: 'file',
                    name: cryptHintName,
                    content: `Hint: My password is ${passwordHint}.`,
                    isEncrypted: true
                };
                break;
            case 'grep':
                const logName = "system.log";
                const logLines = Array.from({ length: 50 }, () => `Jan 15 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:01 retro-term systemd[1]: Running task...`);
                logLines[Math.floor(Math.random() * 50)] = `Jan 15 12:00:00 retro-term security_admin: REMINDER: Password hint is "${passwordHint}"`;
                userHome.children[logName] = {
                    type: 'file',
                    name: logName,
                    content: logLines.join('\n')
                };
                break;
            case 'split':
                const part1 = passwordHint.substring(0, Math.floor(passwordHint.length / 2));
                const part2 = passwordHint.substring(Math.floor(passwordHint.length / 2));

                const authLog = vfs.children.var.type === 'directory' ? ((vfs.children.var as Directory).children.log as Directory) : null;
                if (authLog) {
                    authLog.children['auth.log'] = { type: 'file', name: 'auth.log', content: `NOTICE: Password fragment alpha: ${part1}` };
                    authLog.children['syslog'] = { type: 'file', name: 'syslog', content: `DEBUG: Password fragment omega: ${part2}` };
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
            currentUser: 'user',
            rootPassword: password
        };
    }

    private generateVagueHint(path: string[]): string {
        const lastDir = path[path.length - 1];

        // Map paths to thematic names
        const thematicMap: Record<string, string> = {
            'finance': 'financial archives',
            'legal': 'legal vault',
            'research': 'R&D labs',
            'planning': 'strategic planning',
            'marketing': 'marketing department',
            'human_resources': 'HR files',
            'bin': 'system binaries',
            'var_log': 'server log archives',
            'etc_config': 'configuration backup',
            'sys': 'kernel space',
            'mem_dump': 'memory overflow area',
            'kernel_panic': 'unstable sector',
            'assembly_line': 'production floor',
            'warehouse': 'shipping & receiving',
            'quality_control': 'QA department',
            'maintenance': 'utility tunnels',
            'robotics': 'automation core',
            'shipping': 'distribution hub',
            'archived_data': 'the deep archive',
            'system_trash': 'garbage collection',
            'memory_dumps': 'volatile memory',
            'ghost_traces': 'spectral resonance area',
            'breakroom': 'employee lounge',
            'lab_results': 'experimental results',
            'marketing_campaigns': 'active campaigns',
            'flavor_tests': 'taste testing lab',
            'submersible_ops': 'deck alpha',
            'hydrophone_feeds': 'sonar station',
            'biological_samples': 'cryo-storage',
            'trench_scans': 'topography mapping',
            'life_support': 'O2 systems',
            'ballast_control': 'depth control'
        };

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
