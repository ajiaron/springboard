import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Dashboard.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import SideNavigation from "./SideNavigation";
import Doughchart from "./Doughchart";
import { AiFillHeart } from "react-icons/ai";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

const RecentDonation = ({name, charity, status, caption, date, last}) => {
    return (
        <div className={`${last?'last-dashboard-item':'dashboard-feed-friends-item'}`}>
        <div className="feed-friends-image-container">
            <div className="feed-friends-image-wrapper">

            </div>
        </div>
        <div className="feed-friends-item-info">
            <div className="feed-item-header">    
                <p className="feed-friends-item-title">
                    {name} {' '}
                </p>
                <p className="feed-friends-item-title-alt">
                    made a donation to 
                </p>
                <p className="feed-friends-item-title">
                    {' '}{charity}
                </p>
            </div>
            <div className="feed-dashboard-text-wrapper">
                <p className="feed-dashboard-item-text">
                    Follows you
                </p>   
            </div>
            {(caption.length > 0)&&
            <div className="feed-donation-dashboard-caption">
                <p className="feed-donation-item-text-alt">
                   {caption}
                </p>
            </div>
            }
        </div>
        <div className="feed-item-date-container">
            <AiFillHeart className="feed-like-icon"/>
            <p className="feed-donation-item-text-alt"> 
                {date}
            </p>
        </div>
    </div>    
    )
}
export default function Dashboard() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    const [signInActive, setSignInActive] = useState(null)
    const [firstRender, setFirstRender] = useState(true)
    const [isActive, setIsActive] = useState(true)  // background is active
    const handleSignIn = (type) => {
        setFirstRender(false)
        setSignInActive(type)
        setIsActive(false)
    }
    const handleBlur = () => {
        setIsActive(true)
    }
    const closeSignIn = () => {
        setSignInActive(null)
    }
    function handleTest() {
        console.log(signInActive)
    }
    useEffect(()=>{
        if (signInActive !== null) {
            document.body.style.overflow='hidden'
        }
        else {
            document.body.style.overflow='auto'
        }
      }, [signInActive])
    return (
        <div className="dashboard-container">
        {
            (signInActive!==null)&&<Signin type={signInActive} onClose={closeSignIn} onBlur={handleBlur}/>
        }
        <SideNavigation/>
            <div className={`dashboard-main-content`}>
  
           
                <div className="dashboard-content-container ">


                    <div className="dashboard-text-container  ">
                        <div className="dashboard-header-container">
                            <p className="dashboard-header">
                                Your Dashboard
                            </p>
                        </div>
                    </div>
                    <div className="dashboard-chart-container ">
                       
                            <Doughchart/>
             
             
                        <div className="dashboard-grid-wrapper">
                        <div className="dashboard-grid-pair">
                            <Link className="dashboard-grid-content-item" to='/feed'>
                                <div className="dashboard-grid-item-text-container-alt">
                              
                                    <p className="dashboard-grid-item-text-left">
                                        Recent<br/>Donations
                                    </p>
                                </div>
                            </Link>
                            <Link className="dashboard-grid-content-item" to={'/donations'}>
                                <div className="dashboard-grid-item-text-container">
                                    <p className="dashboard-grid-item-text">
                                        Your<br/>Donations
                                    </p>
                                </div>
                            </Link>
                        </div>
                        </div>
                     
                    </div>

              
                    {/* grid content 
                
                    <div className="dashboard-grid-content">
                        <Link className="discover-link" to='/catalog'>
                            <div className="dashboard-grid-content-main">
                                <div className="discover-scene"/>
                                <div className="dashboard-grid-main-text-container">
                                    <p className="dashboard-grid-main-text">
                                        Discover
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <div className="dashboard-grid-pair">
                            <Link className="dashboard-grid-content-item" to='/feed'>
                                <div className="dashboard-grid-item-text-container-alt">
                              
                                    <p className="dashboard-grid-item-text-left">
                                        Recent<br/>Donations
                                    </p>
                                </div>
                            </Link>
                            <Link className="dashboard-grid-content-item" to={'/donations'}>
                                <div className="dashboard-grid-item-text-container">
                                    <p className="dashboard-grid-item-text">
                                        Your<br/>Donations
                                    </p>
                                </div>
                            </Link>
                        </div>
           
                    </div>
                     */}
            
                </div>
            <div className="dashboard-content-lower">
                <div className="dashboard-header-container-alt">
                    <p className="dashboard-header-alt">
                        Recent Donations
                    </p>
                </div>
                 <div className="dashboard-feed-list-container">
                    <RecentDonation name={'Henry Zheng'} charity={'American Heart Association'} status={'approved'} caption={"ballin like a pacer"} date={'34m'} last={false}/>  
                    <RecentDonation name={'An Truong'} charity={'The Conservation Fund'} status={'approved'} caption={"🗿"} date={'2d'} last={false}/>
                    <RecentDonation name={'Thompson Nguyen'} charity={'#TeamTrees'} status={'approved'} caption={"mr beast give me an m"} date={'1w'} last={false}/>
                    <RecentDonation name={'Jason Damasco'} charity={'Kids In Need Foundation'} status={'approved'} caption={""} date={'2w'} last={true}/>
                </div>
            </div>
        </div>
    </div>
    )
}