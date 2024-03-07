import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle} from "@mui/icons-material";

//Switch navbar buttons according to the user role for desktop
function OptionsForDesktop(role: string){
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    switch (role){
        case "Svečias":
            return(<div><Button href='' sx={{color: 'black'}}>Registruotis</Button>
                <Button href='/login'
                    sx={{
                    color: 'white',
                    background: 'green',
                    ":hover": {background: '#00a600'}                 }}
            >
                Prisijungti
            </Button></div>);
        default:
            return(<div>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Paskyra</MenuItem>
                    <MenuItem onClick={handleClose}>Atsijungti</MenuItem>
                </Menu>
            </div>);
    }
}
//Switch navbar buttons according to the user role for mobile
function OptionsForMobile(role: string){
    switch (role){
        case "Svečias":
            return(<div>
                <MenuItem>
                    <Button href='' sx={{ color: 'black' }}>Registruotis</Button>
                </MenuItem>
                <MenuItem>
                    <Button href='/login'
                            sx={{
                                color: 'white', background: 'green',
                             ":hover": { background: '#00a600' }
                            }}
                    >
                        Prisijungti
                    </Button>
                </MenuItem>
            </div>);
        default:
            return(<div>
                <MenuItem>
                    <Button href='' sx={{ color: 'black' }}>Paskyra</Button>
                </MenuItem>
                <MenuItem>
                <Button href=''
                        sx={{
                            color: 'white',
                            background: 'green',
                            ":hover": {background: '#00a600'}                 }}
                >
                    Atsijungti
                </Button>
                </MenuItem>
            </div>);
    }

}
const Nav: React.FC<{}> = () => {
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        // Fetch initial role when component mounts
        fetchRole();
    }, []);

    const fetchRole = () => {
        fetch('https://localhost:7054/api/Roles')
            .then(response => response.json())
            .then(role => {
                // Process the data received from the backend
                setSelectedRole(role ? role.name : 'error in role format');
            })
            .catch(error => console.error('Error fetching role:', error));
    };
    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value;
        // Update selected role in the backend
        updateRoleInBackend(newRole);

        // Update selected role in the frontend
        setSelectedRole(newRole);
    };

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


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <select id="roleSelect" value={selectedRole} onChange={handleRoleChange}>
                    <option value="Administratorius">Administratorius</option>
                    <option value="Svečias">Svečias</option>
                    <option value="Prisiregistravęs">Prisiregistravęs</option>
                    <option value="Patvirtinas">Patvirtinas</option>
                </select>
            </MenuItem>
            <MenuItem>
                <Button href='/' sx={{ color: 'black' }}>Laisvai platinami kodai</Button>
            </MenuItem>
            <MenuItem>
                <Button href='/projects' sx={{ color: 'black' }}>Projektai</Button>
            </MenuItem>
            <MenuItem>
                <Button href='' sx={{ color: 'black' }}>Kas tai?</Button>
            </MenuItem>
            {OptionsForMobile(selectedRole)}
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static' color='default'>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        color='green'
                        to="/"
                        sx={{ textDecoration: 'none', display: { xs: 'block', sm: 'block' } }}
                    >
                        Neatlyginta IT sistema
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <select id="roleSelect" value={selectedRole} onChange={handleRoleChange}>
                            <option value="Administratorius">Administratorius</option>
                            <option value="Svečias">Svečias</option>
                            <option value="Prisiregistravęs">Prisiregistravęs</option>
                            <option value="Patvirtinas">Patvirtinas</option>
                        </select>
                        <Button href='/' sx={{ color: 'black' }}>Pagrindinis</Button>
                        <Button href='/projects' sx={{ color: 'black' }}>Projektai</Button>
                        <Button href='' sx={{ color: 'black' }}>Kas tai?</Button>
                        {OptionsForDesktop(selectedRole)}
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </Box>);
}
export default Nav;