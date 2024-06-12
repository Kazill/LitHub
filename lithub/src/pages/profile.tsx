import {Box, Button, Container, Grid, Pagination, TextField, Typography} from '@mui/material';
import axios from 'axios';
import { JwtPayload, jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import noCheck from "./img/nocheck.png";
import check from "./img/check.png";
import lock from "./img/lock.png";
import unlock from "./img/unlocked.png";
import langImg from "./img/lang.png";
import {FaStar} from "react-icons/fa";
import {AiOutlineClose} from "react-icons/ai";

interface UserProfile {
  id: number;
  userName: string;
  email: string;
  company: string;
  githubProfile: string;
  phoneNumber: string;
  role: string;
  imageLink: string;
  about:string;
  // Add other fields as needed
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
interface CustomJwtPayload extends JwtPayload {
  username: string;
  role: string;
  // Add other custom properties if needed
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { username } = useParams<{ username: string }>();
  const [flag, setflag] = useState<boolean>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');

  const [usernameFilter, setUsernameFilter] = useState('');
  const [showUserFilter, setShowUserFilter] = useState(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [userRole, setUserRole] = useState('Svečias');
  useEffect(() => {
    let token=localStorage.getItem('accessToken')
    if (token === null) {
      setUserRole("Svečias")
    } else {
      const data: CustomJwtPayload = jwtDecode(token)
      setUserRole(data.role)
    }
  }, []);

  const toggleUserFilter = () => {
    setShowUserFilter(!showUserFilter);
  };

  useEffect(() => {
    // Set sample available languages
    setAvailableLanguages(["JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "TypeScript", "Swift", "PHP"]);
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`https://localhost:7054/api/User/username/${username}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleConfirmation = async (userId: string) => {
    await axios.post(`https://localhost:7054/api/User/AskConf/${username}`);
    window.location.reload()
  }

  const getStatus = async (username: string | undefined) => {
    if (typeof username == "string") {
      const response = await axios.get(`https://localhost:7054/api/User/Waitting/${username}`);
      setflag(response.data)
    }
  }

  useEffect(() => {
    getStatus(username)
  }, [username])

  const handleConfirmationRequest = () => {
    if (userRole === "Prisiregistravęs") {
      let token = localStorage.getItem('accessToken')
      switch (token) {
        case null:
          return null
        default:
          const data: CustomJwtPayload = jwtDecode(token)
          if (data.username === username) {
            if (flag === true) {
              return <Button variant="contained" onClick={() => handleConfirmation(data.username)} style={{ background: '#3f5581' }}>Prašyti patvirtinti paskyrą</Button>
            }
          }
      }
    }
    return null;
  };

  const handleGithubLink = () => {
    if (userProfile?.role === "Prisiregistravęs") {
      if (userProfile?.githubProfile !== null) {
        return (
            <>
            <p style={{ marginBottom: '5px', color: "white" }}>Github adresas:</p>
            <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
              <Typography style={{ margin: 0,textAlign:"left" }}><a href={userProfile?.githubProfile}>{userProfile?.githubProfile}</a></Typography>
            </div>
            </>
        );
      }
      else {
        return null;
      }
    }
    return null;
  };

  const handleCompanyName = () => {
    if (userProfile?.role === "Patvirtinas") {
      if (userProfile?.company !== null) {
        return (
            <>
            <p style={{ marginBottom: '5px', color: "white" }}>Įmonė:</p>
            <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
              <Typography style={{ margin: 0,textAlign:"left" }}>{userProfile?.company}</Typography>
            </div>
          </>
        );
      }
      else {
        return null;
      }
    }
    return null;
  };

  const handleAdminPrivileges = () => {
    let token = localStorage.getItem('accessToken')
    switch (token) {
      case null:
        return (null);
      default:
        const data: CustomJwtPayload = jwtDecode(token)
        if (userRole === "Administratorius" && userProfile?.role === "Prisiregistravęs") {
          return (
            <Button variant="contained" onClick={() => handleApproveUser(userProfile?.id)} style={{ background: '#3f5581' }}>Patvirtinti naudotoją</Button>
          );
        } else if (userRole === "Administratorius" && userProfile?.role === "Patvirtinas") {
          return (
            <Button variant="contained" onClick={() => handleRevokeUser(userProfile?.id)} style={{ background: '#3f5581' }}>Panaikinti patvirtinto naudotojo statusą</Button>
          );
        }
        else {
          return (null);
        }
    }
  };

  const handleApproveUser = async (userId: number) => {
    // Logic to approve the user
    console.log("Approving user...");
    try {
      const response = await fetch(`https://localhost:7054/api/User/Approve/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Only parse the response as JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log('User approved:', data);
        // Update local state
        setUserProfile(prev => prev ? { ...prev, role: "Patvirtinas" } : null);
      } else {
        console.log('User approved, no content returned');
        // Update local state
        setUserProfile(prev => prev ? { ...prev, role: "Patvirtinas" } : null);
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
    try {
      const response = await fetch(`https://localhost:7054/api/Admin/ApproveUser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      console.log('User approved');
      // Update local state to reflect the change in role
      setUserProfile(prev => prev ? { ...prev, role: "Patvirtinas" } : null);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRevokeUser = async (userId: number) => {
    // Logic to revoke the user
    console.log("Revoking user approval...");
    try {
      const response = await fetch(`https://localhost:7054/api/User/Revoke/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Only parse the response as JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log('User approval revoked:', data);
        // Update local state
        setUserProfile(prev => prev ? { ...prev, role: "Prisiregistravęs" } : null);
      } else {
        console.log('User approval revoked, no content returned');
        // Update local state
        setUserProfile(prev => prev ? { ...prev, role: "Prisiregistravęs" } : null);
      }
    } catch (error) {
      console.error('Error revoking approval user:', error);
    }
    try {
      const response = await fetch(`https://localhost:7054/api/Admin/RevokeUser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      console.log('User approval revoked');
      // Update local state to revert the role change
      setUserProfile(prev => prev ? { ...prev, role: "Prisiregistravęs" } : null);
    } catch (error) {
      console.error('Error revoking user:', error);
    }
  };

  const handleEditCall= () =>{
    let token = localStorage.getItem('accessToken')
    if (token !== null) {
      const data: CustomJwtPayload = jwtDecode(token)
      if (username === data.username) {
        return <Button variant="contained" href={`/profile-edit/${username}`} style={{background: '#3f5581'}}>Redaguoti
          profilį</Button>
      }
    }
  }


  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '30px', minHeight: '100vh' }}>
      <div><h1>Profilis</h1></div>
      <div style={{ display: 'flex', width: '100%', marginBottom: '20px' }}>{handleEditCall()}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
        <div style={{ width: '45%', padding: '20px', background: '#335285', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p style={{ marginBottom: '10px', color: "white" }}>El. paštas:</p>
          <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
            <Typography style={{ margin: 0, textAlign: 'left' }}>{userProfile?.email}</Typography>
          </div>
          <p style={{ marginBottom: '10px', color: "white" }}>Tel. nr.:</p>
          <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
            <Typography style={{ margin: 0, textAlign: 'left' }}>{userProfile?.phoneNumber}</Typography>
          </div>
        </div>
        <div style={{ width: '45%', padding: '20px', background: '#335285', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '20px', color: "white" }}>{userProfile.userName}</h2>
            <img
              src={userProfile.imageLink}
              style={{ width: '100px', height: '100px', marginBottom: '20px' }}
              alt="Profilio nuotrauka"
            />
            <div>
              <br></br>
              {handleConfirmationRequest()}
              <br />
              {handleAdminPrivileges()}
            </div>
          </div>
      </div>
      <div style={{ padding: '20px', background: '#335285', marginBottom: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {handleGithubLink()}
        {handleCompanyName()}
        <p style={{color: "white"}}>Aprašymas:</p>
        <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
          <Typography style={{ margin: 0, textAlign: 'left' }}>{userProfile?.about}</Typography>
        </div>
      </div>
      {userProfile.role==="Prisiregistravęs" ?(
      <div style={{padding: '10px', minHeight: '100vh'}}>
        <div><h1>Tvarkomos problemos</h1></div>

        <div style={{padding: '10px', background: '#335285', display: 'flex', gap: '10px'}}>
          <button onClick={toggleLanguageFilter}>Filtravimas pagal kalba</button>
          <Box style={{display: 'flex', gap: '30px'}}>
            <Box mb={2} display="flex" alignItems="center" marginLeft = '30px'>
              <label htmlFor="startDate" style={{ marginRight: '10px', color: "white" }}>Nuo:</label>
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
              <label htmlFor="endDate" style={{ marginRight: '10px', color: "white"  }}>Iki:</label>
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
            startDate={startDate}
            endDate={endDate}
            userId={userProfile.id}
        />
      </div>
      ):(<></>)}

    </div>
  );
};

function ProjectList({ selectedLanguages, startDate, endDate,userId}: { selectedLanguages: string[], startDate: string, endDate: string, userId: number }) {
  const [problems, setProblems] = useState<ProblemData[]>([]);

  const [page, setPage] = useState(1);

  const marks = SetMarked();
  const per_page = 5;

  const hangleChange = (e: any, p: React.SetStateAction<number>) =>{
    setPage(p);

  }
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`https://localhost:7054/api/User/work/${userId}`);
        setProblems(response.data);
      } catch (error) {
        // Handle the error or log it
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const filteredProblems = problems.filter(problem => {
    var lang = true;
    var stdate = true;
    var endate = true;
    var user = true;
    // Filter by Language
    if (selectedLanguages.length > 0) {
      if(problem.languages == null)
      {
        lang = false;
      }
      else{
        const problemLanguages = problem.languages.split(' ').map(lang => lang.trim());
        lang = selectedLanguages.some(lang => problemLanguages.includes(lang));
      }
    }

    if(startDate){
      if(problem.lastUpdate == null){
        stdate = false;
      }
      else if(startDate > problem.lastUpdate){
        stdate = false;
      }
      else{
        stdate = true;
      }
    }
    if(endDate){
      if(problem.lastUpdate == null){
        endate = false;
      }
      else if(problem.lastUpdate> endDate){
        endate = false;
      }
      else{
        endate = true;
      }
    }



    // If no filters, return all projects
    return lang && stdate && endate;
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
              sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px',
                '& .MuiPaginationItem-root': {
                  color: 'white',
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: 'white',
                },
                '& .Mui-selected': {
                  backgroundColor: 'rgba(192,192,192,0.16)',
                  color: 'white',
                },
                '& .MuiPaginationItem-icon': {
                  color: 'white',
                },}}
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

export default Profile;
