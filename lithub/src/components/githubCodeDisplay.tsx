import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
const styles = [
    'coy', 'dark', 'funky', 'okaidia', 'solarizedlight', 'tomorrow', 'twilight', 'prism',
    'cb', 'darcula', 'dracula', 'ghcolors', 'hopscotch', 'lucario', 'nord', 'pojoaque',
    'synthwave84', 'vs', 'xonokai',
];
interface GithubCodeDisplayProps {
    initialUrl: string;
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
    const pattern = /^(https?:\/\/github\.com\/[\w.-]+\/[\w.-]+)(\/blob\/.+|\/tree\/.+)?$/i;
    return pattern.test(url);
};

// Function to transform GitHub URL to API URL
const transformToApiUrl = (url: string): string => {
    const repoPathRegex = /github\.com\/([^\/]+\/[^\/]+)/;
    const blobPathRegex = /github\.com\/([^\/]+\/[^\/]+)\/blob\/([^\/]+)\/(.+)/;
    const treePathRegex = /github\.com\/([^\/]+\/[^\/]+)\/tree\/([^\/]+)\/(.+)/;

    let match = url.match(blobPathRegex);
    if (match) {
        const [_, repoPath, branch, filePath] = match;
        return `https://api.github.com/repos/${repoPath}/contents/${filePath}?ref=${branch}`;
    }

    match = url.match(treePathRegex);
    if (match) {
        const [_, repoPath, branch, dirPath] = match;
        return `https://api.github.com/repos/${repoPath}/contents/${dirPath}?ref=${branch}`;
    }

    match = url.match(repoPathRegex);
    if (match) {
        const [_, repoPath] = match;
        return `https://api.github.com/repos/${repoPath}/contents?ref=main`; // Default branch is assumed to be main
    }

    console.error('Invalid GitHub URL:', url);
    return ''; // Handle this case appropriately.
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
const GithubCodeDisplay: React.FC<GithubCodeDisplayProps> = ({ initialUrl }) => {
    const [currentGithubUrl, setCurrentGithubUrl] = useState<string>(initialUrl);
    const [codeContent, setCodeContent] = useState<string>('');
    const [language, setLanguage] = useState<string>('javascript'); // Default language
    const [selectedStyle, setSelectedStyle] = useState('tomorrow');
    const [highlightStyle, setHighlightStyle] = useState({});
    const [isDirectory, setIsDirectory] = useState<boolean>(false);
    const [directoryContents, setDirectoryContents] = useState<any[]>([]);
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        if (isValidGithubUrl(currentGithubUrl)) {
            const apiUrl = transformToApiUrl(currentGithubUrl);
            axios.get(apiUrl, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            })
                .then(response => {
                    if (Array.isArray(response.data)) {
                        // If the response is an array, it's a directory
                        setIsDirectory(true);
                        setDirectoryContents(response.data);
                    } else {
                        // Otherwise, it's a file
                        setIsDirectory(false);
                        // Extract file extension from the URL
                        const fileExtension = getFileExtension(currentGithubUrl);
                        if (fileExtension) {
                            setLanguage(inferLanguageFromExtension(fileExtension));
                        }
                        setCodeContent(response.data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching GitHub content:', error);
                });
        }
    }, [currentGithubUrl]);

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

    const handleItemClick = (item: any) => {
        const newUrl = `https://github.com/Kazill/LitHub/${item.type === 'dir' ? 'tree' : 'blob'}/main/${item.path}`;
        setHistory([...history, currentGithubUrl]);
        setCurrentGithubUrl(item.html_url);
        setCodeContent('');
        setDirectoryContents([]);
    };

    const handleGoBack = () => {
        const previousUrl = history.pop();
        if (previousUrl) {
            setCurrentGithubUrl(previousUrl);
            setCodeContent('');
            setDirectoryContents([]);
            setHistory([...history]);
        }
    };

    if (!codeContent && !isDirectory) return null;

    return (
        <div>
            <button onClick={handleGoBack} disabled={history.length === 0}>Atgal</button>
            {!isDirectory && (
                <select value={selectedStyle} onChange={handleStyleChange}>
                    {styles.map(style => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                </select>
            )}
            <div style={{ maxHeight: '400px', maxWidth: '80vw', overflow: 'auto' }}>
                {isDirectory ? (
                    <ul>
                        {directoryContents.map((item) => (
                            <li key={item.path}>
                                <button onClick={() => handleItemClick(item)}>
                                    {item.type === 'dir' ? '📁' : '📄'} {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <SyntaxHighlighter language={language} style={highlightStyle} showLineNumbers>
                        {codeContent}
                    </SyntaxHighlighter>
                )}
            </div>
        </div>
    );
};

export default GithubCodeDisplay;