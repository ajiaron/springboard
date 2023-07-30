import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Favorites.scss'
import './Archive.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import axios from "axios";
import { BsStars } from 'react-icons/bs'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";


export default function CharityTab({ id, type, value, name, size, date}) {
    const [loading, setLoading] = useState()
    const [charityid, setCharityid] = useState(0)

  return (
    <Link to={`/charity/${id}/${name}/${type.toLowerCase()}`}
    className={`archive-favorite-item-container hr-item ${type==='Healthcare'?'health':type.toLowerCase()}-item`}>
        <div className="archive-favorite-item-category">
            <p className={`category-favorite-text ${type==='Healthcare'?'health':type.toLowerCase()}-text`}>
            {`${type==='Human'?'Human Rights & Services':type==='Healthcare'?'Health':
            type==='Research'?'Research & Public Policy':
            type==='Community'?'Community Development':type}`}
            </p>
            <AiFillHeart className="profile-favorite-icon"/>
        </div>
        <div className="profile-favorite-item-figure">
            <p className="profile-favorite-figure-text">
                {parseFloat(value).toFixed(1)}
            </p>
        </div>

        <div className="profile-favorite-item-name">
            <p className="profile-favorite-name-text">
                {name}
            </p>
        </div>
        <div className="archive-favorite-type-container">
            <div className={`profile-favorite-item-type-wrapper mid-favorite-wrapper`}>
                <p className="profile-favorite-item-type-text">
                    {`${size}-Sized`}
                </p>
            </div>
        </div>
    </Link>
  )
}
