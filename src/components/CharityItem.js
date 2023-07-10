import React, {useState, useEffect, useRef} from "react"

import './CharityItem.scss'
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

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
        stroke="#3a3a3a" // Choose your desired color
        fill="transparent"
        strokeWidth="3"
   
        strokeDasharray={`${circumference} ${circumference}`}
        style={{
            strokeDashoffset: circumference,
            animation: `draw-circle 1s ease-in-out forwards`,
            "--offset": offset, // Set the CSS variable --offset
            filter: 'url(#circleShadow)',
          }}
        r={radius}
        cx="80"
        cy="80"/>
          <circle
        className="back-circle"
        stroke="#252525" // Choose your desired color
        fill="transparent"
        strokeWidth="44"
        
        strokeDasharray={`${circumference} ${circumference}`}
        style={{
            strokeDashoffset: circumference,
            animation: `draw-circle 1s ease-in-out forwards`,
            "--offset": offset, // Set the CSS variable --offset
            filter: 'url(#circleShadow)',
          }}
        r={radius}
        cx="80"
        cy="80"/>
    </svg>
  );
}

export default function CharityItem({index, charityid, title, location, category, size, isInternational, total, excess, score, url}) {
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
    return (
        <div className="charity-item-container">
            <div className="charity-item-content">
                <div className="charity-item-info">
                    <div className="charity-item-title-wrapper">
                        <Link className="charity-link" to={(url !== undefined)?url:'#'}>
                            <p className="charity-tag-title">
                                {title}
                            </p>
                        </Link>
                    </div>
                    <div className="charity-location-wrapper">
                        <p className="charity-location-text">
                            {location}
                        </p>
                    </div>

                    <div className="charity-categories-wrapper">
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
            <div className="charity-figure-container">
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
    )
}