import React, {useState, useEffect, useRef} from "react"
import './Profile.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import { v4 as uuidv4 } from 'uuid';
import {GoArrowRight} from 'react-icons/go'
import {LiaTimesSolid} from 'react-icons/lia'
import { BsStars, BsPlusLg, BsCheckLg, BsArrowRight,BsCheck2Circle, BsCheckCircle } from 'react-icons/bs'
import { Link, useParams, useNavigate } from "react-router-dom";
import {BiEdit, BiEditAlt,BiPencil,BiCheckDouble} from 'react-icons/bi'
import {AiOutlineHeart, AiFillHeart, AiOutlineLink, AiOutlineEdit,AiFillCheckCircle, AiOutlineClockCircle, AiOutlinePlus } from 'react-icons/ai'
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import axios from "axios";
import SideNavigation from "./SideNavigation";
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
const FriendsItem = ({name, username, status, onNavigate}) => {
    return (
    <div className="profile-friends-item">
        <div className="profile-friends-image-container">
            <span className="profile-friends-image-wrapper" onClick={()=>onNavigate(username)}>
                <p className="profile-page-item-text-alt">
                    {name&&name.charAt(0).toUpperCase()}
                </p>
            </span>
        </div>
        <div className="profile-friends-item-info">
            <span onClick={()=>onNavigate(username)}>
                <p className="profile-friends-item-title">
                    {name}
                </p>
            </span>
   
            <div className="profile-friends-text-wrapper">
                <span onClick={()=>onNavigate(username)}>
                    <p className="profile-donation-item-text">
                        {`@${username}`}
                    </p>  
                </span>
 
            </div>
        </div>
    </div>
    )
}

