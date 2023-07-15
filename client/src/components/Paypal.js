import React, {useState, useEffect, useRef} from 'react'
import {GoArrowRight} from 'react-icons/go'
import './Payment.scss'
import { debounce } from 'lodash'

export default function Paypal({charityid, name, amount, type}) {
  const [isConfigured, setIsConfigured] = useState(false)
  const [key, setKey] = useState(Math.random());
  const paypal = useRef()
  const payButton = useRef()
  const prevAmount = useRef(amount);
  function handleTest() {
    console.log(charityid!==undefined?charityid:'id not found')
    console.log(name!==undefined?name:'name not found')
    console.log(amount!==undefined?amount:'amount not found')
  }
  
  const debouncedUpdate = debounce(amount => {
    if (charityid && name && amount && amount > 0) {
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
                description: `Donation to ${name}`,
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
  }, [amount, name, charityid])

  useEffect(() => {
    if (isConfigured) {
        prevAmount.current = amount;
    }
  }, [amount, isConfigured]);

  return (
    <div>
        {(charityid && name && amount && amount > 0)?
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
