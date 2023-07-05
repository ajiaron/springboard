import React, {useState, useEffect, useRef} from "react"
import './Landing.scss'
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

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
                            <div className="grid-main-text-container">
                                <p className="grid-main-text">
                                    Discover
                                </p>
                            </div>
          
                        </div>
                        <div className="grid-pair">
                            <div className="grid-content-item">
                                <div className="grid-item-text-container-alt">
                                    <p className="grid-item-text-alt">
                                        AI <BsStars className="star-icon"/><br/>Support
                                    </p>
                                    
                                </div>
                       
                            </div>
                            <div className="grid-content-item">
                                <div className="grid-item-text-container">
                                    <p className="grid-item-text">
                                        Your<br/>Donations
                                    </p>
                                </div>
                
                            </div>
                        </div>
                        <div className="grid-pair">
                            <div className="grid-content-item-low">
                                
                                <div className="grid-item-text-container-bottom">
                                    <p className="grid-item-text-bottom">
                                      FAQ's<p className="dash-symbol"> —</p><br/>About Us
                                    </p>
                                </div>
                          
                            </div>

                            <div className="grid-content-item-low">
                                <div className="grid-item-text-container-bottom">
                                    <p className="grid-item-text-alt">
                                    Future<br/>Releases
                                    </p>
                                </div>
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

                        <div className="subcontent-item-container hr-item">
                            <div className="subcontent-item-category">
                                <p className="category-text category-hr">
                                    Human {'&'} Civil Rights
                                </p>
                            </div>
                            <div className="subcontent-item-figure">
                                <p className="subcontent-figure-text">
                                    100.0
                                </p>
                 
                            </div>
                            <div className="subcontent-item-name">
                                <p className="subcontent-name-text">
                                    <p className="charity-name">Equal Justice Initiative</p> earned a <br/>perfect financial score of 100.
                                </p>
                            </div>
                        </div>

                        <div className="subcontent-item-container education-item">
                            <div className="subcontent-item-category">
                                    <p className="category-text category-ed">
                                        Education
                                    </p>
                                </div>
                                <div className="subcontent-item-figure">
                                    <p className="subcontent-figure-text">
                                        1st
                                    </p>
                     
                                 
                                </div>
                                <div className="subcontent-item-name">
                                    <p className="subcontent-name-text">
                                        The <p className="charity-name">Kids In Need Foundation </p> has the lowest administrative expenses, at
                                        <br/>.2% of their contributions.
                                    </p>
                                </div>
                            </div>

                        <div className="subcontent-item-container health-item">
                            <div className="subcontent-item-category">
                                <p className="category-text category-h">
                                    Health
                                </p>
                            </div>
                            <div className="subcontent-item-figure">
                                <p className="subcontent-figure-text">
                                    693M
                                </p>

                            </div>
                            <div className="subcontent-item-name">
                                <p className="subcontent-name-text">
                                    The <p className="charity-name">American Heart Association </p>has raised over 693m for the highest contribution total.
                                </p>
                            </div>
                        </div>

                        <div className="subcontent-item-container environment-item">
                            <div className="subcontent-item-category">
                                <p className="category-text category-ev">
                                    Environment
                                </p>
                            </div>
                            <div className="subcontent-item-figure">
                                <p className="subcontent-figure-text">
                                    100.0
                                </p>
                            </div>
                            <div className="subcontent-item-name">
                                <p className="subcontent-name-text">
                                    <p className="charity-name">Conservation International </p> earned a perfect accountability score of 100.
                                </p>
                            </div>
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

                            <div className="cause-icon-container">
                                <div className="cause-icon-wrapper hand-wrapper">
                                    <div className="hand-icon">
                                    </div>
                                </div>
                            </div>
                            <div className="cause-title-container">
                                <p className="cause-title">
                                    Human Rights {'&'} Services
                                </p>
                            </div>
                            <div className="cause-description-container">
                                <p className="cause-description">
                                    Charities in this category provide support for shelter and crisis services, youth development, and civil rights advocacy. 
                                </p>
                            </div>

                        </div>
               
                       
                      
          
                   
                        <div className="subcontent-item-container-bottom">
                        <div className="cause-icon-container">
                                <div className="cause-icon-wrapper sprout-wrapper">
                                    <div className="sprout-icon">

                                    </div>
                                </div>
                            </div>
                            <div className="cause-title-container">
                                <p className="cause-title">
                                    Environment {'&'} Wildlife
                                </p>
                            </div>
                            <div className="cause-description-container">
                                <div className="cause-description">
                                    Environmentally focused organizations assist in the conservation of wildlife, as well as our local parks and gardens.
                                </div>
                            </div>
                            
                        </div>
                        <div className="subcontent-item-container-bottom">
                            <div className="cause-icon-container">
                                <div className="cause-icon-wrapper pencil-wrapper">
                                    <div className="pencil-icon">

                                    </div>
                                </div>
                            </div>
                            <div className="cause-title-container">
                                <p className="cause-title">
                                    Education {'&'} Research
                                </p>
                            </div>
                            <div className="cause-description-container">
                                <div className="cause-description">
                                    Here, institutions are working to improve scholarships, financial support, and special education programs.
                                </div>
                            </div>
                            
                        </div>

                    </div>

                </div>

            </div>
            <div className="main-content-end">
                <div className="main-content-end-wrapper">

      
                    <div className="content-end-container">
                        <div className="content-end-header-wrapper">
                            <p className="content-end-header">
                                GETTING STARTED
                            </p>

                        </div>
                        <div className="content-end-text-wrapper">
                            <p className="content-end-text">
                                A little goes a long way.
                            </p>
                        </div>
                        <div className="content-end-subtext-wrapper">
                            <p className="content-end-subtext">
                                Every cent you'll put down in will go the charities or non-profits of your choosing. 
                            </p>
                        </div>
                    </div>
                    
                    <div className="end-button-container">
                        <div className="getting-started-button">
                            <p className="getting-started-text">
                                Get Started
                            </p>
                        </div>
                        <div className="explore-else-button">
                            <p className="explore-else-text">
                                Feedback
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="icon-container">
                <Link className="git-logo-button" to="https://github.com/ajiaron">
                <div className="git-logo"></div>
                </Link>
                <Link className="mail-button"  to={'#'} onClick={(e)=>{
                window.location.href = 'mailto:aaronjiang3942@gmail.com';
                e.preventDefault();
                }}>
                <div className="mail-icon"/>
                </Link>
                
                <Link className="linkedin-button" to="https://www.linkedin.com/in/aaronjiang01/">
                    <div className="linkedin-logo"></div>
                </Link>
            </div>
    </div>
    )
}