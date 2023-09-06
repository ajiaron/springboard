import React, {useState, useEffect, useRef} from 'react'
import './Campaign.scss'
import {AiOutlineHeart,AiOutlineLink, AiFillHeart,AiFillEye} from 'react-icons/ai'
import {BiRepost,BiSolidEdit, BiSolidPencil, BiMessageSquareEdit} from 'react-icons/bi'
import {VscEye} from 'react-icons/vsc'
import {BsEye, BsStars} from 'react-icons/bs'
import {HiOutlineEye} from 'react-icons/hi'
import {FiEdit} from 'react-icons/fi'
import {FaRegEye,FaRegEdit} from 'react-icons/fa'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import {TiArrowRepeat} from 'react-icons/ti'
export default function CampaignPost({name, theme, title, description, image, link, date, campaignid, index, onEdit}) {
    const [isHovered, setIsHovered] = useState(false)
    const ref = useRef(null)
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

  return (
    <div className='campaign-post-container'>
        <div className='campaign-post-content'>
            <div className='campaign-post-content-container'>

         
                <div className='campaign-post-top-content'>
                    <div className='campaign-post-header'>
                
                        <span className='campaign-post-profile-image-wrapper'
                        style={{backgroundColor:theme}}>
                            <div className='campaign-post-profile-image'>
                                 <p className='campaign-post-profile-text'>
                                    {name.charAt(0).toUpperCase()}
                                 </p>
                            </div>
                        </span>
                        <span style={{display:"flex"}}>
                            <p className='campaign-post-header-text' 
                            style={{fontFamily:"Inter",transform:"translateY(-0.025em)", fontSize:"clamp(9px, 3vw, 14px)"}}>
                                @
                            </p>
                            <p className='campaign-post-header-text'>
                                {`${name}`}
                            </p>
                            <p className='campaign-post-header-subtext' 
                            style={{ paddingLeft:".8em", fontFamily:"Inter",color:"#6a6a6a",transform:"translateY(-0.0125em)"}}>
                                {`•`}
                            </p>
                            <p className='campaign-post-header-subtext' 
                            style={{  alignSelf:"center",
                                fontSize: "clamp(10px, 3vw, 14.5px)",paddingLeft:".8em", fontFamily:"Rubik", color:"#707070"}}>
                                {/*`5 days ago`*/
                                `${date}`}
                            </p>
                        </span>
                       
                       
                    </div>
                    <div className='campaign-post-caption-wrapper '>
                        <p className='campaign-post-caption-title'>
                            {(title&&title.length>0)?title:`Testing Posts`}
                        </p>
                        <p className='campaign-post-caption-subtext'>
                            {(description&&description.length>0)?description:`great day to do that amiright`}
                        </p>
                    </div>
                </div>

                <div className='campaign-post-image-wrapper'
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                    ref={ref}>
                    <div className='campaign-post-image'
                    style={{backgroundImage:`url(${image?image:'./assets/v9.png'})`}}>
                      
                    </div>
                    <AnimatePresence>
                        {(isHovered)&&
                        <motion.span onClick={()=>onEdit()}
                        className='campaign-post-edit-icon'
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        exit={{opacity:0}}
                        transition={{
                          type: "tween",
                          duration:.15
                        }}>
                            <BiSolidPencil className='edit-image-icon'/>
                        </motion.span>
                        }
                    </AnimatePresence>
                </div>
                <div className='campaign-post-footer' >
   
                    <div className='campaign-post-footer-item-wrapper' style={{marginRight:"auto", marginLeft:".5em", gap:".75em"}}>
                        <AiOutlineLink className='campaign-post-icon-views' style={{color:'#ccc'}}/>
                        <p className='campaign-post-caption-subtext' style={{color:"#ccc",fontWeight:"600", paddingTop:".0145em"}}>
                            Link
                        </p>
                    </div>

                    <div className='campaign-post-footer-item-wrapper'>
                        <VscEye className='campaign-post-icon-views'/>
                        <p className='campaign-post-caption-subtext' style={{color:"#ccc",fontWeight:"600", paddingTop:".0145em"}}>
                            64
                        </p>
                    </div>
                    <div className='campaign-post-footer-item-wrapper'>
                        <AiOutlineHeart className='campaign-post-icon'/>
                        <p className='campaign-post-caption-subtext' style={{color:"#ccc", fontWeight:"600", paddingTop:".0145em"}}>
                            8
                        </p>
                    </div>
                    <div className='campaign-post-footer-item-wrapper'>
                        <BiRepost className='campaign-post-icon-repost'/>
                        <p className='campaign-post-caption-subtext' style={{color:"#ccc", fontWeight:"600", paddingTop:".0145em"}}>
                            4
                        </p>
                    </div>
                </div>
            </div>
          
        </div>
    </div>
  )
}
