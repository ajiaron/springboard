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
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import { FiMail } from "react-icons/fi";

const CartItem = ({basketid, charityid, charityname, type, subkey, amount, index}) => {
    const [shouldDelete, setShouldDelete] = useState(false)

    return (
        <div className={`cart-item`}>
            <div className="donate-page-item-info">
                <p className="cart-page-item-title">
                    {charityname}
                </p>
                <p className="cart-page-item-text">
                    {`SKU: ${subkey}`}
                </p>   
                <div className={`cart-page-item-type-wrapper cart-${type.toLowerCase()}`}>
                    <p className="cart-donation-item-type-text">
                        {`${type==='Human'?'Rights & Services':type}`}
                    </p>
                </div>
            </div>
            <div className={`donate-page-item-price`}>

                <p className="item-price-text" style={{marginLeft:'auto', marginRight:'auto'}}>
                    {`$${parseFloat(amount).toLocaleString(undefined,
                    {minimumFractionDigits:2, maximumFractionDigits:2})}`}
                </p>
                
            </div>
        </div>
    )
}
export default function Donate() {
    const params = useParams()
    const [donationList, setDonationList] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
    function handleTest() {
        console.log(params)
    }
    useEffect(()=> {
        const loadDonation = async() => {
            setLoading(true)
            try {
                const res = await axios.get(`${connection}/api/getbasket`, {
                    params: {
                        ownerid:userid
                    }
                })
                if (res.data) {
                    setDonationList(res.data)
                    setTotal(parseFloat(res.data.map((item)=>item.amount).reduce((a, b) => a + b, 0))
                    .toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}))
                }
            } catch(e) {
                console.log(e)
            }
        }
        loadDonation()
        setLoading(false)
    }, [])


    return (
        <div className="donate-page">
            <SideNavigation route={'donate'}/>
            <div className="donate-page-container">
                <div className={`checkout-container`}>
                    <div className={`checkout-content`}>
                        <div className="checkout-header-container">
                            <p className="cart-header-text">
                                Order Checkout
                            </p>
                        </div>
                        
                        <div className="checkout-details-container">
                            <p className="checkout-details-header">
                                Donation Details
                            </p>
                            <div className="dedication-container ">
                                <p className="dedication-text">
                                    {`(${donationList.length}) Donation Items`}
                                </p>
                    
                                <p className="dedication-text">
                                    {`Total Contribution: $${total}`}
                                </p>
                            </div>
                            <p className="checkout-details-header mentions-container">
                                Mentions
                            </p>
                            <div className="dedication-container">
                                <p className="dedication-text">
                                    {`(3) messages included`}
                                </p>
                            </div>
                        </div>
                        <div className="checkout-option-container">
                            <p className="checkout-option-header">
                                Payment Method
                            </p>
                            <div className="paypal-method-container">
                            <Paypal 
                                groupid={params?params.groupid:null}
                                names={donationList&&donationList.map((item)=>item.charityname)}
                                amount={total!==0&&total}
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
                                    groupid={params?params.groupid:null}
                                    names={donationList&&donationList.map((item)=>item.charityname)}
                                    amount={total!==0&&total}
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
                            <p className="cart-header-text" style={{color:"#151515"}}>
                                {'Items'}
                            </p>
                        </div>
                        <div className={`cart-item-list`}>
                        {  
                            (loading)?    
                            <div className='loading-text-container' style={{paddingTop:".5em"}}>
                                <p className="loading-text"> {`${(loading)?'Loading...':`Showing all items in your basket`}`} </p>
                            </div>:
                             <>
                             {
                                donationList.map((item, index)=> (
                                    <CartItem 
                                    basketid={item.basketid} charityid={item.charityid} 
                                    charityname={item.charityname} type={item.type} 
                                    subkey={item.subkey} amount={item.amount} 
                                    index={index}
                                    />
                                ))
                             }

                            </>
                        }
                        </div>
                    </div>
                </div>
            </div>        
        </div>
    )
}
