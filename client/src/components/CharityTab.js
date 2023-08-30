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


export default function CharityTab({ id, ownerid, type, overall, financial, accountability, name, size, display, shouldFavorite ,isFavorite, index, isEmpty, onRemove, onFavorite }) {
    const navigate = useNavigate()
    const figures = ["OVERALL", "FINANCIAL", "ACCOUNTABILITY"]
    const connection = process.env.REACT_APP_API_URL
    const [loading, setLoading] = useState()
    const [charityid, setCharityid] = useState(0)
    const [width, setWidth] = useState(0)
    const [selecting, setSelecting] = useState(shouldFavorite)
    const [shouldRemove, setShouldRemove] = useState(false)
    const [isHovered, setIsHovered] = useState(false);
    const [value, setValue] = useState(Math.min(financial, accountability))
    const [figure, setFigure] = useState(display)
    function handleFigure() {
        setFigure((figure)=>(figure+1)%3) // rotate through figures
    }
    function handleNavigate() {
        navigate(`/charity/${id}/${name}/${type.toLowerCase()}`)
    }
    const handleRemove = () => {
        setShouldRemove(!shouldRemove)
    }
    const handleDelete = () => {
        onRemove(id)
        setShouldRemove(!shouldRemove)
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
    useEffect(()=> {
        const updateFigure = async () => {
            try {
                const res = await axios.put(`${connection}/api/changearchivefigure`, 
                {userid:ownerid, charityid:id, figure:figure})
                if (res.data) {
                    console.log("figure successfully changed")
                }
            } catch(e) {
                console.log(e)
            }
        }
        updateFigure()
    }, [figure])


    return (
        <span ref={ref} onClick={()=>(isEmpty)?console.log("empty tag"):
        (shouldFavorite)?onFavorite(id, isFavorite):
        (shouldRemove||isHovered)?console.log("In removal mode"):handleNavigate()}
        style={{opacity:`${isEmpty?'0':'1'}`, pointerEvents:`${isEmpty?'none':'auto'}`}}
        className={`archive-favorite-item-container ${isHovered||shouldRemove||(shouldFavorite&&isFavorite)?'':
        (shouldFavorite)?'preselect-archive':
        type==='Healthcare'?'health':type==='Human'?'hr':type.toLowerCase()}-item`}>
            <div className="archive-favorite-item-category">
                <p className={`category-favorite-text ${type==='Healthcare'?'health':type.toLowerCase()}-text`}>
                    {`${type==='Human'?'Human Rights & Services':type==='Healthcare'?'Health':
                    type==='Research'?'Research & Public Policy':
                    type==='Community'?'Community Development':type}`}
                </p>
                {(shouldFavorite&&isFavorite)?
                    <span className={`favorite-selection-icon`}>
                        <BsCheckLg className="archive-favorite-icon-alt"/>
                    </span>
                :(!shouldFavorite)&&
                    <span className={`archive-favorite-icon-wrapper`}
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                    onClick={()=>handleRemove()}>
                        {(!shouldRemove)?
                        <AiFillHeart className="archive-favorite-icon"/>:
                        <AiOutlineHeart className="archive-favorite-icon"/>
                        }
                    </span>
                }
            </div>
            <div className="archive-favorite-item-figure">
                <div className="archive-favorite-item-figure-wrapper">
                    <p className="archive-favorite-figure-text">
                        {parseFloat(figure===0?overall:figure===1?financial:accountability).toFixed(1)}
                    </p>
                    <span className="archive-favorite-subtext-wrapper"
                      style={{pointerEvents:(shouldFavorite)?'none':'auto'}}
                      onClick={()=>handleFigure()}
                      onMouseEnter={handleMouseEnter} 
                      onMouseLeave={handleMouseLeave}>
                        <p className="archive-favorite-figure-subtext">
                            {`${figures[figure]}`} <br/>SCORE
                        </p>
                    </span>

                    
                </div>

            </div>

            <div className="profile-favorite-item-name">
                <p className="profile-favorite-name-text">
                    {name}
                </p>
            </div>
            <div className="archive-favorite-type-container">
            {(!shouldRemove)?
                <div className={`profile-favorite-item-type-wrapper mid-favorite-wrapper`}
                    style={{transition:"all .15s linear"}}>
                    <p className="profile-favorite-item-type-text">
                        {`${size}-Sized`}
                    </p>
                </div>
                :
                <span className={`archive-favorite-delete-wrapper`} onClick={()=>handleDelete()}>
                    <p className="archive-favorite-item-type-text">
                        {`Remove`}
                    </p>
                </span>   
            }
            </div>
        </span>
    )
}
