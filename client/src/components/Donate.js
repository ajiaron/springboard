import React, {useState, useEffect, useRef, useCallback} from "react"
import './Donate.scss'
import Navbar from "./Navbar";
import Payment from "./Payment";
import Paypal from "./Paypal";
import {BsSearch} from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid';
import SideBar from "./SideBar";
import SideNavigation from "./SideNavigation";
import {GoArrowRight} from 'react-icons/go'
import Footer from "./Footer";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import { FiMail } from "react-icons/fi";
import {Elements} from '@stripe/react-stripe-js';
import {PaymentElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51NbpB6H1mJlHYnBWRw9lhg4y7T8j2ORYSxbpGqaZSOyL1rabFvBnOmKVnuQpd2c3la3R6Nj9LsXR9aLqrPNW0Owy00tGbZTXh2');

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
    const navigate = useNavigate()
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
    const handleCheckout = async() => {
        try {
            setLoading(true)
            const donations = donationList.map(item => ({
                donationid: uuidv4(),
                ownerid: userid,
                charityid:item.charityid,
                charityname:item.charityname,
                type:item.type,
                amount:item.amount,
                message:item.message,
                groupid:params.groupid,
                subkey:item.subkey,
                shareEmail:item.shareEmail,
                shareName:item.shareName,
                public:true     // TODO: implement private
            }));
            const res = await axios.post(`${connection}/api/postdonation`, { donations });
            if (res.data) {
                const result = await axios.delete(`${connection}/api/clearbasket`, {
                    data: {
                        ownerid:userid
                    }
                })
                if (result.data) {
                    console.log("basket cleared")
                    navigate(`/confirmation/${params.groupid}`)
                }
            }
        } catch(e) {
            console.log(e)
        }
        setLoading(false)
    }
    const options = {
        mode: 'payment',
        amount:total?Math.round(total*100):0,
        currency:'usd',
        appearance: {
            theme: 'flat',
            variables: {
              fontFamily: ' "Gill Sans", sans-serif',
              fontLineHeight: '1.5',
              color:'#aaa',
              borderRadius: '10px',
              colorBackground: '#252525',
              colorPrimaryText: '#a0a0a0'
            },
            rules: {
              '.Block': {
                backgroundColor: 'var(--colorBackground)',
                boxShadow: 'none',
                padding: '12px'
              },
              '.Input': {
                padding: '12px',
                color:'#eee'
              },
              '.Input:disabled, .Input--invalid:disabled': {
                color: 'lightgray'
              },
              '.Tab': {
                padding: '10px 12px 8px 12px',
                border: 'none'
              },
              '.Tab:hover': {
                border: 'none',
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
              },
              '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                border: 'none',
                backgroundColor: '#fff',
                boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
              },
              '.Label': {
                fontWeight: '500',
                color:'#aaa'
              }
            }
        }
    }
    return (
    <>
    {(!loading && total >0)&&
    <Elements stripe={stripePromise} options={options}>
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
                                    {`(${donationList.filter((item)=>item.message!==null&&item.message.length>0).length}) messages included`}
                                </p>
                            </div>
                        </div>
                        <div className="checkout-option-container">
                            <p className="checkout-option-header">
                                Payment Method
                            </p>
                            <div className="paypal-method-container">
                            <PaymentElement />
                            </div>
                        
                            {/*
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
*/}
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
                            <span className="confirm-checkout-button" onClick={()=>(loading)?console.log("loading"):handleCheckout()}>
                                <p className="confirm-checkout-text">
                                    {(loading)?'Processing...':
                                    'Confirm Order Checkout'
                                    }
                                </p>
                                <GoArrowRight className="arrow-checkout-icon"/>
                            </span>
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
    </Elements>}
    </>
    
    )
}
