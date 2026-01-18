import { MarketItem } from '../types';
import { GAME_CONFIG } from './gameConfig';

export const MARKET_CATALOG: MarketItem[] = [
    // --- SOFTWARE: Tier 1 ---
    { id: 'ping', name: 'ICMP Echo Utility (ping)', category: 'utility', tier: 1, description: 'Standard network connectivity tester. Essential for initial recon.', cost: 150, cpuReq: 1, ramReq: 4, storageSize: 10 },
    { id: 'brute-force.sh', name: 'Simple Brute-Force Script', category: 'exploit', tier: 1, description: 'A noisy, basic script for credential guessing. High detection risk.', cost: 800, cpuReq: 20, ramReq: 32, storageSize: 5 },

    // --- SOFTWARE: Tier 2 ---
    { id: 'nmap', name: 'Nmap Professional v7.9', category: 'sniffing', tier: 2, description: 'Industry standard network scanner. Includes service and version detection.', cost: 1800, cpuReq: 10, ramReq: 64, storageSize: 60 },
    { id: 'hydra', name: 'THC-Hydra v9.2', category: 'exploit', tier: 2, description: 'Multi-threaded parallelized login cracker. Supports multiple protocols.', cost: 3500, cpuReq: 25, ramReq: 128, storageSize: 60 },
    { id: 'ssh-crack-v1', name: 'SSH-Harvester v1.0', category: 'exploit', tier: 2, description: 'Specialized SSH credential harvester. Optimized for low-latency connections.', cost: 4500, cpuReq: 15, ramReq: 96, storageSize: 40 },
    { id: 'overclock', name: 'Kernel Overdrive Module', category: 'utility', tier: 2, description: 'Unlocks CPU frequency controls and voltage scaling. Warning: Increases heat.', cost: 2500, cpuReq: 2, ramReq: 8, storageSize: 20 },

    // --- SOFTWARE: Tier 3 ---
    { id: 'sqlmap', name: 'sqlmap/1.5.4-dev', category: 'exploit', tier: 3, description: 'Automatic SQL injection and database takeover tool. Supports PostgreSQL, MySQL, and more.', cost: 12000, cpuReq: 30, ramReq: 256, storageSize: 160 },
    { id: 'john', name: 'John the Ripper v1.9', category: 'exploit', tier: 3, description: 'Offline password hash cracker. Uses advanced heuristic and wordlist attacks.', cost: 10000, cpuReq: 80, ramReq: 512, storageSize: 120 },
    { id: 'proxy-tunnel', name: 'Shadow-Tunnel v2.1', category: 'utility', tier: 3, description: 'Encrypted traffic tunneling. Masks origin IP through multiple hops.', cost: 8000, cpuReq: 5, ramReq: 128, storageSize: 50 },

    // --- SOFTWARE: Tier 4 ---
    { id: 'msfconsole', name: 'Metasploit Framework v6.1', category: 'exploit', tier: 4, description: 'Advanced exploitation framework. Includes a massive database of known vulnerabilities.', cost: 35000, cpuReq: 50, ramReq: 1024, storageSize: 1000 },
    { id: 'dist-crack', name: 'Distributed-Crack v4.0', category: 'exploit', tier: 4, description: 'Coordinated multi-node brute force attack. Leverages remote CPU cycles.', cost: 55000, cpuReq: 40, ramReq: 2048, storageSize: 300 },
    { id: 'nmap-pro', name: 'Nmap-Enterprise Edition', category: 'sniffing', tier: 4, description: 'Advanced OS fingerprinting and automated vulnerability detection.', cost: 20000, cpuReq: 20, ramReq: 256, storageSize: 240 },

    // --- SOFTWARE: Tier 5 ---
    { id: '0day-pack', name: 'Zero-Day Exploit Pack', category: 'exploit', tier: 5, description: 'Instant-access exploit kit for specific OS versions. Bypasses standard patches.', cost: 250000, cpuReq: 10, ramReq: 512, storageSize: 20 },
    { id: 'neuro-crack', name: 'Neuro-Crack AI v1.0', category: 'exploit', tier: 5, description: 'AI-driven heuristic encryption bypass. Uses neural networks to predict keys.', cost: 750000, cpuReq: 95, ramReq: 4096, storageSize: 2400 },

    // --- CONSUMABLES ---
    { id: 'proxy_list', name: 'Disposable Proxy List', category: 'consumable', description: 'One-time use proxy chain (5 uses). Reduces trace speed.', cost: 1200 },
    { id: 'vpn_tunnel', name: 'Encrypted VPN Tunnel', category: 'consumable', description: 'Masks identity for 1 mission. Drastically reduces trace speed.', cost: 3500 },
    { id: 'wordlist_small', name: 'Common Passwords (Small)', category: 'consumable', description: 'Small wordlist for hydra. 10,000 common entries.', cost: 500 },
    { id: 'wordlist_big', name: 'RockYou.txt (Modified)', category: 'consumable', description: 'Massive wordlist for hydra. 10 million entries.', cost: 2500 },

    // --- HARDWARE: CPU ---
    { id: 'cpu_v1', name: 'Intel 80386 (16MHz)', category: 'hardware', description: 'The classic 32-bit processor. Slow but reliable.', cost: GAME_CONFIG.HARDWARE.CPU.v1.cost, hardwareKey: 'cpu', stats: { level: 1, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v1.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v1.cores } },
    { id: 'cpu_v2', name: 'Intel 80486 (33MHz)', category: 'hardware', description: 'Noticeable improvement in cycle speed.', cost: GAME_CONFIG.HARDWARE.CPU.v2.cost, hardwareKey: 'cpu', stats: { level: 2, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v2.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v2.cores } },
    { id: 'cpu_v3', name: 'Pentium Pro (200MHz)', category: 'hardware', description: 'High-end workstation processor from the mid-90s.', cost: GAME_CONFIG.HARDWARE.CPU.v3.cost, hardwareKey: 'cpu', stats: { level: 3, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v3.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v3.cores } },
    { id: 'cpu_v4', name: 'Pentium III (500MHz)', category: 'hardware', description: 'Solid performance for modern terminal operations.', cost: GAME_CONFIG.HARDWARE.CPU.v4.cost, hardwareKey: 'cpu', stats: { level: 4, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v4.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v4.cores } },
    { id: 'cpu_v5', name: 'Pentium 4 (1.6GHz)', category: 'hardware', description: 'Efficient single-core processor with NetBurst architecture.', cost: GAME_CONFIG.HARDWARE.CPU.v5.cost, hardwareKey: 'cpu', stats: { level: 5, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v5.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v5.cores } },
    { id: 'cpu_v6', name: 'Core 2 Duo (1.8GHz)', category: 'hardware', description: 'Dual-core architecture. 2x thread capacity.', cost: GAME_CONFIG.HARDWARE.CPU.v6.cost, hardwareKey: 'cpu', stats: { level: 6, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v6.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v6.cores } },
    { id: 'cpu_v7', name: 'Core i5-750 (2.6GHz Quad)', category: 'hardware', description: 'Workstation grade quad-core. Excellent for parallel tasks.', cost: GAME_CONFIG.HARDWARE.CPU.v7.cost, hardwareKey: 'cpu', stats: { level: 7, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v7.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v7.cores } },
    { id: 'cpu_v8', name: 'Core i7-2600K (3.4GHz Quad)', category: 'hardware', description: 'Overclock-stable quad-core with Hyper-Threading.', cost: GAME_CONFIG.HARDWARE.CPU.v8.cost, hardwareKey: 'cpu', stats: { level: 8, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v8.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v8.cores } },
    { id: 'cpu_v9', name: 'Xeon E5-2690 (2.9GHz 8-Core)', category: 'hardware', description: 'Server-grade processing power. Pure dominance.', cost: GAME_CONFIG.HARDWARE.CPU.v9.cost, hardwareKey: 'cpu', stats: { level: 9, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v9.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v9.cores } },
    { id: 'cpu_v10', name: 'Quantum-X Processor', category: 'hardware', description: 'Sub-atomic processing. Bypasses classical limits.', cost: GAME_CONFIG.HARDWARE.CPU.v10.cost, hardwareKey: 'cpu', stats: { level: 10, clockSpeed: GAME_CONFIG.HARDWARE.CPU.v10.clockSpeed, cores: GAME_CONFIG.HARDWARE.CPU.v10.cores } },

    // --- HARDWARE: RAM ---
    { id: 'ram_v1', name: '16MB SIMM', category: 'hardware', description: 'Standard memory for early 90s systems.', cost: GAME_CONFIG.HARDWARE.RAM.v1.cost, hardwareKey: 'ram', stats: { level: 1, capacity: GAME_CONFIG.HARDWARE.RAM.v1.capacity } },
    { id: 'ram_v2', name: '64MB EDO RAM', category: 'hardware', description: 'A little extra buffer for multitasking.', cost: GAME_CONFIG.HARDWARE.RAM.v2.cost, hardwareKey: 'ram', stats: { level: 2, capacity: GAME_CONFIG.HARDWARE.RAM.v2.capacity } },
    { id: 'ram_v3', name: '256MB SDRAM', category: 'hardware', description: 'Standard desktop memory for the late 90s.', cost: GAME_CONFIG.HARDWARE.RAM.v3.cost, hardwareKey: 'ram', stats: { level: 3, capacity: GAME_CONFIG.HARDWARE.RAM.v3.capacity } },
    { id: 'ram_v4', name: '1GB DDR', category: 'hardware', description: 'The sweet spot for early 2000s hacking.', cost: GAME_CONFIG.HARDWARE.RAM.v4.cost, hardwareKey: 'ram', stats: { level: 4, capacity: GAME_CONFIG.HARDWARE.RAM.v4.capacity } },
    { id: 'ram_v5', name: '4GB DDR2', category: 'hardware', description: 'High-speed memory for modern operatives.', cost: GAME_CONFIG.HARDWARE.RAM.v5.cost, hardwareKey: 'ram', stats: { level: 5, capacity: GAME_CONFIG.HARDWARE.RAM.v5.capacity } },
    { id: 'ram_v6', name: '8GB DDR3', category: 'hardware', description: 'Heavy multitasking and large file support.', cost: GAME_CONFIG.HARDWARE.RAM.v6.cost, hardwareKey: 'ram', stats: { level: 6, capacity: GAME_CONFIG.HARDWARE.RAM.v6.capacity } },
    { id: 'ram_v7', name: '16GB DDR4', category: 'hardware', description: 'Enterprise workstation memory.', cost: GAME_CONFIG.HARDWARE.RAM.v7.cost, hardwareKey: 'ram', stats: { level: 7, capacity: GAME_CONFIG.HARDWARE.RAM.v7.capacity } },
    { id: 'ram_v8', name: '32GB DDR4 High-Freq', category: 'hardware', description: 'No more swap files. Pure speed.', cost: GAME_CONFIG.HARDWARE.RAM.v8.cost, hardwareKey: 'ram', stats: { level: 8, capacity: GAME_CONFIG.HARDWARE.RAM.v8.capacity } },
    { id: 'ram_v9', name: '64GB DDR5', category: 'hardware', description: 'Massive data buffer for AI operations.', cost: GAME_CONFIG.HARDWARE.RAM.v9.cost, hardwareKey: 'ram', stats: { level: 9, capacity: GAME_CONFIG.HARDWARE.RAM.v9.capacity } },
    { id: 'ram_v10', name: '128GB HBM3', category: 'hardware', description: 'Total system saturation. Sub-nanosecond latency.', cost: GAME_CONFIG.HARDWARE.RAM.v10.cost, hardwareKey: 'ram', stats: { level: 10, capacity: GAME_CONFIG.HARDWARE.RAM.v10.capacity } },

    // --- HARDWARE: Storage ---
    { id: 'hd_v1', name: '40MB HDD', category: 'hardware', description: 'Small magnetic disk. Barely enough for an OS.', cost: GAME_CONFIG.HARDWARE.STORAGE.v1.cost, hardwareKey: 'storage', stats: { level: 1, capacity: GAME_CONFIG.HARDWARE.STORAGE.v1.capacity } },
    { id: 'hd_v2', name: '500MB HDD', category: 'hardware', description: 'Increased space for basic tools.', cost: GAME_CONFIG.HARDWARE.STORAGE.v2.cost, hardwareKey: 'storage', stats: { level: 2, capacity: GAME_CONFIG.HARDWARE.STORAGE.v2.capacity } },
    { id: 'hd_v3', name: '2GB HDD', category: 'hardware', description: 'Standard storage for mid-90s systems.', cost: GAME_CONFIG.HARDWARE.STORAGE.v3.cost, hardwareKey: 'storage', stats: { level: 3, capacity: GAME_CONFIG.HARDWARE.STORAGE.v3.capacity } },
    { id: 'hd_v4', name: '10GB HDD', category: 'hardware', description: 'Noticeable bump in loot capacity.', cost: GAME_CONFIG.HARDWARE.STORAGE.v4.cost, hardwareKey: 'storage', stats: { level: 4, capacity: GAME_CONFIG.HARDWARE.STORAGE.v4.capacity } },
    { id: 'hd_v5', name: '40GB HDD (7200 RPM)', category: 'hardware', description: 'The standard for early 2000s operatives.', cost: GAME_CONFIG.HARDWARE.STORAGE.v5.cost, hardwareKey: 'storage', stats: { level: 5, capacity: GAME_CONFIG.HARDWARE.STORAGE.v5.capacity } },
    { id: 'hd_v6', name: '120GB SSD (SATA)', category: 'hardware', description: 'High-speed solid state storage.', cost: GAME_CONFIG.HARDWARE.STORAGE.v6.cost, hardwareKey: 'storage', stats: { level: 6, capacity: GAME_CONFIG.HARDWARE.STORAGE.v6.capacity } },
    { id: 'hd_v7', name: '500GB NVMe SSD', category: 'hardware', description: 'Blazing fast data access.', cost: GAME_CONFIG.HARDWARE.STORAGE.v7.cost, hardwareKey: 'storage', stats: { level: 7, capacity: GAME_CONFIG.HARDWARE.STORAGE.v7.capacity } },
    { id: 'hd_v8', name: '1TB NVMe Gen4', category: 'hardware', description: 'Massive, high-speed storage.', cost: GAME_CONFIG.HARDWARE.STORAGE.v8.cost, hardwareKey: 'storage', stats: { level: 8, capacity: GAME_CONFIG.HARDWARE.STORAGE.v8.capacity } },
    { id: 'hd_v9', name: '4TB Enterprise SSD', category: 'hardware', description: 'Data hoarder paradise.', cost: GAME_CONFIG.HARDWARE.STORAGE.v9.cost, hardwareKey: 'storage', stats: { level: 9, capacity: GAME_CONFIG.HARDWARE.STORAGE.v9.capacity } },
    { id: 'hd_v10', name: '16TB Petabyte-Scale', category: 'hardware', description: 'Digital infinity. Store the entire net.', cost: GAME_CONFIG.HARDWARE.STORAGE.v10.cost, hardwareKey: 'storage', stats: { level: 10, capacity: GAME_CONFIG.HARDWARE.STORAGE.v10.capacity } },

    // --- HARDWARE: Cooling ---
    { id: 'cool_v1', name: 'Passive Heatsink', category: 'hardware', description: 'Basic aluminum fins. No active airflow.', cost: GAME_CONFIG.HARDWARE.COOLING.v1.cost, hardwareKey: 'cooling', stats: { level: 1, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v1.heatDissipation } },
    { id: 'cool_v2', name: '80mm Case Fan', category: 'hardware', description: 'Standard case fan. Minor airflow.', cost: GAME_CONFIG.HARDWARE.COOLING.v2.cost, hardwareKey: 'cooling', stats: { level: 2, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v2.heatDissipation } },
    { id: 'cool_v3', name: '120mm High-RPM Fan', category: 'hardware', description: 'Increased airflow for better cooling.', cost: GAME_CONFIG.HARDWARE.COOLING.v3.cost, hardwareKey: 'cooling', stats: { level: 3, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v3.heatDissipation } },
    { id: 'cool_v4', name: 'Copper Heat-Pipe Tower', category: 'hardware', description: 'Noticeable improvement in heat transfer.', cost: GAME_CONFIG.HARDWARE.COOLING.v4.cost, hardwareKey: 'cooling', stats: { level: 4, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v4.heatDissipation } },
    { id: 'cool_v5', name: 'Dual Fan Push-Pull', category: 'hardware', description: 'Efficient airflow for high-load systems.', cost: GAME_CONFIG.HARDWARE.COOLING.v5.cost, hardwareKey: 'cooling', stats: { level: 5, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v5.heatDissipation } },
    { id: 'cool_v6', name: 'AIO Liquid Cooler (120mm)', category: 'hardware', description: 'Self-contained water loop. Quiet and effective.', cost: GAME_CONFIG.HARDWARE.COOLING.v6.cost, hardwareKey: 'cooling', stats: { level: 6, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v6.heatDissipation } },
    { id: 'cool_v7', name: 'Custom Water Loop (360mm)', category: 'hardware', description: 'High-end cooling for serious overclocking.', cost: GAME_CONFIG.HARDWARE.COOLING.v7.cost, hardwareKey: 'cooling', stats: { level: 7, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v7.heatDissipation } },
    { id: 'cool_v8', name: 'Liquid Nitrogen Rig', category: 'hardware', description: 'Sub-zero cooling for extreme performance.', cost: GAME_CONFIG.HARDWARE.COOLING.v8.cost, hardwareKey: 'cooling', stats: { level: 8, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v8.heatDissipation } },
    { id: 'cool_v9', name: 'Phase-Change Chiller', category: 'hardware', description: 'Industrial-grade refrigeration.', cost: GAME_CONFIG.HARDWARE.COOLING.v9.cost, hardwareKey: 'cooling', stats: { level: 9, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v9.heatDissipation } },
    { id: 'cool_v10', name: 'Cryogenic Isolation Chamber', category: 'hardware', description: 'Absolute zero. No thermal limits.', cost: GAME_CONFIG.HARDWARE.COOLING.v10.cost, hardwareKey: 'cooling', stats: { level: 10, heatDissipation: GAME_CONFIG.HARDWARE.COOLING.v10.heatDissipation } },

    // --- HARDWARE: Network ---
    { id: 'net_v1', name: '14.4k Modem', category: 'hardware', description: 'The sound of the early net. Painfully slow.', cost: GAME_CONFIG.HARDWARE.NETWORK.v1.cost, hardwareKey: 'network', stats: { level: 1, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v1.bandwidth } },
    { id: 'net_v2', name: '56k V.90 Modem', category: 'hardware', description: 'The pinnacle of dial-up technology.', cost: GAME_CONFIG.HARDWARE.NETWORK.v2.cost, hardwareKey: 'network', stats: { level: 2, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v2.bandwidth } },
    { id: 'net_v3', name: 'ISDN Dual-Channel', category: 'hardware', description: 'Digital speed for the mid-90s.', cost: GAME_CONFIG.HARDWARE.NETWORK.v3.cost, hardwareKey: 'network', stats: { level: 3, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v3.bandwidth } },
    { id: 'net_v4', name: 'ADSL v1 (1.5Mbps)', category: 'hardware', description: 'Broadband access. No more busy signals.', cost: GAME_CONFIG.HARDWARE.NETWORK.v4.cost, hardwareKey: 'network', stats: { level: 4, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v4.bandwidth } },
    { id: 'net_v5', name: 'Cable Internet (10Mbps)', category: 'hardware', description: 'High-speed access for modern operatives.', cost: GAME_CONFIG.HARDWARE.NETWORK.v5.cost, hardwareKey: 'network', stats: { level: 5, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v5.bandwidth } },
    { id: 'net_v6', name: 'Fiber Optic (100Mbps)', category: 'hardware', description: 'Blazing fast downloads and low latency.', cost: GAME_CONFIG.HARDWARE.NETWORK.v6.cost, hardwareKey: 'network', stats: { level: 6, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v6.bandwidth } },
    { id: 'net_v7', name: 'Gigabit Fiber', category: 'hardware', description: 'Enterprise-grade connectivity.', cost: GAME_CONFIG.HARDWARE.NETWORK.v7.cost, hardwareKey: 'network', stats: { level: 7, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v7.bandwidth } },
    { id: 'net_v8', name: '10Gbps Dark Fiber', category: 'hardware', description: 'Direct backbone connection.', cost: GAME_CONFIG.HARDWARE.NETWORK.v8.cost, hardwareKey: 'network', stats: { level: 8, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v8.bandwidth } },
    { id: 'net_v9', name: 'Satellite-X Link', category: 'hardware', description: 'Global high-speed coverage.', cost: GAME_CONFIG.HARDWARE.NETWORK.v9.cost, hardwareKey: 'network', stats: { level: 9, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v9.bandwidth } },
    { id: 'net_v10', name: 'Quantum Entangled Stream', category: 'hardware', description: 'Instantaneous data transfer. Zero latency.', cost: GAME_CONFIG.HARDWARE.NETWORK.v10.cost, hardwareKey: 'network', stats: { level: 10, bandwidth: GAME_CONFIG.HARDWARE.NETWORK.v10.bandwidth } },

    // --- HARDWARE: Modules ---
    { id: 'crypt_accel_v1', name: 'Crypto Accelerator v1', category: 'hardware', description: 'Reduces CPU load of cracking tools by 15%.', cost: 15000 },
    { id: 'crypt_accel_v2', name: 'Crypto Accelerator v2', category: 'hardware', description: 'Reduces CPU load of cracking tools by 30%.', cost: 45000 },

    // --- THEMES ---
    { id: 'theme_amber', name: 'Amber Theme', category: 'consumable', description: 'A classic amber theme for your terminal.', cost: 1000 },
    { id: 'theme_cyan', name: 'Cyan Theme', category: 'consumable', description: 'A cool cyan theme for your terminal.', cost: 1000 },
    { id: 'theme_matrix', name: 'Matrix Theme', category: 'consumable', description: 'A green matrix-style theme.', cost: 1000 },
    { id: 'theme_classic', name: 'Classic Gray Theme', category: 'consumable', description: 'A retro gray theme.', cost: 1000 },

    // --- RANSOMWARE ---
    { id: 'ransom_t1', name: 'Script Kiddie Cryptor', category: 'exploit', tier: 1, description: 'Unstable, high detection. 10% Success | 0.4x Payout.', cost: 500, cpuReq: 10, ramReq: 32, storageSize: 5 },
    { id: 'ransom_t2', name: 'Basic-Batch-Locker', category: 'exploit', tier: 2, description: 'Simple script-based encryption. 15% Success | 0.6x Payout.', cost: 1500, cpuReq: 15, ramReq: 64, storageSize: 10 },
    { id: 'ransom_t3', name: 'Onion-Locker Lite', category: 'exploit', tier: 3, description: 'Standard TOR-based callback. 25% Success | 0.8x Payout.', cost: 4500, cpuReq: 20, ramReq: 128, storageSize: 25 },
    { id: 'ransom_t4', name: 'AES-256 Home Edition', category: 'exploit', tier: 4, description: 'Solid encryption, standard payout. 35% Success | 1.0x Payout.', cost: 12000, cpuReq: 25, ramReq: 256, storageSize: 50 },
    { id: 'ransom_t5', name: 'Bit-Locker Pro', category: 'exploit', tier: 5, description: 'Professional grade, harder to decrypt. 43% Success | 1.2x Payout.', cost: 30000, cpuReq: 30, ramReq: 512, storageSize: 100 },
    { id: 'ransom_t6', name: 'REvil-Clone v2', category: 'exploit', tier: 6, description: 'Advanced obfuscation and persistence. 55% Success | 1.5x Payout.', cost: 75000, cpuReq: 35, ramReq: 1024, storageSize: 250 },
    { id: 'ransom_t7', name: 'Dark-Side Enterprise', category: 'exploit', tier: 7, description: 'Includes automated negotiation bots. 65% Success | 1.8x Payout.', cost: 180000, cpuReq: 40, ramReq: 2048, storageSize: 500 },
    { id: 'ransom_t8', name: 'Conti-Elite Suite', category: 'exploit', tier: 8, description: 'Multi-threaded encryption, anti-VM checks. 75% Success | 2.2x Payout.', cost: 450000, cpuReq: 50, ramReq: 4096, storageSize: 1000 },
    { id: 'ransom_t9', name: 'LockBit 3.0 Platinum', category: 'exploit', tier: 9, description: 'Extremely fast, bypasses most EDR. 85% Success | 3.0x Payout.', cost: 1200000, cpuReq: 60, ramReq: 8192, storageSize: 2000 },
    { id: 'ransom_t10', name: 'State-Sponsored Zero-Day', category: 'exploit', tier: 10, description: 'The ultimate weapon. Untraceable. 90% Success | 5.0x Payout.', cost: 5000000, cpuReq: 10, ramReq: 512, storageSize: 50 },

    // --- SECURITY TOOLS ---
    { id: 'pgp-tool', name: 'PGP-Crypt Professional', category: 'security', tier: 2, description: 'Essential for deciphering high-level encrypted communications.', cost: 1200, cpuReq: 5, ramReq: 32, storageSize: 15 },
];
