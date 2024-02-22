import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Project {
    id: number;
    title: string;
    about: string;
    languages: string;
    gitHubLink: string;
    lastUpdated: string;
}

function EditProject() {
    const { projectId } = useParams<{ projectId?: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<Project>({
        id: projectId ? parseInt(projectId) : 0,
        title: '',
        about: '',
        languages: '',
        gitHubLink: '',
        lastUpdated: ''
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`https://localhost:7054/api/Project/${projectId}`);
                const data = await response.json();
                setProject(data);
                setFormData(data);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
    
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    if (!project) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`https://localhost:7054/api/Project/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            alert('Project updated successfully!');
            // Redirect to start after updating
            window.location.href = '/'; // You can replace '/' with the desired URL
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <div>
            <h1>Edit Project</h1>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
                </div>
                <div>
                    <label>About:</label>
                    <textarea name="about" value={formData.about} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Languages:</label>
                    <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} />
                </div>
                <div>
                    <label>GitHub Link:</label>
                    <input type="text" name="gitHubLink" value={formData.gitHubLink} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Last Updated:</label>
                    <input type="text" name="lastUpdated" value={formData.lastUpdated} onChange={handleInputChange} />
                </div>
                <div>
                    <button type="submit">Update Project</button>
                </div>
            </form>
        </div>
    );
}

export default EditProject;