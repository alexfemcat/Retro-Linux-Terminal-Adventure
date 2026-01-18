import React, { useState, useEffect, useRef } from 'react';

interface NanoEditorProps {
    filename: string;
    initialContent: string;
    onSave: (content: string) => void;
    onExit: () => void;
}

export const NanoEditor: React.FC<NanoEditorProps> = ({ filename, initialContent, onSave, onExit }) => {
    const [content, setContent] = useState(initialContent);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            onSave(content);
        } else if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
            onExit();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-mono text-sm crt-screen p-2" onKeyDown={handleKeyDown}>
            {/* Top Bar */}
            <div className="bg-white text-black px-2 flex justify-between">
                <span> GNU nano 6.2</span>
                <span>{filename}</span>
                <span>Modified</span>
            </div>

            {/* Main Area */}
            <textarea
                ref={textareaRef}
                className="flex-grow bg-transparent text-white border-none outline-none resize-none p-2 custom-scrollbar"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
            />

            {/* Bottom Menu */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-1 text-xs mt-2 border-t border-gray-800 pt-2">
                <div><span className="bg-white text-black px-1 mr-1">^G</span> Get Help</div>
                <div><span className="bg-white text-black px-1 mr-1">^O</span> Write Out</div>
                <div><span className="bg-white text-black px-1 mr-1">^W</span> Where Is</div>
                <div><span className="bg-white text-black px-1 mr-1">^K</span> Cut Text</div>
                <div><span className="bg-white text-black px-1 mr-1">^X</span> Exit</div>
                <div><span className="bg-white text-black px-1 mr-1">^J</span> Justify</div>
                <div><span className="bg-white text-black px-1 mr-1">^R</span> Read File</div>
                <div><span className="bg-white text-black px-1 mr-1">^U</span> Uncut Text</div>
            </div>
        </div>
    );
};
