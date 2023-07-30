import React, {useState, useEffect, useRef} from 'react'
import './Login.scss'
import './Signin.scss'
import {GoArrowRight} from 'react-icons/go'
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  return (
    <div className='login-container'>
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
                type={password}
                placeholder='Enter your password...'/>
            </div>
          </div>

          <div className='confirm-login-button'>
            <p className='confirm-register-text'>
              Login
            </p>
            
            <GoArrowRight className="register-icon"/>

          </div>

      </div>
    </div>
   


  </div>
  )
}
