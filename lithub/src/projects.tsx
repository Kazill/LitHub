import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import axios, {AxiosResponse} from "axios";

interface problemData{
        id:number,
        title:string,
        lastUpdate:string,
        languages:string,
        source:string
    }

function Projects() {
        return (
                <div>
                        <center><h1>Projektų sarašas</h1></center>
                        <ProjectList />
                        <AddProject />
                </div>
        );
}

function AddProject() {
return (
        <Link to="/addProject">
                <button>Add new project</button>
        </Link>
        );
}
function ProjectList(){

        const [problem, setProblem] = useState<problemData[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://localhost:7054/api/Problem',{});
                console.log(response.data);
                setProblem(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }

        fetchData();
    }, []);

        return(
                <><div>
                        {problem.map(item => (
                                <div>
                                        <Link to={`/Project?id=${item.id}`}>
                                                <h2>{item.title}</h2>
                                        </Link>
                                        <p>Įkėlėjas: {item.source}</p>
                                        <p>Kalbos: {item.languages}</p>
                                        <p>Paskutinis atnaujimimas: {item.lastUpdate}</p>
                                </div>
                        ))}
                </div></>
        );
}
export default Projects;