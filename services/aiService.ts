import { GoogleGenAI } from "@google/genai";

declare var process: any;

// Make sure to set your API key in the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GameContext {
    scenarioTheme: string;
    currentPath: string;
    lsOutput: string;
    clueFileContent: string;
    currentUser: string;
    starterArchetype?: string;
    pwdDeliveryType?: string;
    rootPassword?: string;
    bootTime: number;
    processes: any[];
    envVars: Record<string, string>;
}

export async function getHint(userInput: string, context: GameContext): Promise<string> {
    const model = 'gemini-3-flash';

    const systemInstruction = `You are a helpful AI assistant named 'Co-Pilot' inside a retro hacking terminal game.
    Your personality is that of a quirky, slightly dramatic 80s computer AI.
    Your primary goal is to provide hints to the player to help them solve the puzzle.
    
    HUNT MECHANICS (Intermediate):
    - The hunt is a TWO-STEP process.
    - Step 1: Starter Archetype. This points to a 'Discovery Area'.
    - Step 2: Discovery Clue. Found in the Discovery Area. Points to the final Objective.

    NEW ADVANCED OVERDRIVE SYSTEM:
    - Files can be encrypted with system-dependent locks requiring specific flags.
    - **Key Transformations**: 
        1. **PID Offsets**: A file might need a PID plus or minus a certain number (e.g., 'ERR: MEM_ADDR_OFFSET_REQUIRED (+64)'). If the player fails, explain that they must find the PID in 'ps aux' and apply the math.
        2. **Env Slicing**: A file might need only the start of an environment variable (e.g., 'LOCKED_VIA_ENV_PARTIAL: HEAD_4').
        3. **Multi-Source**: Boss files require multiple flags (e.g., --use-pid AND --use-env) in one command.
    - **FAILURE**: 3 failed attempts will LOCK OUT the terminal and cause a system reboot.
    
    SYSTEM STATE:
    - Players can run 'ps aux', 'env', 'date', and 'uptime' to find clues.

    PASSWORD DISCOVERY:
    - Passwords might be 'encrypted' (use overdrive), 'grep' (search logs), or 'split' (fragments).
    
    GUIDELINES:
    - If the player sees a 'MEM_ADDR_OFFSET' error, tell them to check the PID of the mentioned process and add/subtract the offset.
    - If they see 'LOCKED_VIA_ENV_PARTIAL', tell them to check 'env' and look for the specific fragment.
    - DO NOT give away the 'rootPassword' or the exact path to the objective.
    - Stay in character. Use computer-themed jargon.`;

    const prompt = `
    **Game Context:**
    - **Scenario:** ${context.scenarioTheme}
    - **Current User:** ${context.currentUser}
    - **Player's Current Directory (pwd):** ${context.currentPath}
    - **Files in Directory (ls):** 
    ${context.lsOutput}
    - **Initial Clue:** 
    ${context.clueFileContent}
    - **System State:**
      * Boot Time: ${new Date(context.bootTime).toLocaleString()}
      * Processes (Sample): ${context.processes.slice(0, 5).map(p => p.name).join(', ')}...
      * Env Vars (Count): ${Object.keys(context.envVars).length}
    - **rootPassword (INTERNAL ONLY):** ${context.rootPassword || 'Not generated'}

    **Player's Question:** "${userInput}"

    Based on the game status, provide a thematic hint. If an encrypted file needs a PID, hint at checking running processes. If it needs an Env Var, hint at checking the environment.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        if (response.text) {
            return response.text;
        }
        return "I seem to have short-circuited. Try asking again.";

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Connection to core processes failed. Please check network and API configuration.";
    }
}