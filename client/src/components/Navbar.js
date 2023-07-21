import React, {useState, useEffect} from "react"
import { Link, useLocation } from "react-router-dom"
import {BiMenu, BiHome, BiSolidUser} from 'react-icons/bi'
import {AiOutlineUser} from 'react-icons/ai'
import {BsFillArrowUpLeftCircleFill,BsFillSuitHeartFill} from 'react-icons/bs'
import {FiSettings} from 'react-icons/fi'
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
        ?'logo-profile-container':route==='settings'
        ?'logo-settings-container':'logo-container'}`}>
        {
            route!=='profile' && route!=='settings'?
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
                {route==='settings'&&
                <Link className="profile-nav-item-settings" to='/profile'>
                   <div className="settings-profile-item-alt">
                       <p className="navigation-item-text-alt settings-item-text">
                           A
                       </p>
                   </div>
               </Link>
                }
                 <Link to='/' className="landing-link">   
                    <div className="app-logo-alt"/>
                </Link>
                <Link className="settings-navigation-side-item" to={`/settings`}>
                    <RiSettings5Fill className="settings-profile-icon"/>
                </Link>
                <span className="profile-navigation-side-item" onClick={()=>handleTest()}>
                    <FaUserFriends className="friends-profile-icon"/>
                </span>
             </>
        }  
        </div>
    )
}