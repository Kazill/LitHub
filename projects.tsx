import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

interface ProblemData {
    id: number,
    title: string,
    lastUpdate: string,
    languages: string,
    source: string
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
                <ProjectList />
                <AddProject />
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
            {filteredProblems.map(problem => (
                <div key={problem.id}>
                    <h2><Link to={`/Project?id=${problem.id}`}>
                        {problem.title}
                    </Link></h2>
                    <p>Įkėlėjas: {problem.source}</p>
                    <p>Kalbos: {problem.languages}</p>
                    <p>Paskutinis atnaujimimas: {problem.lastUpdate}</p>
                </div>
            ))}
        </div>
    );
}

export default Projects;