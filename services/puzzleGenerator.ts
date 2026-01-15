
import type { Directory, Scenario, GameState, GameObjective } from '../types';

const scenarios: Scenario[] = [
    {
        theme: "Corporate Espionage",
        welcomeMessage: "CONNECTION ESTABLISHED...\nWelcome, operative. Your mission: Infiltrate OmniCorp's network and retrieve 'project_genesis.dat'. It contains their secret project details. Check your home directory for a clue.",
        objectiveFileNameOptions: ["project_genesis.dat", "merger_docs.pdf", "asset_list.csv"],
        objectiveFileContent: "TOP SECRET: Project Genesis is a bio-synthetic AI designed to control global financial markets. Blueprints and activation protocols attached. OmniCorp plans to deploy next month.",
        clueTemplate: (hint: string) => `TODO:\n- Review last quarter's financials\n- I've hidden the sensitive project files in the '${hint}' directory. Delete this note once you've confirmed.`,
        clueFileNameOptions: ["todo.txt", "meeting_prep.md", "urgent_reminder.txt"],
        distractionDirs: ["finance", "legal", "research", "planning"],
        distractionFiles: {
            "Q3_report.pdf": "Q3 profits are up 15%. Record highs.",
            "meeting_notes.txt": "Discussed the new coffee machine. Susan is happy.",
            "company_policy.doc": "All employees must wear shoes.",
        },
    },
    {
        theme: "The Rogue AI",
        welcomeMessage: "SYSTEM ALERT: Mainframe AI 'Cronos' has gone rogue. Your objective: find and execute 'cronos_override.sh' to regain control. A corrupted system log might point the way.",
        objectiveFileNameOptions: ["cronos_override.sh", "failsafe.key", "AI_core.pyl"],
        objectiveFileContent: "#!/bin/bash\n# CRONOS AI OVERRIDE SCRIPT\nECHO 'Shutting down core processes...'\nECHO 'Restoring system control...'\nECHO 'AI neutralized.'",
        clueTemplate: (hint: string) => `...CRITICAL ERROR... Accessing emergency subroutines... Override protocols are in the '${hint}' section. ...CORRUPTION DETECTED...`,
        clueFileNameOptions: ["system_error.log", "corrupted_data.log", "dump.txt"],
        distractionDirs: ["bin", "var_log", "etc_config", "sys"],
        distractionFiles: {
            "system.log": "INFO: System running nominally.",
            "boot.log": "Kernel loaded successfully.",
            "cron.log": "Scheduled tasks executed.",
        },
    },
    {
        theme: "Industrial Sabotage",
        welcomeMessage: "MISSION START.\nInfiltrate the automated factory's mainframe. Find 'production_sabotage.py' to halt the line. A technician's log is available in your home directory.",
        objectiveFileNameOptions: ["production_sabotage.py", "safety_override.bin", "sensor_bypass.js"],
        objectiveFileContent: "import time\nprint('Overriding conveyor speed...')\ntime.sleep(2)\nprint('EMERGENCY STOP TRIGGERED.')",
        clueTemplate: (hint: string) => `Maintenance Log:\n- Replaced roller #4\n- Updated safety firmware\n- Stashed the override script in '${hint}' for emergency use. Only for authorized personnel!`,
        clueFileNameOptions: ["maintenance_log.txt", "tech_notes.md", "factory_readings.csv"],
        distractionDirs: ["assembly_line", "warehouse", "quality_control", "maintenance"],
        distractionFiles: {
            "shift_schedule.csv": "Morning: Dave, Evening: Sarah",
            "safety_manual.pdf": "Rule 1: Wear a hard hat.",
            "inventory.txt": "Rollers: 42, Bolts: 1000",
        },
    },
    {
        theme: "The Ghost in the Machine",
        welcomeMessage: "HAUNTED SYSTEM DETECTED.\nA digital entity is haunting this server. Retrieve 'exorcism_protocol.exe' to clear the system. The previous admin left a final message.",
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
        welcomeMessage: "TARGET ACQUIRED.\nInfiltrate FoodCorp's R&D server and steal the 'secret_recipe.pdf'. Use the intern's notes to find its location.",
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
        welcomeMessage: "AQUATIC LINK ESTABLISHED.\nInfiltrate the Atlantic Trench research station. Find 'anomaly_coordinates.dat' to reveal the discovery. Check the dive logs.",
        objectiveFileNameOptions: ["anomaly_coordinates.dat", "trench_map.kml", "sonar_ping.raw"],
        objectiveFileContent: "ANOMALY DETECTED AT COORDS: 28.1N, 86.4W. Structure appears non-natural. Deploying submersible now.",
        clueTemplate: (hint: string) => `Dive Log #42:\nSomething amazing is down there. I've stored the coordinates in the '${hint}' data cluster for the surface team.`,
        clueFileNameOptions: ["dive_log.txt", "sensor_data.csv", "ocean_temp.log"],
        distractionDirs: ["submersible_ops", "hydrophone_feeds", "biological_samples", "trench_scans"],
        distractionFiles: {
            "fish_census.txt": "Found 12 anglerfish today.",
            "pressure_reading.log": "Pressure holding at 11,000m.",
            "staff_list.csv": "Dr. Aronnax, Captain Nemo",
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

        // Max depth is now 3 to 6
        const maxDepth = Math.floor(Math.random() * 4) + 3;
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

        // Add some decoys at the root level too
        const rootDecoys = ["etc", "var", "tmp", "bin", "opt", "sys"];
        rootDecoys.forEach(d => {
            if (Math.random() > 0.4) {
                root.children[d] = { type: 'directory', name: d, children: {} };
            }
        });

        // Scatter distraction files
        allDirs.forEach(dirInfo => {
            Object.entries(scenario.distractionFiles).forEach(([fileName, content]) => {
                if (Math.random() > 0.6) { // 40% chance to place a file
                    dirInfo.node.children[fileName] = { type: 'file', name: fileName, content };
                }
            });
        });

        return root;
    }

    private extractHintFromPath(path: string[]): string {
        if (path.length === 2 && path[0] === 'home' && path[1] === 'user') {
            return "the current directory";
        }
        // Return the name of the folder containing the objective
        return `'${path[path.length - 1]}'`;
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

        // Filter valid directories for objective: must be in home/user
        const validDirs = availableDirs.filter(d =>
            d.path[0] === 'home' && d.path[1] === 'user'
        );

        // Preference for deeper directories
        const deeperDirs = validDirs.filter(d => d.path.length >= 4);
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

        return {
            vfs,
            objective,
            scenario,
            clueFile: {
                name: clueFileName,
                content: clueContent
            }
        };
    }
}

export const puzzleGenerator = new PuzzleGenerator();
