import React, {useState, useEffect, useRef} from "react"
import './Feed.scss'
import './Profile.scss'
import './Settings.scss'
import FeedItem from "./FeedItem"
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

export default function Feed() {
  return (
    <div className={`feed-container`}>
        <SideNavigation route={'feed'}/>
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
                <FeedItem id = {0} name={'Henry Zheng'} username={'hzenry'} charity={'American Heart Association'} charityid={171} type={"healthcare"} status={'approved'} caption={"ballin like a pacer"} date={'34m'} index={0} route={'feed'}/>
                <FeedItem id = {0} name={'An Truong'} username={'antruong_'} charity={'The Conservation Fund'} charityid={135} type={"environment"} status={'approved'} caption={""} date={'2d'} index={1} route={'feed'}/>
                <FeedItem id = {0} name={'Thompson Nguyen'} username={'tnompson'} charity={'World Forestry Center'} charityid={96} type={"environment"} status={'approved'} caption={"mr beast give me an m"} date={'1w'} index={2} route={'feed'}/>
                <FeedItem id = {0} name={'Jason Damasco'} username={'jdason'} charity={'Kids In Need Foundation'} charityid={107} type={"education"} status={'approved'} caption={""} date={'2w'} index={3} route={'feed'}/>
            </div>
        </div>
    </div>
  )
}
