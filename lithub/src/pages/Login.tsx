import {
    Typography,
    Button,
    Box,
    Container,
    Checkbox, FormControlLabel, TextField
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle} from "@mui/icons-material";
import axios from "axios";
const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        UserName: '',
        Password: '',
        Role: ''
    });
    const updateRoleInBackend = (newRole: string) => {
        // Send request to update role in the backend
        fetch('https://localhost:7054/api/Roles/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Name: newRole }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update role');
                }
                return response.json();
            })
            .then(data => {
                console.log('Role updated successfully:', data);
            })
            .catch(error => {
                console.error('Error updating role:', error);
            });
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const response = await axios.post('https://localhost:7054/api/User/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            localStorage.setItem('accessToken', response.data)
            await updateRoleInBackend(formData.Role);
            navigate('/');
        }catch (e) {
            console.error('Error submitting form:', e);
        }

    };
    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value;
        setFormData({...formData,"Role":newRole})
    };

    return(
        <Container maxWidth="xs">
            <Box sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
              <Typography variant="h5">Prisijungimas</Typography>
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
                    autoComplete="current-password"
                    onChange={handleInputChange}
                />
                {/*<FormControlLabel*/}
                {/*    control={<Checkbox value="remember" color="primary" />}*/}
                {/*    label="Remember me"*/}
                {/*/>*/}
                <Typography>Rolė:</Typography>
                <select id="role" onChange={handleRoleChange} defaultValue={"Administratorius"}>
                    <option value="Administratorius">Administratorius</option>
                    <option value="Prisiregistravęs">Prisiregistravęs</option>
                    <option value="Patvirtinas">Patvirtinas</option>
                </select>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Prisijungti
                </Button>
            </Box>
        </Container>
    )
}
export default Login;