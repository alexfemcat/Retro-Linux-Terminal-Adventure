export interface EncryptionRequirement {
  type: 'pid' | 'time' | 'env';
  targetValue: string | number;
  hint?: string;
  transformation?: {
    type: 'offset' | 'slice';
    value: number | [number, number];
  };
}

export interface File {
  type: 'file';
  name: string;
  content: string;
  permissions?: 'user' | 'root';
  isEncrypted?: boolean;
  encryption?: {
    requirements: EncryptionRequirement[];
    isBoss?: boolean;
  };
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
  objectiveFileNameOptions: string[];
  objectiveFileContent: string;
  clueTemplate: (hint: string) => string;
  starterClueTemplate: (discoveryArea: string) => string;
  clueFileNameOptions: string[];
  distractionFiles: { [name: string]: string };
  distractionDirs: string[];
}

export interface GameObjective {
  filePath: string[];
  fileName: string;
}

export interface Process {
  pid: number;
  name: string;
  user: 'root' | 'user' | 'system';
  cpu: number;
  mem: number;
  start: string;
  command: string;
  theme: string;
}

export interface GameState {
  vfs: Directory;
  objective: GameObjective;
  scenario: Scenario & { welcomeMessage: string };
  clueFile: {
    name: string;
    content: string;
  };
  discoveryClue?: {
    path: string[];
    name: string;
  };
  starterArchetype?: 'note' | 'alias' | 'mail' | 'history' | 'motd' | 'crash' | 'cron' | 'ssh';
  pwdDeliveryType?: 'note' | 'encrypted' | 'grep' | 'split';
  pwdHintLocation?: {
    path: string[];
    name: string;
  };
  currentUser: 'user' | 'root';
  rootPassword?: string;

  // System State
  bootTime: number; // Timestamp
  processes: Process[];
  envVars: Record<string, string>;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
