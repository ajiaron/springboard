import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import './Favorites.scss'
import './Archive.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import axios from "axios";
import { BsStars } from 'react-icons/bs'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import { Link, useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";


export default function CharityTab({ id, type, overall, financial, accountability, name, size, date, isEmpty, onRemove}) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState()
    const [charityid, setCharityid] = useState(0)
    const [width, setWidth] = useState(0)
    const [shouldRemove, setShouldRemove] = useState(false)
    const [isHovered, setIsHovered] = useState(false);
    const [value, setValue] = useState(Math.max(overall, financial, accountability))
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

    return (
        <span ref={ref} onClick={()=>(isEmpty)?console.log("empty tag"):
        (shouldRemove||isHovered)?console.log("In removal mode"):handleNavigate()}
        style={{opacity:`${isEmpty?'0':'1'}`, pointerEvents:`${isEmpty?'none':'auto'}`}}
        className={`archive-favorite-item-container ${isHovered||shouldRemove?'':type==='Healthcare'?'health':type==='Human'?'hr':type.toLowerCase()}-item`}>
            <div className="archive-favorite-item-category">
                <p className={`category-favorite-text ${type==='Healthcare'?'health':type.toLowerCase()}-text`}>
                    {`${type==='Human'?'Human Rights & Services':type==='Healthcare'?'Health':
                    type==='Research'?'Research & Public Policy':
                    type==='Community'?'Community Development':type}`}
                </p>
                <span className="archive-favorite-icon-wrapper"
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                onClick={()=>handleRemove()}>
                    {(!shouldRemove)?
                    <AiFillHeart className="archive-favorite-icon"/>:
                    <AiOutlineHeart className="archive-favorite-icon"/>
                    }
                </span>
            </div>
            <div className="archive-favorite-item-figure">
                <div className="archive-favorite-item-figure-wrapper">
                    <p className="archive-favorite-figure-text">
                        {parseFloat(overall).toFixed(1)}
                    </p>
                    <p className="archive-favorite-figure-subtext">
                        OVERALL <br/>SCORE
                    </p>
                    
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
