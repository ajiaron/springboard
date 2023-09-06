import React, {useState, useEffect, useRef, useContext} from 'react'
import Navbar from "./Navbar";
import Footer from "./Footer";
import CreatePost from './CreatePost'
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {AiOutlineHeart, AiOutlinePlus, AiFillHeart} from 'react-icons/ai'
import './Charity.scss'
import './Campaign.scss'
import Popup from './Popup';
import CampaignPost from './CampaignPost';
import {GoArrowRight} from 'react-icons/go'
import {FiPlus} from 'react-icons/fi'
import {RiQuillPenFill} from 'react-icons/ri'
import {FaPlus,FaPenNib} from 'react-icons/fa'
import {BiPen} from 'react-icons/bi'
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import SideNavigation from './SideNavigation';
import UserContext from '../contexts/UserContext';
import Payment from './Payment';
import { Oval } from 'react-loader-spinner'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { PolarArea, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { AiOutlineLink, AiOutlineEdit, AiOutlineClockCircle } from 'react-icons/ai'
import axios from 'axios';
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CharityDonation = ({name, location, category, index}) => {
  return (
  <div className={`campaign-donation-item ${index===4?'campaign-item-last':''}`}>
      <div className="profile-donation-item-info" style={{paddingLeft:'0.1em'}}>
          <p className="profile-donation-item-title">
              {name}
          </p>
          <div className="profile-donation-text-wrapper">
              <AiOutlineClockCircle className="profile-clock-icon"/>
              <p className="profile-donation-item-text">
                  3 weeks ago
              </p>   
          </div>
      </div>
  </div>
  )
}


export default function Campaign() {
  const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
  const connection = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const controls = useAnimation()
  const [firstRender, setFirstRender] = useState(true)
  const [isActive, setIsActive] = useState(true)  // background is active
  const [loading, setLoading] = useState(true)
  const [postActive, setPostActive] = useState(null)
  const [paymentActive, setPaymentActive] = useState(null)
  const [charityInfo, setCharityInfo] = useState(null)
  const [shouldArchive, setShouldArchive] = useState()
  const [campaignInfo, setCampaignInfo] = useState(null)
  const [status, setStatus] = useState("")
  const [renderStatus, setRenderStatus] = useState(false)
  const pageSize = 5
  const [page, setPage] = useState(1)
  const loadingRef = useRef(null)
  const [postList, setPostList] = useState([])
  const { campaignid } = useParams()
  function hexToRgba(hex, a){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length === 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return `${'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')},${a?a:1})`;
    }
    else {
        console.log(hex)
    }
}

  const [theme, setTheme] = useState('#5a5a5abf');
  const data = {
      labels: ['Current', 'Goal'],

      datasets: [
        {
          label: 'Funds Raised',
          data: [campaignInfo?campaignInfo.total:0,
          campaignInfo?campaignInfo.goal-campaignInfo.total:0],
          backgroundColor: [
            (campaignInfo)?`${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.8)}`:`rgba(92,92,92,0.8)`,
            'rgba(92, 92, 92, 0.8)',
          ],
          borderColor: ['#252525bb','#252525bb'],
          borderWidth:0,
          spacing:campaignInfo?campaignInfo.total<campaignInfo.goal?4:0:4,
          hoverBackgroundColor: [
            (campaignInfo)?`${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.95)}`:`rgba(92,92,92,0.8)`,
            'rgba(92, 92, 92, .75)',
          ],
          borderRadius: {
            outerEnd:campaignInfo?campaignInfo.total<campaignInfo.goal?20:0:20,
            innerEnd:campaignInfo?campaignInfo.total<campaignInfo.goal?20:0:20,
            outerStart:campaignInfo?campaignInfo.total<campaignInfo.goal?20:0:20,
            innerStart:campaignInfo?campaignInfo.total<campaignInfo.goal?20:0:20,
          },
        },
      ],
  }
  const doughOptions = {
    cutout:'80%',
    responsive:true,
    plugins: {
        legend: {
          display:false,
          labels: {
            color: '#bbb'  // changes color of legend labels
          }
        },
        tooltip: {
          enabled:false
        }
      }
  }
  const closePopup = () => {
    setRenderStatus(false)
    setStatus(false)
  }
  const handleBlur = () => {
    setIsActive(true)
  }
  const handlePost = (type) => {
    setFirstRender(false)
    setPostActive(type)
    setIsActive(false)
  }
  const onClosePost = () => {
    setPostActive(null)
    handleBlur()
  }
  const handlePayment = () => {
    setFirstRender(false)
    setPaymentActive(true)
    setIsActive(false)
}
  const onClosePayment = () => {
    setPaymentActive(null)
    handleBlur()
  }
  function handleTest() {
    //console.log(charityInfo)
    navigate(`/createcampaign/${campaignid}`)
  }


  useEffect(() => {
    if (!loading) {
      controls.start({
        y: 0,
        opacity: 1,
      });
    }
  }, [loading, controls]);
  const loadPosts = async() => {
    try {
        const res = await axios.get(`${connection}/api/getcampaignposts/${campaignid}/${pageSize}/${(page-1)*pageSize}`)
        if (res.data) {
            console.log(res)
            setPostList(res.data)
        }
    } catch(e) {
        console.log(e)
    }
    setLoading(false)
  }
  useEffect(()=> {
    const loadCampaign = async() => {
        setLoading(true)
        try {
            const res = await axios.get(`${connection}/api/getcampaign/${campaignid}`)
            if (res.data) {
                console.log(res.data)
                setCampaignInfo(res.data[0])
                setTheme(res.data[0].theme)
                loadPosts()
                // handle whether or not the campaign is archived here
            }
        } catch(e) {
            console.log(e)
        }
    }
    loadCampaign()
  }, [])

  useEffect(()=> {
    loadPosts()
  }, [page])
  useEffect(()=>{
    if (paymentActive !== null) {
        document.body.style.overflow='hidden'
    }
    else {
        document.body.style.overflow='auto'
    }
  }, [paymentActive])
  useEffect(()=> {  // for loading status bar
    if (status.length>0) {
      setRenderStatus(true)
      if (status!=='loading') {
        setTimeout(() => {
          setRenderStatus(false)
          setStatus('')
        }, 3000);
      }
    }
  }, [status])
  const { ref:loadRef, inView: loadInView} = useInView({
    threshold:0,
    triggerOnce:false
  });
  /*
  useEffect(() => {
    if (loadInView) {
        setPage((prev)=>prev+1)
    }
  }, [loadInView]);
  */
  return (
    <div className={`campaign-page`}>
        {(loading || campaignInfo === null)?
        <div className="create-campaign-loading-container"
        style={{marginTop:"20%"}}>
            <Oval
                color="#959595"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#454545"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
            <p className="settings-loading-text" style={{paddingTop:"1.25em", paddingLeft:".3em", textAlign:"center"}}>
                {`${(loading)?'Please wait a moment...':`Viewing all matching results`}`}
            </p>
        </div>:
        <>
        <AnimatePresence>     
        {(renderStatus && status.length > 0)&&  // gives request status
          <Popup status={status} onClose={()=>closePopup()}/>
        }
        </AnimatePresence>
        {<AnimatePresence>
            {(postActive!==null)&&
            <CreatePost 
                name={campaignInfo?campaignInfo.campaignname:"No Info"} 
                theme={campaignInfo?hexToRgba('#'+campaignInfo.theme.substring(0,6),0.6):"#5a5a5abd"}
                type={postActive}
                campaignid={campaignid}
                onChangeStatus={(e)=>setStatus(e)}
                onCloseStatus={()=>closePopup()}
                onClose={()=>onClosePost()}
            />}
            {/*<Payment charityid={paymentActive} edit={null} onClose={onClosePayment} onBlur={handleBlur}/>*/}
            </AnimatePresence>
        }
        {(campaignInfo)&&
        <div className={`header-blur`} style={{background:`linear-gradient(180deg, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.60)}, rgba(238, 77, 93, 0))`}}/>
        }
        <SideNavigation route={'campaign'}/>
        <motion.div 
            className={`campaign-page-container ${!isActive?(!firstRender)?'inactive-landing-container':'dim-landing-container':(!firstRender)?'active-container':''}`}
            initial={{opacity:0, y:15}}
            animate={controls}
            transition={{
              type: "tween",
              duration:.3
            }}>
            <div className="charity-header-container">
                <div style={{display:"flex", justifyContent:"center", height:"fit-content", alignItems:"center", gap:"2em", width:"fit-content"}}>
                  <span className="profile-image-wrapper" style={{backgroundColor:`${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.7)}`}} onClick={()=>handleTest()}>
                      <p className="profile-image-text">
                      {`${campaignInfo?campaignInfo.campaignname.charAt(0).toUpperCase():'P'}`}
                      </p>
                  </span>
                  <div className="profile-header-wrapper">
                      <p className="profile-header-text">
                          {`${campaignInfo?campaignInfo.campaignname:'No Charity Info'}`}
                      </p>
                      <div className="profile-link-container">
                          <AiOutlineLink className="link-icon"/>
                          <p className="profile-header-subtext">
                              link.springboard.app/{campaignInfo?campaignInfo.campaignname.replace(/\s+/g, '-').toLowerCase():''}
                          </p>
                      </div>
                  </div>
                </div>
            </div>
            <div className="manage-charity-container" style={{overflow:"hidden"}}>
                <div className="manage-charity-header-container">
                    <div style={{display:'flex', flexDirection:'column'}}>
                        <p className="manage-header-text">
                            Organization Profile
                        </p>
                        <p className="manage-header-subtext">
                            Learn about the impact of this organization.
                        </p>
                    </div>
                    <div className='campaign-page-donate-subcontainer'>
                        <span className={`campaign-page-like-icon-wrapper`}
                        onClick={()=>handlePost("create")}>
                            <FaPenNib className="charity-page-like-icon" style={{width:"1.25em", height:"1.25em"}}/>
                        </span>
                        <span className={`${(shouldArchive)?'campaign-page-like-icon-wrapper-alt':'campaign-page-like-icon-wrapper'}`}
                        onClick={()=>setShouldArchive(!shouldArchive)}>
                            <AiFillHeart className="charity-page-like-icon"/>
                        </span>
                        <span className='campaign-page-donate-button' onClick={()=>handlePost("create")}>
                            <div className="donate-page-link-button">
                                <p className="charity-confirm-checkout-text">
                                    {
                                    "Donate"
                                    }
                                </p>
                            </div>
                      </span>
                    </div>
                </div>
            </div>
            {(loading)?    
            <div className='loading-text-container' onClick={()=>handleTest()}>
                <p className="loading-text"> {`${(loading)?'Loading...':`Showing all matching results`}`} </p>
            </div>:
            <div className="campaign-details-container">
             
   
                    <div className='campaign-donations-wrapper'>
                      <div className='campaign-insights-wrapper '>
                        <div className="campaign-doughnut-container ">
                            <div className="charity-chart-wrapper">
                              <div className='chart-container'>
                                  <Doughnut data={data} options={doughOptions} className='charity-chart'/>
                                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                      <p className="charity-insight-figure-score">
                                          {`${campaignInfo?Math.round(parseFloat((campaignInfo.total/campaignInfo.goal)*100)):0}%`}
                                      </p>
                                      <p className={`charity-chart-details-text`}>
                                        Progress
                                      </p>
                                  </div>
                                </div>
                              </div>
                            <div className='charity-insights-subcontent'>
                                <div style={{display:'flex', flexDirection:'column', width:'100%',gap:'.25em', alignItems:'flex-end', paddingBottom:'1.25em', borderBottom:'1px dashed #555555'}}>
                                    <p className='charity-insights-subcontent-header'>
                                        Campaign Total
                                    </p>
                                    <p className='charity-insights-subcontent-text'>
                                    {`$${campaignInfo?parseFloat(campaignInfo.total).toLocaleString():0}`}
                                    </p>
                                </div>
                                <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'.25em', alignItems:'flex-end', paddingTop:'1.25em'}}>
                                    <p className='charity-insights-subcontent-header'>
                                        Crowdfunding Goal
                                    </p>
                                    <p className='charity-insights-subcontent-text'>
                                    {`$${campaignInfo?parseFloat(campaignInfo.goal).toLocaleString():0}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                   {
                    <div className='campaign-figure-wrapper'>
                       <div className='campaign-insights-wrapper-alt '>
                            <div className='campaign-insights-wrapper-row'>
                                <div className='campaign-insights-wrapper-item'
                                style={{backgroundColor:campaignInfo?hexToRgba('#'+campaignInfo.theme.substring(0,6),0.55):"transparent",
                                background:campaignInfo?`linear-gradient(36deg, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.55)} 84%, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.25)} 16%)`:
                                `linear-gradient(35deg, #5a5a5abf 80%, #2a2a2abf 20%`}}>
                                    <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'.875em', alignItems:'flex-start', marginLeft:"1.75em"}}>
                                        <p className='campaign-insights-subcontent-header'>
                                            Contribution Count
                                        </p>
                                        <div style={{display:"flex", justifyContent:"flex-start", gap:".7em", alignItems:"flex-end"}}>
                                            <p className='campaign-insights-subcontent-text'>
                                                {11}
                                            </p>
                                            <p className='campaign-insights-subcontent-subtext' style={{paddingBottom:".325em"}}>
                                               total donations
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='campaign-insights-wrapper-item'
                                style={{backgroundColor:campaignInfo?hexToRgba('#'+campaignInfo.theme.substring(0,6),0.25):"transparent",
                                background:campaignInfo?`linear-gradient(36deg, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.25)} 85%, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.55)} 15%)`:
                                `linear-gradient(35deg, #5a5a5abf 80%, #2a2a2abf 20%`}}>
                                    <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'.875em', alignItems:'flex-start', marginLeft:"1.75em"}}>
                                        <p className='campaign-insights-subcontent-header'>
                                            Archived By
                                        </p>
                                        <div style={{display:"flex", justifyContent:"flex-start", gap:".75em", alignItems:"flex-end"}}>
                                            <p className='campaign-insights-subcontent-text'>
                                                {4}
                                            </p>
                                            <p className='campaign-insights-subcontent-subtext' style={{paddingBottom:".325em"}}>
                                                active users
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='campaign-insights-wrapper-row'>
                                <div className='campaign-insights-wrapper-item'
                                style={{backgroundColor:campaignInfo?hexToRgba('#'+campaignInfo.theme.substring(0,6),0.25):"transparent",
                                background:campaignInfo?`linear-gradient(36deg, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.25)} 85%, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.55)} 15%)`:
                                `linear-gradient(35deg, #5a5a5abf 80%, #2a2a2abf 20%`}}>


                                    <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'.875em', alignItems:'flex-start', marginLeft:"1.75em"}}>
                                        <p className='campaign-insights-subcontent-header'>
                                            Average Views
                                        </p>
                                        <div style={{display:"flex", justifyContent:"flex-start", gap:".75em", alignItems:"flex-end"}}>
                                            <p className='campaign-insights-subcontent-text'>
                                                {29}
                                            </p>
                                            <p className='campaign-insights-subcontent-subtext' style={{paddingBottom:".325em"}}>
                                                per week
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='campaign-insights-wrapper-item'
                                style={{backgroundColor:campaignInfo?hexToRgba('#'+campaignInfo.theme.substring(0,6),0.55):"transparent",
                                background:campaignInfo?`linear-gradient(36deg, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.55)} 84%, ${hexToRgba('#'+campaignInfo.theme.substring(0,6),0.25)} 16%)`:
                                `linear-gradient(35deg, #5a5a5abf 80%, #2a2a2abf 20%`}}>
                                    <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'.875em', alignItems:'flex-start', marginLeft:"1.75em"}}>
                                        <p className='campaign-insights-subcontent-header'
                                       >
                                           Media Content
                                        </p>
                                        <div style={{display:"flex", justifyContent:"flex-start", gap:".7em", alignItems:"flex-end"}}>
                                            <p className='campaign-insights-subcontent-text'>
                                                {'0'}
                                            </p>
                                            <p className='campaign-insights-subcontent-subtext' style={{paddingBottom:".325em",}}>
                                                featured posts
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       </div>
                    </div>
                    }       
              </div>
            }
            <div className="campaign-details-container-low">
                <div className="campaign-donations-container">
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Featured Content
                        </p>
                        <p className="donation-details-subtext">
                            View this campaign's projects, updates, and more. 
                        </p>
                    </div>
                    <div className="campaign-post-list ">

                    {postList.map((item, index)=>(
                        <CampaignPost 
                            name={campaignInfo?campaignInfo.campaignname:"No Info"} 
                            theme={campaignInfo?hexToRgba('#'+campaignInfo.theme.substring(0,6),0.6):"#5a5a5abd"}
                            title={item.title}
                            description={item.description}
                            image={item.image}
                            link={item.link}
                            date={item.date}
                            campaignid={campaignid}
                            index={index}
                            onEdit={()=>handlePost("edit")}
                        />
                    ))}
                        <div ref={loadRef} style={{width:"95%"}}className='loading-text-container' onClick={()=>handleTest()}>
                            <p className="loading-text" style={{color:"transparent"}}>
                                 {`${(loading)?'Loading...':`Showing all matching results`}`} 
                            </p>
                        </div>
                    </div>
                </div>
                <div className='campaign-stats-container '>
                    <div className="donation-details-container">
                        <p className="donation-details-text">
                            Recent Donations
                        </p>
                        <p className="donation-details-subtext">
                            Explore the contributions made to this campaign in real time.
                        </p>
                    </div>
                    <div className="campaign-donations-list " >
                      <div className="campaign-donations-list-content">
                          <CharityDonation name={'Henry Zheng'} location={'Riverside, CA'} index={0}/>
                          <CharityDonation name={'An Truong'} location={'Irvine, CA'} index={1}/>
                          <CharityDonation name={'Thompson Nguyen'} location={'San Francisco, CA'} index={2}/>
                          <CharityDonation name={'Tim Wang'} location={'Los Angeles, CA'} index={3}/>
                          <CharityDonation name={'Jason Damasco'} location={'Sacramento, CA'} index={4}/>
                      </div>
                   </div>
                </div>
            </div>
        </motion.div>
        </>}
    </div>
  )
}
