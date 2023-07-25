import React, {useState, useEffect, useRef} from "react"
import './Profile.scss'
import './Donations.scss'
import DonationItem from "./DonationItem";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import SideBar from "./SideBar";
import Favorites from "./Favorites";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { AiOutlineLink, AiOutlineEdit,AiOutlineClockCircle } from 'react-icons/ai'

export default function Donations() {
  return (
    <div className={`settings-container`}>
        <Navbar route={'settings'}/>
        <div className={`settings-content`}>

            <div className="settings-header-container">
                <div className="settings-image-wrapper">
                    <p className="settings-image-text">
                        A
                    </p>
                </div>
                <div className="settings-header-wrapper">
                    <p className="settings-header-text">
                        {`Your Donation Portfolio`}
                    </p>
                    <div className="settings-link-container">
                        <AiOutlineLink className="link-icon"/>
                        <p className="settings-header-subtext">
                            link.springboard.app/aaronjiang/portfolio
                        </p>
                    </div>
                </div>
            </div>

            <div className="manage-settings-container">
                <div className="manage-settings-header-container">
                    <p className="manage-header-settings-text">
                        Contribution History
                    </p>
                    <p className="manage-header-subtext">
                        View all of the organizations you've helped here.
                    </p>
                </div>
            </div>
       
            <div className="personal-donations-grid">
                <div className="personal-donations-container">
                    <div className="donation-history-container">
                    <DonationItem type='Health' value={48} name='American Heart Association' size={'large'} date={'Yesterday'} />
                    <DonationItem type='Education' value={23.32} name='Kids In Need Foundation' size={'large'} date={'2 days ago'} />
                    <DonationItem type='Environment' value={8.90} name='The Conservation Fund' size={'large'} date={'Last week'} />
                    <DonationItem type='Human' value={32} name='Equal Justice Initiative' size={'large'} date={'1 month ago'} />
                    </div>
                </div>
                <div className="personal-donations-container">
                    <div className="donation-history-container">
                    <DonationItem type='Research' value={3.3} name='Free Code Camp' size={'large'} date={'1 month ago'} />
                    <DonationItem type='Animals' value={12.32} name='Zoo Animals Miami' size={'large'} date={'2 months ago'} />
                    <DonationItem type='Health' value={0.90} name='American Red Cross' size={'large'} date={'6 months ago'} />
                    <DonationItem type='Community' value={20} name='The Boston Foundation' size={'large'} date={'1 year ago'} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
