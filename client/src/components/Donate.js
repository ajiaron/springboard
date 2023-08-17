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
import {useStripe, useElements, Elements, PaymentElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51NbpB6H1mJlHYnBWRw9lhg4y7T8j2ORYSxbpGqaZSOyL1rabFvBnOmKVnuQpd2c3la3R6Nj9LsXR9aLqrPNW0Owy00tGbZTXh2');

const CheckoutForm = ({testStripe, secret, loading, url, toggleStripe, onCheckout, onCancel}) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate()  
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    function handleCheckout(e) {
        onCheckout()
        handleSubmit(e)
    }
    const handleSubmit = async (event) => {
        setConfirmLoading(true)
        event.preventDefault();
        if (!stripe || !elements || !secret) {
          return;
        } 
        onCheckout()
        const result = elements.submit();
       // console.log(result)
        const {error} = await stripe.confirmPayment({
          elements,
          clientSecret: secret, 
          confirmParams: {
            return_url: url,
          },
        });
        if (error) {
          setErrorMessage(error.message);
          onCancel()
          console.log(error)
        } else {
            console.log("successful payment")
        }
        setConfirmLoading(false)
      };
    return (
        <>
        <div className="checkout-option-container">
            <p className="checkout-option-header">
                Payment Method
            </p>
            <div className="stripe-payment-container">
                <div className="payment-method-container">
                <PaymentElement />
                </div>
            </div>
            <div className="checkout-footer-wrapper">
                <div className="checkout-terms-footer">
                        <p className="terms-text">
                            {/*By confirming your order you agree to the */}
                            Click on the bolded text to toggle and test
                        </p>
                        <span onClick={()=>toggleStripe()}
                        className={(testStripe)?"terms-bold-switch-container-alt":"terms-bold-switch-container"}>
                            <p className={`terms-bold-text${testStripe?'-alt':''}`}>
                            {/* Terms {'&'} Conditions */}
                            {(testStripe)?'Stripe Payouts':'Standard Checkout'}
                            </p>
                        </span> 
                </div>
                <div className="checkout-confirm-container">
                    <span className="confirm-checkout-button" onClick={(e)=>(loading || confirmLoading)?console.log("loading"):(testStripe && stripe)?
                    handleSubmit(e):onCheckout()}>
                        <p className="confirm-checkout-text">
                            {(loading || confirmLoading)?'Processing...':
                            'Confirm Order Checkout'
                            }
                        </p>
                        <GoArrowRight className="arrow-checkout-icon"/>
                    </span>
                </div>
            </div>
        </div>
        </>
    )
}
const CartItem = ({basketid, charityid, charityname, type, subkey, amount, index}) => {
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
    const [secret, setSecret] = useState(null)
    const [testStripe, setTestStripe] = useState(true)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const destination = process.env.REACT_APP_ENV === 'production'?'https://demo-springboard.netlify.app':'http://localhost:3000'
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
    function handleTest() {
        console.log(params)
    }
    useEffect(()=> {
        const handleIntent = async(total) => {
            try {
                if (total) {
                    const res = await axios.post(`${connection}/api/createintent`,
                    {amount:Math.round(total*100), userid:userid, accountid:'acct_1NfVgoQhl7ws1DDA'})
                    if (res.data) {
                        setSecret(res.data.client_secret)
                    }
                    console.log(res.data.client_secret)
                }
            } catch(e) {
                console.log(e)
            }
            setLoading(false)
        }
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
                    handleIntent(parseFloat(res.data.map((item)=>item.amount).reduce((a, b) => a + b, 0))
                    .toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}))
                }
            } catch(e) {
                console.log(e)
            }
        }
        loadDonation()
    }, [])
    const cancelCheckout = async() => {
        try {
            const res = await axios.delete(`${connection}/api/canceldonations`,
            {data: {
                groupid:params.groupid
            }})
            if (res) {
                console.log("removed bad donations")
            }
        } catch(e) {
            console.log(e)
        }
    }
    const handleCheckout = async() => {
        try {
          //  setLoading(true)
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
                console.log("donations successfully posted to database")
            }
        } catch(e) {
            console.log(e)
        }
     //   setLoading(false)
    }
  

    const options = {
        mode: 'payment',
        amount:total?Math.round(total*100):0,
        currency:'usd',
        client_secret:secret,
        automatic_payment_methods: {
            enabled: true,
        },
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
                color: '#aaa'
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
    {(!loading && total > 0)&&
    <Elements stripe={stripePromise} options={options}>
        <div className="donate-page">
            <SideNavigation route={'donate'}/>
            <div className="donate-page-container">
                <div className={`checkout-container `}>
                    <div className={`checkout-content `}>
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
                      
                      <CheckoutForm 
                        testStripe={testStripe} 
                        secret={secret} 
                        url={`${destination}/confirmation/${params.groupid}`}
                        toggleStripe={()=>setTestStripe(!testStripe)}
                        onCheckout={()=>handleCheckout()}
                        onCancel = {()=>cancelCheckout()}
                      />
                     
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
