

import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import {Link, useParams} from 'react-router-dom';

import { Margin, Padding } from '@mui/icons-material';
import { Box, Container, Grid, Pagination, TextField } from '@mui/material';

import check from './img/check.png';
import langImg from './img/lang.png';
import lock from './img/lock.png';
import noCheck from './img/nocheck.png';
import unlock from './img/unlocked.png';

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
    isClosed: boolean,
    isPrivate: boolean
}

interface markedData {
    problemId: number
}

interface user {
    id: number,
    UserName: string
}

function UserProjects() {
    const [showLanguageFilter, setShowLanguageFilter] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [filterText, setFilterText] = useState('');
    const {username} = useParams();
    const [viewer,setViewer]=useState('');
    const [usernameFilter, setUsernameFilter] = useState('');
    const [showUserFilter, setShowUserFilter] = useState(false);

    const [userRole, setUserRole] = useState('Svečias');
    useEffect(() => {
        let token=localStorage.getItem('accessToken')
        if (token === null) {
            setUserRole("Svečias")
        } else {
            const data: CustomJwtPayload = jwtDecode(token)
            setUserRole(data.role)
            setViewer(data.username.toLowerCase())
        }
    }, []);
    
    const toggleUserFilter = () => {
        setShowUserFilter(!showUserFilter);
      };    

    useEffect(() => {
        // Set sample available languages
        setAvailableLanguages(["JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "TypeScript", "Swift", "PHP"]);
    }, []);

    useEffect(() => {
        async function fetchUsers() {
          try {
            const response = await axios.get('https://localhost:7054/api/Users'); // Adjust your API endpoint
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        }
      
        fetchUsers(); 
      }, []);

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

    return (
            <div style={{ padding: '10px', minHeight: '100vh' }}>
                <h1 className='title' style={{ marginLeft: '20px' }}> {username?.toUpperCase()} PROJEKTAI </h1>

                <div style={{padding: '10px', background: '#335285', display: 'flex', gap: '10px', borderRadius: '4px'}}>
                    {username?.toLowerCase()===viewer?<AddProject />:null}
                <button onClick={toggleLanguageFilter}>Filtravimas pagal kalba</button>
                

            </div>

                <LanguageFilterOverlay
                    show={showLanguageFilter}
                    onClose={handleOverlayClose}
                    selectedLanguages={selectedLanguages}
                    availableLanguages={filterAvailableLanguages()}
                    onSelectLanguage={handleLanguageSelection}
                    filterText={filterText}
                    onFilterTextChange={setFilterText}
                />
                
                <ProjectList 
                    selectedLanguages={selectedLanguages}
                    username={username}
                /></div>
    );
}

function AddProject() {
    return (
        <Link to="/addProject">
            <button >Pridėti Projektą</button>
        </Link>
    );
}

function ProjectList({ selectedLanguages, username }: { selectedLanguages: string[], username: string|undefined }) {
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
                const response = await axios.get('https://localhost:7054/api/Problem/SortedByDate');
                setProblems(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const filteredProblems = problems.filter(problem => {
  // Filter by Language
  if (selectedLanguages.length > 0) {
    if(problem.languages == null)
        {
            return false;
        }
    const problemLanguages = problem.languages.split(' ').map(lang => lang.trim());
    return selectedLanguages.some(lang => problemLanguages.includes(lang));
  }

  // Filter by Username
//   if (usernameFilter) { 
//     return problem.source.toLowerCase().includes(usernameFilter.toLowerCase());
//   }

  let token = localStorage.getItem('accessToken');
  switch (token) {
      case null:
          return null;
      default:
        if(problem.source == null)
            {
                return false;
            }
        const data: CustomJwtPayload = jwtDecode(token);
        return problem.source.toLowerCase().includes(username?.toLowerCase() as string);
  }



  // If no filters, return all projects
  return true;
});

    const isClosed = (closed:boolean) =>{
        if(closed){
            return(
                <>Uždarytas <span><img src={noCheck} alt='noCheck'/></span></>);
        }
        return (
        <>Aktyvus <span><img src={check} alt='checkmark'/></span></>
        );
    }
    const isPrivate = (priv:boolean) =>{
        if(priv){
            return(
            <>Privatus <span><img src={lock} alt='lock'/></span></>
        );
        }
        return (
            <>Viešas <span><img src={unlock} alt='unlock'/></span></>
        );
    }

//
    return (
        <Box p={3} sx={{ backgroundColor: '#335285', color: '#fff', borderRadius: '4px' }}>
            <Box style={{display: 'flex', gap: '30px'}}>
                <Box mb={2} display="flex" alignItems="center" marginLeft = '30px'>
                    <label htmlFor="startDate" style={{ marginRight: '10px'}}>Nuo:</label>
                    <TextField
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#344955',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#344955',
                                },
                            },
                        }}
                    />
                </Box>
                <Box mb={2} display="flex" alignItems="center">
                    <label htmlFor="endDate" style={{ marginRight: '10px' }}>Iki:</label>
                    <TextField
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#344955',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#344955',
                                },
                            },
                        }}
                    />
                </Box>
            </Box>
            <Container>
                <Grid container spacing={2} className='projects'>
                    {filteredProblems.slice((page - 1) * per_page, page * per_page).map(problem => (
                        <Grid item xs={12} key={problem.id}>
                            <Link to={`/Project?id=${problem.id}`} style={{ textDecoration: 'none' }}>
                                <Box
                                    className='project'
                                    sx={{
                                        backgroundColor: '#fff',
                                        borderRadius: '4px',
                                        padding: '16px',
                                        color: '#000',
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                        },
                                    }}
                                >
                                    <Box className='projectInfo'>
                                        <p className='largerText' style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{problem.title}</p>
                                        <p>Paskelbė: <Link to={`/profile/${problem.source}`} style={{ color: '#335285' }}>{problem.source}</Link></p>
                                        <Box className='languageBox' display="flex" alignItems="center">
                                            <img src={langImg} alt="languege" />
                                            <span className='languages' style={{ marginLeft: '8px' }}>{problem.languages}</span>
                                        </Box>
                                        <p>Paskutinis atnaujinimas: {problem.lastUpdate}</p>
                                    </Box>
                                    <Box className='projectState'>
                                        <p className='largerText' style={{ fontSize: '1.25rem' }}>{isClosed(problem?.isClosed)}</p>
                                        <p className='largerText' style={{ fontSize: '1.25rem' }}>{isPrivate(problem?.isPrivate)}</p>
                                    </Box>
                                </Box>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
                <Pagination
                    count={Math.max(1, Math.ceil(filteredProblems.length / per_page))}
                    page={page}
                    onChange={hangleChange}
                    sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                />
                
            </Container>
        </Box>
        
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
export default UserProjects;
