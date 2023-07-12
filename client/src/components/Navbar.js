import React, {useState, useEffect} from "react"
import { Link, useLocation } from "react-router-dom"
import {BiMenu, BiHome} from 'react-icons/bi'
import {BsFillArrowUpLeftCircleFill} from 'react-icons/bs'
import './Navbar.scss'
export default function Navbar() {
    const location = useLocation()
    return (
        <div className="logo-container">
            {/*
            <div className="navbar-wrapper">
                <div className="navbar-content">
                    <Link to ='/' className="landing-link">
                    
                    <div className="app-logo"/>
                    <div className="logo-text-container">   
                
                        <p className="logo-text">
                            Springboard
                        </p> 
                    </div>
                    </Link>
                </div>               
            </div>
    */}
       <Link to ='/' className="landing-link">
                    
                    <div className="app-logo"/>
                    <div className="logo-text-container">   
                
                        <p className="logo-text">
                            Springboard
                        </p> 
                    </div>
                    </Link>
        </div>
    )
}