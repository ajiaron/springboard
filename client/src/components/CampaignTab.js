import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Favorites.scss'
import './Archive.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import axios from "axios";
import { BsArrowRepeat, BsStars } from 'react-icons/bs'
import {BiPencil} from 'react-icons/bi'
import { BsCheck2,BsCheckLg } from 'react-icons/bs'
import {AiOutlineHeart, AiFillHeart,AiOutlineCheck} from 'react-icons/ai'
import { Link, useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
import { set } from "lodash";


export default function CampaignTab({ id, category, goal, raised, name, theme, type, index, isEmpty, route}) {
    const navigate = useNavigate()
    const figures = ["GOAL", "TOTAL", "PROGRESS"]
    const connection = process.env.REACT_APP_API_URL
    const [loading, setLoading] = useState()
    const [value, setValue] = useState(0)
    const [width, setWidth] = useState(0)
    const [shouldRemove, setShouldRemove] = useState(false)
    const [isHovered, setIsHovered] = useState(false);
    const [figure, setFigure] = useState(0)

    function hexToRgba(hex, a){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length === 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return `${'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')},${a?a:1})`;
        }
        else {
            console.log(hex)
        }
    }
    function handleFigure() {
        setFigure((figure)=>(figure+1)%3) // rotate through figures
    }
    function handleNavigate() {
        navigate(`/campaign/${id}`)
    }
    const handleRemove = () => {
        setShouldRemove(!shouldRemove)
    }
    function formatGoal(val) {
        if (val < 10) {
            return `$${parseFloat(val).toFixed(2)}`
        }
          else if (val >= 1000 && val < 1000000) {
            return `$${Math.floor(val / 1000)}K`
        } else if (val >= 1000000){
            return `$${Math.floor(val / 1000000)}M`
        } else {
            return `$${parseFloat(val).toFixed(0)}`
        }
    }
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
    const ref = useRef(null)
    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    }, []);

    return (
        <span ref={ref} onClick={()=>(isHovered)?console.log("toggling figure"):handleNavigate()}
        style={{opacity:`${isEmpty?'0':'1'}`, paddingBottom:(route)?".25em":'0',pointerEvents:`${isEmpty?'none':'auto'}`}}
        className={`archive-favorite-item-container`}>
            <div className="archive-favorite-item-category">
                <p className={`category-favorite-text`} style={{color:theme?hexToRgba('#'+theme.substring(0,6),1):"#5a5a5abd"}}>
                    {`${category==='Healthcare'?'Health':
                    category==='Community'?'Community Development':category}`}
                </p>
                <span className={`archive-favorite-icon-wrapper`}
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                >
                    <AiFillHeart className="archive-favorite-icon"/>
                </span>
                
            </div>
            <div className="archive-favorite-item-figure">
                <div className="archive-favorite-item-figure-wrapper">
                    <p className="archive-favorite-figure-text"
                    style={{fontSize:(route)?'clamp(24px, 4vw, 38px)':'clamp(34,4vw,40px)'}}>
                        {figure===0?formatGoal(goal):
                        figure===1?formatGoal(raised):formatGoal(raised/goal)}
                    </p>
                    {(route === undefined)&&
                         <span className="archive-favorite-subtext-wrapper"
                         onClick={()=>handleFigure()}
                         onMouseEnter={handleMouseEnter} 
                         onMouseLeave={handleMouseLeave}>
                           <p className="archive-favorite-figure-subtext">
                               {`${(figure===1)?'CROWDFUNDING':'CAMPAIGN'}`} <br/>{`${figures[figure]}`}
                           </p>
                       </span>
                    }
                   
                </div>

            </div>

            <div className="profile-favorite-item-name">
                <p className="profile-favorite-name-text">
                    {name}
                </p>
            </div>
            <div className="archive-favorite-type-container" style={{marginTop:(route)?".05em":"0"}}>
            {(!shouldRemove)?
                <div className={`profile-favorite-item-type-wrapper mid-favorite-wrapper`}
                    style={{transition:"all .15s linear",backgroundColor:theme?hexToRgba('#'+theme.substring(0,6),.5):"#5a5a5abd"}}>
                    <p className="profile-favorite-item-type-text">
                        {`Followed by 3+ others`}
                    </p>
                </div>
                :
                <span className={`archive-favorite-delete-wrapper`}>
                    <p className="archive-favorite-item-type-text">
                        {`Remove`}
                    </p>
                </span>   
            }
            </div>
        </span>
    )
}