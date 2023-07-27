import React, {useState, useEffect, useRef} from "react"
import './CharityItem.scss'
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
import {HiArrowTrendingUp} from 'react-icons/hi'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import {FaArrowRight,FaShoppingBasket, FaShoppingCart} from 'react-icons/fa'
import { AiOutlineLink, AiOutlineEdit } from 'react-icons/ai'
const Circle = ({score, color}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
//  const offset = ((100 - score) / 100) * circumference;
  const offset = (score / 100) * circumference;

  return (
    <svg
      className="progress-ring"
      width="160"
      height="160">
        <circle
            stroke={color}
            fill="transparent"
            strokeLinecap="round"
            strokeWidth="2.5"
            strokeDasharray={`${circumference} ${circumference}`}
            r={radius}
            cx="80"
            cy="80"
            style={{
                boxShadow: `0 0 20px ${color}`
        }}/>
        <circle
            className="animated-circle"
            stroke="#3a3a3a" 
            fill="transparent"
            strokeWidth="3"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
                strokeDashoffset: circumference,
                animation: `draw-circle 1s ease-in-out forwards`,
                "--offset": offset, 
                filter: 'url(#circleShadow)',
            }}
            r={radius}
            cx="80"
            cy="80"
        />
        <circle
            className="back-circle"
            stroke="#252525" 
            fill="transparent"
            strokeWidth="44"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
                strokeDashoffset: circumference,
                animation: `draw-circle 1s ease-in-out forwards`,
                "--offset": offset, 
                filter: 'url(#circleShadow)',
            }}
            r={radius}
            cx="80"
            cy="80"
        />
    </svg>
  );
}

export default function CharityItem({
    index, charityid, title, location, category, size, isInternational, total, excess,
    assets, revenue, progExpense, adminExpense, fundExpense, adminRatio, focus, score, url,
    onHandlePayment}) {
    const [selected, setSelected] = useState(false)
    const money = 653394727;
    const [expanded, setExpanded] = useState(false)
    function ringColor(category) {
        switch (category) {
            case 'Human':
                return 'rgb(83, 138, 190)'
            case 'Environment':
                return 'rgb(48, 162, 97)'
            case 'Animals':
                return 'rgb(122, 188, 69)'
            case 'Healthcare':
                return 'rgb(198, 83, 93)'
            case 'Education':
                return 'rgb(200, 153, 35)'
            case 'Research':
                return 'rgb(63, 159, 152)'
            case 'Community':
                return 'rgb(139, 117, 98)'
            default:
                return '#6a6a6a'
        }
    }
    function handleExpand() {
        if (!selected && !expanded) {
            setExpanded(true)
        }
        setSelected(!selected)
    }

    return (
        <span onClick={()=>handleExpand()} className='charity-item-button'>
            <div className={`charity-item-container ${(selected&&expanded)?'selected-container':(!selected && expanded)?'unselected-container':''}`}>
                <div className={`charity-item-content ${(selected&&expanded)?'selected-content':(!selected && expanded)?'unselected-content':''}`}>
                    <div className="charity-item-info">
                        <div className="charity-item-title-wrapper">
  
                                <p className="charity-tag-title">
                                    {title}
                                </p>
                   
                        </div>
                        <div className="charity-location-wrapper">
                            <p className="charity-location-text">
                                {location}
                            </p>
                        </div>
                        {(selected || expanded)&&
                        <div className={`charity-info-expanded-container ${!selected&&expanded?'info-expand':(!selected && expanded)?'info-shrink':(!expanded)?'info-none':''}`}>
                            <div className="charity-info-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                        Organization Focus:
                                    </p>
                                    <p className="expanded-info-data">
                                        {focus}
                                    </p>
                                </div>
                            </div>
                            <div className="charity-info-expanded lower-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                        Total Contributions:
                                    </p>
                                    <p className="expanded-info-data">
                                        {`$${total.toLocaleString()}`}
                                    </p>
                                </div>
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                        Excess/Deficit:
                                    </p>
                                    <p className={`${excess<0?'deficit':'excess'}-info`}>
                                    {`${excess < 0?'-':'+'}$${Math.abs(excess).toLocaleString()}`}
                                    </p>
                                </div>
                            </div>
                            <div className="charity-info-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                        Net Assets:
                                    </p>
                                    <p className="expanded-info-data">
                                    {`$${assets.toLocaleString()}`}
                                    </p>
                                </div>
            
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                        Other Revenue:
                                    </p>
                                    <p className="expanded-info-data">
                                    {`$${revenue.toLocaleString()}`}
                                    </p>
                                </div>
                            </div>
                            <div className="charity-info-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                        Program Expenses:
                                    </p>
                                    <p className="expanded-info-data">
                                    {`$${progExpense.toLocaleString()}`}
                                    </p>
                                </div>
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                        Administrative Expenses:
                                    </p>
                                    <p className="expanded-info-data">
                                        {`$${adminExpense.toLocaleString()}`}
                                    </p>
                                </div>
                            </div>
        
                            <div className="charity-info-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                    Fundraising Expenses:
                                    </p>
                                    <p className="expanded-info-data">
                                    {`$${fundExpense.toLocaleString()}`}
                                    </p>
                                </div>
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text"> 
                                        Admin Expense Ratio:
                                    </p>
                                    <p className="expanded-info-data">
                                    {`${parseFloat(adminRatio).toFixed(2)}`}
                                    </p>
                                </div>
                            </div>
                   
                            <div className="donation-button-container">
      
                      
                                <div className="like-icon-wrapper">
                                    <AiFillHeart className="charity-like-icon"/>
                                </div>
                    
                                <div className="like-icon-wrapper">
                                    <FaShoppingBasket className="charity-basket-icon"/>
                                </div>
                                <div className="like-icon-wrapper">
                                    <AiOutlineLink className="charity-linkto-icon"/>
                                </div>

                      
                  
                                <div className="like-icon-wrapper">
                                    <FaArrowRight className="charity-arrow-icon"/>
                                </div>
                   
                                {/*
                                <Link className={`link-donation-button`} to={url}>
                                    <p className="link-donation-text">
                                        Donate On-Site
                                    </p>
                                </Link>
                        */}
                            </div>
                   
                        </div>
    }
                        <div className={`charity-categories-wrapper ${(selected&&expanded)?'selected-categories':(!selected && expanded)?'unselected-categories':''}`}>
                            <div className={`charity-categories-container ${category.toLowerCase()}-container`}>
                                <p className="charity-category-text">
                                    {`${category==='Human'?'Human Rights & Services':
                                    (category==='Research')?'Research & Public Policy':
                                    (category === "Community")?'Community Development':category}`}
                                </p>
                            </div>
                            <div className={`charity-categories-container size-wrapper ${size.toLowerCase()}-wrapper`}>
                                <p className="charity-category-text">
                                    {`${size}-Sized`}
                                </p>
                            </div>
                            {(isInternational)&&
                                <div className={`charity-categories-container international-wrapper`}>
                                    <p className="charity-category-text">
                                        International
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className={`charity-figure-container ${(selected&&expanded)?'selected-score':(!selected && expanded)?'unselected-score':''}`}>
                    <div className={`charity-score-container ${category.toLowerCase()}-circle`}>
                        <Circle 
                            score={parseFloat(score)}
                            color={ringColor(category)}
                        />   
                            <div className="blur-wrapper">
                                <div className={`circle-blur ${category.toLowerCase()}-blur`}/>                
                            </div>
                        <p className="overall-score">
                            {`${parseFloat(score).toFixed(1)}`}
                        </p>    
                    </div>
                </div>
            </div>
        </span>
    )
}