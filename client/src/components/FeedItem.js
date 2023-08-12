import React, {useState, useEffect, useRef} from "react"
import './Feed.scss'
import './Profile.scss'
import './Settings.scss'
import Navbar from "./Navbar";
import SideNavigation from "./SideNavigation";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import { BsCheck2,BsCheckLg } from 'react-icons/bs'
import DonationItem from "./DonationItem";
import SideBar from "./SideBar";
import Favorites from "./Favorites";
import { BsStars } from 'react-icons/bs'
import {BiSubdirectoryRight} from 'react-icons/bi'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import { Link } from "react-router-dom";

export default function FeedItem({id, name, username, charity, charityid, type, status, caption, date, index, route}) {
    function getColor(min, max) {
        return Math.random() * (max-min)+min
    }
    return (
    <div className={`${(route==='feed')?
        index===0?'feed-friends-item-first':index===3?'feed-friends-item-last':'feed-friends-item':
        index===3?'last-dashboard-item':index===0?'first-dashboard-item':'dashboard-feed-friends-item'}`}>
        <div className="feed-friends-image-container">
            <Link className="feed-image-link" to={`/${username}`}>
                <div className="feed-friends-image-wrapper">
                    <p className="feed-item-text-alt">
                        {name.charAt(0).toUpperCase()}
                    </p>
                </div>
            </Link>
          
        </div>
        <div className="feed-friends-item-info">
            <div className="feed-item-header">   
            <Link className="feed-item-link" to={`/${username}`}>
                <p className="feed-friends-item-title">
                    {name}{' '}
                </p>
            </Link> 
           
                <p className="feed-friends-item-title-alt">
                    made a donation to 
                </p>
                <Link className="feed-item-link" to={`/charity/${charityid}/${charity}/${type}`}>
                <p className="feed-friends-item-title">
                    {' '}{charity}
                </p>
                </Link>
            </div>
            <div className={`feed-${route==='feed'?'friends':'dashboard'}-text-wrapper`}>
                <p className={`feed-${route==='feed'?'donation':'dashboard'}-item-text`}>
                   {`@${username}`}
                </p>   
                <BsCheckLg className="dashboard-check-icon"/>
            </div>
            {(caption.length > 0)&&
            <div className={`feed-donation${route==='feed'?'':'-dashboard'}-caption`}>
                <p className={`feed-${route==='feed'?'donation':'dashboard'}-item-text-alt`}>
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