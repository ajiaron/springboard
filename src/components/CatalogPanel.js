import './CatalogPanel.scss'
import React, {useState, useEffect, useRef} from "react"
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import CharityItem from "./CharityItem";
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

export default function CatalogPanel() {
    return (
        <div className='catalog-panel-container'>
            <p className='category-filter-title'>
                Categories
            </p>
            <div className='category-filter-container'>
         
                <div className='catalog-category-wrapper first-category'>
                    <p className='catalog-category-text'>
                        Human Rights {'&'} Services
                    </p>
                    <input className='checkbox' type='checkbox'/>
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Education
                    </p>
                    <input className='checkbox' type='checkbox'/>
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Environment {'&'} Animals
                    </p>
                    <input className='checkbox' type='checkbox'/>
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Healthcare
                    </p>
                    <input className='checkbox' type='checkbox'/>
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Research {'&'} Public Policy
                    </p>
                    <input className='checkbox' type='checkbox'/>
                </div>
            </div>
            <p className='category-filter-title middle-filter'>
                Sizing
            </p>
               <div className='category-filter-container'>
            
                    <div className='catalog-category-wrapper first-category'>
                        <p className='catalog-category-text'>
                            Small-sized
                        </p>
                        <input className='checkbox' type='checkbox'/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Mid-sized
                        </p>
                        <input className='checkbox' type='checkbox'/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Large-sized
                        </p>
                        <input className='checkbox' type='checkbox'/>
                    </div>
                </div>
            <p className='category-filter-title bottom-filter'>
                Filter
            </p>
               <div className='category-filter-container'>
                    <div className='catalog-category-wrapper first-category'>
                        <p className='catalog-category-text'>
                            International
                        </p>
                        <input className='checkbox' type='checkbox'/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Accepting Donations
                        </p>
                        <input className='checkbox' type='checkbox'/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Recommended
                        </p>
                        <input className='checkbox' type='checkbox'/>
                    </div>
                </div>
        </div>
    )

}