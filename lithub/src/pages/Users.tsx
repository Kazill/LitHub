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
import {Container} from "@mui/material";

interface UserData {
    userName: string,
    email: string,
    role:string,
    company:string,
    github:string,
    projectCount:number
}

const Users: React.FC=()=>{
    const [users,setUsers]=useState<UserData[]>([])

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
        <h2>Priregistruoti vartotojai</h2>
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
                </TableHead>
                <TableBody>
                    {users.map((user) => user.role=="Prisiregistravęs"?(
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
                            </TableCell>
                        </TableRow>
                    ):null)}
                </TableBody>
            </Table>
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
                </TableHead>
                <TableBody>
                    {users.map((user) => user.role=="Patvirtinas"?(
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
                        </TableRow>
                    ):null)}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>)
}

export default Users