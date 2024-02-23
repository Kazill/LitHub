import React, {useState} from 'react';
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

function getDate() {
        const today = new Date();
        return dayjs(today).format("YYYY-MM-DD");
}
function Project() {
    console.log('start');
    const [formData, setFormData] = useState({
        id: 0,
        title: "string",
        description: "string",
        lastUpdate: getDate(),
        languages: "string",
        link: "string"
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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
            <center><h1>Naujas projektas</h1></center>
            <p>Pavadinimas:   {' '} <TextField onChange={handleInputChange} name="title"/></p>
            <p>Aprašymas: {' '} <TextField multiline = {true} onChange={handleInputChange} name="description"/></p>
            <p>Kalbos: {' '} <TextField onChange={handleInputChange} name="languages"/></p>
            <p>GitHub nuoroda: {' '} <TextField onChange={handleInputChange} name="link"/></p>
            <button type="submit" onClick={handleSubmit}>Išsaugoti</button>
        </div>
    );
}


export default Project;