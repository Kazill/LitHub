import React from 'react';
        import { TextField } from "@mui/material";
        import { Link } from "react-router-dom";



        function Project() {
        return (<div>
<Display/>
<Submit />
</div>
        );
        }
function Display(){
return(
<div>
<center><h1>New project</h1></center>
<p>Title:   {' '} <TextField/></p>
<p>About: {' '}
    <TextField multiline = {true} /></p>
<p>Languages: {' '}
    <TextField/></p>
<p>GitHub link: {' '}
    <TextField/></p>
</div>
        );
}
function Submit() {
        return (
<Link to="/project">
<button>Submit</button>
</Link>
        );
        }
        export default Project;