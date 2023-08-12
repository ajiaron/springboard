import React, {useState, useEffect, useRef, useContext} from "react"
import './Profile.scss'
import './Donations.scss'
import UserContext from "../contexts/UserContext";
import DonationItem from "./DonationItem";
import SideNavigation from "./SideNavigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CharityTab from "./CharityTab";
import CharityItem from './CharityItem'
import SideBar from "./SideBar";
import axios from "axios";
import Favorites from "./Favorites";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import {HiOutlineSwitchHorizontal} from 'react-icons/hi'
import { AiOutlineLink, AiOutlineEdit,AiOutlineClockCircle } from 'react-icons/ai'


const ArchiveRow = ({rowIndex, remainder, charityData, favorites, shouldFavorite, onHandleRemove, onHandleFavorite}) => {  
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0 
    const [isLast, setIsLast] = useState(remainder===0?false:Math.ceil(charityData.length/3) === rowIndex+1)
    return (
        <div className="personal-archive-container">             
            <div className="archive-history-container">
                {(!isLast)?
                    (charityData&&charityData.length>0)?
                        charityData.slice(rowIndex*3,(rowIndex+1)*3).map((item, index)=> (
                            <CharityTab 
                            id={charityData&&item.charityid} 
                            ownerid={userid}
                            type={charityData&&item.type1} 
                            overall={charityData&&item.overall_score}
                            financial={charityData&&item.financial_score}
                            accountability={charityData&&item.accountability_score}
                            name={charityData&&item.charity_name} 
                            size={charityData&&item.size} 
                            display={charityData&&item.figure}
                            shouldFavorite={shouldFavorite}
                            //isFavorite={hasFavorites?charityData&&item.isfavorite:charityData&&charityData.indexOf(item)<4}
                            isFavorite={charityData&&favorites.indexOf(item.charityid)>-1}
                            index={charityData&&charityData.indexOf(item)}
                            isEmpty={false}
                            onRemove={(selected)=>onHandleRemove(selected)}
                            onFavorite={(selected, status)=>onHandleFavorite(selected, status)}/>
                        ))
                        :
                        <div className='loading-text-container'>
                            <p className="loading-text"> {`No charity data`} </p>
                        </div>
                :
                (charityData&&charityData.length>0)?
                <>
                    {
                    charityData.slice(rowIndex*3,(rowIndex+1)*3).map((item, index)=> (
                        <CharityTab 
                        id={charityData&&item.charityid} 
                        ownerid={userid}
                        type={charityData&&item.type1} 
                        overall={charityData&&item.overall_score}
                        financial={charityData&&item.financial_score}
                        accountability={charityData&&item.accountability_score}
                        name={charityData&&item.charity_name} 
                        size={charityData&&item.size} 
                        display={charityData&&item.figure}
                        shouldFavorite={shouldFavorite}
                        isFavorite={charityData&&favorites.indexOf(item.charityid)>-1}
                        index={charityData&&charityData.indexOf(item)}
                        isEmpty={false}
                        onRemove={(selected)=>onHandleRemove(selected)}
                        onFavorite={(selected, status)=>onHandleFavorite(selected, status)}/>
                    ))
                    }
                    {/*
                        (remainder > 1)?
                        <CharityTab id={0} type={'default'} value={0} name={'none'} size={'none'} isEmpty={true} onRemove={(selected)=>onHandleRemove(selected)}/>
                        :
                        <>
                        <CharityTab id={0} type={'default'} value={0} name={'none'} size={'none'} isEmpty={true} onRemove={(selected)=>onHandleRemove(selected)}/>
                        <CharityTab id={0} type={'default'} value={0} name={'none'} size={'none'} isEmpty={true} onRemove={(selected)=>onHandleRemove(selected)}/>
                        </>
                */}
                </>
                    :
                    <div className='loading-text-container'>
                        <p className="loading-text"> {`No charity data`} </p>
                    </div>
                }
            </div>
        </div>
    )
}
export default function Archive() {
    const user = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const [rerender, setRerender] = useState(false)
    const [remainder, setRemainder] = useState(0)
    const [hasFavorites, setHasFavorites] = useState(false)
    const [updateFavorite, setUpdateFavorite] = useState(false)
    const [favorites, setFavorites] = useState([])
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const name = localStorage.getItem("firstname")?JSON.parse(localStorage.getItem("firstname")):'none'
    const username = localStorage.getItem("username")?JSON.parse(localStorage.getItem("username")):'none'
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
    const [charityData, setCharityData] = useState()
    const [removeFavorite, setRemoveFavorite] = useState(0)
    const handleRemove = (charityid) => {
        axios.delete(`${connection}/api/removearchiveitem`, {
            data: {
                userid:userid,
                charityid:charityid
            }
        })
        .then((res)=> {
            setRerender(!rerender)
        })
        .catch((e)=>{
            console.log(e)
        })
    }
    const handleFavorite = (charityid, status) => {
        if(status) {
            setFavorites(favorites.filter((item)=>item!==charityid))
        } 
        else {
            setFavorites([charityid,...favorites].slice(0,4))
        }
       /* axios.put(`${connection}/api/archivefavorite`,
        {userid:userid, charityid:charityid, isfavorite:status})
        .then(()=>{
            console.log("updated favorites")
        })
        .catch((e)=> {
            console.log(e)
        })*/
    }
    useEffect(()=> {
        const loadCharity = async() => {
          setLoading(true)
          try {
            const url = `${connection}/api/getarchive/${userid}`;
            const res = await axios.get(url, {
              params: {
                  userid:0
              }
            })
            console.log(res.data)
            setCharityData(res.data)
            setRemainder(res.data.length % 3)
            setHasFavorites(res.data.filter((item)=>item.isfavorite).length>0)
            setFavorites(res.data.filter((item)=>item.isfavorite).map((item)=>item.charityid).slice(0,4))
          }
          catch(e) {
            console.log(e)
          }
        }
        loadCharity()
        setLoading(false)
      },[rerender])

      useEffect(()=> {
        const confirmFavorites = async() => {
            try {
                const res = await axios.put(`${connection}/api/editfavorites`, 
                {userid:userid, favorites:favorites})
                if (res.data) {
                    console.log("successfully updated favorites")
                }
            } catch(e) {
                console.log(e)
            }
        }
        if (updateFavorite) {
            confirmFavorites()
        }
      }, [favorites])

  return (
        <div className={`donations-page-container`}>
            <SideNavigation route={'archive'}/>
            <div className={`donations-page-content`}>
                <div className="donations-page-wrapper">
                    <div className="settings-header-container">
                        <div className="settings-image-wrapper">
                            <p className="settings-image-text">
                                {name.charAt(0).toUpperCase()}
                            </p>
                        </div>
                        <div className="settings-header-wrapper">
                            <p className="settings-header-text">
                                {`Your Archive`}
                            </p>
                            <div className="settings-link-container">
                                <AiOutlineLink className="link-icon"/>
                                <p className="settings-header-subtext">
                                    {`link.springboard.app/${username}`}
                                </p>
                            </div>
                        </div>
                        <span onClick={()=>setUpdateFavorite(!updateFavorite)}
                        className={`${updateFavorite?'archive-setfavorite-button-alt':'archive-setfavorite-button'}`}>
                            <div className="archive-setfavorite-wrapper">
                                <p className="archive-setfavorite-text">
                                    {
                                    "Favorites"
                                    }
                                </p>
                                <HiOutlineSwitchHorizontal className="archive-setfavorite-icon"/>
                            </div>
                        </span>
                    </div>
                    <div className="manage-settings-container" >
                        <div className="manage-settings-header-container">
                            <p className="manage-header-settings-text">
                                {`Saved Charities`}
                            </p>
                            <p className="manage-header-subtext">
                                View all of the organizations you've saved for later.
                            </p>
                        </div>
                    </div>
                    {(loading)?    
                    <div className='loading-text-container'>
                        <p className="loading-text"> {`${(loading)?'Loading...':`Showing all matching results`}`} </p>
                    </div>:
                    <div className="personal-archive-grid">
                        {
                            Array.apply(null, Array(charityData&&charityData.length>0?Math.ceil(charityData.length/3):0))
                            .map((item, index)=> (
                                <ArchiveRow rowIndex={index} remainder={remainder} charityData={charityData} favorites={favorites} shouldFavorite={updateFavorite} onHandleRemove={handleRemove} onHandleFavorite={handleFavorite}/>
                            ))
                        }
                    </div>
                    }
                </div>
            </div>
        </div>
      
  )
}
