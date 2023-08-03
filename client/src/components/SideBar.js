import React, {useState, useEffect, useContext} from 'react'
import './SideBar.scss'
import {FiSettings} from 'react-icons/fi'
import {BsFillSuitHeartFill} from 'react-icons/bs'
import {HiSpeakerphone} from 'react-icons/hi'
import {FaShoppingBasket, FaShoppingCart} from 'react-icons/fa'
import UserContext from '../contexts/UserContext'
import { Link, useParams } from "react-router-dom";
import { Auth } from 'aws-amplify';


export default function SideBar({}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null)
    const user = useContext(UserContext)
    useEffect(()=> {
        Auth.currentAuthenticatedUser()
        .then((res) => setUserData(res))
        .then(()=>setIsLoggedIn(true))
        .catch(() => setIsLoggedIn(false));
    }, [])
    function handleTest() {
        console.log(user.connection)
    }
    return (
        <div 
        className={`side-navigation`}>
       

       <div className="navigation-item-container">
            <Link className="navigation-item" to={'/cart'}>
                <FaShoppingCart className='cart-side-icon'/>
            </Link>
            <p className="navigation-item-text">
                Basket
            </p>
        </div>
        <div className="navigation-item-container">
            <Link className="navigation-item" to={'/settings'}>
                <FiSettings className='settings-icon'/>
            </Link>
            <p className="navigation-item-text">
                Settings
            </p>

        </div>
        <span className="navigation-item-container" onClick={()=>handleTest()}>
            <Link className="navigation-item" to={'#'}>
                <BsFillSuitHeartFill className='archive-icon' style={{color:(isLoggedIn?'lightcoral':'#eee')}}/>
            </Link>
            <p className="navigation-item-text">
                Archive
            </p>
        </span>

        {/*
        <div className="navigation-item-container">
            <span className="navigation-item" 
             onClick={(e)=>{
             window.location.href = 'mailto:aaronjiang3942@gmail.com';
             e.preventDefault();
             }}>
                <HiSpeakerphone className='feedback-icon'/>
            </span>
            <p className="navigation-item-text">
                Feedback
            </p>

        </div>
         */}
    </div>
    )
}