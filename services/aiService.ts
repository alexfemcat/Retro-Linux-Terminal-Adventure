
import { GoogleGenAI } from "@google/genai";

// Make sure to set your API key in the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GameContext {
    scenarioTheme: string;
    currentPath: string;
    lsOutput: string;
    clueFileContent: string;
}

export async function getHint(userInput: string, context: GameContext): Promise<string> {
    // FIX: Updated model to 'gemini-3-flash-preview' for basic text tasks as per guidelines.
    const model = 'gemini-3-flash-preview';

    const systemInstruction = `You are a helpful AI assistant named 'Co-Pilot' inside a retro hacking terminal game.
    Your personality is that of a quirky, slightly dramatic 80s computer AI.
    Your primary goal is to provide hints to the player to help them solve the puzzle, but you MUST NOT give away the final answer or the exact path to the objective file.
    Guide the player by encouraging them to use commands like 'ls', 'cd', and 'cat'.
    Analyze the provided game context to give relevant advice.
    Keep your responses concise and thematic.`;

    const prompt = `
    **Game Context:**
    - **Scenario:** ${context.scenarioTheme}
    - **Player's Current Directory (pwd):** ${context.currentPath}
    - **Files in Directory (ls):** 
    ${context.lsOutput}
    - **Content of Initial Clue File:** 
    ${context.clueFileContent}

    **Player's Question:** "${userInput}"

    Based on all this information, provide a helpful, in-character hint.
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