import { Mission, MissionConfig, GameState } from '../types';
import { scenarios, sensitiveFilenames, holidayEvents } from '../data/gameData';
import { GAME_CONFIG } from '../data/gameConfig';

class MissionGenerator {
    private getRandom<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    public generateMissions(reputation: number, count: number = 6, gameState?: GameState): Mission[] {
        const missions: Mission[] = [];
        for (let i = 0; i < count; i++) {
            missions.push(this.generateSingleMission(reputation, gameState));
        }
        return missions;
    }

    private generateSingleMission(reputation: number, gameState?: GameState): Mission {
        const scenarioIndex = Math.floor(Math.random() * scenarios.length);
        const scenario = scenarios[scenarioIndex];

        // Difficulty scales with reputation
        let baseDifficulty: 1 | 2 | 3 | 4 | 5 = 1;
        const tiers = GAME_CONFIG.MISSIONS.TIERS;

        if (reputation >= tiers[5].minRep) baseDifficulty = 5;
        else if (reputation >= tiers[4].minRep) baseDifficulty = 4;
        else if (reputation >= tiers[3].minRep) baseDifficulty = 3;
        else if (reputation >= tiers[2].minRep) baseDifficulty = 2;

        // Randomize difficulty slightly around base
        const rand = Math.random();
        let difficulty = baseDifficulty;
        if (rand > 0.8 && difficulty < 5) difficulty++;
        if (rand < 0.2 && difficulty > 1) difficulty--;

        // Reward scaling
        const range = GAME_CONFIG.MISSIONS.TIERS[difficulty as keyof typeof GAME_CONFIG.MISSIONS.TIERS].rewardRange;
        let reward = Math.floor(range.min + Math.random() * (range.max - range.min));

        // Apply Holiday Modifiers
        if (gameState?.currentDate) {
            const date = new Date(gameState.currentDate);

            const activeHoliday = holidayEvents.find(h => {
                const hDate = new Date(date.getFullYear(), h.month, h.day);
                const diff = (date.getTime() - hDate.getTime()) / (1000 * 3600 * 24);
                return diff >= 0 && diff < h.duration;
            });

            if (activeHoliday) {
                reward *= activeHoliday.rewardMult;
            }
        }

        // Mission titles based on scenario
        const titlePrefixes = ["Operation", "Project", "Task", "Heist", "Infiltration"];
        const titleSuffixes = ["Alpha", "Beta", "Omega", "Nexus", "Zero", "Prime"];
        const title = `${this.getRandom(titlePrefixes)} ${scenario.theme.split(' ')[0]} ${this.getRandom(titleSuffixes)}`.toUpperCase();

        const isSensitive = Math.random() > 0.8;
        const targetFileName = isSensitive
            ? sensitiveFilenames[Math.floor(Math.random() * sensitiveFilenames.length)]
            : `SECRET_${Math.floor(Math.random() * 10000)}.dat`;

        const targetFileMetadata: Mission['targetFileMetadata'] = {
            value: reward * 0.5,
            category: isSensitive ? 'sensitive' : 'system'
        };

        // Enhance description with phase 3 details
        const vectors = ['SSH Exploit', 'SQL Injection', 'Service Buffer Overflow', 'Kernel Zero-Day'];
        const chosenVector = vectors[Math.floor(Math.random() * Math.min(vectors.length, difficulty))];

        const description = `${scenario.welcomeMessage(targetFileName)}\n\nIntel suggests a potential ${chosenVector} vector might be viable. Use advanced recon tools for confirmation.`;

        // Node count scaling based on difficulty
        let numNodes = 2;
        if (difficulty === 1) numNodes = 2;
        else if (difficulty === 2) numNodes = 2 + Math.floor(Math.random() * 2); // 2 or 3
        else numNodes = 2 + Math.floor(Math.random() * 4); // 2 to 5

        const winConditions: Array<'file_found' | 'root_access' | 'process_killed' | 'file_modified'> = ['file_found', 'root_access'];
        if (difficulty >= 3) winConditions.push('process_killed', 'file_modified');
        const winConditionType = this.getRandom(winConditions);

        const config: MissionConfig = {
            scenarioIndex,
            numNodes,
            targetFileName,
            difficultyMultiplier: difficulty,
            winConditionType
        };

        return {
            id: `mission_${Math.random().toString(36).substr(2, 9)}`,
            title,
            difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
            reward,
            description,
            targetFileMetadata,
            targetNetworkConfig: config
        };
    }
}

export const missionGenerator = new MissionGenerator();
