import React, { useState, useEffect, useRef, useContext } from "react"
import './CreateCampaign.scss'
import Notification from "./Notification";
import Popup from "./Popup";
import SideNavigation from "./SideNavigation";
import axios from "axios";
import { GoArrowRight } from 'react-icons/go'
import { BsCheck2, BsCheckLg, BsFillPatchCheckFill } from 'react-icons/bs'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { LiaTimesSolid } from 'react-icons/lia'
import { Link, useNavigate, useParams } from "react-router-dom";
import { Oval } from 'react-loader-spinner'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

const Dropdown = ({categories, category, onSelect, onToggle}) => {
  const [selected, setSelected] = useState(category&&category.length>0?category:categories[categories.length-1])
  const [isActive, setIsActive] = useState(false)
  function toggleDropdown() {
    onToggle()
    setIsActive(!isActive)
  }
  function handleSelect(e) {
    onSelect(e)
    setSelected(e)
    toggleDropdown()
  }
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const handleMouseEnter = (item) => {
      setIsHovered(item);
  };
  const handleMouseLeave = (item) => {
      setIsHovered(item);
  };

  const container = {
    hidden: { height: 0 },
    show: {
      height: "auto",
      transition: {
        staggerChildren: 0.25
      }
    }
  }

  return (
    <div className={`create-campaign-share-button `}>
      <span style={{ transitionDelay: (isActive)?".8s":"0"}}
        onMouseEnter={()=>handleMouseEnter(selected)} 
        onMouseLeave={()=>handleMouseLeave(selected)}
        className={`create-inner-option-content-main ${'option-hovered'} ${isActive?'top-option':''}${selected?'create-inner-option-content-on':''}`}
        onClick={()=>toggleDropdown()}>
          {selected}
          {
              <BsCheckLg className="payment-check-icon"/>
          }
      </span>


    
      <AnimatePresence>
      {(isActive)&&
        <motion.ul
         className="category-dropdown-list"
         initial="hidden"
         animate="show"
         exit={{height:"0"}}
         variants={container}
         //exit={{height:'0'}}
         transition={{
           type: "tween",
           duration:.2
         }}
        >
       
          {
          categories.filter((item)=>item!==selected).map((item,index)=> (
            <motion.li 
            variants={item}
            initial={{opacity:'0'}}
            animate={{opacity:"1"}}
            exit={{y:(index===0)?0:-10, opacity:'0',
            transition:{duration:.1, delay:.1*(7-index)}}}
            transition={{
              type: "tween",
           //   duration:.2,
              delay:index*0.1
            }}
            ref={ref}
            onMouseEnter={()=>handleMouseEnter(item)} 
            onMouseLeave={()=>handleMouseLeave(item)}
            className={`create-inner-option-content-item 
            ${index===categories.length-2?"bottom-option":''} ${isHovered===item?"option-hovered":''} 
            ${selected===item?'create-inner-option-content-on':''}`}
            onClick={()=>handleSelect(item)}>
                {item}
                {(selected===item)?
                    <BsCheckLg className="payment-check-icon"/>
                    :null
                }
            </motion.li>
          ))
      }
        </motion.ul>
        }
        </AnimatePresence>

    </div>

  )
}

