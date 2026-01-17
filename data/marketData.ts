import { HardwareSpecs } from '../types';

export interface MarketItem {
    id: string;
    name: string;
    type: 'software' | 'hardware';
    description: string;
    cost: number;
    // For hardware upgrades
    hardwareKey?: keyof HardwareSpecs;
    stats?: any;
}

export const MARKET_CATALOG: MarketItem[] = [
    // Software
    { id: 'ping', name: 'ping', type: 'software', description: 'Network connectivity tester', cost: 100 },
    { id: 'nmap', name: 'nmap', type: 'software', description: 'Advanced network scanner', cost: 500 },
    { id: 'hydra', name: 'hydra', type: 'software', description: 'Password brute-force tool', cost: 1500 },
    { id: 'overclock', name: 'overclock', type: 'software', description: 'Unlock CPU frequency controls and voltage scaling.', cost: 1200 },

    // Hardware Upgrades
    // CPU: Level 1 to 10
    { id: 'cpu_v2', name: 'CPU v2 (1.1GHz)', type: 'hardware', description: 'Minor clock adjustment.', cost: 250, hardwareKey: 'cpu', stats: { level: 2, clockSpeed: 1.1, cores: 1 } },
    { id: 'cpu_v3', name: 'CPU v3 (1.2GHz)', type: 'hardware', description: 'Slightly faster cycles.', cost: 600, hardwareKey: 'cpu', stats: { level: 3, clockSpeed: 1.2, cores: 1 } },
    { id: 'cpu_v4', name: 'CPU v4 (1.4GHz)', type: 'hardware', description: 'Noticeable performance bump.', cost: 1400, hardwareKey: 'cpu', stats: { level: 4, clockSpeed: 1.4, cores: 1 } },
    { id: 'cpu_v5', name: 'CPU v5 (1.6GHz)', type: 'hardware', description: 'Efficient single-core processor.', cost: 2800, hardwareKey: 'cpu', stats: { level: 5, clockSpeed: 1.6, cores: 1 } },
    { id: 'cpu_v6', name: 'CPU v6 (1.8GHz)', type: 'hardware', description: 'High-end single-core chip.', cost: 5500, hardwareKey: 'cpu', stats: { level: 6, clockSpeed: 1.8, cores: 1 } },
    { id: 'cpu_v7', name: 'CPU v7 (2.0GHz Dual)', type: 'hardware', description: 'Multi-core architecture. 2x thread capacity.', cost: 12000, hardwareKey: 'cpu', stats: { level: 7, clockSpeed: 2.0, cores: 2 } },
    { id: 'cpu_v8', name: 'CPU v8 (2.5GHz Dual)', type: 'hardware', description: 'Overclock-stable dual-core.', cost: 25000, hardwareKey: 'cpu', stats: { level: 8, clockSpeed: 2.5, cores: 2 } },
    { id: 'cpu_v9', name: 'CPU v9 (3.2GHz Quad)', type: 'hardware', description: 'Workstation grade quad-core.', cost: 60000, hardwareKey: 'cpu', stats: { level: 9, clockSpeed: 3.2, cores: 4 } },
    { id: 'cpu_v10', name: 'CPU v10 (Quantum)', type: 'hardware', description: 'Sub-atomic processing. Pure dominance.', cost: 150000, hardwareKey: 'cpu', stats: { level: 10, clockSpeed: 5.0, cores: 8 } },

    // RAM: Level 1 to 10
    { id: 'ram_v2', name: 'RAM 5GB', type: 'hardware', description: 'A little extra buffer.', cost: 200, hardwareKey: 'ram', stats: { level: 2, capacity: 5 } },
    { id: 'ram_v3', name: 'RAM 6GB', type: 'hardware', description: 'Standard desktop memory.', cost: 500, hardwareKey: 'ram', stats: { level: 3, capacity: 6 } },
    { id: 'ram_v4', name: 'RAM 8GB', type: 'hardware', description: 'The sweet spot for hacking.', cost: 1200, hardwareKey: 'ram', stats: { level: 4, capacity: 8 } },
    { id: 'ram_v5', name: 'RAM 12GB', type: 'hardware', description: 'Triple-channel high speed.', cost: 3000, hardwareKey: 'ram', stats: { level: 5, capacity: 12 } },
    { id: 'ram_v6', name: 'RAM 16GB', type: 'hardware', description: 'Heavy multitasking support.', cost: 7000, hardwareKey: 'ram', stats: { level: 6, capacity: 16 } },
    { id: 'ram_v7', name: 'RAM 24GB', type: 'hardware', description: 'Enterprise workstation memory.', cost: 15000, hardwareKey: 'ram', stats: { level: 7, capacity: 24 } },
    { id: 'ram_v8', name: 'RAM 32GB', type: 'hardware', description: 'No more swap files.', cost: 35000, hardwareKey: 'ram', stats: { level: 8, capacity: 32 } },
    { id: 'ram_v9', name: 'RAM 64GB', type: 'hardware', description: 'Massive data buffer.', cost: 80000, hardwareKey: 'ram', stats: { level: 9, capacity: 64 } },
    { id: 'ram_v10', name: 'RAM 128GB', type: 'hardware', description: 'Total system saturation.', cost: 200000, hardwareKey: 'ram', stats: { level: 10, capacity: 128 } },

    // Storage: Level 1 to 10
    { id: 'hd_v2', name: 'Storage 2GB', type: 'hardware', description: 'Small magnetic disk.', cost: 150, hardwareKey: 'storage', stats: { level: 2, capacity: 2 } },
    { id: 'hd_v3', name: 'Storage 4GB', type: 'hardware', description: 'Increased loot space.', cost: 400, hardwareKey: 'storage', stats: { level: 3, capacity: 4 } },
    { id: 'hd_v4', name: 'Storage 8GB', type: 'hardware', description: 'Double density platter.', cost: 1000, hardwareKey: 'storage', stats: { level: 4, capacity: 8 } },
    { id: 'hd_v5', name: 'Storage 16GB', type: 'hardware', description: 'The standard for operatives.', cost: 2500, hardwareKey: 'storage', stats: { level: 5, capacity: 16 } },
    { id: 'hd_v6', name: 'Storage 32GB', type: 'hardware', description: 'High-speed SCSI drive.', cost: 6000, hardwareKey: 'storage', stats: { level: 6, capacity: 32 } },
    { id: 'hd_v7', name: 'Storage 64GB', type: 'hardware', description: 'Solid state hybrid.', cost: 14000, hardwareKey: 'storage', stats: { level: 7, capacity: 64 } },
    { id: 'hd_v8', name: 'Storage 128GB', type: 'hardware', description: 'Full SSD upgrade.', cost: 30000, hardwareKey: 'storage', stats: { level: 8, capacity: 128 } },
    { id: 'hd_v9', name: 'Storage 512GB', type: 'hardware', description: 'Data hoarder paradise.', cost: 75000, hardwareKey: 'storage', stats: { level: 9, capacity: 512 } },
    { id: 'hd_v10', name: 'Storage 2TB', type: 'hardware', description: 'Digital infinity.', cost: 180000, hardwareKey: 'storage', stats: { level: 10, capacity: 2048 } },

    // Cooling: Level 1 to 10
    { id: 'cool_v2', name: 'Cooling v2 (1.1x)', type: 'hardware', description: 'Standard case fan.', cost: 200, hardwareKey: 'cooling', stats: { level: 2, heatDissipation: 1.1 } },
    { id: 'cool_v3', name: 'Cooling v3 (1.2x)', type: 'hardware', description: 'High-RPM fan.', cost: 500, hardwareKey: 'cooling', stats: { level: 3, heatDissipation: 1.2 } },
    { id: 'cool_v4', name: 'Cooling v4 (1.4x)', type: 'hardware', description: 'Copper heat pipes.', cost: 1200, hardwareKey: 'cooling', stats: { level: 4, heatDissipation: 1.4 } },
    { id: 'cool_v5', name: 'Cooling v5 (1.7x)', type: 'hardware', description: 'Dual fan array.', cost: 3000, hardwareKey: 'cooling', stats: { level: 5, heatDissipation: 1.7 } },
    { id: 'cool_v6', name: 'Cooling v6 (2.0x)', type: 'hardware', description: 'Industrial airflow.', cost: 7000, hardwareKey: 'cooling', stats: { level: 6, heatDissipation: 2.0 } },
    { id: 'cool_v7', name: 'Cooling v7 (2.5x)', type: 'hardware', description: 'Self-contained water loop.', cost: 15000, hardwareKey: 'cooling', stats: { level: 7, heatDissipation: 2.5 } },
    { id: 'cool_v8', name: 'Cooling v8 (3.2x)', type: 'hardware', description: 'Custom liquid nitrogen rig.', cost: 35000, hardwareKey: 'cooling', stats: { level: 8, heatDissipation: 3.2 } },
    { id: 'cool_v9', name: 'Cooling v9 (4.0x)', type: 'hardware', description: 'Phase-change cooling.', cost: 80000, hardwareKey: 'cooling', stats: { level: 9, heatDissipation: 4.0 } },
    { id: 'cool_v10', name: 'Cooling v10 (Cryo)', type: 'hardware', description: 'Absolute zero isolation.', cost: 200000, hardwareKey: 'cooling', stats: { level: 10, heatDissipation: 6.0 } },

    // Network: Level 1 to 10
    { id: 'net_v2', name: 'Net 15MBps', type: 'hardware', description: 'Filtered copper lines.', cost: 150, hardwareKey: 'network', stats: { level: 2, bandwidth: 15 } },
    { id: 'net_v3', name: 'Net 25MBps', type: 'hardware', description: 'Optimized routing.', cost: 400, hardwareKey: 'network', stats: { level: 3, bandwidth: 25 } },
    { id: 'net_v4', name: 'Net 50MBps', type: 'hardware', description: 'Dual-bonded DSL.', cost: 1000, hardwareKey: 'network', stats: { level: 4, bandwidth: 50 } },
    { id: 'net_v5', name: 'Net 100MBps', type: 'hardware', description: 'Business grade fiber.', cost: 2500, hardwareKey: 'network', stats: { level: 5, bandwidth: 100 } },
    { id: 'net_v6', name: 'Net 250MBps', type: 'hardware', description: 'High-speed satellite link.', cost: 6000, hardwareKey: 'network', stats: { level: 6, bandwidth: 250 } },
    { id: 'net_v7', name: 'Net 500MBps', type: 'hardware', description: 'Dedicated T1 line.', cost: 14000, hardwareKey: 'network', stats: { level: 7, bandwidth: 500 } },
    { id: 'net_v8', name: 'Net 1Gbps', type: 'hardware', description: 'Gigabit fiber optic.', cost: 30000, hardwareKey: 'network', stats: { level: 8, bandwidth: 1000 } },
    { id: 'net_v9', name: 'Net 10Gbps', type: 'hardware', description: 'Dark fiber backbone.', cost: 75000, hardwareKey: 'network', stats: { level: 9, bandwidth: 10000 } },
    { id: 'net_v10', name: 'Net Quantum', type: 'hardware', description: 'Entangled data stream.', cost: 180000, hardwareKey: 'network', stats: { level: 10, bandwidth: 99999 } },
];
