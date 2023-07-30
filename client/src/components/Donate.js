import React, {useState, useEffect, useRef, useCallback} from "react"
import './Donate.scss'
import Navbar from "./Navbar";
import Payment from "./Payment";
import Paypal from "./Paypal";
import {BsSearch} from 'react-icons/bs'
import SideBar from "./SideBar";
import SideNavigation from "./SideNavigation";
import {GoArrowRight} from 'react-icons/go'
import Footer from "./Footer";
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import { FiMail } from "react-icons/fi";

export default function Donate() {
    const params = useParams()
    const [loading, setLoading] = useState(true)
    function handleTest() {
        console.log(params)
    }

    return (
        <div className="donate-page">
            <SideNavigation route={'donate'}/>
            <div className="donate-page-container">
        
                <div className={`checkout-container`}>
                    <div className={`checkout-content`}>
                        <div className="checkout-header-container">
                            <p className="cart-header-text">
                                Checkout
                            </p>
                        </div>
                        <div className="checkout-details-container">
                            <p className="checkout-details-header">
                                Dedications
                            </p>
                            <div className="dedication-container">
                                <p className="dedication-text">
                                   {`${params.charityname}`}<br/>
                                   {`$${params.amount} USD`}
                                </p>
                            </div>
                            <p className="checkout-details-header mentions-container">
                                Mentions
                            </p>
                            <div className="dedication-container">
                                <p className="dedication-text">
                                    call me abusive the way i beat the odds
                                </p>
                            </div>
                        </div>
                        <div className="checkout-option-container">
                            <p className="checkout-option-header">
                                Payment Method
                            </p>
                            <div className="paypal-method-container">
                            <Paypal 
                                charityid={params.charityid}
                                name={params.charityname}
                                amount={params.amount}
                                type={'paypal'}
                            />
                            </div>
                            <div className="checkout-option-footer">
                                <p className="checkout-option-footer-text">
                                    or
                                </p>
                            </div>
                            
                            <div className="card-method-container">
                                <Paypal 
                                    charityid={params.charityid}
                                    name={params.charityname}
                                    amount={params.amount}
                                    type={'card'}
                                />
                            </div>
                          
                        </div>
                        <div className="checkout-terms-footer">
                                <p className="terms-text">
                                    By confirming your order you agree to the 
                                </p>
                                <p className="terms-bold-text">
                                    Terms {'&'} Conditions
                                </p>
                           
                        </div>
                        <div className="checkout-confirm-container">
                            <Link className="confirm-checkout-button" to={'#'}>
                                <p className="confirm-checkout-text">
                                    {
                                    'Confirm Order Checkout'
                                    }
                                </p>
                                <GoArrowRight className="arrow-checkout-icon"/>
                            </Link>
                        </div>
                     
                    </div>
                
                </div>
                <div className={`cart-container`}>
                    <div className={`cart-content`}>
                        <div className="cart-header-container">
                            <p className="cart-header-text" >
                                {'Basket'}
                            </p>
                        </div>
                        <div className={`cart-item-list`}>
                            <div className="cart-item first-item">
                                <div className="cart-item-info">
                                 
                                        <p className="cart-item-title">
                                            {params.charityname}
                                        </p>
                                        <p className="cart-item-text">
                                            SKU: XYZ-1364570
                                        </p>   
                                  <div className="cart-item-type-wrapper">
                                     <p className="cart-item-type-text">
                                        Education
                                    </p>
                                  </div>
                                </div>
                                <div className="cart-item-price">
                                    <p className="item-price-text">
                                        {`$${parseFloat(params.amount).toFixed(2)}`}
                                    </p>
                                </div>
                            </div>
                            {/* 
                            <div className="cart-item">
                                
                            </div>
                            <div className="cart-item">
                                
                            </div>
                            <div className="cart-item">
                                
                            </div>
                            */}
                        </div>
                    </div>
                </div>
            </div>        
        </div>
    )
}
