import {AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
const Nav:React.FC<{}>=()=>{
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

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
                <Button href='/' sx={{color: 'black'}}>Laisvai platinami kodai</Button>
            </MenuItem>
            <MenuItem>
                <Button href='/projects' sx={{color: 'black'}}>Projektai</Button>
            </MenuItem>
            <MenuItem>
                <Button href='' sx={{color: 'black'}}>Kas tai?</Button>
            </MenuItem>
            <MenuItem>
                <Button href='' sx={{color: 'black'}}>Registruotis</Button>
            </MenuItem>
            <MenuItem>
                <Button href=''
                        sx={{color: 'white',background: 'green',
                            ":hover":{ background:'#00a600'}}}
                >
                    Prisijungti
                </Button>
            </MenuItem>
        </Menu>
    );

    return(
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
                        <Button href='/' sx={{color: 'black'}}>Laisvai platinami kodai</Button>
                        <Button href='/projects' sx={{color: 'black'}}>Projektai</Button>
                        <Button href='' sx={{color: 'black'}}>Kas tai?</Button>
                        <Button href='' sx={{color: 'black'}}>Registruotis</Button>
                        <Button href=''
                                sx={{color: 'white',background: 'green',
                                    ":hover":{ background:'#00a600'}}}
                        >
                            Prisijungti
                        </Button>
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
export  default Nav;