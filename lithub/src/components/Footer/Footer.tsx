import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import './Footer.css'; // Import the CSS file for styling

const Footer: React.FC = () => {
    return (
        <AppBar position="static" sx={{bgcolor: '#335285'}} className="footer">
            <Toolbar>
                <Typography color="white" sx={{ flexGrow: 1 }}>
                    IT PROJEKTŲ IR NEATLYGINTINŲ
                    <br/>
                    IT SPECIALISTŲ PLATFORMA
                </Typography>
                <Typography color="white" sx={{ flexGrow: 1 }}>
                    El. pašto adresas: lithub@ktu.lt
                </Typography>
                <Typography color="white" sx={{ flexGrow: 1 }}>
                    &copy; Visos teisės saugomos
                </Typography>
                
                
            </Toolbar>
        </AppBar>
    );
}

export default Footer
