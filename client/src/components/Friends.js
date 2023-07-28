import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Dashboard.scss'
import './Friends.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import { BsCheck2,BsCheckLg } from 'react-icons/bs'
import { Link } from "react-router-dom";
import SideNavigation from "./SideNavigation";
import Doughchart from "./Doughchart";
import { BsSearch } from 'react-icons/bs'
import { AiFillHeart } from "react-icons/ai";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
const FriendsItem = ({name, status}) => {
    return (
    <div className="friends-page-item">
        <div className="friends-page-image-container">
            <div className="friends-page-image-wrapper">

            </div>
        </div>
        <div className="friends-page-item-info">
            <p className="friends-page-item-title">
                {name}
            </p>
            <div className="friends-page-text-wrapper">
                <p className="profile-donation-item-text">
                    Follows you
                </p>   
            </div>
        </div>
        <div className={`friends-page-item-button ${status?'friends-button-alt':''}`}>
            {status?
            <>
                <p className="friends-page-item-button-text-alt">
                    Following
                </p>
                 <BsCheckLg className="friends-check-icon"/>
            </>
            :
            <p className="friends-page-item-button-text">
                Follow
            </p>
            }
        </div>
    </div>
    )
}
export default function Friends() {
    const [query, setQuery] = useState('')
  return (
    <div className="friends-page-container">
        <SideNavigation route={'friends'}/>
        <div className="friends-page-content">
            <div className="friends-page-list-container">
                <div className='friends-showing-text-container'>
                    <p className="friends-loading-text"> {`Showing ${4} entries`} </p>
                </div>
                <div className="search-friends-container">
                    <input type="text" name="ownerName" id="ownerName"
                        onChange={(e)=> setQuery(e.target.value)}
                        value={query}
                        placeholder={`Search for a user...`}
                        className="search-friends" >
                    </input>
                    <BsSearch className="search-friends-icon"/>
                </div>
                <div className="friends-page-list">
                        <div className="friends-page-list-content">
                            <FriendsItem name={'Henry Zheng'} status={true}/>
                            <FriendsItem name={'An Truong'} status={false}/>
                            <FriendsItem name={'Thompson Nguyen'} status={true}/>
                            <FriendsItem name={'Jason Damasco'} status={false}/>
                        </div>
                    </div>
            </div>
          
        </div>
    </div>
  )
}
