import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem } from "@mui/material";
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle} from "@mui/icons-material";
import {jwtDecode, JwtPayload} from "jwt-decode";
import LogoutIcon from '@mui/icons-material/Logout';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}

//Switch navbar buttons according to the user role for desktop
function OptionsForDesktop(role: string){
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        fetch('https://localhost:7054/api/Roles/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Name: "Svečias" }),
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
        navigate('/');
    };
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    let token=localStorage.getItem('accessToken')
    switch (token){
        case null:
            return(<></>);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
            return(<div>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle sx={{color:'white'}}/>
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
<MenuItem component={Link} to={`/profile/${data.username}`} onClick={handleClose}>
    {data.username}
</MenuItem>
                    {/*<MenuItem onClick={handleClose}>Paskyra</MenuItem>*/}
                </Menu>
                <Button onClick={handleLogout} sx={{color: 'white'}}><LogoutIcon/></Button>
            </div>);
    }
}
//Switch navbar buttons according to the user role for mobile
function OptionsForMobile(role: string){
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        fetch('https://localhost:7054/api/Roles/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Name: "Svečias" }),
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
        navigate('/');
    };
    let token=localStorage.getItem('accessToken')
    switch (token){
        case null:
            return(<></>);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
            return(<div>
                <MenuItem>
                    <Button href='' sx={{ color: 'black' }}>{data.username}</Button>
                </MenuItem>
                <MenuItem>
                    <Button onClick={handleLogout} sx={{color: 'black'}}><LogoutIcon/></Button>
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
    const handleRoleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value;
        // Update selected role in the backend
        await updateRoleInBackend(newRole);

        // Update selected role in the frontend
        setSelectedRole(newRole);

        window.location.reload();
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
            {OptionsForMobile(selectedRole)}
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static' sx={{bgcolor: '#335285'}}>
                <Toolbar>
                    <div style={{ display: 'flex', alignItems: 'center',marginTop:'10px',marginBottom:'10px' }}>
                        <DisplaySettingsIcon sx={{ marginRight: '8px',fontSize: 40 }} />
                        <Typography
                            variant="h6"
                            component={Link}
                            color='white'
                            to="/"
                            sx={{
                                fontSize:20,
                                textDecoration: 'none',
                                display: { xs: 'block', sm: 'block' },
                                wordBreak: 'break-word' // Allow text to wrap at any point
                            }}
                        >
                            IT PROJEKTŲ IR NEATLYGINTINŲ<br />
                            IT SPECIALISTŲ PLATFORMA
                        </Typography>
                    </div>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <select id="roleSelect" value={selectedRole} onChange={handleRoleChange}>
                            <option value="Administratorius">Administratorius</option>
                            <option value="Svečias">Svečias</option>
                            <option value="Prisiregistravęs">Prisiregistravęs</option>
                            <option value="Patvirtinas">Patvirtinas</option>
                        </select>
                        {OptionsForDesktop(selectedRole)}
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                        >
                            <MenuIcon sx={{color: 'white'}} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </Box>);
}
export default Nav;
