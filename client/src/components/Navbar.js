import React, {useState, useEffect} from "react"
import { Link, useLocation } from "react-router-dom"
import {BiMenu, BiHome, BiSolidUser} from 'react-icons/bi'
import {AiOutlineUser} from 'react-icons/ai'
import {BsFillArrowUpLeftCircleFill,BsFillSuitHeartFill} from 'react-icons/bs'
import {FiSettings} from 'react-icons/fi'
import {FaShoppingBasket, FaShoppingCart} from 'react-icons/fa'
import {FaUserFriends,FaUserCircle} from 'react-icons/fa'
import {RiSettings5Fill} from 'react-icons/ri'
import './Navbar.scss'
export default function Navbar({route, blur}) {
    const location = useLocation()
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const username = localStorage.getItem("username")?JSON.parse(localStorage.getItem("username")):''
    const [shouldBlur, setShouldBlur] = useState(false)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    const [currentPage, setCurrentPage] = useState(route?route:'')
    function handleTest() {
        console.log(route?route:'no route')
        console.log('W:', screenWidth, 'H:',screenHeight)
    }
    useEffect(()=> {
        if (blur) {
            setShouldBlur(true)
        } else {
            setShouldBlur(false)
        }
    }, [blur])
    return (
        <div className={`${(route&&(route==='profile'))
        ?'logo-profile-container':route==='settings'||route==='charity-page'
        ?`logo-settings-container`:'logo-container'}`}>
        {
            route!=='profile' && route!=='settings' && route!=='charity-page'?
             <div className="landing-link">    
             {((route && route === 'donate'))?
                 <Link className="landing-link" to='/dashboard'>
                    <div className="app-logo-alt"/>
                 </Link>
                 :
                 <div className="main-navbar-container">
                    <Link className="logo-text-container" to='/dashboard'>   
                        <div className="app-logo"/>
                        <p className="logo-text">
                            Springboard
                        </p> 
                    </Link>
                    <Link className={`${route==='cart'?'profile-cart-nav':'profile-nav-item'}`} to={`/${username}`}>
                        <div className={`navigation-item-alt ${route==='cart'?'cart-nav':''}`}>
                            <p className={`${route==='cart'?'cart-nav-text':'navigation-item-text-alt'}`}>
                                {username!==null?username.charAt(0).toUpperCase():''}
                            </p>
                        </div>
                    </Link>
                </div>
             }
             </div>
             :
            <>
                {(route==='settings' || route ==='charity-page') &&
                <Link className={`profile-nav-item-settings ${shouldBlur?'navbar-charity-container-inactive':
                route==='settings'?'':'navbar-charity-container-active'}`} 
                to={`/${username}`}>
                   <div className="settings-profile-item-alt">
                       <p className="navigation-item-text-alt settings-item-text">
                       {username!==null?username.charAt(0).toUpperCase():''}
                       </p>
                   </div>
               </Link>
                }
                 <Link to='/dashboard' 
                 className={`${route!=='charity-page'?'landing-link':(shouldBlur)?'navbar-charity-container-inactive landing-link-alt':
                 'navbar-charity-container-active landing-link-alt'}`}>   
                    
                    <div className="app-logo-alt"/>
                </Link>
                {
                <Link className={`${route!=='charity-page'?'settings-navigation-side-item':
                (shouldBlur)?'navbar-charity-container-inactive':
                 'navbar-charity-container-active charity-side-item-alt'}`} to={`/settings`}>
                    <RiSettings5Fill className="settings-profile-icon"/>
                </Link>
                }
                <Link className={`profile-navigation-side-item ${route==='charity-page'?'charity-side-item':''}`} to='/friends'>
                    <FaUserFriends className="friends-profile-icon"/>
                </Link>
            </>
        }  
        </div>
    )
}