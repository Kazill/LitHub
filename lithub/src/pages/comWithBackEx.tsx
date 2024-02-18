import React, {useEffect} from 'react';
import axios, {AxiosResponse} from "axios";

function ComWithBackEx() {
    useEffect(() => {
        axios.get('https://localhost:7054/WeatherForecast')
            .then((response: AxiosResponse<any>)=>{
                console.log(response.data);
            })
    }, [])
    return (
        <>
            <h1>
                Pavyzdys
            </h1>
            <p>Komunikacija su ASP.NET core</p>
        </>
    );
}

export default ComWithBackEx;