
import type { Directory, Scenario, GameState, GameObjective } from '../types';

const scenarios: Scenario[] = [
    {
        theme: "Corporate Espionage",
        welcomeMessage: (fileName: string) => `CONNECTION ESTABLISHED...\nWelcome, operative. Your mission: Infiltrate OmniCorp's network and retrieve '${fileName}'. It contains their secret project details. Check your home directory for a clue.`,
        objectiveFileNameOptions: ["project_genesis.dat", "merger_docs.pdf", "asset_list.csv"],
        objectiveFileContent: "TOP SECRET: Project Genesis is a bio-synthetic AI designed to control global financial markets. Blueprints and activation protocols attached. OmniCorp plans to deploy next month.",
        clueTemplate: (hint: string) => `TODO:\n- Review last quarter's financials\n- I've hidden the sensitive project files in the '${hint}' directory. Delete this note once you've confirmed.`,
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

class PuzzleGenerator {
    private getRandom<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
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
        const systemDecors: Record<string, { dirs: string[], files: Record<string, string> }> = {
            "etc": {
                dirs: ["apt", "ssh", "ssl", "network"],
                files: {
                    "passwd": "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash",
                    "hosts": "127.0.0.1 localhost\n192.168.1.1 gateway",
                    "fstab": "/dev/sda1 / ext4 defaults 0 1",
                    "motd": "Welcome to the Retro-Term Mainframe.\nUnauthorized access is strictly prohibited.",
                    "resolve.conf": "nameserver 8.8.8.8\nnameserver 8.8.4.4"
                }
            },
            "bin": {
                dirs: [],
                files: {
                    "ls": "[BINARY DATA]",
                    "cat": "[BINARY DATA]",
                    "grep": "[BINARY DATA]",
                    "sh": "[BINARY DATA]",
                    "bash": "[BINARY DATA]",
                    "python3": "[BINARY DATA]"
                }
            },
            "var": {
                dirs: ["log", "mail", "spool", "www"],
                files: {
                    "syslog": "Jan 15 10:24:01 kernel: [    0.000000] Linux version 5.15.0-generic",
                    "auth.log": "Jan 15 11:15:22 sshd[124]: Accepted password for user from 10.0.0.5",
                }
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
                }
            }
        };

        // Populate the root with these system decors
        Object.entries(systemDecors).forEach(([dirName, content]) => {
            const dir: Directory = { type: 'directory', name: dirName, children: {} };
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

        // Re-calculate all possible directories for objective placement
        const availableDirs: { node: Directory, path: string[] }[] = [];
        const findDirs = (node: Directory, path: string[]) => {
            availableDirs.push({ node, path });
            Object.values(node.children).forEach(child => {
                if (child.type === 'directory') findDirs(child as Directory, [...path, child.name]);
            });
        };
        findDirs(vfs, []);

        // Filter valid directories for objective: can be ANYWHERE except exactly root or exactly home
        const validDirs = availableDirs.filter(d =>
            d.path.length > 0 && !(d.path.length === 1 && d.path[0] === 'home')
        );

        // Preference for directories with some depth
        const deeperDirs = validDirs.filter(d => d.path.length >= 2);
        const targetDirInfo = this.getRandom(deeperDirs.length > 0 ? deeperDirs : validDirs);

        // Place objective file
        const objectiveFileName = this.getRandom(scenario.objectiveFileNameOptions);
        targetDirInfo.node.children[objectiveFileName] = {
            type: 'file',
            name: objectiveFileName,
            content: scenario.objectiveFileContent,
        };
        const objective: GameObjective = {
            filePath: targetDirInfo.path,
            fileName: objectiveFileName,
        };

        // Generate a thematic hint
        const hint = this.extractHintFromPath(objective.filePath);
        const clueContent = scenario.clueTemplate(hint);
        const clueFileName = this.getRandom(scenario.clueFileNameOptions);

        const userHome = (vfs.children.home as Directory).children.user as Directory;
        userHome.children[clueFileName] = { type: 'file', name: clueFileName, content: clueContent };

        const finalScenario = {
            ...scenario,
            welcomeMessage: scenario.welcomeMessage(objectiveFileName)
        };

        return {
            vfs,
            objective,
            scenario: finalScenario as any,
            clueFile: {
                name: clueFileName,
                content: clueContent
            }
        };
    }
}

export const puzzleGenerator = new PuzzleGenerator();
