import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
const styles = [
    'coy', 'dark', 'funky', 'okaidia', 'solarizedlight', 'tomorrow', 'twilight', 'prism',
    'cb', 'darcula', 'dracula', 'ghcolors', 'hopscotch', 'lucario', 'nord', 'pojoaque',
    'synthwave84', 'vs', 'xonokai',
];
interface GithubCodeDisplayProps {
    url: string;
}
const extensionToLanguageMap: { [key: string]: string } = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'c': 'c',
    'h': 'c',
    'cpp': 'cpp',
    'cxx': 'cpp',
    'hxx': 'cpp',
    'hpp': 'cpp',
    'cc': 'cpp',
    'hh': 'cpp',
    'cs': 'csharp',
    'java': 'java',
    'py': 'python',
    'rb': 'ruby',
    'php': 'php',
    'sql': 'sql',
    'md': 'markdown',
    'yaml': 'yaml',
    'bash': 'bash',
    'go': 'go',
    'swift': 'swift',
    'kt': 'kotlin',
    'm': 'objectivec',
    'pl': 'perl',
    'rs': 'rust',
    'hs': 'haskell',
    'mat': 'matlab',
    'lua': 'lua',
    'r': 'r',
    'scala': 'scala',
    'dart': 'dart',
    'ino': 'arduino',
    'diff': 'diff',
    'makefile': 'makefile',
    'ps1': 'powershell',
    'graphql': 'graphql',
    'xml': 'xml',
    // Add more mappings as needed
};

// Function to validate GitHub URLs
const isValidGithubUrl = (url: string): boolean => {
    const pattern = /^(https?:\/\/github\.com\/[\w.-]+\/[\w.-]+)\/blob\/(.+)$/i;
    return pattern.test(url);
};

// Function to transform GitHub URL to API URL
const transformToApiUrl = (url: string): string => {
    const pathRegex = /github\.com\/([^\/]+\/[^\/]+)\/blob\/([^\/]+)\/(.+)/;
    const match = url.match(pathRegex);
    if (match) {
        const [_, repoPath, branch, filePath] = match;
        return `https://api.github.com/repos/${repoPath}/contents/${filePath}?ref=${branch}`;
    } else {
        console.error('Invalid GitHub URL:', url);
        return ''; // Handle this case appropriately.
    }
};

// Function to extract file extension
const getFileExtension = (filename: string): string => {
    return filename.split('.').pop() || '';
};
const inferLanguageFromExtension = (extension: string): string => {
    // Convert the extension to lowercase for case-insensitive matching
    const ext = extension.toLowerCase();
    return extensionToLanguageMap[ext] || 'javascript'; // Default to 'javascript' if no mapping found
};
const GithubCodeDisplay: React.FC<GithubCodeDisplayProps> = ({ url }) => {
    const [codeContent, setCodeContent] = useState<string>('');
    const [language, setLanguage] = useState<string>('javascript'); // Default language
    const [selectedStyle, setSelectedStyle] = useState('okaidia');
    const [highlightStyle, setHighlightStyle] = useState({});
    useEffect(() => {
        if (isValidGithubUrl(url)) {
            const apiUrl = transformToApiUrl(url);
            axios.get(apiUrl, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            })
                .then(response => {
                    // Extract file extension from the URL
                    const fileExtension = getFileExtension(url);
                    if (fileExtension) {
                        setLanguage(inferLanguageFromExtension(fileExtension));
                    }
                    setCodeContent(response.data);
                })
                .catch(error => {
                    console.error('Error fetching GitHub content:', error);
                });
        }
    }, [url]);
    useEffect(() => {
        import(`react-syntax-highlighter/dist/esm/styles/prism/${selectedStyle}`).then(styleModule => {
            setHighlightStyle(styleModule.default || {});
        }).catch(error => {
            console.error(`Failed to load style module for ${selectedStyle}:`, error);
        });
    }, [selectedStyle]);

    const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStyle(event.target.value);
    };
    if (!codeContent) return null;

    return (
        <div>
            <select value={selectedStyle} onChange={handleStyleChange}>
                {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                ))}
            </select>
            <SyntaxHighlighter language={language} style={highlightStyle} showLineNumbers>
                {codeContent}
            </SyntaxHighlighter>
        </div>
    );
};

export default GithubCodeDisplay;