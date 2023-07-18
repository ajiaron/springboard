import React, {useState, useEffect, useRef} from "react"
import './Payment.scss'
import Navbar from "./Navbar";
import axios from "axios";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
import {GoArrowRight} from 'react-icons/go'
import {AiOutlineArrowRight} from 'react-icons/ai'
import {LiaTimesSolid} from 'react-icons/lia'
import { debounce } from "lodash";
import Paypal from "./Paypal";
import styled from 'styled-components'


export default function Payment({charityid, onClose}) {
    const [value, setValue] = useState(1)
    const [message, setMessage] = useState('')
    const modalRef = useRef(null);
    const [selected, setSelected] = useState(false)
    const [customValue, setCustomValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const [charityInfo, setCharityInfo] = useState([])
    function handleTest() {
        console.log(charityid)
    }
    const PaymentOption = styled.span`
        border: ${props => props.primary?'1px solid rgb(148, 86, 183)':'1px solid #ccc'};
        background-color: ${props=>props.primary?'rgb(148, 86, 183)':'#1a1a1a'};
        width: 4.5em;
        border-radius: 18px;
        height: 2.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s linear;
        text-align: center;
        &:hover {
            background-color: rgb(148, 86, 183);
            border: 1px solid rgb(148, 86, 183);
        }
    `;
    const handleInputChange = (event) => {
        const value = event.target.value;
        if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
          setCustomValue(value);
        }
    };
    useEffect(()=> {
        const loadCharity = async() => {
            setLoading(true)
            try {
                const res = await axios.get(`http://localhost:3000/donate/getcharity/${charityid}`)
                setCharityInfo(res.data)
            }
            catch(error) {
                console.log(error)
            } 
            setLoading(false)
        }
        loadCharity()  
    }, [charityid])
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
    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    
    return (
            <div className="payment-screen-wrapper" ref={modalRef}>
                <div className="payment-header-container">
                    <span className="exit-container" onClick={()=>onClose()}>
                        <LiaTimesSolid className="exit-icon"/>
                    </span>
                    <p className="payment-header-text">
                        Your Donation Details
                    </p>
                    <p className="payment-header-subtext">
                    {loading ? 'Loading...' : (charityInfo.length > 0 ? charityInfo[0].charity_name : 'No charity info')}
                    </p>
                </div>
                <div className="payment-options-container">
                    <div className="payment-option-top-row">
                        <PaymentOption primary={(value===1)&&!customValue} onClick={()=>setValue((value!==1)?1:0)}>
                            <p className="payment-option-text">
                                $1
                            </p>
                        </PaymentOption>
                        <PaymentOption primary={(value===5)&&!customValue} onClick={()=>setValue((value!==5)?5:0)}>
                            <p className="payment-option-text">
                                $5
                            </p>
                        </PaymentOption>
                        <PaymentOption primary={(value===10)&&!customValue} onClick={()=>setValue((value!==10)?10:0)}>
                            <p className="payment-option-text">
                                $10
                            </p>
                        </PaymentOption>
                        <PaymentOption primary={(value===20)&&!customValue} onClick={()=>setValue((value !== 20)?20:0)}>
                            <p className="payment-option-text">
                                $20
                            </p>
                        </PaymentOption>
                    </div>
                    <div className="payment-option-bottom-row">
                        <PaymentOption primary={(value===50)&&!customValue} onClick={()=>setValue((value!==50)?50:0)}>
                            <p className="payment-option-text">
                                $50
                            </p>
                        </PaymentOption>
                        <PaymentOption primary={(value===100)&&!customValue} onClick={()=>setValue((value!==100)?100:0)}>
                            <p className="payment-option-text">
                                $100
                            </p>
                        </PaymentOption>
                        <PaymentOption primary={(value===200)&&!customValue} onClick={()=>setValue((value!==200)?200:0)}>
                            <p className="payment-option-text">
                                $200
                            </p>
                        </PaymentOption>
                        <PaymentOption primary={(value===500)&&!customValue} onClick={()=>setValue((value!==500)?500:0)}>
                            <p className="payment-option-text">
                                $500
                            </p>
                        </PaymentOption>
                    </div>
                    
                </div>
                <div className="payment-custom-container">
                    <p className="custom-container-text">
                        Choose a custom amount:
                    </p>
                    <span className="currency-input">
                        $
                        <input type="number" name="customdonate" id="customdonate"
                            onChange={(e)=> handleInputChange(e)}
                            value={(customValue===0)?'':customValue}
                            placeholder={`Enter an amount to donate...`}
                            className="custom-input-container" />
                    </span>
                </div>
                <div className="message-custom-container">
                    <p className="custom-container-text">
                        Leave a message if you'd like:
                    </p>
             
                        <textarea type="text" name="ownerName" id="ownerName"
                            onChange={(e)=> setMessage(e.target.value)}
                            value={message}
                            placeholder={`Share a comment...`}
                            className="message-input-container" />
                </div>
        
                {/*
                    <Paypal 
                    charityid={charityid}
                    name={charityInfo.length > 0 ? charityInfo[0].charity_name : 'No charity info'}
                    amount={customValue>0?customValue:value}
                  />*/
                }
                {
                <div className="payment-confirm-container">
                    <Link className="payment-confirm-button" 
                    to={(loading)?'#':`/donate/${charityid}/${charityInfo[0].charity_name}/${customValue>0?customValue:value}`}>
                        <p className="payment-confirm-text">
                            {
                            `${loading?'Loading...':'Confirm Your Donation'}`
                            }
                        </p>
                        <GoArrowRight className="arrow-icon"/>
                    </Link>
                </div>
                }
            </div>
    )
}