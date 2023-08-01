import React, {useState, useEffect, useRef, useContext} from "react"
import './Landing.scss'
import './Dashboard.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import { BsCheck2,BsCheckLg } from 'react-icons/bs'
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";
import SideNavigation from "./SideNavigation";
import Doughchart from "./Doughchart";
import { AiFillHeart } from "react-icons/ai";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

const RecentDonation = ({name, charity, status, caption, date, index}) => {
    return (
        <div className={`${index===3?'last-dashboard-item':index===0?'first-dashboard-item':'dashboard-feed-friends-item'}`}>
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
                {   
                    <BsCheckLg className="dashboard-check-icon"/>
                }
            </div>
            {(caption.length > 0)&&
            <div className="feed-donation-dashboard-caption">
                <p className="feed-dashboard-item-text-alt">
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
    const user = useContext(UserContext)

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
            <SideNavigation route={'dashboard'}/>
            <div className={`dashboard-main-content`}>
                <div className="dashboard-content-container ">
                    <div className="dashboard-text-container  ">
                        <div className="dashboard-header-container">
                            <p className="dashboard-header">
                                {
                                    (user&&user.firstName)?
                                    `Welcome back, ${user.firstName}.`:
                                    `Your Dashboard`
                                }
                            </p>
                        </div>
                    </div>
                    <div className="dashboard-chart-container ">
                        <Doughchart/>
                        <div className="dashboard-grid-wrapper">
                            <div className="dashboard-grid-pair ">
                                <Link className="dashboard-grid-content-item" to='/catalog'>
                                        <div className="dashboard-grid-button-wrapper">
                                            <p className="dashboard-grid-button-text">
                                                View page
                                            </p>
                                        </div>
                                    <div className="dashboard-grid-item-text-container-alt">
                               
                                        <p className="dashboard-grid-item-text-left">
                                            Explore<br/>Charities
                                        </p>
                                    </div>
                                </Link>
                                <Link className="dashboard-grid-content-item" to={'/donations'}>
                                        <div className="dashboard-grid-button-wrapper-alt">
                                            <p className="dashboard-grid-button-text-alt">
                                                View page
                                            </p>
                                        </div>
                                    <div className="dashboard-grid-item-text-container">
                                        <p className="dashboard-grid-item-text">
                                            Your<br/>Donations
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="dashboard-content-lower">
                <div className="dashboard-header-container-alt">
                    <p className="dashboard-header-alt">
                        Recent Donations
                    </p>
                </div>
                 <div className="dashboard-feed-list-container">
                    <RecentDonation name={'Henry Zheng'} charity={'American Heart Association'} status={'approved'} caption={"ballin like a pacer"} date={'34m'} index={0}/>  
                    <RecentDonation name={'An Truong'} charity={'The Conservation Fund'} status={'approved'} caption={"🗿"} date={'2d'} index={1}/>
                    <RecentDonation name={'Thompson Nguyen'} charity={'#TeamTrees'} status={'approved'} caption={"mr beast give me an m"} date={'1w'} index={2}/>
                    <RecentDonation name={'Jason Damasco'} charity={'Kids In Need Foundation'} status={'approved'} caption={"smile to much they call me giddey"} date={'2w'} index={3}/>
                </div>
            </div>
        </div>
    </div>
    )
}