import React from 'react'
import './Campaign.scss'
import {AiOutlineHeart,AiOutlineLink, AiFillHeart,AiFillEye} from 'react-icons/ai'
import {BiRepost,BiSolidEdit,BiMessageSquareEdit} from 'react-icons/bi'
import {VscEye} from 'react-icons/vsc'
import {BsEye, BsStars} from 'react-icons/bs'
import {HiOutlineEye} from 'react-icons/hi'
import {FiEdit} from 'react-icons/fi'
import {FaRegEye,FaRegEdit} from 'react-icons/fa'
import {TiArrowRepeat} from 'react-icons/ti'
export default function CampaignPost({name, theme}) {
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
                            style={{fontFamily:"Inter",transform:"translateY(-0.05em)", fontSize:"clamp(9px, 3vw, 14px)"}}>
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
                                {`5 days ago`}
                            </p>
                        </span>
                        <span className='campaign-post-edit-icon-wrapper'>
                            <BiMessageSquareEdit className='campaign-post-edit-icon'/>
                        </span>
                       
                    </div>
                    <div className='campaign-post-caption-wrapper'>
                        <p className='campaign-post-caption-title'>
                            Testing Posts 
                        </p>
                        <p className='campaign-post-caption-subtext'>
                            great day to do that amiright
                        </p>
                    </div>
                </div>

                <div className='campaign-post-image-wrapper'>
                    <div className='campaign-post-image'>

                    </div>
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
