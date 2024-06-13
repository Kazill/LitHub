import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Box, Button, Checkbox, Container, FormControlLabel, IconButton, InputAdornment, TextField,
    Typography
} from '@mui/material';

import testImage from './test.png';

const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('accessToken')!=null){
            navigate("/");
        }
    }, []);


    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
        Role: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        Email: '',
        Password: '',
        login: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        let isValid = true;
        let errors = { Email: '', Password: '', login: '' };

        if (!formData.Email) {
            errors.Email = 'El. paštas yra privalomas.';
            isValid = false;
        }

        if (!formData.Password) {
            errors.Password = 'Slaptažodis yra privalomas.';
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMessages({ ...errorMessages, [name]: '', login: '' });
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        setErrorMessages({ ...errorMessages, login: '' });

        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post('https://localhost:7054/api/User/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            localStorage.setItem('accessToken', response.data)
            window.location.reload();
            navigate('/');
        }catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response && e.response.status === 400) {
                    setErrorMessages({ ...errorMessages, login: 'Neteisingas el. paštas arba slaptažodis.' });
                    console.log("400 Error Message: ", e.response.data);
                } else {
                    console.error('Error submitting form:', e);
                }
            } else {
                console.error('An unexpected error occurred:', e);
            }
        }

    };

    return(
        <div style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
    <img 
        src={testImage} 
        alt="Guy" 
        style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            zIndex: -1, 
            opacity: 0.1 
        }} 
    /> 
        <Container maxWidth="xs">
            
            <Box sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
              <Typography variant="h4">Prisijungimas</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    style={{ background: '#6E83AC'}}
                    required
                    fullWidth
                    id="Email"
                    placeholder="El. paštas"
                    name="Email"
                    autoComplete="email"
                    autoFocus
                    error={Boolean(errorMessages.Email)}
                    onChange={handleInputChange}
                    InputProps={{ style: { color: '#b1b2b4', fontWeight: 'bold'  } }}
                    /*sx={{
                        mt: 0,
                        bgcolor: '#6E83AC',
                        border: '5px solid #335285',
                        borderRadius: 0,
                    }}*/
                />
                <TextField
                    margin="normal"
                    style={{ background: '#6E83AC' }}
                    required
                    fullWidth
                    name="Password"
                    placeholder="Slaptažodis"
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    autoComplete="current-password"
                    error={Boolean(errorMessages.Password)}
                    onChange={handleInputChange}
                    InputProps={{endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ), style: { color: '#b1b2b4', fontWeight: 'bold'  } }}
                    
                />
                {/*<FormControlLabel*/}
                {/*    control={<Checkbox value="remember" color="primary" />}*/}
                {/*    label="Remember me"*/}
                {/*/>*/}
                {errorMessages.login && (
                    <Typography color="error" align="center">{errorMessages.login}</Typography>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2,
                        bgcolor: '#335285',
                        border: '2px solid #797979',
                        borderRadius: 0,
                        width: 245,
                        }}
                >
                    Prisijungti
                </Button>
            </Box>
            <Box sx={{ mt: 10 }}>
                <Typography variant="h5">Neturi paskyros?</Typography>
                <Button href="/register" variant="contained" className="loginButton" sx={{ mt: 1, mb: 2,
                    bgcolor: '#335285',
                    border: '2px solid #797979',
                    borderRadius: 0,
                    width: 245
                }}> Registracija</Button>
            </Box>
        </Container>
        </div>
    )
}
export default Login;