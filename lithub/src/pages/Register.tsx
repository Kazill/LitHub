import {Box, Button, Container, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { MuiTelInput, MuiTelInputInfo, matchIsValidTel } from 'mui-tel-input';
import testImage from './test.png';

const Register = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('accessToken')!=null){
            navigate("/");
        }
    }, []);


    const [formData, setFormData] = useState({
        UserName: '',
        Email: '',
        Password: '',
        PasswordConfirm: '',
        PhoneNumber: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        UserName: '',
        Password: '',
        PasswordConfirm: '',
        Email: '',
        Phone: '',
        Error:''
    });

    const validateForm = () => {
        let isValid = true;
        let errors = { UserName: '', Password: '',PasswordConfirm: '', Email: '',Phone: '',Error:'' };

        if (!formData.UserName) {
            errors.UserName = 'Vartotojo vardas yra privalomas.';
            isValid = false;
        }
        if (!formData.Email) {
            errors.Email = 'El. paštas yra privalomas.';
            isValid = false;
        }
        if(formData.Password!=formData.PasswordConfirm){
            errors.PasswordConfirm='Slaptažodžiai nesutampa.';
            isValid = false;
        }
        if (!formData.Password) {
            errors.Password = 'Slaptažodis yra privalomas.';
            isValid = false;
        }
        if (!formData.PasswordConfirm) {
            errors.PasswordConfirm = 'Pakartoti slaptažodį yra privaloma.';
            isValid = false;
        }
        if (!formData.PhoneNumber) {
            errors.Phone = 'Tel. nr yra privalomas.';
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMessages({ ...errorMessages, [name]: ''});
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        //setErrorMessages({ ...errorMessages, login: '' });
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post('https://localhost:7054/api/User/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            navigate('/login');
        }catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response && e.response.status === 400) {
                    e.response.data.forEach(function (response: any){
                        const { error, message } = response;
                        setErrorMessages({ ...errorMessages, [error]: message });
                        console.log(response)
                    })
                } else {
                    console.error('Error submitting form:', e);
                }
            } else {
                console.error('An unexpected error occurred:', e);
            }
        }

    };
    const handleChange = (newValue: string, info: MuiTelInputInfo) => {
        setFormData({...formData, PhoneNumber: newValue});
        setErrorMessages({ ...errorMessages, Phone: ''});
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
            <img src={testImage} alt="Guy" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, opacity: 0.1 }} /> 
        <Container maxWidth="xs">
        <Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
        </Box>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                style={{ background: '#6E83AC'}}
                required
                fullWidth
                id="UserName"
                placeholder="Naudotojo vardas"
                name="UserName"
                autoComplete="username"
                autoFocus
                error={Boolean(errorMessages.UserName)}
                onChange={handleInputChange}
                InputLabelProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
                }}
                InputProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
            }}
            />
            {errorMessages.UserName && (
                <Typography color="error" >{errorMessages.UserName}</Typography>
            )}
            <TextField
                margin="normal"
                style={{ background: '#6E83AC' }} 
                required
                fullWidth
                id="Email"
                placeholder="El. paštas"
                name="Email"
                autoComplete="email"
                error={Boolean(errorMessages.Email)}
                onChange={handleInputChange}
                InputLabelProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
                }}
                InputProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
            }}
            />
            {errorMessages.Email && (
                <Typography color="error" >{errorMessages.Email}</Typography>
            )}
            <TextField
                margin="normal"
                style={{ background: '#6E83AC' }} 
                required
                fullWidth
                name="Password"
                placeholder="Slaptažodis"
                type="Password"
                id="Password"
                autoComplete="password"
                error={Boolean(errorMessages.Password)}
                onChange={handleInputChange}
                InputLabelProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
                }}
                InputProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
            }}
            />
            {errorMessages.Password && (
                <Typography color="error"> {errorMessages.Password}</Typography>
            )}
            <TextField
                margin="normal"
                style={{ background: '#6E83AC' }} 
                required
                fullWidth
                name="PasswordConfirm"
                placeholder="Pakartoti slaptažodį"
                type="Password"
                id="PasswordConfirm"
                autoComplete="password"
                error={Boolean(errorMessages.PasswordConfirm)}
                onChange={handleInputChange}
                InputLabelProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
                }}
                InputProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
            }}
            />
            {errorMessages.PasswordConfirm && (
                <Typography color="error"> {errorMessages.PasswordConfirm}</Typography>
            )}
            <MuiTelInput
                margin="normal"
                style={{ background: '#6E83AC' }} 
                required
                fullWidth
                label="Tel. nr"
                value={formData.PhoneNumber}
                defaultCountry='LT'
                error={Boolean(errorMessages.Phone)}
                onChange={handleChange}
                InputLabelProps={{
                    style: { color: '#b1b2b4' } 
                }}
                InputProps={{
                    style: { color: '#b1b2b4', fontWeight: 'bold'  } 
            }}
            />
            {/*<FormControlLabel*/}
            {/*    control={<Checkbox value="remember" color="primary" />}*/}
            {/*    label="Remember me"*/}
            {/*/>*/}
            {errorMessages.Phone && (
                <Typography color="error" >{errorMessages.Phone}</Typography>
            )}
            {errorMessages.Error && (
                <Typography color="error" >{errorMessages.Error}</Typography>
            )}
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
            style={{ background: '#3f5581' }}
        >
        Registruotis
        </Button>
        </Box>
    </Container>
    </div>
    )
}
export default Register;