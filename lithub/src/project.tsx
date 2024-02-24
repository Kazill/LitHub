import { useLocation } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";


const useQuery= () => {
    return new URLSearchParams(useLocation().search);
}

interface problemData{
    title:string,
    lastUpdate:string,
    languages:string,
    source:string,
    descrition:string,
    link:string
}




function Project(this: any) {

    const id = useQuery().get('id');

    const [problem, setProblem] = useState<problemData>();
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
    return (
        <><div>
                <div>
                    <center><h1>{problem?.title}</h1></center>
                    <p>{problem?.descrition}</p>
                    <p><b>Įkėlėjas: </b>{problem?.source}</p>
                    <p><b>Kalbos: </b>{problem?.languages}</p>
                    <p><b>Paskutinis atnaujinimas: </b>{problem?.lastUpdate}</p>
                    <div>
                        <h2>Failai:</h2>
                        <a href={problem?.link}>{problem?.link}</a>
                    </div>
                </div>
        </div></>
    );
}
export default Project;