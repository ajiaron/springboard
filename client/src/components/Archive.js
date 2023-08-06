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
import { AiOutlineLink, AiOutlineEdit,AiOutlineClockCircle } from 'react-icons/ai'


const ArchiveRow = ({rowIndex, remainder, charityData, onHandleRemove}) => {   
    const [isLast, setIsLast] = useState(remainder===0?false:Math.ceil(charityData.length/3) === rowIndex+1)
    return (
        <div className="personal-archive-container">             
            <div className="archive-history-container">
                {(!isLast)?
                    (charityData&&charityData.length>0)?
                        charityData.slice(rowIndex*3,(rowIndex+1)*3).map((item, index)=> (
                            <CharityTab 
                            id={charityData&&item.charityid} 
                            type={charityData&&item.type1} 
                            overall={charityData&&item.overall_score}
                            financial={charityData&&item.financial_score}
                            accountability={charityData&&item.accountability_score}
                            name={charityData&&item.charity_name} 
                            size={charityData&&item.size} 
                            isEmpty={false}
                            onRemove={(selected)=>onHandleRemove(selected)}/>
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
                        type={charityData&&item.type1} 
                        overall={charityData&&item.overall_score}
                        financial={charityData&&item.financial_score}
                        accountability={charityData&&item.accountability_score}
                        name={charityData&&item.charity_name} 
                        size={charityData&&item.size} 
                        isEmpty={false}
                        onRemove={(selected)=>onHandleRemove(selected)}/>
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
    const [rows, setRows] = useState(0)
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
    const [charityData, setCharityData] = useState()

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
          }
          catch(e) {
            console.log(e)
          }
        }
        loadCharity()
        setLoading(false)
      },[rerender])

  return (
        <div className={`donations-page-container`}>
            <SideNavigation route={'donations'}/>
            <div className={`donations-page-content`}>
                <div className="donations-page-wrapper">
    
       
                    <div className="settings-header-container">
                        <div className="settings-image-wrapper">
                            <p className="settings-image-text">
                                A
                            </p>
                        </div>
                        <div className="settings-header-wrapper">
                            <p className="settings-header-text">
                                {`Your Archive`}
                            </p>
                            <div className="settings-link-container">
                                <AiOutlineLink className="link-icon"/>
                                <p className="settings-header-subtext">
                                    link.springboard.app/aaronjiang/archive
                                </p>
                            </div>
                        </div>
                    </div>
    
                    <div className="manage-settings-container" >
                        <div className="manage-settings-header-container">
                            <p className="manage-header-settings-text">
                                Saved Charities
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
                                <ArchiveRow rowIndex={index} remainder={remainder} charityData={charityData} onHandleRemove={handleRemove}/>
                            ))
                        }

{
/*
                        <div className="personal-archive-container">
                          
                            <div className="archive-history-container">
                                {(charityData&&charityData.length>0)?
                                charityData.slice(0,3).map((item, index)=> (
                                    <CharityTab 
                                    id={charityData&&item.charityid} 
                                    type={charityData&&item.type1} 
                                    value={charityData&&item.overall_score} 
                                    name={charityData&&item.charity_name} 
                                    size={charityData&&item.size} 
                                    index={index}

                                    onRemove={(selected)=>handleRemove(selected)}/>
                                )):
                                <div className='loading-text-container'>
                                    <p className="loading-text"> {`${(loading)?'Loading...':``}`} </p>
                                </div>
                                }
                            </div>
                            
                        </div>
                        
                        <div className="personal-archive-container">
                        {(!loading)&&
                             <div className="archive-history-container">
                             {(charityData&&charityData.length>0)?
                             charityData.slice(3,6).map((item, index)=> (
                                <CharityTab 
                                id={charityData&&item.charityid} 
                                type={charityData&&item.type1} 
                                value={charityData&&item.overall_score} 
                                name={charityData&&item.charity_name} 
                                size={charityData&&item.size} 
                                index={index}
                                onRemove={(selected)=>handleRemove(selected)}/>
                             )):
                             <div className='loading-text-container'>
                                 <p className="loading-text"> {`${(loading)?'Loading...':`Showing all matching results`}`} </p>
                             </div>
                             }
                         </div>
                        }
                        </div>
                        
                    */}
                    
                        
                    </div>
                    }
                </div>
            </div>
        </div>
      
  )
}
