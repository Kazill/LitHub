import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from "axios";
import {TextField} from "@mui/material";

interface humanData{
    id: number;
    name:string;
}

function ComWithBackEx() {
    useEffect(() => {
        axios.get('https://localhost:7054/WeatherForecast')
            .then((response: AxiosResponse<any>)=>{
                console.log(response.data);
            })
    }, [])
    const [formData, setFormData] = useState({
        Id:0,
        Name: ''
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const [human, setHuman] = useState<humanData[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('https://localhost:7054/api/User',{});
                console.log(response.data);
                setHuman(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }

        fetchData();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7054/api/User', {
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
    return (
        <>
            <h1>
                Pavyzdys
            </h1>
            <p>Komunikacija su ASP.NET core</p>
            <center><div>
                <center><h1>Human</h1></center>
                <p>Name:   {' '} <TextField onChange={handleInputChange} name="Name"/></p>
                <button type="submit" onClick={handleSubmit}>Add</button>
            </div></center>
            <h1>Humans</h1>
            <p>{human.map(item=>{
                return <p>{item.name}</p>
            })}</p>
        </>
    );

}

export default ComWithBackEx;