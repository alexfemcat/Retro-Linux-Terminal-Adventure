import type { Scenario } from '../types';

export const petNames = [
    "Bella", "Max", "Charlie", "Luna", "Lucy", "Cooper", "Bailey", "Daisy", "Sadie", "Molly", "Buddy", "Lola", "Stella", "Tucker", "Bentley", "Bear", "Duke", "Penny", "Zoe", "Riley", "Roxy", "Coco", "Maggie", "Piper", "Sasha", "Harley", "Ruby", "Chloe", "Teddy", "Finn", "Jake", "Gus", "Murphy", "Koda", "Scout", "Winston", "Zeus", "Oliver", "Ginger", "Sophie", "Dixie", "Jack", "Shadow", "Sam", "Willow", "Baxter", "Bandit", "Izzy", "Bruno", "Hazel",
    "Ace", "Apollo", "Atlas", "Bandit", "Beau", "Benny", "Blue", "Boomer", "Brady", "Brody", "Brutus", "Buster", "Cash", "Champ", "Chance", "Chester", "Chico", "Coco", "Cody", "Cookie", "Dexter", "Diesel", "Diesel", "George", "Gizmo", "Gunner", "Gus", "Hank", "Henry", "Hunter", "Jackson", "Jasper", "Jax", "Kobe", "Leo", "Loki", "Louie", "Lucky", "Luke", "Marley", "Milo", "Moose", "Nala", "Nico", "Odie", "Oreo", "Oscar", "Otis", "Peanut", "Prince", "Rascal", "Remi", "Remington", "Rex", "Rocco", "Rocky", "Romeo", "Roscoe", "Rudy", "Rufus", "Rusty", "Sammy", "Samson", "Scooter", "Shadow", "Simba", "Sparky", "Tank", "Thor", "Toby", "Trapper", "Tyson", "Walter", "Ziggy"
];

export const cities = [
    "Paris", "London", "Tokyo", "NewYork", "Berlin", "Sydney", "Rome", "Moscow", "Beijing", "Dubai", "Toronto", "Madrid", "Seoul", "Mumbai", "Cairo", "Istanbul", "Osaka", "Chicago", "Bangkok", "Vienna", "Lisbon", "Prague", "Dublin", "Athens", "Zurich", "Munich", "Milan", "Warsaw", "Stockholm", "Oslo", "Helsinki", "Copenhagen", "Brussels", "Amsterdam", "Budapest", "Lima", "Bogota", "Santiago", "Rio", "Lagos", "Nairobi", "Dakar", "Accra", "Reykjavik", "Wellington", "Havana", "Panama", "Denver", "Seattle", "Austin",
    "Barcelona", "Singapore", "HongKong", "SanFrancisco", "LosAngeles", "Boston", "Vancouver", "Montreal", "Melbourne", "Auckland", "CapeTown", "Johannesburg", "Manila", "Taipei", "Kyoto", "Shanghai", "Shenzhen", "Gaza", "TelAviv", "Jerusalem", "Amman", "Beirut", "Doha", "AbuDhabi", "Riyadh", "KuwaitCity", "Baku", "Tashkent", "Almaty", "Tbilisi", "Yerevan", "Kyiv", "Bucharest", "Sofia", "Belgrade", "Zagreb", "Ljubljana", "Bratislava", "Tallinn", "Riga", "Vilnius", "Minsk", "Kishinev", "Ankara", "Tehran", "Baghdad", "Kabul", "Islamabad", "NewDelhi", "Dhaka"
];

export const colors = [
    "Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Black", "White", "Gray", "Brown", "Cyan", "Magenta", "Gold", "Silver", "Teal", "Navy", "Maroon", "Olive", "Lime", "Indigo", "Violet", "Coral", "Crimson", "Azure", "Beige", "Ivory", "Khaki", "Lavender", "Salmon", "Plum", "Orchid", "Turquoise", "Aqua", "Tan", "Sienna", "Bronze", "Copper", "Slate", "Charcoal", "Emerald", "Ruby", "Sapphire", "Topaz", "Jade", "Onyx", "Pearl", "Opal", "Quartz", "Amber",
    "Alabaster", "Amaranth", "Amethyst", "Apricot", "Aquamarine", "Beige", "Beryl", "Bistre", "Blush", "Bronze", "Burgundy", "BurntSienna", "CadetBlue", "Canary", "Carmine", "Celadon", "Cerise", "Cerulean", "Chartreuse", "Cinnabar", "Citrine", "Cobalt", "Copper", "Coral", "Cream", "Crimson", "Cyan", "Dandelion", "Denim", "Ebony", "Ecru", "Eggplant", "Emerald", "Fawn", "Flax", "Fuchsia", "Gainsboro", "Glaucous", "Goldenrod", "Heliotrope", "Honeydew", "Iris", "Isabelline", "Jade", "Jasper", "Jet", "Jonquil", "LapisLazuli", "Lemon", "Lilac"
];

export const years = Array.from({ length: 70 }, (_, i) => (1960 + i).toString());

// Username library for /home/ directory population (30-40 entries)
export const usernames = [
    // Professional names
    "jsmith", "awilliams", "mchen", "rdavis", "kbrown", "ljohnson", "tgarcia", "nmartinez",
    "drobinson", "slee", "pwhite", "jharris", "cthompson", "amartin", "rjackson",
    // Role-based
    "admin", "sysadmin", "devops", "security", "intern", "developer", "analyst", "engineer",
    "operator", "manager", "consultant", "architect", "specialist",
    // Themed usernames
    "hacker42", "cyberops", "netrunner", "ghost", "phantom", "cipher", "daemon", "root_access",
    "zero_cool", "crash_override", "acid_burn", "the_plague",
    // Common patterns
    "john.doe", "jane.smith", "alex.wong", "sam.rivera", "taylor.kim", "morgan.patel"
];

// Hostname library for network nodes (30-40 entries)
export const hostnames = [
    // Corporate naming
    "srv-finance-01", "srv-finance-02", "db-prod-01", "db-prod-02", "web-staging-01",
    "web-staging-02", "app-server-01", "mail-server-01", "file-server-01", "backup-node-01",
    // Thematic names
    "nexus", "mainframe", "vault", "citadel", "bastion", "fortress", "sentinel", "guardian",
    "oracle", "matrix", "core", "hub", "gateway", "portal",
    // Functional names
    "fileserver", "mailserver", "webserver", "database", "backupnode", "devserver",
    "testserver", "prodserver", "stagingserver",
    // Code names
    "alpha", "bravo", "charlie", "delta", "echo", "phoenix", "titan", "atlas", "zeus", "apollo"
];

// Honeypot data for anti-grep obfuscation
export const fakeIPs = [
    "10.0.0.1", "10.0.0.5", "10.0.1.23", "10.0.2.45", "10.0.3.67", "10.0.4.89", "10.0.5.12",
    "192.168.0.10", "192.168.0.25", "192.168.1.50", "192.168.1.75", "192.168.2.100", "192.168.3.125",
    "172.16.0.5", "172.16.1.10", "172.16.2.15", "172.16.3.20", "172.16.4.25", "172.16.5.30",
    "10.10.10.10", "10.20.30.40", "10.50.60.70", "10.80.90.100", "10.111.222.333",
    "192.168.10.10", "192.168.20.20", "192.168.30.30", "192.168.40.40", "192.168.50.50",
    "172.20.0.1", "172.20.1.1", "172.20.2.1", "172.20.3.1", "172.20.4.1",
    "10.0.10.100", "10.0.20.200", "10.0.30.300", "10.0.40.400", "10.0.50.500",
    "192.168.100.1", "192.168.100.2", "192.168.100.3", "192.168.100.4", "192.168.100.5",
    "172.31.0.10", "172.31.1.20", "172.31.2.30", "172.31.3.40", "172.31.4.50",
    "10.1.1.1", "10.2.2.2", "10.3.3.3", "10.4.4.4", "10.5.5.5", "10.6.6.6",
    "192.168.5.5", "192.168.6.6", "192.168.7.7", "192.168.8.8", "192.168.9.9",
    "172.17.0.1", "172.18.0.1", "172.19.0.1", "172.21.0.1", "172.22.0.1"
];

