import React, {useState, useEffect} from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {BiMenu, BiHome, BiSolidUser} from 'react-icons/bi'
import {AiOutlineUser,AiOutlineShoppingCart,AiOutlineQuestionCircle,AiOutlineLink,AiOutlineStar,AiOutlineHome,AiOutlineGift} from 'react-icons/ai'
import {BsPatchQuestion,BsFillSuitHeartFill,BsPerson} from 'react-icons/bs'
import {FiSettings,FiShoppingCart} from 'react-icons/fi'
import {FaShoppingBasket, FaShoppingCart, FaBars} from 'react-icons/fa'
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
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [expanded, setExpanded] = useState(route!=="profile"&&route!=="settings"&&route!=="charity")
  const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
  const username = localStorage.getItem("username")?JSON.parse(localStorage.getItem("username")):0
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  function handleNavigate(url) {
    navigate(`/${url}`)
  }

  return (
    
    <>{(expanded)?
    <div className={(route==="profile"||route==="charity"||route==="settings")?
    "side-console-container-alt":"side-console-container"}>
            {(route==="profile"||route==="charity"||route==="settings")?
                <div className="console-header-container-alt">
                    <span className="console-content-wrapper-closed-alt" onClick={()=>setExpanded(!expanded)} >   
                        <FaBars className="home-icon-closed"/>
                    </span>
                </div>
        :
            <div className="console-header-container">
                <Link className="console-logo-text-container" to='/dashboard'>   
                    <div className="console-app-logo"/>
                    <p className="console-logo-text">
                        Springboard
                    </p> 
                </Link>
            </div>
            }
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
                style={{filter:(route==='profile')?'brightness(1.25)':'brightness(1)'}}>
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
    </div>:

<div className={(route==="profile"||route==="charity"||route==="settings")?
"side-console-container-closed":"side-console-container"}>
    <div className={"console-content-container-closed"}>
        <span className="console-content-wrapper-closed" onClick={()=>setExpanded(!expanded)} >   
            <FaBars className="home-icon-closed"/>
        </span>
    </div>
    
    <div className="console-content-container-closed ">
        <Link className={(route==="dashboard")?"console-content-wrapper-active":"console-content-wrapper-closed"} to={'/dashboard'} 
           onMouseEnter={handleMouseEnter} 
           onMouseLeave={handleMouseLeave}>
            <AiOutlineHome className="home-icon-closed"
            style={{filter:(route==='dashboard')?'brightness(1.25)':'brightness(1)'}}/>
           
        </Link>  
        <Link className={(route==="feed")?"console-content-wrapper-active":"console-content-wrapper-closed"} to={'/feed'}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <HiOutlineNewspaper className="home-icon-closed"
            style={{filter:(route==='feed')?'brightness(1.25)':'brightness(1)'}}/>
          
        </Link>
        <Link className={(route==="catalog")?"console-content-wrapper-active":"console-content-wrapper-closed"} to={'/catalog'}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <BiBookmarks className="home-icon-closed"
            style={{filter:(route==='catalog')?'brightness(1.25)':'brightness(1)'}}/>
      
        </Link>
        <Link className={(route==="donations")?"console-content-wrapper-active":"console-content-wrapper-closed"} to={'/donations'}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <AiOutlineGift className="home-icon-closed"
            style={{filter:(route==='donations')?'brightness(1.25)':'brightness(1)'}}/>
     
        </Link>
        <Link className={(route==="archive")?"console-content-wrapper-active":"console-content-wrapper-closed"} to={'/archive'}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <BiBookHeart className="home-icon-closed"
            style={{filter:(route==='archive')?'brightness(1.25)':'brightness(1)'}}/>
           
        </Link>
        <Link className={(route==="cart")?"console-content-wrapper-active":"console-content-wrapper-closed"} to={'/cart'}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <LiaShoppingBasketSolid className="home-icon-closed"
            style={{filter:(route==='cart')?'brightness(1.25)':'brightness(1)'}}/>
           
        </Link>
    </div>

    <div className="console-content-container first-content ">

        <Link className={(route==="profile" &&!isHovered)?"console-content-wrapper-active":"console-content-wrapper-closed"} to={`/${username}`}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <BsPerson className="home-icon-closed" 
            style={{filter:(route==='profile')?'brightness(1.25)':'brightness(1)'}}/>
          
        </Link>
        <Link className={(route==="friends")?"console-content-wrapper-active":"console-content-wrapper-closed"} to={'/friends'}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <LiaUserFriendsSolid className="home-icon-closed"
            style={{filter:(route==='friends')?'brightness(1.25)':'brightness(1)'}}/>
           
        </Link>
        <Link className={(route==="settings")?"console-content-wrapper-active":"console-content-wrapper-closed"} to={'/settings'}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <FiSettings className="console-settings-icon-closed" 
            style={{filter:(route==='settings')?'brightness(1.25)':'brightness(1)'}}/>
          
        </Link>
    </div>

    <div className="console-content-container-closed first-content ">

        <Link className="console-content-wrapper-closed "
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <AiOutlineStar className="home-icon-closed" to={'https://github.com/ajiaron'}/>
           
        </Link>
        <span className="console-content-wrapper-closed "
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <AiOutlineQuestionCircle className="home-icon-closed"/>
           
        </span>
    </div>
    <div className="console-content-container-closed first-content ">

        <div className="console-content-wrapper-closed "
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            <AiOutlineLink className="console-link-icon-closed" />
        </div>
    </div>   
                   
</div>

    }
    </>
    
  )
}
