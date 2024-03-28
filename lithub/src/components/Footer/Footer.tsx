import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import './Footer.css'; // Import the CSS file for styling

const Footer: React.FC = () => {
    return (
        <AppBar position="static" color="default" className="footer">
            <Toolbar>
                <Typography variant="h6" color="black" sx={{ flexGrow: 1 }}>
                    &copy; 2024 Lithub. All rights reserved.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button href="" sx={{ color: 'black', mx: 1 }}>Slapukų politika</Button>
                    <Button href="" sx={{ color: 'black', mx: 1 }}>Privatumo politika</Button>
                    <Button href="" sx={{ color: 'black', mx: 1 }}>Kontaktai</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Footer
