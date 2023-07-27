import React, {useState, useEffect} from "react"
import { Link, useLocation } from "react-router-dom"
import {BiMenu, BiHome, BiSolidUser} from 'react-icons/bi'
import {AiOutlineUser,AiOutlineShoppingCart,AiOutlineQuestionCircle,AiOutlineLink,AiOutlineStar,AiOutlineHome,AiOutlineGift} from 'react-icons/ai'
import {BsPatchQuestion,BsFillSuitHeartFill,BsPerson} from 'react-icons/bs'
import {FiSettings,FiShoppingCart} from 'react-icons/fi'
import {FaShoppingBasket, FaShoppingCart} from 'react-icons/fa'
import {FaUserFriends,FaUserCircle} from 'react-icons/fa'
import {RiSettings5Fill} from 'react-icons/ri'
import {IoSettingsOutline} from 'react-icons/io'
import {LiaShoppingBasketSolid,LiaUserFriendsSolid} from 'react-icons/lia'
import {BiBookmarks, BiBookHeart} from 'react-icons/bi'
import {HiOutlineNewspaper} from 'react-icons/hi'
import {CiSettings} from 'react-icons/ci'

import './Navbar.scss'
import './SideNavigation.scss'

export default function SideNavigation() {
  return (
    <div className="side-console-container">

        <div className="console-header-container">
            <Link className="console-logo-text-container" to='/'>   
                <div className="console-app-logo"/>
                    <p className="console-logo-text">
                        Springboard
                    </p> 
            </Link>
        </div>
        <div className="console-content-container ">
            <div className="console-content-wrapper ">
                <AiOutlineHome className="home-icon"/>
                <p className="console-item-subtext">
                    Dashboard
                </p>
            </div>  
            <div className="console-content-wrapper ">
                <HiOutlineNewspaper className="home-icon"/>
                <p className="console-item-subtext">
                    Recent activity
                </p>
            </div>
            <div className="console-content-wrapper ">
                <BiBookmarks className="home-icon"/>
                <p className="console-item-subtext">
                    Catalog
                </p>
            </div>
         

            <div className="console-content-wrapper ">
                <AiOutlineGift className="home-icon"/>
                <p className="console-item-subtext">
                    Donations
                </p>
            </div>
            <div className="console-content-wrapper ">
                <BiBookHeart className="home-icon"/>
                <p className="console-item-subtext">
                    Archive
                </p>
            </div>
            <div className="console-content-wrapper ">
                <LiaShoppingBasketSolid className="home-icon"/>
                <p className="console-item-subtext">
                    Your basket
                </p>
            </div>
          
        </div>

        <div className="console-content-container first-content ">
            <div className="console-content-wrapper">
                <p className="console-item-text">
                    ACCOUNT
                </p>
            </div>
            <div className="console-content-wrapper ">
                <BsPerson className="home-icon"/>
                <p className="console-item-subtext">
                    Your profile
                </p>
            </div>
            <div className="console-content-wrapper ">
                <LiaUserFriendsSolid className="home-icon"/>
                <p className="console-item-subtext ">
                    Friends 
                </p>
            </div>
            <div className="console-content-wrapper ">
                <FiSettings className="console-settings-icon"/>
                <p className="console-item-subtext side-settings-subtext">
                    Settings
                </p>
            </div>
        </div>

        <div className="console-content-container first-content ">
            <div className="console-content-wrapper">
                <p className="console-item-text">
                    SUPPORT
                </p>
            </div>
            <div className="console-content-wrapper ">
                <AiOutlineStar className="home-icon"/>
                <p className="console-item-subtext">
                     Updates
                </p>
            </div>
            <div className="console-content-wrapper ">
                <AiOutlineQuestionCircle className="home-icon"/>
                <p className="console-item-subtext">
                    Help {'&'} feedback
                </p>
            </div>


        </div>
        <div className="console-content-container first-content ">
            <div className="console-content-wrapper">
                <p className="console-item-text">
        
                </p>
            </div>
  
            <div className="console-link-wrapper ">
                <AiOutlineLink className="console-link-icon"/>
                <p className="console-link-subtext">
                    link.springboard.app
                </p>
            </div>


        </div>



                    
    </div>
  )
}
