import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Dashboard.scss'
import './Friends.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import { BsCheck2,BsCheckLg,BsPlusLg } from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom";
import SideNavigation from "./SideNavigation";
import Doughchart from "./Doughchart";
import { v4 as uuidv4 } from 'uuid';
import { BsSearch } from 'react-icons/bs'
import { AiFillHeart } from "react-icons/ai";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
import axios from "axios";
const FriendsItem = ({id, userid, username, firstname, lastname, isPublic, profilepic, isFollowing, following, index, onFollow, onAccept, onCancel}) => {
    const navigate = useNavigate()
    const [followStatus, setFollowStatus] = useState(following)
    const [yourStatus, setYourStatus] = useState(isFollowing) // replace with backend response
    const [isHovered, setIsHovered] = useState(false)
    const handleMouseEnter = () => {
        setIsHovered(true);
      };
      const handleMouseLeave = () => {
        setIsHovered(false);
      };
    function onHandleFollow() {
        onFollow(id)
        setYourStatus(!isPublic?"pending":"following")
    }
    function onHandleAccept() {
        onAccept(id)
        setFollowStatus("following")
    }
    function onHandleReject() {
        onCancel(userid, id)
        setFollowStatus("not following")
    }
    function onHandleCancel() {
        onCancel(id, userid)
        setYourStatus("not following")
    }

    return (
    <span className={`${isHovered?'friends-page-item-inactive':'friends-page-item'}`} onClick={()=>navigate((username&&!isHovered)?`/${username}`:`#`)} >
        <div className="friends-page-image-container">
            <Link className={'friends-page-item-link'} to={`/${username&&!isHovered?username:'#'}`}
             style={{textDecoration:'none', borderRadius:"3.25em"}}>
                <div className="friends-page-image-wrapper">
                    <p className="friends-page-item-text-alt">
                        {firstname.charAt(0).toUpperCase()}
                    </p>
                </div>
            </Link>
        </div>
        <div className="friends-page-item-info">
            <span style={{display:"flex", justifyContent:"flex-start", gap:".55em"}}>
               <span className="friends-page-item-link-text" onClick={()=>navigate((username&&!isHovered)?`/${username}`:'#')}>
                    <p className="friends-page-item-title">
                        {`${firstname} ${lastname}`}
                    </p>
               </span>
           

                {(id !== userid && followStatus==="following")&&
                <div style={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                    <BsCheckLg className="check-icon" style={{color:'#ababab', transform:"translateY(-.0375em)"}}/>
                </div>
                }
            </span>
            <div className="friends-page-text-wrapper">
                <p className="profile-donation-item-text">
                    {`@${username}`}
                </p>   
            </div>
        </div>
        {(id !== userid && followStatus==="pending")&&
        <span style={{marginRight:".5em", gap:'.45em'}}
            className={`friends-page-item-button ${yourStatus==="following"?'friends-button-alt':''}`}
            onClick={()=>onHandleAccept()}
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}>
            <>
                <p className="friends-page-item-button-text-alt" style={{color:'#eee'}}>
                    Accept
                </p>

                 <BsPlusLg className="friends-check-icon"  style={{color:'#eee'}}/>
                
            </>
        </span>
        }
        {(id !== userid)&&
        <span className={`friends-page-item-button ${yourStatus==="following"?'friends-button-alt':''}`}
            onClick={()=>yourStatus==="following"||yourStatus==="pending"?onHandleCancel():onHandleFollow()}
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}>
            {yourStatus==="following" || yourStatus === "pending"?
            <>
                <p className="friends-page-item-button-text-alt">
                    {(yourStatus==="following")?`Following`:`Pending`}
                </p>
                {(yourStatus === "following")&&
                 <BsCheckLg className="friends-check-icon"/>
                }
            </>
            :
            <p className="friends-page-item-button-text">
                Follow
            </p>
            }
        </span>
        }
    </span>
    )
}
export default function Friends() {
    const id = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
    const [allUsers, setAllUsers] = useState(false)
    const [filter, setFilter] = useState("followers")
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const pageSize = 15
    const [page, setPage] = useState(1)
    const loadingRef = useRef(null)
    function handleTest() {
        console.log(users)
    }
    const handleRequest = async(userid) => {
        const idrequest = uuidv4()
        try {
            const res = await axios.post(`${connection}/api/followrequest`,
            {idrequest:idrequest, requesterid:id, recipientid:userid})
            if (res.data) {
                console.log("successfully followed user")
            }
        } catch(e) {
            console.log(e)
        }
    }
    const confirmRequest = async(userid) => {
        try {
            const res = await axios.put(`${connection}/api/acceptrequest`, 
            {recipientid:id, requesterid:userid})
            if (res.data) {
                console.log("successfully confirmed request")
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
            }
        } catch(e) {
            console.log(e)
        }
    }
    useEffect(()=> {
        setPage(1)
        setUsers([])
    }, [filter])
    useEffect(()=> {
        setPage(1)
        setUsers([])
    }, [query])
    useEffect(()=> {
        const loadUsers = async() => {
            setLoading(true)
            try {
                const sql = (filter==='all')?
                            query?`${connection}/api/searchuserslist/${pageSize}/${(page-1)*pageSize}/${query}`
                            :`${connection}/api/getuserslist/${pageSize}/${(page-1)*pageSize}`:
                            (filter==='followers')?
                            query?`${connection}/api/searchfollowers/${pageSize}/${(page-1)*pageSize}/${query}`
                            :`${connection}/api/getfollowers/${pageSize}/${(page-1)*pageSize}`:
                            (filter==='following')?
                            query?`${connection}/api/searchfollowing/${pageSize}/${(page-1)*pageSize}/${query}`
                            :`${connection}/api/getfollowing/${pageSize}/${(page-1)*pageSize}`:
                            query?`${connection}/api/searchfollowrequests/${pageSize}/${(page-1)*pageSize}/${query}`
                            :`${connection}/api/getfollowrequests/${pageSize}/${(page-1)*pageSize}`
                const res = await axios.get(sql, {
                    params: {userid:id}
                })
                if (res.data) {
                    console.log(res.data) 
                    setUsers((prev)=> [...prev, ...res.data.filter((item)=>item.userid !== id)])
                }
            } catch(e) {
                console.log(e)
            }
        }
        loadUsers()
        setLoading(false)
    }, [query, page, filter])
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                setPage((prevPageNumber) => prevPageNumber + 1);
              }
            },
            { threshold: 1 } 
          );
        if (loadingRef.current) {
          observer.observe(loadingRef.current);
        }
        return () => {
          if (loadingRef.current) {
            observer.unobserve(loadingRef.current);
          }
        };
      }, []);
    return (
        <div className="friends-page-container">
            <SideNavigation route={'friends'}/>
            <div className="friends-page-content">
                <div className="friends-page-list-container ">
                    <div className='friends-showing-text-container '>
                        <p className="friends-loading-text"> {`Showing ${users?users.length:0} entries`} </p>
                        <div style={{display:"flex", gap:'.4375em', paddingRight:".1em"}}>
                            <span onClick={()=> setFilter("followers")}  className={'friends-list-filter-toggle'}>
                                <p className="friends-loading-text" style={{color:(filter==="followers")?"#eee":"#a0a0a0"}}>
                                    {`Your followers`} 
                                </p>
                            </span>
                            <p className="friends-loading-text" style={{fontWeight:"400"}}>
                                {`/`} 
                            </p>
                            <span onClick={()=> setFilter("following")}  className={'friends-list-filter-toggle'}>
                                <p className="friends-loading-text" style={{color:(filter==="following")?"#eee":"#a0a0a0"}}>
                                    {`Following`} 
                                </p>
                            </span>
                            <p className="friends-loading-text" style={{fontWeight:"400"}}>
                                {`/`} 
                            </p>
                            <span onClick={()=> setFilter("pending")}  className={'friends-list-filter-toggle'}>
                                <p className="friends-loading-text" style={{color:(filter==="pending")?"#eee":"#a0a0a0"}}>
                                    {`Pending requests`} 
                                </p>
                            </span>
                            <p className="friends-loading-text" style={{fontWeight:"400"}}>
                                {`/`} 
                            </p>
                            
                            <span onClick={()=> setFilter("all")} className={'friends-list-filter-toggle'}>
                                <p className="friends-loading-text" style={{color:(filter==="all")?"#eee":"#a0a0a0"}}> 
                                    {`All users`} 
                                </p>
                            </span>
                        </div>
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
                    <div className="friends-page-list ">
                        {(loading)?    
                            <span className='loading-text-container' ref={loadingRef} onClick={()=>handleTest()}> 
                                <p className="loading-text"> {`${(loading)?'Fetching your results...':`Viewing all matching results`}`} </p>
                            </span>
                            :
                            <div className="friends-page-list-content">
                                {
                                    users.map((item, index)=> (
                                        <FriendsItem 
                                            id={item.userid} 
                                            userid={id}
                                            username={item.username} 
                                            firstname={item.firstname} 
                                            lastname={item.lastname}
                                            isPublic={item.public}
                                            profilepic={item.profilepic}
                                            isFollowing={item.isfollowing}
                                            following={item.isfollower}
                                            index={index}
                                            onFollow={(id)=>handleRequest(id)}
                                            onAccept={(id)=>confirmRequest(id)}
                                            onCancel={(rec, req)=>removeRequest(rec, req)}
                                            />
                                    ))
                                }
                              { /* <FriendsItem id={0} username={'hzenry'} name={'Henry Zheng'} status={true}/>
                                */}
                            </div>
                            }
                        </div>
                </div>
            
            </div>
        </div>
    )
}
