import React, {useState, useEffect, useRef, useCallback} from "react"
import './Donate.scss'
import './Cart.scss'
import Navbar from "./Navbar";
import Payment from "./Payment";
import Paypal from "./Paypal";
import {BsSearch} from 'react-icons/bs'
import SideBar from "./SideBar";
import {GoArrowRight} from 'react-icons/go'
import SideNavigation from "./SideNavigation";
import Footer from "./Footer";
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import { FiMail } from "react-icons/fi";


export default function Cart() {
  return (
    <div className="cart-page">
        <SideNavigation route={'dashboard'}/>
        <div className="cart-page-container">

                <div className={`cart-page-wrapper`}>
                    <p className="cart-page-header-text">
                        Your Donation Basket
                    </p>
                    
                    <div className="cart-page-content-container">
                        <div className={`cart-page-content`}>
                            <div className="cart-page-header-container">

                                <div className="cart-header-wrapper" >
                                <div style={{width:"85%"}}>
                                    <p className="cart-page-header-title">
                                        Recipient Organization
                                    </p>
                                </div>
                                <div style={{width:"15%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    <p className="cart-page-header-title">
                                        Amount
                                    </p>
                                </div>
                
                                </div>
                            </div>
                            <div className={`cart-page-item-list`}>
                                <div className="cart-page-item first-item">
                                    <div className="cart-page-item-info">
                                    
                                            <p className="cart-page-item-title">
                                                American Heart Association
                                            </p>
                                            <p className="cart-page-item-text">
                                                SKU: XYZ-1364570
                                            </p>   
                                        
                                            <div className={`cart-page-item-type-wrapper profile-healthcare`}>
                                                <p className="profile-donation-item-type-text">
                                                    Healthcare
                                                </p>
                                            </div>
                                    
                                    </div>
                                    <div className="cart-page-item-price">
                                        <p className="item-price-text">
                                            {`$${parseFloat(32).toFixed(2)}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="cart-page-item">
                                    
                                </div>
                                <div className="cart-page-item">
                                    
                                </div>
                                <div className="cart-page-item">
                                    
                                </div>
                                <div className="cart-page-item">
                                    
                                    </div>
                            </div>
                        </div>





                        <div className="cart-checkout-container">
                            <div className="cart-checkout-header-container">
                                <p className="cart-checkout-header-text">
                                    Your Total
                                </p>
                            </div>
                            <div className="cart-checkout-subcontainer">
                                <p className="cart-page-item-title">
                                    4 Items
                                </p>
                                <div style={{display:'flex', flexDirection:'row', gap:'.65em'}}>
                                    <p className="cart-page-item-checkout-text">
                                        Order Total:
                                    </p>
                                    <p className="cart-page-item-checkout-price">
                                        {` $${parseFloat(32).toFixed(2)}`}
                                    </p>
                                </div>
                        
                            </div>
                            <div className="cart-checkout-confirm-container">
                            
                                <div className="checkout-cart-page-confirm-container">
                                    <Link className="confirm-checkout-button" to={'#'}>
                                        <p className="confirm-checkout-text">
                                            {
                                            'Confirm Checkout'
                                            }
                                        </p>
                                        <GoArrowRight className="arrow-basket-icon"/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
           
                </div>

         
        </div>
    </div>
  )
}
