import {Box, Button, Container, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { MuiTelInput, MuiTelInputInfo, matchIsValidTel } from 'mui-tel-input';

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
        Phone: ''
    });

    const validateForm = () => {
        let isValid = true;
        let errors = { UserName: '', Password: '',PasswordConfirm: '', Email: '',Phone: '' };

        if (!formData.UserName) {
            errors.UserName = 'Vartotojo vardas yra privalomas.';
            isValid = false;
        }

        if (!formData.Password) {
            errors.Password = 'Slaptažodis yra privalomas.';
            isValid = false;
        }
        if (!formData.PasswordConfirm) {
            errors.PasswordConfirm = 'Pakartoti slaptažodį yra privalomas.';
            isValid = false;
        }
        if (!formData.Email) {
            errors.Password = 'El. paštas yra privalomas.';
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
        if(formData.Password!=formData.PasswordConfirm){
            return;
        }
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
                    //setErrorMessages({ ...errorMessages, login: 'Neteisingas vartotojo vardas arba slaptažodis.' });
                    console.log("400 Error Message: ", e.response.data);
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

    return (<Container maxWidth="xs">
        <Box sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Typography variant="h5">Registracija</Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="UserName"
                label="Vartotojo vardas"
                name="UserName"
                autoComplete="username"
                autoFocus
                error={Boolean(errorMessages.UserName)}
                onChange={handleInputChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="Email"
                label="El. paštas"
                name="Email"
                autoComplete="email"
                error={Boolean(errorMessages.Email)}
                onChange={handleInputChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="Password"
                label="Slaptažodis"
                type="Password"
                id="Password"
                autoComplete="password"
                error={Boolean(errorMessages.Password)}
                onChange={handleInputChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="PasswordConfirm"
                label="Pakartoti slaptažodį"
                type="Password"
                id="PasswordConfirm"
                autoComplete="password"
                error={Boolean(errorMessages.PasswordConfirm)}
                onChange={handleInputChange}
            />
            <MuiTelInput
                margin="normal"
                required
                fullWidth
                label="Tel. nr"
                value={formData.PhoneNumber}
                defaultCountry='LT'
                error={Boolean(errorMessages.Phone)}
                onChange={handleChange}
            />
            {/*<FormControlLabel*/}
            {/*    control={<Checkbox value="remember" color="primary" />}*/}
            {/*    label="Remember me"*/}
            {/*/>*/}
            {/*errorMessages.login && (
                <Typography color="error" align="center">{errorMessages.login}</Typography>
            )*/}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Registruotis
            </Button>
        </Box>
    </Container>
    )
}
export default Register;