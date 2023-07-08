import React, {useState, useEffect, useRef} from "react"
import './Catalog.scss'
import Navbar from "./Navbar";
import {BsSearch} from 'react-icons/bs'
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import CharityItem from "./CharityItem";
import CatalogPanel from "./CatalogPanel";
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

export default function Catalog() {
    const [query, setQuery] = useState('')
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
                            Entries are curated from the best performing organizations, as listed from <Link className='catalog-feedback-link' to={'https://www.charitynavigator.org/'}>www.charitynavigator.org</Link>.<br className="header-space"/>
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
                    <div className="search-catalog-container">
                        <input type="text" name="ownerName" id="ownerName"
                            onChange={(e)=> setQuery(e.target.value)}
                            value={query}
                            placeholder={'Search an organization...'}
                            className="search-catalog" >
                        </input>
                        <BsSearch className="search-icon"/>
                    </div>
                    <CharityItem 
                        title={'American Heart Association'} 
                        location={'Santa Clara, CA, USA'}
                        category={'Healthcare'}
                        size={'Large'}
                        isInternational={false}
                        score={'90.0'}
                    />
                    <CharityItem 
                        title={'International Conservation'} 
                        location={'San Francisco, CA, USA'}
                        category={'Environment'}
                        size={'Small'}
                        isInternational={true}
                        score={'88.5'}
                    />
                    <CharityItem 
                        title={'Equal Justice Initiative'} 
                        location={'New York, NY, USA'}
                        category={'Human'}
                        size={'Mid'}
                        isInternational={false}
                        score={'89.8'}
                    />
                    <CharityItem 
                        title={'Kids In Need Foundation'} 
                        location={'Austin, TX, USA'}
                        category={'Education'}
                        size={'Small'}
                        isInternational={true}
                        score={'94.7'}
                    />
                    <CharityItem 
                        title={'Atlas Network'} 
                        location={'Detroit, MI, USA'}
                        category={'Research'}
                        size={'Large'}
                        isInternational={false}
                        score={'87.4'}
                    />
                </div>
            </div> 
        </div>
    )
}