import { Mission, MissionConfig } from '../types';
import { scenarios } from '../data/gameData';

class MissionGenerator {
    private getRandom<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    public generateMissions(reputation: number, count: number = 3): Mission[] {
        const missions: Mission[] = [];
        for (let i = 0; i < count; i++) {
            missions.push(this.generateSingleMission(reputation));
        }
        return missions;
    }

    private generateSingleMission(reputation: number): Mission {
        const scenarioIndex = Math.floor(Math.random() * scenarios.length);
        const scenario = scenarios[scenarioIndex];

        // Difficulty scales with reputation
        // rep 0-100 -> difficulty 1
        // rep 100-500 -> difficulty 2
        // rep 500-1500 -> difficulty 3
        // rep 1500-4000 -> difficulty 4
        // rep 4000+ -> difficulty 5
        let baseDifficulty: 1 | 2 | 3 | 4 | 5 = 1;
        if (reputation > 4000) baseDifficulty = 5;
        else if (reputation > 1500) baseDifficulty = 4;
        else if (reputation > 500) baseDifficulty = 3;
        else if (reputation > 100) baseDifficulty = 2;

        // Randomize difficulty slightly around base
        const rand = Math.random();
        let difficulty = baseDifficulty;
        if (rand > 0.8 && difficulty < 5) difficulty++;
        if (rand < 0.2 && difficulty > 1) difficulty--;

        const reward = difficulty * 500 + Math.floor(Math.random() * 200);

        // Mission titles based on scenario
        const titlePrefixes = ["Operation", "Project", "Task", "Heist", "Infiltration"];
        const titleSuffixes = ["Alpha", "Beta", "Omega", "Nexus", "Zero", "Prime"];
        const title = `${this.getRandom(titlePrefixes)} ${scenario.theme.split(' ')[0]} ${this.getRandom(titleSuffixes)}`.toUpperCase();

        const targetFileName = `SECRET_${Math.floor(Math.random() * 10000)}.dat`;
        const description = scenario.welcomeMessage(targetFileName);

        const config: MissionConfig = {
            scenarioIndex,
            numNodes: 2 + difficulty,
            targetFileName,
            difficultyMultiplier: difficulty
        };

        return {
            id: `mission_${Math.random().toString(36).substr(2, 9)}`,
            title,
            difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
            reward,
            description,
            targetNetworkConfig: config
        };
    }
}

export const missionGenerator = new MissionGenerator();
