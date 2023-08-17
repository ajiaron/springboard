import React, {useState, useEffect, useRef, useCallback} from "react"
import './Donate.scss'
import './Confirmation.scss'
import './Cart.scss'
import Navbar from "./Navbar";
import Payment from "./Payment";
import Paypal from "./Paypal";
import {BsSearch} from 'react-icons/bs'
import SideBar from "./SideBar";
import {GoArrowRight} from 'react-icons/go'
import SideNavigation from "./SideNavigation";
import Footer from "./Footer";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import { BsCheck2,BsCheckLg,BsFillPatchCheckFill} from 'react-icons/bs'
import {LiaTimesSolid} from 'react-icons/lia'
import {FaTimesCircle,FaArrowsRotate} from 'react-icons/fa'
import {BiEdit} from 'react-icons/bi'
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { Oval } from 'react-loader-spinner'
import {useStripe, useElements, Elements, PaymentElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51NbpB6H1mJlHYnBWRw9lhg4y7T8j2ORYSxbpGqaZSOyL1rabFvBnOmKVnuQpd2c3la3R6Nj9LsXR9aLqrPNW0Owy00tGbZTXh2');

const ConfirmationStatus = ({loading, confirmed, onHandleBasket}) => {
    const stripe = useStripe()
    const [message, setMessage] = useState(null);
    const [status, setStatus] = useState(null)
    const [confirmLoading, setConfirmLoading] = useState(true)
    useEffect(() => {
        setConfirmLoading(true)
        if (!stripe) {
          return;
        }
        // Retrieve the "payment_intent_client_secret" query parameter appended to
        // your return_url by Stripe.js
        const clientSecret = new URLSearchParams(window.location.search).get(
          'payment_intent_client_secret'
        );
        // Retrieve the PaymentIntent
        stripe
          .retrievePaymentIntent(clientSecret)
          .then(({paymentIntent}) => {
            setStatus(paymentIntent.status)
            switch (paymentIntent.status) {
              case 'succeeded':
                onHandleBasket()
                setMessage('Thank you for your donation!');
                break;
              case 'processing':
                onHandleBasket()
                setMessage("We'll update you when payment is received.");
                break;
              case 'requires_payment_method':
                setMessage('Please try another payment method.');
                break;
              default:
                setMessage('Something went wrong.');
                break;
            }
            setConfirmLoading(false)
          });
      }, [stripe]);

    return (
        <>
        <div className="confirmation-header-container">
            {(loading || confirmLoading)?
            <div className="confirmation-check-container">
           <Oval
                color="#959595"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#454545"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
            </div>
            :
            <motion.div
                className="confirmation-check-container"
                initial={{ scale: 0}}
                animate={{ scale: 1}}
                transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}> 
                {(confirmed)?
                <BsFillPatchCheckFill className="confirmation-check-patch"/>:
                <FaTimesCircle className="confirmation-check-patch-alt"/>
                }
            </motion.div>
            }
            {(!loading && !confirmLoading)&&
            <p className="confirmation-header-text">
                {(status === "succeeded")?
                'Thank you for your donation!':
                (status === "processing")?
                "We'll update you once your payment is received.":
                (status==="requires_payment_method")?
                "Please try another payment method.":
                'Your order could not be processed.'}
            </p>
            }
            
            {(!loading && !confirmLoading)?(status === "succeeded")?
            <p className="confirmation-header-subtext">
                You'll recieve an email confirmation once your charities have recieved your order.
            </p>:
            (status === "processing")?
            <p className="confirmation-header-subtext">
                Your order is currently being processed, which may take a moment to complete.
            </p>:
            <div style={{display:"flex"}}>
                <p className="confirmation-header-subtext">
                    {
                    `Please verify your payment information, or `
                    }
                </p>
                <span className="contact-subtext"
                onClick={(e)=>{
                    window.location.href = 'mailto:aaronjiang3942@gmail.com';
                    e.preventDefault()
                }}>
                    &nbsp;
                    {
                    `contact`
                    }
                    &nbsp;
                </span>
                <p className="confirmation-header-subtext">
                    {
                    `support if the problem persists.`
                    }
                </p>
            </div>:
            <p className="confirmation-header-subtext">
                {
                `Processing your order, this may take a moment...`
                }
            </p>
            }
        </div>
        </>
    )
}
const CartItem = ({basketid, charityid, charityname, type, subkey, amount, message, shareName, shareEmail, index, count}) => {

    return (
        <div className={`${index===0?'confirmation-first-item':
                            index===count-1?'confirmation-last-item':'confirmation-page-item'}`}>
            
            <div className="confirmation-page-item-info">
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
            <div className="confirmation-page-item-details">
                <div style={{display:"flex", justifyContent:"flex-start", gap:".5em"}}>
                    <p className="cart-page-item-text">
                        {`Includes message`}
                    </p>   
                    {(message.length > 0)?
                    <BsCheckLg className="cart-check-icon"/>
                    :
                    <LiaTimesSolid className="cart-cross-icon"/>
                    }
                </div> 
                <div style={{display:"flex", justifyContent:"flex-start", gap:".5em"}}>
                    <p className="cart-page-item-text">
                        {`Share name`}
                    </p>  
                    {(shareName)?
                    <BsCheckLg className="cart-check-icon"/>:
                    <LiaTimesSolid className="cart-cross-icon"/>
                    }
                </div>
                <div style={{display:"flex", justifyContent:"flex-start", gap:".5em"}}>
                    <p className="cart-page-item-text">
                        {`Share email`}
                    </p>   
                    {(shareEmail)?
                     <BsCheckLg className="cart-check-icon"/>:
                    <LiaTimesSolid className="cart-cross-icon"/>
                    }
                </div> 
            </div>
            <div className={`confirmation-page-item-price`}>
            
                <p className="item-price-text">
                    {`$${parseFloat(amount).toLocaleString(undefined,
                    {minimumFractionDigits:2, maximumFractionDigits:2})}`}
                </p>
                
            </div>
        </div>
    )
}
export default function Confirmation() {
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [basketList, setBasketList] = useState([])
    const [total, setTotal] = useState(0)
    const [emptyList, setEmptyList] = useState([0,1,2,3,4])
    const [reload, setReload] = useState(false)
    const [confirmed, setConfirmed] = useState(true)
    const navigate = useNavigate()
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
    function handleTest() {
        console.log(basketList)
    }
    const handleBasket = async() => {
        const result = await axios.delete(`${connection}/api/emptybasket`, {
            data: {
                groupid:params.groupid
            }
        })
        if (result && params.groupid && params.groupid.length > 0) {
            console.log("basket cleared")
            const res = await axios.put(`${connection}/api/confirmdonations`,
            {groupid:params.groupid})
            if (res) {
                console.log("donations confirmed")
            } else {
                console.log("donations not confirmed")
            }
        }
    }
    useEffect(()=> {
        const loadBasket = async() => {
            setLoading(true)
            try {
                const res = await axios.get(`${connection}/api/getdonationbatch`,{
                    params: {
                        groupid: params.groupid
                    }
                })
                if (res.data) {
                    setBasketList(res.data)
                    setTotal(parseFloat(res.data.map((item)=>item.amount).reduce((a, b) => a + b, 0))
                    .toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}))
                }
            } catch(e) {
                console.log(e)
            }
        }
        loadBasket()
        setLoading(false)
        console.log("reloaded")
    }, [reload, params])
  return (
    <Elements stripe={stripePromise}>
    <div className="confirmation-page">
        <SideNavigation route={'confirmation'}/>
   
        <div className="confirmation-page-container">
            {
                <ConfirmationStatus loading={loading} confirmed={confirmed} onHandleBasket={()=>handleBasket()}/>
            }
            <div className={`confirmation-page-item-list`}>
            {  
                (!loading)&&
                    <>
                    {
                    basketList.slice(0,3).map((item, index)=> (
                        <CartItem 
                        basketid={item.basketid} charityid={item.charityid} 
                        charityname={item.charityname} type={item.type} 
                        subkey={item.subkey} amount={item.amount} 
                        message={item.message} shareName={item.shareName} 
                        shareEmail={item.shareEmail} index={index} count={basketList.length}
                        />
                    ))
                    }
                </>
            }
            
                <div className='confirmation-footer-container ' style={{paddingTop:".7em"}}>
                    {(basketList.length > 3)?
                    <p className="confirmation-footer-text"> {`+ ${basketList.length-3} more items`} </p>
                    :
                    <div style={{display:"flex"}}>
                        <p className="confirmation-footer-text"> Order Total: &nbsp; </p>
                        <p className="confirmation-footer-text" style={{color:'#ddd'}}>${`${total}`}</p>
                    </div>}
                </div>
            
            </div>               
        </div>
    </div>
    </Elements>
  )
}
