import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Autocomplete, Box, Button, Container, Grid, Pagination, TextField } from '@mui/material';

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
        setFormData({ ...formData, languages: values.join(' ') });
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
        <div style={{ display: 'flex', flexDirection: 'column', padding: 30 }}>
            
            <center><h1 style={{ margin: '20px 0' }}>Redaguoti projektą</h1></center>
            <form onSubmit={handleSubmit}>
                <div style={{ background: '#335285', borderRadius: '4px', padding: '20px', marginBottom: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label style={{ color: '#fff', marginBottom: '8px' }}>Pavadinimas:</label>
                    <TextField 
                        fullWidth 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        name="title" 
                        variant="outlined" 
                        size="small" 
                        sx={{
                            mt: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
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
                </div>
                <div style={{ background: '#335285', borderRadius: '4px', padding: '20px', marginBottom: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label style={{ color: '#fff', marginBottom: '8px' }}>Aprašymas:</label>
                    <TextField 
                        fullWidth 
                        multiline 
                        rows={4} 
                        value={formData.description} 
                        onChange={handleInputChange} 
                        name="description" 
                        variant="outlined" 
                        size="small" 
                        sx={{
                            mt: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
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
                </div>
                <div style={{ background: '#335285', borderRadius: '4px', padding: '20px', marginBottom: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label style={{ color: '#fff', marginBottom: '8px' }}>Kalbos:</label>
                    <Autocomplete
                        fullWidth
                        multiple
                        options={["JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "TypeScript", "Swift", "PHP"]}
                        value={formData.languages.split(' ')}
                        onChange={handleTagsChange}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                variant="outlined" 
                                size="small" 
                                sx={{
                                    mt: 1,
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
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
                        )}
                    />
                </div>
                <div style={{ background: '#335285', borderRadius: '4px', padding: '20px', marginBottom: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label style={{ color: '#fff', marginBottom: '8px' }}>GitHub nuoroda:</label>
                    <TextField 
                        fullWidth 
                        value={formData.link} 
                        onChange={handleInputChange} 
                        name="link" 
                        variant="outlined" 
                        size="small" 
                        sx={{
                            mt: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
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
                </div>
                <Button 
                    variant="contained" 
                    type="submit" 
                    sx={{ background: '#3f5581', color: '#fff', '&:hover': { background: '#2e3d6d' } }}
                >
                    Išsaugoti
                </Button>
            </form>
        </div>
    );
    

    /*
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
                        value={formData.languages.split(' ')}
                        onChange={handleTagsChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </p>
                <p>GitHub nuoroda: {' '} <TextField value={formData.link} onChange={handleInputChange} name="link" /></p>
                <button type="submit">Išsaugoti</button>
            </form>
        </div>
    );
**/



}

export default EditProject;