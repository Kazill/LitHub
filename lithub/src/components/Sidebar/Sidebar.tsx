import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Box,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem, ListItemText
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle} from "@mui/icons-material";
import {jwtDecode, JwtPayload} from "jwt-decode";
import "./sidebar.css";
import HomeIcon from '@mui/icons-material/Home';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

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
            return(<Box display="flex" flexDirection="column"><Button href='/register' sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', color: 'black', border: '1px solid black', borderRadius: 0,
                justifyContent: "flex-start"  }}><AppRegistrationIcon/>Registruotis</Button>
                <Button href='/login'
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', color: 'black', border: '1px solid black', borderRadius: 0,
                            justifyContent: "flex-start"  }}
            >
                <LoginIcon/>Prisijungti
                </Button></Box>);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
            let approval
            if(data.role==="Administratorius"){
                approval=<Button href='/approval-list'
                                 sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', color: 'black', border: '1px solid black', borderRadius: 0,
                                     justifyContent: "flex-start"  }}
                ><CheckBoxIcon/>Prašymai patvirtinti</Button>
            }
            return(<Box display="flex"  flexDirection="column">
                {approval}
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
        <div className="sidebar">
            <Box display="flex" flexDirection="column">
                <Button href='/' sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    color: 'black',
                    border: '1px solid black',
                    borderRadius: 0,
                    justifyContent: "flex-start"}}
                ><HomeIcon/>Pradžia</Button>
                <Button href='/projects' sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    color: 'black' ,
                    border: '1px solid black',
                    borderRadius: 0,
                    justifyContent: "flex-start" }}
                ><StorageIcon/>Projektai</Button>
                <Button href='' sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    color: 'black',
                    border: '1px solid black',
                    borderRadius: 0,
                    justifyContent: "flex-start"  }}
                ><InfoIcon/>D.U.K</Button>
                {OptionsForDesktop()}
            </Box>
        </div>
    );
}
export default Sidebar;
