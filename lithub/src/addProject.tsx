import React, {useEffect, useState} from 'react';
        import { TextField } from "@mui/material";
        import { Link } from "react-router-dom";
        import axios, {AxiosResponse} from "axios";

interface problemData{
        id: number;
        title:string;
        description:string;
        langueges:string;
        link:string;
        lastUpdate:Date;
}
function getDate() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${year}-${month}-${date}`;
}
function Project() {
        return (<div>
<Display/>
</div>
        );
        }
function Display(){
        const [formData, setFormData] = useState({
        Id:0,
        Title: '',
        description:'',
        langueges:'',
        link:'',
        lastUpdate:getDate()
        });
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};
const [problem, setProblem] = useState<problemData[]>([]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

try {
const response = await axios.post('https://localhost:7054/api/Problem', {
...formData,
}, {
headers: {
'Content-Type': 'application/json',
},
});
console.log('Response from server:', response.data);
//navigate('/');
window.location.reload()
} catch (error) {
console.error('Error submitting post:', error);
}
};
return(
<div>
<center><h1>New project</h1></center>
<p>Title:   {' '} <TextField onChange={handleInputChange} name="Title"/></p>
<p>About: {' '}
    <TextField multiline = {true} onChange={handleInputChange} name="Description"/></p>
<p>Languages: {' '}
    <TextField onChange={handleInputChange} name="Languages"/></p>
<p>GitHub link: {' '}
    <TextField onChange={handleInputChange} name="Link"/></p>
    <Link to="/project">
        <button type="submit" onClick={handleSubmit}>Submit</button>
</Link>
</div>
        );
}
        export default Project;