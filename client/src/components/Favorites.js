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

export default function Favorites() {
  return (
    <div className="subcontent-profile-container">
        <div className="profile-favorite-item-container hr-item">
            <div className="profile-favorite-item-category">
                <p className="category-favorite-text category-hr">
                    Human Rights {'&'} Services
                </p>
                <AiFillHeart className="profile-favorite-icon"/>
            </div>
            <div className="profile-favorite-item-figure">
                <p className="profile-favorite-figure-text">
                    99.0
                </p>
            </div>

            <div className="profile-favorite-item-name">
                <p className="profile-favorite-name-text">
                    Equal Justice Initiative
                </p>
            </div>
            <div className="profile-favorite-type-container">
                <div className={`profile-favorite-item-type-wrapper mid-favorite-wrapper`}>
                    <p className="profile-favorite-item-type-text">
                        Mid-Sized
                    </p>
                </div>
            </div>

        </div>
        <div className="profile-favorite-item-container education-item">
            <div className="profile-favorite-item-category">
                <p className="category-favorite-text category-ed">
                    Education
                </p>
                <AiFillHeart className="profile-favorite-icon"/>
            </div>
            <div className="profile-favorite-item-figure">
                <p className="profile-favorite-figure-text">
                    98.2
                </p>
            </div>
            <div className="profile-favorite-item-name">
                <p className="profile-favorite-name-text">
                   Kids In Need Foundation 
                </p>
            </div>
            <div className="profile-favorite-type-container">
                <div className={`profile-favorite-item-type-wrapper large-favorite-wrapper`}>
                    <p className="profile-favorite-item-type-text">
                        Large-Sized
                    </p>
                </div>
            </div>
        </div>
        <div className="profile-favorite-item-container health-item">
            <div className="profile-favorite-item-category">
                <p className="category-favorite-text category-h">
                    Health
                </p>
                <AiFillHeart className="profile-favorite-icon"/>
            </div>
            <div className="profile-favorite-item-figure">
                <p className="profile-favorite-figure-text">
                    97.4
                </p>

            </div>
            <div className="profile-favorite-item-name">
                <p className="profile-favorite-name-text">
                    American Heart Association
                </p>
            </div>
            <div className="profile-favorite-type-container">
                <div className={`profile-favorite-item-type-wrapper mid-favorite-wrapper`}>
                    <p className="profile-favorite-item-type-text">
                        Mid-Sized
                    </p>
                </div>
            </div>
        </div>
        <div className="profile-favorite-item-container environment-item">
            <div className="profile-favorite-item-category">
                <p className="category-favorite-text category-ev">
                    Environment
                </p>
                <AiFillHeart className="profile-favorite-icon"/>
            </div>
            <div className="profile-favorite-item-figure">
                <p className="profile-favorite-figure-text">
                    100.0
                </p>
            </div>
            <div className="profile-favorite-item-name">
                <p className="profile-favorite-name-text">
                    Conservation International 
                </p>
            </div>
            <div className="profile-favorite-type-container">
                <div className={`profile-favorite-item-type-wrapper small-favorite-wrapper`}>
                    <p className="profile-favorite-item-type-text">
                        Small-Sized
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}