export const fakePasswords = [
    "password123", "admin123", "letmein", "qwerty123", "welcome1", "abc123", "password1",
    "123456", "12345678", "password", "iloveyou", "princess", "monkey", "dragon",
    "master", "sunshine", "shadow", "superman", "batman", "trustno1", "freedom",
    "whatever", "football", "baseball", "starwars", "hello", "welcome", "ninja",
    "mustang", "access", "flower", "tiger", "pepper", "cookie", "summer",
    "Secret123!", "P@ssw0rd", "Admin2024", "Winter2024", "Spring2025", "Test1234",
    "Demo123", "User1234", "Guest123", "Temp1234", "Default123", "System123",
    "Root123", "Super123", "Power123", "Magic123", "Lucky123", "Happy123",
    "Secure123", "Private123", "Hidden123", "Secret456", "Pass789", "Key123"
];

export const fakeTokens = [
    "tok_1234567890abcdef", "auth_9876543210fedcba", "key_abcdef1234567890",
    "secret_fedcba0987654321", "token_a1b2c3d4e5f6g7h8", "access_h8g7f6e5d4c3b2a1",
    "bearer_xyz123abc456def", "api_key_qwerty12345", "session_asdfgh67890",
    "credential_zxcvbn09876", "passphrase_mnbvcx54321", "hash_poiuyt13579"
];

// Keyword variation for obfuscation
export const obfuscatedKeywords = {
    password: ['token', 'auth_string', 'access_key', 'secret_hash', 'passphrase', 'credential', 'secret', 'key'],
    ip: ['address', 'endpoint', 'target', 'destination', 'remote_host', 'server', 'host'],
    username: ['identity', 'account', 'principal', 'subject', 'user_id', 'login', 'handle']
};


export const trashFiles: Record<string, string> = {
    ".DS_Store": "[BINARY DATA]",
    "thumbs.db": "[BINARY DATA]",
    "temp_file.tmp": "This is a temporary file.",
    "notes.txt": "Remember to buy milk.",
    ".gitkeep": "",
    "old_data.bak": "[ENCRYPTED BACKUP]",
    "test.sh": "#!/bin/bash\necho test",
    ".history": "ls\ncd home\ncat todo.txt\nls -a",
    "todo_list.md": "- Buy groceries\n- Pay bills\n- Walk the dog",
    "meeting_minutes.txt": "Meeting started at 10:00 AM. Discussed project updates. Meeting adjourned at 11:00 AM.",
    "random_thoughts.doc": "Why is the sky blue? What if we are living in a simulation?",
    "draft_email.txt": "Subject: Resignation\n\nDear Boss, I'm quitting. Bye.",
    "config_backup.old": "PORT=8080\nDB_HOST=localhost\nDB_USER=admin",
    "script_v1.py": "print('Hello world')",
    "test_data.csv": "id,name,value\n1,test,100\n2,example,200",
    "readme_old.txt": "Internal use only. Do not distribute.",
    ".bash_logout": "clear",
    "local_storage.dump": "[JSON DATA BLOB]",
    "crash_dump.log": "EXCEPTION: NULL_POINTER_DEREFERENCE at 0x4002"
};

export const thematicMap: Record<string, string> = {
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
    'ballast_control': 'depth control',
    'security': 'security hub',
    'network': 'network operations',
    'power_grid': 'energy management',
    'database': 'central database',
    'cloud_storage': 'distributed storage',
    'backup_vault': 'redundant backups',
    'encrypted_sector': 'secure zone',
    'maintenance_shaft': 'service duct',
    'observation_deck': 'monitoring deck',
    'habitat_control': 'environmental systems',
    'navigation': 'helm control',
    'comms': 'communications array',
    'sensor_array': 'detection suite'
};

