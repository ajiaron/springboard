import React, {useState, useEffect, useRef} from "react"
import './Catalog.scss'
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import CharityItem from "./CharityItem";
import CatalogPanel from "./CatalogPanel";
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

export default function Catalog() {
    return (
        <div className="catalog-main-container">
        
            <div className="catalog-main-content">
            <Navbar/>
                <div className="catalog-header-container">
                    <div className="catalog-header-wrapper">
                        <p className="catalog-header-text">
                            PROGRAM CATALOG
                        </p>
                    </div>
                    <div className="catalog-main-text-container">
                        <p className="catalog-main-text">     
                            A little goes a long way.
                        </p>
                  
                    </div>
                    {/*
                      Listings were chosen based on having an overall score of 90 or more, taking into account factors such as their financial and<br/> accountability scores.
                      Of those organizations, the top 50 contributors from each category of cause are included in this catalog.<p className="header-space"><br/></p>
                     */}
                    <div className="catalog-header-subtext-wrapper">
                        <p className="catalog-header-subtext">
                            Search from over 400 charities across different categories of cause, from social services to wildlife conservation<br/> and more.
                            Entries are curated from the best performing organizations, as listed from <Link className='catalog-feedback-link' to={'https://www.charitynavigator.org/'}>www.charitynavigator.org</Link>.<p className="header-space"><br/></p>
                            If you would like to suggest a charity or non-profit organization to be included in a future update, 
                            <Link className='catalog-feedback-link' to={'#'}
                            onClick={(e)=>{
                                window.location.href = 'mailto:aaronjiang3942@gmail.com';
                                e.preventDefault();
                                }}> let us know.
                            </Link>
                        </p>
                    </div>
                </div>

      
        

            </div>

                <div className="charity-catalog-container">
                    <div className="panel-container">
                        <CatalogPanel/>
                    </div>
                    <div className="charity-tag-container">
                        <CharityItem/>
                    </div>
                    
                </div> 

        </div>
    )
}