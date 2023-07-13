import React, {useState, useEffect, useRef} from "react"
import './Payment.scss'
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

export default function Payment({title}) {
    const [value, setValue] = useState()
    const [message, setMessage] = useState('')
    return (
 
            <div className="payment-screen-wrapper">
                <div className="payment-header-container">
                    <p className="payment-header-text">
                        Your Donation Details
                    </p>
                    <p className="payment-header-subtext">
                        American Heart Association
                    </p>
                </div>
                <div className="payment-options-container">
    
                    <div className="payment-option-top-row">
                        <div className="payment-option">
                            <p className="payment-option-text">
                                $1
                            </p>
                        </div>
                        <div className="payment-option">
                            <p className="payment-option-text">
                                $5
                            </p>
                        </div>
                        <div className="payment-option">
                            <p className="payment-option-text">
                                $10
                            </p>
                        </div>
                    </div>
                    <div className="payment-option-bottom-row">
                        <div className="payment-option">
                            <p className="payment-option-text">
                                $20
                            </p>
                        </div>
                        <div className="payment-option">
                            <p className="payment-option-text">
                                $50
                            </p>
                        </div>
                        <div className="payment-option">
                            <p className="payment-option-text">
                                $100
                            </p>
                        </div>
                        <div className="payment-option">
                            <p className="payment-option-text">
                                $200
                            </p>
                        </div>
                    </div>
                    
                </div>
                <div className="payment-custom-container">
                    <p className="custom-container-text">
                        Choose a custom amount:
                    </p>
             
                        <input type="text" name="ownerName" id="ownerName"
                            onChange={(e)=> setValue(e.target.value)}
                            value={value}
                            placeholder={`Enter an amount to donate...`}
                            className="custom-input-container" />
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
              
               <div className="payment-confirm-container">
                    <span className="payment-confirm-button">
                        <p className="payment-confirm-text">
                            Confirm Your Donation
                        </p>
                    </span>
                </div>
            </div>

    )
}