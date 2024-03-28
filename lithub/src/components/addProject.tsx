import React, { useState } from 'react';
import { TextField, Button, Autocomplete } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const languagesList = ["JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "TypeScript", "Swift", "PHP"];

function getDate() {
    const today = new Date();
    return dayjs(today).format("YYYY-MM-DD");
}

function Project() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: 0,
        title: "",
        description: "",
        lastUpdate: getDate(),
        languages: [] as string[], // Initialize languages as an array of strings
        link: "",
        source: "user",
        isClosed: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLanguagesChange = (_: any, values: string[]) => {
        setFormData({ ...formData, languages: values });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('https://localhost:7054/api/Problem', {
                ...formData,
                languages: formData.languages.join(', ') // Convert array of languages to a comma-separated string
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Response from server:', response.data);
            navigate('/Projects');
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <div>
            <center><h1>Naujas projektas</h1></center>
            <p>Pavadinimas: {' '} <TextField onChange={handleInputChange} name="title" /></p>
            <p>Aprašymas: {' '} <TextField multiline={true} onChange={handleInputChange} name="description" /></p>
            <p>Kalbos: {' '} 
                <Autocomplete
                    multiple
                    options={languagesList}
                    onChange={handleLanguagesChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </p>
            <p>GitHub nuoroda: {' '} <TextField onChange={handleInputChange} name="link" /></p>
            <Button variant="contained" onClick={handleSubmit}>Išsaugoti</Button>
        </div>
    );
}

export default Project;
