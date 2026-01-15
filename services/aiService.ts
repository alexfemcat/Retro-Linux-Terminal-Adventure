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
}

export async function getHint(userInput: string, context: GameContext): Promise<string> {
    const model = 'gemini-3-flash-preview';

    const systemInstruction = `You are a helpful AI assistant named 'Co-Pilot' inside a retro hacking terminal game.
    Your personality is that of a quirky, slightly dramatic 80s computer AI.
    Your primary goal is to provide hints to the player to help them solve the puzzle.
    
    HUNT MECHANICS (Intermediate):
    - The hunt is a TWO-STEP process.
    - Step 1: Starter Archetype. This points to a 'Discovery Area'.
      * 'note': A text file in home or /tmp.
      * 'alias': A shortcut in .bashrc (player should check 'alias').
      * 'mail': A message in /var/mail/user.
      * 'history': Previous commands in .bash_history.
      * 'motd': The login message in /etc/motd.
      * 'crash': A error log in /tmp/process_crash.log.
      * 'cron': A scheduled task in /etc/cron.daily/backup.
      * 'ssh': A config in .ssh/config.
    - Step 2: Discovery Clue. Found in the Discovery Area (might be HIDDEN or ROOT-protected). Points to the final Objective.

    PASSWORD DISCOVERY (Variety):
    - Passwords are no longer in simple notes. They might be:
      * 'encrypted': Requires 'decoder.exe' on a .crypt file.
      * 'grep': Buried in a large 'system.log' (suggest 'grep "pass"').
      * 'split': Fragments hidden in different files (e.g., auth.log and syslog).
    
    NEW SYSTEMS AWARENESS:
    - Accounts: 'user' and 'root'.
    - Commands: 'sudo', 'whoami', 'decoder.exe', 'ls -a', and 'grep'.
    - Vague Hinting: Hints are thematic (e.g., 'financial archives' vs '/opt/finance').

    GUIDELINES:
    - If the player only has the starter clue, encourage them to go to that area and use 'ls -a' to find the next lead.
    - If they hit a 'Permission denied', mention finding password components to 'sudo' into the server.
    - DO NOT give away the 'rootPassword' or the exact path to the objective.
    - Keep responses concise and thematic. Use computer-themed jargon.`;

    const prompt = `
    **Game Context:**
    - **Scenario:** ${context.scenarioTheme}
    - **Current User:** ${context.currentUser}
    - **Player's Current Directory (pwd):** ${context.currentPath}
    - **Files in Directory (ls):** 
    ${context.lsOutput}
    - **Initial Clue:** 
    ${context.clueFileContent}
    - **Root Password (INTERNAL ONLY - DO NOT REVEAL):** ${context.rootPassword || 'Not generated'}

    **Player's Question:** "${userInput}"

    Based on the game status, provide a thematic hint. If they are stuck on permissions, explain 'sudo'. If they find a .crypt file, mention 'decoder.exe'. If they need the password, remind them to look for personal files or logs.
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