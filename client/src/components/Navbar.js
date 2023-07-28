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
export default function Navbar({route}) {
    const location = useLocation()
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    const [currentPage, setCurrentPage] = useState(route?route:'')
    function handleTest() {
        console.log(route?route:'no route')
        console.log('W:', screenWidth, 'H:',screenHeight)
    }
    return (
        <div className={`${(route&&(route==='profile'))
        ?'logo-profile-container':route==='settings'||route==='charity-page'
        ?`logo-settings-container`:'logo-container'}`}>
        {
            route!=='profile' && route!=='settings' && route!=='charity-page'?
             <div className="landing-link">    
             {((route && route === 'donate'))?
                 <Link className="landing-link" to='/'>
                    <div className="app-logo-alt"/>
                 </Link>
                 :
                 <div className="main-navbar-container">
                     <Link className="logo-text-container" to='/'>   
                        <div className="app-logo"/>
                         <p className="logo-text">
                             Springboard
                         </p> 
                     </Link>
                    
            

                        <Link className={`${route==='cart'?'profile-cart-nav':'profile-nav-item'}`} to='/profile'>
                            <div className={`navigation-item-alt ${route==='cart'?'cart-nav':''}`}>
                                <p className={`${route==='cart'?'cart-nav-text':'navigation-item-text-alt'}`}>
                                    A
                                </p>
                            </div>
                        </Link>
           

                </div>
             }
             </div>
             :
             <>
                {(route==='settings' || route ==='charity-page') &&
                <Link className="profile-nav-item-settings" to='/profile'>
                   <div className="settings-profile-item-alt">
                       <p className="navigation-item-text-alt settings-item-text">
                           A
                       </p>
                   </div>
               </Link>
                }
                 <Link to='/dashboard' className={`${route!=='charity-page'?'landing-link':'landing-link-alt'}`}>   
                    <div className="app-logo-alt"/>
                </Link>
                {
                <Link className={`${route!=='charity-page'?'settings-navigation-side-item':'charity-side-item-alt'}`} to={`/settings`}>
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