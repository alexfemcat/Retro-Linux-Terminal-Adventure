import { MarketItem } from '../types';

export const MARKET_CATALOG: MarketItem[] = [
    // --- SOFTWARE: Tier 1 ---
    { id: 'ping', name: 'ping', category: 'utility', tier: 1, description: 'Network connectivity tester', cost: 100, cpuReq: 1, ramReq: 4, storageSize: 10 },
    { id: 'nmap-lite', name: 'nmap-lite', category: 'sniffing', tier: 1, description: 'Basic port scanner (Open/Closed only)', cost: 250, cpuReq: 5, ramReq: 16, storageSize: 30 },
    { id: 'brute-force.sh', name: 'brute-force.sh', category: 'exploit', tier: 1, description: 'Basic noisy brute-force script', cost: 400, cpuReq: 20, ramReq: 32, storageSize: 5 },

    // --- SOFTWARE: Tier 2 ---
    { id: 'nmap', name: 'nmap', category: 'sniffing', tier: 2, description: 'Standard network scanner with service detection', cost: 800, cpuReq: 10, ramReq: 64, storageSize: 90 },
    { id: 'hydra', name: 'hydra', category: 'exploit', tier: 2, description: 'Multi-threaded password brute-force tool', cost: 1500, cpuReq: 25, ramReq: 128, storageSize: 60 },
    { id: 'ssh-crack-v1', name: 'ssh-crack-v1', category: 'exploit', tier: 2, description: 'Specialized SSH credential harvester', cost: 2000, cpuReq: 15, ramReq: 96, storageSize: 40 },
    { id: 'overclock', name: 'overclock', category: 'utility', tier: 2, description: 'Unlock CPU frequency controls and voltage scaling.', cost: 1200, cpuReq: 2, ramReq: 8, storageSize: 20 },

    // --- SOFTWARE: Tier 3 ---
    { id: 'sqlmap', name: 'sqlmap', category: 'exploit', tier: 3, description: 'Automatic SQL injection and database takeover tool', cost: 5000, cpuReq: 30, ramReq: 256, storageSize: 160 },
    { id: 'john', name: 'john', category: 'exploit', tier: 3, description: 'Offline password hash cracker', cost: 4500, cpuReq: 80, ramReq: 512, storageSize: 120 },
    { id: 'proxy-tunnel', name: 'proxy-tunnel', category: 'utility', tier: 3, description: 'Encrypted traffic tunneling to hide origin', cost: 3500, cpuReq: 5, ramReq: 128, storageSize: 50 },

    // --- SOFTWARE: Tier 4 ---
    { id: 'msfconsole', name: 'msfconsole', category: 'exploit', tier: 4, description: 'Advanced exploitation framework', cost: 15000, cpuReq: 50, ramReq: 1024, storageSize: 1000 },
    { id: 'dist-crack', name: 'dist-crack', category: 'exploit', tier: 4, description: 'Coordinated multi-node brute force attack', cost: 25000, cpuReq: 40, ramReq: 2048, storageSize: 300 },

    // --- SOFTWARE: Tier 5 ---
    { id: '0day-pack', name: '0day-pack', category: 'exploit', tier: 5, description: 'Instant-access exploit for specific OS versions', cost: 100000, cpuReq: 10, ramReq: 512, storageSize: 20 },
    { id: 'neuro-crack', name: 'neuro-crack', category: 'exploit', tier: 5, description: 'AI-driven heuristic encryption bypass', cost: 250000, cpuReq: 95, ramReq: 4096, storageSize: 2400 },
    { id: 'nmap-pro', name: 'nmap-pro', category: 'sniffing', tier: 4, description: 'Advanced OS fingerprinting and version detection.', cost: 8000, cpuReq: 20, ramReq: 256, storageSize: 240 },

    // --- CONSUMABLES ---
    { id: 'proxy_list', name: 'Disposable Proxy List', category: 'consumable', description: 'One-time use proxy chain (5 uses)', cost: 500 },
    { id: 'vpn_tunnel', name: 'Encrypted VPN Tunnel', category: 'consumable', description: 'Masks identity for 1 mission', cost: 1200 },
    { id: 'wordlist_small', name: 'Common Passwords (Small)', category: 'consumable', description: 'Small wordlist for hydra', cost: 200 },
    { id: 'wordlist_big', name: 'RockYou.txt (Modified)', category: 'consumable', description: 'Massive wordlist for hydra', cost: 1000 },

    // --- HARDWARE: CPU ---
    { id: 'cpu_v2', name: 'CPU v2 (1.1GHz)', category: 'hardware', description: 'Minor clock adjustment.', cost: 250, hardwareKey: 'cpu', stats: { level: 2, clockSpeed: 1.1, cores: 1 } },
    { id: 'cpu_v3', name: 'CPU v3 (1.2GHz)', category: 'hardware', description: 'Slightly faster cycles.', cost: 600, hardwareKey: 'cpu', stats: { level: 3, clockSpeed: 1.2, cores: 1 } },
    { id: 'cpu_v4', name: 'CPU v4 (1.4GHz)', category: 'hardware', description: 'Noticeable performance bump.', cost: 1400, hardwareKey: 'cpu', stats: { level: 4, clockSpeed: 1.4, cores: 1 } },
    { id: 'cpu_v5', name: 'CPU v5 (1.6GHz)', category: 'hardware', description: 'Efficient single-core processor.', cost: 2800, hardwareKey: 'cpu', stats: { level: 5, clockSpeed: 1.6, cores: 1 } },
    { id: 'cpu_v6', name: 'CPU v6 (1.8GHz)', category: 'hardware', description: 'High-end single-core chip.', cost: 5500, hardwareKey: 'cpu', stats: { level: 6, clockSpeed: 1.8, cores: 1 } },
    { id: 'cpu_v7', name: 'CPU v7 (2.0GHz Dual)', category: 'hardware', description: 'Multi-core architecture. 2x thread capacity.', cost: 12000, hardwareKey: 'cpu', stats: { level: 7, clockSpeed: 2.0, cores: 2 } },
    { id: 'cpu_v8', name: 'CPU v8 (2.5GHz Dual)', category: 'hardware', description: 'Overclock-stable dual-core.', cost: 25000, hardwareKey: 'cpu', stats: { level: 8, clockSpeed: 2.5, cores: 2 } },
    { id: 'cpu_v9', name: 'CPU v9 (3.2GHz Quad)', category: 'hardware', description: 'Workstation grade quad-core.', cost: 60000, hardwareKey: 'cpu', stats: { level: 9, clockSpeed: 3.2, cores: 4 } },
    { id: 'cpu_v10', name: 'CPU v10 (Quantum)', category: 'hardware', description: 'Sub-atomic processing. Pure dominance.', cost: 150000, hardwareKey: 'cpu', stats: { level: 10, clockSpeed: 5.0, cores: 8 } },

    // --- HARDWARE: RAM ---
    { id: 'ram_v2', name: 'RAM 5GB', category: 'hardware', description: 'A little extra buffer.', cost: 200, hardwareKey: 'ram', stats: { level: 2, capacity: 5 } },
    { id: 'ram_v3', name: 'RAM 6GB', category: 'hardware', description: 'Standard desktop memory.', cost: 500, hardwareKey: 'ram', stats: { level: 3, capacity: 6 } },
    { id: 'ram_v4', name: 'RAM 8GB', category: 'hardware', description: 'The sweet spot for hacking.', cost: 1200, hardwareKey: 'ram', stats: { level: 4, capacity: 8 } },
    { id: 'ram_v5', name: 'RAM 12GB', category: 'hardware', description: 'Triple-channel high speed.', cost: 3000, hardwareKey: 'ram', stats: { level: 5, capacity: 12 } },
    { id: 'ram_v6', name: 'RAM 16GB', category: 'hardware', description: 'Heavy multitasking support.', cost: 7000, hardwareKey: 'ram', stats: { level: 6, capacity: 16 } },
    { id: 'ram_v7', name: 'RAM 24GB', category: 'hardware', description: 'Enterprise workstation memory.', cost: 15000, hardwareKey: 'ram', stats: { level: 7, capacity: 24 } },
    { id: 'ram_v8', name: 'RAM 32GB', category: 'hardware', description: 'No more swap files.', cost: 35000, hardwareKey: 'ram', stats: { level: 8, capacity: 32 } },
    { id: 'ram_v9', name: 'RAM 64GB', category: 'hardware', description: 'Massive data buffer.', cost: 80000, hardwareKey: 'ram', stats: { level: 9, capacity: 64 } },
    { id: 'ram_v10', name: 'RAM 128GB', category: 'hardware', description: 'Total system saturation.', cost: 200000, hardwareKey: 'ram', stats: { level: 10, capacity: 128 } },

    // --- HARDWARE: Storage ---
    { id: 'hd_v2', name: 'Storage 2GB', category: 'hardware', description: 'Small magnetic disk.', cost: 150, hardwareKey: 'storage', stats: { level: 2, capacity: 2 } },
    { id: 'hd_v3', name: 'Storage 4GB', category: 'hardware', description: 'Increased loot space.', cost: 400, hardwareKey: 'storage', stats: { level: 3, capacity: 4 } },
    { id: 'hd_v4', name: 'Storage 8GB', category: 'hardware', description: 'Double density platter.', cost: 1000, hardwareKey: 'storage', stats: { level: 4, capacity: 8 } },
    { id: 'hd_v5', name: 'Storage 16GB', category: 'hardware', description: 'The standard for operatives.', cost: 2500, hardwareKey: 'storage', stats: { level: 5, capacity: 16 } },
    { id: 'hd_v6', name: 'Storage 32GB', category: 'hardware', description: 'High-speed SCSI drive.', cost: 6000, hardwareKey: 'storage', stats: { level: 6, capacity: 32 } },
    { id: 'hd_v7', name: 'Storage 64GB', category: 'hardware', description: 'Solid state hybrid.', cost: 14000, hardwareKey: 'storage', stats: { level: 7, capacity: 64 } },
    { id: 'hd_v8', name: 'Storage 128GB', category: 'hardware', description: 'Full SSD upgrade.', cost: 30000, hardwareKey: 'storage', stats: { level: 8, capacity: 128 } },
    { id: 'hd_v9', name: 'Storage 512GB', category: 'hardware', description: 'Data hoarder paradise.', cost: 75000, hardwareKey: 'storage', stats: { level: 9, capacity: 512 } },
    { id: 'hd_v10', name: 'Storage 2TB', category: 'hardware', description: 'Digital infinity.', cost: 180000, hardwareKey: 'storage', stats: { level: 10, capacity: 2048 } },

    // --- HARDWARE: Cooling ---
    { id: 'cool_v2', name: 'Cooling v2 (1.1x)', category: 'hardware', description: 'Standard case fan.', cost: 200, hardwareKey: 'cooling', stats: { level: 2, heatDissipation: 1.1 } },
    { id: 'cool_v3', name: 'Cooling v3 (1.2x)', category: 'hardware', description: 'High-RPM fan.', cost: 500, hardwareKey: 'cooling', stats: { level: 3, heatDissipation: 1.2 } },
    { id: 'cool_v4', name: 'Cooling v4 (1.4x)', category: 'hardware', description: 'Copper heat pipes.', cost: 1200, hardwareKey: 'cooling', stats: { level: 4, heatDissipation: 1.4 } },
    { id: 'cool_v5', name: 'Cooling v5 (1.7x)', category: 'hardware', description: 'Dual fan array.', cost: 3000, hardwareKey: 'cooling', stats: { level: 5, heatDissipation: 1.7 } },
    { id: 'cool_v6', name: 'Cooling v6 (2.0x)', category: 'hardware', description: 'Industrial airflow.', cost: 7000, hardwareKey: 'cooling', stats: { level: 6, heatDissipation: 2.0 } },
    { id: 'cool_v7', name: 'Cooling v7 (2.5x)', category: 'hardware', description: 'Self-contained water loop.', cost: 15000, hardwareKey: 'cooling', stats: { level: 7, heatDissipation: 2.5 } },
    { id: 'cool_v8', name: 'Cooling v8 (3.2x)', category: 'hardware', description: 'Custom liquid nitrogen rig.', cost: 35000, hardwareKey: 'cooling', stats: { level: 8, heatDissipation: 3.2 } },
    { id: 'cool_v9', name: 'Cooling v9 (4.0x)', category: 'hardware', description: 'Phase-change cooling.', cost: 80000, hardwareKey: 'cooling', stats: { level: 9, heatDissipation: 4.0 } },
    { id: 'cool_v10', name: 'Cooling v10 (Cryo)', category: 'hardware', description: 'Absolute zero isolation.', cost: 200000, hardwareKey: 'cooling', stats: { level: 10, heatDissipation: 6.0 } },

    // --- HARDWARE: Network ---
    { id: 'net_v2', name: 'Net 15MBps', category: 'hardware', description: 'Filtered copper lines.', cost: 150, hardwareKey: 'network', stats: { level: 2, bandwidth: 15 } },
    { id: 'net_v3', name: 'Net 25MBps', category: 'hardware', description: 'Optimized routing.', cost: 400, hardwareKey: 'network', stats: { level: 3, bandwidth: 25 } },
    { id: 'net_v4', name: 'Net 50MBps', category: 'hardware', description: 'Dual-bonded DSL.', cost: 1000, hardwareKey: 'network', stats: { level: 4, bandwidth: 50 } },
    { id: 'net_v5', name: 'Net 100MBps', category: 'hardware', description: 'Business grade fiber.', cost: 2500, hardwareKey: 'network', stats: { level: 5, bandwidth: 100 } },
    { id: 'net_v6', name: 'Net 250MBps', category: 'hardware', description: 'High-speed satellite link.', cost: 6000, hardwareKey: 'network', stats: { level: 6, bandwidth: 250 } },
    { id: 'net_v7', name: 'Net 500MBps', category: 'hardware', description: 'Dedicated T1 line.', cost: 14000, hardwareKey: 'network', stats: { level: 7, bandwidth: 500 } },
    { id: 'net_v8', name: 'Net 1Gbps', category: 'hardware', description: 'Gigabit fiber optic.', cost: 30000, hardwareKey: 'network', stats: { level: 8, bandwidth: 1000 } },
    { id: 'net_v9', name: 'Net 10Gbps', category: 'hardware', description: 'Dark fiber backbone.', cost: 75000, hardwareKey: 'network', stats: { level: 9, bandwidth: 10000 } },
    { id: 'net_v10', name: 'Net Quantum', category: 'hardware', description: 'Entangled data stream.', cost: 180000, hardwareKey: 'network', stats: { level: 10, bandwidth: 99999 } },

    // --- HARDWARE: Modules ---
    { id: 'crypt_accel_v1', name: 'Crypto Accelerator v1', category: 'hardware', description: 'Reduces CPU load of cracking tools by 15%', cost: 5000 },
    { id: 'crypt_accel_v2', name: 'Crypto Accelerator v2', category: 'hardware', description: 'Reduces CPU load of cracking tools by 30%', cost: 12000 },

    // --- THEMES ---
    { id: 'theme_amber', name: 'Amber Theme', category: 'consumable', description: 'A classic amber theme for your terminal.', cost: 500 },
    { id: 'theme_cyan', name: 'Cyan Theme', category: 'consumable', description: 'A cool cyan theme for your terminal.', cost: 500 },
    { id: 'theme_matrix', name: 'Matrix Theme', category: 'consumable', description: 'A green matrix-style theme.', cost: 500 },
    { id: 'theme_classic', name: 'Classic Gray Theme', category: 'consumable', description: 'A retro gray theme.', cost: 500 },
];
