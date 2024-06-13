import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem } from "@mui/material";
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle, Image} from "@mui/icons-material";
import {jwtDecode, JwtPayload} from "jwt-decode";
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import axios from "axios";

interface UserProfile {
    id: number;
    userName: string;
    email: string;
    company: string;
    githubProfile: string;
    phoneNumber: string;
    role: string;
    imageLink: string;
    about:string;
    // Add other fields as needed
}
interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}

//Switch navbar buttons according to the user role for desktop
function OptionsForDesktop(role: string){
    const navigate = useNavigate()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token !== null) {
                    const data: CustomJwtPayload = jwtDecode(token);
                    const response = await axios.get(`https://localhost:7054/api/User/username/${data.username}`);
                    setUserProfile(response.data);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);
    const handleClose = () => {
        setAnchorEl(null);
    };
    let token=localStorage.getItem('accessToken')
    switch (token){
        case null:
            return(<></>);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
            return(<div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        style={{ width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onClick={handleMenu}
                        src={userProfile?.imageLink}
                    />
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
                    </Menu>
                    <Button onClick={handleLogout} sx={{ color: 'white' }}><LogoutIcon /></Button>
                </div>
            );
    }
}
//Switch navbar buttons according to the user role for mobile
function OptionsForMobile(role: string){
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
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
            {OptionsForMobile(selectedRole)}
        </Menu>
    );

    return (
        <Box>
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
