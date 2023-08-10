import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Dashboard.scss'
import './Friends.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import { BsCheck2,BsCheckLg } from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom";
import SideNavigation from "./SideNavigation";
import Doughchart from "./Doughchart";
import { BsSearch } from 'react-icons/bs'
import { AiFillHeart } from "react-icons/ai";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
import axios from "axios";
const FriendsItem = ({id, userid, username, firstname, lastname, profilepic, status}) => {
    const navigate = useNavigate()
    return (
    <div className="friends-page-item">
        <div className="friends-page-image-container">
            <Link className={'friends-page-item-link'} to={`/${username?username:'#'}`}
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
               <span className="friends-page-item-link-text" onClick={()=>navigate((username)?`/${username}`:'#')}>
                    <p className="friends-page-item-title">
                        {`${firstname} ${lastname}`}
                    </p>
               </span>
           

                {(id !== userid)&&
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
        {(id !== userid)&&
        <div className={`friends-page-item-button ${status?'friends-button-alt':''}`}>
            {status?
            <>
                <p className="friends-page-item-button-text-alt">
                    Following
                </p>
                 <BsCheckLg className="friends-check-icon"/>
            </>
            :
            <p className="friends-page-item-button-text">
                Follow
            </p>
            }
        </div>
        }
    </div>
    )
}
export default function Friends() {
    const id = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
    const [allUsers, setAllUsers] = useState(false)
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const pageSize = 15
    const [page, setPage] = useState(1)
    const loadingRef = useRef(null)
    function handleTest() {
        console.log(users)
    }
    useEffect(()=> {
        setPage(1)
        setUsers([])
    }, [allUsers])
    useEffect(()=> {
        if (query.length > 0) {
            setPage(1)
            setUsers([])
        }
    }, [query])
    useEffect(()=> {
        const loadUsers = async() => {
            setLoading(true)
            try {
                const sql = query?`${connection}/api/searchuserlist/${pageSize}/${(page-1)*pageSize}/${query}`
                            :`${connection}/api/getuserlist/${pageSize}/${(page-1)*pageSize}`
                const res = await axios.get(sql)
                if (res.data) {
                    console.log(res.data) // TODO: pass userid into req
                    setUsers((prev)=> (allUsers)?[...prev, ...res.data]:[...prev, ...res.data.filter((item)=>item.userid !== id)])
                }
            } catch(e) {
                console.log(e)
            }
        }
        loadUsers()
        setLoading(false)
    }, [query, page, allUsers])
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
                        <div style={{display:"flex", gap:'.4375em'}}>
                            <span onClick={()=> setAllUsers(false)}  className={'friends-list-filter-toggle'}>
                                <p className="friends-loading-text" style={{color:(!allUsers)?"#eee":"#a0a0a0"}}>
                                    {`Your followers`} 
                                </p>
                            </span>
                            <p className="friends-loading-text" style={{fontWeight:"400"}}>
                                {`/`} 
                            </p>
                            <span onClick={()=> setAllUsers(true)} className={'friends-list-filter-toggle'}>
                                <p className="friends-loading-text" style={{color:(allUsers)?"#eee":"#a0a0a0"}}> 
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
                                            profilepic={item.profilepic}
                                            status={item.status}
                                            key={index}
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
