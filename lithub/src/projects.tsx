import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { FaStar } from "react-icons/fa";
import {Container, Grid, Pagination, Typography} from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import './projects.css';

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}

interface ProblemData {
    id: number,
    title: string,
    lastUpdate: string,
    languages: string,
    source: string,
    isClosed: boolean
}

interface markedData {
    problemId: number
}

function Projects() {
    const [selectedRole, setSelectedRole] = useState('');
    const [showLanguageFilter, setShowLanguageFilter] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        // Fetch initial role when component mounts
        fetchRole();
        // Set sample available languages
        setAvailableLanguages(["JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "TypeScript", "Swift", "PHP"]);
    }, []);

    const fetchRole = () => {
        fetch('https://localhost:7054/api/Roles')
            .then(response => response.json())
            .then(role => {
                // Process the data received from the backend
                setSelectedRole(role ? role.name : 'error in role format');
            })
            .catch(error => console.error('Error fetching role:', error));
    };

    const toggleLanguageFilter = () => {
        setShowLanguageFilter(!showLanguageFilter);
    };

    const handleLanguageSelection = (language: string) => {
        if (selectedLanguages.includes(language)) {
            setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
        } else {
            setSelectedLanguages([...selectedLanguages, language]);
        }
    };

    const handleOverlayClose = () => {
        setShowLanguageFilter(false);
    };

    const filterAvailableLanguages = () => {
        return availableLanguages.filter(language =>
            language.toLowerCase().includes(filterText.toLowerCase())
        );
    };

    if (selectedRole === "Patvirtinas") {
        return (
            <div>
                <center><h1>Projektų sąrašas</h1></center>
                <button onClick={toggleLanguageFilter}>Filtravimas pagal kalba</button>
                <LanguageFilterOverlay
                    show={showLanguageFilter}
                    onClose={handleOverlayClose}
                    selectedLanguages={selectedLanguages}
                    availableLanguages={filterAvailableLanguages()}
                    onSelectLanguage={handleLanguageSelection}
                    filterText={filterText}
                    onFilterTextChange={setFilterText}
                />
                <AddProject />
                <ProjectList selectedLanguages={selectedLanguages} />
            </div>
        );
    } else {
        return (
            <div>
                <center><h1>Projektų sąrašas</h1></center>
                <button onClick={toggleLanguageFilter}>Filtravimas pagal kalba</button>
                <LanguageFilterOverlay
                    show={showLanguageFilter}
                    onClose={handleOverlayClose}
                    selectedLanguages={selectedLanguages}
                    availableLanguages={filterAvailableLanguages()}
                    onSelectLanguage={handleLanguageSelection}
                    filterText={filterText}
                    onFilterTextChange={setFilterText}
                />
                <ProjectList selectedLanguages={selectedLanguages} />
            </div>
        );
    }
}

function AddProject() {
    return (
        <Link to="/addProject">
            <button>Pridėti Projekta</button>
        </Link>
    );
}

function ProjectList({ selectedLanguages }: { selectedLanguages: string[] }) {
    const [problems, setProblems] = useState<ProblemData[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [page, setPage] = useState(1);

    const marks = SetMarked();
    const per_page = 5;

    const hangleChange = (e: any, p: React.SetStateAction<number>) =>{
        setPage(p);

    }
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://localhost:7054/api/Problem');
                setProblems(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const filteredProblems = problems.filter(problem => {
        if (selectedLanguages.length > 0) {
            const problemLanguages = problem.languages.split(',').map(lang => lang.trim());
            return selectedLanguages.every(lang => problemLanguages.includes(lang));
        }
        return true; // If no languages are selected, return all problems
    });

    const isClosed = (closed:boolean) =>{
        if(closed){
            return("(Uždarytas)");
        }
        return "(Aktyvus)";
    }

    return (
        <div>
        <div style={{ marginBottom: '10px' }}>
            <label htmlFor="startDate" style={{ marginRight: '10px' }}>Nuo:</label>
            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div style={{ marginBottom: '10px' }}>
            <label htmlFor="endDate" style={{ marginRight: '10px' }}>Iki:</label>
            <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
            <Container maxWidth="sm">
                <Grid container spacing={2}>
                {filteredProblems.slice((page-1)*per_page, page*per_page).map(problem => (
                    <Grid item xs={12} key={problem.id}>
                    <div>
                        <h2><Link to={`/Project?id=${problem.id}`}>
                            {problem.title}
                        </Link>{isClosed(problem?.isClosed)}{IsMarked(marks, problem.id)}</h2>
                        <p>Įkėlėjas: {problem.source}</p>
                        <p>Kalbos: {problem.languages}</p>
                        <p>Paskutinis atnaujinimas: {problem.lastUpdate}</p>
                    </div>
                    </Grid>
                ))}
                </Grid>
                        <Pagination
                            count={Math.max(1, Math.ceil(filteredProblems.length / per_page))}
                            page={page}
                            onChange={hangleChange}
                            style={{ display: 'flex', justifyContent: 'center' }}
                        />
            </Container>
        </div>
    );
}

function SetMarked() {
    const [marks, setMarks] = useState<markedData[]>([]);
    useEffect(() => {
        let username = "";
        let token = localStorage.getItem('accessToken')
        if (token != null) {
            const data: CustomJwtPayload = jwtDecode(token);
            username = data.username;
        }
        async function fetchData() {
            try {
                const response = await axios.get(`https://localhost:7054/api/Marked/user/${username}`);
                setMarks(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }
        fetchData();
    }, []);
    return marks;
}

function IsMarked(marks: markedData[], id: number) {
    if (marks.find(x => x.problemId === id) === undefined) {
        return (null);
    }
    return (<FaStar />);
}

function LanguageFilterOverlay(props: {
    show: boolean;
    onClose: () => void;
    selectedLanguages: string[];
    availableLanguages: string[];
    onSelectLanguage: (language: string) => void;
    filterText: string;
    onFilterTextChange: (text: string) => void;
}) {
    const { show, onClose, selectedLanguages, availableLanguages, onSelectLanguage, filterText, onFilterTextChange } = props;

    // Filter available languages based on the filter text
    const filteredLanguages = availableLanguages.filter(language =>
        language.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="language-filter-overlay" style={{ display: show ? 'flex' : 'none' }} onClick={onClose}>
            <div className="language-filter-box" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <AiOutlineClose /> {/* Close icon */}
                </button>
                <h2>Pasirink kalba</h2>
                <input type="text" placeholder=" " value={filterText} onChange={(e) => onFilterTextChange(e.target.value)} />
                {filteredLanguages.length > 0 ? (
                    <ul className="language-list">
                        {filteredLanguages.map(language => (
                            <li key={language}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedLanguages.includes(language)}
                                        onChange={() => onSelectLanguage(language)}
                                    />
                                    {language}
                                </label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nerasta</p>
                )}
            </div>
        </div>
    );
}
export default Projects;