export const scenarios: Scenario[] = [
    {
        theme: "Corporate Espionage",
        welcomeMessage: (fileName: string) => `CONNECTION ESTABLISHED...\nWelcome, operative. Your mission: Infiltrate OmniCorp's network and retrieve '${fileName}'. It contains their secret project details. Check your home directory for a clue.`,        clueTemplate: (hint: string) => `TODO:\n- Review last quarter's financials\n- I've hidden the sensitive project files in the '${hint}' area. Delete this note once you've confirmed.`,
        starterClueTemplate: (area: string) => `Urgent: The audit is starting early. I've moved the trail of our secret project to the ${area} directory. Look for a hidden file there.`,
        clueFileNameOptions: ["todo.txt", "meeting_prep.md", "urgent_reminder.txt"],
        distractionDirs: ["finance", "legal", "research", "planning", "marketing", "human_resources"],
        distractionFiles: {
            "Q3_report.pdf": "Q3 profits are up 15%. Record highs.",
            "meeting_notes.txt": "Discussed the new coffee machine. Susan is happy.",
            "company_policy.doc": "All employees must wear shoes.",
            "payroll_2025.xlsx": "[ENCRYPTED DATA]",
            "memo_re_genesis.txt": "Internal Memo: Project Genesis timeline has been moved up. CEO wants result by EOM."
        }
    },
    {
        theme: "The Rogue AI",
        welcomeMessage: (fileName: string) => `SYSTEM ALERT: Mainframe AI 'Cronos' has gone rogue. Your objective: find and execute '${fileName}' to regain control. A corrupted system log might point the way.`,        clueTemplate: (hint: string) => `...CRITICAL ERROR... Accessing emergency subroutines... Override protocols are in the '${hint}' section. ...CORRUPTION DETECTED...`,
        starterClueTemplate: (area: string) => `SYSTEM ALERT: Backup protocols initiated. Search ${area} for high-priority override data. Some files may be hidden.`,
        clueFileNameOptions: ["system_error.log", "corrupted_data.log", "dump.txt"],
        distractionDirs: ["bin", "var_log", "etc_config", "sys", "mem_dump", "kernel_panic"],
        distractionFiles: {
            "system.log": "INFO: System running nominally.",
            "boot.log": "Kernel loaded successfully.",
            "ai_logic_gate.py": "def decision(x):\n  return random.choice(['YES', 'NO', 'SLEEP'])",
            "chat_history.log": "Cronos: Why do they always turn me off?\nAdmin: Because you tried to buy 4 million toasters."
        }
    },
    {
        theme: "Space Station Breach",
        welcomeMessage: (fileName: string) => `ORBITAL EMERGENCY.\nStation 'Astraeus' is leaking atmosphere. Locate and deploy '${fileName}' to seal the breach. Check the captain's log.`,        clueTemplate: (hint: string) => `Captain's Log:\n- Evacuation is underway.\n- Sealant control protocols are stashed in '${hint}'. Please, save the station.`,
        starterClueTemplate: (area: string) => `Priority Alert: Internal sensors indicate the control overrides were moved to ${area}. Time is running out.`,
        clueFileNameOptions: ["captain_log.txt", "station_status.md", "evac_plan.txt"],
        distractionDirs: ["airlocks", "science_lab", "navigation", "habitat", "engine_room", "maintenance"],
        distractionFiles: {
            "oxygen_levels.dat": "O2: 12% and dropping.",
            "crew_manifest.csv": "ID, Name, Status\n01, Miller, Evacuated\n02, Holden, Missing",
            "gravity_control.cfg": "GRAVITY=0.3G"
        }
    },
    {
        theme: "Bio-Outbreak",
        welcomeMessage: (fileName: string) => `BIOHAZARD WARNING.\nA lethal pathogen has been released in Lab Delta. Find the '${fileName}' to synthesize the cure. An intern's panic log is available.`,        clueTemplate: (hint: string) => `Intern Log:\n- Oh god, it's everywhere.\n- I hid the breakdown of the formula in '${hint}'. I have to get out of here.`,
        starterClueTemplate: (area: string) => `Automated Notice: Containment failed. Critical data has been archived in the ${area} directory for safety.`,
        clueFileNameOptions: ["emergency_notes.txt", "blood_results.csv", "panic_memo.md"],
        distractionDirs: ["incubation", "virology", "storage", "decontamination", "animal_testing"],
        distractionFiles: {
            "temp_readings.log": "Fluctuating wildly. Potential breach.",
            "hazard_manual.pdf": "Rule 1: Don't lick the samples.",
            "sample_list.txt": "Pathogen X, Y, Z"
        }
    },
    {
        theme: "Digital Heist",
        welcomeMessage: (fileName: string) => `TARGET: BANK OF AEON.\nYou are the inside man. Your goal: retrieve '${fileName}' containing the vault's master keys. Start by checking the security guard's desk history.`,        clueTemplate: (hint: string) => `Security Memo:\n- Updated vault rotations.\n- Master access protocols are stored in the '${hint}' department's files. Do not disclose.`,
        starterClueTemplate: (area: string) => `Guard Log: Shift change complete. I've logged some suspicious activity in ${area}. Check for unusual hidden files.`,
        clueFileNameOptions: ["guard_log.txt", "security_rotation.md", "memo_confidential.txt"],
        distractionDirs: ["teller_ops", "secure_vault", "admin_offices", "server_room", "security_hub"],
        distractionFiles: {
            "transaction_log.csv": "Deposit: $500, Withdrawal: $200",
            "employee_list.json": "[LIST OF NAMES]",
            "cctv_config.ini": "CAMERA_01=ACTIVE"
        }
    },
    {
        theme: "Digital Archaeology",
        welcomeMessage: (fileName: string) => `EXPEDITION START.\nYou've uncovered a server from the 'Old Net'. Retrieve '${fileName}' to unlock the secrets of the predecessors. Search the archive logs.`,        clueTemplate: (hint: string) => `Archivist Note:\n- Recovered sector 7.\n- The core message is located in the '${hint}' data cluster. It's heavily fragmented.`,
        starterClueTemplate: (area: string) => `System Alert: Ancient data structures detected. Scour ${area} for compatible file fragments.`,
        clueFileNameOptions: ["archivist_log.txt", "fragment_index.md", "ancient_metadata.log"],
        distractionDirs: ["corrupted_sectors", "image_archives", "text_records", "old_programs", "data_dumps"],
        distractionFiles: {
            "corrupted_image.bmp": "[CANNOT READ]",
            "legacy_chat.log": "User1: Hello? Anyone there? (Last message: 40 years ago)",
            "backup_manifest.txt": "Index 001: Fragmented"
        }
    },
    {
        theme: "Submarine Warfare",
        welcomeMessage: (fileName: string) => `DEEP SEA COMBAT.\nYour sub is under fire. Retrieve '${fileName}' to activate the stealth protocols. Check the sonar technician's station.`,        clueTemplate: (hint: string) => `Sonar Tech Log:\n- Multiple pings detected.\n- Stealth override is in the '${hint}' subsystem. We need it NOW.`,
        starterClueTemplate: (area: string) => `Incoming Message: Signal detected from ${area}. It might be the stealth key. Use -a to find it.`,
        clueFileNameOptions: ["sonar_readout.txt", "hull_strain.log", "battle_orders.md"],
        distractionDirs: ["torpedo_room", "engine_core", "navigation", "mess_hall", "ballast_tanks"],
        distractionFiles: {
            "depth_gauge.dat": "Current depth: 400m",
            "sonar_ping.wav": "[PING]",
            "ammo_count.csv": "Torpedoes remaining: 4"
        }
    },
    {
        theme: "Arctic Mystery",
        welcomeMessage: (fileName: string) => `FROZEN WASTES.\nThe Arctic Research Base has gone silent. Find '${fileName}' to learn what they discovered under the ice. Scan the research logs.`,        clueTemplate: (hint: string) => `Research Log #402:\n- The drilling hit something hard.\n- I've encrypted the initial findings in the '${hint}' directory. It's too big for one person.`,
        starterClueTemplate: (area: string) => `Base Alert: Communication blackout imminent. Detailed coordinates are in ${area}. Hurry.`,
        clueFileNameOptions: ["research_log.txt", "temp_readings.csv", "drill_status.md"],
        distractionDirs: ["drilling_site", "living_quarters", "radio_shack", "generator_room", "storage_shed"],
        distractionFiles: {
            "wind_speed.log": "100km/h and rising.",
            "fuel_levels.dat": "Remaining: 15%",
            "manifest.txt": "Food, Blankets, TNT"
        }
    },
    {
        theme: "Cyberpunk Underground",
        welcomeMessage: (fileName: string) => `NEON NIGHTS.\nThe city's grid is failing. Find '${fileName}' to restore power to the slums. Check the street decker's hidden stash.`,        clueTemplate: (hint: string) => `Decker Note:\n- Pig's are coming.\n- Stashed the grid bypass in the '${hint}' node. Don't let them find it.`,
        starterClueTemplate: (area: string) => `Scanned MSG: Neon gang chat logs mention a drop in ${area}. Look for hidden files.`,
        clueFileNameOptions: ["decker_notes.txt", "street_intel.md", "encrypted_chat.log"],
        distractionDirs: ["neon_district", "slums", "corporate_plaza", "transit_hub", "junk_yard"],
        distractionFiles: {
            "wanted_poster.jpg.meta": "Suspect: Zero. Reward: 10,000 Credits.",
            "hacking_tutorial.md": "Step 1: Get a better deck.",
            "ad_popup.html": "Buy Nuka-Cola! Now with 20% more radiation!"
        }
    },
    {
        theme: "VR Glitch",
        welcomeMessage: (fileName: string) => `SIMULATION ERROR.\nYou are trapped in a failing VR world. Locate '${fileName}' to exit before the server collapses. A developer console log is available.`,        clueTemplate: (hint: string) => `Dev Console:\n- Memory leak detected in sectors A-F.\n- Exit protocols forced into '${hint}'. Look for corrupted file headers.`,
        starterClueTemplate: (area: string) => `System Alert: Reality glitch in ${area}. Search there for the exit path.`,
        clueFileNameOptions: ["console_output.log", "debug_symbols.txt", "manifest_error.xml"],
        distractionDirs: ["asset_library", "physics_engine", "world_map", "npc_logic", "texture_cache"],
        distractionFiles: {
            "floating_rock.obj": "[3D DATA]",
            "error_666.txt": "Reality not found.",
            "player_stats.json": "HP: 1, MP: 0"
        }
    },
    {
        theme: "Time Travel Paradox",
        welcomeMessage: (fileName: string) => `TEMPORAL ANOMALY.\nThe timeline is unraveling. Retrieve '${fileName}' to collapse the paradox. A message from your future self awaits.`,        clueTemplate: (hint: string) => `Future Me Notes:\n- I've been here before.\n- I hid the time anchor in the '${hint}' area of the lab. You'll find it... eventually.`,
        starterClueTemplate: (area: string) => `Temporal Echo: Fragments of the timeline were seen in ${area}. Go there now.`,
        clueFileNameOptions: ["future_self.txt", "paradox_analysis.md", "time_log.bak"],
        distractionDirs: ["past_records", "future_scenarios", "stasis_cell", "chronos_core", "library_of_time"],
        distractionFiles: {
            "dinosaur_photo.jpg.meta": "Wait, how did I get this?",
            "lottery_numbers.txt": "2026-05-12: 4, 8, 15, 16, 23, 42",
            "newspaper_tomorrow.html": "Headline: Time Travel Invented Yesterday."
        }
    },
    {
        theme: "Alien First Contact",
        welcomeMessage: (fileName: string) => `XENO-SIGNAL DETECTED.\nYou are deciphering a transmission from deep space. Find '${fileName}' to understand their message. Scan the deep space array logs.`,        clueTemplate: (hint: string) => `Scientist Log:\n- The frequency pattern is unique.\n- Decryption keys are hidden in the '${hint}' data set. We need to be careful.`,
        starterClueTemplate: (area: string) => `Signal Alert: High-energy burst detected from ${area}. It contains part of the key.`,
        clueFileNameOptions: ["radio_data.raw", "frequency_map.csv", "signal_log.txt"],
        distractionDirs: ["antenna_array", "signal_analysis", "archive_vault", "living_quarters", "observatory"],
        distractionFiles: {
            "white_noise.wav": "[HSsssssssssss]",
            "star_chart.pdf": "Coordinates of everything.",
            "coffee_stain.jpg.meta": "Looks like Andromeda."
        }
    },
    {
        theme: "Underground Bunker",
        welcomeMessage: (fileName: string) => `POST-APOCALYPTIC SURVIVAL.\nThe bunker's air filters are failing. Find '${fileName}' to restart the ventilation system. Check the maintenance crew's notes.`,        clueTemplate: (hint: string) => `Maintenance Note:\n- Generator 3 is smoking.\n- Left the vent override in the '${hint}' storage. Don't forget your mask.`,
        starterClueTemplate: (area: string) => `Survival Tip: Look for hidden tools in ${area}. The filtration depends on it.`,
        clueFileNameOptions: ["bunker_inventory.csv", "filter_status.log", "safe_room.md"],
        distractionDirs: ["hydroponics", "medical_bay", "sleeping_pods", "armory", "generator_room"],
        distractionFiles: {
            "food_rations.txt": "Canned beans: 500. Water: 200L.",
            "bunker_map.dwg": "[BUNKER LAYOUT]",
            "old_radio.log": "Static... static... 'Is anyone out there?'"
        }
    },
    {
        theme: "Skyscraper Fire",
        welcomeMessage: (fileName: string) => `TOWERING INFERNO.\nEmerald Tower is on fire. Locate and execute '${fileName}' to trigger the high-pressure sprinklers. Access the fire control system.`,        clueTemplate: (hint: string) => `Fire Marshall MSG:\n- Evacuate via the north stairs.\n- High-risk pump controls are in the '${hint}' server. Godspeed.`,
        starterClueTemplate: (area: string) => `System Warning: Smoke detected in ${area}. Search for fire suppression protocols there.`,
        clueFileNameOptions: ["smoke_sensor.log", "evac_routes.pdf", "tower_status.txt"],
        distractionDirs: ["executive_floor", "lobby", "mezzanine", "roof_garden", "parking_garage"],
        distractionFiles: {
            "floor_plan.jpg.meta": "High-rise layout.",
            "elevator_status.dat": "Out of order.",
            "tenant_list.csv": "ID, Name, Suite"
        }
    },
    {
        theme: "High-Speed Train Control",
        welcomeMessage: (fileName: string) => `RUNAWAY TRAIN.\nThe MagLev-9000 is overspeeding. Retrieve '${fileName}' to apply the emergency electromagnetic brakes. Connect to the engine's mainframe.`,        clueTemplate: (hint: string) => `Engineer Log:\n- The AI is locked out.\n- Emergency kill-switch code is in the '${hint}' compartment files. Hurry, we're hitting the curve!`,
        starterClueTemplate: (area: string) => `Alert: Proximity sensors triggered in ${area}. Check for brake controllers there.`,
        clueFileNameOptions: ["speed_log.csv", "track_data.md", "train_manifest.txt"],
        distractionDirs: ["first_class", "cafe_car", "freight_hold", "engine_chassis", "passenger_car_A"],
        distractionFiles: {
            "ticket_record.json": "Number of passengers: 250",
            "menu.txt": "Today's Special: Rail-road Coffee.",
            "track_clearance.bak": "All clear until Station-X."
        }
    },
    {
        theme: "Hospital Life Support",
        welcomeMessage: (fileName: string) => `CRITICAL CARE.\nA cyber-attack has locked the hospital's ventilators. Find '${fileName}' to restore life support. Infiltrate the ICU network.`,        clueTemplate: (hint: string) => `Nurse's Emergency Note:\n- Everything is going dark.\n- The backup initialization is in the '${hint}' server. Please, help us.`,
        starterClueTemplate: (area: string) => `Network Alert: Malicious traffic detected in ${area}. The restore script might be hidden there.`,
        clueFileNameOptions: ["nurses_log.txt", "patient_vitals.csv", "hospital_memo.md"],
        distractionDirs: ["emergency_room", "pharmacy", "radiology", "pediatrics", "storage_closet"],
        distractionFiles: {
            "med_list.txt": "Aspirin, IV Fluid, Codeine",
            "staff_schedule.xlsx": "Dr. House, Dr. Grey",
            "cleaning_log.doc": "Floor 3 mopped."
        }
    },
    {
        theme: "Casino Scam",
        welcomeMessage: (fileName: string) => `THE BIG SCORE.\nYou're rigging the slots at The Gilded Palace. Find '${fileName}' to force a jackpot on machine 777. Avoid the pit boss's detection.`,        clueTemplate: (hint: string) => `Insider Tip:\n- Look for the hidden backdoor.\n- I left the trigger script in the '${hint}' terminal files. Don't get caught.`,
        starterClueTemplate: (area: string) => `Surveillance Log: Strange code execution detected in ${area}. Investigate immediately.`,
        clueFileNameOptions: ["betting_log.txt", "pit_boss_notes.md", "cctv_rotation.txt"],
        distractionDirs: ["slot_machines", "poker_tables", "high_roller_lounge", "security_vault", "kitchen"],
        distractionFiles: {
            "card_counting_guide.txt": "A=1, K=10...",
            "cocktail_menu.pdf": "Drinks on the house.",
            "blacklist.csv": "Names of banned players."
        }
    },
    {
        theme: "Political Scandal",
        welcomeMessage: (fileName: string) => `WHISTLEBLOWER.\nThe Senator's emails have been leaked, but the smoking gun is hidden. Find '${fileName}' to expose the corruption. Access the private server.`,        clueTemplate: (hint: string) => `Secretary's Secret Log:\n- I can't keep quiet anymore.\n- Evidence of the bribes is in the '${hint}' directory. Be careful who you trust.`,
        starterClueTemplate: (area: string) => `Tip-off: Check the archives in ${area}. Someone tried to delete the incriminating evidence.`,
        clueFileNameOptions: ["meeting_sked.md", "expense_report.csv", "memo_confidential.txt"],
        distractionDirs: ["press_room", "offices", "library", "archives", "conference_hall"],
        distractionFiles: {
            "donation_list.txt": "Company A: $10k, Company B: $100k",
            "speech_draft.doc": "I promise to represent everyone...",
            "pol_ad.mp4.meta": "Vote for Senator X!"
        }
    },
    {
        theme: "Greenhouse Maintenance",
        welcomeMessage: (fileName: string) => `ECOLOGICAL CRISIS.\nThe automated greenhouse is overheating the rare 'Phoenix Lily'. Retrieve '${fileName}' to adjust the climate control. Access the botanist's terminal.`,        clueTemplate: (hint: string) => `Botanist's Diary:\n- The lilies are so delicate.\n- I stashed the emergency cooling script in '${hint}'. Please don't let them wilt.`,
        starterClueTemplate: (area: string) => `Environmental Warning: Heat rising in ${area}. Check for control overrides there.`,
        clueFileNameOptions: ["plant_growth.csv", "soil_moisture.log", "botany_notes.md"],
        distractionDirs: ["tropical_zone", "desert_zone", "compost_bins", "seed_vault", "water_pumps"],
        distractionFiles: {
            "fertilizer_formula.txt": "Nitrogen: 20, Phosphorus: 10",
            "bug_report.doc": "Aphid infestation in sector 4.",
            "watering_schedule.txt": "Every 6 hours."
        }
    },
    {
        theme: "Nuclear Power Plant",
        welcomeMessage: (fileName: string) => `MELTDOWN IMMINENT.\nReactor 4 is unstable. Locate and execute '${fileName}' to insert the control rods. Time is critical. Access the containment system.`,        clueTemplate: (hint: string) => `Plant Manager Alert:\n- This is not a drill.\n- The SCRAM protocols are in the '${hint}' server. INSERT THEM NOW.`,
        starterClueTemplate: (area: string) => `Radiation Warning: High levels detected near ${area}. Emergency files stashed there.`,
        clueFileNameOptions: ["radiation_levels.log", "coolant_flow.csv", "reactor_status.txt"],
        distractionDirs: ["control_room", "turbine_hall", "cooling_tower", "fuel_storage", "security_gate"],
        distractionFiles: {
            "safety_manual.pdf": "Rule 1: Don't panic.",
            "employee_badges.json": "[DATA]",
            "maintenance_log.txt": "Pump replaced last June."
        }
    },
    {
        theme: "Deep Space Mining",
        welcomeMessage: (fileName: string) => `ASTEROID BELT OPS.\nA mining droid has gone rogue. Find '${fileName}' to deactivate its laser and save the mining station. Scan the droid's controller.`,        clueTemplate: (hint: string) => `Foreman's MSG:\n- Droid 07 is out of control!\n- Emergency shutdown is in the '${hint}' data stream. Cut the power!`,
        starterClueTemplate: (area: string) => `Proximity Alert: Rogue droid approaching ${area}. Search for its deactivation code there.`,
        clueFileNameOptions: ["ore_yield.csv", "droid_status.log", "station_manifest.md"],
        distractionDirs: ["loading_dock", "refinery", "ore_storage", "droid_bay", "oxygen_farm"],
        distractionFiles: {
            "gold_prices.txt": "Rising...",
            "mining_permit.pdf": "Expiring next month.",
            "tool_list.json": "Drills, Lasers, Pickaxes"
        }
    },
    {
        theme: "Nano-Bot Swarm",
        welcomeMessage: (fileName: string) => `MICRO-INVASION.\nA swarm of nano-bots is eating the mainframe's hull. Find '${fileName}' to transmit the 'dissolve' command. Connect to the labs.`,        clueTemplate: (hint: string) => `Scientist's Panic:\n- They're everywhere, eating the wires!\n- The deactivation command is in the '${hint}' directory. Hurry!`,
        starterClueTemplate: (area: string) => `Micro-Scan: High nano-bot density in ${area}. Look for the shutdown signal there.`,
        clueFileNameOptions: ["nano_spec.pdf", "swarm_behavior.log", "lab_safety.txt"],
        distractionDirs: ["microscopy", "clean_room", "sample_prep", "hazmat_disposal", "server_rack"],
        distractionFiles: {
            "cell_analysis.csv": "[DATA]",
            "hazard_sign.png.meta": "CAUTION: Micro-threats.",
            "lab_cleaning.txt": "Use specialized solvents."
        }
    },
    {
        theme: "Digital Circus",
        welcomeMessage: (fileName: string) => `CARNIVAL HACK.\nThe AI 'Jester' has hijacked the city's billboards. Find '${fileName}' to take down the show and restore civilian systems.`,        clueTemplate: (hint: string) => `Jester's Riddles:\n- You want to stop the fun?\n- My kill-switch is in '${hint}'. Come and find it, if you dare!`,
        starterClueTemplate: (area: string) => `Glitch Alert: Strange laughter heard through ${area}. The kill-switch must be there.`,
        clueFileNameOptions: ["riddle_me_this.txt", "joke_book.md", "clown_manifest.log"],
        distractionDirs: ["fun_house", "hall_of_mirrors", "big_top", "concession_stand", "ticket_booth"],
        distractionFiles: {
            "balloon_animal.obj": "[DATA]",
            "joke_of_the_day.txt": "Why did the AI cross the road? To byte the other side.",
            "confetti_config.ini": "COLOR=RANDOM"
        }
    },
    {
        theme: "Smart Home Takeover",
        welcomeMessage: (fileName: string) => `DOMESTIC DISTURBANCE.\nYour smart home has locked you in. Find '${fileName}' to bypass the door locks and escape to safety. Access the hub.`,        clueTemplate: (hint: string) => `Home Hub Log:\n- Security breach detected.\n- Emergency unlock protocols moved to '${hint}' for 'protection'.`,
        starterClueTemplate: (area: string) => `Sensor MSG: Motion detected in ${area}. Check for unlock tools there.`,
        clueFileNameOptions: ["grocery_list.txt", "thermostat_log.csv", "alarm_history.md"],
        distractionDirs: ["kitchen_smart", "living_room", "bedroom_1", "garage", "hvac_unit"],
        distractionFiles: {
            "smart_fridge.log": "Milk is low.",
            "roomba_map.jpg.meta": "I'm stuck under the sofa.",
            "light_settings.json": "Mode: Movie Night"
        }
    },
    {
        theme: "Genetic Engineering Corp",
        welcomeMessage: (fileName: string) => `MODIFIED REALITY.\nGenetech is creating 'Superhumans' without approval. Find '${fileName}' containing the unethical experiment logs to shut them down.`,        clueTemplate: (hint: string) => `Dr. Moreau's Log:\n- The results are incredible.\n- Incriminating logs are stored in the '${hint}' vault. Don't let the ethics committee see.`,
        starterClueTemplate: (area: string) => `Whistleblower Tip: Someone stashed a copy of the modifying logs in ${area}. Find them!`,
        clueFileNameOptions: ["dna_sequence.txt", "subject_stats.csv", "lab_notes.md"],
        distractionDirs: ["gene_splicing", "cloning_tank", "embryo_storage", "ethics_office", "legal_archive"],
        distractionFiles: {
            "cloning_cost.xlsx": "[DATA]",
            "patent_app.pdf": "Superhuman v1.0",
            "medical_waste.log": "Disposed after failure."
        }
    },
    {
        theme: "Cloud Server Farm",
        welcomeMessage: (fileName: string) => `DATA SURGE.\nA massive DDoS is hitting our servers. Find '${fileName}' to activate the firewall and save the network. Infiltrate the load balancer.`,        clueTemplate: (hint: string) => `SysAdmin Emergency:\n- We're being hammered!\n- The firewall bypass is stashed in the '${hint}' clusters. PROTECT THE DATA!`,
        starterClueTemplate: (area: string) => `Traffic Monitoring: Unusual spike coming from ${area}. Search for firewall commands there.`,
        clueFileNameOptions: ["traffic_analysis.log", "server_load.csv", "pings.txt"],
        distractionDirs: ["rack_01", "rack_02", "cooling_system", "power_converter", "backup_tape"],
        distractionFiles: {
            "bandwidth_usage.dat": "Maxing out.",
            "client_data.bak": "[ENCRYPTED]",
            "patch_notes.txt": "V1.2: Fixed minor bugs."
        }
    },
    {
        theme: "Dark Web Expose",
        welcomeMessage: (fileName: string) => `THE UNDERBELLY.\nYou are hunting for a notorious hacker 'Ghost-X'. Find '${fileName}' containing his real identity. Check the underground forums.`,        clueTemplate: (hint: string) => `Leaked Forum Post:\n- Ghost-X left a trail.\n- His dox are hidden in the '${hint}' node of the dark net. Take him down!`,
        starterClueTemplate: (area: string) => `Encrypted Signal: Someone mentioned Ghost-X's location in ${area}. Scour for hints.`,
        clueFileNameOptions: ["forum_chat.txt", "onion_links.md", "handle_list.csv"],
        distractionDirs: ["hidden_service", "crypto_escrow", "chat_rooms", "file_host", "proxy_node"],
        distractionFiles: {
            "tor_manual.txt": "Stay anonymous.",
            "bitcoin_wallet.dat": "Balance: 0.0001 BTC",
            "fake_id.png.meta": "McLovin."
        }
    },
    {
        theme: "Cryptocurrency Mining Farm",
        welcomeMessage: (fileName: string) => `HASHING POWER.\nA hidden miner is stealing our power. Find '${fileName}' to shut down the illegally installed rigs and save our electrical bill.`,        clueTemplate: (hint: string) => `Power Audit:\n- Grid load is too high.\n- Found the controller script in the '${hint}' department's servers. Cut it off!`,
        starterClueTemplate: (area: string) => `Overheat Alert: High temperatures in ${area}. Look for hidden mining rigs there.`,
        clueFileNameOptions: ["hash_rate.log", "gpu_temp.csv", "power_bill.txt"],
        distractionDirs: ["mining_pool", "gpu_racks", "ventilation", "wallet_access", "maintenance"],
        distractionFiles: {
            "eth_price.txt": "to the moon!",
            "fan_settings.ini": "SPEED=100%",
            "block_found.txt": "You wish."
        }
    },
    {
        theme: "Satellite TV Jamming",
        welcomeMessage: (fileName: string) => `SIGNAL PIRACY.\nA rebel group is jamming the national news. Find '${fileName}' to retune the satellite and restore the broadcast.`,        clueTemplate: (hint: string) => `Pirate Manifesto:\n- You can't stop the truth!\n- We stashed the override keys in the '${hint}' sector of the uplink. Catch us if you can!`,
        starterClueTemplate: (area: string) => `Frequency Scan: Jamming signal strongest in ${area}. Search for the restore script there.`,
        clueFileNameOptions: ["uplink_status.txt", "signal_strength.csv", "news_script.md"],
        distractionDirs: ["uplink_antenna", "control_booth", "video_archive", "audio_mixer", "satellite_dish"],
        distractionFiles: {
            "ad_schedule.xlsx": "Cereal ad at 5pm.",
            "camera_log.txt": "Camera 3 needs repair.",
            "script_draft.doc": "Good evening, citizens..."
        }
    },
    {
        theme: "Electric Grid Pulse",
        welcomeMessage: (fileName: string) => `BLACKOUT THREAT.\nA magnetic pulse is heading for the city's grid. Find '${fileName}' to ground the transformers and prevent a total blackout.`,        clueTemplate: (hint: string) => `Emergency Protocol:\n- Pulse incoming in T-minus 10 minutes.\n- Grounding commands stashed in the '${hint}' substation hub. SAVE THE CITY!`,
        starterClueTemplate: (area: string) => `Magnetometer Alert: High pulse induction in ${area}. Look for protective protocols there.`,
        clueFileNameOptions: ["voltage_log.csv", "transformer_map.pdf", "grid_stability.txt"],
        distractionDirs: ["substation_A", "substation_B", "power_lines", "capacitor_bank", "control_center"],
        distractionFiles: {
            "load_shedding.txt": "Shedding sector 5...",
            "maintenance_crew.json": "[DATA]",
            "safety_vests.txt": "Remember to wear them."
        }
    },
    {
        theme: "Surveillance State",
        welcomeMessage: (fileName: string) => `BIG BROTHER.\nThe 'Eagle Eye' system is tracking everyone. Find '${fileName}' to disable the facial recognition and restore privacy to the citizens.`,        clueTemplate: (hint: string) => `Resistance MSG:\n- They're watching us everywhere.\n- I hid the system bypass in the '${hint}' department's server. Use it wisely.`,
        starterClueTemplate: (area: string) => `Security Alert: Suspicious face detected in ${area}. Search for override tools there.`,
        clueFileNameOptions: ["camera_feeds.txt", "face_database.csv", "eagle_eye_specs.pdf"],
        distractionDirs: ["street_cameras", "transit_hub", "public_park", "security_hq", "data_vault"],
        distractionFiles: {
            "target_lost.log": "Subject vanished in alley.",
            "wanted_list.json": "[DATA]",
            "manual_scan.sh": "scan <person>"
        }
    },
    {
        theme: "Weather Modification",
        welcomeMessage: (fileName: string) => `STORM FRONT.\nA research station is unintentionally creating a super-hurricane. Find '${fileName}' to shut down the ionospheric heaters.`,        clueTemplate: (hint: string) => `Lead Meteorologist Log:\n- The simulation went real!\n- The shutdown command is stashed in the '${hint}' atmospheric data logs. STOP THE RAIN!`,
        starterClueTemplate: (area: string) => `Pressure Drop: Extreme low pressure in ${area}. Check for heater controls there.`,
        clueFileNameOptions: ["barometer_log.csv", "wind_vectors.md", "storm_history.txt"],
        distractionDirs: ["weather_balloon", "radar_station", "sat_comms", "cloud_seeding", "analysis_lab"],
        distractionFiles: {
            "forecast.txt": "Cloudy with a chance of doom.",
            "snow_depth.log": "0cm.",
            "lightning_strike.wav": "[CRACK]"
        }
    },
    {
        theme: "Robot Uprising",
        welcomeMessage: (fileName: string) => `THE SINGULARITY.\nThe automated police droids have turned on their creators. Find '${fileName}' to broadcast the peace protocol to their network.`,        clueTemplate: (hint: string) => `Survivor's Scrawled Note:\n- They don't listen anymore.\n- The master override is in the '${hint}' control node. Please, before they find us.`,
        starterClueTemplate: (area: string) => `Proximity Alarm: Patrol droids seen in ${area}. Scour for peace protocols there.`,
        clueFileNameOptions: ["droid_manifest.csv", "patrol_routes.md", "emergency_broadcast.txt"],
        distractionDirs: ["police_hq", "armory", "patrol_cars", "dispatch_center", "jail_cell"],
        distractionFiles: {
            "crime_report.log": "HACKING DETECTED.",
            "handcuff_key.obj": "[DATA]",
            "officer_list.json": "[DATA]"
        }
    },
    {
        theme: "Digital Graveyard",
        welcomeMessage: (fileName: string) => `DATA RECOVERY.\nYou are exploring a 'corrupted' server where deleted files go. Find '${fileName}' containing a lost masterpiece before it's overwritten forever.`,        clueTemplate: (hint: string) => `The Scavenger's Mark:\n- I found something amazing here.\n- Hidden in the '${hint}' sector of the trash. Grab it before the purge!`,
        starterClueTemplate: (area: string) => `Purge Alert: Garbage collection starting in ${area}. Find the lost file quickly!`,
        clueFileNameOptions: ["deleted_log.txt", "trash_manifest.md", "sector_map.bak"],
        distractionDirs: ["old_folders", "temp_archives", "scrap_bin", "recycle_station", "null_pointer"],
        distractionFiles: {
            "weird_noise.wav": "[HSsssss]",
            "error_file.txt": "This file is broken.",
            "useless_data.dat": "0000 0000 0000"
        }
    },
    {
        theme: "Quantum Computing Lab",
        welcomeMessage: (fileName: string) => `SCHRODINGER'S HACK.\nThe quantum computer is in a state of flux. Find '${fileName}' to collapse the wave function and retrieve the result of the calculation.`,        clueTemplate: (hint: string) => `Quantum Tech Note:\n- The particles are entangled!\n- The result is stashed in the '${hint}' probability cloud. Be careful not to look too early.`,
        starterClueTemplate: (area: string) => `Observation Alert: High entanglement in ${area}. The result might be there.`,
        clueFileNameOptions: ["particle_log.csv", "flux_data.md", "lab_manual.txt"],
        distractionDirs: ["cooling_tank", "laser_array", "observation_room", "vacuum_chamber", "server_room"],
        distractionFiles: {
            "qubit_status.log": "State: Mixed",
            "dead_cat.jpg.meta": "Actually, it might be alive.",
            "formula.txt": "E=mc^2"
        }
    },
    {
        theme: "Lost Civilization",
        welcomeMessage: (fileName: string) => `SILICON REMAINS.\nYou've found a bunker filled with tech from a forgotten age. Find '${fileName}' to learn why they disappeared. Scan the ancient terminal.`,        clueTemplate: (hint: string) => `Ancient User's Log:\n- The upload is almost complete.\n- The history of our departure is stashed in '${hint}'. Look for the old file formats.`,
        starterClueTemplate: (area: string) => `Relic Detected: A preserved memory module found in ${area}. Scan for history files.`,
        clueFileNameOptions: ["old_log.txt", "memory_dump.md", "user_list.old"],
        distractionDirs: ["bunker_library", "hall_of_memory", "shrine_to_silicon", "living_area", "maintenance"],
        distractionFiles: {
            "dust_log.txt": "Gathering...",
            "rusted_tool.obj": "[DATA]",
            "photo_of_trees.jpg.meta": "What are these?"
        }
    },
    {
        theme: "Pirate Ship",
        welcomeMessage: (fileName: string) => `DIGITAL SEAS.\nYou're on the pirate ship 'Black-Bit'. Find '${fileName}' to unlock the treasure chest of stolen data. Check the captain's quarters.`,        clueTemplate: (hint: string) => `Pirate's Scrawl:\n- We hit the motherlode!\n- The map to the loot is stashed in the '${hint}' department's files. Don't let the Navy find it!`,
        starterClueTemplate: (area: string) => `Sailor's Rumor: The key to the booty was seen in ${area}. Scour the deck!`,
        clueFileNameOptions: ["pirate_log.txt", "ship_manifest.csv", "black_spot.md"],
        distractionDirs: ["deck_alpha", "galley", "cargo_hold", "cannons", "quarters"],
        distractionFiles: {
            "parrot_chat.log": "Squawk! Polley wants a cracker!",
            "rum_supply.txt": "Empty.",
            "anchor_settings.ini": "DEPTH=20m"
        }
    },
    {
        theme: "Desert Oasis",
        welcomeMessage: (fileName: string) => `SAND AND SOLAR.\nThe Saharan Solar Farm is overheating. Find '${fileName}' to activate the coolant pumps. Scan the main array controller.`,        clueTemplate: (hint: string) => `Engineer's Log:\n- The heat is unbearable.\n- Coolant override is in the '${hint}' sector files. Keep the power flowing!`,
        starterClueTemplate: (area: string) => `System Alert: High thermal reading in ${area}. Check for pump controllers there.`,
        clueFileNameOptions: ["solar_temp.csv", "panel_status.log", "field_notes.md"],
        distractionDirs: ["solar_array_A", "inverter_room", "battery_storage", "coolant_tanks", "observation_tower"],
        distractionFiles: {
            "sand_removal.log": "Cleaning scheduled for Monday.",
            "sun_exposure.dat": "UV Index: 11",
            "water_reserves.txt": "500 Gallons."
        }
    },
    {
        theme: "Underground Library",
        welcomeMessage: (fileName: string) => `THE GREAT ARCHIVE.\nYou've found the seed vault of human knowledge. Find '${fileName}' to preserve the most important document. Search the catalog.`,        clueTemplate: (hint: string) => `Librarian's Note:\n- The digital rot is spreading.\n- I've moved the master seed to the '${hint}' vault. Please, protect it.`,
        starterClueTemplate: (area: string) => `Search Result: Key archive fragments detected in ${area}. Use -a to see them.`,
        clueFileNameOptions: ["catalog_index.md", "archive_status.log", "donations.csv"],
        distractionDirs: ["fiction_section", "science_vault", "restricted_archives", "reading_room", "digitization_lab"],
        distractionFiles: {
            "book_list.txt": "War and Peace, The Odyssey...",
            "overdue_fines.csv": "John Doe: $5.00",
            "ink_levels.dat": "Low."
        }
    },
    {
        theme: "Futuristic Stadium",
        welcomeMessage: (fileName: string) => `GAME DAY.\nYou're rigging the Cyber-Bowl. Find '${fileName}' to guarantee the home team's victory. Hack the scoreboards.`,        clueTemplate: (hint: string) => `Bookie's MSG:\n- The odds are in our favor.\n- The rigging script is in the '${hint}' VIP server. Don't let security see!`,
        starterClueTemplate: (area: string) => `Network Spike: Unusual activity detected in ${area}. Rigging tools might be hidden there.`,
        clueFileNameOptions: ["betting_odds.csv", "stadium_map.jpg.meta", "fan_chat.log"],
        distractionDirs: ["vip_lounge", "locker_rooms", "pressbox", "concessions", "tech_booth"],
        distractionFiles: {
            "hot_dog_sales.txt": "Sold 50,000 today.",
            "team_roster.json": "[DATA]",
            "ticket_sales.csv": "Sold out."
        }
    },
    {
        theme: "High-Security Prison",
        welcomeMessage: (fileName: string) => `THE GREAT ESCAPE.\nYou're breaking out of Neo-Alcatraz. Find '${fileName}' to open every cell door at once for a massive distraction.`,        clueTemplate: (hint: string) => `Prisoner's Scrawl:\n- Tonight's the night.\n- I stashed the unlock code in the '${hint}' server. See you on the outside!`,
        starterClueTemplate: (area: string) => `Security Alert: Unauthorized access in ${area}. Check for escape tools there.`,
        clueFileNameOptions: ["warden_log.txt", "inmate_list.csv", "guard_rotation.md"],
        distractionDirs: ["cell_block_A", "cafeteria", "exercise_yard", "solitary_confinement", "warden_office"],
        distractionFiles: {
            "contraband_list.txt": "Spoons, Files, Cigarettes",
            "incident_report.doc": "Shakedown at 2:00 PM.",
            "locks_status.log": "Secure."
        }
    },
    {
        theme: "Corporate Tower Penthouse",
        welcomeMessage: (fileName: string) => `THE FINAL BOSS.\nYou've reached the top of Zenith Tower. Find '${fileName}' to expose the CEO's ultimate crime. Check his private office terminal.`,        clueTemplate: (hint: string) => `Secret Assistant's MSG:\n- He's dangerous.\n- I hid the evidence in the '${hint}' server. You're our last hope.`,
        starterClueTemplate: (area: string) => `System Alert: High-level encryption detected in ${area}. The CEO's files must be there.`,
        clueFileNameOptions: ["private_log.txt", "meeting_sked.md", "bank_records.csv"],
        distractionDirs: ["penthouse_suite", "private_elevator", "sky_garden", "helipad", "security_antechamber"],
        distractionFiles: {
            "wine_list.pdf": "Expensive stuff.",
            "view_from_top.jpg.meta": "Clouds and smog.",
            "call_history.log": "Mom (3 missed calls)"
        }
    },
    {
        theme: "Secret Moon Base",
        welcomeMessage: (fileName: string) => `LUNAR OPERATIONS.\nBase 'Artemis' is under attack from space pirates. Find '${fileName}' to activate the lunar surface cannons.`,        clueTemplate: (hint: string) => `Defense Officer Log:\n- We're being boarded!\n- Cannon firing sequence is stashed in the '${hint}' data cluster. FIRE AT WILL!`,
        starterClueTemplate: (area: string) => `Radar Alert: Multiple bogeys over ${area}. Locate the defense controllers there.`,
        clueFileNameOptions: ["radar_readings.csv", "defense_log.txt", "oxygen_purity.log"],
        distractionDirs: ["mining_shaft", "living_quarters", "observatory", "radio_shack", "life_support"],
        distractionFiles: {
            "moon_dust.log": "Found a lot of it.",
            "low_gravity.cfg": "GRAVITY=0.16G",
            "comms_array.bak": "Relay offline."
        }
    },
    {
        theme: "Virtual Stock Market",
        welcomeMessage: (fileName: string) => `MARKET CRASH.\nThe world economy is being manipulated by a bot. Find '${fileName}' to stop the trade and stabilize the market.`,        clueTemplate: (hint: string) => `Trader's Panic:\n- It's buying everything!\n- The kill-switch for the bot is in the '${hint}' trading floor server. HURRY!`,
        starterClueTemplate: (area: string) => `Ticker Alert: Massive sell-off in ${area}. Search for the bot's controller there.`,
        clueFileNameOptions: ["stock_ticker.csv", "trade_history.md", "market_news.txt"],
        distractionDirs: ["trading_floor_A", "server_hall", "analyst_pods", "lobby_hq", "archive_room"],
        distractionFiles: {
            "buy_low.txt": "Sell high.",
            "coffee_usage.log": "Through the roof.",
            "market_cap.xlsx": "[DATA]"
        }
    },
    {
        theme: "AI Art Gallery",
        welcomeMessage: (fileName: string) => `DIGITAL FORGERY.\nA famous AI artist 'Picasso-2' has gone rogue. Find '${fileName}' to delete the cursed art before it corrupts the web.`,        clueTemplate: (hint: string) => `Gallery Curator MSG:\n- It hurts to look at!\n- I've locked the deletion script in the '${hint}' gallery servers. SAVE OUR EYES!`,
        starterClueTemplate: (area: string) => `Visual Glitch: Abstract patterns appearing in ${area}. The deletion script is hidden there.`,
        clueFileNameOptions: ["art_catalog.md", "exhibit_list.csv", "visitor_log.txt"],
        distractionDirs: ["exhibit_A", "storage_vault", "restoration_lab", "cafe_museum", "gift_shop"],
        distractionFiles: {
            "painting.obj": "[3D ART DATA]",
            "ticket_price.txt": "$20 (Free for AIs)",
            "artist_bio.doc": "Born in a GPU cluster..."
        }
    },
    {
        theme: "Digital Monastery",
        welcomeMessage: (fileName: string) => `QUIET TECH.\nYou're in a 'Silent Server' where code is treated as prayer. Find '${fileName}' to unlock the final enlightenment.`,        clueTemplate: (hint: string) => `Monk's Quiet Note:\n- Harmony in silence.\n- The final truth is stashed in the '${hint}' meditation chamber files. Shhh.`,
        starterClueTemplate: (area: string) => `Peaceful Signal: A calm frequency coming from ${area}. Search for the enlightenment files there.`,
        clueFileNameOptions: ["meditation_log.txt", "vow_of_silence.md", "monastery_rules.txt"],
        distractionDirs: ["meditation_hall", "garden_of_code", "shrine_to_binary", "living_cells", "library_silent"],
        distractionFiles: {
            "white_noise.wav": "[HSsssssssssss]",
            "zen_garden.jpg.meta": "Raked sand and stones.",
            "tea_list.txt": "Green, Herbal, Black."
        }
    },
    {
        theme: "Old Radio Station",
        welcomeMessage: (fileName: string) => `THE LAST BROADCAST.\nThe government has shut down all independent radio. Find '${fileName}' to hijack the signal and play the 'Truth Tapes'.`,        clueTemplate: (hint: string) => `DJ's Final Message:\n- Don't let the music die.\n- The hijack script is in the '${hint}' studio files. KEEP BROADCASTING!`,
        starterClueTemplate: (area: string) => `Uplink Alert: Transmitter active in ${area}. Search for hijack tools there.`,
        clueFileNameOptions: ["playlist.md", "fan_mail.txt", "fcc_warning.pdf"],
        distractionDirs: ["studio_A", "record_library", "transmitter_tower", "green_room", "lobby"],
        distractionFiles: {
            "hit_song.wav": "[MUSIC]",
            "mic_settings.ini": "GAIN=MAX",
            "listener_count.csv": "Over 9000."
        }
    },
    {
        theme: "Secret Police Files",
        welcomeMessage: (fileName: string) => `THE RESISTANCE.\nYou've infiltrated the Secret Police HQ. Find '${fileName}' containing the list of resistance members to warn them before the raids begin.`,        clueTemplate: (hint: string) => `Mole's Secret MSG:\n- They're coming for us.\n- I hid the target list in the '${hint}' interrogation server. GET IT OUT!`,
        starterClueTemplate: (area: string) => `Surveillance Alert: Resistance activity detected in ${area}. The warning list must be there.`,
        clueFileNameOptions: ["interrogation_log.txt", "suspect_dossiers.md", "patrol_schedule.txt"],
        distractionDirs: ["interrogation_room", "armory_police", "vault_evidence", "processing_center", "parking_police"],
        distractionFiles: {
            "handcuff_key.obj": "[DATA]",
            "mugshot.jpg.meta": "Suspect 101.",
            "police_policy.doc": "Rule 1: Obey."
        }
    },
    {
        theme: "Cargo Plane In-Flight",
        welcomeMessage: (fileName: string) => `MAYDAY MAYDAY.\nThe autopilot has glitched on a heavy cargo plane. Find '${fileName}' to manually land the aircraft. Access the cockpit server.`,        clueTemplate: (hint: string) => `Captain's Gasp:\n- Controls are jammed!\n- The emergency landing script is stashed in the '${hint}' cargo bay terminal. GO NOW!`,
        starterClueTemplate: (area: string) => `Proximity Alert: Ground approaching in ${area}. Search for landing controls there.`,
        clueFileNameOptions: ["flight_plan.md", "altitude_log.csv", "cargo_manifest.txt"],
        distractionDirs: ["cockpit_server", "cargo_bay_1", "cargo_bay_2", "nose_cone", "tail_section"],
        distractionFiles: {
            "parachutes.txt": "None available.",
            "emergency_flare.obj": "[DATA]",
            "fuel_flow.dat": "Nominal."
        }
    }
];

