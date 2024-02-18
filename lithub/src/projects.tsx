import React from 'react';
import { Link } from "react-router-dom";
function Projects() {
    return (
<div>
    <center><h1>Project list</h1></center>
    <ProjectList />
    <AddProject />
</div>
    );
}
function AddProject() {
    return (
<button>Add new project</button>
    );
}
function ProjectList(){
    return(
<div>
    <Link to="/project">
        <h2>Project name</h2>
    </Link>
    <p>Source: ...</p>
    <p>Languages: ...</p>
    <p>Last updated: ...</p>
</div>
    );
}
export default Projects;