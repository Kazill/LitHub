import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import {Button, Container, TablePagination} from "@mui/material";

interface UserData {
    userName: string,
    email: string,
    role:string,
    company:string,
    github:string,
    projectCount:number,
    workCount:number
}

const Users: React.FC=()=>{
    const [users,setUsers]=useState<UserData[]>([])
    const [pageUsers, setPageUsers] = useState(0);
    const [rowsPerPageUsers, setRowsPerPageUsers] = useState(5);
    const [pageCompanies, setPageCompanies] = useState(0);
    const [rowsPerPageCompanies, setRowsPerPageCompanies] = useState(5);

    const sortedUsersByName = [...users].filter((user) => user.role=="Prisiregistravęs").sort((a, b) => (b.workCount ?? 0) - (a.workCount ?? 0));

    // Sort users by projectCount for the second table
    const sortedUsersByProjectCount = [...users].filter((user) => user.role=="Patvirtinas").sort((a, b) => (b.projectCount ?? 0) - (a.projectCount ?? 0));

    // Handle page change
    const handleChangePageUsers = (event: unknown, newPage: number) => {
        setPageUsers(newPage);
    };

    const handleChangeRowsPerPageUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPageUsers(parseInt(event.target.value, 10));
        setPageUsers(0);
    };

    const handleChangePageCompanies = (event: unknown, newPage: number) => {
        setPageCompanies(newPage);
    };

    const handleChangeRowsPerPageCompanies = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPageCompanies(parseInt(event.target.value, 10));
        setPageCompanies(0);
    };

    // Paginate data
    const paginatedUsers = sortedUsersByName.slice(pageUsers * rowsPerPageUsers, pageUsers * rowsPerPageUsers + rowsPerPageUsers);
    const paginatedCompanies = sortedUsersByProjectCount.slice(pageCompanies * rowsPerPageCompanies, pageCompanies * rowsPerPageCompanies + rowsPerPageCompanies);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://localhost:7054/api/User/Users');
                setUsers(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }
        fetchData();
    }, []);

    return (<Container>
        <h2>Sistemos vartotojai</h2>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableCell component="th" scope="row">
                        Vartotojo vardas
                    </TableCell>
                    <TableCell align="left">
                        El. paštas
                    </TableCell>
                    <TableCell align="left">
                        Github
                    </TableCell>
                    <TableCell align="left">
                        Dirbimi projektai
                    </TableCell>
                    <TableCell align="left">
                        Atidaryti profilį
                    </TableCell>
                </TableHead>
                <TableBody>
                    {paginatedUsers.map((user) => user.role=="Prisiregistravęs"?(
                        <TableRow
                            key={user.userName}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {user.userName}
                            </TableCell>
                            <TableCell align="left">
                                {user.email}
                            </TableCell>
                            <TableCell align="left">
                                {user.github}
                            </TableCell><TableCell align="left">
                                {user.workCount}
                            </TableCell>
                            <TableCell align="left">
                                <Button href={`/profile/${user.userName}`} variant="contained" style={{ backgroundColor: '#6177a3', color: '#ffffff' }}>Profilis</Button>
                            </TableCell>
                        </TableRow>
                    ):null)}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedUsersByName.length}
                rowsPerPage={rowsPerPageUsers}
                page={pageUsers}
                onPageChange={handleChangePageUsers}
                onRowsPerPageChange={handleChangeRowsPerPageUsers}
            />
        </TableContainer>
        <h2>Įmonės</h2>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableCell component="th" scope="row">
                        Vartotojo vardas
                    </TableCell>
                    <TableCell align="left">
                        El. paštas
                    </TableCell>
                    <TableCell align="left">
                        Įmonė
                    </TableCell>
                    <TableCell align="left">
                        Projektų kiekis
                    </TableCell>
                    <TableCell align="left">
                        Atidaryti projektus
                    </TableCell>
                </TableHead>
                <TableBody>
                    {paginatedCompanies.map((user) => user.role=="Patvirtinas"?(
                        <TableRow
                            key={user.userName}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {user.userName}
                            </TableCell>
                            <TableCell align="left">
                                {user.email}
                            </TableCell>
                            <TableCell align="left">
                                {user.company}
                            </TableCell>
                            <TableCell align="left">
                                {user.projectCount}
                            </TableCell>
                            <TableCell align="left">
                                <Button href={`/userProjects/${user.userName}`} variant="contained" style={{ backgroundColor: '#6177a3', color: '#ffffff' }}>Projektai</Button>
                            </TableCell>
                        </TableRow>
                    ):null)}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedUsersByProjectCount.length}
                rowsPerPage={rowsPerPageCompanies}
                page={pageCompanies}
                onPageChange={handleChangePageCompanies}
                onRowsPerPageChange={handleChangeRowsPerPageCompanies}
            />
        </TableContainer>
    </Container>)
}

export default Users