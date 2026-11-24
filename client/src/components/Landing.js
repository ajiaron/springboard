import React, {useState, useEffect} from "react"
import '../styles/Landing.scss'
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Signin from "./Signin";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheck, FiBookOpen, FiHeart, FiUsers } from "react-icons/fi";
import { Auth } from 'aws-amplify';
import { ensureDemoSession, isDemoMode } from '../demoAuth';

export default function Landing() {
    const navigate = useNavigate()
    const [signInActive, setSignInActive] = useState(null)
    const [firstRender, setFirstRender] = useState(true)
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isActive, setIsActive] = useState(true)
    const [openFaq, setOpenFaq] = useState(null)

    const handleSignIn = (type) => {
        setFirstRender(false)
        setSignInActive(type)
        setIsActive(false)
    }
    const handleBlur = () => {
        setIsActive(true)
    }
    const closeSignIn = () => {
        setSignInActive(null)
    }
    function handleLogin() {
        navigate('/dashboard')
    }
    function handleDemoEnter() {
        ensureDemoSession()
        navigate('/dashboard')
    }
    useEffect(()=>{
        if (signInActive !== null) {
            document.body.style.overflow='hidden'
        }
        else {
            document.body.style.overflow='auto'
        }
      }, [signInActive])

    useEffect(() => {
        if (isDemoMode()) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }
        Auth.currentAuthenticatedUser()
          .then(() => setIsAuthenticated(true))
          .catch(() => setIsAuthenticated(false))
          .finally(() => setIsLoading(false));
      }, []);

    return (
        <div className="landing-container">
        {
            (signInActive!==null)&&<Signin type={signInActive} onClose={closeSignIn} onBlur={handleBlur}/>
        }
            <div className={`main-content ${!isActive?(!firstRender)?'inactive-landing-container':'dim-landing-container':(!firstRender)?'active-container':''}`}>
                <div className="landing-topbar">
                    <Navbar route={'landing'}/>
                    <div className="landing-topbar-actions">
                        <Link className="landing-nav-link" to="/catalog">Discover</Link>
                        <Link className="landing-nav-link" to="/feed">Recent Donations</Link>
                        <Link className="landing-nav-link" to="/donations">Your Donations</Link>
                        <span className="landing-nav-cta" onClick={()=>(isAuthenticated)?handleLogin():handleSignIn('login')}>
                            {(isAuthenticated)?'To Dashboard':'Sign In'}
                        </span>
                    </div>
                </div>

                <section className="landing-hero">
                    <div className="landing-hero-copy">
                        <p className="landing-badge">Currently Inactive</p>
                        <p className="hero-header">
                            Find out where you can <span className="hero-header-accent">help.</span>
                        </p>
                        <p className="hero-subtext">
                            Lend a hand to where you find it's most needed, and learn more about your impact.
                        </p>
                        <div className="hero-button-container">
                            <span className="register-button" onClick={()=>handleSignIn('register')}>
                                <p className="hero-button-text">Create Account</p>
                                <FiArrowRight className="hero-button-icon"/>
                            </span>
                            <span className="login-button" onClick={()=>(isAuthenticated)?handleLogin():handleSignIn('login')}>
                                <p className="hero-button-text">
                                    {(isAuthenticated)?'To Dashboard':'Sign In'}
                                </p>
                            </span>
                        </div>
                        {isDemoMode() && (
                            <span className="demo-button" onClick={handleDemoEnter}>
                                <p className="hero-button-text">Continue as Demo</p>
                            </span>
                        )}
                    </div>
                    <Link className="landing-hero-visual discover-link" to="/catalog">
                        <div className="grid-content-main">
                            <div className="discover-scene"/>
                            <div className="grid-main-text-container">
                                <p className="grid-main-text">Discover</p>
                            </div>
                        </div>
                    </Link>
                </section>

                <div className="landing-stats-row">
                    <div className="landing-stat-card">
                        <p className="landing-stat-value">100.0</p>
                        <p className="landing-stat-label">Equal Justice Initiative financial score</p>
                    </div>
                    <div className="landing-stat-card">
                        <p className="landing-stat-value">1st</p>
                        <p className="landing-stat-label">Kids In Need admin efficiency</p>
                    </div>
                    <div className="landing-stat-card">
                        <p className="landing-stat-value">$693M</p>
                        <p className="landing-stat-label">American Heart Association raised</p>
                    </div>
                    <div className="landing-stat-card">
                        <p className="landing-stat-value">100.0</p>
                        <p className="landing-stat-label">Conservation International accountability</p>
                    </div>
                </div>

                <div className="landing-quick-links">
                    <Link className="grid-content-item" to="/feed">
                        <p className="grid-item-text-left">Recent Donations</p>
                    </Link>
                    <Link className="grid-content-item" to="/donations">
                        <p className="grid-item-text">Your Donations</p>
                    </Link>
                    <div className="grid-content-item-low" onClick={()=>setOpenFaq(openFaq===0?null:0)}>
                        <p className="grid-item-text-bottom">FAQ's — About Us</p>
                    </div>
                    <div className="grid-content-item-low future-card">
                        <p className="grid-item-text-alt">Future Releases</p>
                    </div>
                </div>
              
            </div>

            <section className="main-content-lower">
                <div className="landing-section-header">
                    <p className="landing-badge">Charity Navigator</p>
                    <p className="content-lower-text">Top Performing Charities</p>
                    <p className="content-lower-subtext">
                        All presented data has been sourced from www.charitynavigator.org. Entries are curated
                        based on their accountability and financial scores, as provided by Charity Navigator.
                    </p>
                </div>
                <div className="subcontent-container">
                    <div className="subcontent-item-container hr-item">
                        <div className="subcontent-item-category">
                            <p className="category-text category-hr">Human {'&'} Civil Rights</p>
                        </div>
                        <div className="subcontent-item-figure">
                            <p className="subcontent-figure-text">100.0</p>
                        </div>
                        <div className="subcontent-item-name">
                            <p className="subcontent-name-text">
                                <span className="charity-name">Equal Justice Initiative</span> earned a perfect financial score of 100.
                            </p>
                        </div>
                    </div>
                    <div className="subcontent-item-container education-item">
                        <div className="subcontent-item-category">
                            <p className="category-text category-ed">Education</p>
                        </div>
                        <div className="subcontent-item-figure">
                            <p className="subcontent-figure-text">1st</p>
                        </div>
                        <div className="subcontent-item-name">
                            <p className="subcontent-name-text">
                                The <span className="charity-name">Kids In Need Foundation</span> has the lowest administrative expenses, at .2% of their contributions.
                            </p>
                        </div>
                    </div>
                    <div className="subcontent-item-container health-item">
                        <div className="subcontent-item-category">
                            <p className="category-text category-h">Health</p>
                        </div>
                        <div className="subcontent-item-figure">
                            <p className="subcontent-figure-text">$693M</p>
                        </div>
                        <div className="subcontent-item-name">
                            <p className="subcontent-name-text">
                                The <span className="charity-name">American Heart Association</span> has raised over 693m for the highest contribution total.
                            </p>
                        </div>
                    </div>
                    <div className="subcontent-item-container environment-item">
                        <div className="subcontent-item-category">
                            <p className="category-text category-ev">Environment</p>
                        </div>
                        <div className="subcontent-item-figure">
                            <p className="subcontent-figure-text">100.0</p>
                        </div>
                        <div className="subcontent-item-name">
                            <p className="subcontent-name-text">
                                <span className="charity-name">Conservation International</span> earned a perfect accountability score of 100.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="main-content-bottom">
                <div className="landing-section-header centered">
                    <p className="landing-badge">Programs</p>
                    <p className="content-lower-text">Find Your Cause</p>
                    <p className="content-lower-subtext">
                        Support what matters to you the most, and find who's doing what to help.
                        If you can't find your category of choice, let us know in the Feedback tab above.
                    </p>
                </div>
                <div className="subcontent-container-bottom">
                    <div className="subcontent-item-container-bottom">
                        <div className="cause-icon-container">
                            <div className="cause-icon-wrapper hand-wrapper">
                                <FiUsers className="cause-react-icon"/>
                            </div>
                        </div>
                        <div className="cause-title-container">
                            <p className="cause-title">Human Rights {'&'} Services</p>
                        </div>
                        <div className="cause-description-container">
                            <p className="cause-description">
                                Charities in this category provide support for shelter and crisis services, youth development, and civil rights advocacy.
                            </p>
                        </div>
                        <Link className="cause-learn-more" to="/catalog">Learn More →</Link>
                    </div>
                    <div className="subcontent-item-container-bottom">
                        <div className="cause-icon-container">
                            <div className="cause-icon-wrapper sprout-wrapper">
                                <FiHeart className="cause-react-icon"/>
                            </div>
                        </div>
                        <div className="cause-title-container">
                            <p className="cause-title">Environment {'&'} Wildlife</p>
                        </div>
                        <div className="cause-description-container">
                            <p className="cause-description">
                                Environmentally focused organizations assist in the conservation of wildlife, as well as our local parks and gardens.
                            </p>
                        </div>
                        <Link className="cause-learn-more" to="/catalog">Learn More →</Link>
                    </div>
                    <div className="subcontent-item-container-bottom">
                        <div className="cause-icon-container">
                            <div className="cause-icon-wrapper pencil-wrapper">
                                <FiBookOpen className="cause-react-icon"/>
                            </div>
                        </div>
                        <div className="cause-title-container">
                            <p className="cause-title">Education {'&'} Research</p>
                        </div>
                        <div className="cause-description-container">
                            <p className="cause-description">
                                Here, institutions are working to improve scholarships, financial support, and special education programs.
                            </p>
                        </div>
                        <Link className="cause-learn-more" to="/catalog">Learn More →</Link>
                    </div>
                </div>
            </section>

            <section className="landing-mission">
                <div className="landing-mission-copy">
                    <p className="landing-badge">Our Mission</p>
                    <p className="content-lower-text">A little goes a long way.</p>
                    <p className="content-lower-subtext">
                        Every cent you'll put down in will go the charities or non-profits of your choosing.
                    </p>
                    <div className="landing-mission-checks">
                        <div className="landing-check-row">
                            {/*<FiCheck className="landing-check-icon"/>*/}○
                            <div>
                                <p className="landing-check-title">Accountability scores</p>
                                <p className="landing-check-text">Curated from Charity Navigator performance data.</p>
                            </div>
                        </div>
                        <div className="landing-check-row">
                            {/*<FiCheck className="landing-check-icon"/>*/}○
                            <div>
                                <p className="landing-check-title">Financial transparency</p>
                                <p className="landing-check-text">See how contributions are put to work.</p>
                            </div>
                        </div>
                        <div className="landing-check-row">
                            {/*<FiCheck className="landing-check-icon"/>*/}○
                            <div>
                                <p className="landing-check-title">Causes that matter</p>
                                <p className="landing-check-text">Browse categories from rights to research.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="landing-mission-visual">
                    <div className="landing-mission-panel">
                        <p className="landing-mission-panel-kicker">GETTING STARTED</p>
                        <p className="landing-mission-panel-title">Build your donor platform today.</p>
                        <span className="register-button mission-cta" onClick={()=>handleSignIn('register')}>
                            <p className="hero-button-text">Create Account</p>
                            <FiArrowRight className="hero-button-icon"/>
                        </span>
                    </div>
                </div>
            </section>

            <section className="landing-faq">
                <p className="content-lower-text centered-title">FAQ's — About Us</p>
                <div className="landing-faq-list">
                    <div className={`landing-faq-item ${openFaq===0?'open':''}`} onClick={()=>setOpenFaq(openFaq===0?null:0)}>
                        <div className="landing-faq-q">
                            <p>Where does the charity data come from?</p>
                            <span>{openFaq===0?'−':'+'}</span>
                        </div>
                        {openFaq===0 && (
                            <p className="landing-faq-a">
                                All presented data has been sourced from www.charitynavigator.org. Entries are curated based on their accountability and financial scores.
                            </p>
                        )}
                    </div>
                    <div className={`landing-faq-item ${openFaq===1?'open':''}`} onClick={()=>setOpenFaq(openFaq===1?null:1)}>
                        <div className="landing-faq-q">
                            <p>What are Future Releases?</p>
                            <span>{openFaq===1?'−':'+'}</span>
                        </div>
                        {openFaq===1 && (
                            <p className="landing-faq-a">
                                Future Releases covers upcoming catalog updates and features. If you would like to suggest a charity, use Feedback.
                            </p>
                        )}
                    </div>
                    <div className={`landing-faq-item ${openFaq===2?'open':''}`} onClick={()=>setOpenFaq(openFaq===2?null:2)}>
                        <div className="landing-faq-q">
                            <p>How do I get started?</p>
                            <span>{openFaq===2?'−':'+'}</span>
                        </div>
                        {openFaq===2 && (
                            <p className="landing-faq-a">
                                Create an account or continue as demo, then explore the catalog to find organizations that match your cause.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="main-content-end">
                <div className="landing-cta-banner">
                    <p className="content-end-header">GETTING STARTED</p>
                    <p className="content-end-text">Let's get the ball rolling.</p>
                    <p className="content-end-subtext">
                        Every cent you'll put down in will go the charities or non-profits of your choosing.
                    </p>
                    <div className="end-button-container">
                        <div className="getting-started-button" onClick={()=>handleSignIn('register')}>
                            <p className="getting-started-text">Get Started</p>
                        </div>
                        <div className="explore-else-button" onClick={(e)=>{
                            window.location.href = 'mailto:aaronjiang3942@gmail.com';
                            e.preventDefault();
                        }}>
                            <p className="explore-else-text">Feedback</p>
                        </div>
                    </div>
                </div>
            </section>
          <Footer/>
    </div>
    )
}
