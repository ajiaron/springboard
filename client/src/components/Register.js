import React, {useState, useEffect, useRef} from 'react'
import './Register.scss'
import './Signin.scss'
import {GoArrowRight} from 'react-icons/go'
export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  return (
    <div className='register-container'>
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
          <span className='register-google-button'>
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
            <div className='register-email-container'>
              <p className='register-email-text'>
                Email
              </p>
              <div className='register-email-input-wrapper'>
                <input className='register-email-input'
                  onChange={(e)=>setEmail(e.target.value)}
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
                    onChange={(e)=>setUsername(e.target.value)}
                    value={username}
                    placeholder='Enter your first name'/>
                </div>
              </div>

              <div className='register-fullname-container'>
                <p className='register-fullname-text'>
                  Last Name
                </p>
                <div className='register-email-input-wrapper'>
                  <input className='register-email-input'
                    onChange={(e)=>setUsername(e.target.value)}
                    value={username}
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
                  type={password}
                  placeholder='Enter a password'/>
              </div>
            </div>
            <div className='confirm-register-button'>
              <p className='confirm-register-text'>
                Create Account
              </p>
              <GoArrowRight className="register-icon"/>
            </div>
        </div>
      </div>
    </div>
  )
}
