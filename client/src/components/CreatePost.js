import React, {useState, useEffect, useRef} from 'react'
import './Campaign.scss'
import './CreatePost.scss'
import {AiOutlineHeart, AiOutlineLink, AiOutlinePlus, AiFillHeart, AiFillEye} from 'react-icons/ai'
import {BiRepost, BiSolidEdit, BiMessageSquareEdit, BiSolidImageAdd, BiSolidPencil} from 'react-icons/bi'
import {VscEye} from 'react-icons/vsc'
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {BsEye, BsStars, BsImageAlt, BsImage} from 'react-icons/bs'
import {HiOutlineEye} from 'react-icons/hi'
import {FiEdit} from 'react-icons/fi'
import Popup from "./Popup";
import {FaRegEye,FaRegEdit} from 'react-icons/fa'
import {TiArrowRepeat} from 'react-icons/ti'
import {Storage} from 'aws-amplify'

export default function CreatePost({name, theme, type, onClose}) {
    const controls = useAnimation()
    const [showLink, setShowLink] = useState(false)
    const [title, setTitle] = useState("")
    const [selectedImage, setSelectedImage] = useState(null);
    const [fileobj, setFileobj] = useState(null)
    const fileInput = useRef(null);
    const [link, setLink] = useState("")
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
    const [renderStatus, setRenderStatus] = useState(false)
    function handleClose() {
        onClose()
      }
      const closePopup = () => {
        setRenderStatus(false)
        setStatus(false)
      }
    
    const handleButtonClick = () => {
        fileInput.current.click();
    };
    
    const dataURLtoBlob = (dataurl) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };
    const handleSubmit = async() => {
        const blob = dataURLtoBlob(selectedImage);
        // Convert Blob to File
        setStatus("loading")
        const newFile = new File([blob], fileobj.name, { type: blob.type });
        try {
          // Upload the file to S3
          const result = await Storage.put(newFile.name, newFile, {
            contentType: newFile.type,
          });
          setStatus("success")
          console.log('Successfully uploaded file:', result);
        } catch (err) {
          console.error('Error uploading file:', err);
        }
    } 
    const handleImageChange = async (e) => {
        setFileobj(e.target.files[0]);
        const file = e.target.files[0]
        const reader = new FileReader();
    
        reader.onloadend = async () => {
          setSelectedImage(reader.result);
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
      };
    
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
    <AnimatePresence>     
        {(renderStatus && status.length > 0)&&  // gives request status
          <Popup status={status} onClose={()=>closePopup()}/>
        }
      </AnimatePresence>
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
                    {(type==="edit" || selectedImage)&&
                    <div className='create-post-media-wrapper'>
                        <div className='campaign-create-post-image-wrapper'>
                            <div className='campaign-create-post-image'
                            style={{backgroundImage:`url(${selectedImage!==null?selectedImage:'./assets/v9.png'})`}}/>
                        </div>
                        <div className='campaign-create-post-edit-icon'>
                                <BiSolidPencil className='edit-image-icon'/>
                        </div>
                    </div>
                    }
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
                        <span onClick={()=>(fileobj && selectedImage)?handleSubmit():console.log("not yet")}
                        className='campaign-post-footer-item-wrapper' style={{ backgroundColor:theme, gap:".65em"}}>
                            <AiOutlinePlus className='campaign-post-icon-views' style={{color:'#eee'}}/>
                            <p className='campaign-post-caption-subtext' style={{color:"#eee",fontWeight:"600", paddingTop:".0145em"}}>
                                {type==="edit"?'Update':"Create"}
                            </p>
                        </span>

                        <div className='campaign-post-footer-item-wrapper'  style={{ gap:".5em" }}>
                            <VscEye className='campaign-post-icon-views-allow'/>
                            <p className='campaign-post-caption-subtext' style={{color:"#ccc",fontWeight:"600", paddingTop:".0145em"}}>
                                Allow
                            </p>
                        </div>

                        <span className='campaign-post-footer-item-wrapper' onClick={handleButtonClick}
                        style={{ paddingLeft:".825em", gap:".75em" }}>
                            <BsImage className='campaign-post-image-icon'/>
                            <input className='input-image' ref={fileInput}
                            type="file" accept="image/*" onChange={handleImageChange} />
                            <p className='campaign-post-caption-subtext' style={{color:"#ccc",fontWeight:"600", paddingTop:".0145em"}}>
                                Image
                            </p>
                        </span>
                        
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
  )
}
