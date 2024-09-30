import React, { useEffect } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
    let navigate = useNavigate();

    const getCookie = () => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
        }
    }

    useEffect(() => {
        getCookie();
        setTimeout(() => {
            navigate('/ConnectingScreen')
        }, 3000)
    }, [])
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-iparkOrange800">
            <div className="flex justify-center items-center h-screen">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
        </div>
    )
}
