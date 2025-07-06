import React from 'react';
import {
    LexicalComposer,

} from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

const theme = {
    paragraph: 'mb-2',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
    },
};

const editorConfig = {
    namespace: 'MyEditor',
    theme,
    onError(error) {
        console.error('Lexical error:', error);
    },
    nodes: [],
};

function OnChangeHandler({ onChange }) {
    const [editor] = useLexicalComposerContext();

    return (
        <OnChangePlugin
            onChange={(_editorState, editor) => {
                editor.update(() => {
                    const html = $getRoot().getTextContent();
                    onChange(html); // You can change this to serialize HTML if needed
                });
            }}
        />
    );
}

export const LexicalEditor = ({ onChange }) => {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="border border-gray-300 rounded-xl p-4 min-h-[200px] bg-white">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable className="outline-none min-h-[150px] text-gray-800" />
                    }
                    placeholder={<div className="text-gray-400">محتوای یادداشت را بنویسید...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <OnChangeHandler onChange={onChange} />
            </div>
        </LexicalComposer>
    );
};
