import React, {useState, useEffect, useRef} from 'react'
import './Campaign.scss'
import './CreatePost.scss'
import {AiOutlineHeart, AiOutlineLink, AiOutlinePlus, AiFillHeart, AiFillEye} from 'react-icons/ai'
import {BiRepost, BiSolidEdit, BiMessageSquareEdit, BiSolidPencil} from 'react-icons/bi'
import {VscEye} from 'react-icons/vsc'
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {BsEye, BsStars, BsFillPencilFill} from 'react-icons/bs'
import {HiOutlineEye} from 'react-icons/hi'
import {FiEdit} from 'react-icons/fi'
import {FaRegEye,FaRegEdit} from 'react-icons/fa'
import {TiArrowRepeat} from 'react-icons/ti'

export default function CreatePost({name, theme, onClose}) {
    const controls = useAnimation()
    const [showLink, setShowLink] = useState(false)
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [link, setLink] = useState("")
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    function handleClose() {
        onClose()
      }
    const modalRef = useRef(null);
    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            handleClose();
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    useEffect(() => {
        if (!loading) {
          controls.start({
            opacity: 1,
            y: 0
          });
        }
      }, [loading, controls]);
  return (
    <motion.div
        ref={modalRef}
        className='create-post-container'
        initial={{opacity:0, y:15}}
        animate={controls}
        exit={{opacity:0}}
        transition={{
          type: "tween",
          duration:.3
        }}
        >
        <div className='campaign-post-container'>
            <div className='create-post-wrapper'>
                <div className='create-post-content-container '>
                    <div className='create-post-top-content'>
                        <div className='create-post-header'>
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
                                style={{  alignSelf:"center", transform:'translateY(0.0em)',
                                    fontSize: "clamp(10px, 3vw, 14.5px)",paddingLeft:".8em", fontFamily:"Rubik", color:"#707070"}}>
                                    {`Today`}
                                </p>
                            </span>
                        </div>
                        <div className='create-post-caption-wrapper'>
                            <input className='create-post-caption-title-input'
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            placeholder='Untitled Post'>
                            </input>
                            <textarea id='post-description' className='create-post-caption-content' rows={5}
                                placeholder={'What would you like to talk about?'}
                            />
                        </div>
                    </div>
                    <div className='create-post-media-wrapper'>
                        <div className='campaign-create-post-image-wrapper'>
                            <div className='campaign-create-post-image'/>
                        </div>
                        <div className='campaign-create-post-edit-icon'>
                                <BiSolidPencil className='edit-image-icon'/>
                        </div>
                    </div>
                </div>
                <div className='create-post-footer ' >
                    <div className='create-post-footer-wrapper'>
                        <span
                        className={`campaign-post-footer-item-wrapper `} style={{marginRight:"auto", marginLeft:"0.125em", gap:"1em"}}>
                            <span style={{display:"flex", width:"100%", height:"auto", alignItems:"center",gap:".75em"}}
                            onClick={()=>setShowLink(!showLink)}>
                                <AiOutlineLink className='campaign-post-icon-views-alt' style={{color:'#ccc'}}/>
                                <p className={`campaign-post-caption-subtext post-footer-text`} style={{color:"#ccc",fontWeight:"600", paddingTop:".0145em"}}>
                                    Link
                                </p>
                            </span>
                            <AnimatePresence>
                                {(showLink)&&
                                <motion.div
                                    exit={{width:0}}
                                    transition={{
                                        type: "tween",
                                        duration:.2
                                    }}
                                    className='campaign-post-link-input-wrapper'>
                                    <motion.input className='campaign-post-link-input'
                                        initial={{width:0}}
                                        animate={{width:"auto"}}
                                        exit={{width:0}}
                                        transition={{
                                            type: "tween",
                                            duration:.2
                                        }}
                                        value={link}
                                        placeholder={"Enter a site URL"}
                                        onChange={(e)=>setLink(e.target.value)}/>
                                </motion.div>
                                }
                            </AnimatePresence>
                 
                        </span>
                        <div className='campaign-post-footer-item-wrapper' style={{ backgroundColor:theme, gap:".65em"}}>
                            <AiOutlinePlus className='campaign-post-icon-views' style={{color:'#eee'}}/>
                            <p className='campaign-post-caption-subtext' style={{color:"#eee",fontWeight:"600", paddingTop:".0145em"}}>
                                Update
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
    </motion.div>
  )
}
