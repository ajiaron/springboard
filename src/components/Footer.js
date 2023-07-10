import React, {useState, useEffect, useRef} from "react"
import { Link } from "react-router-dom";
import './Footer.scss'
export default function Footer() {
    return (
        <div className="icon-container">
            <Link className="git-logo-button" to="https://github.com/ajiaron">
                <div className="git-logo"></div>
            </Link>
            <Link className="mail-button"  to={'#'} onClick={(e)=>{
                window.location.href = 'mailto:aaronjiang3942@gmail.com';
                e.preventDefault();
            }}>
                <div className="mail-icon"/>
            </Link>
            
            <Link className="linkedin-button" to="https://www.linkedin.com/in/aaronjiang01/">
                <div className="linkedin-logo"></div>
            </Link>
        </div>
    )
}