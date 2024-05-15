import React, { useEffect, useState } from "react";
import {jwtDecode, JwtPayload} from "jwt-decode";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Button, Chip, Container} from "@mui/material";
import AdminCreationOverlay from "../components/AdminCreationOverlay";
interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}

interface AdminData {
    id: number,
    userName: string,
    email: string,
    phoneNumber: string
}

const Admin: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        let token=localStorage.getItem('accessToken')
        if (token === null) {
            navigate("/");
        } else {
            const data: CustomJwtPayload = jwtDecode(token)
            if(data.role!=="Administratorius"){
                navigate("/");
            }
        }
    }, []);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const handleOpenOverlay = () => {
        setOverlayOpen(true);
    };

    const handleCloseOverlay = () => {
        setOverlayOpen(false);
    };

    const [admins, setAdmins] = useState<AdminData[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://localhost:7054/api/Admin/Admins');
                setAdmins(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }
        fetchData();
    }, []);

    return(<Container>
        <center><h1>Administratoriai</h1></center>
        <Button onClick={handleOpenOverlay} variant="contained" className="loginButton" sx={{ mt: 1, mb: 2,
            bgcolor: '#335285',
            border: '2px solid #797979',
            borderRadius: 0,
            width: 245,

        }}>Sukurti administratorių</Button>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableCell component="th" scope="row">
                        ID
                    </TableCell>
                    <TableCell align="right">
                        Administratoriaus vartotojo vardas
                    </TableCell>
                    <TableCell align="right">
                        El. paštas
                    </TableCell>
                    <TableCell align="right">
                        Telefonas
                    </TableCell>
                </TableHead>
                <TableBody>
                    {admins.map((admin) => (
                        <TableRow
                            key={admin.userName}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {admin.id}
                            </TableCell>
                            <TableCell align="right">
                                {admin.userName}
                            </TableCell>
                            <TableCell align="right">
                                {admin.email}
                            </TableCell>
                            <TableCell align="right">
                                {admin.phoneNumber}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <AdminCreationOverlay open={overlayOpen} handleClose={handleCloseOverlay} />
    </Container>);
}
export default Admin;