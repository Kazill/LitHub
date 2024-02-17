import React from 'react';
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
    <h2>Project name</h2>
    <p>Languages: ...</p>
    <p>Last updated: ...</p>
</div>
    );
}
export default Projects;