import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Favorites.scss'
import './Archive.scss'
import './Notification.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import axios from "axios";
import { BsArrowRepeat, BsStars } from 'react-icons/bs'
import {BiPencil} from 'react-icons/bi'
import { BsCheck2,BsCheckLg } from 'react-icons/bs'
import {AiOutlineHeart, AiFillHeart,AiOutlineCheck} from 'react-icons/ai'
import { Link, useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Notification({prompt, message, onClose}) {
  function handleClose() {
    onClose()
  }
  const modalRef = useRef(null);
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
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
        <motion.div
            ref={modalRef}
            className="notification-container"
            initial={{ scale: 0}}
            animate={{ scale: 1}}
            exit= {{ opacity:0 }}
            transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
        }}
    >
        <div className={"notification-header "}>
        <p className={"notification-header-text"}>
            {prompt==="unavailable"?"Feature Unavailable":"An error occured."}
        </p>
        <div className="notification-header-subtext-container">
            <p className={"notification-header-subtext"}>
                {prompt==="unavailable"?'This feature is currently unavailable, please check back again soon.':
                "Please ensure all input fields are filled in propertly."}
            </p>
            <p className={"notification-header-subtext"}>
               {message}
            </p>
        </div>
        <div className="notification-footer-container">
            <span className="notification-footer-button" onClick={()=>handleClose()}> 
                <p className="notification-footer-button-text">
                    Got it
                </p>
            </span>
        </div>
        </div>
    </motion.div>
  )
}
