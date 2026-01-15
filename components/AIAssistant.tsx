
import React, { useState, useRef, useEffect } from 'react';
import type { GameState, ChatMessage, VFSNode } from '../types';
import { getHint } from '../services/aiService';

interface AIAssistantProps {
    gameState: GameState;
    currentPath: string[];
    currentUser: 'user' | 'root';
}

const getNodeByPath = (vfs: VFSNode, path: string[]): VFSNode | null => {
    let node = vfs;
    for (const part of path) {
        if (node.type === 'directory' && node.children[part]) {
            node = node.children[part];
        } else {
            return null;
        }
    }
    return node;
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ gameState, currentPath, currentUser }) => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHistory([{ sender: 'ai', text: "Welcome, operative. I am Co-Pilot, your AI assistant. Ask me for hints if you get stuck." }]);
    }, [gameState]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const currentNode = getNodeByPath(gameState.vfs, currentPath);
            let lsOutput = "Could not list files in current directory.";
            if (currentNode && currentNode.type === 'directory') {
                lsOutput = Object.keys(currentNode.children).join('\n');
            }

            const context = {
                scenarioTheme: gameState.scenario.theme,
                currentPath: `/${currentPath.join('/')}`,
                lsOutput,
                clueFileContent: gameState.clueFile.content,
                currentUser: currentUser,
                starterArchetype: gameState.starterArchetype,
                rootPassword: gameState.rootPassword,
            };

            const aiResponse = await getHint(input, context);
            setHistory(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error(error);
            const errorMessage = "Sorry, I'm having trouble connecting to my core processes right now.";
            setHistory(prev => [...prev, { sender: 'ai', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div
            className="w-full h-full flex flex-col p-4 text-xl border-2 border-[#33ff00]/50 crt-screen relative overflow-hidden"
            onClick={() => inputRef.current?.focus()}
        >
            <h2 className="text-center pb-2 border-b-2 border-[#33ff00]/50 flex-shrink-0">AI ASSISTANT: Co-Pilot</h2>
            <div className="flex-grow overflow-y-auto py-2 pr-2">
                {history.map((msg, i) => (
                    <div key={i} className="mb-2">
                        <span className={msg.sender === 'user' ? "text-blue-400" : "text-green-400"}>
                            {msg.sender === 'user' ? '>>> ' : 'COPILOT: '}
                        </span>
                        <span className="whitespace-pre-wrap">{msg.text}</span>
                    </div>
                ))}
                {isLoading && <div>COPILOT: Thinking...</div>}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-shrink-0 mt-2">
                <label htmlFor="ai-input" className="flex-shrink-0">
                    <span className="text-gray-400">&gt;</span>
                </label>
                <input
                    ref={inputRef}
                    id="ai-input"
                    type="text"
                    className="flex-grow bg-transparent border-none outline-none pl-2 text-inherit"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? '' : 'Ask for a hint...'}
                    disabled={isLoading}
                    autoComplete="off"
                />
                <div className="w-2 h-6 bg-[#33ff00] blinking-cursor"></div>
            </form>
        </div>
    );
};
