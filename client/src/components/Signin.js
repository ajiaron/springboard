import React, {useState, useEffect, useRef} from 'react'
import './Signin.scss'
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import Login from './Login';
import Register from './Register';
import _, { debounce } from 'lodash'; 
import {LiaTimesSolid} from 'react-icons/lia'

export default function Signin({type, onClose, onBlur}) {
  const [shouldClose, setShouldClose] = useState(false)
  const signInRef = useRef(null);
  function handleClose() {
    setShouldClose(true)
    onBlur()
    setTimeout(()=> {
        onClose()
    }, 300)
  }
  const handleOutsideClick = (event) => {
    if (signInRef.current && !signInRef.current.contains(event.target)) {
        handleClose();
    }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

  return (
    <div className={`signin-container ${shouldClose?'signin-active':'signin-inactive'}`} ref={signInRef}>
        <div className='signin-content'>
            { 
                (type==='register')?
                <Register/>
                :
                <Login/>
            }
            <span className="exit-signin-container" onClick={()=>handleClose()}>
                <LiaTimesSolid className="exit-signin-icon"/>
            </span>
        </div>
    </div>
  )
}
