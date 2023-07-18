import React, {useState, useEffect, useRef} from "react"
import './Profile.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { AiOutlineLink, AiOutlineEdit,AiOutlineClockCircle } from 'react-icons/ai'

const DonationIten = ({name, type}) => {
    return (
        <div className="profile-donation-item">
        <div className="profile-donation-item-info">
                <p className="profile-donation-item-title">
                    {name}
                </p>
                <div className="profile-donation-text-wrapper">
                    <AiOutlineClockCircle className="profile-clock-icon"/>
                <p className="profile-donation-item-text">
                    3 weeks ago
                </p>   
                </div>

          <div className={`profile-donation-item-type-wrapper profile-${type.toLowerCase()}`}>
             <p className="profile-donation-item-type-text">
                {type==='Human'?'Human Rights & Services':
                type==='Research'?'Research & Public Policy':
                type==='Community'?'Community Development'
            :type}
            </p>
          </div>
        </div>
       
    </div>
    )
}
const FriendsItem = ({name, status}) => {
    return (
        <div className="profile-friends-item">
            <div className="profile-friends-image-container">
                <div className="profile-friends-image-wrapper">

                </div>
            </div>
            <div className="profile-friends-item-info">
                    <p className="profile-friends-item-title">
                        {name}
                    </p>
                    <div className="profile-friends-text-wrapper">
                       
                    <p className="profile-donation-item-text">
                        Follows you
                    </p>   
                    </div>

            
            </div>
    </div>
    )
}


export default function Profile() {
  const [nickname, setNickname] = useState('')
  return (
    <div className="profile-page-container">
        <Navbar route={'profile'}/>
        <div className="profile-page-content">
            <div className="profile-header-container">
                <div className="profile-image-wrapper">
                    <p className="profile-image-text">
                        A
                    </p>
                </div>
                <div className="profile-header-wrapper">
                    <p className="profile-header-text">
                        Aaron Jiang
                    </p>
                    <div className="profile-link-container">
                        <AiOutlineLink className="link-icon"/>
                        <p className="profile-header-subtext">
                            link.springboard.app/aaronjiang
                        </p>
                    </div>
                </div>
            </div>

            <div className="manage-profile-container">
                <div className="manage-header-container">
                    <p className="manage-header-text">
                        Manage profile
                    </p>
                    <p className="manage-header-subtext">
                        Update your account preferences here.
                    </p>
                </div>
            </div>
            <div className="nickname-container">
                <div className="nickname-details-container">
                    <p className="nickname-details-text">
                        Display Name
                    </p>
                    <p className="nickname-details-subtext">
                        Your profile and account link will appear under this name.
                    </p>
                </div>
                <div className="nickname-input-container">
                    <div className="nickname-display-wrapper">
                        <div className="nickname-display-url">
                            <p className="nickname-url-text">
                                springboard.app/
                            </p>
                        </div>
                        <div className="nickname-display-container">
                            <p className="nickname-display-text">
                                aaronjiang
                            </p>
                        </div>
                    </div>
                    <div className="nickname-display-input-wrapper">
                        <div className="nickname-icon-wrapper">
                            <AiOutlineEdit className="nickname-edit-icon"/>
                        </div>
                        <div className="nickname-edit-wrapper">
                            <input className="nickname-input-text"
                            value={nickname}
                            onChange={(e)=>setNickname(e.target.value)}
                            placeholder="Enter a display name"/>
                   
                        
                        </div>
                  
                    </div>
                </div>
            </div>
            
            <div className="account-container">
                <div className="account-donations-container">
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Recent Donations
                        </p>
                        <p className="donation-details-subtext">
                            View your latest donations and pledges here.
                        </p>
                    </div>

                    <div className="account-donations-list">
                        <div className="account-donations-list-content">
                            <DonationIten name={'American Heart Association'} type={'Healthcare'}/>
                            <DonationIten name={'Nevada Conservation Fund'} type={'Environment'}/>
                            <DonationIten name={'Open Source Foundation'} type={'Research'}/>
                        </div>
                    </div>
                </div>
                <div className="account-friends-container">
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Friends List
                        </p>
                        <p className="donation-details-subtext">
                            View your active friends and pending requests here.
                        </p>
                    </div>
                    <div className="account-friends-list">
                        <div className="account-friends-list-content">
                            <FriendsItem name={'Henry Zheng'} status={'approved'}/>
                            <FriendsItem name={'An Truong'} status={'approved'}/>
                            <FriendsItem name={'Thompson Nguyen'} status={'approved'}/>
                            <FriendsItem name={'Jason Damasco'} status={'approved'}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}
