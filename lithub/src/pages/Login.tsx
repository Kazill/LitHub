import {
    Typography,
    Button,
    Box,
    Container,
    Checkbox, FormControlLabel, TextField
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle} from "@mui/icons-material";
const Login = () => {

    const handleSubmit = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get("email"),
            password: data.get("password"),
        });
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
                    id="email"
                    label="El. Paštas"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Slaptažodis"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                {/*<FormControlLabel*/}
                {/*    control={<Checkbox value="remember" color="primary" />}*/}
                {/*    label="Remember me"*/}
                {/*/>*/}
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