import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';

export default function Landing() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    return (
        <div className="landing-container">
            <div className="main-content">
                <Navbar/>
                <div className="content-container">

        
                    <div className="hero-text-container">
                        <div className="hero-header-container">
                            <p className="hero-header">
                                Find out where you can help.
                            </p>
                        </div>
                        <div className="hero-subtext-container">
                            <p className="hero-subtext">
                                Lend a hand to where you find it's most needed, and learn more about your impact.
                            </p>
                        </div>
                        
                        <div className="hero-button-container">
                            <div className="hero-button-left">
                                <p className="hero-button-text">
                                    Create Account
                                </p>
                            </div>
                            <div className="hero-button-right">
                                <p className="hero-button-text">
                                    Sign In
                                </p>
                            </div>
                        </div>

                        

                    </div>

                    {/* grid content */}
                    <div className="grid-content">
                        <div className="grid-content-main">
                        </div>
                        <div className="grid-pair">
                            <div className="grid-content-item">
                            </div>
                            <div className="grid-content-item">
                            </div>
                        </div>
                        <div className="grid-pair">
                            <div className="grid-content-item-low">
                            </div>
                            <div className="grid-content-item-low">
                            </div>
                        </div>
                    </div>
                    <SideBar/>
                </div>
                {/* bottom scrollers */}

            </div>

            <div className="main-content-lower">

                <div className="subcontent-wrapper">
                    <div className="content-lower-header">
                        <p className="content-lower-text">
                            Top Performing Charities
                        </p>
                        <p className="content-lower-subtext">
                            All presented data has been sourced from www.charitynavigator.org. Entries are curated<br>
                            </br>
                            based on their accountability and financial scores, as provided by Charity Navigator. 

                        </p>
                    </div>
                    <div className="subcontent-container">
                        <div className="subcontent-item-container">
                        </div>
                        <div className="subcontent-item-container">
                        </div>
                        <div className="subcontent-item-container">
                        </div>
                        <div className="subcontent-item-container">
                        </div>
                    </div>
                </div>

              
            </div>
            <div className="main-content-bottom">
            <div className="subcontent-wrapper-bottom">
                    <div className="content-lower-header">
                        <p className="content-lower-text">
                            Find Your Cause
                        </p>
                        <p className="content-lower-subtext">
                            Support what matters to you the most, and find who's doing what to help.<br>
                            </br>
                            If you can't find your category of choice, let us know in the Feedback tab above. 

                        </p>
                    </div>
                    <div className="subcontent-container-bottom">
                        <div className="subcontent-item-container-bottom">
                        </div>
                        <div className="subcontent-item-container-bottom">
                        </div>
                        <div className="subcontent-item-container-bottom">
                        </div>
                       
                    </div>
                </div>

            </div>
    </div>
    )
}