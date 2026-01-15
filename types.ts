export interface File {
  type: 'file';
  name: string;
  content: string;
  permissions?: 'user' | 'root';
  isEncrypted?: boolean;
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
  currentUser: 'user' | 'root';
  rootPassword?: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
