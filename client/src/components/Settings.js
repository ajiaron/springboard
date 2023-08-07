import React, {useState, useEffect, useRef, useContext} from "react"
import './Profile.scss'
import './Settings.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import DonationItem from "./DonationItem";
import SideBar from "./SideBar";
import Favorites from "./Favorites";
import axios from "axios";
import { BsStars } from 'react-icons/bs'
import UserContext from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLink, AiOutlineEdit,AiOutlineClockCircle } from 'react-icons/ai'
import { Amplify, Auth } from "aws-amplify";
import config from '../aws-exports';
Amplify.configure(config);
const ToggleSwitch = ({label, value, onToggle}) => {
    const [isToggled, setIsToggled] = useState(value)
    const [isAll, setIsAll] = useState(label==='all-categories' || label==='all-sizes')
    const [defaultVal, setDefaultVal] = useState(label==='all-categories' || label==='all-sizes')
    function handleClick() {
        setIsToggled(!isToggled)
        onToggle()
    }
        return (
          <div className="settings-switch-container">
            <div className="settings-toggle-switch">
              <input type="checkbox" className="checkbox" onChange={()=>handleClick()} 
                name={label} id={label} checked={isToggled}
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
    const id = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    // wont change until update is confirmed
    const firstname = localStorage.getItem("firstname")?JSON.parse(localStorage.getItem("firstname")):0
    const lastname = localStorage.getItem("lastname")?JSON.parse(localStorage.getItem("lastname")):0
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
    const [loading, setLoading] = useState(true)
    const [profilepic, setProfilePic] = useState(null) 
    const [shouldUpdate, setShouldUpdate] = useState()
    const [userData, setUserData] = useState(null)
    const [name, setName] = useState(localStorage.getItem("username")?JSON.parse(localStorage.getItem("username")):'')
    const [firstName, setFirstName] = useState(localStorage.getItem("firstname")?JSON.parse(localStorage.getItem("firstname")):null)
    const [lastName, setLastName] = useState(localStorage.getItem("lastname")?JSON.parse(localStorage.getItem("lastname")):null)
    const [location, setLocation] = useState('')
    const [social, setSocial] = useState('')
    const [email, setEmail] = useState(localStorage.getItem("email")?JSON.parse(localStorage.getItem("email")):'')
    const [bio, setBio] = useState('')
    const [isPublic, setIsPublic] = useState(true)
    const [notifications, setNotifications] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    function handleTest() {
        console.log(userData)
        console.log({
            nickname:nickname, 
            email:email, 
            firstName:firstName, 
            lastName:lastName, 
            social:social, 
            profilepic:profilepic, 
            isPublic:isPublic, 
            location:location, 
            bio:bio})
    }
    const handleChanges = async() => {
        try {
            setIsUpdating(true)
            const res = await axios.put(`${connection}/api/updateuser`, 
            {userid:id, username:nickname.length>0?nickname:name, firstname:firstName, lastname:lastName, email:email, bio:bio,
            location:location, social:social, profilepic:profilepic, public:isPublic})
            if (res.data) {
                console.log("update successful")
                localStorage.setItem("username", JSON.stringify(nickname.length>0?nickname:name))
                localStorage.setItem("email", JSON.stringify(email))
                localStorage.setItem("firstname", JSON.stringify(firstName))
                localStorage.setItem("lastname", JSON.stringify(lastName))
                window.location.reload()
            }
        } catch(e) {
            console.log(e)
        }
    }
    const handleSignOut = async() => {
        try {
            await Auth.signOut()
            navigate("/")
        } catch(e) {
            console.log(e)
        }
    }
    useEffect(()=> {
        const loadSettings = async() => {
            setLoading(true)
 
                try {
                    const res = await axios.get(`${connection}/api/getuserinfo`, {
                        params: {
                            userid:id
                        }
                    })
                    if (res.data && res.data.length > 0) {
                        setUserData(res.data[0])
                        setName(res.data[0].username)
                        setBio(res.data[0].bio!==null?res.data[0].bio:'')
                        setSocial(res.data[0].social!==null?res.data[0].social:'')
                        setLocation(res.data[0].location!==null?res.data[0].location:'')
                        setEmail(res.data[0].email!==null?res.data[0].email:'')
                    }
                    else {
                        console.log("couldnt do it")
                    }
                } catch(e) {
                    console.log(e)
                }
            
        }
        loadSettings()
        setLoading(false)
    }, [])
    useEffect(()=> {
        if (userData&&((nickname.length>0 && nickname !== userData.username) || userData.email !== email ||
            userData.firstname !== firstName || userData.lastname !== lastName ||
            (userData.bio !== bio) || (userData.location !== location)||
            (userData.social !== social)|| userData.profilepic !== profilepic ||
            userData.public != isPublic)) {
                setShouldUpdate(true)
        }
        else {
            setShouldUpdate(false)
        }
    }, [userData, nickname, email, firstName, lastName, bio, location, social, profilepic, isPublic])
    return (
        <div className={`settings-container`}>
            <Navbar route={'settings'}/>
            <div className={`settings-content`}>

                <div className="settings-header-container ">
                    <div className="settings-image-wrapper">
                        <p className="settings-image-text">
                            {name?name.charAt(0).toUpperCase():''}
                        </p>
                    </div>
                    
                    <div className="settings-header-wrapper ">
                        <p className="settings-header-text">
                            {(firstName!==null && lastName!==null)&&`${firstname} ${lastname}`}
                        </p>
                        <div className="settings-link-container">
                            <AiOutlineLink className="link-icon"/>
                            <p className="settings-header-subtext">
                                {`link.springboard.gift/${name&&name}`}
                            </p>
                        </div>
                    </div>
                    {
                    <span className="settings-save-changes-container" onClick={()=>handleChanges()}
                    style={{opacity:shouldUpdate?1:0, pointerEvents:shouldUpdate?'auto':'none'}}>
                        {`${(isUpdating)?'Please wait...':'Save Changes'}`}
                    </span>
                    }
                    <span className="logout-container" onClick={()=>handleTest()}>
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
                {(loading)?    
                <div className='settings-loading-text-container'>
                    <p className="settings-loading-text"> {`${(loading || !userData)?'Please wait...':`Viewing all matching results`}`} </p>
                </div>
                :<>
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
                                    springboard.gift/
                                </p>
                            </div>
                            <div className="nickname-display-container">
                                <p className="nickname-display-text">
                                    {userData?userData.username:name}
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
                                <ToggleSwitch label={'Public'} value={true} onToggle={()=>setIsPublic(!isPublic)}/>
                            </div>
                            <div className='settings-public-wrapper'>
                                <p className='catalog-category-text'>
                                    Allow Email Notifications
                                </p>
                                <ToggleSwitch label={'Notifications'} value={false} onToggle={()=>setNotifications(!notifications)}/>
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
                                    value={bio}
                                    onChange={(e)=>setBio(e.target.value)}
                                    placeholder="Tell us a bit more about you "/>
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
                                        value={firstName}
                                        onChange={(e)=>setFirstName(e.target.value)}
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
                                        value={lastName}
                                        onChange={(e)=>setLastName(e.target.value)}
                                        placeholder=""/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="settings-input-wrapper">
                            <p className="settings-input-details-subtext">
                                Email Address *
                            </p>
                        
                            <div className="personal-display-input-wrapper">
                                <div className="personal-icon-wrapper">
                                    <AiOutlineEdit className="nickname-edit-icon"/>
                                </div>
                                <div className="personal-edit-wrapper">
                                    <input className="personal-input-text"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
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
                                        value={location}
                                        onChange={(e)=>setLocation(e.target.value)}
                                        placeholder=""/>
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
                                        value={social}
                                        onChange={(e)=>setSocial(e.target.value)}
                                        placeholder=" "/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
                }
            </div>
        </div>
  )
}
