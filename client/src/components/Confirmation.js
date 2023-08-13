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
import {FaTimesCircle} from 'react-icons/fa'
import {BiEdit} from 'react-icons/bi'
import { FiMail } from "react-icons/fi";

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
    const navigate = useNavigate()
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
    const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'

    function handleTest() {
        console.log(basketList)
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
    }, [reload])
  return (
    <div className="confirmation-page">
        <SideNavigation route={'confirmation'}/>
        <div className="confirmation-page-container">
            <div className="confirmation-header-container">
                    <span className="confirmation-check-container" onClick={()=>handleTest()}>
                        <BsFillPatchCheckFill className="confirmation-check-patch"/>
                    </span>
                <p className="confirmation-header-text">
                    Thank you for your donation!
                </p>
                
                <p className="confirmation-header-subtext">
                    You'll recieve an email confirmation once your charities have recieved your order.
                </p>

            </div>

            <div className={`confirmation-page-item-list`}>
            {  
                (loading)?    
                <div className='loading-text-container' style={{paddingTop:".5em"}}>
                    <p className="loading-text"> {`${(loading)?'Loading...':`Showing all items in your basket`}`} </p>
                </div>:
                    <>
                    {
                    basketList.map((item, index)=> (
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
            {(basketList.length > 3)&&
                <div className='confirmation-footer-container' style={{paddingTop:".65em"}}>
                    <p className="loading-text"> {`+ ${basketList.length-3} more items`} </p>
                </div>
            }
            </div>               


        </div>
    </div>
  )
}
