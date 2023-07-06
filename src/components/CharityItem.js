import React, {useState, useEffect, useRef} from "react"

import './CharityItem.scss'
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

export default function CharityItem() {
    return (
        <div className="charity-item-container">
            <div className="charity-item-content">
                <div className="charity-item-info">
                    <div className="charity-item-title-wrapper">
                        <p className="charity-tag-title">
                            American Heart Association
                        </p>
                    </div>
                    <div className="charity-location-wrapper">
                        <p className="charity-location-text">
                            Santa Clara, CA, USA
                        </p>
                    </div>
                    <div className="charity-categories-wrapper">
                        <div className="charity-categories-container">
                            
                            <p className="charity-category-text">
                                Healthcare
                            </p>
                            
                        </div>
                        <div className="charity-categories-container size-wrapper">
                                
                                <p className="charity-category-text">
                                    Large-Sized
                                </p>
                        
                        </div>
                    </div>

                </div>
            </div>
            <div className="charity-figure-container">
                <div className="charity-score-container">
                    <p className="overall-score">
                        90.0
                    </p>    
                </div>
            </div>
        </div>
    )
}