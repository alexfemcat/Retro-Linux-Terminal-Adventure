
export interface File {
  type: 'file';
  name: string;
  content: string;
}

export interface Directory {
  type: 'directory';
  name: string;
  children: { [name: string]: File | Directory };
}

export type VFSNode = File | Directory;

export interface Scenario {
  theme: string;
  welcomeMessage: string;
  objectiveFileNameOptions: string[];
  objectiveFileContent: string;
  clueTemplate: (hint: string) => string;
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
  scenario: Scenario;
  clueFile: {
    name: string;
    content: string;
  };
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}
