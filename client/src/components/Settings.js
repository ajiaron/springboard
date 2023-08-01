import React, {useState, useEffect, useRef, useContext} from "react"
import './Profile.scss'
import './Settings.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import DonationItem from "./DonationItem";
import SideBar from "./SideBar";
import Favorites from "./Favorites";
import { BsStars } from 'react-icons/bs'
import UserContext from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLink, AiOutlineEdit,AiOutlineClockCircle } from 'react-icons/ai'
import { Amplify, Auth } from "aws-amplify";
import config from '../aws-exports';
Amplify.configure(config);
const ToggleSwitch = ({label}) => {
    const [isToggled, setIsToggled] = useState(false)
    const [isAll, setIsAll] = useState(label==='all-categories' || label==='all-sizes')
    const [defaultVal, setDefaultVal] = useState(label==='all-categories' || label==='all-sizes')
    function handleClick() {
        setIsToggled(!isToggled)
    }
        return (
          <div className="settings-switch-container">
            <div className="settings-toggle-switch">
              <input type="checkbox" className="checkbox" onChange={()=>handleClick()} 
                name={label} id={label} 
             />
              <label className="settings-label" htmlFor={label}>
                <span className="settings-inner" />
                <span className="settings-switch" />
              </label>
            </div>
          </div>
        );
}

export default function Settings() {
    const navigate = useNavigate()
    const user = useContext(UserContext)
    const [nickname, setNickname] = useState('')
    const handleSignOut = async() => {
        try {
            await Auth.signOut()
            navigate("/")
        } catch(e) {
            console.log(e)
        }
    }
    return (
        <div className={`settings-container`}>
            <Navbar route={'settings'}/>
            <div className={`settings-content`}>

                <div className="settings-header-container ">
                    <div className="settings-image-wrapper">
                        <p className="settings-image-text">
                            A
                        </p>
                    </div>
                    
                    <div className="settings-header-wrapper ">
                        <p className="settings-header-text">
                            {`Aaron Jiang`}
                        </p>
                        <div className="settings-link-container">
                            <AiOutlineLink className="link-icon"/>
                            <p className="settings-header-subtext">
                                link.springboard.app/aaronjiang
                            </p>
                        </div>
                    </div>
                    <span className="logout-container" onClick={()=>handleSignOut()}>
                            Logout
                    </span>

                </div>

                <div className="manage-settings-container">
                    <div className="manage-settings-header-container">
                        <p className="manage-header-settings-text">
                            Manage account
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
                    {/* 
                    <div className="personal-details-change">
                                <div className='settings-public-wrapper'>
                                    <p className='catalog-category-text'>
                                        Public Account
                                    </p>
                                    <ToggleSwitch label={'Public'}
                                    />
                                </div>

                            </div>
                    */}
                           
                </div>


                <div className="privacy-container">
                    <div className="nickname-details-container">
                        <p className="nickname-details-text">
                            Privacy Preferences
                        </p>
                        <p className="nickname-details-subtext">
                            Allow users to view your donations and account links.
                        </p>
                    </div>

            
                    <div className="personal-details-change">
                        <div className="settings-switch-wrapper">
                            <div className='settings-public-wrapper'>
                                <p className='catalog-category-text'>
                                    Public Account
                                </p>
                                <ToggleSwitch label={'Public'}/>
                            </div>
                            <div className='settings-public-wrapper'>
                                <p className='catalog-category-text'>
                                    Allow Email Notifications
                                </p>
                                <ToggleSwitch label={'Notifications'}/>
                            </div>
                        </div>
                     
                    </div>        
                          
                    
                </div>
                        


                <div className="personal-container">
                    <div className="nickname-details-container">
                        <p className="nickname-details-text">
                            Personal Information
                        </p>
                        <p className="nickname-details-subtext">
                            Review and edit your personal info and account details here.
                        </p>
                    </div>
                    <div className="personal-input-container">
                        <div className="settings-input-wrapper">
                            <p className="settings-input-details-subtext">
                                Short Bio
                            </p>
                        
                            <div className="personal-display-input-wrapper">
                                <div className="personal-icon-wrapper">
                                    <AiOutlineEdit className="nickname-edit-icon"/>
                                </div>
                                <div className="personal-edit-wrapper">
                                    <input className="personal-input-text"
                                    value={nickname}
                                    onChange={(e)=>setNickname(e.target.value)}
                                    placeholder="Tell us about yourself in a short bio "/>
                                </div>
                            </div>
                        </div>

                        <div className="settings-fullname-container">
                            <div className="settings-input-wrapper-small">
                                <p className="settings-input-details-subtext">
                                    First Name
                                </p>
                                <div className="personal-name-input-wrapper">
                                <div className="personal-icon-wrapper personal-wrapper-alt">
                                    <AiOutlineEdit className="nickname-edit-icon"/>
                                </div>
                                    <div className="personal-edit-wrapper">
                                        <input className="personal-name-input-text"
                                        value={nickname}
                                        onChange={(e)=>setNickname(e.target.value)}
                                        placeholder=""/>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-input-wrapper-small">
                                <p className="settings-input-details-subtext">
                                    Last Name
                                </p>
                                <div className="personal-name-input-wrapper">
                                <div className="personal-icon-wrapper personal-wrapper-alt">
                                    <AiOutlineEdit className="nickname-edit-icon"/>
                                </div>
                                    <div className="personal-edit-wrapper">
                                        <input className="personal-name-input-text"
                                        value={nickname}
                                        onChange={(e)=>setNickname(e.target.value)}
                                        placeholder=""/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="settings-input-wrapper">
                            <p className="settings-input-details-subtext">
                                Email Address
                            </p>
                        
                            <div className="personal-display-input-wrapper">
                                <div className="personal-icon-wrapper">
                                    <AiOutlineEdit className="nickname-edit-icon"/>
                                </div>
                                <div className="personal-edit-wrapper">
                                    <input className="personal-input-text"
                                    value={nickname}
                                    onChange={(e)=>setNickname(e.target.value)}
                                    placeholder="Enter your email address "/>
                                </div>
                            </div>
                        </div>

                        <div className="settings-fullname-container">
                            <div className="settings-input-wrapper-small">
                                <p className="settings-input-details-subtext">
                                    Location
                                </p>
                                <div className="personal-name-input-wrapper">
                                <div className="personal-icon-wrapper personal-wrapper-alt">
                                    <AiOutlineEdit className="nickname-edit-icon"/>
                                </div>
                                    <div className="personal-edit-wrapper">
                                        <input className="personal-name-input-text"
                                        value={nickname}
                                        onChange={(e)=>setNickname(e.target.value)}
                                        placeholder=" "/>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-input-wrapper-small">
                                <p className="settings-input-details-subtext">
                                    Social Link
                                </p>
                                <div className="personal-name-input-wrapper">
                                <div className="personal-icon-wrapper personal-wrapper-alt">
                                    <AiOutlineEdit className="nickname-edit-icon"/>
                                </div>
                                    <div className="personal-edit-wrapper">
                                        <input className="personal-name-input-text"
                                        value={nickname}
                                        onChange={(e)=>setNickname(e.target.value)}
                                        placeholder=" "/>
                                    </div>
                                </div>
                            </div>
                        </div>

                       
   
                        
                  
                    </div>
                </div>
                <div className="settings-footer-container">
                <Footer route={'settings'}/>
                </div>
              
            </div>
        </div>
  )
}
