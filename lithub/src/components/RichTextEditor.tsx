    import {$getRoot, $getSelection} from 'lexical';
    import React, {useEffect} from 'react';

    import {LexicalComposer} from '@lexical/react/LexicalComposer';
    import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
    import {ContentEditable} from '@lexical/react/LexicalContentEditable';
    import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
    import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
    import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
    import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
    import {ListPlugin} from "@lexical/react/LexicalListPlugin";
    import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
    import {AutoLinkPlugin} from "@lexical/react/LexicalAutoLinkPlugin";
    import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
    import { HeadingNode, QuoteNode } from "@lexical/rich-text";
    import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
    import { ListItemNode, ListNode } from "@lexical/list";
    import { CodeHighlightNode, CodeNode } from "@lexical/code";
    import { AutoLinkNode, LinkNode } from "@lexical/link";
    import ToolbarPlugin from './plugins/ToolbarPlugin';

    const theme = {
        heading: {
            h1: 'glyf-editor-h1',
            h2: 'glyf-editor-h2',
            h3: 'glyf-editor-h3'
        },
        text: {
            bold: 'glyf-editor-bold',
            italic: 'glyf-editor-italic',
            underline: 'glyf-editor-underline',
            strikethrough: 'glyf-editor-strikethrough',
            underlineStrikethrough: 'glyf-editor-underlineStrikethrough'
        },
        banner: 'glyf-editor-banner'
    }

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
    function MyCustomAutoFocusPlugin() {
        const [editor] = useLexicalComposerContext();
        useEffect(() => {
            // Focus the editor when the effect fires!
            editor.focus();
        }, [editor]);

        return null;
    }
    function Placeholder() {
        return <div className={"absolute top-2 text-white-500 pointer-event-none"}>Enter some rich text...</div>;
    }
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
    function onError(error: any) {
        throw error;
    }

    // @ts-ignore
    const RichTextEditor = ({value, onChange }) => {
        const initialConfig = {
            namespace: 'MyEditor',
            theme,
            onError,
            nodes: [
                HeadingNode,
                ListNode,
                ListItemNode,
                QuoteNode,
                CodeNode,
                CodeHighlightNode,
                TableNode,
                TableCellNode,
                TableRowNode,
                AutoLinkNode,
                LinkNode
            ]
        };

        return (
            <LexicalComposer initialConfig={initialConfig}>
                <div className="editor-container">
                    <ToolbarPlugin />
                    <div style={{backgroundColor:'rgba(255, 255, 255, 0.3)'}} className="editor-inner">
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="contentEditable" />}
                            placeholder={<div className="placeholder">Enter some rich text...</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin />
                        <ListPlugin />
                    </div>
                </div>
            </LexicalComposer>
        );
    }

export default RichTextEditor;