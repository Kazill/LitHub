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
    
    return (
        <><div>
                <div>
                    <center><h1>{problem?.title} <IsMarked/></h1></center>
                    <p>{problem?.description}</p>
                    <p><b>Įkėlėjas: </b>{problem?.source}</p>
                    <p><b>Kalbos: </b>{problem?.languages}</p>
                    <p><b>Paskutinis atnaujinimas: </b>{problem?.lastUpdate}</p>
                    <select  id="id" value= "Pasižymėją programuotojai" >
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
                    <button onClick={() => handleDelete()}>Šalinti</button>
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