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

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://localhost:7054/api/Problem');
                console.log(response.data);
                setProblems(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`https://localhost:7054/api/Problem/${id}`);
            setProblems(problems.filter(problem => problem.id !== id));
        } catch (error) {
            // Handle the error or log it
            console.error(error);
        }
    };

    return (
        <div>
            {problems.map(problem => (
                <div key={problem.id}>
                    <h2><Link to={`/Project?id=${problem.id}`}>
                        {problem.title}
                    </Link></h2>
                    <p>Įkėlėjas: {problem.source}</p>
                    <p>Kalbos: {problem.languages}</p>
                    <p>Paskutinis atnaujimimas: {problem.lastUpdate}</p>
                    <button onClick={() => handleDelete(problem.id)}>Šalinti</button>
                    <Link to={`/editProject?id=${problem.id}`}>
                        <button>Redaguoti</button>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default Projects;