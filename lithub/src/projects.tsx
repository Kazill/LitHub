import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import {jwtDecode, JwtPayload} from "jwt-decode";
import { FaStar } from "react-icons/fa";
import {Container, Grid, Pagination, Typography} from '@mui/material';

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

interface markedData{
    problemId: number
}

function Projects() {
    const [selectedRole, setSelectedRole] = useState('');




    useEffect(() => {
        // Fetch initial role when component mounts
        fetchRole();
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
    if (selectedRole === "Patvirtinas"){
        return (
            <div>
                <center><h1>Projektų sąrašas</h1></center>
                <AddProject />
                <ProjectList />
            </div>
        ); 
    }
    else{
        return (
            <div>
                <center><h1>Projektų sąrašas</h1></center>
                <ProjectList />
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

function ProjectList() {
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
        if (startDate && endDate) {
            return problem.lastUpdate >= startDate && problem.lastUpdate <= endDate;
        }
        return true; // If no dates are selected, return all problems
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

function SetMarked(){
    const [marks, setMarks] = useState<markedData[]>([]);
    useEffect(() => {
        let username = "";
        let token=localStorage.getItem('accessToken')
        if(token != null){
                const data :CustomJwtPayload=jwtDecode(token);
                username = data.username;
        }
        async function fetchData()  {
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

function IsMarked(marks:markedData[], id:number){
    if(marks.find(x=> x.problemId === id) === undefined){
        return(null);
    }
    return(<FaStar />);
}

export default Projects;
