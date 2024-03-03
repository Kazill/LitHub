import { useNavigate, useLocation } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link } from "react-router-dom";


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

function Project(this: any) {

    const id = useQuery().get('id');
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
                    <center><h1>{problem?.title}</h1></center>
                    <p>{problem?.description}</p>
                    <p><b>Įkėlėjas: </b>{problem?.source}</p>
                    <p><b>Kalbos: </b>{problem?.languages}</p>
                    <p><b>Paskutinis atnaujinimas: </b>{problem?.lastUpdate}</p>
                    <div>
                        <h2>Failai:</h2>
                        <a href={problem?.link}>{problem?.link}</a>
                    </div>
                    <button onClick={() => handleDelete()}>Šalinti</button>
                    <Link to={`/editProject?id=${id}`}>
                        <button>Redaguoti</button>
                    </Link>
                </div>
        </div></>
    );
}
export default Project;