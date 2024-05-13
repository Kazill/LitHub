import React, {useEffect, useState} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button, Chip, Container} from "@mui/material";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {jwtDecode, JwtPayload} from "jwt-decode";

interface ApprovalData {
    id: number,
    username:string,
    status: string,
}
interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}

const getStatusColor = (status:string) => {
    switch (status.toLowerCase()) {
        case 'patvirtintas':
            return 'success'; // Change color to primary for approved status
        case 'laukia':
            return 'primary'; // Keep default color for waiting status
        case 'atšauktas':
            return 'error'; // Change color to secondary for denied status
        default:
            return 'default'; // Default color for other status values
    }
};

const Approval: React.FC = () => {
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
    const [approvals, setApprovals] = useState<ApprovalData[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://localhost:7054/api/Admin/waiting');
                setApprovals(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }
        fetchData();
    }, []);

    return(<Container>
        <center><h1>Prašymų sąrašas</h1></center>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Vartotojas</TableCell>
                        <TableCell align="right">Statusas</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {approvals.map((approval) => (
                        <TableRow
                            key={approval.username}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Button href={`/profile/${approval.username}`}>{approval.username}</Button>
                            </TableCell>
                            <TableCell align="right"><Chip label={approval.status} color={getStatusColor(approval.status)}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>)
}
export default Approval;