export default function Profile() {
  const {username} = useParams()
  const navigate = useNavigate()
  const id = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
  const name = localStorage.getItem("username")?JSON.parse(localStorage.getItem("username")):''
  const firstname = localStorage.getItem("firstname")?JSON.parse(localStorage.getItem("firstname")):''
  const lastname = localStorage.getItem("lastname")?JSON.parse(localStorage.getItem("lastname")):''
  const email = localStorage.getItem("email")?JSON.parse(localStorage.getItem("email")):''
  const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [hasBio, setHasBio] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [isOwner, setIsOwner] = useState(username === name)
  const [isFollower, setIsFollower] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [campaignLoading, setCampaignLoading] = useState(true)
  const [capabilities, setCapabilities] = useState(false)
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  function handleNavigate(id, name, type) {
    navigate(`/charity/${id}/${name}/${type.toLowerCase()}`)
  }
  function navigateProfile(name) {
    navigate(`/${name}`)
  }
  function navigateStripe() {
    if (userData && userData.accountid !== null && isOwner) {
        if (process.env.REACT_APP_ENV === 'production') {
            window.location.href = `https://dashboard.stripe.com/connect/accounts/${userData.accountid}/profile`
        }
        window.location.href = `https://dashboard.stripe.com/test/connect/accounts/${userData.accountid}/profile`
    }
  }
  const handleRequest = async() => {
    const idrequest = uuidv4()
    try {
        const res = await axios.post(`${connection}/api/followrequest`,
        {idrequest:idrequest, requesterid:id, recipientid:userData&&userData.userid})
        if (res.data) {
            console.log("successfully followed user")
            setIsFollowing(userData&&userData.public?"following":"pending")
        }
    } catch(e) {
        console.log(e)
    }
}
const createCampaign = async() => {
    const campaignid = uuidv4()
    setLoading(true)
    try {
        const res = await axios.post(`${connection}/api/createaccount`)
        if (res.data) {
            const accountLink = await axios.post(`${connection}/api/createaccountlink`,
            {accountid:res.data.id, ownerid:id, campaignid:campaignid,
            email:email, firstname:firstname, lastname:lastname, username:username})
            if (accountLink.data) {
                window.location.href = accountLink.data.url;
            }
        }
    } catch(e) {
        console.log(e)
    }
    setLoading(false)
}
const confirmRequest = async() => {
    try {
        const res = await axios.put(`${connection}/api/acceptrequest`, 
        {recipientid:id, requesterid:userData&&userData.userid})
        if (res.data) {
            console.log("successfully confirmed request")
            setIsFollower("following")
        }
    } catch(e) {
        console.log(e)
    }
}
const removeRequest = async(recipientid, requesterid) => {
    try {
        const res = await axios.delete(`${connection}/api/removerequest`,
        {data: {recipientid:recipientid, requesterid:requesterid}})
        if (res.data) {
            console.log("successfully canceled request")
            setIsFollowing("not following")
        }
    } catch(e) {
        console.log(e)
    }
}

  useEffect(()=> {
    const confirmCampaign = async (accountid) => {
        try {
           // setCampaignLoading(true)
            if (accountid && accountid !== null) {
                const res = await axios.get(`${connection}/api/getconfirmedstripe/${accountid}/${id}`)
                if (res.data) {
                    console.log(res.data)
                    setConfirmed(res.data.details_submitted)
                    setCapabilities(res.data.payouts_enabled && res.data.charges_enabled)
                }
            } else {
                console.log("not connected to stripe")
            }
        } catch(e) {
            console.log(e)
        }
        setLoading(false)
    } 
    const loadFavorites = (id) => {
        axios.get(`${connection}/api/getfavorites/${id}`)
        .then((res)=> {
          //  setLoading(false)
            setFavorites(res.data.slice(0,4))
        })
        .catch((e)=>console.log(e))
    }
    const loadUser = async() => {
        setLoading(true)
        try {
            if (isOwner) {
                const res = await axios.get(`${connection}/api/getaccount`,{
                    params: {
                        username:username?username:'default',
                        userid:id
                    }
                })
                if (res.data && res.data.length > 0) {
                    console.log(res.data)
                    setUserData(res.data[0])
                    setIsOwner(res.data[0].userid === id)
                    setHasBio(res.data[0].bio!==null && res.data[0].bio.length > 0)
                    loadFavorites(res.data[0].userid)
                    confirmCampaign(res.data[0].accountid)
                } 
                else {
                    navigate('/dashboard')
                }
            }
            else {
                const res = await axios.get(`${connection}/api/getprofile`,{
                    params: {
                        userid:id,
                        username:username?username:'default'
                    }
                })
                if (res.data && res.data.length > 0) {
                    console.log(res.data)
                    setUserData(res.data[0])
                    setIsFollower(res.data[0].isfollower)
                    setIsFollowing(res.data[0].isfollowing)
                    setIsOwner(res.data[0].userid === id)
                    setHasBio(res.data[0].bio!==null && res.data[0].bio.length > 0)
                    loadFavorites(res.data[0].userid)
                } 
                else {
                    navigate('/dashboard')
                }
                setLoading(false)
            }
     
        } catch(e) {
            console.log(e)
        }
    }
    loadUser()
  }, [])

  return (
    <div className="profile-page-container">
      {   <SideNavigation route={'profile'}/> }
      {/* <Navbar route={'profile'}/>*/}
        <div className="profile-page-content ">
            <div className="profile-header-container  ">
                <div className="profile-image-wrapper">
                    <p className="profile-image-text">
                        {`${(isOwner)?firstname.charAt(0).toUpperCase():
                            (!loading&&userData)?userData.firstname.charAt(0).toUpperCase():''}`}
                    </p>
                </div>
                {(!loading && userData)&&
                <div className={`${(hasBio || (!isOwner && (userData&&isFollower==="following")))?'profile-header-wrapper-alt':'profile-header-wrapper'}`}>
                    <p className={`${(hasBio || (!isOwner && (userData&&isFollower==="following")))?'profile-header-text-alt':'profile-header-text'}`}>
                        {username&&username===name?`${firstname} ${lastname}`:
                        loading?'':userData&&`${userData.firstname} ${userData.lastname}`}
                    </p>
                    {((userData&&isFollower==='following') && !hasBio && !isOwner)&&
                        <div className="profile-status-container-alt">
                            <BsCheck2Circle className="check-icon"/>
                            <p className={`${(hasBio || (!isOwner && (userData&&isFollower==='following')))?'profile-header-subtext-alt':'profile-header-subtext'}`}>
                                {`Follows you`}
                            </p>
                        </div>
                    }
                    <div className="profile-header-subcontent">
                        <div className={`${(hasBio || (!isOwner && (userData&&isFollower==='following')))?'profile-link-container-alt':'profile-link-container'}`}>
                            <AiOutlineLink className="link-icon"/>
                            <p className={`${(hasBio || (!isOwner && (userData&&isFollower==='following')))?'profile-header-subtext-alt':'profile-header-subtext'}`}>
                                {`link.springboard.gift/${username?username:''}`}
                            </p>
                        </div>
                        {((userData&&isFollower==='following') && hasBio && !isOwner)&&
                        <div className="profile-status-container-alt">
                            <BsCheck2Circle className="check-icon"/>
                            <p className={`${(hasBio || (!isOwner && (userData&&isFollower==='following')))?'profile-header-subtext-alt':'profile-header-subtext'}`}>
                                {`Follows you`}
                            </p>
                        </div>
                        }
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
                {(isOwner && !loading)&&
                 <span className={`${(userData&&userData.accountid!==null)?(confirmed)?'profile-campaign-button'
                    :'profile-campaign-complete-button'
                    :'profile-campaign-button-alt'}`}
                  onClick={()=>(userData&&userData.accountid!==null)?navigateStripe():createCampaign()}>
                        <div className={`profile-campaign-link-button-alt`}>
                            <p className="profile-campaign-text-alt" 
                            style={{color:'#000'}}>
                                {(loading)?'Processing...':
                                (userData&&userData.accountid!==null)?
                                (!confirmed || !capabilities)?
                                'Complete Onboarding'
                                :'View Campaign':
                                'Start a Campaign'}
                            </p>
                            {(userData&&userData.accountid !== null)?
                            <GoArrowRight className="profile-following-icon"
                            style={{color:"#000"}}/>:
                            <AiOutlinePlus className={`profile-following-icon`}
                            style={{color:'#000'}}/>
                            }
                        </div>
                    </span>
                }
                {(!isOwner && !loading)&&
            
                <>
                {(!loading && userData && isFollower === "pending")&&
                  <span className={`profile-follow-button-alt follow-active`} onClick={()=>(isHovered)?
                  console.log("delete request mode"):confirmRequest()}>
                        <div className={`profile-following-link-button-alt`}>
                            <p className="profile-follow-text-alt" 
                            style={{color:'#000'}}>
                                  Accept
                            </p>
                            {
                                <span onClick={()=>removeRequest(id, userData&&userData.userid)}
                                style={{alignSelf:"center", maxHeight:"1.25em", transform:"translateY(.025em)"}}>
                                    <LiaTimesSolid className={`profile-accept-follow-icon`} />
                                </span>
                            }
                        </div>
                    </span>
                    }
                    <div className="profile-header-subwrapper"
                     style={{marginRight:(userData&&userData.accountid!==null&&userData.charges&&userData.payouts)?"1.5%":"1.5%",
                        paddingTop:(userData&&userData.accountid!==null&&userData.charges&&userData.payouts)?"1em":"0"}}>
                        <span onClick={()=>(userData&&isFollowing==="not following")?
                        handleRequest():
                        removeRequest(userData&&userData.userid, id)}
                        className={`profile-follow-button 
                        ${userData&&(isFollowing==='following' || isFollowing==="pending")?
                        'follow-inactive':'follow-active'}`} style={{marginLeft:(userData&&isFollower==="pending")?"none":"auto"}}>
                            <div className={`profile-${isFollowing==="pending"?"pending":"following"}-link-button`}>
                                <p className={`${(isFollowing==="pending")?"profile-pending-text-alt":"profile-follow-text-alt"}`}
                                style={{color:(userData&&isFollowing==="not following")?"#000":
                                (userData&&isFollowing==="pending")?"#aaa":"#eee"}}>
                                    {(userData&&isFollowing==="following")?
                                    "Following":
                                    (userData&&isFollowing==="pending")?
                                    "Requested":
                                    "Follow"
                                    }
                                </p>
                                {(userData&&isFollowing==="not following")?
                                <AiOutlinePlus className={`profile-following-icon`}
                                style={{color:(userData&&isFollowing==="not following")?"#0a0a0a":"#eee"}}/>
                                :(userData && isFollowing === "following")&&
                                <BsCheckLg className={`profile-following-icon`} style={{color:"#bbb"}}/>
                                }
                            </div>
                        </span>
                        {(userData&&userData.accountid!==null&&userData.charges&&userData.payouts)?
                        <span onClick={()=>(userData&&isFollowing==="not following")?
                        handleRequest():
                        removeRequest(userData&&userData.userid, id)}
                        className={`profile-campaign-donate-button follow-inactive`} style={{marginLeft:(userData&&isFollower==="pending")?"none":"auto"}}>
                            <div className={`profile-support-link-button`}>
                                <p className={`profile-follow-text-alt`} style={{color:"#eee"}}>
                                    Support
                                </p>
                                {<AiFillHeart className="profile-following-support-icon" color={{color:"#eee"}}/>
                                }
                            </div>
                        </span>:null
                        }
                    </div>
                </>
                }
            </div>

            <div className="manage-profile-container">
                <div className="manage-header-container">
                    <p className="manage-header-text">
                        {`${(!isOwner)?'Profile Details':'Manage profile'}`}
                    </p>
                    <p className="manage-header-subtext">
                        {(!isOwner)?`View ${userData&&userData.firstname}'s recent activity and favorites.` :`Update your account preferences here.`}
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
                    <div style={{display:"flex", alignItems:"center", justifyContent:"flex-start", gap:'.5em'}}>
                        <p className="donation-details-subtext">
                            {(isOwner)? 'Your ':`${userData&&userData.firstname}'s `}collection of charities to be displayed on your profile.
                        </p>
                        {(isOwner)&&
                        <Link to={`/archive`}
                        style={{textDecoration:"none", display:"flex",justifyContent:"flex-start", gap:".35em"}}>
                            <p className="donation-details-subtext" style={{fontWeight:"600"}}>
                                Add Favorites
                            </p>
                            <BsArrowRight style={{color:"#ababab", alignSelf:"flex-end", transform:"translateY(-.04em) "}}/>
                        </Link>
                        }
                    </div>
                </div>
                {(favorites && favorites.length > 0)&&
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
                }
            </div>
       
            <div className="account-container" style={{marginTop:(favorites&&favorites.length>0)?'0':'1.125em'}}>
                <div className="account-donations-container"
                style={{paddingLeft:(favorites&&favorites.length>0)?'0.2em':'0'}}>
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Recent Donations
                        </p>
                        <p className="donation-details-subtext">
                        {`View ${(isOwner)?'your':`${userData&&userData.firstname}'s`} latest donations and pledges here.`}
                   
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
                    <div className="donation-details-container" >
                        <p className="donation-details-text">
                            Followers List
                        </p>
                        <p className="donation-details-subtext">
                            {`View ${(isOwner)?'your':`${userData&&userData.firstname}'s`} active followers and pending requests here.`}
                        </p>
                    </div>
                    <div className="account-friends-list">
                        <div className="account-friends-list-content">
                            <FriendsItem name={'Henry Zheng'} username={'hzenry'} status={'approved'} onNavigate={(name)=>navigateProfile(name)}/>
                            <FriendsItem name={'An Truong'} username={'antruong_'} status={'approved'} onNavigate={(name)=>navigateProfile(name)}/>
                            <FriendsItem name={'Thompson Nguyen'} username={'tnompson'} status={'approved'} onNavigate={(name)=>navigateProfile(name)}/>
                            <FriendsItem name={'Jason Damasco'} username={'jdason'} status={'approved'} onNavigate={(name)=>navigateProfile(name)}/>
                        </div>
                    </div>
                </div>
            </div>
            </>
            }
            
          { <Footer route={'profile'}/>}
        </div>
    </div>
  )
}
