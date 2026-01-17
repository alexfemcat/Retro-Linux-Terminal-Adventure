export interface File {
  type: 'file';
  name: string;
  content: string;
  permissions?: 'user' | 'root';
  size: number; // in KB
}

export interface Directory {
  type: 'directory';
  name: string;
  children: { [name: string]: File | Directory };
  permissions?: 'user' | 'root';
  size: number; // in KB
}

export type VFSNode = File | Directory;

export interface Scenario {
  theme: string;
  welcomeMessage: (fileName: string) => string;
  clueTemplate: (hint: string) => string;
  starterClueTemplate: (discoveryArea: string) => string;
  clueFileNameOptions: string[];
  distractionFiles: { [name: string]: string };
  distractionDirs: string[];
}

export interface Process {
  pid: number;
  name: string;
  user: 'root' | 'user' | 'system';
  cpu: number;
  mem: number;
  start: string;
  command: string;
}

export interface NetworkPort {
  port: number;
  service: string;
  version: string;
  isOpen: boolean;
}

export type VulnerabilityType = 'ssh' | 'service' | 'db' | 'kernel';

export interface Vulnerability {
  type: VulnerabilityType;
  level: 1 | 2 | 3 | 4 | 5;
  entryPoint: string;
  hint: string;
  isExploited: boolean;
}

export interface NetworkNode {
  id: string;
  hostname: string;
  ip: string;
  osVersion: string;
  themeColor: string; // e.g., 'text-green-400', 'text-amber-400'

  vfs: Directory;
  processes: Process[];
  envVars: Record<string, string>;
  ports: NetworkPort[];
  vulnerabilities: Vulnerability[];

  isDiscovered: boolean;
  rootPassword?: string;
  currentUser: 'user' | 'root';
}

export type WinCondition =
  | { type: 'file_found'; nodeId: string; path: string[] }
  | { type: 'root_access'; nodeId: string }
  | { type: 'process_killed'; nodeId: string; processName: string }
  | { type: 'file_modified'; nodeId: string; path: string[]; targetContent: string };

export interface GameState {
  nodes: NetworkNode[];
  activeNodeIndex: number;
  winCondition: WinCondition;

  // Meta
  scenario: Omit<Scenario, 'welcomeMessage'> & { welcomeMessage: string };
  bootTime: number; // Global start time

  // Phase 3 Mission Engine
  traceProgress: number; // 0-100
  isTraceActive: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface HardwareSpecs {
  cpu: { id: string; level: number; clockSpeed: number; cores: number };
  ram: { id: string; level: number; capacity: number };
  network: { id: string; level: number; bandwidth: number };
  storage: { id: string; level: number; capacity: number };
  cooling: { id: string; level: number; heatDissipation: number };
}

export type MarketItemCategory = 'utility' | 'exploit' | 'sniffing' | 'hardware' | 'consumable';

export interface SoftwareItem {
  id: string;
  name: string;
  category: 'utility' | 'exploit' | 'sniffing';
  tier: number;
  cpuReq: number; // Percentage of 1 core (0-100)
  ramReq: number; // Memory in MB
  storageSize: number; // Size in MB
  description: string;
  cost: number;
  reputationReq?: number;
}

export interface HardwareModule {
  id: string;
  name: string;
  category: 'hardware';
  description: string;
  cost: number;
  hardwareKey?: keyof HardwareSpecs;
  stats?: any;
}

export interface ConsumableItem {
  id: string;
  name: string;
  category: 'consumable';
  description: string;
  cost: number;
  maxUses?: number;
}

export type MarketItem = SoftwareItem | HardwareModule | ConsumableItem;

export interface Mission {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  reward: number;
  description: string;
  // Parameters to feed into the Network Generator
  targetNetworkConfig: MissionConfig;
}

export interface MissionConfig {
  scenarioIndex?: number; // Index in scenarios array
  numNodes?: number;
  targetFileName?: string;
  difficultyMultiplier?: number;
  winConditionType?: 'file_found' | 'root_access' | 'process_killed' | 'file_modified';
}

export interface PlayerState {
  version: string;
  credits: number;
  reputation: number; // XP / Security Clearance
  installedSoftware: string[]; // List of binary IDs/names
  inventory: VFSNode[]; // Stolen files/items
  missionInventory?: VFSNode[]; // Stolen files/items during a mission
  hardware: HardwareSpecs;
  activeMissionId: string | null;
  tutorialStep?: number;
  availableMissions: Mission[];
  // Phase 4 Hardware Simulation
  systemHeat: number;
  isOverclocked: boolean;
  voltageLevel: number; // 1.0 to 1.5
  isDevMode?: boolean;
  theme?: string;
  themes?: string[];
  settings?: {
    scanlines?: boolean;
    flicker?: boolean;
    chromaticAberration?: boolean;
    fontSize?: number;
    contrast?: 'high' | 'normal';
    disableJitter?: boolean;
    historyLength?: number;
    scale?: number;
  }
}

export interface SaveSlot {
  id: string;
  isEmpty: boolean;
  playerState?: PlayerState; // Optional, present if not empty
  updatedAt?: string; // ISO timestamp
}

export interface DatabaseSchema {
  meta: {
    version: string;
  };
  saves: {
    [key: string]: SaveSlot;
  };
}
