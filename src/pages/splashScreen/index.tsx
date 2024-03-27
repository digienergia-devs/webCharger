import React, { useEffect } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
    let navigate = useNavigate();

    const getCookie = () => {
        console.log("search for cookies")
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === 'myCookie') {
                console.log("cookie --- ", cookie[0])
            } else {
                console.log("cookie not found")
            }
        }
    }

    useEffect(() => {
        getCookie();
        setTimeout(() => {
            navigate('/ConnectingScreen')
        }, 3000)
    }, [])
    return (
        <div className="flex justify-center items-center bg-green-600 h-screen w-screen">
            <div className="flex justify-center items-center h-screen">
                <img src={require('../../assets/icons/Final3.png')} alt="" />
            </div>
        </div>

        // <div className='main-container-splash-screen'>
        //     <div className='logo-container-splash-screen'>
        //         <p>plugKaro</p>
        //     </div>
        //     <div className='footer-splash-screen'>
        //         <img src={require('../../assets/icons/footer_car.png')} alt="" />
        //     </div>
        // </div>


    )
}