export default function CreateCampaign() {
  const {campaignid} = useParams()
  const controls = useAnimation()
  const navigate = useNavigate()
  const id = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
  const name = localStorage.getItem("username")?JSON.parse(localStorage.getItem("username")):''
  const firstname = localStorage.getItem("firstname")?JSON.parse(localStorage.getItem("firstname")):''
  const email = localStorage.getItem("email")?JSON.parse(localStorage.getItem("email")):''
  const connection = process.env.REACT_APP_API_URL
  const categories = ["Entertainment", "Technology", "Healthcare", "Environment", "Community", "Athletics", "Just For Fun"]
  const [category, setCategory] = useState(null)
  const [campaignData, setCampaignData] = useState(null)
  const [firstRender, setFirstRender] = useState(true)
  const [loading, setLoading] = useState(false)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [shareEmail, setShareEmail] = useState('')
  const [shareName, setShareName] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState(0)
  const [themeColor, setThemeColor] = useState('151515')
  const [shouldNotify, setShouldNotify] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [dropdownActive, setDropdownActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [renderStatus, setRenderStatus] = useState(false)
  function handleTest() {
    console.log(campaignName, goal, description, shareEmail, shareName)
   //setShouldScroll(!shouldScroll)
   //setShouldNotify(true)
  }
  const handleSubmit = async() => {
    setStatus('loading')
    try {
      const res = await axios.put(`${connection}/api/confirmcampaign`,
      {ownerid:id, campaignid:campaignid, campaignname:campaignName, 
       goal:goal, description:description, category:category, theme:themeColor})
      if (res.data) {
        console.log("successfully confirmed campaign")
        setStatus('success')
      }
    } catch(e) {
      console.log(e)
      setStatus('error')
      setErrorMessage(e.message)
    }
  }
  const isValidColor = (input) => {
    const PARTIAL_HEX_REGEX = /^[A-Fa-f0-9]{0,8}$/;
    return PARTIAL_HEX_REGEX.test(input);
  };
  const closePopup = () => {
    setRenderStatus(false)
    setStatus(false)
  }

  const handleChange = (e) => {
    if (isValidColor( e.target.value)) {
      setThemeColor( e.target.value);
    } else {
      setThemeColor(themeColor)
    }
  };
  function handleClose() {
    setFirstRender(false)
    setShouldNotify(false)
    setErrorMessage("")
    setPrompt('')
  }
  useEffect(()=> {  // for loading status bar
    if (status.length>0) {
      setRenderStatus(true)
      if (status === "success") {
        navigate((campaignData&&campaignData.verified)?`/campaign/${campaignid}`:`/${name}`)
      }
      if (status!=='loading') {
        setTimeout(() => {
          setRenderStatus(false)
          setStatus('')
        }, 3000);
      }
    }
  }, [status])
  useEffect(() => {
    if (!loading) {
      controls.start({
        opacity: 1,
        y: 0
      });
    }
  }, [loading, controls]);
  useEffect(()=>{
      if (shouldNotify !== null) {
          document.body.style.overflow='hidden'
      }
      else {
          document.body.style.overflow='auto'
      }
   }, [shouldNotify])
   useEffect(()=> {
    if (prompt.length > 0) {
      setShouldNotify(true)
    }
   }, [prompt])
  useEffect(()=> {
    if (errorMessage.length > 0) {
      setPrompt("error")
    }
  }, [errorMessage])
  useEffect(()=> {
    const loadCampaign = async() => {
      try {
        setLoading(true)
        const res = await axios.get(`${connection}/api/getcampaign/${campaignid}`)
        if (res.data) {
          setCampaignData(res.data[0])
          setCampaignName(res.data[0].campaignname)
          setGoal(res.data[0].goal)
          setDescription(res.data[0].description)
          setShareName(res.data[0].sharename)
          setThemeColor(res.data[0].theme)
          setCategory(res.data[0].category)
          setLoading(false)
        } else {
          setStatus("error")
        }
      } catch(e) {
        console.log(e)
      }
    }
    loadCampaign()

  }, [])
  return (
    <motion.div 
    initial={{paddingBottom:0}}
    animate={{paddingBottom:(dropdownActive)?"10em":"0"}}
    exit={{paddingBottom:0}}
    transition={{
      type:"tween",
      duration:.2
    }}
    className="create-campaign-container ">
      {<AnimatePresence>
      {
          (shouldNotify)&&
          <Notification prompt={prompt} message={errorMessage} onClose={()=>handleClose()}/>
      }
      </AnimatePresence>
      }
      <AnimatePresence>     
        {(renderStatus && status.length > 0)&&  // gives request status
          <Popup status={status} onClose={()=>closePopup()}/>
        }
      </AnimatePresence>
      {<SideNavigation route={"createcampaign"}/>}
      <div className={`create-campaign-content ${shouldNotify?(!firstRender)?'inactive-landing-container':'dim-landing-container':(!firstRender)?'active-container':''}`}>
        {(loading || campaignData===null)?
          <div className="create-campaign-loading-container"
          style={{marginTop:"20%"}}>
          <Oval
               color="#959595"
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
      
          <AnimatePresence>
            {(!shouldScroll)&&
            <motion.div className="create-campaign-inner-wrapper"
            initial={{opacity:0, y:15}}
            animate={controls}
            transition={{
              type: "tween",
              duration:.3
            }}>
                <div className='create-campaign-header-container'>
                    <p className='create-campaign-inner-text'>
                    {`${(campaignData&&campaignData.verified)?'Update':'Register'} your campaign.`}
                    </p>
                    <p className='create-campaign-inner-subtext'>
                    {`Fill out a couple details and you'll be ready to accept payouts. `}
                    </p>
                </div>
                <div className='create-campaign-inner-content '>
                    <div className='create-campaign-fields-container '> 
                        <div className='create-campaign-field-wrapper'>
                            <p className='payment-inner-input-text' style={{color:'#ccc'}}>
                                Enter the display name of your campaign:
                            </p>
                            <div className='create-campaign-inner-input-wrapper' style={{minHeight:"10%"}}>                
                                <input type="text" id="campaignname"
                                    onChange={(e)=> setCampaignName(e.target.value)}
                                    value={campaignName}
                                    placeholder={"Enter your campaign name..."}
                                    className="create-campaign-inner-input" />
                            </div>
                        </div>
                        <div className='create-campaign-field-wrapper'>
                            <p className='payment-inner-input-text' style={{color:'#ccc'}}>
                                Set your crowdfunding goal:
                            </p>
                            <div className='create-campaign-inner-input-wrapper'>                
                                <p style={{color:'#656565', paddingBottom:".05em", paddingRight:".1em"}}>
                                    $
                                </p>
                                <input type="number" name="customdonate" id="customdonate"
                                    onChange={(e)=> setGoal(e.target.value)}
                                    value={goal}
                                    placeholder={''}
                                    className="create-campaign-inner-input" />
                                <p style={{color:'#656565'}}>
                                    USD
                                </p>
                            </div>
                        </div>

                        <div className='create-campaign-inner-input-container'>
                            <p className='payment-inner-input-text' style={{color:'#ccc'}}>
                                Give a short description of your campaign:
                            </p>
                            <div className='payment-inner-message-input-wrapper'>
                                <textarea className='payment-inner-message-input'
                                onChange={(e)=>setDescription(e.target.value)}
                                value={description}
                                placeholder='Give a quick description...'/>
                            </div>
                        </div>

                        <div className='create-campaign-field-wrapper'>
                          <div className="create-campaign-field-wrapper-alt">

                      
                            <div className="create-campaign-field-alt">
                              <p className='payment-inner-input-text' style={{color:'#ccc'}}>
                                  {`Campaign Category:`}
                              </p>
                              <div className='create-inner-button-container ' style={{paddingTop:"0em",transform:"translateY(.25em)"}}>
                                 <Dropdown categories={categories} category={category} onSelect={(selected)=> setCategory(selected)} onToggle={()=>setDropdownActive(!dropdownActive)}/>
                              </div>
                            </div>

                            <div className="create-campaign-field-alt">
                              <p className='payment-inner-input-text' style={{width:"90%", marginLeft:"auto", color:"#ccc"}}>
                                  {`Theme Color:`}
                              </p>
                              <div className='create-campaign-inner-button-container' style={{paddingTop:"0em",transform:"translateY(.25em)"}}>
                                  <span className={`create-campaign-color-button`}>
                                      <input type="color" className={`create-campaign-color-option`} value={'#'+themeColor} onChange={(e)=>setThemeColor(e.target.value.slice(1))}
                                      style={{transform:"translateX(.75em)",
                                      backgroundColor:`#${isValidColor(themeColor)?themeColor:'151515'}`}}/>
                                      <div style={{transform:"translateX(1em)",display:"flex", justifyContent:"center", alignItems:"center", marginLeft:"auto", paddingRight:".875em"}}>
                                        <p className="create-campaign-color-text">
                                            {'#'}
                                        </p>
                                        <input className="create-campaign-color-text-input"
                                        onChange={handleChange}
                                        placeholder={'151515'}
                                        value={themeColor}/>
                                      </div>
                                  </span>
                                
                              </div>
                            </div>
                          </div>
                        </div>
                        {
                        <AnimatePresence>
                          <motion.span 
                          style={{pointerEvents:(dropdownActive)?"none":"auto"}}
                          initial={{y:0, opacity:1}}
                          animate={{opacity:(!dropdownActive)?1:0}}
                          exit={{opacity:1}}
                          transition={{
                            type: "tween",
                            duration:.2,
                            delay:(!dropdownActive)?.8:0
                          }}
                          className='create-campaign-confirm-button' onClick={()=>handleSubmit()}>
                              <p className='confirm-register-text'>
                                  {`${(loading)?'Loading...':'Create Campaign'}`}
                              </p>
                              <GoArrowRight className="register-icon"/>
                          </motion.span>
                        </AnimatePresence>
                        }
                    </div>
                </div>
            </motion.div>

            }
          </AnimatePresence>

        }
   
      </div>

    </motion.div>
  )
}
