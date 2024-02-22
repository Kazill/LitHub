import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import DeleteProject from './deleteProject';

interface Project {
    id: number;
    title: string;
    about: string;
    languages: string;
    gitHubLink: string;
    lastUpdated: string;
}

function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchProjects(); // Fetch projects when the component mounts
    }, []);

    const fetchProjects = async () => {
        try {
            // Fetch projects from your backend API
            const response = await fetch('https://localhost:7054/api/Project'); // Adjust the API endpoint accordingly
            const data = await response.json();
            setProjects(data); // Update the projects state with the fetched data
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const deleteProject = async (projectId: number) => {
        try {
            // Send a delete request to your backend API
            await fetch(`https://localhost:7054/api/Project/${projectId}`, {
                method: 'DELETE'
            });
            // If the delete request is successful, remove the project from the state
            setProjects(projects.filter(project => project.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div>
            <center><h1>Project list</h1></center>
            <ProjectList projects={projects} deleteProject={deleteProject} />
            <AddProject />
        </div>
    );
}

function AddProject() {
    return (
        <Link to="/addProject">
            <button>Add new project</button>
        </Link>
    );
}

function ProjectList({ projects, deleteProject }: { projects: Project[], deleteProject: (projectId: number) => void }) {
    return (
        <div>
            {projects.map(project => (
                <div key={project.id}>
                    <Link to={`/project/${project.id}`}>
                        <h2>{project.title}</h2>
                    </Link>
                    <Link to={project.gitHubLink}>
                        <p>GitHub Link</p>
                    </Link>
                    <p>Languages: {project.languages}</p>
                    <p>About: {project.about}</p>
                    <p>Last updated: {project.lastUpdated}</p>
                    <DeleteProject onDelete={() => deleteProject(project.id)} />
                    <Link to={`/editProject/${project.id}`}>
                        <button>Edit</button>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default Projects;