import './sidebar.css';

import { jwtDecode, JwtPayload } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AccountCircle } from '@mui/icons-material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EditIcon from '@mui/icons-material/EditNote';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import StorageIcon from '@mui/icons-material/Storage';
import PeopleIcon from '@mui/icons-material/People';
import {
    AppBar, Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Toolbar,
    Typography
} from '@mui/material';

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}
//Switch sidebar buttons according to the user role for desktop
function OptionsForDesktop(){
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
            return(<Box display="flex" flexDirection="column"><Button href='/register' sx={{
                color: 'white',
                justifyContent: "flex-start",
                textTransform: 'none',
                padding: '10px 20px',
                marginBottom: '10px',
                '&:hover': {
                    backgroundColor: '#344955'
                }
            }}><AppRegistrationIcon sx={{ marginRight: '10px' }}/> Registruotis</Button>
                <Button href='/login'
                        sx={{
                            color: 'white',
                            justifyContent: "flex-start",
                            textTransform: 'none',
                            padding: '10px 20px',
                            marginBottom: '10px',
                            '&:hover': {
                                backgroundColor: '#344955'
                            }
                        }}
            >
                <LoginIcon sx={{ marginRight: '10px' }}/>Prisijungti
                </Button></Box>);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
            let approval
            let myProj
            if(data.role==="Administratorius"){
                approval=[<Button href='/approval-list'
                                 sx={{ color: 'white',
                                 justifyContent: "flex-start",
                                 textTransform: 'none',
                                 padding: '10px 20px',
                                 marginBottom: '10px',
                                 '&:hover': {
                                     backgroundColor: '#344955'
                                 }  }}
                ><CheckBoxIcon/>Prašymai patvirtinti</Button>,
                    <Button href='/admin-creation'
                            sx={{ color: 'white',
                            justifyContent: "flex-start",
                            textTransform: 'none',
                            padding: '10px 20px',
                            marginBottom: '10px',
                            '&:hover': {
                                backgroundColor: '#344955'
                            }  }}
                    >Administratorių kūrimas</Button>]
            }
            if(data.role==="Patvirtinas"){
                myProj=[<Button href='/myProjects' sx={{
                    color: 'white',
                    justifyContent: "flex-start",
                    textTransform: 'none',
                    padding: '10px 20px',
                    marginBottom: '10px',
                    '&:hover': {
                        backgroundColor: '#344955'
                    }
                }}
                ><EditIcon sx={{ marginRight: '10px' }} />Mano Projektai</Button>]
            }
            return(<Box display="flex"  flexDirection="column">
                {approval}{myProj}
            </Box>);
    }
}
//Switch navbar buttons according to the user role for mobile
/*function OptionsForMobile(role: string){
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
            return(<div>
                <MenuItem>
                    <Button href='/register' sx={{ color: 'black' }}>Registruotis</Button>
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
            const data :CustomJwtPayload=jwtDecode(token)
            let approval
            if(data.role==="Administratorius"){
                approval=<Button href='/approval-list' sx={{ color: 'black' }}>Prašymai</Button>
            }
            return(<div>
                {approval}
                </div>);
    }

}*/
const Sidebar: React.FC<{}> = () => {
    /*const [selectedRole, setSelectedRole] = useState('');

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
            <MenuItem>
                <Button href='/' sx={{ color: 'black' }}>Pagrindinis</Button>
            </MenuItem>
            <MenuItem>
                <Button href='/projects' sx={{ color: 'black' }}>Projektai</Button>
            </MenuItem>
            <MenuItem>
                <Button href='' sx={{ color: 'black' }}>Kas tai?</Button>
            </MenuItem>
            {OptionsForMobile(selectedRole)}
        </Menu>
    );*/

    return (
        <div className="sidebar" style={{ width: '250px', backgroundColor: '#335285', height: 'fixed', color: '#fff', position: 'sticky', top: 0 }}>
            <Box display="flex" flexDirection="column" p={2}>
                <Button href='/' sx={{
                    color: 'white',
                    justifyContent: "flex-start",
                    textTransform: 'none',
                    padding: '10px 20px',
                    marginBottom: '10px',
                    '&:hover': {
                        backgroundColor: '#344955'
                    }
                }}
                ><HomeIcon sx={{ marginRight: '10px' }} />Pradžia</Button>
                <Button href='/projects' sx={{
                    color: 'white',
                    justifyContent: "flex-start",
                    textTransform: 'none',
                    padding: '10px 20px',
                    marginBottom: '10px',
                    '&:hover': {
                        backgroundColor: '#344955'
                    }
                }}
                ><StorageIcon sx={{ marginRight: '10px' }} />Projektai</Button>
                <Button href='/users' sx={{
                    color: 'white',
                    justifyContent: "flex-start",
                    textTransform: 'none',
                    padding: '10px 20px',
                    marginBottom: '10px',
                    '&:hover': {
                        backgroundColor: '#344955'
                    }
                }}
                ><PeopleIcon sx={{ marginRight: '10px' }} />Vartotojai</Button>
                <Button href='/duk' sx={{
                    color: 'white',
                    justifyContent: "flex-start",
                    textTransform: 'none',
                    padding: '10px 20px',
                    marginBottom: '10px',
                    '&:hover': {
                        backgroundColor: '#344955'
                    }
                }}
                ><InfoIcon sx={{ marginRight: '10px' }} />D.U.K</Button>
                {OptionsForDesktop()}
            </Box>
        </div>
    );
}
// @ts-ignore
export default Sidebar;
