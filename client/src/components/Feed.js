import React, {useState, useEffect, useRef} from "react"
import './Feed.scss'
import './Profile.scss'
import './Settings.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import DonationItem from "./DonationItem";
import SideBar from "./SideBar";
import Favorites from "./Favorites";
import { BsStars } from 'react-icons/bs'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import { Link } from "react-router-dom";
const FriendsItem = ({name, charity, status, caption, date}) => {
    return (
    <div className="feed-friends-item">
        <div className="feed-friends-image-container">
            <div className="feed-friends-image-wrapper">

            </div>
        </div>
        <div className="feed-friends-item-info">
            <div className="feed-item-header">    
                <p className="feed-friends-item-title">
                    {name}{' '}
                </p>
                <p className="feed-friends-item-title-alt">
                    made a donation to 
                </p>
                <p className="feed-friends-item-title">
                    {' '}{charity}
                </p>

            </div>
            <div className="feed-friends-text-wrapper">
                <p className="feed-donation-item-text">
                    Follows you
                </p>   
            </div>
            {(caption.length > 0)&&
            <div className="feed-donation-caption">
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

export default function Feed() {
  return (
    <div className={`feed-container`}>
        <Navbar route={'settings'}/>
        <div className={`feed-content`}>

            <div className="feed-header-container">

            <div className="feed-list-header-container">
                    <p className="feed-header-text">
                        Donation Feed
                    </p>
                    <p className="feed-header-subtext">
                        View recent donations made by your friends here.
                    </p>
                </div>
            </div>

            <div className="feed-list-container">
                <FriendsItem name={'Henry Zheng'} charity={'American Heart Association'} status={'approved'} caption={"ballin like a pacer"} date={'34m'}/>
                <FriendsItem name={'An Truong'} charity={'The Conservation Fund'} status={'approved'} caption={""} date={'2d'}/>
                <FriendsItem name={'Thompson Nguyen'} charity={'#TeamTrees'} status={'approved'} caption={"mr beast give me an m"} date={'1w'}/>
                <FriendsItem name={'Jason Damasco'} charity={'Kids In Need Foundation'} status={'approved'} caption={""} date={'2w'}/>
            </div>
        </div>
    </div>
  )
}
