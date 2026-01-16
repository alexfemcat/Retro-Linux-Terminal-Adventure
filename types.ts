export interface File {
  type: 'file';
  name: string;
  content: string;
  permissions?: 'user' | 'root';
}

export interface Directory {
  type: 'directory';
  name: string;
  children: { [name: string]: File | Directory };
  permissions?: 'user' | 'root';
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

  isDiscovered: boolean;
  rootPassword?: string;
  currentUser: 'user' | 'root';
}

export type WinCondition =
  | { type: 'file_found'; nodeId: string; path: string[] }
  | { type: 'root_access'; nodeId: string }
  | { type: 'process_killed'; nodeId: string; processName: string };

export interface GameState {
  nodes: NetworkNode[];
  activeNodeIndex: number;
  winCondition: WinCondition;

  // Meta
  scenario: Omit<Scenario, 'welcomeMessage'> & { welcomeMessage: string };
  bootTime: number; // Global start time
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

export interface PlayerState {
  credits: number;
  reputation: number; // XP / Security Clearance
  installedSoftware: string[]; // List of binary IDs/names
  inventory: VFSNode[]; // Stolen files/items
  hardware: HardwareSpecs;
  activeMissionId: string | null;
}

export interface SaveSlot {
  id: string;
  isEmpty: boolean;
  playerState?: PlayerState; // Optional, present if not empty
}

export interface DatabaseSchema {
  meta: {
    version: string;
  };
  saves: {
    [key: string]: SaveSlot;
  };
}
