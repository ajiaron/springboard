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
import { motion } from "framer-motion";

export default function Notification({onClose}) {
  function handleClose() {
    onClose()
  }
  return (
    <motion.div
    className="notification-container"
    initial={{ scale: 0}}
    animate={{ scale: 1}}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20
    }}
  >
    <div className={"notification-header "}>
      <p className={"notification-header-text"}>
        Feature Unavailable
     </p>
     <div className="notification-header-subtext-container">
        <p className={"notification-header-subtext"}>
            This feature is currently unavailable, please check back again soon.
        </p>
        <p className={"notification-header-subtext"}>
            Email notifications have not been implemented, and will be in a future update. 
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