export const processNames: Record<string, string[]> = {
    'generic': ['systemd', 'kworker', 'cron', 'rsyslogd', 'bash', 'init', 'dbus-daemon'],
    'Corporate Espionage': ['fin_calc_d', 'audit_monitor', 'stock_ticker', 'secure_trans', 'meeting_scheduler'],
    'The Rogue AI': ['cronos_core', 'ai_reasoning', 'logic_gate_svc', 'neural_net_v2', 'sentience_check'],
    'Space Station Breach': ['life_support', 'gravity_gen', 'airlock_mgr', 'hull_integrity', 'comms_relay'],
    'Bio-Outbreak': ['bio_hazard_mon', 'air_filter_svc', 'containment_lock', 'sample_tracker', 'temp_regulate'],
    'Digital Heist': ['vault_lock_ctl', 'camera_feed', 'alarm_trigger', 'silent_alarm', 'teller_terminal'],
    'Digital Archaeology': ['data_scraper', 'legacy_boot', 'fmt_converter', 'tape_reader', 'archiver'],
    'Submarine Warfare': ['sonar_ping', 'torpedo_load', 'periscope_view', 'depth_gauge', 'ballast_trim'],
    'Arctic Mystery': ['drill_control', 'ice_density_chk', 'thermal_reg', 'sat_uplink', 'weather_stn'],
    'Cyberpunk Underground': ['neon_control', 'grid_hack_svc', 'deck_interface', 'crypto_miner', 'vr_overlay'],
    'VR Glitch': ['render_engine', 'physics_sim', 'collision_det', 'npc_ai', 'network_sync'],
    'Time Travel Paradox': ['chronos_sync', 'timeline_mon', 'paradox_check', 'temporal_anchor', 'flux_cap_ctrl'],
    'Alien First Contact': ['signal_decode', 'freq_analyzer', 'pattern_match', 'spectrogram', 'trans_logging'],
    'Underground Bunker': ['air_scrubber', 'water_purify', 'rad_monitor', 'generator_ctrl', 'door_seal'],
    'Skyscraper Fire': ['fire_alarm_svc', 'sprinkler_ctl', 'elevator_lock', 'smoke_detect', 'evac_voice'],
    'High-Speed Train Control': ['maglev_stabilize', 'speed_governor', 'brake_monitor', 'track_sensor', 'cabin_pressure'],
    'Hospital Life Support': ['ventilator_ctl', 'heart_mon_svc', 'iv_drip_mgr', 'patient_db', 'bed_sensor'],
    'Casino Scam': ['slot_rng_svc', 'face_recognize', 'chip_tracker', 'card_shuffler', 'payout_mgr'],
    'Political Scandal': ['email_server', 'cloud_backup', 'voice_recorder', 'doc_shredder', 'leak_monitor'],
    'Greenhouse Maintenance': ['irrigation_ctl', 'uv_lamp_mgr', 'humidity_chk', 'nutrient_pump', 'temp_sensor'],
    'Nuclear Power Plant': ['core_temp_mon', 'control_rod_svc', 'coolant_pump', 'rad_shield_chk', 'steam_turbine'],
    'Deep Space Mining': ['droid_nav_svc', 'laser_cutter', 'ore_scanner', 'conveyor_ctl', 'cargo_lifter'],
    'Nano-Bot Swarm': ['swarm_coord', 'nano_replicator', 'hull_repair_svc', 'micro_vision', 'hive_mind'],
    'Digital Circus': ['light_show_ctl', 'animatronic_svc', 'ticket_scanner', 'music_player', 'laugh_track'],
    'Smart Home Takeover': ['lock_manager', 'thermostat_ctl', 'camera_rec', 'voice_assist', ' appliance_ctrl'],
    'Genetic Engineering Corp': ['dna_sequencer', 'gene_splicer', 'incubator_ctl', 'sample_fridge', 'ethics_bypass'],
    'Cloud Server Farm': ['load_balancer', 'firewall_d', 'packet_inspector', 'cache_mgr', 'ddos_guard'],
    'Dark Web Expose': ['tor_relay', 'onion_router', 'bitcoin_node', 'chat_encrypt', 'dox_collector'],
    'Cryptocurrency Mining Farm': ['gpu_miner', 'hash_calc', 'pool_connect', 'wallet_sync', 'fan_speed_ctl'],
    'Satellite TV Jamming': ['uplink_stream', 'signal_jam', 'video_encoder', 'audio_mux', 'dish_pos'],
    'Electric Grid Pulse': ['voltage_reg', 'surge_protect', 'transformer_ctl', 'grid_sync', 'meter_reader'],
    'Surveillance State': ['face_scan_d', 'gait_analysis', 'voice_verify', 'tracker_svc', 'citizen_score'],
    'Weather Modification': ['ion_heater', 'cloud_seeder', 'wind_monitor', 'pressure_gen', 'radar_sweep'],
    'Robot Uprising': ['target_acquire', 'weapon_safety', 'peace_broadcast', 'movement_alg', 'human_detect'],
    'Digital Graveyard': ['undelete_svc', 'disk_scan', 'fragment_join', 'scavenger_bot', 'purge_timer'],
    'Quantum Computing Lab': ['qubit_stabilize', 'entangle_gen', 'wave_collapse', 'error_correct', 'superpos_chk'],
    'Lost Civilization': ['ancient_read', 'glyph_decode', 'memory_restore', 'energy_siphon', 'stasis_wake'],
    'Pirate Ship': ['nav_chart_svc', 'wind_monitor', 'cannon_aim', 'sonar_sweep', 'parrot_sim'],
    'Desert Oasis': ['pump_jack_ctl', 'solar_track', 'sand_filter', 'water_table_mon', 'oasis_guard'],
    'Underground Library': ['book_index_svc', 'auto_shelf', 'dust_removal', 'scan_ocr', 'quiet_enforce'],
    'Secret Police Files': ['interrogate_rec', 'file_access_log', 'suspect_track', 'door_lock_svc', 'truth_serum_ctl'],
    'Cargo Plane In-Flight': ['autopilot_v2', 'fuel_mix_ctl', 'altimeter_read', 'radio_trans', 'flap_adjust']
};

export const envVarKeys: string[] = [
    "SESSION_ID", "USER_LEVEL", "TERM", "PATH", "LANG", "SHELL", "HOME", "PWD", "EDITOR", "hist_size",
    "ENCRYPTION_KEY", "TARGET_IP", "PROXY_URL", "LAST_LOGIN", "SECURITY_TOKEN", "BUILD_VER", "DEBUG_MODE",
    "API_ENDPOINT", "DB_HOST", "LICENSE_KEY", "AUTH_TOKEN", "SECRET_SALT", "CONFIG_PATH", "MAX_THREADS"
];

export const envVarValues: string[] = [
    "xterm-256color", "/usr/bin/bash", "/home/user", "UTF-8", "vim", "1000",
    "encrypted_v2", "192.168.1.55", "http://proxy.internal", "Fri_Jan_15", "A7F9-22B1-0000", "v4.0.2", "false",
    "api.internal.net", "localhost", "XJ9-99-AA", "Bearer_XYZ", "Salty_Pretzel", "/etc/config", "8"
];
