import React, {useState, useEffect, useRef, useContext} from 'react'
import './Register.scss'
import './Signin.scss'
import axios from "axios";
import UserContext from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import {GoArrowRight} from 'react-icons/go'
import { v4 as uuidv4 } from 'uuid';
import styled, { keyframes } from 'styled-components'
import {Amplify, Auth } from "aws-amplify";
import config from '../aws-exports';
import { set } from 'lodash';
Amplify.configure(config);


export default function Register() {
  const navigate = useNavigate()
  const connection = process.env.REACT_APP_API_URL
  const user = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [resendActive, setResendActive] = useState(true)
  const [userid, setUserid] = useState(uuidv4())
  const [valid, setValid] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const [confirmCode, setConfirmCode] = useState(null)
  const [confirmActive, setConfirmActive] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [showMessage, setShowMessage] = useState(null)
  const [close, setClose] = useState(false)
  const [nameAvailable, setNameAvailable] = useState(true)
  const [emailAvailable, setEmailAvailable] = useState(true)
  const [verified, setVerified] = useState(false)
  const validateEmail = (val) => {
    setEmail(val.trim())
    const regex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setValid(regex.test(val.trim()))
  }
  function handleTest() {
    if (username.length > 0 && firstName.length >0 && lastName.length > 0 && email.length >0 && password.length >0 && valid) {
      validateRegister()
    } else {
      console.log('not valid input')
    }
  }

  const validateRegister = async() => {
        try {
          const url = `${connection}/api/validate`;
          const res = await axios.get(url, {
            params: {
                email:email,
                username:username
            }
          })
          console.log(res.data)
          if (!res.data[0].emailTaken && !res.data[0].usernameTaken) {
            setVerified(true)
            setEmailAvailable(true)
            setNameAvailable(true)
            handleRegister()
          }
          else if (res.data[0].emailTaken && !res.data[0].usernameTaken) {
            setEmailAvailable(false)
            setVerified(false)
          }
          else if (res.data[0].usernameTaken && !res.data[0].emailTaken) {
            setNameAvailable(false)
            setVerified(false)
          }
          else {
            setNameAvailable(false)
            setEmailAvailable(false)
            setVerified(false)
          }
        }
        catch(e) {
          console.log(e)
        }
  }
  const signInAfter = async() => {
    try {
      const response = await Auth.signIn(username, password)
      if (response.attributes.email_verified) {
        navigate('/dashboard')
      }
    }
    catch(e) {
      console.log(e)
    }
  }
  const confirmAccount = async() => {
    setShowMessage(null)
    try {
      if (confirmCode.length === 6 && username) {
        await Auth.confirmSignUp(username, confirmCode)
        setShowMessage("confirmed")

      }
      else {
        console.log("confirmation fields incomplete")
      }
    } catch(e) {
      console.log(e)
      setShowMessage("invalid")
    }
  }
  const handleResend = async() => {
    try {
        const response = await Auth.resendSignUp(username)
        console.log(response)
       // setMessage("resent")
        setShowMessage("resent")
        setResendActive(false)
        setTimeout(()=> {
            setResendActive(true)
        }, 1000)
    } catch(e) {
        console.log(e)
    }
}
  const handleRegister = async() => {
    if (loading) { 
      return
    }
    setLoading(true)
      try {
          const response = await Auth.signUp({
            username:username, 
            password:password,
            attributes: {
              email:email,
            }
          })
          console.log(response.userConfirmed)
          axios.post(`${connection}/api/createuser`, 
          {userid:userid, username:username, firstname:firstName, lastname:lastName, email:email, password:password, confirmed:response.userConfirmed
          })
          .then(()=>{
            //put in context 
            user.setUsername(username)
            user.setEmail(email)
            user.setFirstName(firstName)
            user.setLastName(lastName)
            user.setUserId(userid)
            toggleConfirm()
            //navigate('/dashboard', { state: {userid:userid, username:username, firstName:firstName, lastName:lastName}})
          })
          .catch((e)=>console.log(e)) 
      } catch(e) {
        console.log(e)
      }
      setLoading(false)
  }
  function toggleConfirm() {
    setConfirmActive(!confirmActive)
    setFirstRender(false)
    setTimeout(()=> {
      setClose(!close)
    }, 250)
  }
  useEffect(() => {
    if (showMessage === 'confirmed') {
      signInAfter()
    }
  }, [showMessage])
  return (
    <>
    {(!close)&&
    <div className={`register-container ${firstRender?'':confirmActive?'register-container-inactive':'register-container-active'}`}>
      <div className='register-header-container'>
        <p className='signin-text'>
          Create an account
        </p>
        <p className='signin-subtext'>
          Start your own donor platform today.
        </p>
      </div>
      <div className='register-content'>
        <div className='register-button-container'>
          <span className='register-google-button' onClick={()=>toggleConfirm()}>
            <div className='register-google-content'>
              <div className='google-icon'/>
              <p className='register-google-text'>
                Register with Google
              </p>
            </div>
          </span>
          <span className='register-apple-button'>
            <div className='register-apple-content'>
              <div className='apple-icon'/>
              <p className='register-apple-text'>
                Register with Apple
              </p>
            </div>
          </span>
        </div>
        <div className="register-option-footer">
            <p className="register-option-footer-text">
                or
            </p>
        </div>
        <div className='register-fields-container'> 
            {(!nameAvailable || !emailAvailable )&&
              <div className='taken-info-container'>
                <p className='taken-info-text'>
                  {`This ${!emailAvailable&&!nameAvailable?'email or username':
                  (!emailAvailable)?'email':'username'} has already been registered.`}
                </p>
              </div>
            }
            <div className='register-email-container'>
              <p className='register-email-text'>
                Email
              </p>
              <div className='register-email-input-wrapper'>
                <input className='register-email-input'
                  type={'email'}
                  onChange={(e)=>validateEmail(e.target.value)}
                  value={email}
                  placeholder='Enter your email'/>
              </div>
            </div>
            <div className='register-email-container'>
              <p className='register-email-text'>
                Username
              </p>
              <div className='register-email-input-wrapper'>
                <input className='register-email-input'
                  onChange={(e)=>setUsername(e.target.value)}
                  value={username}
                  placeholder='Enter a username'/>
              </div>
            </div>
            <div className='register-fullname-wrapper'>
              <div className='register-fullname-container'>
                <p className='register-fullname-text'>
                  First Name
                </p>
                <div className='register-email-input-wrapper'>
                  <input className='register-email-input'
                    onChange={(e)=>setFirstName(e.target.value)}
                    value={firstName}
                    placeholder='Enter your first name'/>
                </div>
              </div>
              <div className='register-fullname-container'>
                <p className='register-fullname-text'>
                  Last Name
                </p>
                <div className='register-email-input-wrapper'>
                  <input className='register-email-input'
                    onChange={(e)=>setLastName(e.target.value)}
                    value={lastName}
                    placeholder='Enter your last name'/>
                </div>
              </div>
            </div>
            <div className='register-email-container'>
              <p className='register-email-text'>
                Password
              </p>
              <div className='register-email-input-wrapper'>
                <input className='password-email-input'
                  onChange={(e)=>setPassword(e.target.value)}
                  value={password}
                  type={'password'}
                  placeholder='Enter a password'/>
              </div>
            </div>
            <span className='confirm-register-button' onClick={()=> handleTest()}>
              <p className='confirm-register-text'>
              {(loading)?'Loading...':'Create Account'}
              </p>
              <GoArrowRight className="register-icon"/>
            </span>
        </div>
      </div>
    </div>
  }
          
    {(close)?
    <div className={`confirm-code-container ${firstRender?'':confirmActive?'confirm-code-container-active':'confirm-code-container-inactive'}`}>
      <div className='register-header-container'>
        <p className='signin-text'>
          Confirm your account
        </p>
        <p className='signin-subtext'>
          Check your email for a verification code.
        </p>
      </div>
      <div className='confirm-code-content'>
        <div className='register-fields-container'> 
            <div className='register-email-container'>
              <p className='register-email-text'>
                Enter your 6-Digit Verification Code
              </p>
              <div className='register-confirm-input-wrapper'>
                <input className='register-email-input'
                  type={'number'}
                  onChange={(e)=>setConfirmCode(e.target.value)}
                  value={confirmCode}
                  placeholder='######'/>
              </div>
            </div>
            <div className='register-button-container'>
          <span className={`resend-code-button  ${resendActive?'resend-code-active':'resend-code-inactive'}`} onClick={()=>handleResend()}>
            <div className='register-confirm-account-content'>
              <p className='register-confirm-account-text' style={{color:(resendActive)?'#eee':'#858585'}}>
                Resend Verification
              </p>
            </div>
          </span>
          <span className='confirm-account-code-button' onClick={()=>(loading)?console.log('login loading'):confirmAccount()}>
              <div className='register-confirm-account-content'>
                <p className='register-confirm-account-text' style={{color:'rgba(50, 198, 176, 1)'}}>
                 {(loading)?'Loading...':'Confirm Account'}
                </p>
              </div>
          </span>
        </div>
        </div>
      </div>
      {(showMessage !== null)&&
        <div className='resent-info-container'>
            <p className='resent-info-text' style={{color:(showMessage==='invalid')?'lightcoral':'rgba(211, 178, 95, 1)'}}>
              {`${(showMessage === 'resent')?'A new verification code was sent to your email.':
              (showMessage === 'confirmed')?'Successfully verified your account.':'Invalid verification code.'}`}
            </p>
        </div>
        }
    </div>:null}
  </>     
  )
}
