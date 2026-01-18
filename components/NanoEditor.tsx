import React, { useState, useEffect, useRef } from 'react';

interface NanoEditorProps {
    filename: string;
    initialContent: string;
    onSave: (filename: string, content: string) => void;
    onExit: () => void;
    isTutorialMode?: boolean;
}

export const NanoEditor: React.FC<NanoEditorProps> = ({ filename, initialContent, onSave, onExit, isTutorialMode }) => {
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [saveFilename, setSaveFilename] = useState(filename);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const saveInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isSaving) {
            textareaRef.current?.focus();
        } else {
            saveInputRef.current?.focus();
        }
    }, [isSaving]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (isSaving) {
            if (e.key === 'Enter') {
                e.preventDefault();
                onSave(saveFilename, content);
                setIsSaving(false);
                setHasSaved(true);
            } else if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
                e.preventDefault();
                setIsSaving(false);
            }
            return;
        }

        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            setIsSaving(true);
        } else if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
            if (isTutorialMode && !hasSaved) {
                // In tutorial, must save before exiting
                return;
            }
            onExit();
        } else if (isTutorialMode && e.ctrlKey) {
            // Prevent other ctrl actions in tutorial
            e.preventDefault();
        }
    };

    return (
        <div className="fixed inset-0 z-[40] bg-black flex flex-col font-mono text-sm crt-screen p-2" onKeyDown={handleKeyDown}>
            {/* Top Bar */}
            <div className="bg-white text-black px-2 flex justify-between">
                <span> GNU nano 6.2</span>
                <span>{isSaving ? '' : filename}</span>
                <span>{content !== initialContent ? 'Modified' : ''}</span>
            </div>

            {/* Main Area */}
            <textarea
                ref={textareaRef}
                className={`flex-grow bg-transparent text-white border-none outline-none resize-none p-2 custom-scrollbar ${isSaving ? 'opacity-50' : ''}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
                readOnly={isSaving}
            />

            {/* Bottom Menu / Save Prompt */}
            {isSaving ? (
                <div className="bg-white text-black px-2 py-1 flex flex-col">
                    <div className="flex">
                        <span className="mr-2">File Name to Write:</span>
                        <input
                            ref={saveInputRef}
                            type="text"
                            className="flex-grow bg-transparent border-none outline-none text-black"
                            value={saveFilename}
                            onChange={(e) => setSaveFilename(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 text-xs mt-1 opacity-70">
                        <span>^C Cancel</span>
                        <span>Enter Save</span>
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    );
};
