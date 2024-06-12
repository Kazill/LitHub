import {Button, TextField, Typography} from '@mui/material';
import axios from 'axios';
import { JwtPayload, jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from "../components/RichTextEditor";

interface UserProfile {
    id: number;
    userName: string;
    email: string;
    company: string;
    githubProfile: string;
    phoneNumber: string;
    role: string;
    imageLink: string;
    about: string;
    // Add other fields as needed
}

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}

const ProfileEdit: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('Svečias');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [errorMessages, setErrorMessages] = useState({
        email: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token === null) {
            setUserRole("Svečias");
            navigate('/');
        } else {
            const data: CustomJwtPayload = jwtDecode(token);
            setUserRole(data.role);
            if (username !== data.username) {
                navigate('/');
            }
        }
    }, [navigate, username]);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (selectedFile && userProfile) {
            try {
                const base64String = await fileToBase64(selectedFile);
                const formattedBase64String = base64String.split(',')[1] || base64String;

                const url = `https://localhost:7054/api/User/upload?id=${userProfile.id}`;
                const headers = {
                    'Content-Type': 'application/json',
                };

                const response = await axios.post(url, formattedBase64String, { headers });

                // Update the userProfile state with the new image link
                setUserProfile(prevProfile => prevProfile ? { ...prevProfile, imageLink: response.data } : prevProfile);

                return response.data;
            } catch (error) {
                console.error('Error uploading image:', error);
                throw error;
            }
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result?.toString() || "");
            reader.onerror = (error) => reject(error);
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserProfile(prevProfile => prevProfile ? { ...prevProfile, [name]: value } : prevProfile);
        if(name === "email"){
            setErrorMessages({ ...errorMessages, [name]: ''});
        }
    };

    const handleSave = async () => {
        if (userProfile) {
            try {
                const response = await axios.put(`https://localhost:7054/api/User/Update/${userProfile.id}`, {
                    email: userProfile.email,
                    company: userProfile.company || '', // Provide empty string if null
                    githubProfile: userProfile.githubProfile || '', // Provide empty string if null
                    phoneNumber: userProfile.phoneNumber,
                    imageLink: userProfile.imageLink || '', // Provide empty string if null
                    about: userProfile.about || '', // Provide empty string if null
                });
                setUserProfile(response.data);
                navigate(`/profile/${username}`);
            } catch (e) {
                if (axios.isAxiosError(e)) {
                    if (e.response && e.response.status === 400) {
                        e.response.data.forEach(function (response: any){
                            const { error, message } = response;
                            setErrorMessages({ ...errorMessages, [error.toLowerCase()]: message });
                            console.log(response)
                        })
                    } else {
                        console.error('Error submitting form:', e);
                    }
                } else {
                    console.error('An unexpected error occurred:', e);
                }
            }
        }
    };

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '30px', minHeight: '100vh' }}>
            <div><h1>Profilio redagavimas</h1></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
                <div style={{ width: '45%', padding: '20px', background: '#335285', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p style={{ marginBottom: '10px', color: "white" }}>El. paštas:</p>
                    <TextField
                        fullWidth
                        name="email"
                        value={userProfile.email}
                        required
                        onChange={handleChange}
                        error={Boolean(errorMessages.email)}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                            mt: 1,
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
                    {errorMessages.email && (
                        <Typography color="error" >{errorMessages.email}</Typography>
                    )}
                    <p style={{ marginBottom: '10px', color: "white" }}>Tel. nr.:</p>
                    <TextField
                        fullWidth
                        name="phoneNumber"
                        value={userProfile.phoneNumber}
                        onChange={handleChange}
                        required
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                            mt: 1,
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
                <div style={{ width: '45%', padding: '20px', background: '#335285', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ marginBottom: '20px', color: "white" }}>{userProfile.userName}</h2>
                    <img
                        src={userProfile.imageLink}
                        style={{ width: '100px', height: '100px', marginBottom: '20px' }}
                        alt="Profilio nuotrauka"
                    />
                    <div>
                        {userRole && localStorage.getItem('accessToken') && jwtDecode<CustomJwtPayload>(localStorage.getItem('accessToken')!).username === username && (
                            <div>
                                <input style={{color:"white"}} type="file" accept="image/*" onChange={handleFileChange} />
                                <br />
                                <br />
                                <Button variant="contained" onClick={handleUpload} style={{ background: '#3f5581' }}>Atnaujinti nuotrauką</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ padding: '20px', background: '#335285', marginBottom: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {userProfile.role === "Prisiregistravęs" && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                        <p style={{ marginBottom: '5px', color: "white" }}>Github adresas:</p>
                        <TextField
                            fullWidth
                            name="githubProfile"
                            value={userProfile.githubProfile}
                            onChange={handleChange}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                mt: 1,
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
                )}
                {userProfile.role === "Patvirtinas" && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                        <p style={{ marginBottom: '5px', color: "white" }}>Įmonė:</p>
                        <TextField
                            fullWidth
                            name="company"
                            value={userProfile.company}
                            onChange={handleChange}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                mt: 1,
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
                )}
                <p style={{color: "white"}}>Aprašymas:</p>
                <TextField
                    fullWidth
                    name="about"
                    value={userProfile.about}
                    onChange={handleChange}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                        mt: 1,
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
            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', marginBottom: '20px', gap: '10px' }}>
                <Button variant="contained" style={{ background: '#3f5581' }} onClick={handleSave}>Išsaugoti</Button>
                <Button variant="contained" href={`/profile/${username}`} style={{ background: '#ff0000' }}>Nutraukti</Button>
            </div>
        </div>
    );
};

export default ProfileEdit;
