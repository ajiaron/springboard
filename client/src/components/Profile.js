import React, {useState, useEffect, useRef} from "react"
import './Profile.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityItem from './CharityItem'
import SideBar from "./SideBar";
import Favorites from "./Favorites";
import { BsStars, BsPlusLg } from 'react-icons/bs'
import { Link, useParams, useNavigate } from "react-router-dom";
import {BiEdit, BiEditAlt,BiPencil} from 'react-icons/bi'
import {AiOutlineHeart, AiFillHeart, AiOutlineLink, AiOutlineEdit, AiOutlineClockCircle, AiOutlinePlus } from 'react-icons/ai'
import { PolarArea, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import axios from "axios";
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
const FavoriteItem = ({charityid, charityname, value, size, type, index, onNavigate}) => {

    return (
        <span onClick={()=>onNavigate(charityid, charityname, type)}
            className={`profile-favorite-item-container ${type==='Human'?'hr':type==='Healthcare'?'health':
            type.toLowerCase()}-item`}>
            <div className="profile-favorite-item-category">
                <p className={`category-favorite-text ${type==='Healthcare'?'health':type.toLowerCase()}-text`}>
                {`${type==='Human'?'Human Rights & Services':type==='Healthcare'?'Health':
                    type==='Research'?'Research & Public Policy':
                    type==='Community'?'Community Development':type}`}
                </p>
                <AiFillHeart className="profile-favorite-icon"/>
            </div>
            <div className="profile-favorite-item-figure">
                <p className="profile-favorite-figure-text">
                    {parseFloat(value).toFixed(1)}
                </p>
            </div>

            <div className="profile-favorite-item-name">
                <p className="profile-favorite-name-text">
                    {charityname}
                </p>
            </div>
            <div className="profile-favorite-type-container">
                <div className={`profile-favorite-item-type-wrapper mid-favorite-wrapper`}>
                    <p className="profile-favorite-item-type-text">
                        {`${size}-Sized`}
                    </p>
                </div>
            </div>

        </span>
    )
}
const DonationItem = ({name, type, index}) => {
    return (
    <div className={`profile-donation-item ${index===2?'donation-item-last':''}`}>
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
  const {username} = useParams()
  const navigate = useNavigate()
  const id = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
  const name = localStorage.getItem("username")?JSON.parse(localStorage.getItem("username")):0
  const firstname = localStorage.getItem("firstname")?JSON.parse(localStorage.getItem("firstname")):0
  const lastname = localStorage.getItem("lastname")?JSON.parse(localStorage.getItem("lastname")):0
  const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [hasBio, setHasBio] = useState(false)
  const [favorites, setFavorites] = useState([])

  function handleNavigate(id, name, type) {
    navigate(`/charity/${id}/${name}/${type.toLowerCase()}`)
}

  useEffect(()=> {
    const loadFavorites = (id) => {
        axios.get(`${connection}/api/getfavorites/${id}`)
        .then((res)=> {
            setLoading(false)
            setFavorites(res.data)
        })
        .catch((e)=>console.log(e))
    }
    const loadUser = async() => {
        setLoading(true)
        try {
            const res = await axios.get(`${connection}/api/getuser`,{
                params: {
                    username:username?username:'default'
                }
            })
            if (res.data && res.data.length > 0) {
                setUserData(res.data[0])
                setHasBio(res.data[0].bio!==null && res.data[0].bio.length > 0)
                loadFavorites(id)
            } 
            else {
                navigate('/dashboard')
            }
        } catch(e) {
            console.log(e)
        }
    }
    loadUser()
  }, [])

  return (
    <div className="profile-page-container">
        <Navbar route={'profile'}/>
        <div className="profile-page-content">
            <div className="profile-header-container  ">
                <div className="profile-image-wrapper">
                    <p className="profile-image-text">
                        {`${username&&username.charAt(0).toUpperCase()}`}
                    </p>
                </div>
                {(!loading && userData)&&
                <div className={`${(hasBio)?'profile-header-wrapper-alt':'profile-header-wrapper'}`}>
                    <p className={`${(hasBio)?'profile-header-text-alt':'profile-header-text'}`}>
                        {username&&username===name?`${firstname} ${lastname}`:
                        loading?'':userData&&`${userData.firstname} ${userData.lastname}`}
                    </p>
                    <div className={`${(hasBio)?'profile-link-container-alt':'profile-link-container'}`}>
                        <AiOutlineLink className="link-icon"/>
                        <p className={`${(hasBio)?'profile-header-subtext-alt':'profile-header-subtext'}`}>
                            {`link.springboard.gift/${username?username:''}`}
                        </p>
                    </div>
                    {(hasBio)&&
                    <div className="profile-bio-container">
                        <BiPencil className="pen-icon"/>
                        <p className="profile-header-bio">
                            {userData&&userData.bio}
                        </p>
                    </div>
                    }
          
                </div>
                }
                  <span className='profile-follow-button'>
                        <div className="profile-follow-link-button">
                            <p className="profile-follow-text">
                                {
                                  "Follow"
                                }
                            </p>
                            <AiOutlinePlus className="profile-follow-icon"/>
                        </div>
                      </span>
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
          
            {(loading || !favorites)?    
                <div className='settings-loading-text-container'>
                    <p className="settings-loading-text"> {`${(loading || !userData)?'Please wait...':`Viewing all matching results`}`} </p>
                </div>
                :
            <>
            <div className="profile-favorites-wrapper">
                 <div className="donation-details-container">
                        <p className="donation-details-text">
                            Favorite Charities
                        </p>
                        <p className="donation-details-subtext">
                            Your collection of charities to be displayed on your profile.
                        </p>
                </div>
                <div className="profile-favorites-container">
     
                    
                    <div className="subcontent-profile-container">
                        {(favorites)&&
                            favorites.map((item, index) => (
                                <FavoriteItem charityid={item.charityid} charityname={item.charity_name} value={item.overall_score} size={item.size} type={item.type1} index={index} 
                                onNavigate={(id,name,type)=>handleNavigate(id,name,type)}/>
                            ))
                        }
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
                            <DonationItem name={'American Heart Association'} type={'Healthcare'} index={0}/>
                            <DonationItem name={'Nevada Conservation Fund'} type={'Environment'} index={1}/>
                            <DonationItem name={'Open Source Foundation'} type={'Research'} index={2}/>
                        </div>
                    </div>
                </div>
                <div className="account-friends-container">
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Followers List
                        </p>
                        <p className="donation-details-subtext">
                            View your active followers and pending requests here.
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
            </>
            }
            
          {/* <Footer route={'profile'}/>*/}
        </div>
    </div>
  )
}
