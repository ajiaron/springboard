import React, {useState, useEffect, useRef, useContext} from "react"
import './Payment.scss'
import Navbar from "./Navbar";
import axios from "axios";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
import {GoArrowRight} from 'react-icons/go'
import { BsCheck2,BsCheckLg,BsFillPatchCheckFill} from 'react-icons/bs'
import {AiOutlineArrowRight} from 'react-icons/ai'
import {LiaTimesSolid} from 'react-icons/lia'
import { debounce } from "lodash";
import Paypal from "./Paypal";
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components'


export default function Payment({charityid, edit, onClose, onBlur}) {
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const connection = process.env.REACT_APP_API_URL
    const [value, setValue] = useState(10)
    const [message, setMessage] = useState('')
    const modalRef = useRef(null);
    const [shareName, setShareName] = useState(true)
    const [shareEmail, setShareEmail] = useState(true)
    const [shouldClose, setShouldClose] = useState(false)
    const [customValue, setCustomValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const [charityInfo, setCharityInfo] = useState([])
    const [basketid, setBasketId] = useState(edit!==null?edit:uuidv4())
    const [firstRender, setFirstRender] = useState(true)
    const [finished, setFinished] = useState(false)
    const [shouldScroll, setShouldScroll] = useState(false)
    const PaymentOption = styled.span`
        background-color: #151515;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        filter:brightness(${props=> props.primary?'1.25':'1'})
        &:hover {
            filter:brightness(${props=> props.primary?'1':'1.25'})
        }
    `;
    function handleTest() {
        console.log(basketid)
        console.log(userid)
        console.log(charityid)
        console.log(edit!==null?charityInfo[0].charityname:charityInfo[0].charity_name)
        console.log(edit!==null?charityInfo[0].type:charityInfo[0].type1)
        console.log(value)
        console.log(message)
        console.log('share email:', shareEmail)
        console.log('share name:', shareName)
    }
    function onConfirm() {
        setFinished(!finished)
        setFirstRender(false)
        setTimeout(()=> {
          setShouldScroll(!shouldScroll)
        }, 250)
      }
    const handleConfirm = () => {
        handleTest()
        axios.post(`${connection}/api/pushbasket`, 
        {basketid:uuidv4(), userid:localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0, charityid:charityid, charityname:charityInfo[0].charity_name,
        type:charityInfo[0].type1, amount:value, message:message, shareEmail:shareEmail, shareName:shareName})
        .then((res)=> {
            if (res) {
                console.log("added to basket")
                onConfirm()
            }
        })
        .catch((e)=> {
            console.log(e)
        })
    }
    const handleChanges = () => {
        axios.put(`${connection}/api/editbasketitem`, 
        {basketid:edit, amount:value, message:message, shareEmail:shareEmail, shareName:shareName})
        .then((res)=> {
            if (res) {
                console.log("item successfully changed")
                handleClose()
            }
        })
        .catch((e)=> {
            console.log(e)
        })
    } 
    useEffect(()=> {
        const loadCharity = async() => {
            setLoading(true)
            try {
                const res = await axios.get(`${connection}/api/getcharity/${charityid}`)
                setCharityInfo(res.data)
            }
            catch(e) {
                console.log(e)
            } 
            setLoading(false)
        }
        const loadBasketItem = async() => {
            setLoading(true)
            try {
                const res = await axios.get(`${connection}/api/getbasketitem`,{
                    params: {
                        basketid:edit
                    }
                })
                setCharityInfo(res.data)
                setValue(res.data[0].amount)
                setMessage(res.data[0].message)
                setShareName(res.data[0].shareName)
                setShareEmail(res.data[0].shareEmail)
            } catch(e) {
                console.log(e)
            }
            setLoading(false)
        }
        if (edit!==null) {
            loadBasketItem()
        } else {
            loadCharity()  
        }
    }, [charityid, edit])
    useEffect(()=> {
        if (value) {
            setCustomValue(0)
        }
    }, [value])
    useEffect(()=> {
        if (customValue) {
            setValue(0)
        }
    }, [customValue])
    function handleClose() {
        setShouldClose(true)
        onBlur()
        setTimeout(()=> {
            onClose()
        }, 300)
    }
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
    
    return (
        
        <div className={`payment-screen-wrapper ${shouldClose?'payment-screen-active':'payment-screen-inactive'}`} ref={modalRef}>
            <span className="exit-container" onClick={()=>handleClose()}>
                <LiaTimesSolid className="payment-exit-icon"/>
            </span>
            <div className="payment-inner-container">
                <>
                {(!shouldScroll)&&
                <div className={`payment-inner-wrapper ${firstRender?'':finished?'payment-inner-wrapper-inactive':'payment-inner-wrapper-active'}`}>
                    <div className='register-header-container'>
                        <p className='payment-inner-text'>
                        Make your impact.
                        </p>
                        <p className='payment-inner-subtext'>
                        {`Donate to ${loading ? 'Loading...' : (charityInfo.length > 0 ? edit!==null?charityInfo[0].charityname:charityInfo[0].charity_name : 'No charity info')}`}
                        </p>
                    </div>
                    
                    <div className='payment-inner-content'>
                        <div className='payment-inner-button-container'>
                            <span className='payment-inner-option-button'>
                                <PaymentOption primary={(value===10)} onClick={()=>setValue(10)}>
                                    <p className={`${value==10?'payment-inner-option-text-alt':'payment-inner-option-text'}`}>
                                        $10
                                    </p>
                                </PaymentOption>
                            </span>
                            <span className='payment-inner-option-button'>
                                <PaymentOption primary={(value===25)} onClick={()=>setValue(25)}>
                                    <p className={`${value==25?'payment-inner-option-text-alt':'payment-inner-option-text'}`}>
                                        $25
                                    </p>
                                </PaymentOption>
                            </span>
                            <span className='payment-inner-option-button'>
                                <PaymentOption primary={(value===50)} onClick={()=>setValue(50)}>
                                    <p className={`${value==50?'payment-inner-option-text-alt':'payment-inner-option-text'}`} >
                                        $50
                                    </p>
                                </PaymentOption>
                            </span>
                            <span className='payment-inner-option-button'>
                                <PaymentOption primary={(value===100)} onClick={()=>setValue(100)}>
                                    <p className={`${value==100?'payment-inner-option-text-alt':'payment-inner-option-text'}`}>
                                        $100
                                    </p>
                                </PaymentOption>
                            </span>
                        </div>

                        <div className="payment-inner-option-footer">
                            <p className="payment-inner-option-footer-text">
                                or
                            </p>
                        </div>

                        <div className='payment-inner-fields-container '> 
                            <div className='payment-inner-field-wrapper'>
                                <p className='payment-inner-input-text'>
                                    Choose an amount:
                                </p>
                                <div className='payment-inner-input-wrapper'>                
                                    $
                                    <input type="number" name="customdonate" id="customdonate"
                                        onChange={(e)=> setValue(e.target.value)}
                                        value={(edit&&loading?'processing...':value)}
                                        className="payment-inner-input" />
                                    <p style={{color:'#656565'}}>
                                        USD
                                    </p>
                                </div>
                            </div>

                            <div className='payment-inner-input-container'>
                                <p className='payment-inner-input-text'>
                                    Share a message or dedication:
                                </p>
                                <div className='payment-inner-message-input-wrapper'>
                                    <textarea className='payment-inner-message-input'
                                    onChange={(e)=>setMessage(e.target.value)}
                                    value={(edit&&loading)?"Retrieving your message../":message}
                                    placeholder='Write something for someone...'/>
                                </div>
                            </div>

                            <div className='payment-inner-field-wrapper' style={{paddingTop:'1em'}}>
                                <p className='payment-inner-input-text'>
                                    {`For the organization:`}
                                </p>
                                <div className='payment-inner-button-container' style={{paddingTop:"0em",transform:"translateY(.575em)"}}>
                                    <span className={`payment-inner-option-share-button`} onClick={()=>setShareName(!shareName)}
                                  >
                                        <div className={`payment-inner-option-content-alt ${shareName?'payment-inner-option-content-on':''}`}>
                                                Share your name
                                            {(shareName)?
                                                <BsCheckLg className="payment-check-icon"/>
                                                :null
                                            }
                                        </div>
                                    </span>
                                    <span className={`payment-inner-option-share-button`} onClick={()=>setShareEmail(!shareEmail)}
                                  >
                                        <div className={`payment-inner-option-content-alt ${shareEmail?'payment-inner-option-content-on':''}`}>
                                            Share your email
                                            {(shareEmail)?
                                                <BsCheckLg className="payment-check-icon"/>
                                                :null
                                            }
                                        </div>
                                    </span>
                                </div>
                            </div>
                            {/*
                            <Link className='payment-inner-confirm-button' 
                              to={(loading)?'#':`/donate/${charityid}/${charityInfo[0].charity_name}/${value}`}
                            >
                                <p className='confirm-register-text'>
                                    {` ${(loading)?'Loading...':'Add to Donation Basket'}`}
                                </p>
                                <GoArrowRight className="register-icon"/>
                            </Link>
                            */}
                            <span className='payment-inner-confirm-button' onClick={()=>edit!==null?handleChanges():handleConfirm()}>
                                <p className='confirm-register-text'>
                                    {` ${(loading)?'Loading...':(edit!==null)?'Edit Donation Basket':'Add to Donation Basket'}`}
                                </p>
                                <GoArrowRight className="register-icon"/>
                            </span>
                        </div>
                    </div>
                </div>
                }
                {(shouldScroll)&&
                    <div className={`confirmation-inner-wrapper ${firstRender?'':finished?'confirmation-container-active':'confirmation-container-inactive'}`}>
                      <div className='register-header-container'>
                          <p className='payment-inner-text'>
                            Your donation is confirmed!
                          </p>
                          <p className='payment-inner-subtext'>
                          {`Continue browsing, or review your basket for checkout.`}
                          </p>
                      </div>
                      
                      <div className='payment-inner-content'>
                         <div className="confirmation-check-inner-container">
                            <BsFillPatchCheckFill className="confirmation-check-inner"/>
                         </div>
                          <div className='payment-inner-fields-container '> 
                    
  
                            
                              {/*
                              <Link className='payment-inner-confirm-button' 
                                to={(loading)?'#':`/donate/${charityid}/${charityInfo[0].charity_name}/${value}`}
                              >
                                  <p className='confirm-register-text'>
                                      {` ${(loading)?'Loading...':'Add to Donation Basket'}`}
                                  </p>
                                  <GoArrowRight className="register-icon"/>
                              </Link>
                              */}
                              <Link className='navigate-inner-confirm-button'
                              to={`/cart`}>
                                  <p className='confirm-register-text'>
                                      {` Review your basket`}
                                  </p>
                                  <GoArrowRight className="register-icon"/>
                              </Link>
                          </div>
                      </div>
                  </div>
                }
                </>
            </div>
        </div>
    
    )
}