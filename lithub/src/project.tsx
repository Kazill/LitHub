import { useNavigate, useLocation } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import {jwtDecode, JwtPayload} from "jwt-decode";
import { FaStar } from "react-icons/fa";

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}


const useQuery= () => {
    return new URLSearchParams(useLocation().search);
}

interface problemData{
    title:string,
    lastUpdate:string,
    languages:string,
    source:string,
    description:string,
    link:string
}

interface markedData{
    userName:string
}



function SetMarks(id:number){
    const [marks, setMarks] = useState<markedData[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`https://localhost:7054/api/Marked/problem/${id}`);
                setMarks(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }

        fetchData();
    }, [id]);
    return marks;
}



function Project(this: any) {
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

    const id = useQuery().get('id');

    const marks = SetMarks(Number(id));

    const [problem, setProblem] = useState<problemData>();

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`https://localhost:7054/api/Problem/${id}`,{});
                console.log(response.data);
                setProblem(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }

        fetchData();
    }, [ id ]);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://localhost:7054/api/Problem/${id}`);
            navigate("/Projects");
        } catch (error) {
            // Handle the error or log it
            console.error(error);
        }
    };

    const renderDeleteButton = () => {
        if(selectedRole === "Administratorius"){
            return <button onClick={() => handleDelete()}>Šalinti</button>;
        }
        return null;
    };
    const renderEditButton = () => {
        console.log();

        let token=localStorage.getItem('accessToken')
        switch (token){
            case null:
                return(null);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
            console.log(problem?.source);
            console.log(data.username);
            console.log(selectedRole);
                if(problem?.source === data.username && selectedRole === "Patvirtinas"){
                    
                    return( <Link to={`/editProject?id=${id}`}>
                                <button>Redaguoti</button>
                            </Link>);
                }
                else{
                    return(null);
                }
        }
    };
    
    
    return (
        <><div>
                <div>
                    <center><h1>{problem?.title} <IsMarked/></h1></center>
                    <p>{problem?.description}</p>
                    <p><b>Įkėlėjas: </b>{problem?.source}</p>
                    <p><b>Kalbos: </b>{problem?.languages}</p>
                    <p><b>Paskutinis atnaujinimas: </b>{problem?.lastUpdate}</p>
                    <select  id="id" value= "Pasižymėję programuotojai" >
                    <option value="start" hidden>Pasižymėją programuotojai</option>
                        {marks.map(mark => (
                            <option value="Vardas" disabled>{mark.userName}</option>
                        ))}
                    </select>           
                    <div>
                        <h2>Failai:</h2>
                        <a href={problem?.link}>{problem?.link}</a>
                    </div>
                    <MarkProject />
                    {renderDeleteButton()}
                    {renderEditButton()}
                    <Link to={`/editProject?id=${id}`}>
                        <button>Redaguoti</button>
                    </Link>
                </div>
        </div></>
    );
}

function IsMarked(){
    const marks = SetMarks(Number(useQuery().get('id')));
    let token=localStorage.getItem('accessToken')
        switch (token){
            case null:
                return(null);
            default:
                const data :CustomJwtPayload=jwtDecode(token)
                if(marks.find(x=> x.userName === data.username) === undefined){
                    return(null);
                }
                else{
                    return(<FaStar />);
                }
        }
}

function MarkProject(){
    const id = useQuery().get('id');
    const marks = SetMarks(Number(id));
    const handleMark = async (name:string) => {
    const mark = {problemId:Number(id), userName:name}
        try {
            const response = await axios.post('https://localhost:7054/api/Marked', {
                ...mark,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response from server:', response.data);
            window.location.reload()
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    let token=localStorage.getItem('accessToken')
        switch (token){
            case null:
                return(null);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
                if(marks.find(x=> x.userName === data.username) === undefined){
                    return(<button onClick={() => handleMark(data.username)}>Planuoju padėti</button>)
                }
                else{
                    return(null);
                }
        }
}

export default Project;