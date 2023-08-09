import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Favorites.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import { BsStars } from 'react-icons/bs'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

const FavoriteItem = ({charityid, charityname, value, size, type, index}) => {
    return (
        <div className={`profile-favorite-item-container ${type==='Human'?'hr':type==='Healthcare'?'health':
        type.toLowerCase()}-item`}>
            <div className="profile-favorite-item-category">
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
                    {charityname}
                </p>
            </div>
            <div className="profile-favorite-type-container">
                <div className={`profile-favorite-item-type-wrapper mid-favorite-wrapper`}>
                    <p className="profile-favorite-item-type-text">
                        {`${size}-Sized`}
                    </p>
                </div>
            </div>

        </div>
    )
}
export default function Favorites(charityData) {
  return (
    <div className="subcontent-profile-container">
        {(charityData)&&
            charityData.map((item, index) => (
                <FavoriteItem charityid={item.charityid} charityname={item.charity_name} value={item.overall_score} size={item.size} type={item.type1} index={index}/>
            ))
        }
    </div>
  )
}
