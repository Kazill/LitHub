import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

interface ProblemData {
    id: number;
    title: string;
    description: string;
    lastUpdate: string;
    languages: string;
    link: string;
    source: string;
}

const EditProject: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState<ProblemData>({
        id: 0,
        title: "",
        description: "",
        lastUpdate: "",
        languages: "",
        link: "",
        source: ""
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const projectId = parseInt(searchParams.get("id") || "0", 10);
        fetchProject(projectId);
    }, [location.search]);

    const fetchProject = async (id: number) => {
        try {
            const response = await axios.get(`https://localhost:7054/api/Problem/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagsChange = (_: any, values: string[]) => {
        setFormData({ ...formData, languages: values.join(', ') });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.put(`https://localhost:7054/api/Problem/${formData.id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response from server:', response.data);
            navigate(`/project?id=${formData.id}`);
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <div>
            <center><h1>Redaguoti projektą</h1></center>
            <form onSubmit={handleSubmit}>
                <p>Pavadinimas: {' '} <TextField value={formData.title} onChange={handleInputChange} name="title" /></p>
                <p>Aprašymas: {' '} <TextField multiline={true} value={formData.description} onChange={handleInputChange} name="description" /></p>
                <p>Kalbos: {' '}
                    <Autocomplete
                        multiple
                        options={["JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "TypeScript", "Swift", "PHP"]}
                        value={formData.languages.split(', ')}
                        onChange={handleTagsChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </p>
                <p>GitHub nuoroda: {' '} <TextField value={formData.link} onChange={handleInputChange} name="link" /></p>
                <button type="submit">Išsaugoti</button>
            </form>
        </div>
    );
}

export default EditProject;