import React, { SyntheticEvent, useState } from 'react';
import { TextField, Button, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    userid: number
    // Add other custom properties if needed
}



const languagesList = ["JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "TypeScript", "Swift", "PHP"];

function getDate() {
    const today = new Date();
    return dayjs(today).format("YYYY-MM-DD");
}

function Project() {
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken');
    let userid = 0;
    let username = "user";
    if (token) {
        const decoded: CustomJwtPayload = jwtDecode(token);
        userid = decoded.userid;
        username = decoded.username;
    }

    const [formData, setFormData] = useState({
        id: 0,
        title: "",
        description: "",
        lastUpdate: getDate(),
        languages: [] as string[], // Initialize languages as an array of strings
        link: "",
        source: username,
        isClosed: false,
        isPrivate: false,
        sourceId: userid
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const { name } = e.target;
        setFormData({ ...formData, [name]: checked });
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
        <div style={{ display: 'flex', flexDirection: 'column', padding: 30 }}>
            {/* Links should not be centered if they inherit centering from .main */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20 }}>
                <Link to="/" className="link-as-text">Pagrindinis</Link>
                <span> / </span>
                <Link to="/projects" className="link-as-text">Projektai</Link>
                <span> / </span>
                <Link to="/addProject" className="link-as-text">Projekto kūrimas</Link>
            </div>
            {/* Only the title is centered */}
            {/* /*<div style={{ textAlign: 'center', background: '#6E83AC', padding: '20px', marginBottom: '20px' }}> */}
            <h1 style={{ margin: '20px 0' }}>Naujas projektas</h1>
            {/* </div> */}
            {/* Other fields aligned flex-start or default */}
            <div style={{ background: '#6E83AC', padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label>
                    Pavadinimas:
                </label>
                <TextField fullWidth onChange={handleInputChange} name="title" style={{ marginTop: 8 }} />
            </div>
            <div style={{ background: '#6E83AC', padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label>
                    Aprašymas:
                </label>
                <TextField multiline fullWidth rows={4} onChange={handleInputChange} name="description" style={{ marginTop: 8 }} />
            </div>
            <div style={{ background: '#6E83AC', padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label>
                    Kalbos:
                </label>
                <Autocomplete
                    fullWidth
                    multiple
                    options={languagesList}
                    onChange={handleLanguagesChange}
                    renderInput={(params) => <TextField {...params} style={{ marginTop: 8 }} />}
                />
            </div>
            <div style={{ display: 'flex', padding: '20px 0', marginBottom: '20px' }}>
                <div style={{ background: '#6E83AC', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px', flexGrow: 0 }}>
                    <FormControlLabel required control={<Checkbox onChange={handleCheckboxChange} name="isPrivate" />} label="Privatus projektas" />
                </div>
                <div style={{ padding: '10px' }}></div>
                <div style={{ background: '#6E83AC', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
                    <label style={{ marginLeft: 20 }}>GitHub nuoroda:</label>
                    <TextField fullWidth onChange={handleInputChange} name="link" style={{ marginTop: 8 }} />
                </div>
            </div>

            <Button variant="contained" onClick={handleSubmit} style={{ background: '#3f5581' }}>Išsaugoti</Button>
        </div>
    );



}

export default Project;
