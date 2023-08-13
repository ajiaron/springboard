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

export default function SideNavigation({route}) {
  const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
  const username = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("username")):0
  return (
    <div className="side-console-container">
        <div className="console-header-container">
            <Link className="console-logo-text-container" to='/dashboard'>   
                <div className="console-app-logo"/>
                    <p className="console-logo-text">
                        Springboard
                    </p> 
            </Link>
        </div>
        <div className="console-content-container ">
            <Link className="console-content-wrapper " to={'/dashboard'} 
            >
                <AiOutlineHome className="home-icon"
                style={{filter:(route==='dashboard')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext"
                style={{filter:(route==='dashboard')?'brightness(1.25)':'brightness(1)'}}>
                    Dashboard
                </p>
            </Link>  
            <Link className="console-content-wrapper " to={'/feed'}>
                <HiOutlineNewspaper className="home-icon"
                style={{filter:(route==='feed')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext" 
                style={{filter:(route==='feed')?'brightness(1.25)':'brightness(1)'}}>
                    Recent activity
                </p>
            </Link>
            <Link className="console-content-wrapper " to={'/catalog'}>
                <BiBookmarks className="home-icon"
                style={{filter:(route==='catalog')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext"
                style={{filter:(route==='catalog')?'brightness(1.25)':'brightness(1)'}}>
                    Catalog
                </p>
            </Link>
            <Link className="console-content-wrapper " to={'/donations'}>
                <AiOutlineGift className="home-icon"
                style={{filter:(route==='donations')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext"
                style={{filter:(route==='donations')?'brightness(1.25)':'brightness(1)'}}>
                    Donations
                </p>
            </Link>
            <Link className="console-content-wrapper " to={'/archive'}
            >
                <BiBookHeart className="home-icon"
                style={{filter:(route==='archive')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext"
                style={{filter:(route==='archive')?'brightness(1.25)':'brightness(1)'}}>
                    Archive
                </p>
            </Link>
            <Link className="console-content-wrapper " to={'/cart'}>
                <LiaShoppingBasketSolid className="home-icon"
                style={{filter:(route==='cart')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext"
                style={{filter:(route==='cart')?'brightness(1.25)':'brightness(1)'}}>
                    Your basket
                </p>
            </Link>
        </div>

        <div className="console-content-container first-content ">
            <div className="console-content-wrapper-alt">
                <p className="console-item-text">
                    ACCOUNT
                </p>
            </div>
            <Link className="console-content-wrapper " to={`/${username}`}>
                <BsPerson className="home-icon" 
                style={{filter:(route==='profile')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext"
                style={{filter:(route==='feed')?'brightness(1.25)':'brightness(1)'}}>
                    Your profile
                </p>
            </Link>
            <Link className="console-content-wrapper " to={'/friends'}>
                <LiaUserFriendsSolid className="home-icon"
                style={{filter:(route==='friends')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext "
                style={{filter:(route==='friends')?'brightness(1.25)':'brightness(1)'}}>
                    Friends 
                </p>
            </Link>
            <Link className="console-content-wrapper " to={'/settings'}>
                <FiSettings className="console-settings-icon" 
                style={{filter:(route==='settings')?'brightness(1.25)':'brightness(1)'}}/>
                <p className="console-item-subtext side-settings-subtext"
                style={{filter:(route==='settings')?'brightness(1.25)':'brightness(1)'}}>
                    Settings
                </p>
            </Link>
        </div>

        <div className="console-content-container first-content ">
            <div className="console-content-wrapper-alt">
                <p className="console-item-text">
                    SUPPORT
                </p>
            </div>
            <Link className="console-content-wrapper ">
                <AiOutlineStar className="home-icon" to={'https://github.com/ajiaron'}/>
                <p className="console-item-subtext">
                     Updates
                </p>
            </Link>
            <span className="console-content-wrapper ">
                <AiOutlineQuestionCircle className="home-icon"/>
                <p className="console-item-subtext">
                    Help {'&'} feedback
                </p>
            </span>
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
