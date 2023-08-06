import React, {useState, useEffect, useRef, useContext} from 'react'
import {GoArrowRight} from 'react-icons/go'
import UserContext from '../contexts/UserContext'
import './Payment.scss'
import { debounce } from 'lodash'

export default function Paypal({groupid, names, amount, type}) {
  const user = useContext(UserContext)
  const [isConfigured, setIsConfigured] = useState(false)
  const [key, setKey] = useState(Math.random());
  const paypal = useRef()
  const payButton = useRef()
  const prevAmount = useRef(amount);
  function handleTest() {
    console.log(groupid!==undefined?groupid:'id not found')
    console.log(names!==undefined&&names.length > 0?names:'name not found')
    console.log(amount!==undefined?amount:'amount not found')
  }
  
  const debouncedUpdate = debounce(amount => {
    if (groupid && names && names.length > 0 && amount && amount > 0) {
      if (payButton.current && prevAmount.current !== amount && !isConfigured) {
        payButton.current.close();
        setIsConfigured(true);
      }
      payButton.current = window.paypal.Buttons({
        fundingSource: (type==='paypal')?window.paypal.FUNDING.PAYPAL:
        (type==='venmo')?window.paypal.FUNDING.VENMO:window.paypal.FUNDING.CARD,
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: `Donation to ${names[0]} ${names.length>1?` + ${names.length} others`:''}`,
                amount: {
                  currency_code: "USD",
                  value: amount
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          console.log(data.orderId)
        },
        onError: (err) => {
          console.log(err);
        }
      });
      payButton.current.render(paypal.current);
      setIsConfigured(false);
    }
  }, 0); // 500ms delay
  useEffect(()=> {
    debouncedUpdate(amount)
    return () => {
        debouncedUpdate.cancel()
    }
  }, [amount, names, groupid])

  useEffect(() => {
    if (isConfigured) {
        prevAmount.current = amount;
    }
  }, [amount, isConfigured]);

  return (
    <div>
        {(groupid && names && names.length > 0 && amount && amount > 0)?
       <div ref={paypal} key={key} className={`${type}-button`}/>:
       <div className="payment-confirm-container">
          <span className="payment-confirm-button" onClick={()=>handleTest()}>
              <p className={`${(amount && amount > 0)?'payment-confirm-text':'inactive-confirm-text '}`}>
                  Debug
              </p>
              {
                  (amount && amount > 0)?
                  <GoArrowRight className="arrow-icon"/>:
                  null
              }     
          </span>
       </div>
    }
    </div>
  )
}
