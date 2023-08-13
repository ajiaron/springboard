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
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import {LiaTimesSolid} from 'react-icons/lia'
import {FaTimesCircle} from 'react-icons/fa'
import {BiEdit} from 'react-icons/bi'
import { BsCheck2,BsCheckLg } from 'react-icons/bs'
import { FiMail } from "react-icons/fi";

const CartItem = ({basketid, charityid, charityname, type, subkey, amount, message, shareName, shareEmail, index, onEdit, onDelete}) => {
    const [shouldDelete, setShouldDelete] = useState(false)
    function preDelete() {
        setShouldDelete(!shouldDelete)
    }
    function handleRemove() {
        onDelete(basketid)
        setShouldDelete(!shouldDelete)
    }
    return (
        <div className={`${shouldDelete?'cart-page-item-delete':index===0?'cart-first-item':'cart-page-item'}`}>
            <div className="cart-page-item-icons">
                <span style={{width:'fit-content', height:'fit-content'}} 
                onClick={()=>onEdit(charityid, basketid)}>
                    <BiEdit className="cart-page-edit-icon"/>
                </span>
                <span style={{width:'fit-content', height:'fit-content'}}
                onClick={()=>preDelete()}>
                    <FaTimesCircle className={`${shouldDelete?'cart-page-delete-icon-alt':'cart-page-delete-icon'}`}/>
                </span>
            </div>
            <div className="cart-page-item-info">
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
            <div className="cart-page-item-details">
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
            <div className={`cart-page-item-price`}>
                {
                    (shouldDelete)?
                    <span className="delete-cart-item-container" onClick={()=>handleRemove()}>
                        Remove
                    </span>:
                <p className="item-price-text">
                    {`$${parseFloat(amount).toLocaleString(undefined,
                    {minimumFractionDigits:2, maximumFractionDigits:2})}`}
                </p>
                }
            </div>
        </div>
    )
}

export default function Cart() {
  const [basketList, setBasketList] = useState([])
  const [total, setTotal] = useState(0)
  const [emptyList, setEmptyList] = useState([0,1,2,3,4])
  const [loading, setLoading] = useState(true)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [editActive, setEditActive] = useState(null)
  const [shouldEdit, setShouldEdit] = useState(null)
  const [groupid, setGroupId] = useState(uuidv4())
  const [reload, setReload] = useState(false)
  const navigate = useNavigate()
  const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0
  const connection = process.env.REACT_APP_ENV === 'production'?'https://springboard.gift':'http://api.springboard.gift:3000'
  const handleBlur = () => {
    setIsActive(true)
  }
  const handleEdit = (charityid, basketid) => {
    setFirstRender(false)
    setEditActive(charityid)
    setShouldEdit(basketid)
    setIsActive(false)
}
  const handleConfirm = async() => {
    setConfirmLoading(true)
    try {
        const res = await axios.put(`${connection}/api/confirmbasket`, 
        {ownerid:userid, groupid:groupid})
        if (res.data) {
            console.log("basket has been confirmed")
            navigate(`/donate/${groupid}`)
        } 
    } catch(e) {
        console.log(e)
    }
    setConfirmLoading(false)
  }

  const onClosePayment = () => {
    setEditActive(null)
    setReload(!reload)
  }
  const handleDelete= (basketid) => {
    axios.delete(`${connection}/api/deletebasketitem`, {data:{basketid:basketid}})
    .then((res)=> {
        setReload(!reload)
    })
    .catch((e)=> {
        console.log(e)
    })
  }
  useEffect(()=> {
    const loadBasket = async() => {
        setLoading(true)
        try {
            const res = await axios.get(`${connection}/api/getbasket`,{
                params: {
                    ownerid: userid
                }
            })
            if (res.data) {
                console.log()
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
  useEffect(()=>{
    if (editActive !== null) {
        document.body.style.overflow='hidden'
    }
    else {
        document.body.style.overflow='auto'
    }
  }, [editActive])
  function handleTest() {
    if (basketList) {
        console.log(basketList)
        console.log(total)
    }
  }
  return (
    <div className="cart-page">
      {
          (editActive!==null)&&<Payment charityid={editActive} edit={shouldEdit} onClose={onClosePayment} onBlur={handleBlur}/>
      }
        <SideNavigation route={'basket'}/>
        <div className={`cart-page-container ${!isActive?(!firstRender)?'inactive-landing-container':'dim-landing-container':(!firstRender)?'active-container':''}`}>
            <div className={`cart-page-wrapper`}>
                <p className="cart-page-header-text">
                    Your Donation Basket
                </p>
                <div className="cart-page-content-container">
                    <div className={`cart-page-content `}>
                        <div className="cart-page-header-container">
                            <div className="cart-header-wrapper" >
                                <div style={{width:"50%"}}>
                                    <p className="cart-page-header-title">
                                        Recipient Organization
                                    </p>
                                </div>
                                <div style={{width:"35%"}}>
                                    <p className="cart-page-header-title">
                                        Your Details
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
                                    shareEmail={item.shareEmail} index={index}
                                    onEdit={(charityid, basketid)=>handleEdit(charityid, basketid)}
                                    onDelete={(basketid)=>handleDelete(basketid)}/>
                                ))
                             }
                             {(basketList.length < 5) &&
                                emptyList.slice(0,5-basketList.length).map(()=> (
                                    <div className="cart-page-item">
                                        <div className="cart-page-item-price" style={{marginLeft:'auto'}}/>
                                    </div>
                                ))
                             }
                            </>
                        }
                        </div>               
                    </div>
                    <div className="cart-checkout-container">
                        <div className="cart-checkout-header-container">
                            <p className="cart-checkout-header-text">
                                Your Total
                            </p>
                        </div>
                        <div className="cart-checkout-subcontainer">
                            {(loading)?
                                <p className="cart-page-item-title">
                                    {`Processing...`}
                                </p>
                                :
                                <>
                                    <p className="cart-page-item-title">
                                        {`${basketList.length} Items`}
                                    </p>
                                    <div style={{display:'flex', flexDirection:'row', gap:'.65em'}}>
                                        <p className="cart-page-item-checkout-text">
                                            Order Total:
                                        </p>
                                        <p className="cart-page-item-checkout-price">
                                            {loading?'Processing...':`$${total}`}
                                        </p>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="cart-checkout-confirm-container ">        
                            {(basketList.length>0)&&
                            <div className="checkout-cart-page-confirm-container">
                                <span className="cart-confirm-checkout-button " onClick={()=>handleConfirm()}>
                                    <p className="cart-confirm-checkout-text">
                                        {(confirmLoading||loading)?'Loading...':
                                        'Checkout'
                                        }
                                    </p>
                                </span>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
