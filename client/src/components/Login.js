import React, {useState, useEffect, useRef, useContext} from 'react'
import './Login.scss'
import './Signin.scss'
import UserContext from '../contexts/UserContext'
import {GoArrowRight} from 'react-icons/go'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {Amplify, Auth } from "aws-amplify";
import config from '../aws-exports';
Amplify.configure(config);

export default function Login() {
  const user = useContext(UserContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [firstRender, setFirstRender] = useState(true)
  const [confirmCode, setConfirmCode] = useState(null)
  const [confirmActive, setConfirmActive] = useState(false)
  const [resendActive, setResendActive] = useState(true)
  const [showMessage, setShowMessage] = useState(null)
  const [message, setMessage] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [close, setClose] = useState(false)
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
        setShowMessage("resent")
        setResendActive(false)
        setTimeout(()=> {
            setResendActive(true)
        }, 2000)
    } catch(e) {
        console.log(e)
    }
}
const signInAfter = async() => {
  try {
    const response = await Auth.signIn(username, password)
    if (response.attributes.email_verified) {
      navigate('/dashboard', { state: {userid:user.userid, username:username, firstName:user.firstName, lastName:user.lastName}})
    } 
    else {
      console.log("not verified")
    } 
  } catch(e) {
    console.log(e)
  }
}
  const handleLogin = async() => {
    if (loading) { 
      return
    }
    setLoading(true)
    if (username.length > 0 && password.length > 0) {
      try {
        const url = `http://localhost:3000/login/getuser`;
        const res = await axios.get(url, {
          params: {
            username:username
          }
        })
        if (res.data && res.data[0].password === password) {
          user.setUsername(res.data[0].username)
          user.setEmail(res.data[0].email)
          user.setFirstName(res.data[0].firstname)
          user.setLastName(res.data[0].lastname)
          user.setUserId(res.data[0].userid)
          const response = await Auth.signIn(username, password);
          if (response.attributes.email_verified || showMessage === 'confirmed') {
            console.log(response.attributes.email_verified)
            navigate('/dashboard', { state: {userid:res.data[0].userid, username:username, firstName:res.data[0].firstname, lastname:res.data[0].lastname}})
          }
          else {
            toggleConfirm()
          }
        } else {
          console.log("incorrect login credentials")
        }
      } catch(e) {
        console.log(e)
        if (e.message === "User is not confirmed.") {
          toggleConfirm()
        }
      }
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
    <div className={`login-container ${firstRender?'':confirmActive?'register-container-inactive':'register-container-active'}`}>
      <div className='register-header-container'>
        <p className='signin-text'>
          Login to your account
        </p>
        <p className='signin-subtext'>
          Welcome to your very own donor platform.
        </p>
      </div>
      <div className='login-content'>
        <div className='register-button-container'>
          <span className='register-google-button'>
            <div className='login-google-content'>
              <div className='google-login-icon'/>
              <p className='login-google-text'>
                Login with Google
              </p>
            </div>
          </span>
          <span className='register-apple-button'>
            <div className='login-apple-content'>
              <div className='apple-login-icon'/>
              <p className='login-apple-text'>
                Login with Apple
              </p>
            </div>
          </span>
        </div>

        <div className="register-option-footer">
            <p className="register-option-footer-text">
                or
            </p>
        </div>
        <div className='login-fields-container'> 
            <div className='login-email-container'>
              <p className='login-email-text'>
                Username / Email 
              </p>
              <div className='register-email-input-wrapper'>
                <input className='register-email-input'
                  onChange={(e)=>setUsername(e.target.value)}
                  value={username}
                  placeholder='Enter your email or username...'/>
              </div>
            </div>
            <div className='login-email-container'>
              <p className='login-email-text'>
                Password
              </p>
              <div className='register-email-input-wrapper'>
                <input className='password-email-input'
                  onChange={(e)=>setPassword(e.target.value)}
                  value={password}
                  type={'password'}
                  placeholder='Enter your password...'/>
              </div>
            </div>
            <span className='confirm-login-button' onClick={()=>(loading)?console.log("loading login"):handleLogin()}>
              <p className='confirm-register-text'>
                {(loading)?'Loading...':'Login'}
              </p>
              <GoArrowRight className="register-icon"/>
            </span>
        </div>
      </div>
  </div>
  }
  {(close)&&
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
            <span className={`resend-code-button ${resendActive?'resend-code-active':'resend-code-inactive'}`} onClick={()=>handleResend()}>
              <div className='register-confirm-account-content'>
                <p className='register-confirm-account-text' style={{color:(resendActive)?'#eee':'#656565'}}>
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
        {(showMessage !== null)&&
        <div className='resent-info-container'>
            <p className='resent-info-text' style={{color:(showMessage==='invalid')?'lightcoral':'rgba(211, 178, 95, 1)'}}>
              {`${(showMessage === 'resent')?'A new verification code was sent to your email.':
              (showMessage === 'confirmed')?'Successfully verified your account.':'Invalid verification code.'}`}
            </p>
        </div>
        }
      </div>



    </div>
    }
  </>
  )
}
